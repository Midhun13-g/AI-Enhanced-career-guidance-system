import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import {
  Sparkles,
  User,
  Briefcase,
  Target,
  BookOpen,
  Map,
  Upload,
  ArrowLeft,
  RefreshCw,
  FileText,
  Loader2,
  Code,
  Copy,
  Check,
  X,
} from 'lucide-react';

import ResumeOverview from '../../components/career/ResumeOverview';
import SkillsAnalysis from '../../components/career/SkillsAnalysis';
import JobMatches from '../../components/career/JobMatches';
import CareerAnalysis from '../../components/career/CareerAnalysis';
import SkillGapAnalysis from '../../components/career/SkillGapAnalysis';
import LearningPriorities from '../../components/career/LearningPriorities';
import CourseRecommendations from '../../components/career/CourseRecommendations';
import RecommendationExplanation from '../../components/career/RecommendationExplanation';
import CareerReadiness from '../../components/career/CareerReadiness';
import CareerRoadmap from '../../components/career/CareerRoadmap';
import AIAnalysisLoading from '../../components/career/AIAnalysisLoading';
import ErrorState from '../../components/career/ErrorState';
import { analyzeResumeAI, getAiAnalysis } from '../../services/resumeService';

import { normalizeAnalysisResponse } from '../../utils/normalizeAnalysis';

function unwrapPayload(raw) {
  if (!raw) return null;
  // If wrapped in backend envelope { success: true, data: { ... } }
  if (raw.data && typeof raw.data === 'object' && (raw.data.resume || raw.data.job_matches || raw.data.career_analysis)) {
    return raw.data;
  }
  return raw;
}

export default function AICareerGuidancePage() {
  const location = useLocation();
  const navigate = useNavigate();

  const [rawAnalysisData, setRawAnalysisData] = useState(() => unwrapPayload(location.state?.analysisData));
  const [filename, setFilename] = useState(location.state?.filename || 'Uploaded Resume');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [showJsonModal, setShowJsonModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const normalized = normalizeAnalysisResponse(rawAnalysisData);

  useEffect(() => {
    if (rawAnalysisData) {
      console.log("RAW ANALYSIS RESPONSE", rawAnalysisData);
      console.log("NORMALIZED ANALYSIS", normalized);
      if (normalized) {
        console.log("JOB MATCHES", normalized.jobMatches);
        console.log("SKILLS", normalized.resume.skills);
        console.log("SKILL GAPS", normalized.skillGap);
        console.log("COURSES", normalized.courses);
        console.log("ROADMAP", normalized.roadmap);
      }
    }
  }, [rawAnalysisData]);

  // If navigated with an analysisId, fetch analysis from backend
  useEffect(() => {
    const analysisId = location.state?.analysisId;
    if (analysisId && !rawAnalysisData) {
      setLoading(true);
      setError(null);
      getAiAnalysis(analysisId)
        .then((res) => {
          const payload = unwrapPayload(res.data);
          setRawAnalysisData(payload);
        })
        .catch((err) => {
          console.error('Failed to load analysis:', err);
          setError('Failed to load analysis record. Please check if the backend service is running.');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [location.state?.analysisId]);

  // Handle re-uploading file directly on page
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError(null);
    setFilename(file.name);

    try {
      const response = await analyzeResumeAI(file);
      const payload = unwrapPayload(response.data);
      setRawAnalysisData(payload);
    } catch (err) {
      console.error('AI Analysis Error:', err);
      const msg = err.response?.data?.message || 'Failed to analyze resume. Please ensure the backend and AI service are running.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 py-10 px-4">
        <AIAnalysisLoading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 py-10 px-4">
        <ErrorState error={error} onRetry={() => setError(null)} />
      </div>
    );
  }

  if (!normalized) {
    return (
      <div className="min-h-screen bg-slate-50 py-12 px-4">
        <div className="mx-auto max-w-2xl text-center space-y-6">
          <div className="rounded-3xl border border-blue-100 bg-white p-8 sm:p-12 shadow-xl">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 mb-4">
              <Sparkles size={32} />
            </div>
            <h1 className="text-2xl font-black text-slate-900">AI Career Guidance Dashboard</h1>
            <p className="text-sm text-slate-500 max-w-md mx-auto mt-2">
              Upload a resume PDF or DOCX to unlock semantic job matching, skill gap analysis, SHAP-explained course recommendations, and a personalized career roadmap.
            </p>

            <div className="mt-8 flex justify-center">
              <label className="cursor-pointer inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-200 hover:bg-blue-700 transition">
                <Upload size={18} />
                <span>Upload Resume PDF / DOCX</span>
                <input
                  type="file"
                  accept=".pdf,.docx,.doc"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </label>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { resume, jobMatches, career, skillGap, courses, explanations, roadmap, executionTime } = normalized;

  const tabs = [
    { id: 'overview', label: 'Resume & Skills', icon: User },
    { id: 'jobs', label: 'Job Matches & Fit', icon: Briefcase, count: jobMatches.length },
    { id: 'skills', label: 'Skill Gaps & Priorities', icon: Target, count: skillGap.gaps.length },
    { id: 'courses', label: 'Courses & Explainability', icon: BookOpen, count: courses.length },
    { id: 'roadmap', label: 'Career Roadmap', icon: Map, count: roadmap.length },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div>
            <div className="flex items-center gap-2">
              <Link to="/resume" className="text-slate-400 hover:text-slate-600 transition">
                <ArrowLeft size={20} />
              </Link>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1 text-xs font-black text-blue-800">
                <Sparkles size={12} /> AI CAREER GUIDANCE PIPELINE
              </span>
            </div>
            <h1 className="mt-2 text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-2.5">
              Career Guidance Report
            </h1>
            <p className="text-sm font-medium text-slate-500 mt-1 flex items-center gap-2">
              <FileText size={14} className="text-blue-500" />
              Source File: <strong className="text-slate-700">{filename}</strong>
              {executionTime && (
                <span className="text-xs text-slate-400 ml-2">
                  (Processed in {Number(executionTime).toFixed(2)}s)
                </span>
              )}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowJsonModal(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-800 px-4 py-2.5 text-xs font-bold text-white hover:bg-slate-900 transition shadow-sm"
            >
              <Code size={14} className="text-purple-400" />
              <span>View Raw JSON</span>
            </button>
            <label className="cursor-pointer inline-flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-200 transition">
              <RefreshCw size={14} />
              <span>Analyze Another Resume</span>
              <input
                type="file"
                accept=".pdf,.docx,.doc"
                className="hidden"
                onChange={handleFileUpload}
              />
            </label>
            <Link
              to="/resume/history"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-blue-700 shadow-md shadow-blue-200 transition"
            >
              <span>View History</span>
            </Link>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex overflow-x-auto gap-2 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 rounded-xl px-5 py-3 text-xs sm:text-sm font-bold transition whitespace-nowrap ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
                {typeof tab.count === 'number' && tab.count > 0 && (
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] font-black ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Active Tab Content */}
        <div className="transition-all duration-200">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <ResumeOverview resume={resume} />
              <SkillsAnalysis resume={resume} careerAnalysis={career} />
              <CareerAnalysis career={career} />
            </div>
          )}

          {activeTab === 'jobs' && (
            <div className="space-y-6">
              <CareerReadiness selectedRole={career.selectedRole} />
              <JobMatches jobMatches={jobMatches} />
            </div>
          )}

          {activeTab === 'skills' && (
            <div className="space-y-6">
              <SkillGapAnalysis skillGaps={skillGap.gaps} />
              <LearningPriorities learningPriorities={skillGap.priorities} />
            </div>
          )}

          {activeTab === 'courses' && (
            <div className="space-y-6">
              <CourseRecommendations courseRecommendations={courses} />
              <RecommendationExplanation explanations={explanations} />
            </div>
          )}

          {activeTab === 'roadmap' && (
            <div className="space-y-6">
              <CareerRoadmap roadmap={roadmap} />
            </div>
          )}
        </div>

        {/* Raw JSON Viewer Modal */}
        {showJsonModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 p-4 backdrop-blur-sm">
            <div className="w-full max-w-4xl max-h-[85vh] rounded-3xl bg-slate-900 text-slate-100 shadow-2xl flex flex-col border border-slate-800">
              <div className="p-5 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Code className="text-purple-400" size={20} />
                  <h3 className="text-lg font-black text-white">Full Analysis Response JSON</h3>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(JSON.stringify(rawAnalysisData, null, 2));
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-purple-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-purple-700 transition"
                  >
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                    <span>{copied ? 'Copied!' : 'Copy JSON'}</span>
                  </button>
                  <button
                    onClick={() => setShowJsonModal(false)}
                    className="rounded-xl bg-slate-800 p-1.5 text-slate-400 hover:text-white transition"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
              <div className="p-6 overflow-y-auto font-mono text-xs text-emerald-400 bg-slate-950/80 rounded-b-3xl">
                <pre>{JSON.stringify(rawAnalysisData, null, 2)}</pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

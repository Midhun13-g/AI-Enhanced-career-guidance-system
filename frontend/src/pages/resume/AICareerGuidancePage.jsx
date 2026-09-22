import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiFileText,
  FiUploadCloud,
  FiZap,
  FiBriefcase,
  FiTarget,
  FiBookOpen,
  FiCompass,
  FiArrowLeft,
  FiRefreshCw,
  FiCode,
  FiCopy,
  FiCheck,
  FiX,
  FiShield,
  FiClock,
  FiUser,
  FiActivity,
} from 'react-icons/fi';

import AppLayout from '../../components/layout/AppLayout';
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
import PipelineInsights from '../../components/career/PipelineInsights';
import CareerWhatIf from '../../components/career/CareerWhatIf';
import InterviewPrep from '../../components/career/InterviewPrep';
import AICounselorPanel from '../../components/career/AICounselorPanel';
import RawModelOutput from '../../components/career/RawModelOutput';
import AIAnalysisLoading from '../../components/career/AIAnalysisLoading';
import ErrorState from '../../components/career/ErrorState';
import { analyzeResumeAI, getAiAnalysis, getAiAnalysisHistory, selectAiCareerRole, updateAiRoadmapStatus } from
'../../services/resumeService';
import { normalizeAnalysisResponse } from '../../utils/normalizeAnalysis';

function unwrapPayload(raw) {
  if (!raw) return null;
  if (raw.data && typeof raw.data === 'object' && (raw.data.resume || raw.data.job_matches || raw.data.career_analysis)) {
    // Keep the persistent analysis identifier while unwrapping the API envelope.
    // It is needed immediately after upload for role and roadmap-progress updates.
    return { ...raw.data, analysisId: raw.analysisId ?? raw.analysis_id ?? raw.data.analysisId };
  }
  return raw;
}

export default function AICareerGuidancePage() {
  const location = useLocation();
  const navigate = useNavigate();

  const [rawAnalysisData, setRawAnalysisData] = useState(() => unwrapPayload(location.state?.analysisData));
  const [filename, setFilename] = useState(location.state?.filename || 'Uploaded Resume');
  const [isLatest, setIsLatest] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [showJsonModal, setShowJsonModal] = useState(false);
  const [jsonView, setJsonView] = useState('raw');
  const [copied, setCopied] = useState(false);
  const [savingRole, setSavingRole] = useState(false);
  const [savingTaskKey, setSavingTaskKey] = useState(null);

  const normalized = normalizeAnalysisResponse(rawAnalysisData);

  useEffect(() => {
    const analysisId = location.state?.analysisId;
    if (analysisId && !rawAnalysisData) {
      setLoading(true);
      setError(null);
      getAiAnalysis(analysisId)
        .then((res) => {
          const analysisResult = res.data;
          // Check if analysis failed
          if (analysisResult?.status === 'FAILED' || analysisResult?.success === false) {
            const errorMsg = analysisResult?.data?.rawAiResponse 
              || analysisResult?.message 
              || 'AI analysis failed. Please try again.';
            setError(errorMsg);
            setRawAnalysisData(null);
          } else {
            const payload = unwrapPayload(analysisResult);
            setRawAnalysisData(payload);
          }
        })
        .catch((err) => {
          console.error('Failed to load analysis:', err);
          setError('Failed to load analysis record. Please verify that the backend AI service is online.');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [location.state?.analysisId]);

  // No explicit record passed (e.g. opened from the sidebar): always show
  // the LATEST completed analysis instead of a stale or empty view.
  useEffect(() => {
    if (location.state?.analysisId || location.state?.analysisData || rawAnalysisData) return;
    let cancelled = false;
    setLoading(true);
    getAiAnalysisHistory()
      .then(({ data }) => {
        const list = Array.isArray(data) ? data : [];
        const latest = list.find((a) => a.status === 'COMPLETED' && (a.analysisId || a.id));
        if (!latest) {
          if (!cancelled) setLoading(false);
          return null;
        }
        if (latest.originalFileName) setFilename(latest.originalFileName);
        setIsLatest(true);
        return getAiAnalysis(latest.analysisId || latest.id);
      })
      .then((res) => {
        if (!cancelled && res) setRawAnalysisData(unwrapPayload(res.data));
      })
      .catch((err) => {
        console.error('Failed to load latest analysis:', err);
        if (!cancelled) setError('Failed to load the latest analysis. Please verify that the backend AI service is online.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [location.state, rawAnalysisData]);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError(null);
    setFilename(file.name);
    setIsLatest(false);

    try {
      const response = await analyzeResumeAI(file);
      const payload = unwrapPayload(response.data);
      setRawAnalysisData(payload);
    } catch (err) {
      console.error('AI Analysis Error:', err);
      const responseData = err.response?.data;
      let msg = responseData?.message || 'Failed to analyze resume. Please check service connectivity.';
      const errorCode = responseData?.errorCode;
      const retryAfter = responseData?.retryAfter;
      
      // Enhance message for quota exceeded with retry info
      if (errorCode === 'AI_QUOTA_EXCEEDED' && retryAfter) {
        msg = `AI analysis is temporarily unavailable because the AI processing quota has been reached. Please try again in ${retryAfter}.`;
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="py-16 max-w-4xl mx-auto">
          <AIAnalysisLoading />
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout>
        <div className="py-16 max-w-4xl mx-auto">
          <ErrorState error={error} onRetry={() => setError(null)} />
        </div>
      </AppLayout>
    );
  }

  if (!normalized) {
    return (
      <AppLayout>
        <div className="max-w-2xl mx-auto py-16 antialiased selection:bg-[#0038FF] selection:text-white">
          <div className="rounded-2xl border border-neutral-200/90 bg-white p-8 sm:p-12 shadow-xs text-center space-y-6">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-blue-50 border border-blue-100 text-[#0038FF]">
              <FiZap size={24} />
            </div>
            
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-blue-50 border border-blue-100 text-[#0038FF] text-[10px] font-bold font-mono uppercase tracking-wider">
                <FiShield size={10} /> Module 03 Pipeline
              </div>
              <h1 className="text-2xl font-black tracking-tight text-neutral-950">
                AI Career Guidance Engine
              </h1>
              <p className="text-xs sm:text-sm text-neutral-500 max-w-md mx-auto leading-relaxed">
                Upload a candidate resume (PDF or DOCX) to trigger semantic job matching, skill gap discovery, SHAP explainability, and multi-phase progression roadmaps.
              </p>
            </div>

            <div className="pt-2 flex justify-center">
              <label className="cursor-pointer inline-flex items-center gap-2 rounded-lg bg-[#0038FF] hover:bg-blue-700 active:scale-[0.99] px-5 py-2.5 text-xs font-bold font-mono text-white transition-all shadow-md shadow-blue-500/20">
                <FiUploadCloud size={15} />
                <span>Upload Resume Document</span>
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
      </AppLayout>
    );
  }

  const { resume, jobMatches, career, skillGap, courses, explanations, roadmap, executionTime } = normalized;
  const insights = {
    actionPlan: normalized.actionPlan,
    skillCoverage: normalized.skillCoverage,
    dispositions: normalized.dispositions,
    statistics: normalized.statistics,
    validation: normalized.validation,
    market: normalized.market,
    learningTargets: normalized.learningTargets,
  };

  const analysisId = location.state?.analysisId || rawAnalysisData?.analysisId || rawAnalysisData?.analysis_id;
  const applyUpdatedAnalysis = (response) => setRawAnalysisData(unwrapPayload(response.data));
  const handleRoleSelection = async (roleId) => {
    if (!analysisId) {
      setError('Save an analysis before selecting a career role.');
      return;
    }
    setSavingRole(true);
    try {
      applyUpdatedAnalysis(await selectAiCareerRole(analysisId, roleId));
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to save the selected career role.');
    } finally {
      setSavingRole(false);
    }
  };
  const handleRoadmapStatus = async (taskKey, status) => {
    if (!analysisId) {
      setError('Save an analysis before updating roadmap progress.');
      return;
    }
    setSavingTaskKey(taskKey);
    try {
      applyUpdatedAnalysis(await updateAiRoadmapStatus(analysisId, taskKey, status));
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to save roadmap progress.');
    } finally {
      setSavingTaskKey(null);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Resume & Skills', icon: FiUser },
    { id: 'jobs', label: 'Job Matches & Fit', icon: FiBriefcase, count: jobMatches?.length || 0 },
    { id: 'skills', label: 'Skill Gaps & Priorities', icon: FiTarget, count: skillGap?.gaps?.length || 0 },
    { id: 'courses', label: 'Courses & Explainability', icon: FiBookOpen, count: courses?.length || 0 },
    { id: 'roadmap', label: 'Career Roadmap', icon: FiCompass, count: roadmap?.length || 0 },
    { id: 'insights', label: 'Insights & Market', icon: FiActivity },
    { id: 'compare', label: 'What-If Compare', icon: FiZap },
    { id: 'prepare', label: 'Interview & Projects', icon: FiCheck },
    { id: 'raw', label: 'Raw Model JSON', icon: FiCode },
  ];

  const fullRawText = (() => {
    try {
      const rawStr = rawAnalysisData?.raw_ai_response ?? rawAnalysisData?.rawAiResponse;
      if (typeof rawStr === 'string' && rawStr.trim()) return JSON.stringify(JSON.parse(rawStr), null, 2);
    } catch { /* fall through to mapped payload */ }
    return JSON.stringify(rawAnalysisData, null, 2);
  })();

  return (
    <AppLayout>
      <div className="space-y-6 max-w-[1400px] mx-auto pb-12 antialiased selection:bg-[#0038FF] selection:text-white">
        
        {/* ── Top Header Ribbon ── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-neutral-200/90 shadow-xs">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <Link to="/resume" className="text-neutral-400 hover:text-neutral-800 transition-colors">
                <FiArrowLeft size={16} />
              </Link>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-50 border border-blue-100 text-[#0038FF] text-[9px] font-bold font-mono uppercase tracking-wider">
                <FiShield size={9} /> Evaluated & Synthesized
              </span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-neutral-950">
              AI Career Guidance Report
            </h1>
            
            <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-neutral-500 pt-0.5">
              <span className="inline-flex items-center gap-1.5 text-neutral-800 font-bold">
                <FiFileText size={13} className="text-[#0038FF]" />
                {filename}
              </span>
              {isLatest && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200/80 text-emerald-700 text-[9px] font-bold font-mono uppercase tracking-wider">
                  Latest analysis
                </span>
              )}
              {executionTime && (
                <span className="inline-flex items-center gap-1 text-neutral-400">
                  <FiClock size={12} />
                  {Number(executionTime).toFixed(2)}s inference
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 pt-1 md:pt-0">
            <button
              onClick={() => setShowJsonModal(true)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-800 px-3.5 py-2 text-xs font-mono font-bold transition-all shadow-2xs"
            >
              <FiCode size={13} className="text-[#0038FF]" />
              <span>Inspect JSON</span>
            </button>
            
            <label className="cursor-pointer inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-800 px-3.5 py-2 text-xs font-mono font-bold transition-all shadow-2xs">
              <FiRefreshCw size={13} />
              <span>Re-Analyze</span>
              <input
                type="file"
                accept=".pdf,.docx,.doc"
                className="hidden"
                onChange={handleFileUpload}
              />
            </label>

            <Link
              to="/resume/history"
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#0038FF] hover:bg-blue-700 active:scale-[0.99] text-white px-4 py-2 text-xs font-mono font-bold transition-all shadow-md shadow-blue-500/20"
            >
              <span>Ledger History</span>
            </Link>
          </div>
        </div>

        {/* ── Segmented Navigation Strip ── */}
        <div className="flex overflow-x-auto gap-1.5 bg-white p-1.5 rounded-xl border border-neutral-200/90 shadow-xs scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-xs font-mono font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-neutral-950 text-white shadow-2xs'
                    : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100'
                }`}
              >
                <Icon size={14} className={isActive ? 'text-[#0038FF]' : 'text-neutral-400'} />
                <span>{tab.label}</span>
                {typeof tab.count === 'number' && tab.count > 0 && (
                  <span
                    className={`rounded px-1.5 py-0.2 text-[10px] font-mono font-bold ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-neutral-100 text-neutral-600'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ── Dynamic Tab Viewport ── */}
        <div className="transition-all duration-150">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <ResumeOverview resume={resume} />
              <SkillsAnalysis resume={resume} careerAnalysis={career} matchedSkills={jobMatches?.[0]?.matchedSkills} evidenceNote="✓ role = in resume and matched to your top role" />
              <CareerAnalysis career={career} />
            </div>
          )}

          {activeTab === 'jobs' && (
            <div className="space-y-6">
              <CareerReadiness selectedRole={career.selectedRole} skillGaps={skillGap.gaps} />
              <JobMatches jobMatches={jobMatches} selectedRoleId={career.selectedRole?.id} onSelectRole={handleRoleSelection} selectingRole={savingRole} />
            </div>
          )}

          {activeTab === 'skills' && (
            <div className="space-y-6">
              <SkillGapAnalysis skillGaps={skillGap.gaps} coverage={skillGap.coverage} summary={skillGap.summary} />
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
              <CareerRoadmap roadmap={roadmap} onStatusChange={handleRoadmapStatus} savingTaskKey={savingTaskKey} />
            </div>
          )}

          {activeTab === 'insights' && (
            <div className="space-y-6">
              <PipelineInsights
                actionPlan={insights.actionPlan}
                skillCoverage={insights.skillCoverage}
                dispositions={insights.dispositions}
                statistics={insights.statistics}
                validation={insights.validation}
                market={insights.market}
                learningTargets={insights.learningTargets}
              />
              <AICounselorPanel normalized={normalized} />
            </div>
          )}

          {activeTab === 'compare' && (
            <div className="space-y-6">
              <CareerWhatIf jobMatches={jobMatches} courses={courses} />
            </div>
          )}

          {activeTab === 'prepare' && (
            <div className="space-y-6">
              <InterviewPrep skillGap={skillGap} courses={courses} resume={resume} roleTitle={career.selectedRole?.title} />
            </div>
          )}

          {activeTab === 'raw' && (
            <div className="space-y-6">
              <RawModelOutput rawData={normalized.raw} />
            </div>
          )}
        </div>

        {/* ── Raw JSON Inspection Modal ── */}
        <AnimatePresence>
          {showJsonModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/50 p-4 backdrop-blur-xs">
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="w-full max-w-4xl max-h-[85vh] rounded-2xl bg-neutral-950 text-neutral-100 shadow-2xl flex flex-col border border-neutral-800 overflow-hidden"
              >
                <div className="p-4 sm:p-5 border-b border-neutral-800 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <FiCode className="text-[#0038FF]" size={16} />
                    <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                      Full Raw Model Response
                    </h3>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <div className="flex rounded-lg overflow-hidden border border-neutral-700 text-[11px] font-mono font-bold">
                      <button
                        onClick={() => setJsonView('raw')}
                        className={`px-3 py-1.5 transition-all ${jsonView === 'raw' ? 'bg-white text-neutral-950' : 'bg-neutral-800 text-neutral-300 hover:text-white'}`}
                      >
                        Raw model JSON
                      </button>
                      <button
                        onClick={() => setJsonView('mapped')}
                        className={`px-3 py-1.5 transition-all ${jsonView === 'mapped' ? 'bg-white text-neutral-950' : 'bg-neutral-800 text-neutral-300 hover:text-white'}`}
                      >
                        Mapped response
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(jsonView === 'raw' ? fullRawText : JSON.stringify(rawAnalysisData, null, 2));
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 px-3 py-1.5 text-xs font-mono font-bold text-white transition-all border border-neutral-700"
                    >
                      {copied ? <FiCheck size={12} className="text-emerald-400" /> : <FiCopy size={12} />}
                      <span>{copied ? 'Copied' : 'Copy JSON'}</span>
                    </button>
                    <button
                      onClick={() => setShowJsonModal(false)}
                      className="rounded-lg bg-neutral-800 p-1.5 text-neutral-400 hover:text-white transition-colors"
                      aria-label="Close modal"
                    >
                      <FiX size={15} />
                    </button>
                  </div>
                </div>

                <div className="p-6 overflow-y-auto font-mono text-xs text-emerald-400 bg-black/80 flex-1 leading-relaxed">
                  <pre>{jsonView === 'raw' ? fullRawText : JSON.stringify(rawAnalysisData, null, 2)}</pre>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </AppLayout>
  );
}

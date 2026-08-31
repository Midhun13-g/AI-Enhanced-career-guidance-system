import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Award, BarChart3, BookOpen, CheckCircle2, FileText, History, Map, Sparkles, Upload, Loader2, Compass } from 'lucide-react';
import AppLayout from '../../components/layout/AppLayout';
import { getAiAnalysisHistory } from '../../services/resumeService';

function StatCard({ icon: Icon, label, value, color, bg, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
      className="card-hover p-5"
    >
      <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${bg}`}>
        <Icon size={20} className={color} />
      </div>
      <p className="mt-4 text-2xl font-black text-slate-900">{value}</p>
      <p className="mt-1 text-sm font-medium text-slate-500">{label}</p>
    </motion.div>
  );
}

const STATUS_COLOR = {
  COMPLETED: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  PROCESSING: 'bg-amber-50 text-amber-700 border border-amber-200',
  PENDING: 'bg-blue-50 text-blue-700 border border-blue-200',
  FAILED: 'bg-red-50 text-red-700 border border-red-200',
};

export default function ResumeDashboard() {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const response = await getAiAnalysisHistory();
        const list = Array.isArray(response.data) ? response.data : [];
        setHistory(list);
      } catch (err) {
        console.error('Failed to load recent analysis data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const totalAnalyses = history.length;
  const latestAnalysis = history.length > 0 ? history[0] : null;
  const totalSkills = latestAnalysis?.skillCount || 0;
  const suggestedRole = latestAnalysis?.topJobRole || (totalAnalyses > 0 ? 'Not available' : 'Not analyzed');

  const stats = [
    { icon: CheckCircle2, label: 'Resume Status', value: totalAnalyses > 0 ? 'Analyzed ✓' : 'Pending Upload', color: 'text-emerald-600', bg: 'bg-emerald-50', delay: 0.05 },
    { icon: Compass, label: 'Top Suggested Role', value: suggestedRole, color: 'text-blue-600', bg: 'bg-blue-50', delay: 0.1 },
    { icon: Sparkles, label: 'Skills Detected', value: totalSkills.toString(), color: 'text-indigo-600', bg: 'bg-indigo-50', delay: 0.15 },
    { icon: History, label: 'Total Analyses', value: totalAnalyses.toString(), color: 'text-teal-600', bg: 'bg-teal-50', delay: 0.2 },
  ];

  return (
    <AppLayout>
      <div className="mx-auto max-w-6xl space-y-7">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-600 p-7 text-white shadow-xl shadow-blue-200 sm:p-10"
        >
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="max-w-xl">
              <p className="text-sm font-bold uppercase tracking-wider text-blue-200">Module 3 · AI Resume Intelligence</p>
              <h1 className="mt-2 text-3xl font-black sm:text-4xl">AI Career Guidance Hub 🚀</h1>
              <div className="mt-4 flex items-start gap-3 rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
                <Sparkles size={18} className="mt-0.5 shrink-0 text-blue-200" />
                <p className="text-sm leading-6 text-blue-50">
                  Upload your resume to trigger the Hugging Face AI pipeline for semantic job matching, skill gap discovery, SHAP explainability, and multi-phase roadmap generation.
                </p>
              </div>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link to="/resume/upload" className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-blue-700 hover:bg-blue-50 shadow-md">
                  <Upload size={16} /> Analyze Resume
                </Link>
                <Link to="/resume/ai-guidance" className="inline-flex items-center gap-2 rounded-xl bg-indigo-900/80 backdrop-blur-md border border-indigo-400/30 px-5 py-2.5 text-sm font-bold text-white hover:bg-indigo-900">
                  <Sparkles size={16} className="text-amber-300" /> AI Career Dashboard
                </Link>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center rounded-2xl bg-white/10 p-6 backdrop-blur-md text-center min-w-[180px]">
              <span className="text-3xl font-black text-white">{totalAnalyses}</span>
              <span className="text-xs font-bold text-blue-100 uppercase tracking-wider mt-1">Saved Analyses</span>
            </div>
          </div>
        </motion.div>

        {/* Dynamic Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => <StatCard key={s.label} {...s} />)}
        </div>

        {/* Recent AI Analysis */}
        <div className="card overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-6 py-4">
            <h2 className="font-black text-slate-900">Recent AI Analyses</h2>
            <Link to="/resume/history" className="flex items-center gap-1 text-sm font-bold text-blue-600 hover:text-blue-700">
              View all history <ArrowRight size={15} />
            </Link>
          </div>

          {loading ? (
            <div className="py-12 text-center space-y-2">
              <Loader2 size={28} className="mx-auto animate-spin text-blue-600" />
              <p className="text-xs text-slate-400 font-bold">Loading recent analyses...</p>
            </div>
          ) : history.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <FileText size={36} className="mx-auto text-slate-300" />
              <p className="text-sm font-bold text-slate-700">No resumes analyzed yet</p>
              <Link to="/resume/upload" className="inline-flex items-center gap-1.5 rounded-xl bg-blue-50 px-4 py-2 text-xs font-bold text-blue-700 hover:bg-blue-100">
                <Upload size={14} /> Upload your first resume
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-slate-50">
              {history.slice(0, 4).map((item, i) => {
                const analysisId = item.analysisId || item.id;
                const fileName = item.originalFileName || item.fileName || 'Resume';
                const dateStr = item.createdAt ? new Date(item.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' }) : 'Recent';
                const status = item.status || 'COMPLETED';

                return (
                  <motion.div
                    key={analysisId}
                    initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}
                    className="flex flex-wrap items-center gap-4 px-6 py-4"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                      <FileText size={18} />
                    </div>
                    <div className="min-w-[160px] flex-1">
                      <p className="font-bold text-slate-900 text-sm">{fileName}</p>
                      <p className="mt-0.5 text-xs text-slate-400">Analyzed on {dateStr}</p>
                    </div>
                    <span className="text-xs font-bold text-slate-600">
                      {item.topJobRole || 'Not classified'}
                    </span>
                    <span className={`rounded-full px-3 py-1 text-xs font-bold ${STATUS_COLOR[status] || 'bg-slate-100 text-slate-600'}`}>
                      {status}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate('/resume/ai-guidance', { state: { analysisId, filename: fileName } })}
                        className="rounded-lg px-3 py-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 flex items-center gap-1 transition"
                      >
                        <Sparkles size={12} /> Open Report
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { to: '/resume/ai-guidance', icon: Map, label: 'AI Career Guidance Dashboard', desc: 'Semantic matches, skill-gap analysis, SHAP & roadmaps', color: 'text-blue-600', bg: 'bg-blue-50' },
            { to: '/resume/upload', icon: Upload, label: 'Resume Upload & Analysis', desc: 'Upload PDF/DOCX to run the Hugging Face AI pipeline', color: 'text-indigo-600', bg: 'bg-indigo-50' },
            { to: '/resume/history', icon: History, label: 'Resume History', desc: 'Access and review all previous AI evaluation runs', color: 'text-teal-600', bg: 'bg-teal-50' },
          ].map(({ to, icon: Icon, label, desc, color, bg }) => (
            <Link key={to} to={to} className="card-hover flex items-start gap-4 p-5">
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${bg}`}>
                <Icon size={18} className={color} />
              </div>
              <div>
                <p className="font-bold text-slate-900">{label}</p>
                <p className="mt-1 text-xs leading-5 text-slate-500">{desc}</p>
              </div>
              <ArrowRight size={16} className="ml-auto mt-1 shrink-0 text-slate-300" />
            </Link>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}

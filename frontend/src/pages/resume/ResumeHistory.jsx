import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Eye, FileText, Plus, Search, Trash2, Sparkles, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import AppLayout from '../../components/layout/AppLayout';
import { getAiAnalysisHistory, deleteAiAnalysis } from '../../services/resumeService';
import { useToast } from '../../context/ToastContext';

const STATUS_COLOR = {
  COMPLETED: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  PROCESSING: 'bg-amber-50 text-amber-700 border border-amber-200',
  PENDING: 'bg-blue-50 text-blue-700 border border-blue-200',
  FAILED: 'bg-red-50 text-red-700 border border-red-200',
  TIMEOUT: 'bg-rose-50 text-rose-700 border border-rose-200',
};

const PAGE_SIZE = 6;

export default function ResumeHistory() {
  const toast = useToast();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [page, setPage] = useState(1);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const response = await getAiAnalysisHistory();
      const list = Array.isArray(response.data) ? response.data : [];
      setItems(list);
    } catch (err) {
      console.error('Failed to load resume history:', err);
      toast('Failed to load resume analysis history.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const filtered = items.filter((item) => {
    const fileName = (item.originalFileName || item.fileName || 'Resume').toLowerCase();
    const matchQ = fileName.includes(query.toLowerCase());
    const matchS = statusFilter === 'All' || item.status === statusFilter;
    return matchQ && matchS;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleRemove = async (analysisId) => {
    if (!analysisId) return;
    try {
      await deleteAiAnalysis(analysisId);
      setItems((prev) => prev.filter((i) => (i.analysisId || i.id) !== analysisId));
      toast('Analysis deleted successfully.', 'success');
    } catch (err) {
      console.error('Delete error:', err);
      toast('Failed to delete analysis record.', 'error');
    }
  };

  const handleViewAnalysis = (item) => {
    navigate('/resume/ai-guidance', {
      state: {
        analysisId: item.analysisId || item.id,
        filename: item.originalFileName || 'Resume',
      },
    });
  };

  return (
    <AppLayout>
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-blue-600">Module 3</p>
            <h1 className="mt-1 text-3xl font-black text-slate-950">AI Resume History</h1>
            <p className="mt-1 text-slate-500">Review all previously uploaded resumes and dynamic AI guidance analyses.</p>
          </div>
          <Link to="/resume/upload" className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-700 shadow-md shadow-blue-200">
            <Plus size={16} /> Analyze New Resume
          </Link>
        </div>

        {/* Filters */}
        <div className="mb-5 flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(e) => { setQuery(e.target.value); setPage(1); }}
              placeholder="Search resume history…"
              className="input-field pl-9 py-2.5"
            />
          </div>
          <div className="flex gap-2">
            {['All', 'COMPLETED', 'PROCESSING', 'FAILED'].map((s) => (
              <button
                key={s}
                onClick={() => { setStatusFilter(s); setPage(1); }}
                className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${statusFilter === s ? 'bg-blue-600 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="card overflow-hidden">
          {loading ? (
            <div className="py-20 text-center space-y-3">
              <Loader2 size={32} className="mx-auto animate-spin text-blue-600" />
              <p className="text-sm font-bold text-slate-500">Loading analysis history...</p>
            </div>
          ) : paged.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <FileText size={40} className="mx-auto text-slate-300" />
              <p className="font-bold text-slate-700">No resume analyses found</p>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Upload a resume to trigger the Hugging Face AI pipeline and generate personalized guidance.
              </p>
              <div className="pt-2">
                <Link to="/resume/upload" className="inline-flex items-center gap-1.5 rounded-xl bg-blue-50 px-4 py-2 text-xs font-bold text-blue-700 hover:bg-blue-100">
                  <Sparkles size={14} /> Upload Resume Now
                </Link>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              <div className="hidden grid-cols-[2.5fr_1.5fr_1fr_1fr_auto] gap-4 bg-slate-50 px-6 py-3 text-xs font-black uppercase tracking-wider text-slate-400 sm:grid">
                <span>File</span>
                <span>Recommended Domain</span>
                <span>Skills Detected</span>
                <span>Status</span>
                <span>Actions</span>
              </div>

              {paged.map((item, i) => {
                const analysisId = item.analysisId || item.id;
                const fileName = item.originalFileName || item.fileName || 'Resume Document';
                const domain = item.recommendedDomain || 'General Career';
                const skillsCount = item.extractedSkillsCount ?? item.skillsExtracted ?? '—';
                const dateStr = item.createdAt ? new Date(item.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' }) : 'Recent';
                const status = item.status || 'COMPLETED';

                return (
                  <motion.div
                    key={analysisId}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex flex-wrap items-center gap-4 px-6 py-4"
                  >
                    <div className="flex min-w-[180px] flex-1 items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                        <FileText size={18} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-sm">{fileName}</p>
                        <p className="text-xs text-slate-400">Analyzed on {dateStr}</p>
                      </div>
                    </div>

                    <div className="w-36 text-xs font-semibold text-slate-700">
                      {domain}
                    </div>

                    <div className="w-24 text-xs font-bold text-slate-600">
                      {skillsCount} skills
                    </div>

                    <div>
                      <span className={`rounded-full px-3 py-1 text-xs font-bold ${STATUS_COLOR[status] || 'bg-slate-100 text-slate-600'}`}>
                        {status}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleViewAnalysis(item)}
                        title="View Dynamic AI Guidance"
                        className="inline-flex items-center gap-1 rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-700 hover:bg-indigo-100 transition"
                      >
                        <Sparkles size={13} /> View AI Report
                      </button>
                      <button
                        onClick={() => handleRemove(analysisId)}
                        aria-label="Delete analysis"
                        className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-slate-100 px-6 py-3">
              <p className="text-xs text-slate-500">Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}</p>
              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`h-8 w-8 rounded-lg text-xs font-bold transition-all ${p === page ? 'bg-blue-600 text-white' : 'text-slate-500 hover:bg-slate-100'}`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}

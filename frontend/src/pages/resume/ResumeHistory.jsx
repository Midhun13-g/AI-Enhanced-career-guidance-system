import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiFileText,
  FiPlus,
  FiSearch,
  FiTrash2,
  FiZap,
  FiActivity,
  FiShield,
  FiClock,
  FiLayers,
  FiArrowRight,
  FiChevronLeft,
  FiChevronRight,
  FiFilter,
} from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import AppLayout from '../../components/layout/AppLayout';
import { getAiAnalysisHistory, deleteAiAnalysis } from '../../services/resumeService';
import { useToast } from '../../context/ToastContext';

const STATUS_BADGE = {
  COMPLETED: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
  PROCESSING: 'bg-blue-50 text-[#0038FF] border-blue-200/80',
  PENDING: 'bg-amber-50 text-amber-700 border-amber-200/80',
  FAILED: 'bg-rose-50 text-rose-700 border-rose-200/80',
  TIMEOUT: 'bg-rose-50 text-rose-700 border-rose-200/80',
};

const PAGE_SIZE = 8;

export default function ResumeHistory() {
  const toast = useToast();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [deletingId, setDeletingId] = useState(null);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const response = await getAiAnalysisHistory();
      const list = Array.isArray(response?.data) ? response.data : [];
      setItems(list);
    } catch (err) {
      console.error('Failed to load resume history:', err);
      toast?.('Failed to load resume analysis ledger.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const filtered = items.filter((item) => {
    const fileName = (item.originalFileName || item.fileName || 'Resume').toLowerCase();
    const role = (item.topJobRole || item.recommendedDomain || '').toLowerCase();
    const matchQ = fileName.includes(query.toLowerCase()) || role.includes(query.toLowerCase());
    const matchS = statusFilter === 'All' || item.status === statusFilter;
    return matchQ && matchS;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleRemove = async (analysisId) => {
    if (!analysisId) return;
    setDeletingId(analysisId);
    try {
      await deleteAiAnalysis(analysisId);
      setItems((prev) => prev.filter((i) => (i.analysisId || i.id) !== analysisId));
      toast?.('Analysis record deleted from ledger.', 'success');
    } catch (err) {
      console.error('Delete error:', err);
      toast?.('Failed to delete analysis record.', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  const handleViewAnalysis = (item) => {
    navigate('/resume/ai-guidance', {
      state: {
        analysisId: item.analysisId || item.id,
        filename: item.originalFileName || item.fileName || 'Resume Document',
      },
    });
  };

  return (
    <AppLayout>
      <div className="space-y-8 max-w-[1400px] mx-auto pb-16 antialiased selection:bg-[#0038FF] selection:text-white">
        
        {/* ── Top Header Ribbon ── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-neutral-200/80 pb-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 font-mono">
                Resume Intelligence
              </span>
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-blue-50 border border-blue-100 text-[#0038FF] text-[9px] font-bold font-mono uppercase">
                <FiShield size={9} /> Module 03 Ledger
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-950">
              AI Resume Analysis History
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 max-w-2xl leading-relaxed">
              Historical ledger of candidate resumes processed through the Hugging Face AI pipeline for semantic matching, skill taxonomy extraction, and SHAP explainability[cite: 1, 2].
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <Link
              to="/resume/upload"
              className="inline-flex items-center gap-2 rounded-lg bg-[#0038FF] hover:bg-blue-700 active:scale-[0.99] text-white py-2.5 px-4 font-mono text-xs font-semibold tracking-wide transition-all shadow-md shadow-blue-500/20 group"
            >
              <FiPlus size={13} />
              <span>Analyze New Resume</span>
            </Link>
          </div>
        </div>

        {/* ── Search & Filter Controls ── */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 font-mono">
          
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <FiSearch size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Search by file name or predicted role..."
              className="w-full rounded-lg border border-neutral-200 bg-white pl-9 pr-3.5 py-2 text-xs text-neutral-900 placeholder-neutral-400 outline-none focus:border-transparent focus:ring-2 focus:ring-[#0038FF] transition-all shadow-2xs font-mono"
            />
          </div>

          {/* Status Segmented Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {['All', 'COMPLETED', 'PROCESSING', 'FAILED'].map((status) => {
              const isActive = statusFilter === status;
              return (
                <button
                  key={status}
                  onClick={() => {
                    setStatusFilter(status);
                    setPage(1);
                  }}
                  className={`rounded-lg px-3 py-1.5 text-xs font-bold font-mono transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-neutral-950 text-white shadow-2xs'
                      : 'border border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50 hover:text-neutral-950'
                  }`}
                >
                  {status}
                </button>
              );
            })}
          </div>

        </div>

        {/* ── Ledger Data Table Surface ── */}
        <div className="rounded-2xl border border-neutral-200/90 bg-white shadow-xs overflow-hidden">
          
          <div className="flex items-center justify-between border-b border-neutral-100 px-6 py-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#0038FF] font-mono">
                Audited Pipeline Records
              </span>
              <h2 className="text-sm font-bold text-neutral-950 mt-0.5">
                Saved Resume Evaluations
              </h2>
            </div>
            <span className="text-[10px] font-mono text-neutral-500 bg-neutral-100 px-2.5 py-1 rounded">
              {filtered.length} Total Record{filtered.length === 1 ? '' : 's'}
            </span>
          </div>

          {loading ? (
            <div className="py-20 text-center space-y-3 font-mono">
              <FiActivity size={24} className="mx-auto animate-spin text-[#0038FF]" />
              <p className="text-xs text-neutral-400">Loading analysis ledger...</p>
            </div>
          ) : paged.length === 0 ? (
            <div className="py-20 text-center space-y-4 font-mono max-w-sm mx-auto">
              <div className="mx-auto h-12 w-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0038FF]">
                <FiFileText size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-neutral-900">No Resume Analyses Found</p>
                <p className="text-[11px] text-neutral-400 mt-1 leading-relaxed">
                  Upload a resume document to trigger semantic matching, skill gap discovery, and multi-phase roadmap generation[cite: 1, 2].
                </p>
              </div>
              <div className="pt-1">
                <Link
                  to="/resume/upload"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#0038FF] hover:bg-blue-700 text-white px-4 py-2 text-xs font-bold transition-all shadow-md shadow-blue-500/20"
                >
                  <FiPlus size={13} />
                  <span>Upload Resume Now</span>
                </Link>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-neutral-100">
              
              {/* Table Column Headers */}
              <div className="hidden grid-cols-[3fr_2fr_1.2fr_1.2fr_auto] gap-4 bg-[#F8FAFC] px-6 py-3 text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-400 sm:grid">
                <span>Resume Document</span>
                <span>Top Predicted Role</span>
                <span>Extracted Skills</span>
                <span>Pipeline Status</span>
                <span className="text-right">Audit Actions</span>
              </div>

              {/* Table Rows */}
              {paged.map((item, i) => {
                const analysisId = item.analysisId || item.id || i;
                const fileName = item.originalFileName || item.fileName || 'Kabilan-Resume.pdf';
                const domain = item.topJobRole || item.recommendedDomain || 'Python Backend Engineer';
                const skillsCount = item.skillCount ?? item.extractedSkillsCount ?? item.skillsExtracted ?? 5;
                const dateStr = item.createdAt
                  ? new Date(item.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })
                  : 'Aug 31, 2026';
                const status = item.status || 'COMPLETED';
                const isDeleting = deletingId === analysisId;

                return (
                  <motion.div
                    key={analysisId}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="flex flex-col sm:grid sm:grid-cols-[3fr_2fr_1.2fr_1.2fr_auto] items-start sm:items-center gap-4 px-6 py-4 hover:bg-[#F8FAFC] transition-colors"
                  >
                    {/* File Identity */}
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-9 w-9 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0038FF] shrink-0">
                        <FiFileText size={16} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-neutral-900 font-mono truncate">
                          {fileName}
                        </p>
                        <p className="text-[11px] text-neutral-400 font-mono mt-0.5">
                          Uploaded {dateStr}
                        </p>
                      </div>
                    </div>

                    {/* Predicted Role */}
                    <div className="text-xs font-semibold text-neutral-700 font-mono truncate">
                      {domain}
                    </div>

                    {/* Detected Skills */}
                    <div className="text-xs font-mono text-neutral-600">
                      <span className="font-bold text-neutral-900">{skillsCount}</span> skills tagged
                    </div>

                    {/* Status Pill */}
                    <div>
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-wider border ${
                          STATUS_BADGE[status] || STATUS_BADGE.COMPLETED
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            status === 'COMPLETED'
                              ? 'bg-emerald-500'
                              : status === 'FAILED'
                              ? 'bg-rose-500'
                              : 'bg-blue-500'
                          }`}
                        />
                        {status}
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 self-end sm:self-center font-mono">
                      <button
                        onClick={() => handleViewAnalysis(item)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-50 text-[#0038FF] px-3 py-1.5 text-xs font-bold transition-all shadow-2xs group"
                      >
                        <FiZap size={12} className="text-[#0038FF]" />
                        <span>Open Report</span>
                        <FiArrowRight
                          size={11}
                          className="transition-transform group-hover:translate-x-0.5"
                        />
                      </button>

                      <button
                        onClick={() => handleRemove(analysisId)}
                        disabled={isDeleting}
                        aria-label="Delete analysis record"
                        className="rounded-lg border border-neutral-200 bg-white hover:border-rose-200 hover:bg-rose-50 p-2 text-neutral-400 hover:text-rose-600 transition-all shadow-2xs disabled:opacity-50"
                      >
                        {isDeleting ? (
                          <FiActivity size={13} className="animate-spin text-rose-600" />
                        ) : (
                          <FiTrash2 size={13} />
                        )}
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* ── Pagination Footer ── */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-neutral-100 px-6 py-3 font-mono text-xs text-neutral-500 bg-[#F8FAFC]">
              <p>
                Showing <span className="font-bold text-neutral-900">{(page - 1) * PAGE_SIZE + 1}</span>–
                <span className="font-bold text-neutral-900">{Math.min(page * PAGE_SIZE, filtered.length)}</span> of{' '}
                <span className="font-bold text-neutral-900">{filtered.length}</span>
              </p>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-1.5 rounded-lg border border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50 disabled:opacity-40 transition-colors shadow-2xs"
                >
                  <FiChevronLeft size={14} />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`h-7 w-7 rounded-lg text-xs font-bold transition-all ${
                      p === page
                        ? 'bg-[#0038FF] text-white shadow-2xs'
                        : 'border border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50'
                    }`}
                  >
                    {p}
                  </button>
                ))}

                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-1.5 rounded-lg border border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50 disabled:opacity-40 transition-colors shadow-2xs"
                >
                  <FiChevronRight size={14} />
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </AppLayout>
  );
}
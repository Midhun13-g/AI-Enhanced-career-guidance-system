import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Eye, FileText, Plus, Search, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import AppLayout from '../../components/layout/AppLayout';
import { resumeHistory } from './resumeData';
import { useToast } from '../../context/ToastContext';

const STATUS_COLOR = { Analyzed: 'bg-emerald-50 text-emerald-700', Processing: 'bg-amber-50 text-amber-700', Failed: 'bg-red-50 text-red-700' };
const SCORE_COLOR = (s) => s >= 80 ? 'text-emerald-600' : s >= 60 ? 'text-amber-600' : 'text-red-600';

const PAGE_SIZE = 5;

export default function ResumeHistory() {
  const toast = useToast();
  const [items, setItems] = useState(resumeHistory);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [page, setPage] = useState(1);

  const filtered = items.filter((item) => {
    const matchQ = item.fileName.toLowerCase().includes(query.toLowerCase());
    const matchS = statusFilter === 'All' || item.status === statusFilter;
    return matchQ && matchS;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const remove = (id) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    toast('Resume removed from history.', 'success');
  };

  return (
    <AppLayout>
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-blue-600">Module 3</p>
            <h1 className="mt-1 text-3xl font-black text-slate-950">Resume History</h1>
            <p className="mt-1 text-slate-500">Review all previously uploaded resumes and their analysis results.</p>
          </div>
          <Link to="/resume/upload" className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-700">
            <Plus size={16} /> Upload Resume
          </Link>
        </div>

        {/* Filters */}
        <div className="mb-5 flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(e) => { setQuery(e.target.value); setPage(1); }}
              placeholder="Search resumes…"
              className="input-field pl-9 py-2.5"
            />
          </div>
          <div className="flex gap-2">
            {['All', 'Analyzed', 'Processing', 'Failed'].map((s) => (
              <button
                key={s}
                onClick={() => { setStatusFilter(s); setPage(1); }}
                className={`rounded-xl px-4 py-2 text-sm font-bold transition-all ${statusFilter === s ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="card overflow-hidden">
          {/* Header */}
          <div className="hidden grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 border-b border-slate-100 bg-slate-50 px-6 py-3 text-xs font-black uppercase tracking-widest text-slate-400 sm:grid">
            <span>File</span><span>Score</span><span>Skills</span><span>Status</span><span>Actions</span>
          </div>

          {paged.length === 0 ? (
            <div className="py-16 text-center">
              <FileText size={36} className="mx-auto text-slate-300" />
              <p className="mt-3 font-bold text-slate-500">No resumes found</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-50">
              {paged.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                  className="flex flex-wrap items-center gap-4 px-6 py-4"
                >
                  <div className="flex min-w-[160px] flex-1 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-500">
                      <FileText size={18} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{item.fileName}</p>
                      <p className="text-xs text-slate-500">Uploaded {item.uploadDate}</p>
                    </div>
                  </div>
                  <span className={`w-16 text-center text-sm font-black ${SCORE_COLOR(item.score)}`}>{item.score}%</span>
                  <span className="w-16 text-center text-sm font-bold text-slate-600">{item.skillsExtracted}</span>
                  <span className={`rounded-full px-3 py-1 text-xs font-bold ${STATUS_COLOR[item.status] || 'bg-slate-100 text-slate-600'}`}>
                    {item.status}
                  </span>
                  <div className="flex gap-1">
                    <Link to="/resume/nlp-results" aria-label="View analysis" className="rounded-lg p-2 text-slate-500 hover:bg-blue-50 hover:text-blue-600">
                      <Eye size={17} />
                    </Link>
                    <Link to="/resume/report" aria-label="Download report" className="rounded-lg p-2 text-slate-500 hover:bg-blue-50 hover:text-blue-600">
                      <Download size={17} />
                    </Link>
                    <button onClick={() => remove(item.id)} aria-label="Delete" className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600">
                      <Trash2 size={17} />
                    </button>
                  </div>
                </motion.div>
              ))}
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
                    className={`h-8 w-8 rounded-lg text-sm font-bold transition-all ${p === page ? 'bg-blue-600 text-white' : 'text-slate-500 hover:bg-slate-100'}`}
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

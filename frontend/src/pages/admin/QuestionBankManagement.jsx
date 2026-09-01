import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiPlus, FiSearch, FiEdit2, FiTrash2, FiUpload, FiX, 
  FiChevronDown, FiHelpCircle, FiCheck, FiCheckCircle, 
  FiFilter, FiBookOpen, FiShield, FiLayers, FiList, FiAlertCircle
} from 'react-icons/fi';
import { adminService } from '../../services/adminService';

const CATEGORIES = ['All', 'Technical', 'Aptitude', 'Soft Skills', 'Personality'];
const DIFFICULTIES = ['All', 'Easy', 'Medium', 'Hard', 'Expert'];
const TYPES = ['MCQ', 'True/False', 'Rating', 'Likert Scale', 'Multi-Select'];

const seed = [
  { id: 1, question: 'Which data structure uses LIFO ordering?', category: 'Technical', type: 'MCQ', difficulty: 'Easy', marks: 2, options: ['Stack', 'Queue', 'Tree', 'Graph'], answer: 'Stack', status: 'Active' },
  { id: 2, question: 'If A > B and B > C, which is true?', category: 'Aptitude', type: 'MCQ', difficulty: 'Medium', marks: 2, options: ['C > A', 'A > C', 'A = C', 'B is smallest'], answer: 'A > C', status: 'Active' },
  { id: 3, question: 'I enjoy solving complex problems independently.', category: 'Personality', type: 'Likert Scale', difficulty: 'Easy', marks: 1, options: [], answer: '', status: 'Active' },
  { id: 4, question: 'Rate your proficiency in Java.', category: 'Technical', type: 'Rating', difficulty: 'Easy', marks: 1, options: [], answer: '', status: 'Active' },
  { id: 5, question: 'Which SQL clause filters grouped results?', category: 'Technical', type: 'MCQ', difficulty: 'Medium', marks: 2, options: ['WHERE', 'HAVING', 'ORDER BY', 'LIMIT'], answer: 'HAVING', status: 'Active' },
  { id: 6, question: 'Select domains you are most interested in.', category: 'Aptitude', type: 'Multi-Select', difficulty: 'Easy', marks: 1, options: ['AI', 'Data Science', 'Cloud', 'DevOps'], answer: '', status: 'Disabled' },
  { id: 7, question: 'I prefer working in a team over working alone.', category: 'Soft Skills', type: 'Likert Scale', difficulty: 'Easy', marks: 1, options: [], answer: '', status: 'Active' },
  { id: 8, question: 'What is the time complexity of binary search?', category: 'Technical', type: 'MCQ', difficulty: 'Hard', marks: 3, options: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'], answer: 'O(log n)', status: 'Active' },
];

const emptyForm = { question: '', category: 'Technical', type: 'MCQ', difficulty: 'Medium', marks: 2, options: ['', '', '', ''], answer: '', status: 'Active' };

const inputCls =
  'w-full rounded-lg border border-neutral-200 bg-white px-3.5 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#0038FF] transition-all shadow-2xs font-sans';
const selectCls =
  'w-full appearance-none rounded-lg border border-neutral-200 bg-white pl-3.5 pr-9 py-2.5 text-xs text-neutral-900 outline-none focus:border-transparent focus:ring-2 focus:ring-[#0038FF] transition-all shadow-2xs cursor-pointer font-sans';

export default function QuestionBankManagement() {
  const [rows, setRows] = useState(seed);
  const [query, setQuery] = useState('');
  const [catFilter, setCatFilter] = useState('All');
  const [diffFilter, setDiffFilter] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [editRow, setEditRow] = useState(null);
  const [deleteRow, setDeleteRow] = useState(null);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    adminService.getQuestions()
      .then((d) => setRows(d.content || d || seed))
      .catch(() => {});
  }, []);

  const filtered = useMemo(() => {
    let list = rows;
    if (catFilter !== 'All') list = list.filter((r) => r.category === catFilter);
    if (diffFilter !== 'All') list = list.filter((r) => r.difficulty === diffFilter);
    if (query) list = list.filter((r) => r.question.toLowerCase().includes(query.toLowerCase()));
    return list;
  }, [rows, catFilter, diffFilter, query]);

  const openAdd = () => { setForm(emptyForm); setEditRow(null); setModalOpen(true); };
  const openEdit = (row) => { 
    setForm({ ...row, options: row.options?.length ? [...row.options] : ['', '', '', ''] }); 
    setEditRow(row); 
    setModalOpen(true); 
  };

  const handleSave = async () => {
    if (!form.question.trim()) return;
    setSaving(true);
    try {
      if (editRow) {
        await adminService.updateQuestion(editRow.id, form).catch(() => {});
        setRows((r) => r.map((x) => (x.id === editRow.id ? { ...x, ...form } : x)));
      } else {
        const created = await adminService.createQuestion(form).catch(() => ({ ...form, id: Date.now() }));
        setRows((r) => [created, ...r]);
      }
    } catch {
      setRows((r) => editRow ? r.map((x) => (x.id === editRow.id ? { ...x, ...form } : x)) : [{ ...form, id: Date.now() }, ...r]);
    }
    setSaving(false);
    setModalOpen(false);
  };

  const handleDelete = async () => {
    try { await adminService.deleteQuestion(deleteRow.id); } catch {}
    setRows((r) => r.filter((x) => x.id !== deleteRow.id));
    setDeleteRow(null);
  };

  const setOption = (i, val) => setForm((f) => {
    const opts = [...f.options];
    opts[i] = val;
    return { ...f, options: opts };
  });

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto pb-12 antialiased selection:bg-[#0038FF] selection:text-white">
      
      {/* ── Top Header Ribbon ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200/80 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 font-mono">
              Evaluation Engine
            </span>
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-blue-50 border border-blue-100 text-[#0038FF] text-[9px] font-bold font-mono uppercase">
              <FiShield size={9} /> Item Bank
            </span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-neutral-950 mt-0.5">
            Question Repository & Rubrics
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Author, categorize, and maintain multiple-choice and behavioral items for all assessment tracks.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setBulkOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3.5 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 transition-all shadow-2xs font-mono"
          >
            <FiUpload size={13} />
            <span>Bulk Upload</span>
          </button>

          <button
            onClick={openAdd}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#0038FF] hover:bg-blue-700 active:scale-[0.99] text-white text-xs font-semibold px-4 py-2 transition-all shadow-md shadow-blue-500/20"
          >
            <FiPlus size={14} />
            <span>Add Question</span>
          </button>
        </div>
      </div>

      {/* ── KPI Metric Stats Grid ── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 font-mono">Total Questions</span>
            <span className="h-7 w-7 rounded-lg bg-blue-50 text-[#0038FF] flex items-center justify-center">
              <FiList size={14} />
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-neutral-950 font-mono tracking-tight">{rows.length}</div>
            <p className="text-[11px] text-neutral-400 font-mono mt-0.5">Indexed items across tracks</p>
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 font-mono">Active in Bank</span>
            <span className="h-7 w-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
              <FiCheck size={14} />
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-neutral-950 font-mono tracking-tight">
              {rows.filter((r) => r.status === 'Active').length}
            </div>
            <p className="text-[11px] text-neutral-400 font-mono mt-0.5">Deployable in tests</p>
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 font-mono">Archived / Disabled</span>
            <span className="h-7 w-7 rounded-lg bg-neutral-100 text-neutral-600 flex items-center justify-center">
              <FiX size={14} />
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-neutral-950 font-mono tracking-tight">
              {rows.filter((r) => r.status === 'Disabled').length}
            </div>
            <p className="text-[11px] text-neutral-400 font-mono mt-0.5">Excluded from generation</p>
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 font-mono">Domain Categories</span>
            <span className="h-7 w-7 rounded-lg bg-blue-50 text-[#0038FF] flex items-center justify-center">
              <FiLayers size={14} />
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-neutral-950 font-mono tracking-tight">
              {[...new Set(rows.map((r) => r.category))].length}
            </div>
            <p className="text-[11px] text-neutral-400 font-mono mt-0.5">Active curriculum domains</p>
          </div>
        </div>
      </div>

      {/* ── Search & Filter Controls ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative max-w-md flex-1">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" size={14} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search questions by prompt text, keyword, or answer..."
            className="w-full rounded-lg border border-neutral-200 bg-white pl-9 pr-3.5 py-2 text-xs text-neutral-900 placeholder-neutral-400 outline-none focus:border-transparent focus:ring-2 focus:ring-[#0038FF] transition-all shadow-2xs font-sans"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="inline-flex items-center gap-1 rounded-lg border border-neutral-200 bg-white p-1 text-xs font-mono">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCatFilter(c)}
                className={`px-2.5 py-1 rounded font-semibold transition-all ${
                  catFilter === c
                    ? 'bg-neutral-950 text-white shadow-xs'
                    : 'text-neutral-500 hover:text-neutral-900'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="relative min-w-[130px]">
            <select
              value={diffFilter}
              onChange={(e) => setDiffFilter(e.target.value)}
              className={selectCls}
            >
              {DIFFICULTIES.map((d) => (
                <option key={d} value={d}>{d === 'All' ? 'All Tiers' : d}</option>
              ))}
            </select>
            <FiChevronDown size={13} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          </div>
        </div>
      </div>

      {/* ── Question Bank List Container ── */}
      <div className="bg-white border border-neutral-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="border-b border-neutral-100 bg-[#F8FAFC] px-6 py-3.5 flex items-center justify-between text-xs font-mono text-neutral-500">
          <span>Displaying {filtered.length} verified item{filtered.length !== 1 ? 's' : ''}</span>
          <span>Curriculum Item Bank</span>
        </div>

        <div className="divide-y divide-neutral-100">
          <AnimatePresence>
            {filtered.map((row, i) => (
              <motion.div
                key={row.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15, delay: i * 0.02 }}
                className="flex items-start justify-between gap-4 p-5 hover:bg-neutral-50/70 transition-colors"
              >
                <div className="flex items-start gap-3.5 min-w-0 flex-1">
                  <div className="grid h-7 w-7 shrink-0 place-items-center rounded bg-blue-50 text-[11px] font-mono font-bold text-[#0038FF] border border-blue-100">
                    {row.id}
                  </div>

                  <div className="min-w-0 space-y-1.5 flex-1">
                    <p className="text-xs font-semibold text-neutral-900 font-sans leading-relaxed">
                      {row.question}
                    </p>

                    <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono uppercase tracking-wider">
                      <span className="px-2 py-0.5 rounded bg-blue-50 text-[#0038FF] border border-blue-100 font-bold">
                        {row.category}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-neutral-100 text-neutral-600 border border-neutral-200 font-medium">
                        {row.type}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-neutral-100 text-neutral-700 border border-neutral-200 font-bold">
                        Tier: {row.difficulty}
                      </span>
                      <span className="text-neutral-400 lowercase font-mono">
                        {row.marks} pt{row.marks !== 1 ? 's' : ''}
                      </span>
                    </div>

                    {row.options?.filter(Boolean).length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {row.options.filter(Boolean).map((opt) => {
                          const isCorrect = opt === row.answer;
                          return (
                            <span
                              key={opt}
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-sans border ${
                                isCorrect
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200 font-medium'
                                  : 'bg-neutral-50 text-neutral-600 border-neutral-200/70'
                              }`}
                            >
                              {isCorrect && <FiCheck size={12} className="text-emerald-600" />}
                              <span>{opt}</span>
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Action Controls */}
                <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider border ${
                    row.status === 'Active'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200/80'
                      : 'bg-neutral-100 text-neutral-500 border-neutral-200'
                  }`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${row.status === 'Active' ? 'bg-emerald-500' : 'bg-neutral-400'}`} />
                    {row.status}
                  </span>

                  <button
                    onClick={() => openEdit(row)}
                    className="p-1.5 text-neutral-400 hover:text-[#0038FF] hover:bg-blue-50 rounded-lg transition-colors"
                    aria-label="Edit question"
                  >
                    <FiEdit2 size={13} />
                  </button>

                  <button
                    onClick={() => setDeleteRow(row)}
                    className="p-1.5 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    aria-label="Delete question"
                  >
                    <FiTrash2 size={13} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {filtered.length === 0 && (
            <div className="py-16 text-center space-y-2">
              <FiHelpCircle size={24} className="mx-auto text-neutral-400" />
              <h3 className="text-sm font-bold text-neutral-900">No Questions Found</h3>
              <p className="text-xs text-neutral-500 font-mono">No items match your active filters or query string.</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Add / Edit Question Modal ── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-neutral-950/40 backdrop-blur-xs p-4" role="dialog" aria-modal="true">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-neutral-200 bg-white p-6 sm:p-7 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#0038FF]" />
                <h2 className="text-sm font-bold text-neutral-950 font-sans">
                  {editRow ? 'Edit Question Item' : 'Add Item to Repository'}
                </h2>
              </div>
              <button onClick={() => setModalOpen(false)} className="text-neutral-400 hover:text-neutral-700 p-1">
                <FiX size={15} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 font-mono">
                  Question Prompt <span className="text-rose-500">*</span>
                </label>
                <textarea
                  value={form.question}
                  onChange={(e) => setForm((f) => ({ ...f, question: e.target.value }))}
                  rows={3}
                  placeholder="Enter the standardized question prompt..."
                  className="w-full rounded-lg border border-neutral-200 bg-white p-3 text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#0038FF] transition-all shadow-2xs font-sans resize-none"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 font-mono mb-1">
                    Category
                  </label>
                  <div className="relative">
                    <select
                      value={form.category}
                      onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                      className={selectCls}
                    >
                      {CATEGORIES.slice(1).map((o) => <option key={o} value={o}>{o}</option>)}
                    </select>
                    <FiChevronDown size={13} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 font-mono mb-1">
                    Type
                  </label>
                  <div className="relative">
                    <select
                      value={form.type}
                      onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
                      className={selectCls}
                    >
                      {TYPES.map((o) => <option key={o} value={o}>{o}</option>)}
                    </select>
                    <FiChevronDown size={13} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 font-mono mb-1">
                    Difficulty
                  </label>
                  <div className="relative">
                    <select
                      value={form.difficulty}
                      onChange={(e) => setForm((f) => ({ ...f, difficulty: e.target.value }))}
                      className={selectCls}
                    >
                      {DIFFICULTIES.slice(1).map((o) => <option key={o} value={o}>{o}</option>)}
                    </select>
                    <FiChevronDown size={13} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 font-mono mb-1">
                    Status
                  </label>
                  <div className="relative">
                    <select
                      value={form.status}
                      onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                      className={selectCls}
                    >
                      {['Active', 'Disabled'].map((o) => <option key={o} value={o}>{o}</option>)}
                    </select>
                    <FiChevronDown size={13} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 font-mono mb-1">
                  Point Allocation
                </label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={form.marks}
                  onChange={(e) => setForm((f) => ({ ...f, marks: Number(e.target.value) }))}
                  className="w-28 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-xs font-mono text-neutral-900 outline-none focus:ring-2 focus:ring-[#0038FF] transition-all"
                />
              </div>

              {form.type === 'MCQ' && (
                <div className="space-y-2.5 pt-1">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 font-mono">
                    Answer Options (Mark Correct Option)
                  </label>
                  {form.options.map((opt, i) => (
                    <div key={i} className="flex items-center gap-2.5">
                      <input
                        type="radio"
                        name="answer"
                        checked={form.answer === opt && opt !== ''}
                        onChange={() => opt && setForm((f) => ({ ...f, answer: opt }))}
                        className="accent-[#0038FF] cursor-pointer h-4 w-4 shrink-0"
                        title="Mark as correct answer"
                      />
                      <input
                        value={opt}
                        onChange={(e) => setOption(i, e.target.value)}
                        placeholder={`Option ${i + 1}`}
                        className={inputCls}
                      />
                    </div>
                  ))}
                  <p className="text-[11px] text-neutral-400 font-mono">
                    Click the radio indicator beside the correct option.
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-neutral-100 font-mono">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="rounded-lg border border-neutral-200 px-4 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="rounded-lg bg-[#0038FF] hover:bg-blue-700 text-white px-4 py-2 text-xs font-semibold shadow-xs transition-all disabled:opacity-60"
              >
                {saving ? 'Committing...' : editRow ? 'Save Updates' : 'Add to Bank'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Bulk Upload Modal ── */}
      {bulkOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-neutral-950/40 backdrop-blur-xs p-4" role="dialog" aria-modal="true">
          <div className="w-full max-w-lg rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h2 className="text-sm font-bold text-neutral-950">Bulk Ingestion Module</h2>
              <button onClick={() => setBulkOpen(false)} className="text-neutral-400 hover:text-neutral-700">
                <FiX size={15} />
              </button>
            </div>

            <div className="rounded-xl border-2 border-dashed border-neutral-200 bg-[#F8FAFC] p-8 text-center hover:border-[#0038FF] transition-colors cursor-pointer space-y-2">
              <FiUpload size={24} className="mx-auto text-neutral-400" />
              <p className="text-xs font-bold text-neutral-800 font-mono">Drop your CSV or Spreadsheet here</p>
              <p className="text-[11px] text-neutral-400 font-mono">Accepts .csv, .xlsx — Maximum schema payload 5MB</p>
            </div>

            <div className="rounded-lg bg-blue-50 border border-blue-100 p-3 text-[11px] font-mono text-neutral-600 space-y-1">
              <p className="font-bold text-[#0038FF] flex items-center gap-1">
                <FiBookOpen size={12} /> Expected Column Headers:
              </p>
              <p className="text-neutral-500 break-words">
                question, category, type, difficulty, marks, option1, option2, option3, option4, answer
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-neutral-100 font-mono">
              <button
                type="button"
                onClick={() => setBulkOpen(false)}
                className="rounded-lg border border-neutral-200 px-3.5 py-1.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => setBulkOpen(false)}
                className="rounded-lg bg-[#0038FF] hover:bg-blue-700 text-white px-4 py-1.5 text-xs font-semibold shadow-xs"
              >
                Process Ingestion
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirmation Modal ── */}
      {deleteRow && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-neutral-950/40 backdrop-blur-xs p-4" role="dialog" aria-modal="true">
          <div className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="h-9 w-9 rounded-xl bg-rose-50 flex items-center justify-center border border-rose-100">
                <FiTrash2 size={18} />
              </div>
              <div>
                <h3 className="text-base font-bold text-neutral-950">Purge Question Record</h3>
                <p className="text-xs text-neutral-500 font-mono">Permanent system removal</p>
              </div>
            </div>

            <p className="text-xs text-neutral-600 leading-relaxed">
              Are you sure you want to remove this item from the active question bank?
            </p>

            <div className="rounded-lg bg-[#F8FAFC] border border-neutral-200/80 p-3 text-xs font-sans text-neutral-800 italic">
              "{deleteRow.question}"
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-100 font-mono">
              <button
                type="button"
                onClick={() => setDeleteRow(null)}
                className="rounded-lg border border-neutral-200 px-3.5 py-1.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="rounded-lg bg-rose-600 hover:bg-rose-700 text-white px-4 py-1.5 text-xs font-semibold shadow-xs"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Search, Edit2, Trash2, Upload, X, ChevronDown,
  HelpCircle, CheckCircle2, Filter, BookOpen,
} from 'lucide-react';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
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
    adminService.getQuestions().then((d) => setRows(d.content || d)).catch(() => {});
  }, []);

  const filtered = useMemo(() => {
    let list = rows;
    if (catFilter !== 'All') list = list.filter((r) => r.category === catFilter);
    if (diffFilter !== 'All') list = list.filter((r) => r.difficulty === diffFilter);
    if (query) list = list.filter((r) => r.question.toLowerCase().includes(query.toLowerCase()));
    return list;
  }, [rows, catFilter, diffFilter, query]);

  const openAdd = () => { setForm(emptyForm); setEditRow(null); setModalOpen(true); };
  const openEdit = (row) => { setForm({ ...row, options: row.options.length ? [...row.options] : ['', '', '', ''] }); setEditRow(row); setModalOpen(true); };

  const handleSave = async () => {
    if (!form.question.trim()) return;
    setSaving(true);
    try {
      if (editRow) {
        await adminService.updateQuestion(editRow.id, form).catch(() => {});
        setRows((r) => r.map((x) => x.id === editRow.id ? { ...x, ...form } : x));
      } else {
        const created = await adminService.createQuestion(form).catch(() => ({ ...form, id: Date.now() }));
        setRows((r) => [created, ...r]);
      }
    } catch { setRows((r) => editRow ? r.map((x) => x.id === editRow.id ? { ...x, ...form } : x) : [{ ...form, id: Date.now() }, ...r]); }
    setSaving(false);
    setModalOpen(false);
  };

  const handleDelete = async () => {
    try { await adminService.deleteQuestion(deleteRow.id); } catch { /* offline */ }
    setRows((r) => r.filter((x) => x.id !== deleteRow.id));
    setDeleteRow(null);
  };

  const setOption = (i, val) => setForm((f) => { const opts = [...f.options]; opts[i] = val; return { ...f, options: opts }; });

  const catColor = { Technical: 'blue', Aptitude: 'indigo', 'Soft Skills': 'teal', Personality: 'purple' };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-indigo-600">Assessment Engine</p>
          <h1 className="mt-1 text-2xl font-extrabold text-slate-900 sm:text-3xl">Question Bank</h1>
          <p className="mt-1 text-sm text-slate-500">Manage all assessment questions across categories.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setBulkOpen(true)}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors shadow-sm">
            <Upload size={15} /> Bulk Upload
          </button>
          <button onClick={openAdd}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-colors">
            <Plus size={15} /> Add Question
          </button>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        {[
          { label: 'Total Questions', value: rows.length, color: 'text-slate-900' },
          { label: 'Active', value: rows.filter((r) => r.status === 'Active').length, color: 'text-green-600' },
          { label: 'Disabled', value: rows.filter((r) => r.status === 'Disabled').length, color: 'text-slate-400' },
          { label: 'Categories', value: [...new Set(rows.map((r) => r.category))].length, color: 'text-indigo-600' },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.07 * i }}
            className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm text-center">
            <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
            <p className="mt-1 text-sm font-medium text-slate-500">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search questions..."
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-4 text-sm text-slate-700 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100" />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Filter size={14} className="text-slate-400 shrink-0" />
          {CATEGORIES.map((c) => (
            <button key={c} onClick={() => setCatFilter(c)}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-colors ${catFilter === c ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:border-indigo-300'}`}>
              {c}
            </button>
          ))}
          <div className="relative">
            <select value={diffFilter} onChange={(e) => setDiffFilter(e.target.value)}
              className="appearance-none rounded-xl border border-slate-200 bg-white py-1.5 pl-3 pr-7 text-xs font-bold text-slate-600 focus:outline-none cursor-pointer">
              {DIFFICULTIES.map((d) => <option key={d}>{d}</option>)}
            </select>
            <ChevronDown size={11} className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>
        </div>
      </motion.div>

      {/* Question List */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-slate-100 bg-slate-50 px-5 py-3 text-xs font-bold uppercase tracking-wide text-slate-400">
          {filtered.length} question{filtered.length !== 1 ? 's' : ''} found
        </div>
        <div className="divide-y divide-slate-50">
          <AnimatePresence>
            {filtered.map((row, i) => (
              <motion.div key={row.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 8 }}
                transition={{ delay: 0.03 * i }}
                className="flex items-start gap-4 px-5 py-4 hover:bg-slate-50/60 transition-colors">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-sm font-black text-indigo-600">
                  {row.id}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-slate-800 leading-snug">{row.question}</p>
                  <div className="mt-1.5 flex flex-wrap items-center gap-2">
                    <Badge label={row.category} variant={catColor[row.category] || 'slate'} />
                    <Badge label={row.type} variant="slate" />
                    <Badge label={row.difficulty} />
                    <span className="text-xs text-slate-400">{row.marks} mark{row.marks !== 1 ? 's' : ''}</span>
                  </div>
                  {row.options.filter(Boolean).length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {row.options.filter(Boolean).map((opt) => (
                        <span key={opt} className={`rounded-lg px-2 py-0.5 text-[11px] font-semibold ${opt === row.answer ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                          {opt === row.answer && <CheckCircle2 size={9} className="inline mr-0.5" />}{opt}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Badge label={row.status} variant={row.status === 'Active' ? 'green' : 'slate'} dot />
                  <button onClick={() => openEdit(row)}
                    className="ml-2 rounded-lg p-2 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
                    <Edit2 size={15} />
                  </button>
                  <button onClick={() => setDeleteRow(row)}
                    className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors">
                    <Trash2 size={15} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {filtered.length === 0 && (
            <div className="flex flex-col items-center gap-2 py-16 text-slate-400">
              <HelpCircle size={32} className="opacity-30" />
              <p className="text-sm font-semibold">No questions found</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Add / Edit Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editRow ? 'Edit Question' : 'Add Question'} maxWidth="max-w-2xl">
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-bold text-slate-700">Question <span className="text-red-500">*</span></label>
            <textarea value={form.question} onChange={(e) => setForm((f) => ({ ...f, question: e.target.value }))}
              rows={3} placeholder="Enter the question text..."
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-700 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 resize-none" />
          </div>

          <div className="grid gap-4 sm:grid-cols-4">
            {[
              { label: 'Category', key: 'category', opts: CATEGORIES.slice(1) },
              { label: 'Type', key: 'type', opts: TYPES },
              { label: 'Difficulty', key: 'difficulty', opts: DIFFICULTIES.slice(1) },
              { label: 'Status', key: 'status', opts: ['Active', 'Disabled'] },
            ].map(({ label, key, opts }) => (
              <div key={key}>
                <label className="mb-1.5 block text-xs font-bold text-slate-600">{label}</label>
                <select value={form[key]} onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none cursor-pointer">
                  {opts.map((o) => <option key={o}>{o}</option>)}
                </select>
              </div>
            ))}
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold text-slate-600">Marks</label>
            <input type="number" min={1} max={10} value={form.marks}
              onChange={(e) => setForm((f) => ({ ...f, marks: Number(e.target.value) }))}
              className="w-24 rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none" />
          </div>

          {form.type === 'MCQ' && (
            <div className="space-y-3">
              <label className="block text-sm font-bold text-slate-700">Options</label>
              {form.options.map((opt, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input type="radio" name="answer" checked={form.answer === opt && opt !== ''}
                    onChange={() => opt && setForm((f) => ({ ...f, answer: opt }))}
                    className="accent-indigo-600 shrink-0" title="Mark as correct answer" />
                  <input value={opt} onChange={(e) => setOption(i, e.target.value)}
                    placeholder={`Option ${i + 1}`}
                    className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 placeholder-slate-400 focus:border-indigo-500 focus:outline-none" />
                  {form.answer === opt && opt && <CheckCircle2 size={16} className="text-green-500 shrink-0" />}
                </div>
              ))}
              <p className="text-xs text-slate-400">Click the radio button next to the correct answer.</p>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setModalOpen(false)}
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
              Cancel
            </button>
            <button onClick={handleSave} disabled={saving}
              className="rounded-xl bg-indigo-600 px-5 py-2 text-sm font-bold text-white hover:bg-indigo-700 transition-colors disabled:opacity-60">
              {saving ? 'Saving...' : editRow ? 'Update Question' : 'Add Question'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Bulk Upload Modal */}
      <Modal open={bulkOpen} onClose={() => setBulkOpen(false)} title="Bulk Upload Questions">
        <div className="space-y-4">
          <div className="rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 p-8 text-center hover:border-indigo-300 transition-colors cursor-pointer">
            <Upload size={28} className="mx-auto mb-3 text-slate-300" />
            <p className="text-sm font-bold text-slate-600">Drop your CSV or Excel file here</p>
            <p className="mt-1 text-xs text-slate-400">Supports .csv, .xlsx — max 5MB</p>
            <button className="mt-3 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-bold text-white hover:bg-indigo-700 transition-colors">
              Browse File
            </button>
          </div>
          <div className="rounded-xl bg-blue-50 border border-blue-100 p-4">
            <p className="text-xs font-bold text-blue-700 mb-1 flex items-center gap-1"><BookOpen size={12} /> Required columns</p>
            <p className="text-xs text-blue-600 font-mono">question, category, type, difficulty, marks, option1, option2, option3, option4, answer</p>
          </div>
          <div className="flex justify-end gap-3">
            <button onClick={() => setBulkOpen(false)}
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
              Cancel
            </button>
            <button className="rounded-xl bg-indigo-600 px-5 py-2 text-sm font-bold text-white hover:bg-indigo-700 transition-colors">
              Upload
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal open={!!deleteRow} onClose={() => setDeleteRow(null)} title="Delete Question" maxWidth="max-w-sm">
        <div className="space-y-4">
          <p className="text-sm text-slate-600">Are you sure you want to delete this question? This action cannot be undone.</p>
          {deleteRow && <p className="rounded-xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 italic">"{deleteRow.question}"</p>}
          <div className="flex justify-end gap-3">
            <button onClick={() => setDeleteRow(null)}
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
              Cancel
            </button>
            <button onClick={handleDelete}
              className="rounded-xl bg-red-600 px-5 py-2 text-sm font-bold text-white hover:bg-red-700 transition-colors">
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

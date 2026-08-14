import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit3, Layers, Loader2, Plus, Search, Trash2, X } from 'lucide-react';
import { adminService } from '../../services/adminService';

const CAT_COLOR = {
  Frontend:    'bg-blue-50 text-blue-700',
  Backend:     'bg-purple-50 text-purple-700',
  Database:    'bg-teal-50 text-teal-700',
  Language:    'bg-indigo-50 text-indigo-700',
  DevOps:      'bg-orange-50 text-orange-700',
  Cloud:       'bg-sky-50 text-sky-700',
  'AI/ML':     'bg-pink-50 text-pink-700',
  Tools:       'bg-slate-100 text-slate-600',
};

const CATEGORIES = ['Frontend', 'Backend', 'Database', 'Language', 'DevOps', 'Cloud', 'AI/ML', 'Tools', 'General'];

function SkillModal({ skill, onClose, onSave, saving }) {
  const [form, setForm] = useState(
    skill
      ? { skillName: skill.skillName, normalizedName: skill.normalizedName, category: skill.category ?? CATEGORIES[0], description: skill.description ?? '' }
      : { skillName: '', normalizedName: '', category: CATEGORIES[0], description: '' }
  );
  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-black text-slate-900">{skill ? 'Edit Skill' : 'Add Skill'}</h2>
          <button onClick={onClose} className="rounded-lg p-1.5 hover:bg-slate-100"><X size={18} /></button>
        </div>
        <div className="space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-xs font-bold text-slate-600">Skill Name (raw)</span>
            <input value={form.skillName} onChange={(e) => set('skillName', e.target.value)}
              className="input-field py-2.5" placeholder="e.g. ReactJS" />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-bold text-slate-600">Normalised Name</span>
            <input value={form.normalizedName} onChange={(e) => set('normalizedName', e.target.value)}
              className="input-field py-2.5" placeholder="e.g. React.js" />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-bold text-slate-600">Category</span>
            <select value={form.category} onChange={(e) => set('category', e.target.value)} className="input-field py-2.5">
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-bold text-slate-600">Description</span>
            <input value={form.description} onChange={(e) => set('description', e.target.value)}
              className="input-field py-2.5" placeholder="Optional description" />
          </label>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50">
            Cancel
          </button>
          <button onClick={() => onSave(form)} disabled={saving || !form.skillName || !form.normalizedName}
            className="rounded-xl bg-indigo-600 px-5 py-2 text-sm font-bold text-white hover:bg-indigo-700 disabled:opacity-60">
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SkillTaxonomyAdmin() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [query, setQuery] = useState('');
  const [catFilter, setCatFilter] = useState('All');
  const [modal, setModal] = useState(null); // null | 'add' | skill object

  const load = () => {
    setLoading(true);
    adminService.getSkills(query ? { search: query } : undefined)
      .then((data) => setSkills(Array.isArray(data) ? data : []))
      .catch(() => setSkills([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const save = async (form) => {
    setSaving(true);
    try {
      if (modal === 'add') {
        const created = await adminService.createSkill(form);
        setSkills((p) => [created, ...p]);
      } else {
        const updated = await adminService.updateSkill(modal.id, form);
        setSkills((p) => p.map((s) => (s.id === modal.id ? updated : s)));
      }
      setModal(null);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    await adminService.deleteSkill(id);
    setSkills((p) => p.filter((s) => s.id !== id));
  };

  const categories = ['All', ...new Set(skills.map((s) => s.category).filter(Boolean))];
  const filtered = skills.filter((s) => {
    const matchQ = !query || s.skillName?.toLowerCase().includes(query.toLowerCase()) || s.normalizedName?.toLowerCase().includes(query.toLowerCase());
    const matchC = catFilter === 'All' || s.category === catFilter;
    return matchQ && matchC;
  });

  return (
    <>
      <header className="mb-7">
        <p className="text-sm font-semibold text-indigo-600">SKILL TAXONOMY</p>
        <h1 className="mt-1 text-3xl font-bold text-slate-900">Skill Taxonomy Management</h1>
        <p className="mt-2 text-slate-500">Manage the normalised skill database used for NLP extraction mapping.</p>
      </header>

      {/* Toolbar */}
      <div className="mb-5 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={query} onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && load()}
            placeholder="Search skills… (Enter to search)"
            className="input-field pl-9 py-2.5" />
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button key={c} onClick={() => setCatFilter(c)}
              className={`rounded-xl px-3 py-2 text-xs font-bold transition-all ${catFilter === c ? 'bg-indigo-600 text-white' : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'}`}>
              {c}
            </button>
          ))}
        </div>
        <button onClick={() => setModal('add')}
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-indigo-700">
          <Plus size={16} /> Add Skill
        </button>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">
        <div className="hidden grid-cols-[2fr_1.5fr_2fr_auto] gap-4 border-b border-slate-100 bg-slate-50 px-6 py-3 text-xs font-black uppercase tracking-widest text-slate-400 sm:grid">
          <span>Skill</span><span>Normalised</span><span>Category</span><span>Actions</span>
        </div>

        {loading ? (
          <div className="flex h-40 items-center justify-center gap-2 text-slate-400">
            <Loader2 className="animate-spin" size={20} /> Loading…
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-sm text-slate-400">No skills found.</div>
        ) : (
          <div className="divide-y divide-slate-50">
            <AnimatePresence>
              {filtered.map((s) => (
                <motion.div key={s.id} layout
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="flex flex-wrap items-center gap-4 px-6 py-4">
                  <div className="flex min-w-[140px] flex-1 items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50">
                      <Layers size={15} className="text-indigo-600" />
                    </div>
                    <p className="font-black text-slate-900">{s.skillName}</p>
                  </div>
                  <p className="flex-1 text-sm font-semibold text-blue-700">{s.normalizedName}</p>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${CAT_COLOR[s.category] ?? 'bg-slate-100 text-slate-600'}`}>
                    {s.category ?? 'General'}
                  </span>
                  <div className="flex gap-1">
                    <button onClick={() => setModal(s)}
                      className="rounded-lg p-2 text-slate-500 hover:bg-blue-50 hover:text-blue-600" aria-label="Edit">
                      <Edit3 size={16} />
                    </button>
                    <button onClick={() => remove(s.id)}
                      className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600" aria-label="Delete">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {modal && <SkillModal skill={modal === 'add' ? null : modal} onClose={() => setModal(null)} onSave={save} saving={saving} />}
    </>
  );
}

import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiEdit2, FiLayers, FiLoader, FiPlus, FiSearch, 
  FiTrash2, FiX, FiShield, FiChevronDown, FiBookOpen, 
  FiCheck, FiAlertCircle 
} from 'react-icons/fi';
import { adminService } from '../../services/adminService';

const CATEGORIES = ['Frontend', 'Backend', 'Database', 'Language', 'DevOps', 'Cloud', 'AI/ML', 'Tools', 'General'];

const inputCls =
  'w-full rounded-lg border border-neutral-200 bg-white px-3.5 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#0038FF] transition-all shadow-2xs font-sans';
const selectCls =
  'w-full appearance-none rounded-lg border border-neutral-200 bg-white pl-3.5 pr-9 py-2.5 text-sm text-neutral-900 outline-none focus:border-transparent focus:ring-2 focus:ring-[#0038FF] transition-all shadow-2xs cursor-pointer font-sans';

function SkillModal({ skill, onClose, onSave, saving }) {
  const [form, setForm] = useState(
    skill
      ? { skillName: skill.skillName, normalizedName: skill.normalizedName, category: skill.category ?? CATEGORIES[0], description: skill.description ?? '' }
      : { skillName: '', normalizedName: '', category: CATEGORIES[0], description: '' }
  );
  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-neutral-950/40 backdrop-blur-xs p-4" role="dialog" aria-modal="true">
      <div className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-6 sm:p-7 shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#0038FF]" />
            <h2 className="text-sm font-bold text-neutral-950 font-sans">
              {skill ? 'Edit Competency Node' : 'Register New Taxonomy Skill'}
            </h2>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-700 p-1">
            <FiX size={15} />
          </button>
        </div>

        <div className="space-y-4">
          <div className="space-y-1">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 font-mono">
              Raw Extracted Variant <span className="text-rose-500">*</span>
            </label>
            <input 
              value={form.skillName} 
              onChange={(e) => set('skillName', e.target.value)}
              className={inputCls} 
              placeholder="e.g. ReactJS, react.js, React-JS" 
            />
          </div>

          <div className="space-y-1">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 font-mono">
              Canonical Normalized Label <span className="text-rose-500">*</span>
            </label>
            <input 
              value={form.normalizedName} 
              onChange={(e) => set('normalizedName', e.target.value)}
              className={inputCls} 
              placeholder="e.g. React" 
            />
          </div>

          <div className="space-y-1">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 font-mono">
              Domain Category
            </label>
            <div className="relative">
              <select 
                value={form.category} 
                onChange={(e) => set('category', e.target.value)} 
                className={selectCls}
              >
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <FiChevronDown size={13} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 font-mono">
              Context / Description (Optional)
            </label>
            <input 
              value={form.description} 
              onChange={(e) => set('description', e.target.value)}
              className={inputCls} 
              placeholder="e.g. Declarative component-based UI library" 
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-neutral-100 font-mono">
          <button 
            type="button"
            onClick={onClose} 
            className="rounded-lg border border-neutral-200 px-4 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 transition-all"
          >
            Cancel
          </button>
          <button 
            type="button"
            onClick={() => onSave(form)} 
            disabled={saving || !form.skillName || !form.normalizedName}
            className="rounded-lg bg-[#0038FF] hover:bg-blue-700 text-white px-4 py-2 text-xs font-semibold shadow-xs transition-all disabled:opacity-60"
          >
            {saving ? 'Processing…' : skill ? 'Update Node' : 'Save Skill Node'}
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

  useEffect(() => { load(); }, []);

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

  const categories = useMemo(() => ['All', ...new Set(skills.map((s) => s.category).filter(Boolean))], [skills]);
  const filtered = useMemo(() => skills.filter((s) => {
    const matchQ = !query || s.skillName?.toLowerCase().includes(query.toLowerCase()) || s.normalizedName?.toLowerCase().includes(query.toLowerCase());
    const matchC = catFilter === 'All' || s.category === catFilter;
    return matchQ && matchC;
  }), [skills, query, catFilter]);

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto pb-12 antialiased selection:bg-[#0038FF] selection:text-white">
      
      {/* ── Top Header Ribbon ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200/80 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 font-mono">
              Curriculum & Extraction Engine
            </span>
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-blue-50 border border-blue-100 text-[#0038FF] text-[9px] font-bold font-mono uppercase">
              <FiShield size={9} /> Taxonomy Core
            </span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-neutral-950 mt-0.5">
            Skill Taxonomy & Normalization
          </h1>
          <p className="text-xs text-neutral-500 mt-1 font-mono">
            Manage canonical technology clusters, canonical alias mapping, and NLP extraction entity links.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setModal('add')}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#0038FF] hover:bg-blue-700 active:scale-[0.99] text-white text-xs font-semibold px-4 py-2 transition-all shadow-md shadow-blue-500/20"
          >
            <FiPlus size={14} />
            <span>Add Skill Node</span>
          </button>
        </div>
      </div>

      {/* ── Toolbar & Filter Strip ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative max-w-md flex-1">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" size={14} />
          <input 
            value={query} 
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && load()}
            placeholder="Search raw variants or normalized entities… (Enter to query)"
            className="w-full rounded-lg border border-neutral-200 bg-white pl-9 pr-3.5 py-2 text-xs text-neutral-900 placeholder-neutral-400 outline-none focus:border-transparent focus:ring-2 focus:ring-[#0038FF] transition-all shadow-2xs font-sans"
          />
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <div className="inline-flex items-center gap-1 rounded-lg border border-neutral-200 bg-white p-1 text-xs font-mono">
            {categories.map((c) => (
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
        </div>
      </div>

      {/* ── Taxonomy Registry Table Container ── */}
      <div className="bg-white border border-neutral-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="border-b border-neutral-100 bg-[#F8FAFC] px-6 py-3.5 flex items-center justify-between text-xs font-mono text-neutral-500">
          <span>Displaying {filtered.length} registered entity node{filtered.length !== 1 ? 's' : ''}</span>
          <span>ESCO / O*NET Calibrated</span>
        </div>

        {loading ? (
          <div className="py-16 text-center space-y-3">
            <FiLoader className="mx-auto text-neutral-400 animate-spin" size={22} />
            <p className="text-xs text-neutral-500 font-mono">Querying canonical taxonomy index...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center space-y-2">
            <FiAlertCircle size={24} className="mx-auto text-neutral-400" />
            <h3 className="text-sm font-bold text-neutral-900">No Skill Nodes Found</h3>
            <p className="text-xs text-neutral-500 font-mono">No entities match your search or domain category filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-xs">
              <thead>
                <tr className="border-b border-neutral-100 bg-[#F8FAFC] text-[10px] font-mono uppercase tracking-wider text-neutral-400">
                  <th className="px-6 py-3.5 font-semibold">Raw Variant / Source Token</th>
                  <th className="px-6 py-3.5 font-semibold">Normalized Canonical Entity</th>
                  <th className="px-6 py-3.5 font-semibold">Domain Classification</th>
                  <th className="px-6 py-3.5 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 font-mono">
                <AnimatePresence>
                  {filtered.map((s) => (
                    <motion.tr 
                      key={s.id} 
                      layout
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }} 
                      exit={{ opacity: 0 }}
                      className="hover:bg-neutral-50/70 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="grid h-7 w-7 shrink-0 place-items-center rounded bg-blue-50 text-[11px] text-[#0038FF] border border-blue-100">
                            <FiLayers size={13} />
                          </div>
                          <div>
                            <p className="font-bold text-neutral-950 font-sans text-xs">{s.skillName}</p>
                            {s.description && (
                              <p className="text-[11px] text-neutral-400 truncate max-w-xs">{s.description}</p>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-neutral-100 border border-neutral-200 text-neutral-800 text-xs font-semibold">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#0038FF]" />
                          {s.normalizedName}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-bold bg-blue-50 text-[#0038FF] border border-blue-100">
                          {s.category ?? 'General'}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button 
                            onClick={() => setModal(s)}
                            className="p-1.5 text-neutral-400 hover:text-[#0038FF] hover:bg-blue-50 rounded-lg transition-colors" 
                            aria-label="Edit node"
                          >
                            <FiEdit2 size={13} />
                          </button>
                          <button 
                            onClick={() => remove(s.id)}
                            className="p-1.5 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" 
                            aria-label="Delete node"
                          >
                            <FiTrash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modal && (
        <SkillModal 
          skill={modal === 'add' ? null : modal} 
          onClose={() => setModal(null)} 
          onSave={save} 
          saving={saving} 
        />
      )}
    </div>
  );
}
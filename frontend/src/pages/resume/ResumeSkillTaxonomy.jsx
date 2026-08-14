import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Layers, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import AppLayout from '../../components/layout/AppLayout';
import { getStudentSkills } from '../../services/resumeService';

const CAT_COLOR = {
  Frontend:    'bg-indigo-100 text-indigo-700',
  Backend:     'bg-purple-100 text-purple-700',
  Database:    'bg-teal-100 text-teal-700',
  Language:    'bg-blue-100 text-blue-700',
  DevOps:      'bg-orange-100 text-orange-700',
  Cloud:       'bg-sky-100 text-sky-700',
  'AI/ML':     'bg-pink-100 text-pink-700',
  Tools:       'bg-slate-200 text-slate-700',
  General:     'bg-slate-100 text-slate-600',
};

export default function ResumeSkillTaxonomy() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    getStudentSkills()
      .then((res) => setSkills(res.data ?? []))
      .catch(() => setError('Failed to load skill taxonomy. Please process your resume first.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <AppLayout>
      <div className="flex h-64 items-center justify-center gap-3 text-slate-500">
        <Loader2 className="animate-spin" size={22} /> Loading skill taxonomy…
      </div>
    </AppLayout>
  );

  if (error) return (
    <AppLayout>
      <div className="mx-auto max-w-lg py-16 text-center">
        <p className="font-bold text-red-600">{error}</p>
        <Link to="/resume/upload" className="mt-4 inline-block rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white">
          Upload Resume
        </Link>
      </div>
    </AppLayout>
  );

  const categories = ['All', ...new Set(skills.map((s) => s.category).filter(Boolean))];
  const filtered = filter === 'All' ? skills : skills.filter((s) => s.category === filter);

  return (
    <AppLayout>
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-blue-600">Module 3 · Taxonomy</p>
            <h1 className="mt-1 text-3xl font-black text-slate-950">Skill Taxonomy Mapping</h1>
            <p className="mt-1 text-slate-500">How extracted skills are normalised against the standard taxonomy.</p>
          </div>
          <Link to="/resume/analysis" className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-700">
            Quality Analysis <ArrowRight size={16} />
          </Link>
        </div>

        {/* Stats */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: 'Total Skills', value: skills.length, bg: 'bg-slate-100', color: 'text-slate-700' },
            { label: 'Categories',   value: categories.length - 1, bg: 'bg-blue-50', color: 'text-blue-700' },
            { label: 'High Confidence', value: skills.filter((s) => (s.confidence ?? 0) >= 0.85).length, bg: 'bg-emerald-50', color: 'text-emerald-700' },
            { label: 'Source: Resume',  value: skills.filter((s) => s.source === 'RESUME').length, bg: 'bg-indigo-50', color: 'text-indigo-700' },
          ].map(({ label, value, bg, color }) => (
            <div key={label} className={`rounded-2xl p-4 ${bg}`}>
              <p className={`text-2xl font-black ${color}`}>{value}</p>
              <p className={`text-xs font-bold ${color} opacity-70`}>{label}</p>
            </div>
          ))}
        </div>

        {/* Category filter */}
        <div className="mb-5 flex flex-wrap gap-2">
          {categories.map((c) => (
            <button key={c} onClick={() => setFilter(c)}
              className={`rounded-xl px-3 py-2 text-xs font-bold transition-all ${filter === c ? 'bg-blue-600 text-white' : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'}`}>
              {c}
            </button>
          ))}
        </div>

        {/* Skill mapping cards */}
        {filtered.length === 0
          ? <p className="py-12 text-center text-sm text-slate-500">No skills found for this category.</p>
          : (
            <div className="grid gap-4 sm:grid-cols-2">
              <AnimatePresence>
                {filtered.map((s, i) => (
                  <motion.div key={s.id} layout
                    initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                    className="card p-5">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-400 mb-4">
                      <Layers size={13} /> Skill Mapping
                      <span className={`ml-auto rounded-full px-2.5 py-0.5 text-[10px] font-bold ${CAT_COLOR[s.category] ?? 'bg-slate-100 text-slate-600'}`}>
                        {s.category ?? 'General'}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Raw name */}
                      <div className="flex-1 rounded-xl bg-slate-100 px-3 py-2 text-center">
                        <p className="text-[10px] font-bold uppercase text-slate-400">Extracted</p>
                        <p className="mt-0.5 font-black text-slate-800">{s.skillName}</p>
                      </div>
                      <ArrowRight size={16} className="shrink-0 text-blue-400" />
                      {/* Normalised name */}
                      <div className="flex-1 rounded-xl bg-blue-50 px-3 py-2 text-center">
                        <p className="text-[10px] font-bold uppercase text-blue-400">Normalised</p>
                        <p className="mt-0.5 font-black text-blue-700">{s.normalizedName}</p>
                      </div>
                    </div>

                    {/* Confidence bar */}
                    <div className="mt-3">
                      <div className="mb-1 flex justify-between text-[10px] font-bold text-slate-400">
                        <span>Confidence</span>
                        <span>{Math.round((s.confidence ?? 0) * 100)}%</span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                        <motion.div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"
                          initial={{ width: 0 }} animate={{ width: `${(s.confidence ?? 0) * 100}%` }}
                          transition={{ delay: i * 0.04, duration: 0.6 }} />
                      </div>
                    </div>

                    <p className="mt-3 text-[10px] font-semibold text-slate-400">Source: {s.source}</p>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
      </div>
    </AppLayout>
  );
}

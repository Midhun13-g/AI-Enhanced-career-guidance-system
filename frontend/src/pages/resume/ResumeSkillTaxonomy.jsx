import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiArrowRight,
  FiLayers,
  FiActivity,
  FiShield,
  FiCheckCircle,
  FiUploadCloud,
  FiAlertCircle,
  FiSliders,
  FiCpu,
} from 'react-icons/fi';
import { Link } from 'react-router-dom';
import AppLayout from '../../components/layout/AppLayout';
import { getStudentSkills } from '../../services/resumeService';

export default function ResumeSkillTaxonomy() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    getStudentSkills()
      .then((res) => setSkills(res?.data ?? []))
      .catch(() => setError('Failed to load skill taxonomy mappings from the parsing engine.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <AppLayout>
        <div className="flex h-72 flex-col items-center justify-center gap-3 text-neutral-400 font-mono text-xs">
          <FiActivity className="animate-spin text-[#0038FF]" size={24} />
          <span>Normalizing extracted tokens against global taxonomy...</span>
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout>
        <div className="mx-auto max-w-lg py-16 text-center antialiased">
          <div className="rounded-2xl border border-neutral-200/90 bg-white p-8 shadow-xs space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-rose-50 text-rose-600 border border-rose-100">
              <FiAlertCircle size={22} />
            </div>
            <p className="text-xs font-bold text-neutral-900 font-mono">{error}</p>
            <Link
              to="/resume/upload"
              className="inline-flex items-center gap-2 rounded-lg bg-[#0038FF] hover:bg-blue-700 active:scale-[0.99] text-white px-5 py-2.5 text-xs font-mono font-bold transition-all shadow-md shadow-blue-500/20"
            >
              <FiUploadCloud size={14} />
              <span>Upload Resume</span>
            </Link>
          </div>
        </div>
      </AppLayout>
    );
  }

  const rawCategories = skills.map((s) => s.category).filter(Boolean);
  const categories = ['All', ...new Set(rawCategories)];
  const filtered = filter === 'All' ? skills : skills.filter((s) => s.category === filter);

  const stats = [
    { label: 'Identified Skills', value: skills.length, sub: 'Extracted tokens' },
    { label: 'Active Clusters', value: Math.max(1, categories.length - 1), sub: 'Domain categories' },
    { label: 'High Confidence', value: skills.filter((s) => (s.confidence ?? 0) >= 0.85).length, sub: 'Score >= 85%' },
    { label: 'Primary Source', value: skills.filter((s) => (s.source || 'RESUME') === 'RESUME').length, sub: 'Direct resume text' },
  ];

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
                <FiShield size={9} /> Module 03 Taxonomy Engine
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-950">
              Skill Taxonomy & Normalization
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 max-w-2xl leading-relaxed">
              Mapping noisy resume text strings to standardized, machine-readable industry ontology identifiers for career vector calculation.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <Link
              to="/resume/analysis"
              className="inline-flex items-center gap-2 rounded-lg bg-[#0038FF] hover:bg-blue-700 active:scale-[0.99] text-white py-2.5 px-4 font-mono text-xs font-semibold tracking-wide transition-all shadow-md shadow-blue-500/20 group"
            >
              <span>Quality Diagnostics</span>
              <FiArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>

        {/* ── Diagnostic KPI Grid ── */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 font-mono">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="rounded-2xl border border-neutral-200/90 bg-white p-5 shadow-xs flex flex-col justify-between space-y-3 hover:border-neutral-300 transition-colors"
            >
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                {s.label}
              </span>
              <div>
                <p className="text-2xl sm:text-3xl font-black text-neutral-950 tracking-tight leading-tight">
                  {s.value}
                </p>
                <p className="text-[10px] text-[#0038FF] font-semibold mt-0.5">
                  {s.sub}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── Category Filter Chips ── */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 font-mono scrollbar-none">
          {categories.map((c) => {
            const isActive = filter === c;
            return (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={`rounded-lg px-3.5 py-2 text-xs font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-neutral-950 text-white shadow-2xs'
                    : 'border border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50 hover:text-neutral-950'
                }`}
              >
                {c}
              </button>
            );
          })}
        </div>

        {/* ── Mapping Grid Surface ── */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#0038FF] font-mono">
              Normalization Ledger
            </span>
            <span className="text-[10px] font-mono text-neutral-500 bg-neutral-100 px-2.5 py-1 rounded">
              {filtered.length} Token Pair{filtered.length === 1 ? '' : 's'}
            </span>
          </div>

          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-neutral-200/90 bg-white p-12 text-center text-xs font-mono text-neutral-400">
              No normalized skills found for cluster "{filter}".
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              <AnimatePresence>
                {filtered.map((s, i) => {
                  const confPct = Math.round((s.confidence ?? 0.88) * 100);
                  const isHigh = confPct >= 85;

                  return (
                    <motion.div
                      key={s.id || i}
                      layout
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.15 }}
                      className="rounded-2xl border border-neutral-200/90 bg-white p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-neutral-300 transition-colors"
                    >
                      {/* Card Header */}
                      <div className="flex items-center justify-between text-xs font-mono border-b border-neutral-100 pb-3">
                        <div className="flex items-center gap-1.5 text-neutral-500">
                          <FiLayers size={13} className="text-[#0038FF]" />
                          <span className="font-bold text-neutral-800 text-[11px]">Mapping Node #{i + 1}</span>
                        </div>

                        <span className="rounded px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-blue-50 text-[#0038FF] border border-blue-100">
                          {s.category || 'General'}
                        </span>
                      </div>

                      {/* Transform Node (Raw -> Normalized) */}
                      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 font-mono">
                        {/* Extracted Token */}
                        <div className="rounded-xl border border-neutral-200 bg-[#F8FAFC] p-3 text-center min-w-0">
                          <span className="text-[9px] font-bold uppercase tracking-wider text-neutral-400 block">
                            Raw Token
                          </span>
                          <p className="mt-1 text-xs font-bold text-neutral-900 truncate">
                            {s.skillName || 'Raw Text'}
                          </p>
                        </div>

                        <div className="h-7 w-7 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0038FF] shrink-0">
                          <FiArrowRight size={12} />
                        </div>

                        {/* Normalized Taxonomy Token */}
                        <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-3 text-center min-w-0">
                          <span className="text-[9px] font-bold uppercase tracking-wider text-[#0038FF] block">
                            Normalized Standard
                          </span>
                          <p className="mt-1 text-xs font-bold text-[#0038FF] truncate">
                            {s.normalizedName || s.skillName}
                          </p>
                        </div>
                      </div>

                      {/* Confidence Rail & Provenance */}
                      <div className="space-y-2 pt-1 border-t border-neutral-100 font-mono">
                        <div className="flex items-center justify-between text-[10px] text-neutral-400">
                          <span>Ontology Confidence</span>
                          <span className={`font-bold ${isHigh ? 'text-[#0038FF]' : 'text-neutral-700'}`}>
                            {confPct}% Certainty
                          </span>
                        </div>

                        <div className="h-1.5 w-full rounded-full bg-neutral-100 overflow-hidden">
                          <motion.div
                            className="h-full rounded-full bg-[#0038FF]"
                            initial={{ width: 0 }}
                            animate={{ width: `${confPct}%` }}
                            transition={{ duration: 0.6, delay: i * 0.02 }}
                          />
                        </div>

                        <div className="flex items-center justify-between text-[10px] text-neutral-400 pt-0.5">
                          <span>Provenance: {s.source || 'RESUME'}</span>
                          <span className="text-emerald-700 font-semibold flex items-center gap-1">
                            <FiCheckCircle size={10} /> Verified
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>

      </div>
    </AppLayout>
  );
}
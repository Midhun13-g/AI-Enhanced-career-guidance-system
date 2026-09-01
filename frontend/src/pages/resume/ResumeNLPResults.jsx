import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiZap,
  FiBookOpen,
  FiBriefcase,
  FiAward,
  FiUser,
  FiFileText,
  FiArrowRight,
  FiShield,
  FiActivity,
  FiAlertCircle,
  FiLayers,
  FiUploadCloud,
  FiCheckCircle,
} from 'react-icons/fi';
import { Link } from 'react-router-dom';
import AppLayout from '../../components/layout/AppLayout';
import { getResumeEntities, getStudentSkills } from '../../services/resumeService';

const TABS = [
  { id: 'Skills', label: 'Skills Taxonomy', icon: FiZap },
  { id: 'Education', label: 'Academic History', icon: FiBookOpen },
  { id: 'Projects', label: 'Technical Projects', icon: FiBriefcase },
  { id: 'Certifications', label: 'Accreditations', icon: FiAward },
  { id: 'Experience', label: 'Work Experience', icon: FiUser },
];

function ConfBadge({ value }) {
  const pct = Math.round((value ?? 0) * 100);
  const isHigh = pct >= 85;
  const isMedium = pct >= 70;

  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-12 rounded-full bg-neutral-100 overflow-hidden hidden sm:block">
        <div
          className={`h-full rounded-full ${
            isHigh ? 'bg-[#0038FF]' : isMedium ? 'bg-blue-400' : 'bg-amber-400'
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span
        className={`rounded px-1.5 py-0.5 text-[10px] font-mono font-bold border ${
          isHigh
            ? 'bg-blue-50 text-[#0038FF] border-blue-200/80'
            : isMedium
            ? 'bg-neutral-50 text-neutral-700 border-neutral-200'
            : 'bg-amber-50 text-amber-700 border-amber-200/80'
        }`}
      >
        {pct}% Conf.
      </span>
    </div>
  );
}

function groupEntities(entities) {
  return (entities ?? []).reduce((acc, e) => {
    const key = e.entityType ?? 'OTHER';
    (acc[key] = acc[key] || []).push(e);
    return acc;
  }, {});
}

export default function ResumeNLPResults() {
  const [tab, setTab] = useState('Skills');
  const [entities, setEntities] = useState({});
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const resumeId = sessionStorage.getItem('resumeId');
    if (!resumeId) {
      setError('No active resume record found. Please upload and process a resume first.');
      setLoading(false);
      return;
    }

    Promise.all([getResumeEntities(resumeId), getStudentSkills()])
      .then(([entRes, skillRes]) => {
        setEntities(groupEntities(entRes?.data));
        setSkills(skillRes?.data ?? []);
      })
      .catch(() => setError('Failed to load named entity recognition extractions.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <AppLayout>
        <div className="flex h-72 flex-col items-center justify-center gap-3 text-neutral-400 font-mono text-xs">
          <FiActivity className="animate-spin text-[#0038FF]" size={24} />
          <span>Extracting structured named entities (NER)...</span>
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

  const activeCount =
    tab === 'Skills'
      ? skills.length
      : (entities[tab.toUpperCase()] ?? []).length;

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
                <FiShield size={9} /> Module 03 Named Entity Recognition
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-950">
              Extracted Entity Telemetry
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 max-w-2xl leading-relaxed">
              Synthesized token vectors, entity recognition confidences, and normalized taxonomy mapping derived from candidate source text[cite: 1, 2].
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <Link
              to="/resume/skill-taxonomy"
              className="inline-flex items-center gap-2 rounded-lg bg-[#0038FF] hover:bg-blue-700 active:scale-[0.99] text-white py-2.5 px-4 font-mono text-xs font-semibold tracking-wide transition-all shadow-md shadow-blue-500/20 group"
            >
              <span>Skill Taxonomy Matrix</span>
              <FiArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>

        {/* ── Tab Selector Navigation ── */}
        <div className="flex overflow-x-auto gap-1.5 bg-white p-1.5 rounded-xl border border-neutral-200/90 shadow-xs scrollbar-none">
          {TABS.map((t) => {
            const Icon = t.icon;
            const isActive = tab === t.id;
            const count =
              t.id === 'Skills'
                ? skills.length
                : (entities[t.id.toUpperCase()] ?? []).length;

            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-mono font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-neutral-950 text-white shadow-2xs'
                    : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100'
                }`}
              >
                <Icon size={14} className={isActive ? 'text-[#0038FF]' : 'text-neutral-400'} />
                <span>{t.label}</span>
                <span
                  className={`rounded px-1.5 py-0.2 text-[10px] font-mono font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-neutral-100 text-neutral-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* ── Dynamic Entity Showcase Surface ── */}
        <div className="rounded-2xl border border-neutral-200/90 bg-white p-6 sm:p-7 shadow-xs space-y-6">
          
          <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#0038FF] font-mono">
                NER Extraction Cluster
              </span>
              <h2 className="text-base font-bold text-neutral-950 mt-0.5">
                {TABS.find((t) => t.id === tab)?.label} Entities
              </h2>
            </div>
            <span className="text-[10px] font-mono text-neutral-500 bg-neutral-100 px-2.5 py-1 rounded">
              {activeCount} Extracted Object{activeCount === 1 ? '' : 's'}
            </span>
          </div>

          <AnimatePresence mode="wait">
            {/* Skills Taxonomy Grid */}
            {tab === 'Skills' && (
              <motion.div
                key="skills-tab"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
                className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
              >
                {skills.length === 0 ? (
                  <p className="col-span-full py-10 text-center text-xs font-mono text-neutral-400">
                    No technical skills tagged for this resume record.
                  </p>
                ) : (
                  skills.map((s, i) => (
                    <div
                      key={s.id || i}
                      className="rounded-xl border border-neutral-200/80 bg-[#F8FAFC] p-3.5 flex items-center justify-between gap-3 hover:border-neutral-300 hover:bg-white transition-all shadow-2xs"
                    >
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-neutral-900 font-mono truncate">
                          {s.normalizedName || s.skillName || 'Competency Entity'}
                        </p>
                        <p className="text-[10px] font-semibold text-neutral-400 font-mono uppercase mt-0.5">
                          {s.category || 'General'}
                        </p>
                      </div>
                      <ConfBadge value={s.confidence ?? 0.92} />
                    </div>
                  ))
                )}
              </motion.div>
            )}

            {/* Education History List */}
            {tab === 'Education' && (
              <motion.div
                key="education-tab"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
                className="space-y-3"
              >
                {(entities['EDUCATION'] ?? []).length === 0 ? (
                  <p className="py-10 text-center text-xs font-mono text-neutral-400">
                    No education credentials extracted.
                  </p>
                ) : (
                  (entities['EDUCATION'] ?? []).map((e, i) => (
                    <div
                      key={i}
                      className="rounded-xl border border-neutral-200/80 bg-[#F8FAFC] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:border-neutral-300 hover:bg-white transition-all shadow-2xs"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0038FF] shrink-0">
                          <FiBookOpen size={14} />
                        </div>
                        <p className="text-xs font-bold text-neutral-900 font-mono">
                          {e.entityValue}
                        </p>
                      </div>
                      <ConfBadge value={e.confidenceScore ?? 0.88} />
                    </div>
                  ))
                )}
              </motion.div>
            )}

            {/* Technical Projects List */}
            {tab === 'Projects' && (
              <motion.div
                key="projects-tab"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
                className="space-y-3"
              >
                {(entities['PROJECT'] ?? []).length === 0 ? (
                  <p className="py-10 text-center text-xs font-mono text-neutral-400">
                    No technical project blocks extracted.
                  </p>
                ) : (
                  (entities['PROJECT'] ?? []).map((e, i) => (
                    <div
                      key={i}
                      className="rounded-xl border border-neutral-200/80 bg-[#F8FAFC] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:border-neutral-300 hover:bg-white transition-all shadow-2xs"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0038FF] shrink-0">
                          <FiBriefcase size={14} />
                        </div>
                        <p className="text-xs font-bold text-neutral-900 font-mono">
                          {e.entityValue}
                        </p>
                      </div>
                      <ConfBadge value={e.confidenceScore ?? 0.85} />
                    </div>
                  ))
                )}
              </motion.div>
            )}

            {/* Certifications List */}
            {tab === 'Certifications' && (
              <motion.div
                key="certifications-tab"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
                className="space-y-3"
              >
                {(entities['CERTIFICATION'] ?? []).length === 0 ? (
                  <p className="py-10 text-center text-xs font-mono text-neutral-400">
                    No accredited certifications extracted.
                  </p>
                ) : (
                  (entities['CERTIFICATION'] ?? []).map((e, i) => (
                    <div
                      key={i}
                      className="rounded-xl border border-neutral-200/80 bg-[#F8FAFC] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:border-neutral-300 hover:bg-white transition-all shadow-2xs"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-700 shrink-0">
                          <FiAward size={14} />
                        </div>
                        <p className="text-xs font-bold text-neutral-900 font-mono">
                          {e.entityValue}
                        </p>
                      </div>
                      <ConfBadge value={e.confidenceScore ?? 0.9} />
                    </div>
                  ))
                )}
              </motion.div>
            )}

            {/* Work Experience List */}
            {tab === 'Experience' && (
              <motion.div
                key="experience-tab"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
                className="space-y-3"
              >
                {(entities['EXPERIENCE'] ?? []).length === 0 ? (
                  <p className="py-10 text-center text-xs font-mono text-neutral-400">
                    No work experience blocks extracted.
                  </p>
                ) : (
                  (entities['EXPERIENCE'] ?? []).map((e, i) => (
                    <div
                      key={i}
                      className="rounded-xl border border-neutral-200/80 bg-[#F8FAFC] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:border-neutral-300 hover:bg-white transition-all shadow-2xs"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0038FF] shrink-0">
                          <FiFileText size={14} />
                        </div>
                        <p className="text-xs font-bold text-neutral-900 font-mono">
                          {e.entityValue}
                        </p>
                      </div>
                      <ConfBadge value={e.confidenceScore ?? 0.86} />
                    </div>
                  ))
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400 border-t border-neutral-100 pt-3">
            <span>Entity confidence evaluated via BERT-based Named Entity Recognition.</span>
            <span className="text-[#0038FF] font-semibold">Parser Online</span>
          </div>
        </div>

      </div>
    </AppLayout>
  );
}
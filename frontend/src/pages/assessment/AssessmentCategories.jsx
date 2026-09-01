import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  FiSearch,
  FiBookOpen,
  FiClock,
  FiArrowRight,
  FiLayers,
  FiAlertCircle,
  FiTarget,
} from 'react-icons/fi';
import AppLayout from '../../components/layout/AppLayout';
import api from '../../services/api';

const difficultyBadge = (val) => {
  const level = (val || '').toUpperCase();
  switch (level) {
    case 'EASY':
    case 'FOUNDATIONAL':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200/80';
    case 'MEDIUM':
    case 'INTERMEDIATE':
      return 'bg-blue-50 text-[#0038FF] border-blue-200/80';
    case 'HARD':
    case 'ADVANCED':
      return 'bg-amber-50 text-amber-700 border-amber-200/80';
    case 'EXPERT':
      return 'bg-rose-50 text-rose-700 border-rose-200/80';
    default:
      return 'bg-neutral-100 text-neutral-600 border-neutral-200';
  }
};

export default function AssessmentCategories() {
  const navigate = useNavigate();
  const [assessments, setAssessments] = useState([]);
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/api/assessment/published')
      .then(({ data }) => setAssessments(data || []))
      .catch(() => setError('Unable to load standard examination modules.'))
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(() => {
    const set = new Set(assessments.map((a) => a.category).filter(Boolean));
    return ['ALL', ...Array.from(set)];
  }, [assessments]);

  const visible = useMemo(() => {
    return assessments.filter((item) => {
      const matchesSearch = `${item.title} ${item.description} ${item.category} ${item.difficulty}`
        .toLowerCase()
        .includes(query.toLowerCase());
      const matchesCategory =
        activeCategory === 'ALL' ||
        (item.category || '').toLowerCase() === activeCategory.toLowerCase();
      return matchesSearch && matchesCategory;
    });
  }, [assessments, query, activeCategory]);

  const openAssessment = (assessment) => {
    navigate('/assessments/details', {
      state: {
        assessment: {
          title: assessment.title,
          description: assessment.description,
          category: assessment.category,
          difficulty: assessment.difficulty,
          duration: `${assessment.durationMinutes} minutes`,
          questions: assessment.totalQuestions,
          passingScore: assessment.passingPercentage,
          maxAttempts: assessment.maximumAttempts,
          instructions: assessment.instructions,
          id: assessment.id,
        },
      },
    });
  };

  return (
    <AppLayout>
      <div className="space-y-8 max-w-[1400px] mx-auto antialiased selection:bg-[#0038FF] selection:text-white">
        
        {/* ── Editorial Header ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-neutral-200/80 pb-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 font-mono">
                Evaluation Directory
              </span>
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-blue-50 border border-blue-100 text-[#0038FF] text-[9px] font-bold font-mono uppercase">
                <FiTarget size={9} /> Standardized Benchmarks
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-950">
              Diagnostic & Competency Assessments
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 max-w-2xl leading-relaxed">
              Curated evaluations designed to validate technical proficiency, structural problem-solving, and domain readiness against academic criteria.
            </p>
          </div>

          <div className="text-xs font-mono text-neutral-400 flex items-center gap-1.5 shrink-0 self-start md:self-end">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span>Repository Online</span>
          </div>
        </div>

        {/* ── Search & Filter Controls ── */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="relative w-full max-w-md">
            <FiSearch
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none"
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search assessment modules, topics, or tiers..."
              className="w-full rounded-lg border border-neutral-200 bg-white pl-10 pr-4 py-2.5 text-xs sm:text-sm text-neutral-900 placeholder-neutral-400 outline-none focus:border-transparent focus:ring-2 focus:ring-[#0038FF] transition-all shadow-2xs"
            />
          </div>

          {/* Track Filter Pills */}
          {categories.length > 1 && (
            <div className="flex items-center gap-1.5 overflow-x-auto py-1 overscroll-contain">
              {categories.map((cat) => {
                const active = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-mono transition-all uppercase tracking-wider shrink-0 ${
                      active
                        ? 'bg-[#0038FF] text-white font-bold shadow-xs'
                        : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50 hover:text-neutral-950'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Content States ── */}
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((idx) => (
              <div
                key={idx}
                className="h-64 animate-pulse rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-xs"
              >
                <div className="flex justify-between">
                  <div className="h-10 w-10 rounded-xl bg-neutral-100" />
                  <div className="h-5 w-20 rounded bg-neutral-100" />
                </div>
                <div className="mt-6 space-y-2.5">
                  <div className="h-4 w-3/4 rounded bg-neutral-100" />
                  <div className="h-3 w-full rounded bg-neutral-100" />
                  <div className="h-3 w-5/6 rounded bg-neutral-100" />
                </div>
                <div className="mt-8 h-9 rounded-lg bg-neutral-100" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="flex items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50/50 p-6 text-xs text-rose-700 font-mono">
            <FiAlertCircle size={18} className="shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        ) : visible.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-neutral-200 bg-white p-16 text-center shadow-xs">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-100 text-neutral-400">
              <FiBookOpen size={22} />
            </div>
            <h2 className="mt-4 text-sm font-bold text-neutral-900">
              No Matching Assessments Found
            </h2>
            <p className="mt-1 text-xs text-neutral-500 max-w-sm mx-auto">
              No published examination modules match your query. Adjust search terms or check back once faculty post new modules.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs font-mono text-neutral-400 px-1">
              <span>
                Showing <strong className="text-neutral-900">{visible.length}</strong> available module{visible.length === 1 ? '' : 's'}
              </span>
              <span>Passing Standard: 60%+</span>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {visible.map((assessment, index) => {
                return (
                  <motion.article
                    key={assessment.id || index}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.04 }}
                    className="flex flex-col justify-between rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs hover:border-[#0038FF]/40 hover:shadow-md hover:shadow-blue-500/5 transition-all group"
                  >
                    <div>
                      {/* Card Header & Badges */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50/80 border border-blue-100 text-[#0038FF] group-hover:bg-[#0038FF] group-hover:text-white transition-colors">
                          <FiBookOpen size={18} />
                        </div>
                        <div className="flex flex-wrap items-center justify-end gap-1.5">
                          <span className="rounded-md border border-neutral-200 bg-neutral-50 px-2 py-0.5 text-[10px] font-mono font-semibold uppercase tracking-wider text-neutral-600">
                            {assessment.category || 'General'}
                          </span>
                          <span
                            className={`rounded-md border px-2 py-0.5 text-[10px] font-mono font-semibold uppercase tracking-wider ${difficultyBadge(
                              assessment.difficulty
                            )}`}
                          >
                            {assessment.difficulty || 'Intermediate'}
                          </span>
                        </div>
                      </div>

                      {/* Title & Description */}
                      <h2 className="mt-4 text-base font-bold tracking-tight text-neutral-950 group-hover:text-[#0038FF] transition-colors leading-snug">
                        {assessment.title}
                      </h2>
                      <p className="mt-2 line-clamp-2 text-xs text-neutral-500 leading-relaxed">
                        {assessment.description || 'Structured assessment benchmarking core domain proficiencies and algorithmic reasoning.'}
                      </p>
                    </div>

                    {/* Meta Specifications & Action */}
                    <div className="mt-6 pt-4 border-t border-neutral-100 space-y-4">
                      <div className="flex items-center justify-between text-xs font-mono text-neutral-500">
                        <span className="flex items-center gap-1.5">
                          <FiLayers size={13} className="text-neutral-400" />
                          {assessment.totalQuestions || 20} Questions
                        </span>
                        <span className="flex items-center gap-1.5">
                          <FiClock size={13} className="text-neutral-400" />
                          {assessment.durationMinutes || 30} mins
                        </span>
                      </div>

                      <button
                        onClick={() => openAssessment(assessment)}
                        className="w-full flex items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-white hover:bg-[#0038FF] hover:border-[#0038FF] text-neutral-800 hover:text-white py-2.5 text-xs font-semibold tracking-wide font-mono transition-all shadow-2xs hover:shadow-md hover:shadow-blue-500/20"
                      >
                        <span>Examine Module</span>
                        <FiArrowRight size={13} className="transition-transform group-hover:translate-x-0.5 text-neutral-400 group-hover:text-white" />
                      </button>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </AppLayout>
  );
}
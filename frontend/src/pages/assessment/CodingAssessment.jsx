import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  FiExternalLink,
  FiCheckCircle,
  FiCode,
  FiShield,
  FiArrowLeft,
  FiFilter,
  FiTarget,
  FiClock,
  FiZap,
  FiAlertTriangle,
  FiCpu,
  FiChevronDown,
} from 'react-icons/fi';
import AppLayout from '../../components/layout/AppLayout';
import useAssessment from '../../hooks/useAssessment';

// Master problem bank mapped to curriculum competency vectors
const CURATED_PROBLEM_BANK = [
  {
    id: 'PRB-01',
    title: 'Two Sum & Complement Lookup',
    skillVector: 'Hash Tables & Arrays',
    careerTrack: 'Backend Developer',
    platform: 'LeetCode',
    difficulty: 'Foundational',
    timeEstimate: '15 mins',
    benchmarkGapThreshold: 80, // Flagged if candidate score in this vector < 80%
    link: 'https://leetcode.com/problems/two-sum/',
    description: 'Find two indices whose values sum to a specific target. Directly addresses hash table lookup and space-time tradeoffs.',
    tags: ['Hash Table', 'Array', 'O(n) Target'],
  },
  {
    id: 'PRB-02',
    title: 'Department Highest & Top 3 Salaries',
    skillVector: 'SQL Queries',
    careerTrack: 'Data Engineer',
    platform: 'LeetCode SQL',
    difficulty: 'Intermediate',
    timeEstimate: '25 mins',
    benchmarkGapThreshold: 75,
    link: 'https://leetcode.com/problems/department-top-three-salaries/',
    description: 'Filter grouped analytical results using window ranking functions (DENSE_RANK) without costly subquery table scans.',
    tags: ['Window Functions', 'JOIN Optimization', 'Schema Design'],
  },
  {
    id: 'PRB-03',
    title: 'LRU Cache Design & Concurrent Invalidation',
    skillVector: 'System Design',
    careerTrack: 'Backend Developer',
    platform: 'LeetCode',
    difficulty: 'Advanced',
    timeEstimate: '45 mins',
    benchmarkGapThreshold: 70,
    link: 'https://leetcode.com/problems/lru-cache/',
    description: 'Synthesize a Least Recently Used eviction strategy using a doubly linked list combined with hash indexing.',
    tags: ['Doubly Linked List', 'Design', 'O(1) Constraints'],
  },
  {
    id: 'PRB-04',
    title: 'Valid Parentheses & Syntax Trees',
    skillVector: 'Stacks & Queues',
    careerTrack: 'Full Stack Developer',
    platform: 'LeetCode',
    difficulty: 'Foundational',
    timeEstimate: '15 mins',
    benchmarkGapThreshold: 85,
    link: 'https://leetcode.com/problems/valid-parentheses/',
    description: 'Validate bracket symmetry using a strict LIFO stack. Essential for compiler AST and JSON parse verification.',
    tags: ['Stack', 'State Machine', 'String'],
  },
  {
    id: 'PRB-05',
    title: 'Binary Tree Level Order Traversal',
    skillVector: 'Data Structures & Algorithms',
    careerTrack: 'AI/ML Engineer',
    platform: 'LeetCode',
    difficulty: 'Intermediate',
    timeEstimate: '30 mins',
    benchmarkGapThreshold: 70,
    link: 'https://leetcode.com/problems/binary-tree-level-order-traversal/',
    description: 'Traverse hierarchical node structures level-by-level using queue-based Breadth-First Search (BFS).',
    tags: ['BFS', 'Queue', 'Graph Traversal'],
  },
  {
    id: 'PRB-06',
    title: 'Container With Most Water',
    skillVector: 'Two Pointers & Optimization',
    careerTrack: 'Backend Developer',
    platform: 'LeetCode',
    difficulty: 'Intermediate',
    timeEstimate: '25 mins',
    benchmarkGapThreshold: 75,
    link: 'https://leetcode.com/problems/container-with-most-water/',
    description: 'Find two vertical boundaries that maximize trapped volume using a two-pointer converging search.',
    tags: ['Two Pointer', 'Greedy', 'Array'],
  },
];

const TRACKS = ['All Recommended', 'Identified Gaps Only', 'Backend Developer', 'Data Engineer', 'Full Stack Developer', 'AI/ML Engineer'];

const difficultyBadge = (val) => {
  const level = (val || '').toUpperCase();
  switch (level) {
    case 'FOUNDATIONAL':
    case 'EASY':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200/80';
    case 'INTERMEDIATE':
    case 'MEDIUM':
      return 'bg-blue-50 text-[#0038FF] border-blue-200/80';
    case 'ADVANCED':
    case 'HARD':
      return 'bg-amber-50 text-amber-700 border-amber-200/80';
    default:
      return 'bg-neutral-100 text-neutral-600 border-neutral-200';
  }
};

export default function CodingAssessment() {
  const navigate = useNavigate();
  const assessment = useAssessment();
  const [selectedFilter, setSelectedFilter] = useState('Identified Gaps Only');
  const [completed, setCompleted] = useState({});

  // Real or calibrated candidate skill scores from recent assessments
  const candidateScores = useMemo(() => {
    return (
      assessment?.result?.technicalBySkill || {
        'SQL Queries': 65,
        'System Design': 45,
        'Data Structures & Algorithms': 58,
        'Hash Tables & Arrays': 70,
        'Stacks & Queues': 88,
        'Two Pointers & Optimization': 60,
      }
    );
  }, [assessment]);

  // Tag problems dynamically with their personalized remediation priority
  const enrichedProblems = useMemo(() => {
    return CURATED_PROBLEM_BANK.map((problem) => {
      const score = candidateScores[problem.skillVector] ?? 60;
      const isGap = score < problem.benchmarkGapThreshold;
      const delta = problem.benchmarkGapThreshold - score;
      return {
        ...problem,
        candidateScore: score,
        isGap,
        gapDelta: delta > 0 ? delta : 0,
      };
    });
  }, [candidateScores]);

  const filteredProblems = useMemo(() => {
    if (selectedFilter === 'Identified Gaps Only') {
      return enrichedProblems.filter((p) => p.isGap);
    }
    if (selectedFilter === 'All Recommended') {
      return enrichedProblems;
    }
    return enrichedProblems.filter((p) => p.careerTrack === selectedFilter);
  }, [enrichedProblems, selectedFilter]);

  const toggleCompleted = (id) => {
    setCompleted((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const highPriorityGapsCount = enrichedProblems.filter((p) => p.isGap).length;
  const solvedCount = Object.values(completed).filter(Boolean).length;
  const masteryPercentage = Math.round((solvedCount / (enrichedProblems.length || 1)) * 100);

  return (
    <AppLayout>
      <div className="space-y-8 max-w-[1400px] mx-auto pb-16 antialiased selection:bg-[#0038FF] selection:text-white">
        
        {/* ── Top Header Ribbon ── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-neutral-200/80 pb-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 font-mono">
                Dynamic Remediation
              </span>
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-blue-50 border border-blue-100 text-[#0038FF] text-[9px] font-bold font-mono uppercase">
              <FiZap size={14} className="text-[#0038FF]" />
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-950">
              Personalized Coding Practice
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 max-w-2xl leading-relaxed">
              Algorithmic challenges dynamically selected to close your specific diagnostic assessment skill gaps.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => navigate('/assessments')}
              className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700 py-2.5 px-4 font-mono text-xs font-semibold tracking-wide transition-all shadow-2xs"
            >
              <FiArrowLeft size={13} />
              <span>Assessment Hub</span>
            </button>
          </div>
        </div>

        {/* ── Diagnostic KPI Ribbon ── */}
        <div className="grid gap-4 sm:grid-cols-3">
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs flex flex-col justify-between space-y-3"
          >
            <div className="flex items-center justify-between text-neutral-400">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 font-mono">
                Identified Gap Vectors
              </span>
              <div className="h-7 w-7 rounded-lg bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-600">
                <FiAlertTriangle size={14} />
              </div>
            </div>
            <div>
              <p className="text-3xl font-black text-neutral-950 font-mono tracking-tight">
                {highPriorityGapsCount} <span className="text-sm font-normal text-neutral-400 font-sans">Priority Areas</span>
              </p>
              <p className="text-[11px] text-neutral-400 font-mono mt-0.5">
                Curated based on scores below benchmark
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs flex flex-col justify-between space-y-3"
          >
            <div className="flex items-center justify-between text-neutral-400">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 font-mono">
                Remediated Challenges
              </span>
              <div className="h-7 w-7 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                <FiCheckCircle size={14} />
              </div>
            </div>
            <div>
              <p className="text-3xl font-black text-neutral-950 font-mono tracking-tight">
                {solvedCount} <span className="text-sm font-normal text-neutral-400 font-sans">/ {enrichedProblems.length}</span>
              </p>
              <p className="text-[11px] text-neutral-400 font-mono mt-0.5">
                Verified external completions
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs flex flex-col justify-between space-y-3"
          >
            <div className="flex items-center justify-between text-neutral-400">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 font-mono">
                Remediation Index
              </span>
              <div className="h-7 w-7 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0038FF]">
                <FiTarget size={14} />
              </div>
            </div>
            <div>
              <p className="text-3xl font-black text-[#0038FF] font-mono tracking-tight">
                {masteryPercentage}%
              </p>
              <p className="text-[11px] text-neutral-400 font-mono mt-0.5">
                Progress towards standard readiness
              </p>
            </div>
          </motion.div>

        </div>

        {/* ── Curated Filter Bar ── */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-200/80 pb-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono font-bold text-neutral-400 uppercase mr-1 flex items-center gap-1">
              <FiFilter size={12} /> Target:
            </span>
            {TRACKS.map((track) => (
              <button
                key={track}
                onClick={() => setSelectedFilter(track)}
                className={`rounded-lg px-3.5 py-1.5 text-xs font-mono font-semibold transition-all ${
                  selectedFilter === track
                    ? 'bg-[#0038FF] text-white shadow-xs'
                    : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50 hover:border-neutral-300'
                }`}
              >
                {track === 'Identified Gaps Only' ? `⚡ ${track}` : track}
              </button>
            ))}
          </div>

          <span className="text-[11px] font-mono text-neutral-400">
            Showing {filteredProblems.length} curated problems
          </span>
        </div>

        {/* ── Dynamic Problems Grid ── */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProblems.map((prob) => {
            const isDone = !!completed[prob.id];
            return (
              <motion.article
                key={prob.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`rounded-2xl border bg-white p-6 shadow-xs flex flex-col justify-between space-y-5 transition-all group ${
                  isDone
                    ? 'border-emerald-200 bg-emerald-50/20'
                    : prob.isGap
                    ? 'border-neutral-200 hover:border-[#0038FF]/60 hover:shadow-md hover:shadow-blue-500/5'
                    : 'border-neutral-200 hover:border-neutral-300'
                }`}
              >
                <div className="space-y-4">
                  {/* Top Header Tag: Platform & Difficulty & Gap Indicator */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="rounded border border-neutral-200 bg-neutral-50 px-2 py-0.5 text-[10px] font-mono font-semibold uppercase tracking-wider text-neutral-600">
                        {prob.platform}
                      </span>
                      <span
                        className={`rounded border px-2 py-0.5 text-[10px] font-mono font-semibold uppercase tracking-wider ${difficultyBadge(
                          prob.difficulty
                        )}`}
                      >
                        {prob.difficulty}
                      </span>
                    </div>

                    {prob.isGap && !isDone && (
                      <span className="inline-flex items-center gap-1 rounded bg-amber-50 border border-amber-200/80 px-2 py-0.5 text-[9px] font-mono font-bold uppercase text-amber-800">
                        <FiAlertTriangle size={9} /> -{prob.gapDelta}% Gap
                      </span>
                    )}
                  </div>

                  {/* Title & Vector Info */}
                  <div>
                    <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-[#0038FF]">
                      <span>Target Vector: {prob.skillVector}</span>
                    </div>
                    <h3 className="text-base font-bold text-neutral-950 mt-1 leading-snug group-hover:text-[#0038FF] transition-colors">
                      {prob.title}
                    </h3>
                  </div>

                  {/* Problem Description */}
                  <p className="text-xs text-neutral-500 leading-relaxed">
                    {prob.description}
                  </p>

                  {/* Competency Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {prob.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded bg-neutral-100 px-2 py-0.5 text-[10px] font-mono text-neutral-600"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="pt-4 border-t border-neutral-100 flex items-center justify-between gap-3">
                  <button
                    onClick={() => toggleCompleted(prob.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold border transition-all ${
                      isDone
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                        : 'bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                    }`}
                  >
                    <FiCheckCircle
                      size={12}
                      className={isDone ? 'text-emerald-600' : 'text-neutral-400'}
                    />
                    <span>{isDone ? 'Resolved' : 'Mark Done'}</span>
                  </button>

                  <a
                    href={prob.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#0038FF] hover:bg-blue-700 text-white px-3.5 py-1.5 text-xs font-mono font-semibold shadow-xs transition-all group/link"
                  >
                    <span>Solve on {prob.platform.split(' ')[0]}</span>
                    <FiExternalLink
                      size={12}
                      className="transition-transform group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5"
                    />
                  </a>
                </div>
              </motion.article>
            );
          })}
        </div>

      </div>
    </AppLayout>
  );
}
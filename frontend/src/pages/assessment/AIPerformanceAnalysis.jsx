import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  FiCpu,
  FiTerminal,
  FiBarChart2,
  FiMessageSquare,
  FiTarget,
  FiCheckCircle,
  FiTrendingUp,
  FiBookOpen,
  FiArrowRight,
  FiActivity,
  FiCompass,
} from 'react-icons/fi';
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import AppLayout from '../../components/layout/AppLayout';

const scores = [
  { label: 'Technical Execution', value: 78, icon: FiTerminal, metric: 'Algorithmic logic' },
  { label: 'Cognitive Aptitude', value: 72, icon: FiBarChart2, metric: 'Pattern inference' },
  { label: 'Communication', value: 85, icon: FiMessageSquare, metric: 'Technical articulation' },
  { label: 'Problem Structuring', value: 70, icon: FiCpu, metric: 'Complexity decomposition' },
  { label: 'Domain Analysis', value: 74, icon: FiTarget, metric: 'Systems modeling' },
];

const radarData = scores.map((s) => ({
  subject: s.label.split(' ')[0],
  score: s.value,
  fullMark: 100,
}));

const strengths = [
  'Strong deductive reasoning and computational pattern recognition.',
  'Effective structured documentation and verbal technical articulation.',
  'Solid grasp of modular object-oriented paradigms and state handling.',
  'High baseline consistency across non-verbal quantitative evaluations.',
];

const weaknesses = [
  'Relational database indexing, query planning, and latency bottlenecks.',
  'Complex graph traversals and custom balanced tree implementations.',
  'Standard numerical computation speed under strict runtime constraints.',
];

const courses = [
  {
    title: 'Relational Database Optimization & Query Planning',
    provider: 'Academic Catalog',
    duration: '6 Modules',
    match: 95,
  },
  {
    title: 'Advanced Graph Theory & Algorithmic Structures',
    provider: 'CS Core Series',
    duration: '8 Modules',
    match: 88,
  },
  {
    title: 'Scalable Systems Design & Consensus Foundations',
    provider: 'Engineering Lab',
    duration: '4 Modules',
    match: 82,
  },
];

const practiceAreas = [
  { area: 'SQL Execution Plan Analysis', priority: 'High', impact: '+12% Backend Index' },
  { area: 'Directed Graph Algorithms', priority: 'Medium', impact: '+8% Algorithm Score' },
  { area: 'Numerical Problem Solving', priority: 'Medium', impact: '+6% Aptitude Metric' },
];

const careerImpact = [
  { career: 'Backend Systems Engineer', current: 72, potential: 88 },
  { career: 'Data Infrastructure Engineer', current: 65, potential: 82 },
  { career: 'Full Stack Software Engineer', current: 78, potential: 90 },
];

export default function AIPerformanceAnalysis() {
  const navigate = useNavigate();

  return (
    <AppLayout>
      <div className="space-y-8 max-w-[1400px] mx-auto antialiased selection:bg-[#0038FF] selection:text-white">
        
        {/* ── Header Ribbon ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-neutral-200/80 pb-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 font-mono">
                Diagnostic Telemetry
              </span>
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-blue-50 border border-blue-100 text-[#0038FF] text-[9px] font-bold font-mono uppercase">
                <FiCpu size={9} /> AI Skill Synthesis
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-950">
              AI Performance Analysis
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 max-w-2xl leading-relaxed">
              Automated synthesis evaluating empirical assessment scores, identifying cognitive proficiencies, and generating actionable trajectory interventions.
            </p>
          </div>

          <div className="text-xs font-mono text-neutral-400 flex items-center gap-1.5 shrink-0 self-start md:self-end">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span>4 Evaluations Synthesized</span>
          </div>
        </div>

        {/* ── Top Metric Showcase: Aggregated Dimensions ── */}
        <div className="bg-white border border-neutral-200 rounded-2xl p-6 sm:p-7 shadow-xs">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-4 mb-5">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0038FF]">
                <FiActivity size={16} />
              </div>
              <div>
                <h2 className="text-sm font-bold text-neutral-950">Core Competency Matrix</h2>
                <p className="text-[11px] text-neutral-400 font-mono">Multi-dimensional cognitive and technical vector</p>
              </div>
            </div>
            <span className="text-[10px] font-mono text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded uppercase">
              Aggregated Percentile
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {scores.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="rounded-xl border border-neutral-200/80 bg-neutral-50/50 p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="h-7 w-7 rounded-md bg-white border border-neutral-200 flex items-center justify-center text-neutral-700 shadow-2xs">
                      <Icon size={14} />
                    </div>
                    <span className="text-xs font-bold font-mono text-neutral-900">{s.value}%</span>
                  </div>

                  <div>
                    <p className="text-xs font-bold text-neutral-900 truncate">{s.label}</p>
                    <p className="text-[10px] font-mono text-neutral-400 mt-0.5">{s.metric}</p>
                  </div>

                  <div className="h-1.5 w-full bg-neutral-200/80 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-[#0038FF]"
                      initial={{ width: 0 }}
                      animate={{ width: `${s.value}%` }}
                      transition={{ duration: 0.8, delay: 0.1 + i * 0.05 }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* ── Middle Grid: Radar Profile & Diagnostic Insights ── */}
        <div className="grid gap-6 lg:grid-cols-12">
          
          {/* Radar Chart */}
          <div className="lg:col-span-5 bg-white border border-neutral-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-neutral-100 pb-3 mb-4">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 font-mono">
                    Geometric Vector
                  </span>
                  <h2 className="text-sm font-bold text-neutral-950 mt-0.5">Skill Distribution Radar</h2>
                </div>
                <span className="text-[10px] font-mono text-[#0038FF] bg-blue-50 border border-blue-100 px-2 py-0.5 rounded">
                  Calibrated
                </span>
              </div>
              <div className="h-64 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData} outerRadius="75%">
                    <PolarGrid stroke="#E5E7EB" />
                    <PolarAngleAxis
                      dataKey="subject"
                      tick={{ fontSize: 11, fill: '#475569', fontFamily: 'monospace' }}
                    />
                    <Radar
                      dataKey="score"
                      stroke="#0038FF"
                      fill="#0038FF"
                      fillOpacity={0.12}
                      strokeWidth={1.75}
                    />
                    <Tooltip
                      formatter={(val) => [`${val}%`, 'Proficiency']}
                      contentStyle={{
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #E5E7EB',
                        borderRadius: '8px',
                        fontSize: '11px',
                        fontFamily: 'monospace',
                      }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <p className="text-[11px] text-neutral-400 font-mono text-center pt-2 border-t border-neutral-100">
              Balanced polyline across 5 cognitive & engineering dimensions.
            </p>
          </div>

          {/* Diagnostic Strengths & Growth Areas */}
          <div className="lg:col-span-7 bg-white border border-neutral-200 rounded-2xl p-6 shadow-xs space-y-6">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 font-mono">
                Qualitative Breakdown
              </span>
              <h2 className="text-sm font-bold text-neutral-950 mt-0.5">Diagnostic Observations</h2>
            </div>

            {/* Strengths */}
            <div className="space-y-2.5">
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-700">
                <FiCheckCircle size={14} />
                <span className="uppercase tracking-wider">Demonstrated Proficiencies</span>
              </div>
              <div className="space-y-2">
                {strengths.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2.5 rounded-lg border border-emerald-100 bg-emerald-50/40 p-3 text-xs text-neutral-800"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                    <span className="leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Areas to Improve */}
            <div className="space-y-2.5 pt-1">
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-amber-700">
                <FiTarget size={14} />
                <span className="uppercase tracking-wider">Identified Competency Gaps</span>
              </div>
              <div className="space-y-2">
                {weaknesses.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2.5 rounded-lg border border-amber-100 bg-amber-50/40 p-3 text-xs text-neutral-800"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                    <span className="leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* ── Bottom Grid ── */}
        <div className="grid gap-6 lg:grid-cols-3">
          
          {/* Recommended Coursework */}
          <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between border-b border-neutral-100 pb-3 mb-4">
                <div className="flex items-center gap-2 text-xs font-bold text-neutral-900 font-mono uppercase tracking-wider">
                  <FiBookOpen size={14} className="text-[#0038FF]" />
                  <span>Curriculum Interventions</span>
                </div>
                <span className="text-[10px] font-mono text-neutral-400">Match %</span>
              </div>

              <div className="space-y-3">
                {courses.map((c) => (
                  <div
                    key={c.title}
                    className="rounded-xl border border-neutral-200/80 bg-neutral-50/30 p-3.5 hover:border-neutral-300 hover:bg-white transition-all space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs font-bold text-neutral-950 leading-snug">{c.title}</p>
                      <span className="shrink-0 rounded bg-blue-50 border border-blue-100 px-1.5 py-0.5 text-[10px] font-mono font-bold text-[#0038FF]">
                        {c.match}%
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] font-mono text-neutral-400">
                      <span>{c.provider}</span>
                      <span>·</span>
                      <span>{c.duration}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Clean 8px Border Button */}
            <button
              onClick={() => navigate('/assessments/categories')}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-white hover:border-[#0038FF] hover:text-[#0038FF] hover:bg-blue-50/40 text-neutral-800 py-2.5 px-4 font-mono text-xs font-semibold tracking-wide transition-all shadow-2xs group"
            >
              <span>Explore Assessment Modules</span>
              <FiArrowRight size={13} className="text-neutral-400 transition-transform group-hover:translate-x-0.5 group-hover:text-[#0038FF]" />
            </button>
          </div>

          {/* High Priority Practice Areas */}
          <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between border-b border-neutral-100 pb-3 mb-4">
                <div className="flex items-center gap-2 text-xs font-bold text-neutral-900 font-mono uppercase tracking-wider">
                  <FiCompass size={14} className="text-[#0038FF]" />
                  <span>Targeted Focus Areas</span>
                </div>
                <span className="text-[10px] font-mono text-neutral-400">Priority</span>
              </div>

              <div className="space-y-3">
                {practiceAreas.map((p) => (
                  <div
                    key={p.area}
                    className="rounded-xl border border-neutral-200/80 bg-neutral-50/30 p-3.5 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-neutral-900">{p.area}</p>
                      <span
                        className={`rounded px-1.5 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider ${
                          p.priority === 'High'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200/80'
                            : 'bg-amber-50 text-amber-700 border border-amber-200/80'
                        }`}
                      >
                        {p.priority} Priority
                      </span>
                    </div>
                    <p className="text-[11px] font-mono text-emerald-700 flex items-center gap-1">
                      <FiTrendingUp size={11} /> {p.impact}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-[11px] text-neutral-400 font-mono text-center">
              Targeting high-priority items yields highest velocity score gains.
            </p>
          </div>

          {/* Career Alignment Trajectory */}
          <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between border-b border-neutral-100 pb-3 mb-4">
                <div className="flex items-center gap-2 text-xs font-bold text-neutral-900 font-mono uppercase tracking-wider">
                  <FiTrendingUp size={14} className="text-[#0038FF]" />
                  <span>Role Readiness Index</span>
                </div>
                <span className="text-[10px] font-mono text-neutral-400">Target</span>
              </div>

              <div className="space-y-4">
                {careerImpact.map((c) => (
                  <div key={c.career} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-neutral-900 truncate">{c.career}</span>
                      <span className="font-mono text-[11px] text-neutral-500">
                        {c.current}% <span className="text-[#0038FF] font-bold">→ {c.potential}%</span>
                      </span>
                    </div>

                    <div className="relative h-2 w-full rounded-full bg-neutral-100 overflow-hidden">
                      <div
                        className="absolute h-full bg-blue-200 rounded-full"
                        style={{ width: `${c.potential}%` }}
                      />
                      <div
                        className="absolute h-full bg-[#0038FF] rounded-full"
                        style={{ width: `${c.current}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Clean 8px Border Button */}
            <button
              onClick={() => navigate('/assessments/skill-gap')}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-white hover:border-[#0038FF] hover:text-[#0038FF] hover:bg-blue-50/40 text-neutral-800 py-2.5 px-4 font-mono text-xs font-semibold tracking-wide transition-all shadow-2xs group"
            >
              <span>View Full Skill Gap Matrix</span>
              <FiArrowRight size={13} className="text-neutral-400 transition-transform group-hover:translate-x-0.5 group-hover:text-[#0038FF]" />
            </button>
          </div>

        </div>

        {/* ── Key Intervention Banner ── */}
        <div className="rounded-2xl border border-blue-100/80 bg-blue-50/40 p-6 sm:p-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div className="space-y-1 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#0038FF] font-mono">
                Recommended Action
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-[#0038FF]" />
              <span className="text-[10px] font-mono text-neutral-500">Highest ROI Intervention</span>
            </div>
            <h3 className="text-base font-bold text-neutral-950">
              Complete Relational Database & SQL Indexing Evaluation
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Completing this specific module will address your primary algorithmic bottleneck and elevate your Backend Systems match from 72% to an estimated 88%.
            </p>
          </div>

          <button
            onClick={() => navigate('/assessments/categories')}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#0038FF] hover:bg-blue-700 active:scale-[0.99] text-white py-2.5 px-5 font-mono text-xs font-semibold tracking-wide transition-all shadow-md shadow-blue-500/20 shrink-0 group"
          >
            <span>Start Module</span>
            <FiArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>

      </div>
    </AppLayout>
  );
}
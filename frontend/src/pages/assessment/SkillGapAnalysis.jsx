import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  FiTarget,
  FiTrendingUp,
  FiCheckCircle,
  FiChevronDown,
  FiArrowRight,
  FiShield,
  FiLayers,
  FiActivity,
  FiAward,
} from 'react-icons/fi';
import AppLayout from '../../components/layout/AppLayout';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const careers = [
  'Backend Developer',
  'Data Engineer',
  'Full Stack Developer',
  'AI/ML Engineer',
  'DevOps Engineer',
];

const gapData = {
  'Backend Developer': [
    { skill: 'Java Core & OOP', required: 90, student: 70, gap: 20, desc: 'Object architecture, threading & memory model' },
    { skill: 'Spring Boot Framework', required: 85, student: 65, gap: 20, desc: 'Dependency injection, JPA & REST controllers' },
    { skill: 'Relational SQL & ACID', required: 80, student: 78, gap: 2, desc: 'Indexing plans, JOIN optimization & integrity' },
    { skill: 'REST API Architecture', required: 85, student: 60, gap: 25, desc: 'Contract design, idempotency & auth tokens' },
    { skill: 'Systems Design', required: 75, student: 45, gap: 30, desc: 'Distributed caching, queues & horizontal scaling' },
    { skill: 'Docker Containerization', required: 70, student: 30, gap: 40, desc: 'Multi-stage builds, compose & container isolation' },
  ],
  'Data Engineer': [
    { skill: 'Python Analytics', required: 90, student: 62, gap: 28, desc: 'Pandas, NumPy & distributed ETL pipelines' },
    { skill: 'Relational & NoSQL Data', required: 95, student: 78, gap: 17, desc: 'Query optimization & schema warehousing' },
    { skill: 'Apache Spark Processing', required: 80, student: 20, gap: 60, desc: 'RDD operations & structured streaming' },
    { skill: 'Kafka Event Streaming', required: 75, student: 15, gap: 60, desc: 'Topics, partitioners & consumer groups' },
    { skill: 'Data Modeling & Warehouses', required: 85, student: 40, gap: 45, desc: 'Star/Snowflake schema design' },
    { skill: 'Cloud Infrastructure (AWS)', required: 80, student: 35, gap: 45, desc: 'S3 storage, Glue & EMR orchestration' },
  ],
  'Full Stack Developer': [
    { skill: 'React Architecture', required: 85, student: 82, gap: 3, desc: 'State hooks, concurrency & component tree' },
    { skill: 'Node.js Runtime', required: 80, student: 50, gap: 30, desc: 'Event loop, asynchronous I/O & Express' },
    { skill: 'TypeScript Typing', required: 75, student: 45, gap: 30, desc: 'Generics, union types & compile guards' },
    { skill: 'Relational Database', required: 70, student: 78, gap: 0, desc: 'Schema migration & ORM abstractions' },
    { skill: 'CSS / Tailwind Modern', required: 80, student: 75, gap: 5, desc: 'Responsive grid & design token systems' },
    { skill: 'RESTful API Services', required: 85, student: 60, gap: 25, desc: 'API endpoints, payload validation & CORS' },
  ],
  'AI/ML Engineer': [
    { skill: 'Python Scientific Stack', required: 95, student: 62, gap: 33, desc: 'Vectorized computing & statistical modeling' },
    { skill: 'Machine Learning Algorithms', required: 90, student: 40, gap: 50, desc: 'Regression, classification & trees' },
    { skill: 'Applied Statistics & Math', required: 85, student: 55, gap: 30, desc: 'Probability, linear algebra & calculus' },
    { skill: 'Deep Learning Frameworks', required: 80, student: 25, gap: 55, desc: 'PyTorch / TensorFlow neural graphs' },
    { skill: 'Feature Engineering', required: 85, student: 60, gap: 25, desc: 'Data cleaning, encoders & dimensional reduction' },
    { skill: 'Cloud ML Infrastructure', required: 75, student: 30, gap: 45, desc: 'Model deployment & inference scaling' },
  ],
  'DevOps Engineer': [
    { skill: 'Docker Containerization', required: 90, student: 30, gap: 60, desc: 'Microservice container images & runtime' },
    { skill: 'Kubernetes Orchestration', required: 85, student: 20, gap: 65, desc: 'Pods, services, ingress & Helm charts' },
    { skill: 'CI/CD Automated Pipelines', required: 85, student: 35, gap: 50, desc: 'GitHub Actions, automated test integration' },
    { skill: 'Linux Kernel & Shell', required: 80, student: 55, gap: 25, desc: 'Process management, networking & Bash scripting' },
    { skill: 'Cloud Architecture (AWS)', required: 85, student: 35, gap: 50, desc: 'IAM, VPC, EC2 & security groups' },
    { skill: 'Infrastructure as Code', required: 75, student: 50, gap: 25, desc: 'Terraform declarative state management' },
  ],
};

const learningPaths = {
  'Backend Developer': [
    { step: '01', title: 'Master Java Core & OOP Paradigms', duration: '3 weeks', type: 'Coursework' },
    { step: '02', title: 'Spring Boot REST Architecture & Microservices', duration: '4 weeks', type: 'Coursework' },
    { step: '03', title: 'Scalable Systems Design Fundamentals', duration: '3 weeks', type: 'Coursework' },
    { step: '04', title: 'Docker & Containerized Environments', duration: '2 weeks', type: 'Lab Practice' },
    { step: '05', title: 'Backend Competency Assessment', duration: '1 hour', type: 'Evaluation' },
  ],
};

const tooltipStyle = {
  backgroundColor: '#0F172A',
  borderRadius: 8,
  border: 'none',
  color: '#FFFFFF',
  fontSize: 11,
  fontFamily: 'monospace',
};

export default function SkillGapAnalysis() {
  const navigate = useNavigate();
  const [selectedCareer, setSelectedCareer] = useState('Backend Developer');

  const data = gapData[selectedCareer] || [];
  const path = learningPaths[selectedCareer] || learningPaths['Backend Developer'];
  const avgGap = Math.round(data.reduce((s, i) => s + i.gap, 0) / (data.length || 1));
  const readiness = Math.round(
    (data.reduce((s, i) => s + Math.min(i.student / i.required, 1), 0) / (data.length || 1)) * 100
  );

  return (
    <AppLayout>
      <div className="space-y-8 max-w-[1400px] mx-auto pb-12 antialiased selection:bg-[#0038FF] selection:text-white">
        
        {/* ── Top Header Ribbon & Role Selector ── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-neutral-200/80 pb-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 font-mono">
                Comparative Telemetry
              </span>
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-blue-50 border border-blue-100 text-[#0038FF] text-[9px] font-bold font-mono uppercase">
                <FiShield size={9} /> Benchmark Variance
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-950">
              Skill Gap & Role Readiness Matrix
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 max-w-2xl leading-relaxed">
              Audited variance between candidate competency vectors and industry role prerequisites.
            </p>
          </div>

          {/* Role Dropdown Selector */}
          <div className="relative shrink-0">
            <select
              value={selectedCareer}
              onChange={(e) => setSelectedCareer(e.target.value)}
              className="appearance-none rounded-lg border border-neutral-200 bg-white py-2.5 pl-4 pr-10 text-xs font-mono font-bold text-neutral-800 shadow-2xs hover:border-neutral-300 focus:outline-none focus:ring-2 focus:ring-[#0038FF] transition-all cursor-pointer"
            >
              {careers.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <FiChevronDown
              size={14}
              className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400"
            />
          </div>
        </div>

        {/* ── Top Metric KPI Summary ── */}
        <div className="grid gap-4 sm:grid-cols-3">
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs flex flex-col justify-between space-y-3"
          >
            <div className="flex items-center justify-between text-neutral-400">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 font-mono">
                Target Role
              </span>
              <div className="h-7 w-7 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0038FF]">
                <FiTarget size={14} />
              </div>
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-black text-neutral-950 truncate">
                {selectedCareer}
              </p>
              <p className="text-[11px] text-neutral-400 font-mono mt-0.5">
                Active evaluation target
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
                Role Readiness Index
              </span>
              <div className="h-7 w-7 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0038FF]">
                <FiActivity size={14} />
              </div>
            </div>
            <div>
              <p className="text-3xl font-black text-neutral-950 font-mono tracking-tight">
                {readiness}%
              </p>
              <p className="text-[11px] text-neutral-400 font-mono mt-0.5">
                Calculated candidate match score
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
                Mean Competency Gap
              </span>
              <div className="h-7 w-7 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-600">
                <FiLayers size={14} />
              </div>
            </div>
            <div>
              <p className={`text-3xl font-black font-mono tracking-tight ${
                avgGap > 25 ? 'text-rose-600' : avgGap > 10 ? 'text-amber-600' : 'text-emerald-600'
              }`}>
                {avgGap}%
              </p>
              <p className="text-[11px] text-neutral-400 font-mono mt-0.5">
                Average delta across evaluated skills
              </p>
            </div>
          </motion.div>

        </div>

        {/* ── Section 1: Comparative Distribution Bar Chart ── */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-2xl border border-neutral-200 bg-white p-6 sm:p-7 shadow-xs space-y-4"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-100 pb-3">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 font-mono">
                Comparative Assessment
              </span>
              <h2 className="text-sm font-bold text-neutral-950 mt-0.5">
                Benchmark Standard vs. Candidate Proficiency
              </h2>
            </div>
            <div className="flex items-center gap-4 text-[11px] font-mono">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-xs bg-neutral-200" />
                <span className="text-neutral-500">Prerequisite Benchmark</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-xs bg-[#0038FF]" />
                <span className="text-neutral-900 font-bold">Candidate Score</span>
              </div>
            </div>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} barGap={6} barSize={20} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="skill" tick={{ fontSize: 10, fill: '#64748B', fontFamily: 'monospace' }} axisLine={{ stroke: '#E2E8F0' }} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#64748B', fontFamily: 'monospace' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v, n) => [`${v}%`, n === 'required' ? 'Benchmark' : 'Candidate']} />
                <Bar dataKey="required" fill="#E2E8F0" radius={[3, 3, 0, 0]} name="required" />
                <Bar dataKey="student" fill="#0038FF" radius={[3, 3, 0, 0]} name="student" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.section>

        {/* ── Section 2: Structured 2-Column Diagnostic Card Grid ── */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-neutral-200 bg-white p-6 sm:p-7 shadow-xs space-y-6"
        >
          <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 font-mono">
                Itemized Delta
              </span>
              <h2 className="text-sm font-bold text-neutral-950 mt-0.5">
                Competency Gap Ledger
              </h2>
            </div>
            <span className="text-[10px] font-mono text-neutral-500 bg-neutral-100 px-2.5 py-1 rounded">
              {data.length} Evaluated Criteria
            </span>
          </div>

          {/* 2-Column Responsive Card Grid */}
          <div className="grid gap-4 sm:grid-cols-2">
            {data.map((item, i) => (
              <div
                key={item.skill}
                className="rounded-xl border border-neutral-200/80 bg-[#F8FAFC] p-4 flex flex-col justify-between space-y-3.5 hover:border-neutral-300 transition-colors"
              >
                {/* Card Title & Delta Tag */}
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="text-xs font-bold text-neutral-900 font-mono truncate">
                      {item.skill}
                    </h3>
                    <p className="text-[11px] text-neutral-500 mt-0.5 leading-tight">
                      {item.desc}
                    </p>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider shrink-0 border ${
                      item.gap === 0
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200/80'
                        : item.gap > 20
                        ? 'bg-rose-50 text-rose-700 border-rose-200/80'
                        : 'bg-amber-50 text-amber-700 border-amber-200/80'
                    }`}
                  >
                    {item.gap === 0 ? 'Target Met' : `-${item.gap}% Gap`}
                  </span>
                </div>

                {/* Progress Rails with Baseline Indicator */}
                <div className="space-y-2">
                  <div className="relative h-2 w-full rounded-full bg-neutral-200/80 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-[#0038FF]"
                      initial={{ width: 0 }}
                      animate={{ width: `${item.student}%` }}
                      transition={{ duration: 0.8, delay: 0.05 * i }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500">
                    <span>
                      Score: <strong className="text-neutral-900">{item.student}%</strong>
                    </span>
                    <span>
                      Benchmark: <strong className="text-neutral-900">{item.required}%</strong>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400 border-t border-neutral-100 pt-3">
            <span>Competency standard updated against Q3 industry requirements.</span>
            <span className="text-[#0038FF] font-semibold">Live Audit Calibrated</span>
          </div>
        </motion.section>

        {/* ── Section 3: Recommended Progression Roadmap ── */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="rounded-2xl border border-neutral-200 bg-white p-6 sm:p-7 shadow-xs space-y-6"
        >
          <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 font-mono">
                Curriculum Interventions
              </span>
              <h2 className="text-sm font-bold text-neutral-950 mt-0.5">
                Sequential Remediation Path · {selectedCareer}
              </h2>
            </div>
            <span className="text-[10px] font-mono text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded">
              {path.length} Sequential Steps
            </span>
          </div>

          {/* Stepper Timeline */}
          <div className="space-y-3 pt-1">
            {path.map((step) => (
              <div
                key={step.step}
                className="flex items-center justify-between gap-4 rounded-xl border border-neutral-200/80 bg-neutral-50/40 p-4 hover:border-neutral-300 hover:bg-white transition-all"
              >
                <div className="flex items-center gap-3.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white border border-neutral-200 font-mono text-xs font-bold text-[#0038FF] shadow-2xs shrink-0">
                    {step.step}
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-neutral-950">
                      {step.title}
                    </h3>
                    <p className="text-[11px] font-mono text-neutral-400 mt-0.5">
                      Estimated Duration: {step.duration}
                    </p>
                  </div>
                </div>

                <span className="shrink-0 rounded-md border border-neutral-200 bg-white px-2.5 py-1 text-[10px] font-mono font-semibold uppercase tracking-wider text-neutral-600">
                  {step.type}
                </span>
              </div>
            ))}
          </div>

          {/* Action Footer */}
          <div className="pt-2 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-neutral-500 font-mono text-center sm:text-left">
              Enroll in diagnostic modules to begin closing identified competency gaps.
            </span>

            <button
              onClick={() => navigate('/assessments/categories')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-[#0038FF] hover:bg-blue-700 active:scale-[0.99] text-white py-2.5 px-5 font-mono text-xs font-semibold tracking-wide transition-all shadow-md shadow-blue-500/20 group shrink-0"
            >
              <span>Launch Assessment Engine</span>
              <FiArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </motion.section>

      </div>
    </AppLayout>
  );
}
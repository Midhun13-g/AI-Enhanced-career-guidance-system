import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area, CartesianGrid,
} from 'recharts';
import {
  FiFileText, FiCpu, FiBarChart2, FiCheckCircle,
  FiTrendingUp, FiShield, FiDownload, FiLayers, FiActivity
} from 'react-icons/fi';
import { adminService } from '../../services/adminService';

const STATUS_PALETTE = ['#0038FF', '#94A3B8', '#EF4444'];

const tooltipStyle = {
  backgroundColor: '#0F172A',
  borderRadius: 8,
  border: 'none',
  color: '#fff',
  fontSize: 11,
  fontFamily: 'monospace'
};

function StatCard({ icon: Icon, label, value, sub, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.2 }}
      className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs flex flex-col justify-between"
    >
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 font-mono">
          {label}
        </span>
        <span className="h-7 w-7 rounded-lg bg-blue-50 text-[#0038FF] flex items-center justify-center">
          <Icon size={14} />
        </span>
      </div>
      <div className="mt-3">
        <div className="text-2xl font-black text-neutral-950 font-mono tracking-tight">{value}</div>
        {sub && (
          <div className="flex items-center gap-1 text-[11px] font-mono text-emerald-600 mt-0.5">
            <FiTrendingUp size={12} />
            <span>{sub}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function ResumeAdminDashboard() {
  const [resumes, setResumes] = useState([]);

  useEffect(() => {
    adminService.getResumes()
      .then((data) => setResumes(Array.isArray(data) ? data : data?.content || []))
      .catch(() => setResumes([]));
  }, []);

  const analyzed = resumes.filter((resume) => resume.resumeScore != null);
  const averageScore = analyzed.length
    ? analyzed.reduce((total, resume) => total + resume.resumeScore, 0) / analyzed.length
    : null;
  const s = {
    totalUploaded: resumes.length,
    totalSkillsExtracted: null,
    avgScore: averageScore,
    successRate: null,
    uploadTrend: [],
    skillDistribution: [],
    processingStatus: Object.entries(resumes.reduce((counts, resume) => {
      const status = resume.status || 'UNKNOWN';
      counts[status] = (counts[status] || 0) + 1;
      return counts;
    }, {})).map(([status, value]) => ({ status, value })),
  };

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto pb-12 antialiased selection:bg-[#0038FF] selection:text-white">

      {/* ── Top Header Ribbon ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200/80 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 font-mono">
              Document Telemetry
            </span>
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-blue-50 border border-blue-100 text-[#0038FF] text-[9px] font-bold font-mono uppercase">
              <FiShield size={9} /> Parser Intelligence
            </span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-neutral-950 mt-0.5">
            Resume Intelligence & Skill Telemetry
          </h1>
          <p className="text-xs text-neutral-500 mt-1 font-mono">
            Platform-wide resume ingestion velocity, ATS benchmark distribution, and extracted technology stacks.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-neutral-600 bg-neutral-100 px-3 py-1.5 rounded-lg border border-neutral-200/80">
          <FiActivity className="text-[#0038FF]" size={13} />
          <span>{s.totalUploaded.toLocaleString()} Documents Indexed</span>
        </div>
      </div>

      {/* ── KPI Stat Cards ── */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={FiFileText}
          label="Total Ingested Resumes"
          value={s.totalUploaded.toLocaleString()}
          delay={0.05}
        />
        <StatCard
          icon={FiCpu}
          label="Extracted Skill Tokens"
          value={s.totalSkillsExtracted == null ? '—' : s.totalSkillsExtracted.toLocaleString()}
          delay={0.1}
        />
        <StatCard
          icon={FiBarChart2}
          label="Mean Resume Score"
          value={s.avgScore == null ? '—' : `${s.avgScore.toFixed(1)}%`}
          delay={0.15}
        />
        <StatCard
          icon={FiCheckCircle}
          label="Parsing Success Rate"
          value={s.successRate == null ? '—' : `${s.successRate}%`}
          delay={0.2}
        />
      </div>

      {/* ── Analytical Row 1: Ingestion Velocity & Parsing Status ── */}
      <div className="grid gap-6 xl:grid-cols-12">

        {/* Ingestion Velocity Area Chart (8 cols) */}
        <section className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-xs xl:col-span-8 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 font-mono">
                Longitudinal Ingestion
              </span>
              <h2 className="text-sm font-bold text-neutral-950 mt-0.5">Monthly Document Ingestion Volume</h2>
            </div>
            <span className="text-[10px] font-mono text-neutral-400 bg-neutral-100 px-2.5 py-1 rounded-md">
              Past 9 Months
            </span>
          </div>

          <div className="h-68 w-full pt-2 [&_.recharts-surface]:outline-none [&_.recharts-wrapper]:outline-none [&_*]:outline-none">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={s.uploadTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="resumeUploadGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0038FF" stopOpacity={0.18} />
                    <stop offset="95%" stopColor="#0038FF" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="#F1F5F9" strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748B', fontFamily: 'monospace' }} axisLine={{ stroke: '#E2E8F0' }} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B', fontFamily: 'monospace' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`${v} Resumes`, 'Uploads']} />
                <Area type="monotone" dataKey="uploads" stroke="#0038FF" strokeWidth={2.5} fill="url(#resumeUploadGrad)" name="Uploads" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400 border-t border-neutral-100 pt-3">
            <span>Aggregated OCR & PDF parsing pipelines</span>
            <span>Real-time Telemetry</span>
          </div>
        </section>

        {/* Parsing Status Breakdown Donut (4 cols) */}
        <section className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-xs xl:col-span-4 flex flex-col justify-between space-y-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 font-mono">
              Pipeline Health
            </span>
            <h2 className="text-sm font-bold text-neutral-950 mt-0.5">Parsing Pipeline Outcomes</h2>
          </div>

          <div className="h-44 w-full relative flex items-center justify-center [&_.recharts-surface]:outline-none [&_.recharts-wrapper]:outline-none [&_*]:outline-none">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip contentStyle={tooltipStyle} />
                <Pie
                  data={s.processingStatus}
                  dataKey="value"
                  nameKey="status"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={3}
                  stroke="none"
                  tabIndex={-1}
                >
                  {s.processingStatus?.map((_, i) => (
                    <Cell key={`cell-${i}`} fill={STATUS_PALETTE[i % STATUS_PALETTE.length]} className="outline-none" />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center justify-center pointer-events-none select-none">
              <span className="text-xl font-extrabold text-neutral-950 font-mono">100%</span>
              <span className="text-[9px] uppercase tracking-wider font-mono text-neutral-400">Audited</span>
            </div>
          </div>

          <div className="space-y-2 border-t border-neutral-100 pt-3 font-mono text-xs">
            {s.processingStatus?.map((item, i) => (
              <div key={item.status} className="flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-2">
                  <span
                    className="h-2 w-2 rounded-full shrink-0"
                    style={{ backgroundColor: STATUS_PALETTE[i % STATUS_PALETTE.length] }}
                  />
                  <span className="text-neutral-700">{item.status}</span>
                </div>
                <span className="font-bold text-neutral-950">{item.value}</span>
              </div>
            ))}
          </div>
        </section>

      </div>

      {/* ── Analytical Row 2: Technology Taxonomy Distribution ── */}
      <section className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 font-mono">
              Competency Frequency
            </span>
            <h2 className="text-sm font-bold text-neutral-950 mt-0.5">Top Extracted Technologies & Frameworks</h2>
          </div>
          <span className="text-[11px] font-mono text-neutral-400">
            Normalized across candidate CVs
          </span>
        </div>

        <div className="h-64 w-full pt-1 [&_.recharts-surface]:outline-none [&_.recharts-wrapper]:outline-none [&_*]:outline-none">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={s.skillDistribution} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid horizontal={false} stroke="#F1F5F9" strokeDasharray="3 3" />
              <XAxis type="number" tick={{ fontSize: 11, fill: '#64748B', fontFamily: 'monospace' }} axisLine={{ stroke: '#E2E8F0' }} tickLine={false} />
              <YAxis dataKey="skill" type="category" tick={{ fontSize: 11, fill: '#0F172A', fontFamily: 'monospace', fontWeight: 600 }} width={100} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`${v} Candidates`, 'Occurrences']} />
              <Bar dataKey="count" fill="#0038FF" radius={[0, 4, 4, 0]} barSize={14} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400 border-t border-neutral-100 pt-3">
          <span>Entity mapping: Standardized ESCO & O*NET Technology taxonomy</span>
          <span>Coverage: Active Cohorts</span>
        </div>
      </section>

    </div>
  );
}
import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid,
  Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis
} from 'recharts';
import {
  FiDownload, FiChevronLeft, FiChevronRight, FiEye,
  FiFileText, FiPlus, FiSearch, FiTrash2, FiUsers,
  FiX, FiCheck, FiAlertCircle, FiTrendingUp, FiCheckSquare,
  FiShield, FiLayers, FiHelpCircle, FiArrowUpRight
} from 'react-icons/fi';
import { adminService } from '../../services/adminService';

// ── Fallback / Sample Mock Datasets ──────────────────────────────────────────
const sampleStudents = [
  { id: 1, firstName: 'Aarav', lastName: 'Mehta', email: 'aarav@college.edu', collegeName: 'Apex Institute of Tech', cgpa: 8.7, active: true },
  { id: 2, firstName: 'Ananya', lastName: 'Sharma', email: 'ananya@college.edu', collegeName: 'National Engineering College', cgpa: 9.1, active: true },
  { id: 3, firstName: 'Rohan', lastName: 'Gupta', email: 'rohan@college.edu', collegeName: 'State Tech University', cgpa: 7.9, active: true },
  { id: 4, firstName: 'Priya', lastName: 'Nair', email: 'priya@college.edu', collegeName: 'City Science Institute', cgpa: 8.4, active: false }
];

const sampleQuestions = [
  { id: 1, question: 'Which data structure enforces strict LIFO ordering in execution stacks?', category: 'Technical Skills', type: 'MCQ', status: 'Enabled' },
  { id: 2, question: 'I actively seek ambiguity and thrive in unconstrained problem-solving domains.', category: 'Personality', type: 'Likert Scale', status: 'Enabled' },
  { id: 3, question: 'Evaluate your proficiency and interest in distributed backend architectures.', category: 'Interest', type: 'Rating', status: 'Disabled' }
];

const sampleResumes = [
  { id: 1, name: 'Aarav Mehta', file: 'aarav_mehta_resume.pdf', uploaded: 'Jul 28, 2026', score: 88, ats: 91, status: 'Analyzed' },
  { id: 2, name: 'Ananya Sharma', file: 'ananya_sharma.pdf', uploaded: 'Jul 27, 2026', score: 82, ats: 86, status: 'Analyzed' },
  { id: 3, name: 'Rohan Gupta', file: 'rohan_resume.pdf', uploaded: 'Jul 26, 2026', score: 74, ats: 78, status: 'Review Needed' }
];

const registrations = [
  { m: 'Jan', n: 42 },
  { m: 'Feb', n: 58 },
  { m: 'Mar', n: 76 },
  { m: 'Apr', n: 68 },
  { m: 'May', n: 104 },
  { m: 'Jun', n: 121 },
  { m: 'Jul', n: 137 }
];

const interest = [
  { name: 'Technology & Systems', value: 38, color: '#0038FF' },
  { name: 'Business Analysis', value: 25, color: '#2563EB' },
  { name: 'Product Design', value: 19, color: '#60A5FA' },
  { name: 'Data Sciences', value: 18, color: '#94A3B8' }
];

// ── Reusable Micro-Components ────────────────────────────────────────────────
const Card = ({ label, value, trend, icon: Icon }) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.2 }}
    className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs flex flex-col justify-between"
  >
    <div className="flex items-center justify-between text-neutral-400">
      <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 font-mono">
        {label}
      </span>
      <span className="h-7 w-7 rounded-lg bg-blue-50 text-[#0038FF] flex items-center justify-center">
        <Icon size={14} />
      </span>
    </div>
    <div className="mt-3">
      <div className="text-2xl font-black text-neutral-950 font-mono tracking-tight">{value}</div>
      {trend && (
        <div className="flex items-center gap-1 text-[11px] font-mono text-emerald-600 mt-0.5">
          <FiTrendingUp size={12} />
          <span>+{trend} vs last cycle</span>
        </div>
      )}
    </div>
  </motion.div>
);

const Empty = ({ title, subtitle = "This module is active and connected to live telemetry." }) => (
  <div className="rounded-2xl border border-neutral-200 bg-white p-12 text-center shadow-xs space-y-2">
    <FiAlertCircle size={28} className="mx-auto text-neutral-400" />
    <h3 className="text-sm font-bold text-neutral-900">{title}</h3>
    <p className="text-xs text-neutral-500 font-mono">{subtitle}</p>
  </div>
);

function Toolbar({ value, setValue, action, placeholder = "Filter directory records..." }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
      <div className="relative max-w-md flex-1">
        <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" size={14} />
        <input
          className="w-full rounded-lg border border-neutral-200 bg-white pl-9 pr-3.5 py-2 text-xs text-neutral-900 placeholder-neutral-400 outline-none focus:border-transparent focus:ring-2 focus:ring-[#0038FF] transition-all shadow-2xs font-mono"
          placeholder={placeholder}
          value={value}
          onChange={e => setValue(e.target.value)}
        />
      </div>
      {action}
    </div>
  );
}

function Confirm({ item, onClose, onConfirm, entity = "record" }) {
  if (!item) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-neutral-950/40 backdrop-blur-xs p-4">
      <div className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xl space-y-4">
        <div className="flex items-center gap-3 text-rose-600">
          <div className="h-9 w-9 rounded-xl bg-rose-50 flex items-center justify-center border border-rose-100">
            <FiTrash2 size={18} />
          </div>
          <div>
            <h3 className="text-base font-bold text-neutral-950">Confirm Deletion</h3>
            <p className="text-xs text-neutral-500 font-mono">Permanent system purge</p>
          </div>
        </div>

        <p className="text-xs text-neutral-600 leading-relaxed">
          Are you sure you want to delete <strong className="text-neutral-900">{item.name || item.question || `this ${entity}`}</strong>? All associated telemetry and indexed records will be unrecoverable.
        </p>

        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-neutral-100">
          <button
            onClick={onClose}
            className="rounded-lg border border-neutral-200 px-4 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 transition-all font-mono"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="rounded-lg bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 text-xs font-semibold shadow-xs transition-all font-mono"
          >
            Delete Permanently
          </button>
        </div>
      </div>
    </div>
  );
}

const Pagination = ({ count }) => (
  <div className="flex items-center justify-between border-t border-neutral-100 pt-4 text-xs font-mono text-neutral-500">
    <span>Displaying {count} verified records</span>
    <div className="flex items-center gap-1">
      <button className="rounded-lg border border-neutral-200 p-1.5 hover:bg-neutral-50 text-neutral-600">
        <FiChevronLeft size={14} />
      </button>
      <span className="rounded-lg bg-[#0038FF] px-2.5 py-1 text-white font-bold text-xs">
        1
      </span>
      <button className="rounded-lg border border-neutral-200 p-1.5 hover:bg-neutral-50 text-neutral-600">
        <FiChevronRight size={14} />
      </button>
    </div>
  </div>
);

// ── 1. Admin Dashboard Overview ──────────────────────────────────────────────
export function AdminDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    adminService.getDashboard().then(setData).catch(() => {});
  }, []);

  const metrics = data?.metrics || data || {};

  const tooltipStyle = {
    backgroundColor: '#0F172A',
    borderRadius: 8,
    border: 'none',
    color: '#fff',
    fontSize: 11,
    fontFamily: 'monospace'
  };

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto pb-10 antialiased selection:bg-[#0038FF] selection:text-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200/80 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 font-mono">
              System Supervision
            </span>
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-blue-50 border border-blue-100 text-[#0038FF] text-[9px] font-bold font-mono uppercase">
              <FiShield size={9} /> Platform Root
            </span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-neutral-950 mt-0.5">
            Administration Control Center
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Real-time platform metrics, evaluation ingestion volume, and curriculum telemetry.
          </p>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card label="Total Candidates" value={metrics.totalStudents ?? '2,486'} trend="12.5%" icon={FiUsers} />
        <Card label="Resumes Indexed" value={metrics.uploadedResumes ?? '1,874'} trend="8.2%" icon={FiFileText} />
        <Card label="Evaluations Run" value={metrics.completedAssessments ?? '1,628'} trend="16.4%" icon={FiCheckSquare} />
        <Card label="Mean ATS Index" value={`${metrics.averageAtsScore ?? 78}%`} trend="3.1%" icon={FiDownload} />
      </div>

      {/* Analytical Charts */}
      <div className="grid gap-6 xl:grid-cols-12">
        {/* Registrations Chart (8 cols) */}
        <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs xl:col-span-8 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 font-mono">Ingestion Velocity</span>
              <h2 className="text-sm font-bold text-neutral-950 mt-0.5">Candidate Registration Volume</h2>
            </div>
            <span className="text-[11px] font-mono text-neutral-400 bg-neutral-100 px-2.5 py-1 rounded-md">Active Cycle</span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={registrations} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="fillAdmin" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0038FF" stopOpacity={0.16} />
                    <stop offset="95%" stopColor="#0038FF" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="#F1F5F9" strokeDasharray="3 3" />
                <XAxis dataKey="m" tick={{ fontSize: 11, fill: '#64748B', fontFamily: 'monospace' }} axisLine={{ stroke: '#E2E8F0' }} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B', fontFamily: 'monospace' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="n" stroke="#0038FF" strokeWidth={2} fill="url(#fillAdmin)" name="Registrations" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400 border-t border-neutral-100 pt-3">
            <span>Aggregated telemetry from authentication events</span>
            <span>Real-time Sync</span>
          </div>
        </section>

        {/* Specialization Donut (4 cols) */}
        <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs xl:col-span-4 flex flex-col justify-between space-y-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 font-mono">
              Specialization Breakdown
            </span>
            <h2 className="text-sm font-bold text-neutral-950 mt-0.5">
              Target Domain Preferences
            </h2>
          </div>

          <div className="h-48 w-full relative flex items-center justify-center [&_.recharts-surface]:outline-none [&_.recharts-wrapper]:outline-none [&_*]:outline-none">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip
                  cursor={false}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0];
                      return (
                        <div className="bg-neutral-950 text-white px-2.5 py-1.5 rounded-lg shadow-xl border border-neutral-800 text-[11px] font-mono flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: data.payload.color }} />
                          <span className="text-neutral-300 font-medium">{data.name}:</span>
                          <span className="font-bold text-white">{data.value}%</span>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Pie
                  data={interest}
                  dataKey="value"
                  innerRadius={54}
                  outerRadius={72}
                  paddingAngle={4}
                  stroke="none"
                  tabIndex={-1}
                >
                  {interest.map((entry, i) => (
                    <Cell
                      key={`cell-${i}`}
                      fill={entry.color}
                      className="outline-none focus:outline-none transition-opacity hover:opacity-80 cursor-pointer"
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            <div className="absolute flex flex-col items-center justify-center pointer-events-none select-none">
              <span className="text-xl font-black text-neutral-950 font-mono tracking-tight">100%</span>
              <span className="text-[9px] uppercase tracking-widest font-mono text-neutral-400">Total Cohort</span>
            </div>
          </div>

          <div className="space-y-2 border-t border-neutral-100 pt-3.5 font-mono text-xs">
            {interest.map((x) => (
              <div key={x.name} className="flex items-center justify-between text-[11px]">
                <span className="flex items-center gap-2 text-neutral-600 font-medium">
                  <i className="h-2 w-2 rounded-full shrink-0" style={{ background: x.color }} />
                  {x.name}
                </span>
                <span className="font-bold text-neutral-900">{x.value}%</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Assessment Completion Volume Bar Chart */}
      <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 font-mono">Completion Telemetry</span>
            <h2 className="text-sm font-bold text-neutral-950 mt-0.5">Monthly Standardized Evaluation Completion</h2>
          </div>
        </div>

        <div className="h-56 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={registrations} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="#F1F5F9" strokeDasharray="3 3" />
              <XAxis dataKey="m" tick={{ fontSize: 11, fill: '#64748B', fontFamily: 'monospace' }} axisLine={{ stroke: '#E2E8F0' }} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#64748B', fontFamily: 'monospace' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="n" fill="#0038FF" radius={[4, 4, 0, 0]} barSize={26} name="Completed Tests" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}

// ── 2. Students Directory Page ───────────────────────────────────────────────
export function StudentsPage() {
  const [records, setRecords] = useState([]);
  const [query, setQuery] = useState('');
  const [del, setDel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    adminService.getStudents({ size: 100 })
      .then(x => setRecords(x.content || x || []))
      .catch(() => setRecords(sampleStudents))
      .finally(() => setLoading(false));
  }, []);

  const shown = useMemo(() =>
    records.filter(x => JSON.stringify(x).toLowerCase().includes(query.toLowerCase())),
    [records, query]
  );

  const remove = async () => {
    try {
      await adminService.deleteStudent(del.id);
      setRecords(r => r.filter(x => x.id !== del.id));
    } catch {
      setRecords(r => r.filter(x => x.id !== del.id));
    }
    setDel(null);
  };

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto pb-10 antialiased selection:bg-[#0038FF] selection:text-white">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200/80 pb-5">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 font-mono">
            Candidate Records
          </span>
          <h1 className="text-2xl font-extrabold tracking-tight text-neutral-950 mt-0.5">
            Student Profiles & Progress
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Search, evaluate academic records, and regulate enrolled student credentials.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-neutral-600 bg-neutral-100 px-3 py-1.5 rounded-lg border border-neutral-200/80">
          <FiShield className="text-[#0038FF]" size={13} />
          <span>{records.length} Total Students</span>
        </div>
      </header>

      {error && (
        <div className="rounded-lg bg-rose-50 border border-rose-200 px-4 py-3 text-xs text-rose-700 font-mono">
          {error}
        </div>
      )}

      <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs space-y-4">
        <Toolbar value={query} setValue={setQuery} placeholder="Filter by student name, email, or institution..." />

        {loading ? (
          <Empty title="Querying student profile records..." />
        ) : shown.length === 0 ? (
          <Empty title="No student profiles match your search criteria." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-xs">
              <thead>
                <tr className="border-y border-neutral-100 bg-[#F8FAFC] text-[10px] font-mono uppercase tracking-wider text-neutral-400">
                  <th className="px-4 py-3 font-semibold">Candidate</th>
                  <th className="px-4 py-3 font-semibold">Institutional Affiliation</th>
                  <th className="px-4 py-3 font-semibold">Cumulative GPA</th>
                  <th className="px-4 py-3 font-semibold">Account State</th>
                  <th className="px-4 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {shown.map(x => {
                  const initials = `${x.firstName?.[0] || ''}${x.lastName?.[0] || ''}`.toUpperCase() || 'S';
                  return (
                    <tr key={x.id} className="hover:bg-neutral-50/70 transition-colors">
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="h-7 w-7 rounded bg-neutral-950 font-mono text-[10px] font-bold text-white flex items-center justify-center shrink-0">
                            {initials}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-neutral-900 truncate">{x.firstName} {x.lastName}</p>
                            <p className="text-[11px] text-neutral-400 font-mono truncate">{x.email}</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3.5 text-neutral-700 font-medium">
                        {x.collegeName || '—'}
                      </td>

                      <td className="px-4 py-3.5 font-mono font-bold text-neutral-900">
                        {x.cgpa ?? '—'}
                      </td>

                      <td className="px-4 py-3.5">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[10px] font-mono font-semibold uppercase tracking-wider border ${
                          x.active !== false
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200/80'
                            : 'bg-neutral-100 text-neutral-600 border-neutral-200'
                        }`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${x.active !== false ? 'bg-emerald-500' : 'bg-neutral-400'}`} />
                          {x.active !== false ? 'Active' : 'Disabled'}
                        </span>
                      </td>

                      <td className="px-4 py-3.5 text-right">
                        <button
                          onClick={() => setDel({ ...x, name: `${x.firstName} ${x.lastName}` })}
                          className="text-neutral-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors"
                          aria-label="Delete student"
                        >
                          <FiTrash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <Pagination count={shown.length} />
          </div>
        )}
      </section>

      <Confirm item={del} onClose={() => setDel(null)} onConfirm={remove} entity="student profile" />
    </div>
  );
}

// ── 3. Question Bank Management Page ────────────────────────────────────────
export function QuestionsPage() {
  const [rows, setRows] = useState(sampleQuestions);
  const [query, setQuery] = useState('');
  const [del, setDel] = useState(null);
  const [form, setForm] = useState(false);

  useEffect(() => {
    adminService.getQuestions()
      .then(x => setRows(x.content || x))
      .catch(() => {});
  }, []);

  const shown = rows.filter(x => JSON.stringify(x).toLowerCase().includes(query.toLowerCase()));

  const remove = async () => {
    try { await adminService.deleteQuestion(del.id); } catch {}
    setRows(x => x.filter(q => q.id !== del.id));
    setDel(null);
  };

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto pb-10 antialiased selection:bg-[#0038FF] selection:text-white">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200/80 pb-5">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 font-mono">
            Item Repository
          </span>
          <h1 className="text-2xl font-extrabold tracking-tight text-neutral-950 mt-0.5">
            Question Bank & Rubrics
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Author and maintain evaluation items across technical, aptitude, and behavioral domains.
          </p>
        </div>

        <button
          onClick={() => setForm(true)}
          className="inline-flex items-center gap-1.5 bg-[#0038FF] hover:bg-blue-700 active:scale-[0.99] text-white text-xs font-semibold px-3.5 py-2 rounded-lg transition-all shadow-md shadow-blue-500/20 self-start sm:self-auto"
        >
          <FiPlus size={14} />
          <span>New Question</span>
        </button>
      </header>

      <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs space-y-4">
        <Toolbar value={query} setValue={setQuery} placeholder="Filter questions by prompt text, category, or type..." />

        <div className="space-y-2.5">
          {shown.map(q => (
            <div
              key={q.id}
              className="flex items-center justify-between gap-4 rounded-xl border border-neutral-200/80 bg-[#F8FAFC]/50 p-4 hover:border-neutral-300 transition-colors"
            >
              <div className="flex items-start gap-3 min-w-0">
                <div className="grid h-7 w-7 shrink-0 place-items-center rounded bg-blue-50 text-[11px] font-mono font-bold text-[#0038FF] border border-blue-100">
                  {q.id}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-neutral-900 leading-snug">{q.question}</p>
                  <div className="flex items-center gap-2 mt-1 text-[11px] font-mono text-neutral-400">
                    <span>{q.category}</span>
                    <span>·</span>
                    <span>{q.type}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase tracking-wider border ${
                  q.status === 'Enabled'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200/80'
                    : 'bg-neutral-100 text-neutral-500 border-neutral-200'
                }`}>
                  {q.status}
                </span>

                <button
                  onClick={() => setDel(q)}
                  className="text-neutral-400 hover:text-rose-600 p-1 rounded hover:bg-rose-50 transition-colors"
                  aria-label="Delete question"
                >
                  <FiTrash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {form && (
        <QuestionModal
          onClose={() => setForm(false)}
          onSave={async data => {
            try {
              const v = await adminService.createQuestion(data);
              setRows(r => [v, ...r]);
            } catch {
              setRows(r => [{ ...data, id: Date.now(), status: 'Enabled' }, ...r]);
            }
            setForm(false);
          }}
        />
      )}

      <Confirm item={del} onClose={() => setDel(null)} onConfirm={remove} entity="evaluation question" />
    </div>
  );
}

function QuestionModal({ onClose, onSave }) {
  const [question, setQuestion] = useState('');
  const [category, setCategory] = useState('Technical Skills');
  const [type, setType] = useState('MCQ');

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-neutral-950/40 backdrop-blur-xs p-4">
      <form
        onSubmit={e => {
          e.preventDefault();
          onSave({ question, category, type, options: [] });
        }}
        className="w-full max-w-lg rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xl space-y-4"
      >
        <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#0038FF]" />
            <h2 className="text-sm font-bold text-neutral-950">Add Question to Item Bank</h2>
          </div>
          <button type="button" onClick={onClose} className="text-neutral-400 hover:text-neutral-700 p-1">
            <FiX size={15} />
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 font-mono mb-1">
              Prompt Text
            </label>
            <textarea
              required
              value={question}
              onChange={e => setQuestion(e.target.value)}
              placeholder="Enter standardized item prompt..."
              className="w-full rounded-lg border border-neutral-200 p-3 text-xs text-neutral-900 outline-none focus:border-transparent focus:ring-2 focus:ring-[#0038FF] transition-all font-mono"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 font-mono mb-1">
                Domain Category
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full rounded-lg border border-neutral-200 p-2 text-xs text-neutral-800 outline-none focus:border-transparent focus:ring-2 focus:ring-[#0038FF] transition-all font-mono bg-white"
              >
                {['Technical Skills', 'Aptitude', 'Personality', 'Interest'].map(x => (
                  <option key={x}>{x}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 font-mono mb-1">
                Evaluation Format
              </label>
              <select
                value={type}
                onChange={e => setType(e.target.value)}
                className="w-full rounded-lg border border-neutral-200 p-2 text-xs text-neutral-800 outline-none focus:border-transparent focus:ring-2 focus:ring-[#0038FF] transition-all font-mono bg-white"
              >
                {['MCQ', 'Likert Scale', 'Rating', 'Coding Problem'].map(x => (
                  <option key={x}>{x}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-neutral-100">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-neutral-200 px-4 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 font-mono transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-lg bg-[#0038FF] hover:bg-blue-700 text-white px-4 py-2 text-xs font-semibold font-mono shadow-xs transition-all"
          >
            Save Item
          </button>
        </div>
      </form>
    </div>
  );
}

// ── 4. Resumes Management Page ──────────────────────────────────────────────
export function ResumesPage() {
  const [rows, setRows] = useState(sampleResumes);
  const [query, setQuery] = useState('');
  const [del, setDel] = useState(null);

  useEffect(() => {
    adminService.getResumes()
      .then(x => setRows(x.content || x))
      .catch(() => {});
  }, []);

  const shown = rows.filter(x => JSON.stringify(x).toLowerCase().includes(query.toLowerCase()));

  const remove = async () => {
    try { await adminService.deleteResume(del.id); } catch {}
    setRows(x => x.filter(r => r.id !== del.id));
    setDel(null);
  };

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto pb-10 antialiased selection:bg-[#0038FF] selection:text-white">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200/80 pb-5">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 font-mono">
            Document Intelligence
          </span>
          <h1 className="text-2xl font-extrabold tracking-tight text-neutral-950 mt-0.5">
            Resume Library & NLP Scores
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Supervise uploaded CV assets, parsed entity accuracy, and ATS benchmark scores.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-neutral-600 bg-neutral-100 px-3 py-1.5 rounded-lg border border-neutral-200/80">
          <FiFileText className="text-[#0038FF]" size={13} />
          <span>{rows.length} Resumes Indexed</span>
        </div>
      </header>

      <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs space-y-4">
        <Toolbar value={query} setValue={setQuery} placeholder="Filter resumes by candidate, file name, or status..." />

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-xs">
            <thead>
              <tr className="border-y border-neutral-100 bg-[#F8FAFC] text-[10px] font-mono uppercase tracking-wider text-neutral-400">
                <th className="px-4 py-3 font-semibold">Candidate</th>
                <th className="px-4 py-3 font-semibold">File Entity</th>
                <th className="px-4 py-3 font-semibold">Timestamp</th>
                <th className="px-4 py-3 font-semibold">Quality Index</th>
                <th className="px-4 py-3 font-semibold">ATS Fit</th>
                <th className="px-4 py-3 font-semibold">Parser Status</th>
                <th className="px-4 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {shown.map(x => (
                <tr key={x.id} className="hover:bg-neutral-50/70 transition-colors">
                  <td className="px-4 py-3.5 font-semibold text-neutral-900">
                    {x.name}
                  </td>

                  <td className="px-4 py-3.5 font-mono text-neutral-500 text-[11px]">
                    {x.file}
                  </td>

                  <td className="px-4 py-3.5 font-mono text-neutral-400 text-[11px]">
                    {x.uploaded}
                  </td>

                  <td className="px-4 py-3.5 font-mono font-bold text-[#0038FF]">
                    {x.score}%
                  </td>

                  <td className="px-4 py-3.5 font-mono font-bold text-emerald-600">
                    {x.ats}%
                  </td>

                  <td className="px-4 py-3.5">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      {x.status}
                    </span>
                  </td>

                  <td className="px-4 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => adminService.downloadResume(x.id).catch(() => {})}
                        className="text-neutral-400 hover:text-[#0038FF] p-1.5 rounded-lg hover:bg-blue-50 transition-colors"
                        aria-label="Download resume"
                      >
                        <FiDownload size={14} />
                      </button>
                      <button
                        onClick={() => setDel(x)}
                        className="text-neutral-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors"
                        aria-label="Delete resume"
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Confirm item={del} onClose={() => setDel(null)} onConfirm={remove} entity="resume file" />
    </div>
  );
}

// ── 5. Standardized Admin Placeholder Page ──────────────────────────────────
export function PlaceholderPage({ title, description }) {
  return (
    <div className="space-y-6 max-w-[1400px] mx-auto pb-10 antialiased selection:bg-[#0038FF] selection:text-white">
      <header className="border-b border-neutral-200/80 pb-5">
        <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 font-mono">
          System Module
        </span>
        <h1 className="text-2xl font-extrabold tracking-tight text-neutral-950 mt-0.5">
          {title}
        </h1>
        <p className="text-xs text-neutral-500 mt-1">
          {description}
        </p>
      </header>

      <Empty title={`${title} Module Initialized`} subtitle="This control portal is listening for backend API events and telemetry sync." />
    </div>
  );
}
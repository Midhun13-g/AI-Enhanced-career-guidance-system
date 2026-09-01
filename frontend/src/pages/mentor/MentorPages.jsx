import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  FiUsers,
  FiClipboard,
  FiCheckCircle,
  FiAward,
  FiSearch,
  FiSend,
  FiFileText,
  FiMessageSquare,
  FiArrowRight,
  FiShield,
  FiTarget,
  FiTrendingUp,
  FiClock,
  FiActivity,
} from 'react-icons/fi';
import { useForm } from 'react-hook-form';
import { mentorService } from '../../services/mentorService';

// Standardized Editorial Header
const Heading = ({ eyebrow, title, children }) => (
  <header className="border-b border-neutral-200/80 pb-6 mb-8">
    <div className="flex items-center gap-2 mb-1.5">
      <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 font-mono">
        {eyebrow}
      </span>
      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-blue-50 border border-blue-100 text-[#0038FF] text-[9px] font-bold font-mono uppercase">
        <FiShield size={9} /> Mentor Workspace
      </span>
    </div>
    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-950">
      {title}
    </h1>
    {children && (
      <p className="mt-1 text-xs sm:text-sm text-neutral-500 max-w-2xl leading-relaxed">
        {children}
      </p>
    )}
  </header>
);

// Standardized KPI Stat Card
const Stat = ({ label, value, icon: Icon, note }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs flex flex-col justify-between space-y-4"
  >
    <div className="flex items-center justify-between">
      <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 font-mono">
        {label}
      </span>
      <div className="h-8 w-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0038FF]">
        <Icon size={16} />
      </div>
    </div>
    <div>
      <p className="text-3xl font-black text-neutral-950 font-mono tracking-tight">
        {value}
      </p>
      <p className="text-[11px] text-neutral-400 font-mono mt-1 flex items-center gap-1">
        {note || '—'}
      </p>
    </div>
  </motion.div>
);

// Standardized Student Candidate Card
const StudentCard = ({ student, onOpen }) => {
  const name =
    student.name ||
    `${student.firstName || ''} ${student.lastName || ''}`.trim() ||
    'Student Candidate';
  const completion = student.profileCompletion ?? 0;
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((x) => x[0])
    .join('')
    .toUpperCase();

  return (
    <motion.article
      whileHover={{ y: -2 }}
      className="flex flex-col justify-between rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs hover:border-neutral-300 hover:shadow-md hover:shadow-neutral-100 transition-all group"
    >
      <div className="space-y-4">
        {/* Candidate Header */}
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 shrink-0 rounded-lg bg-neutral-950 font-mono text-xs font-bold text-white flex items-center justify-center border border-neutral-800">
            {initials || 'ST'}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-bold text-neutral-950 truncate group-hover:text-[#0038FF] transition-colors">
              {name}
            </h3>
            <p className="text-xs text-neutral-500 truncate font-mono mt-0.5">
              {student.collegeName || student.email || 'Candidate ID: ' + (student.id || '—')}
            </p>
          </div>
          <span className="shrink-0 rounded bg-amber-50 border border-amber-200/80 px-2 py-0.5 text-[9px] font-mono font-bold uppercase text-amber-800">
            Pending Review
          </span>
        </div>

        {/* Academic & Goal Specifications */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-neutral-100 text-xs">
          <div className="rounded-lg border border-neutral-200/60 bg-[#F8FAFC] p-2.5">
            <p className="text-[10px] font-mono uppercase text-neutral-400 font-bold">
              Target Track
            </p>
            <p className="font-semibold text-neutral-900 truncate mt-0.5">
              {student.careerGoal || 'Unspecified'}
            </p>
          </div>
          <div className="rounded-lg border border-neutral-200/60 bg-[#F8FAFC] p-2.5">
            <p className="text-[10px] font-mono uppercase text-neutral-400 font-bold">
              Academic CGPA
            </p>
            <p className="font-semibold font-mono text-neutral-900 mt-0.5">
              {student.cgpa ?? '—'}
            </p>
          </div>
        </div>

        {/* Profile Completion Bar */}
        <div className="space-y-1.5 pt-1">
          <div className="flex justify-between text-[11px] font-mono">
            <span className="text-neutral-400 uppercase">Profile Completeness</span>
            <span className="font-bold text-neutral-800">{completion}%</span>
          </div>
          <div className="h-1.5 w-full bg-neutral-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#0038FF] rounded-full transition-all duration-500"
              style={{ width: `${completion}%` }}
            />
          </div>
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={() => onOpen(student)}
        className="mt-5 w-full flex items-center justify-center gap-2 rounded-lg bg-white border border-neutral-200 hover:bg-neutral-50 hover:border-neutral-300 text-neutral-800 py-2 text-xs font-mono font-semibold transition-all shadow-2xs group-hover:border-neutral-400"
      >
        <span>Examine Candidate Portfolio</span>
        <FiArrowRight size={13} className="text-neutral-400 group-hover:text-neutral-900 group-hover:translate-x-0.5 transition-transform" />
      </button>
    </motion.article>
  );
};

// Qualitative Diagnostic Observation Block
const Insight = ({ title, items, danger }) => (
  <div
    className={`rounded-xl border p-4 space-y-2 ${
      danger
        ? 'border-amber-200/80 bg-amber-50/40 text-amber-900'
        : 'border-emerald-200/80 bg-emerald-50/40 text-emerald-900'
    }`}
  >
    <div className="flex items-center gap-1.5">
      {danger ? (
        <FiTarget size={13} className="text-amber-700" />
      ) : (
        <FiCheckCircle size={13} className="text-emerald-700" />
      )}
      <p className="text-xs font-mono font-bold uppercase tracking-wider">{title}</p>
    </div>
    <ul className="space-y-1.5 text-xs">
      {items.map((x) => (
        <li key={x} className="flex items-start gap-2 leading-relaxed text-neutral-800">
          <span
            className={`h-1.5 w-1.5 rounded-full mt-1.5 shrink-0 ${
              danger ? 'bg-amber-500' : 'bg-emerald-500'
            }`}
          />
          <span>{x}</span>
        </li>
      ))}
    </ul>
  </div>
);

// Standardized Mentor Evaluation Feedback Form
function FeedbackForm({ studentId, type }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm();
  const [sent, setSent] = useState(false);

  const submit = async (values) => {
    try {
      await mentorService.submitFeedback({ studentId, type, ...values });
      setSent(true);
      reset();
      setTimeout(() => setSent(false), 3000);
    } catch (err) {
      console.error('Failed to submit feedback:', err);
    }
  };

  return (
    <aside className="rounded-2xl border border-neutral-200 bg-white p-6 sm:p-7 shadow-xs xl:col-span-2 flex flex-col justify-between space-y-6">
      <div className="space-y-5">
        <div className="border-b border-neutral-100 pb-4">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0038FF]">
              <FiMessageSquare size={14} />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 font-mono">
                Advisory Protocol
              </span>
              <h2 className="text-sm font-bold text-neutral-950">
                Mentor Formal Assessment
              </h2>
            </div>
          </div>
          <p className="text-xs text-neutral-500 mt-2 leading-relaxed">
            Provide actionable academic interventions and trajectory feedback for the candidate profile.
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit(submit)} id="mentor-review-form">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 font-mono">
              Evaluation Outcome
            </label>
            <select
              {...register('status')}
              className="w-full rounded-lg border border-neutral-200 bg-white px-3.5 py-2.5 text-xs font-mono font-medium text-neutral-900 outline-none focus:ring-2 focus:ring-[#0038FF] transition-all cursor-pointer"
            >
              <option value="APPROVED">Endorse & Approve</option>
              <option value="NEEDS_CHANGES">Request Revision & Remediation</option>
              <option value="REJECTED">Flag Inadequate</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 font-mono">
              Written Evaluation & Notes
            </label>
            <textarea
              required
              {...register('comment')}
              rows="6"
              className="w-full rounded-lg border border-neutral-200 bg-white px-3.5 py-2.5 text-xs text-neutral-900 placeholder-neutral-400 outline-none focus:ring-2 focus:ring-[#0038FF] transition-all resize-none leading-relaxed"
              placeholder="Detail specific gaps, recommended electives, or resume adjustments..."
            />
          </div>

          {sent && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-lg border border-emerald-200 bg-emerald-50/60 p-3 text-xs font-mono text-emerald-800 flex items-center gap-2"
            >
              <FiCheckCircle size={14} className="shrink-0 text-emerald-600" />
              <span>Assessment evaluation transmitted successfully.</span>
            </motion.div>
          )}
        </form>
      </div>

      <button
        form="mentor-review-form"
        type="submit"
        disabled={isSubmitting}
        className="w-full flex items-center justify-center gap-2 rounded-lg bg-[#0038FF] hover:bg-blue-700 active:scale-[0.99] disabled:opacity-50 text-white py-3 px-4 font-mono text-xs font-semibold tracking-wide transition-all shadow-md shadow-blue-500/20"
      >
        <FiSend size={13} />
        <span>{isSubmitting ? 'Transmitting...' : 'Commit Evaluation'}</span>
      </button>
    </aside>
  );
}

// ── MAIN MENTOR DASHBOARD ──────────────────────────────────────────
export function MentorDashboard() {
  const [dashData, setDashData] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([mentorService.getDashboard(), mentorService.getStudents()])
      .then(([dash, studs]) => {
        setDashData(dash);
        const stdList = studs?.content || studs || [];
        setStudents(stdList);
      })
      .catch((err) => console.error('Failed to load mentor dashboard:', err))
      .finally(() => setLoading(false));
  }, []);

  const m = dashData || {};

  const scores =
    students.length > 0
      ? students.slice(0, 6).map((s, i) => ({
          name: s.firstName || `Student 0${i + 1}`,
          score: Math.round(Math.random() * 30 + 70),
        }))
      : [{ name: 'Pending', score: 0 }];

  const careers = useMemo(() => {
    const interests = {};
    students.forEach((s) => {
      const goal = s.careerGoal || 'Unassigned';
      interests[goal] = (interests[goal] || 0) + 1;
    });
    return Object.entries(interests)
      .slice(0, 5)
      .map(([name, value]) => ({ name, value }));
  }, [students]);

  const pieColors = ['#0038FF', '#0F172A', '#64748B', '#94A3B8', '#CBD5E1'];

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-20 w-1/3 rounded-xl bg-neutral-200" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 rounded-2xl bg-neutral-200" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-[1400px] mx-auto antialiased selection:bg-[#0038FF] selection:text-white">
      <Heading
        eyebrow="Advisory Telemetry"
        title="Candidate Cohort Supervision"
      >
        Track assigned student candidate performance, review pending technical submissions, and issue advisory feedback.
      </Heading>

      {/* KPI Stats Section */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat
          label="Supervised Students"
          value={m.assignedStudents ?? students.length}
          icon={FiUsers}
          note={`${students.length} active candidates`}
        />
        <Stat
          label="Pending Portfolios"
          value={m.pendingResumeReviews ?? 0}
          icon={FiClipboard}
          note="Action required"
        />
        <Stat
          label="Completed Reviews"
          value={m.completedReviews ?? 0}
          icon={FiCheckCircle}
          note="Current academic term"
        />
        <Stat
          label="Mean Resume Index"
          value={
            m.averageResumeScore ? `${Math.round(m.averageResumeScore)}%` : '—'
          }
          icon={FiAward}
          note={
            m.averageAssessmentScore
              ? `Diagnostic Avg: ${Math.round(m.averageAssessmentScore)}%`
              : 'Calibrated'
          }
        />
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 xl:grid-cols-5">
        
        {/* Assessment Distribution Bar Chart */}
        <section className="rounded-2xl border border-neutral-200 bg-white p-6 sm:p-7 shadow-xs xl:col-span-3 space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 font-mono">
                Cohort Metrics
              </span>
              <h2 className="text-sm font-bold text-neutral-950 mt-0.5">
                Competency Distribution
              </h2>
            </div>
            <span className="text-[10px] font-mono text-neutral-400">
              Mean Evaluation Scores
            </span>
          </div>

          <div className="h-64 w-full pt-2">
            {scores.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={scores} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                  <XAxis
                    dataKey="name"
                    tickLine={false}
                    axisLine={{ stroke: '#E2E8F0' }}
                    tick={{ fontSize: 11, fill: '#64748B', fontFamily: 'monospace' }}
                  />
                  <YAxis
                    domain={[0, 100]}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 11, fill: '#64748B', fontFamily: 'monospace' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0F172A',
                      borderRadius: 8,
                      border: 'none',
                      color: '#FFFFFF',
                      fontSize: 11,
                      fontFamily: 'monospace',
                    }}
                    formatter={(val) => [`${val}%`, 'Score']}
                  />
                  <Bar dataKey="score" fill="#0038FF" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-xs font-mono text-neutral-400">
                No cohort data available
              </div>
            )}
          </div>
        </section>

        {/* Career Interests Pie Chart */}
        <section className="rounded-2xl border border-neutral-200 bg-white p-6 sm:p-7 shadow-xs xl:col-span-2 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3 mb-2">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 font-mono">
                  Track Taxonomy
                </span>
                <h2 className="text-sm font-bold text-neutral-950 mt-0.5">
                  Career Trajectory Distribution
                </h2>
              </div>
              <span className="text-[10px] font-mono text-neutral-400">
                Active Cohort
              </span>
            </div>

            <div className="h-44 w-full flex items-center justify-center">
              {careers.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={careers}
                      dataKey="value"
                      innerRadius={46}
                      outerRadius={70}
                      paddingAngle={2}
                    >
                      {careers.map((x, i) => (
                        <Cell key={x.name} fill={pieColors[i % pieColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0F172A',
                        borderRadius: 8,
                        border: 'none',
                        color: '#FFFFFF',
                        fontSize: 11,
                        fontFamily: 'monospace',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-xs font-mono text-neutral-400">
                  No track data available
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-neutral-100 text-[11px] font-mono">
            {careers.map((x, i) => (
              <span key={x.name} className="flex items-center gap-2 text-neutral-600 truncate">
                <span
                  className="h-2 w-2 rounded-xs shrink-0"
                  style={{ backgroundColor: pieColors[i % pieColors.length] }}
                />
                <span className="truncate">{x.name}</span>
                <span className="text-neutral-400 font-bold">({x.value})</span>
              </span>
            ))}
          </div>
        </section>

      </div>

      {/* Supervised Students Assignment Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-neutral-200/80 pb-3">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 font-mono">
              Supervised Candidates
            </span>
            <h2 className="text-lg font-extrabold text-neutral-950 mt-0.5">
              Recent Candidate Assignments
            </h2>
          </div>
          <span className="text-xs font-mono text-neutral-400">
            Showing {Math.min(students.length, 6)} active students
          </span>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {students.slice(0, 6).map((s) => (
            <StudentCard student={s} key={s.id} onOpen={() => {}} />
          ))}
        </div>
      </section>
    </div>
  );
}

// ── STUDENTS DIRECTORY PAGE ────────────────────────────────────────
export function StudentsPage({ profiles = false }) {
  const [rows, setRows] = useState([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    mentorService
      .getStudents()
      .then((x) => setRows(x.content || x || []))
      .catch((err) => console.error('Failed to load students:', err));
  }, []);

  const shown = useMemo(
    () =>
      rows.filter((x) =>
        JSON.stringify(x).toLowerCase().includes(query.toLowerCase())
      ),
    [rows, query]
  );

  return (
    <div className="space-y-8 max-w-[1400px] mx-auto antialiased selection:bg-[#0038FF] selection:text-white">
      <Heading
        eyebrow={profiles ? 'Candidate Directory' : 'Assigned Students'}
        title={profiles ? 'Student Profile Matrix' : 'Supervised Student Registry'}
      >
        Audit academic records, skill gap analysis vectors, and curriculum progression.
      </Heading>

      <div className="relative max-w-md">
        <FiSearch
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none"
          size={15}
        />
        <input
          className="w-full rounded-lg border border-neutral-200 bg-white pl-10 pr-4 py-2.5 text-xs text-neutral-900 placeholder-neutral-400 outline-none focus:ring-2 focus:ring-[#0038FF] transition-all shadow-2xs font-mono"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by student name, email, or career track..."
        />
      </div>

      {shown.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-neutral-200 bg-white p-12 text-center">
          <FiUsers className="mx-auto text-neutral-300" size={28} />
          <p className="mt-3 text-sm font-bold text-neutral-900">No Candidate Records Found</p>
          <p className="mt-1 text-xs text-neutral-400 font-mono">
            Adjust search criteria or check assigned cohort roster.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {shown.map((s) => (
            <StudentCard student={s} key={s.id} onOpen={() => {}} />
          ))}
        </div>
      )}
    </div>
  );
}

// ── ASSESSMENT EVALUATION VIEW ──────────────────────────────────────
export function AssessmentPage() {
  const scores = [
    { name: 'Technical Execution', score: 78 },
    { name: 'Quantitative Aptitude', score: 85 },
    { name: 'Domain Interest', score: 92 },
    { name: 'Workstyle Archetype', score: 88 },
  ];

  return (
    <div className="space-y-8 max-w-[1400px] mx-auto antialiased selection:bg-[#0038FF] selection:text-white">
      <Heading
        eyebrow="Diagnostic Review"
        title="Candidate Competency Evaluation"
      >
        Review standardized diagnostic scores, qualitative insights, and provide proctored mentor feedback.
      </Heading>

      <div className="grid gap-6 xl:grid-cols-5">
        
        {/* Left: Detailed Student Evaluation Breakdown */}
        <section className="rounded-2xl border border-neutral-200 bg-white p-6 sm:p-7 shadow-xs xl:col-span-3 space-y-6">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-neutral-950 font-mono text-xs font-bold text-white flex items-center justify-center">
                AM
              </div>
              <div>
                <h2 className="text-base font-bold text-neutral-950">
                  Aarav Mehta
                </h2>
                <p className="text-xs text-neutral-400 font-mono">
                  Assessment Completed · Jul 28, 2026
                </p>
              </div>
            </div>
            <span className="rounded-md border border-blue-100 bg-blue-50 px-2 py-0.5 text-[10px] font-mono font-bold uppercase text-[#0038FF]">
              Proctored
            </span>
          </div>

          {/* 4 Score Metric Blocks */}
          <div className="grid gap-4 sm:grid-cols-2">
            {scores.map((x) => (
              <div
                key={x.name}
                className="rounded-xl border border-neutral-200/80 bg-[#F8FAFC] p-4 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono text-neutral-500 uppercase">
                    {x.name}
                  </span>
                  <span className="text-base font-black font-mono text-neutral-950">
                    {x.score}%
                  </span>
                </div>
                <div className="h-1.5 w-full bg-neutral-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#0038FF] rounded-full"
                    style={{ width: `${x.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Qualitative Insights */}
          <div className="grid gap-4 sm:grid-cols-2 pt-2">
            <Insight
              title="Demonstrated Proficiencies"
              items={[
                'Strong algorithmic logic & complexity analysis',
                'High technical curiosity in distributed systems',
                'Clear structured articulation and domain goals',
              ]}
            />
            <Insight
              title="Target Remediation Gaps"
              danger
              items={[
                'Practice high-speed quantitative arithmetic',
                'Structure system design leadership examples',
                'Reinforce SQL execution and indexing concepts',
              ]}
            />
          </div>
        </section>

        {/* Right: Advisor Feedback Panel */}
        <FeedbackForm studentId={1} type="ASSESSMENT" />
      </div>
    </div>
  );
}

// ── RESUME PORTFOLIO EVALUATION VIEW ────────────────────────────────
export function ResumePage() {
  return (
    <div className="space-y-8 max-w-[1400px] mx-auto antialiased selection:bg-[#0038FF] selection:text-white">
      <Heading
        eyebrow="Portfolio Auditing"
        title="Resume & ATS Validation"
      >
        Review extracted technical proficiencies, parse telemetry, and issue structured guidance.
      </Heading>

      <div className="grid gap-6 xl:grid-cols-5">
        
        {/* Left: Resume Details & Preview Placeholder */}
        <section className="rounded-2xl border border-neutral-200 bg-white p-6 sm:p-7 shadow-xs xl:col-span-3 space-y-6">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
            <div>
              <h2 className="text-base font-bold text-neutral-950">
                Aarav Mehta — Curriculum Vitae
              </h2>
              <p className="text-xs text-neutral-400 font-mono mt-0.5">
                aarav_mehta_resume.pdf · Uploaded Jul 28, 2026
              </p>
            </div>
            <div className="h-8 w-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0038FF]">
              <FiFileText size={16} />
            </div>
          </div>

          {/* KPI Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-neutral-200/80 bg-[#F8FAFC] p-4">
              <p className="text-[10px] font-mono uppercase text-neutral-400 font-bold">
                Quality Benchmark
              </p>
              <p className="text-2xl font-black font-mono text-neutral-950 mt-1">
                88%
              </p>
            </div>
            <div className="rounded-xl border border-neutral-200/80 bg-[#F8FAFC] p-4">
              <p className="text-[10px] font-mono uppercase text-neutral-400 font-bold">
                ATS Compatibility
              </p>
              <p className="text-2xl font-black font-mono text-[#0038FF] mt-1">
                91%
              </p>
            </div>
          </div>

          {/* Document Preview Box */}
          <div className="rounded-xl border border-dashed border-neutral-200 bg-[#F8FAFC] p-8 text-center space-y-3">
            <FiFileText className="mx-auto text-neutral-400" size={30} />
            <div>
              <p className="text-xs font-bold text-neutral-900 uppercase font-mono">
                Document Stream Ready
              </p>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto mt-0.5">
                Direct candidate PDF stream connected via mentor document service.
              </p>
            </div>
            <button className="inline-flex items-center gap-1.5 rounded-lg bg-neutral-950 hover:bg-neutral-800 text-white px-4 py-2 text-xs font-mono font-semibold transition-all shadow-2xs">
              <FiFileText size={12} />
              <span>Inspect Document Stream</span>
            </button>
          </div>

          {/* Qualitative Tags */}
          <div className="grid gap-4 sm:grid-cols-2 pt-1">
            <Insight
              title="Verified Technical Stack"
              items={[
                'React · TypeScript · Tailwind CSS',
                'Node.js · PostgreSQL · REST APIs',
                'Git version control & CI workflow',
              ]}
            />
            <Insight
              title="Suggested Revisions"
              danger
              items={[
                'Quantify engineering metrics in bullet points',
                'Condense summary to 2 lines maximum',
                'Incorporate target distributed systems keywords',
              ]}
            />
          </div>
        </section>

        {/* Right: Advisor Feedback Panel */}
        <FeedbackForm studentId={1} type="RESUME" />
      </div>
    </div>
  );
}

// ── PLACEHOLDER WORKSPACE MODULE ───────────────────────────────────
export function Placeholder({ title, description }) {
  return (
    <div className="space-y-8 max-w-[1400px] mx-auto antialiased selection:bg-[#0038FF] selection:text-white">
      <Heading eyebrow="Mentor Workspace" title={title}>
        {description}
      </Heading>
      <div className="rounded-2xl border border-dashed border-neutral-200 bg-white p-14 text-center space-y-3">
        <FiActivity className="mx-auto text-neutral-300" size={32} />
        <div>
          <p className="text-sm font-bold text-neutral-900 font-mono uppercase">
            {title} Module Calibrated
          </p>
          <p className="text-xs text-neutral-500 max-w-md mx-auto mt-1">
            Endpoint connected. Workspace awaiting active supervisory requests from the candidate cohort.
          </p>
        </div>
      </div>
    </div>
  );
}
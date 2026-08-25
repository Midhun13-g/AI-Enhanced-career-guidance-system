import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiUser, FiTrendingUp, FiTarget, FiZap, FiArrowRight,
  FiBookOpen, FiAward, FiClock, FiAlertCircle,
} from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi2';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import AppLayout from '../components/layout/AppLayout';
import { Card, Badge, ProgressBar, StatCard, SkeletonCard, Skeleton } from '../components/ui';

// ── Animated counter ──────────────────────────────────────────────────────────
function Counter({ to, suffix = '' }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = Math.ceil(to / 40);
    const t = setInterval(() => {
      start += step;
      if (start >= to) { setVal(to); clearInterval(t); }
      else setVal(start);
    }, 30);
    return () => clearInterval(t);
  }, [to]);
  return <>{val}{suffix}</>;
}

// ── AI Insight card ───────────────────────────────────────────────────────────
function AIInsightCard({ user, completion }) {
  const pct = completion?.profileCompletion ?? 0;
  const tip = pct < 50
    ? 'Complete your profile to unlock personalised AI career recommendations.'
    : pct < 80
    ? 'You\'re almost there! Add your skills and career goal to boost your match score.'
    : 'Great profile! Your AI career recommendations are ready to explore.';

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 p-6 text-white shadow-xl shadow-blue-200/40">
      <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/10 blur-2xl" />
      <div className="absolute -bottom-8 -left-8 w-36 h-36 rounded-full bg-teal-400/20 blur-2xl" />
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center">
              <HiSparkles size={18} />
            </div>
            <div>
              <p className="text-xs font-semibold text-blue-200 uppercase tracking-wider">AI Assistant</p>
              <p className="text-sm font-bold">Career Intelligence</p>
            </div>
          </div>
        </div>
        <h3 className="text-xl font-extrabold leading-snug mb-2">
          Hello, {user?.firstName || 'Student'} 👋
        </h3>
        <p className="text-blue-100 text-sm leading-relaxed mb-5">{tip}</p>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-blue-200">Profile strength</span>
          <span className="text-sm font-bold">{pct}%</span>
        </div>
        <div className="h-2 bg-white/20 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 1.4, ease: 'easeOut' }}
            className="h-full rounded-full bg-white"
          />
        </div>
        <Link to="/profile" className="mt-5 inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all duration-200">
          Complete Profile <FiArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}

// ── Missing fields ────────────────────────────────────────────────────────────
function MissingFieldsCard({ fields }) {
  if (!fields?.length) return null;
  return (
    <Card className="p-5">
      <div className="flex items-center gap-2 mb-3">
        <FiAlertCircle className="text-amber-500" size={16} />
        <p className="text-sm font-semibold text-slate-700">Missing fields</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {fields.map(f => (
          <Badge key={f} variant="warning">{f}</Badge>
        ))}
      </div>
    </Card>
  );
}

// ── Quick action card ─────────────────────────────────────────────────────────
function QuickAction({ icon: Icon, label, desc, to, color }) {
  const colors = {
    blue:   'bg-blue-50 text-blue-600 border-blue-100',
    purple: 'bg-purple-50 text-purple-600 border-purple-100',
    teal:   'bg-teal-50 text-teal-600 border-teal-100',
    amber:  'bg-amber-50 text-amber-600 border-amber-100',
  };
  return (
    <Link to={to}>
      <Card hover className="p-5 flex items-start gap-4 group">
        <div className={`p-3 rounded-xl border shrink-0 ${colors[color]}`}>
          <Icon size={20} />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">{label}</p>
          <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{desc}</p>
        </div>
        <FiArrowRight size={15} className="text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all shrink-0 mt-1" />
      </Card>
    </Link>
  );
}

// ── Radar chart placeholder data ──────────────────────────────────────────────
const radarData = [
  { subject: 'Technical', A: 80 },
  { subject: 'Problem Solving', A: 65 },
  { subject: 'Communication', A: 55 },
  { subject: 'Leadership', A: 40 },
  { subject: 'Creativity', A: 70 },
  { subject: 'Teamwork', A: 75 },
];

// ── Main component ────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const { user, logout } = useAuth();
  const [completion, setCompletion] = useState({ profileCompletion: 0, missingFields: [] });
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    api.get('/api/profile/completion')
      .then(res => setCompletion(res.data))
      .catch(console.error)
      .finally(() => setLoadingData(false));
  }, []);

  const fadeUp = { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 } };

  return (
    <AppLayout>
      <div className="space-y-8">

        {/* ── Top stats row ── */}
        {loadingData ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <motion.div {...fadeUp} transition={{ duration: 0.3 }} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon={<FiUser />}      label="Profile Strength"    value={`${completion.profileCompletion}%`} color="blue"   />
            <StatCard icon={<FiTarget />}    label="Career Match Score"  value="—"                                  color="purple" />
            <StatCard icon={<FiTrendingUp />} label="Skills Tracked"     value="—"                                  color="teal"   />
            <StatCard icon={<FiAward />}     label="Recommendations"     value="—"                                  color="amber"  />
          </motion.div>
        )}

        {/* ── Main grid ── */}
        <div className="grid gap-6 lg:grid-cols-3">

          {/* Left col — AI card + quick actions */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div {...fadeUp} transition={{ duration: 0.35, delay: 0.05 }}>
              <AIInsightCard user={user} completion={completion} />
            </motion.div>

            {/* Quick actions */}
            <motion.div {...fadeUp} transition={{ duration: 0.35, delay: 0.1 }}>
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Quick Actions</p>
              <div className="grid sm:grid-cols-2 gap-3">
                <QuickAction icon={FiUser}      label="Complete Profile"       desc="Add skills, goals & education"    to="/profile"  color="blue"   />
                <QuickAction icon={FiZap}       label="Assessment Hub"         desc="Take published skill evaluations" to="/assessments/categories" color="purple" />
                <QuickAction icon={FiBookOpen}  label="AI Career Guidance"     desc="Job matches & dynamic roadmap"    to="/resume/ai-guidance"  color="teal"   />
                <QuickAction icon={FiTrendingUp} label="Skill Gap Analysis"    desc="Identify missing competencies"    to="/assessments/skill-gap" color="amber"  />
              </div>
            </motion.div>

            {/* Missing fields */}
            {!loadingData && (
              <motion.div {...fadeUp} transition={{ duration: 0.35, delay: 0.15 }}>
                <MissingFieldsCard fields={completion.missingFields} />
              </motion.div>
            )}
          </div>

          {/* Right col — profile completion + radar */}
          <div className="space-y-6">
            {/* Profile completion */}
            <motion.div {...fadeUp} transition={{ duration: 0.35, delay: 0.1 }}>
              <Card className="p-6">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-semibold text-slate-700">Profile Completion</p>
                  <span className="text-2xl font-extrabold text-blue-600">
                    {loadingData ? '—' : <Counter to={completion.profileCompletion} suffix="%" />}
                  </span>
                </div>
                {loadingData ? <Skeleton className="h-2.5 w-full" /> : (
                  <ProgressBar value={completion.profileCompletion} color="gradient" size="md" />
                )}

                {/* Checklist */}
                <div className="mt-5 space-y-2.5">
                  {[
                    { label: 'Basic info',    done: true },
                    { label: 'Education',     done: true },
                    { label: 'Skills',        done: !completion.missingFields?.includes('Skills') },
                    { label: 'Career goal',   done: !completion.missingFields?.includes('Career Goal') },
                    { label: 'LinkedIn URL',  done: !completion.missingFields?.includes('LinkedIn') },
                  ].map(({ label, done }) => (
                    <div key={label} className="flex items-center gap-2.5">
                      <div className={`h-4 w-4 rounded-full flex items-center justify-center shrink-0 ${done ? 'bg-emerald-500' : 'bg-slate-100 border border-slate-200'}`}>
                        {done && <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 12 12"><path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                      </div>
                      <span className={`text-xs font-medium ${done ? 'text-slate-600 line-through' : 'text-slate-700'}`}>{label}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Skill radar */}
            <motion.div {...fadeUp} transition={{ duration: 0.35, delay: 0.15 }}>
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <HiSparkles className="text-blue-600" size={16} />
                  <p className="text-sm font-semibold text-slate-700">Skill Overview</p>
                </div>
                <ResponsiveContainer width="100%" height={200}>
                  <RadarChart data={radarData} margin={{ top: 0, right: 20, bottom: 0, left: 20 }}>
                    <PolarGrid stroke="#e2e8f0" />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                    <Radar name="Skills" dataKey="A" stroke="#2563EB" fill="#2563EB" fillOpacity={0.15} strokeWidth={2} />
                    <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
                  </RadarChart>
                </ResponsiveContainer>
                <p className="text-xs text-slate-400 text-center mt-2">Complete your profile to see real data</p>
              </Card>
            </motion.div>

            {/* Recent activity */}
            <motion.div {...fadeUp} transition={{ duration: 0.35, delay: 0.2 }}>
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <FiClock className="text-slate-400" size={15} />
                  <p className="text-sm font-semibold text-slate-700">Recent Activity</p>
                </div>
                <div className="space-y-3">
                  {[
                    { text: 'Account created',       time: 'Just now',   color: 'bg-blue-500' },
                    { text: 'Profile setup started', time: '1 min ago',  color: 'bg-indigo-500' },
                  ].map((a, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className={`mt-1.5 h-2 w-2 rounded-full shrink-0 ${a.color}`} />
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-slate-700">{a.text}</p>
                        <p className="text-xs text-slate-400">{a.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

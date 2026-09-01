import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiUser, FiTrendingUp, FiTarget, FiZap, FiArrowRight,
  FiBookOpen, FiAward, FiClock, FiAlertCircle, FiCheck,
  FiCompass, FiActivity, FiLayers, FiExternalLink
} from 'react-icons/fi';
import { 
  RadarChart, PolarGrid, PolarAngleAxis, Radar, 
  ResponsiveContainer, Tooltip 
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import AppLayout from '../components/layout/AppLayout';
import { SkeletonCard } from '../components/ui';

function Counter({ to, suffix = '' }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = Math.ceil(to / 40) || 1;
    const t = setInterval(() => {
      start += step;
      if (start >= to) { setVal(to); clearInterval(t); }
      else setVal(start);
    }, 25);
    return () => clearInterval(t);
  }, [to]);
  return <span className="font-mono">{val}{suffix}</span>;
}

const radarData = [
  { subject: 'Technical', A: 88 },
  { subject: 'Problem Solving', A: 72 },
  { subject: 'System Design', A: 60 },
  { subject: 'Leadership', A: 45 },
  { subject: 'Communication', A: 78 },
  { subject: 'Collaboration', A: 82 },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const [completion, setCompletion] = useState({ profileCompletion: 100, missingFields: [] });
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    api.get('/api/profile/completion')
      .then(res => setCompletion(res.data))
      .catch(console.error)
      .finally(() => setLoadingData(false));
  }, []);

  const fadeUp = { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 } };

  return (
    <AppLayout>
      <div className="space-y-6 max-w-[1400px] mx-auto pb-10">
        
        {/* ── Metric KPI Ribbon ── */}
        {loadingData ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <motion.div {...fadeUp} transition={{ duration: 0.25 }} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="bg-white border border-neutral-200/90 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 font-mono">Profile Index</span>
                <span className="h-7 w-7 rounded-lg bg-blue-50 text-[#0038FF] flex items-center justify-center">
                  <FiUser size={14} />
                </span>
              </div>
              <div className="mt-3">
                <div className="text-2xl font-black text-neutral-950 font-mono tracking-tight">
                  <Counter to={completion.profileCompletion} suffix="%" />
                </div>
                <p className="text-[11px] text-neutral-400 font-mono mt-0.5">Curriculum calibrated</p>
              </div>
            </div>

            <div className="bg-white border border-neutral-200/90 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 font-mono">Match Target</span>
                <span className="h-7 w-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <FiTarget size={14} />
                </span>
              </div>
              <div className="mt-3">
                <div className="text-2xl font-black text-neutral-950 font-mono tracking-tight">94.2%</div>
                <p className="text-[11px] text-neutral-400 font-mono mt-0.5">High confidence score</p>
              </div>
            </div>

            <div className="bg-white border border-neutral-200/90 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 font-mono">Competencies</span>
                <span className="h-7 w-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                  <FiTrendingUp size={14} />
                </span>
              </div>
              <div className="mt-3">
                <div className="text-2xl font-black text-neutral-950 font-mono tracking-tight">12</div>
                <p className="text-[11px] text-neutral-400 font-mono mt-0.5">Skills actively audited</p>
              </div>
            </div>

            <div className="bg-white border border-neutral-200/90 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 font-mono">Benchmarks</span>
                <span className="h-7 w-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                  <FiAward size={14} />
                </span>
              </div>
              <div className="mt-3">
                <div className="text-2xl font-black text-neutral-950 font-mono tracking-tight">4</div>
                <p className="text-[11px] text-neutral-400 font-mono mt-0.5">Evaluations pending</p>
              </div>
            </div>

          </motion.div>
        )}

        {/* ── Main Analytical Workspace Grid ── */}
        <div className="grid gap-6 lg:grid-cols-12">

          {/* Left / Center Main Rail (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Adaptive Engine Hero Banner */}
            <motion.div {...fadeUp} transition={{ duration: 0.3, delay: 0.05 }}>
              <div className="relative overflow-hidden rounded-2xl border border-neutral-200/90 bg-white p-7 shadow-xs">
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#0038FF]" />

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4">
                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-[#0038FF] text-[10px] font-bold uppercase tracking-wider font-mono">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#0038FF] animate-pulse" />
                      Adaptive Guidance Engine
                    </div>
                    <h1 className="text-2xl font-extrabold tracking-tight text-neutral-950">
                      Welcome back, {user?.firstName || 'Student'}
                    </h1>
                  </div>

                  <Link 
                    to="/profile" 
                    className="inline-flex items-center gap-2 bg-[#0038FF] hover:bg-blue-700 active:scale-[0.99] text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-all shadow-md shadow-blue-500/20 shrink-0 self-start sm:self-auto"
                  >
                    <span>Update Roadmap</span>
                    <FiArrowRight size={13} />
                  </Link>
                </div>

                <p className="text-neutral-600 text-xs sm:text-sm leading-relaxed mb-6 max-w-2xl">
                  Curriculum calibrated. Recommended career progression trajectories and skill benchmarks are actively aligned with industry demand.
                </p>

                {/* Progress bar with integrated milestones */}
                <div className="bg-[#F8FAFC] border border-neutral-200/80 rounded-xl p-4">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-semibold text-neutral-700 uppercase tracking-wider text-[11px] font-mono">Roadmap Readiness Level</span>
                    <span className="font-extrabold text-[#0038FF] font-mono text-xs">{completion.profileCompletion}% Complete</span>
                  </div>
                  <div className="h-2 w-full bg-neutral-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${completion.profileCompletion}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      className="h-full bg-[#0038FF] rounded-full"
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Quick Actions / Workspace Operations */}
            <motion.div {...fadeUp} transition={{ duration: 0.3, delay: 0.1 }} className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider font-mono">Workspace Operations</span>
                <span className="text-[11px] text-neutral-400 font-mono">Select module to launch</span>
              </div>
              
              <div className="grid sm:grid-cols-2 gap-3.5">
                
                <Link to="/profile" className="group">
                  <div className="p-5 rounded-2xl border border-neutral-200/90 bg-white hover:border-[#0038FF]/40 hover:shadow-md transition-all shadow-2xs flex items-start gap-4 h-full">
                    <div className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-200/70 text-neutral-700 group-hover:bg-blue-50 group-hover:text-[#0038FF] group-hover:border-blue-100 transition-colors shrink-0">
                      <FiUser size={18} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-neutral-900 group-hover:text-[#0038FF] transition-colors">Edit Student Profile</p>
                      <p className="text-xs text-neutral-500 mt-1 leading-relaxed">Calibrate education, GPA & target specializations</p>
                    </div>
                    <FiArrowRight size={14} className="text-neutral-300 group-hover:text-[#0038FF] group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
                  </div>
                </Link>

                <Link to="/assessments/categories" className="group">
                  <div className="p-5 rounded-2xl border border-neutral-200/90 bg-white hover:border-[#0038FF]/40 hover:shadow-md transition-all shadow-2xs flex items-start gap-4 h-full">
                    <div className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-200/70 text-neutral-700 group-hover:bg-blue-50 group-hover:text-[#0038FF] group-hover:border-blue-100 transition-colors shrink-0">
                      <FiZap size={18} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-neutral-900 group-hover:text-[#0038FF] transition-colors">Assessment Hub</p>
                      <p className="text-xs text-neutral-500 mt-1 leading-relaxed">Standardized competency & coding evaluations</p>
                    </div>
                    <FiArrowRight size={14} className="text-neutral-300 group-hover:text-[#0038FF] group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
                  </div>
                </Link>

                <Link to="/resume/ai-guidance" className="group">
                  <div className="p-5 rounded-2xl border border-neutral-200/90 bg-white hover:border-[#0038FF]/40 hover:shadow-md transition-all shadow-2xs flex items-start gap-4 h-full">
                    <div className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-200/70 text-neutral-700 group-hover:bg-blue-50 group-hover:text-[#0038FF] group-hover:border-blue-100 transition-colors shrink-0">
                      <FiBookOpen size={18} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-neutral-900 group-hover:text-[#0038FF] transition-colors">Career Guidance</p>
                      <p className="text-xs text-neutral-500 mt-1 leading-relaxed">AI-synthesized pathways & role transition maps</p>
                    </div>
                    <FiArrowRight size={14} className="text-neutral-300 group-hover:text-[#0038FF] group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
                  </div>
                </Link>

                <Link to="/assessments/skill-gap" className="group">
                  <div className="p-5 rounded-2xl border border-neutral-200/90 bg-white hover:border-[#0038FF]/40 hover:shadow-md transition-all shadow-2xs flex items-start gap-4 h-full">
                    <div className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-200/70 text-neutral-700 group-hover:bg-blue-50 group-hover:text-[#0038FF] group-hover:border-blue-100 transition-colors shrink-0">
                      <FiTrendingUp size={18} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-neutral-900 group-hover:text-[#0038FF] transition-colors">Skill Gap Matrix</p>
                      <p className="text-xs text-neutral-500 mt-1 leading-relaxed">Audited benchmark variances and missing skills</p>
                    </div>
                    <FiArrowRight size={14} className="text-neutral-300 group-hover:text-[#0038FF] group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
                  </div>
                </Link>

              </div>
            </motion.div>

          </div>

          {/* Right Rail (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Checklist Pipeline */}
            <motion.div {...fadeUp} transition={{ duration: 0.3, delay: 0.1 }}>
              <div className="bg-white border border-neutral-200/90 rounded-2xl p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 font-mono">Checklist Pipeline</span>
                  <span className="text-xs font-bold text-[#0038FF] font-mono">{completion.profileCompletion}%</span>
                </div>

                <div className="space-y-2 pt-1">
                  {[
                    { label: 'Academic & Contact Info', done: true },
                    { label: 'Current Degree & CGPA', done: true },
                    { label: 'Primary Competencies', done: !completion.missingFields?.includes('Skills') },
                    { label: 'Target Career Goal', done: !completion.missingFields?.includes('Career Goal') },
                    { label: 'Public Portfolio / LinkedIn', done: !completion.missingFields?.includes('LinkedIn') },
                  ].map(({ label, done }) => (
                    <div key={label} className="flex items-center justify-between text-xs py-2 border-b border-neutral-100 last:border-none">
                      <span className={done ? 'text-neutral-500' : 'text-neutral-800 font-medium'}>
                        {label}
                      </span>
                      <span className={`h-4 w-4 rounded-md flex items-center justify-center shrink-0 ${done ? 'bg-blue-50 text-[#0038FF]' : 'bg-neutral-100 text-neutral-300'}`}>
                        {done && <FiCheck size={11} strokeWidth={3} />}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Competency Polygon */}
            <motion.div {...fadeUp} transition={{ duration: 0.3, delay: 0.15 }}>
              <div className="bg-white border border-neutral-200/90 rounded-2xl p-6 shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 font-mono">Competency Polygon</span>
                  <span className="text-[10px] font-mono text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded">Calibrated</span>
                </div>

                <div className="h-48 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData} margin={{ top: 0, right: 10, bottom: 0, left: 10 }}>
                      <PolarGrid stroke="#E2E8F0" />
                      <PolarAngleAxis dataKey="subject" tick={{ fontSize: 9, fill: '#64748B', fontWeight: 600 }} />
                      <Radar name="Proficiency" dataKey="A" stroke="#0038FF" fill="#0038FF" fillOpacity={0.14} strokeWidth={1.5} />
                      <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 11, padding: '4px 8px' }} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-[10px] text-neutral-400 text-center mt-1 font-mono">Calibrated against industry standards</p>
              </div>
            </motion.div>

            {/* Audit Log Activity */}
            <motion.div {...fadeUp} transition={{ duration: 0.3, delay: 0.2 }}>
              <div className="bg-white border border-neutral-200/90 rounded-2xl p-6 shadow-xs space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 font-mono">Audit Pipeline Activity</span>
                <div className="space-y-3 pt-1">
                  {[
                    { text: 'Profile initialized successfully', time: 'Just now' },
                    { text: 'Trajectory baseline calibrated', time: '2 mins ago' },
                  ].map((a, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#0038FF] shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-neutral-800">{a.text}</p>
                        <p className="text-[10px] text-neutral-400 font-mono mt-0.5">{a.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

          </div>

        </div>
      </div>
    </AppLayout>
  );
}
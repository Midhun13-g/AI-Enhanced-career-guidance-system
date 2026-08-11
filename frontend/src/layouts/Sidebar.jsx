import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, ClipboardCheck, FileText, UserRound,
  BarChart3, BookOpen, Briefcase, Settings, ChevronRight,
  Sparkles, X, ClipboardList, Layers, Brain, TrendingUp,
  Award, History, Trophy, Target, Code2, Upload, Users,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const NAV_SECTIONS = [
  {
    label: 'Main',
    items: [
      { to: '/dashboard',  label: 'Dashboard',    icon: LayoutDashboard, color: 'text-blue-600',   bg: 'bg-blue-50' },
      { to: '/profile',    label: 'My Profile',   icon: UserRound,       color: 'text-indigo-600', bg: 'bg-indigo-50' },
      { to: '/mentors',    label: 'Find a Mentor', icon: Users,           color: 'text-teal-600', bg: 'bg-teal-50' },
    ],
  },
  {
    label: 'Assessment Engine',
    items: [
      { to: '/assessments',              label: 'Assessment Hub',    icon: ClipboardList, color: 'text-blue-600',   bg: 'bg-blue-50',   badge: 'AI' },
      { to: '/assessments/categories',   label: 'Take Assessment',   icon: ClipboardCheck, color: 'text-indigo-600', bg: 'bg-indigo-50' },
      { to: '/assessments/coding',       label: 'Coding Challenge',  icon: Code2,         color: 'text-purple-600', bg: 'bg-purple-50' },
      { to: '/assessments/history',      label: 'History',           icon: History,       color: 'text-slate-600',  bg: 'bg-slate-100' },
      { to: '/assessments/certificates', label: 'Certificates',      icon: Trophy,        color: 'text-amber-600',  bg: 'bg-amber-50' },
    ],
  },
  {
    label: 'AI Insights',
    items: [
      { to: '/assessments/ai-analysis',  label: 'AI Analysis',       icon: Brain,         color: 'text-purple-600', bg: 'bg-purple-50', badge: 'AI' },
      { to: '/assessments/skill-growth', label: 'Skill Growth',      icon: TrendingUp,    color: 'text-teal-600',   bg: 'bg-teal-50',   badge: 'AI' },
      { to: '/assessments/skill-gap',    label: 'Skill Gap',         icon: Target,        color: 'text-rose-600',   bg: 'bg-rose-50',   badge: 'AI' },
      { to: '/assessments/result',       label: 'Result Analysis',   icon: BarChart3,     color: 'text-green-600',  bg: 'bg-green-50' },
    ],
  },
  {
    label: 'Resume Intelligence',
    items: [
      { to: '/resume',                label: 'Resume Dashboard',   icon: FileText,   color: 'text-teal-600',   bg: 'bg-teal-50',   badge: 'AI' },
      { to: '/resume/upload',         label: 'Upload Resume',      icon: Upload,     color: 'text-blue-600',   bg: 'bg-blue-50' },
      { to: '/resume/nlp-results',    label: 'NLP Extraction',     icon: Layers,     color: 'text-indigo-600', bg: 'bg-indigo-50', badge: 'AI' },
      { to: '/resume/skill-taxonomy', label: 'Skill Taxonomy',     icon: Layers,     color: 'text-purple-600', bg: 'bg-purple-50', badge: 'AI' },
      { to: '/resume/analysis',       label: 'Quality Analysis',   icon: BarChart3,  color: 'text-green-600',  bg: 'bg-green-50' },
      { to: '/resume/insights',       label: 'AI Insights',        icon: Sparkles,   color: 'text-amber-600',  bg: 'bg-amber-50',  badge: 'AI' },
      { to: '/resume/skill-profile',  label: 'Skill Profile',      icon: TrendingUp, color: 'text-rose-600',   bg: 'bg-rose-50' },
      { to: '/resume/history',        label: 'Resume History',     icon: History,    color: 'text-slate-600',  bg: 'bg-slate-100' },
      { to: '/resume/report',         label: 'Resume Report',      icon: FileText,   color: 'text-teal-600',   bg: 'bg-teal-50' },
    ],
  },
  {
    label: 'AI Tools',
    items: [
      { to: '/assessment/result',  label: 'Career Match',    icon: Briefcase,  color: 'text-amber-600', bg: 'bg-amber-50', badge: 'AI' },
    ],
  },
  {
    label: 'Learning',
    items: [
      { to: '/profile', label: 'Roadmap', icon: BookOpen, color: 'text-rose-600', bg: 'bg-rose-50' },
    ],
  },
];

function NavItem({ item, onClose }) {
  const location = useLocation();
  const active =
    location.pathname === item.to ||
    (item.to !== '/dashboard' && item.to !== '/profile' && location.pathname.startsWith(item.to));
  const Icon = item.icon;

  return (
    <Link
      to={item.to}
      onClick={onClose}
      aria-current={active ? 'page' : undefined}
      className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1
        ${active
          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-200/50'
          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
        }`}
    >
      <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-all duration-200
        ${active ? 'bg-white/20' : `${item.bg} ${item.color} group-hover:scale-110`}`}>
        <Icon size={15} aria-hidden="true" />
      </span>
      <span className="flex-1 truncate">{item.label}</span>
      {item.badge && (
        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full
          ${active ? 'bg-white/20 text-white' : 'bg-gradient-to-r from-blue-100 to-indigo-100 text-indigo-700'}`}>
          {item.badge}
        </span>
      )}
      {active && (
        <motion.div
          layoutId="activeIndicator"
          className="absolute right-2 h-1.5 w-1.5 rounded-full bg-white/70"
        />
      )}
    </Link>
  );
}

export default function Sidebar({ open, onClose }) {
  const { user } = useAuth();
  const initials = user
    ? `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase()
    : 'U';

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      <aside className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-100 bg-white shadow-xl transition-transform duration-300 ease-in-out
        lg:sticky lg:top-0 lg:z-20 lg:h-screen lg:translate-x-0 lg:shadow-none
        ${open ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-slate-100 shrink-0">
          <Link to="/dashboard" className="flex items-center gap-3" onClick={onClose}>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-md shadow-blue-200/50">
              <Sparkles size={17} className="text-white" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-black text-slate-900 tracking-tight">Career<span className="text-blue-600">AI</span></p>
              <p className="text-[10px] font-medium text-slate-400 tracking-wide uppercase">Guidance System</p>
            </div>
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
            aria-label="Close sidebar"
          >
            <X size={16} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5" aria-label="Main navigation">
          {NAV_SECTIONS.map((section) => (
            <div key={section.label}>
              <p className="mb-1.5 px-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                {section.label}
              </p>
              <div className="space-y-0.5">
                {section.items.map((item) => (
                  <NavItem key={item.to + item.label} item={item} onClose={onClose} />
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* AI Tip Banner */}
        <div className="mx-3 mb-3 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 p-4 shrink-0">
          <div className="flex items-center gap-2 mb-1.5">
            <Sparkles size={13} className="text-blue-600" />
            <p className="text-xs font-bold text-blue-700">AI Tip</p>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Complete assessments to improve your career readiness score.
          </p>
          <Link
            to="/assessments"
            onClick={onClose}
            className="mt-2.5 inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
          >
            Start now <ChevronRight size={11} />
          </Link>
        </div>

        {/* User footer */}
        <div className="border-t border-slate-100 px-3 py-3 shrink-0">
          <Link
            to="/profile"
            onClick={onClose}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-slate-50 transition-colors group"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-xs font-black text-white shadow-sm">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-800">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="truncate text-xs text-slate-400">{user?.email}</p>
            </div>
            <Settings size={14} className="text-slate-300 group-hover:text-slate-500 transition-colors shrink-0" />
          </Link>
        </div>
      </aside>
    </>
  );
}

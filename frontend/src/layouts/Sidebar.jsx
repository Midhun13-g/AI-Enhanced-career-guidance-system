import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiGrid,
  FiUser,
  FiUsers,
  FiClipboard,
  FiCheckSquare,
  FiCode,
  FiClock,
  FiAward,
  FiCpu,
  FiTrendingUp,
  FiTarget,
  FiBarChart2,
  FiFileText,
  FiUploadCloud,
  FiCompass,
  FiLayers,
  FiSettings,
  FiX,
  FiActivity,
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const NAV_SECTIONS = [
  {
    label: 'Workspace',
    items: [
      { to: '/student/dashboard', label: 'Dashboard', icon: FiGrid },
      { to: '/profile', label: 'Candidate Profile', icon: FiUser },
      { to: '/mentors', label: 'Expert Network', icon: FiUsers },
    ],
  },
  {
    label: 'Assessment Engine',
    items: [
      { to: '/assessments/categories', label: 'Assessment Hub', icon: FiClipboard, exact: true },
      { to: '/assessment', label: 'Active Assessment', icon: FiCheckSquare, activePaths: ['/assessment', '/assessments/take/'] },
      { to: '/assessments/coding', label: 'Coding Practice', icon: FiCode },
      { to: '/assessments/history', label: 'Evaluation History', icon: FiClock },
      { to: '/assessments/certificates', label: 'Accreditations', icon: FiAward },
    ],
  },
  {
    label: 'AI Diagnostics',
    items: [
      { to: '/assessments/ai-analysis', label: 'Diagnostic Engine', icon: FiCpu },
      { to: '/assessments/skill-growth', label: 'Skill Trajectory', icon: FiTrendingUp },
      { to: '/assessments/skill-gap', label: 'Gap Matrix', icon: FiTarget },
      { to: '/assessments/result', label: 'Performance Vectors', icon: FiBarChart2 },
    ],
  },
  {
    label: 'Resume Intelligence',
    items: [
      { to: '/resume', label: 'Resume Workspace', icon: FiFileText, exact: true },
      { to: '/resume/upload', label: 'Upload Document', icon: FiUploadCloud },
      { to: '/resume/ai-guidance', label: 'Career Guidance Hub', icon: FiCompass },
      { to: '/resume/nlp-results', label: 'NER Extractions', icon: FiLayers },
      { to: '/resume/skill-taxonomy', label: 'Skill Taxonomy', icon: FiActivity },
      { to: '/resume/analysis', label: 'Quality Audit', icon: FiBarChart2 },
      { to: '/resume/skill-profile', label: 'Competency Profile', icon: FiTrendingUp },
      { to: '/resume/history', label: 'Audit Log Ledger', icon: FiClock },
    ],
  },
];

function isItemActive(pathname, item) {
  if (item.activePaths) {
    return item.activePaths.some(
      (path) => pathname === path || (path.endsWith('/') && pathname.startsWith(path))
    );
  }
  return item.exact
    ? pathname === item.to
    : pathname === item.to ||
        (item.to !== '/student/dashboard' &&
          item.to !== '/profile' &&
          pathname.startsWith(`${item.to}/`));
}

function NavItem({ item, onClose }) {
  const location = useLocation();
  const active = isItemActive(location.pathname, item);
  const Icon = item.icon;

  return (
    <Link
      to={item.to}
      onClick={onClose}
      aria-current={active ? 'page' : undefined}
      className="relative block"
    >
      <motion.div
        whileHover={{ x: active ? 0 : 3 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        className={`group relative z-10 flex items-center justify-between px-3 py-2 rounded-lg text-xs font-mono transition-colors duration-150 ${
          active
            ? 'text-[#0038FF] font-bold'
            : 'text-neutral-600 hover:text-neutral-950'
        }`}
      >
        {/* Animated Background Indicator Pill */}
        {active && (
          <motion.div
            layoutId="activeNavBackground"
            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
            className="absolute inset-0 rounded-lg bg-blue-50/80 border border-blue-100 shadow-2xs -z-10"
          />
        )}

        <div className="flex items-center gap-2.5 min-w-0">
          <motion.div
            animate={{ scale: active ? 1.05 : 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <Icon
              size={14}
              className={`shrink-0 transition-colors ${
                active ? 'text-[#0038FF]' : 'text-neutral-400 group-hover:text-[#0038FF]'
              }`}
            />
          </motion.div>
          <span className="truncate tracking-tight font-sans text-xs font-semibold">
            {item.label}
          </span>
        </div>

        {active && (
          <motion.span
            layoutId="activeNavDot"
            className="h-1.5 w-1.5 rounded-full bg-[#0038FF] shadow-xs shadow-blue-500/50 shrink-0"
          />
        )}
      </motion.div>
    </Link>
  );
}

export default function Sidebar({ open, onClose }) {
  const { user } = useAuth();
  const initials = user
    ? `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase()
    : 'CA';

  return (
    <>
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-neutral-900/30 backdrop-blur-xs lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar Frame */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-shrink-0 flex-col border-r border-neutral-200/90 bg-white transition-transform duration-250 ease-in-out antialiased
          lg:sticky lg:top-0 lg:h-screen lg:translate-x-0
          ${open ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Brand Header — Matching Footer Exactly */}
        <div className="flex h-16 items-center justify-between px-5 border-b border-neutral-100 shrink-0">
          <Link
            to="/student/dashboard"
            className="flex items-center gap-2.5 group"
            onClick={onClose}
          >
            <motion.div
              whileHover={{ rotate: 15, scale: 1.08 }}
              transition={{ type: 'spring', stiffness: 300, damping: 15 }}
              className="flex items-center justify-center shrink-0"
            >
              <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
                <polygon points="16,2 28,9 16,16 4,9" fill="#0038FF" />
                <polygon points="4,9 16,16 16,30 4,23" fill="#0026B3" />
                <polygon points="28,9 16,16 16,30 28,23" fill="#3B82F6" />
                <polygon points="16,2 16,16 4,9" fill="#FFFFFF" fillOpacity="0.3" />
              </svg>
            </motion.div>
            <span className="text-sm font-black tracking-tight text-neutral-950 font-sans">
              CAREER<span className="text-[#0038FF]">AI</span>
            </span>
          </Link>

          <button
            onClick={onClose}
            className="lg:hidden rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition-colors"
            aria-label="Close sidebar"
          >
            <FiX size={16} />
          </button>
        </div>

        {/* Top Telemetry Strip */}
        <div className="px-4 py-2 bg-[#F8FAFC] border-b border-neutral-100 flex items-center justify-between shrink-0 font-mono text-[10px] text-neutral-400">
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold text-neutral-600 uppercase tracking-wider text-[9px]">
              Pipeline Ready
            </span>
          </div>
          <span className="text-neutral-400">120ms</span>
        </div>

        {/* Navigation Sections */}
        <nav
          className="flex-1 overflow-y-auto overscroll-contain px-3 py-4 space-y-5 scrollbar-thin scrollbar-thumb-neutral-200"
          aria-label="Main navigation"
        >
          {NAV_SECTIONS.map((section) => (
            <div key={section.label} className="space-y-1">
              <p className="px-3 pb-1 text-[9px] font-bold uppercase tracking-widest text-neutral-400 font-mono">
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

        {/* User Account / Settings Rail */}
        <div className="border-t border-neutral-100 p-3 shrink-0 bg-white">
          <Link
            to="/profile"
            onClick={onClose}
            className="flex items-center gap-3 rounded-xl p-2 hover:bg-[#F8FAFC] border border-transparent hover:border-neutral-200/80 transition-all group"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 border border-blue-100 text-[11px] font-bold font-mono text-[#0038FF] tracking-wider shadow-2xs"
            >
              {initials}
            </motion.div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-neutral-900 font-sans">
                {user?.firstName ? `${user.firstName} ${user.lastName || ''}` : 'Candidate'}
              </p>
              <p className="truncate text-[10px] text-neutral-400 font-mono">
                {user?.email || 'candidate@academic.edu'}
              </p>
            </div>
            <motion.div
              whileHover={{ rotate: 45 }}
              transition={{ type: 'spring', stiffness: 300, damping: 15 }}
              className="p-1 rounded-md text-neutral-400 group-hover:text-[#0038FF] group-hover:bg-blue-50 transition-colors"
            >
              <FiSettings size={13} />
            </motion.div>
          </Link>
        </div>
      </aside>
    </>
  );
}
import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiBell, FiLogOut, FiMenu, FiSearch, 
  FiSettings, FiUser, FiX, FiChevronDown, FiShield,
  FiZap, FiActivity
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

// Notifications remain empty until a live event API is connected.
const NOTIFICATIONS = [];

function NotificationPanel({ onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 6, scale: 0.98 }}
      transition={{ duration: 0.15 }}
      className="absolute right-0 top-full mt-2 w-80 rounded-2xl border border-neutral-200/90 bg-white shadow-xl shadow-neutral-950/5 z-50 overflow-hidden font-mono"
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-100 bg-[#F8FAFC]">
        <div className="flex items-center gap-2">
          <FiBell size={13} className="text-[#0038FF]" />
          <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-900">
            System Alerts
          </span>
          {NOTIFICATIONS.some((n) => n.unread) && (
            <span className="flex h-4 w-4 items-center justify-center rounded bg-[#0038FF] text-[10px] font-bold text-white">
              {NOTIFICATIONS.filter((n) => n.unread).length}
            </span>
          )}
        </div>
        <button 
          onClick={onClose} 
          className="text-neutral-400 hover:text-neutral-700 transition-colors p-1"
          aria-label="Close notifications"
        >
          <FiX size={14} />
        </button>
      </div>

      <div className="divide-y divide-neutral-100 max-h-72 overflow-y-auto overscroll-contain">
        {NOTIFICATIONS.map((n) => (
          <div 
            key={n.id} 
            className={`flex items-start gap-3 px-4 py-3 hover:bg-neutral-50 transition-colors cursor-pointer ${
              n.unread ? 'bg-blue-50/40' : ''
            }`}
          >
            <div className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${n.dot || 'bg-[#0038FF]'}`} />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-neutral-900 font-sans">{n.title}</p>
              <p className="text-[11px] text-neutral-500 mt-0.5 leading-relaxed font-sans">{n.desc}</p>
              <p className="text-[10px] text-neutral-400 font-mono mt-1">{n.time}</p>
            </div>
          </div>
        ))}
        {NOTIFICATIONS.length === 0 && (
          <div className="px-4 py-8 text-center">
            <p className="text-xs text-neutral-400 font-mono">No pending telemetry alerts</p>
          </div>
        )}
      </div>

      {NOTIFICATIONS.length > 0 && (
        <div className="px-4 py-2 border-t border-neutral-100 bg-[#F8FAFC]">
          <span className="text-[10px] font-mono text-neutral-400">All alerts verified</span>
        </div>
      )}
    </motion.div>
  );
}

function UserMenu({ user, onLogout, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 6, scale: 0.98 }}
      transition={{ duration: 0.15 }}
      className="absolute right-0 top-full mt-2 w-64 rounded-2xl border border-neutral-200/90 bg-white shadow-xl shadow-neutral-950/5 z-50 overflow-hidden font-mono"
    >
      <div className="px-4 py-3 border-b border-neutral-100 bg-[#F8FAFC]">
        <p className="text-xs font-bold text-neutral-950 truncate font-sans">
          {user?.firstName ? `${user.firstName} ${user.lastName || ''}` : 'Candidate Profile'}
        </p>
        <p className="text-[10px] text-neutral-400 font-mono truncate mt-0.5">
          {user?.email || 'student@academic.edu'}
        </p>
      </div>

      <div className="p-1.5 space-y-0.5 font-sans">
        <Link 
          to="/profile" 
          onClick={onClose} 
          className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-neutral-700 hover:text-neutral-950 hover:bg-neutral-50 rounded-lg transition-colors"
        >
          <FiUser size={13} className="text-[#0038FF]" /> 
          <span>Academic Profile</span>
        </Link>
        <Link 
          to="/profile" 
          onClick={onClose} 
          className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-neutral-700 hover:text-neutral-950 hover:bg-neutral-50 rounded-lg transition-colors"
        >
          <FiSettings size={13} className="text-neutral-400" /> 
          <span>Account Settings</span>
        </Link>
      </div>

      <div className="border-t border-neutral-100 p-1.5 font-sans">
        <button
          onClick={onLogout}
          className="flex w-full items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
        >
          <FiLogOut size={13} /> 
          <span>Sign Out</span>
        </button>
      </div>
    </motion.div>
  );
}

export default function DashboardNavbar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [showNotif, setShowNotif] = useState(false);
  const [showUser, setShowUser] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const notifRef = useRef(null);
  const userRef = useRef(null);

  const initials = user
    ? `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase()
    : 'KS';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotif(false);
      if (userRef.current && !userRef.current.contains(e.target)) setShowUser(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <header className="sticky top-0 z-30 w-full border-b border-neutral-200/80 bg-white/95 backdrop-blur-md antialiased">
      <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 w-full">

        {/* ── Left: Mobile Sidebar Trigger & Global Search ── */}
        <div className="flex items-center gap-3 flex-1 max-w-xl">
          <button
            onClick={onMenuClick}
            className="rounded-lg p-2 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800 focus:outline-none focus:ring-2 focus:ring-[#0038FF] lg:hidden transition-colors border border-neutral-200"
            aria-label="Open sidebar navigation"
          >
            <FiMenu size={18} />
          </button>

          {/* Quick Search */}
          <div 
            className={`hidden sm:flex flex-1 items-center gap-2.5 rounded-lg border px-3.5 py-2 transition-all text-xs font-mono
              ${searchFocused 
                ? 'border-[#0038FF] bg-white ring-2 ring-[#0038FF]/10' 
                : 'border-neutral-200 bg-[#F8FAFC]'}`}
          >
            <FiSearch size={14} className={`shrink-0 ${searchFocused ? 'text-[#0038FF]' : 'text-neutral-400'}`} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              placeholder="Search pathways, competencies, benchmarks…"
              className="w-full bg-transparent text-xs text-neutral-900 outline-none placeholder:text-neutral-400 font-sans"
              aria-label="Search"
            />
            {query ? (
              <button 
                onClick={() => setQuery('')} 
                className="text-neutral-400 hover:text-neutral-600 transition-colors"
              >
                <FiX size={12} />
              </button>
            ) : (
              <kbd className="hidden md:inline-flex items-center gap-0.5 rounded border border-neutral-200 bg-white px-1.5 py-0.5 text-[9px] font-mono text-neutral-400 shadow-2xs">
                ⌘K
              </kbd>
            )}
          </div>
        </div>

        {/* ── Right Actions ── */}
        <div className="flex items-center gap-2.5 shrink-0">
          
          {/* Notifications Toggle */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => { setShowNotif(v => !v); setShowUser(false); }}
              className={`relative rounded-lg p-2 text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900 border transition-all ${
                showNotif ? 'border-[#0038FF] bg-blue-50/50 text-[#0038FF]' : 'border-neutral-200/80 bg-white shadow-2xs'
              }`}
              aria-label="Notifications"
            >
              <FiBell size={15} />
              {NOTIFICATIONS.some((n) => n.unread) && (
                <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[#0038FF]" />
              )}
            </button>
            <AnimatePresence>
              {showNotif && <NotificationPanel onClose={() => setShowNotif(false)} />}
            </AnimatePresence>
          </div>

          {/* User Profile Menu */}
          <div className="relative" ref={userRef}>
            <button
              onClick={() => { setShowUser(v => !v); setShowNotif(false); }}
              className={`flex items-center gap-2.5 rounded-lg border bg-white px-2.5 py-1.5 transition-all text-xs shadow-2xs ${
                showUser ? 'border-[#0038FF] ring-2 ring-[#0038FF]/10' : 'border-neutral-200/80 hover:border-neutral-300'
              }`}
              aria-label="User menu"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-50 border border-blue-100 font-mono text-[11px] font-bold text-[#0038FF] tracking-wider">
                {initials}
              </div>
              <span className="hidden sm:block max-w-[120px] truncate font-semibold text-neutral-900 font-sans">
                {user?.firstName || 'Kabilan'}
              </span>
              <FiChevronDown 
                size={13} 
                className={`text-neutral-400 transition-transform duration-150 ${showUser ? 'rotate-180 text-neutral-900' : ''}`} 
              />
            </button>
            <AnimatePresence>
              {showUser && <UserMenu user={user} onLogout={handleLogout} onClose={() => setShowUser(false)} />}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </header>
  );
}
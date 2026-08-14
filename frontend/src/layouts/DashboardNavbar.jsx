import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, LogOut, Menu, Search, Settings, User, X, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// Notifications are intentionally empty until a notification API is available.
// The UI must not present generated samples as user activity.
const NOTIFICATIONS = [];

function NotificationPanel({ onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.96 }}
      transition={{ duration: 0.18 }}
      className="absolute right-0 top-full mt-2 w-80 rounded-2xl border border-slate-100 bg-white shadow-card-lg z-50 overflow-hidden"
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Bell size={15} className="text-slate-600" />
          <p className="text-sm font-bold text-slate-800">Notifications</p>
          {NOTIFICATIONS.some((notification) => notification.unread) && <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">{NOTIFICATIONS.filter((notification) => notification.unread).length}</span>}
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
          <X size={14} />
        </button>
      </div>
      <div className="divide-y divide-slate-50">
        {NOTIFICATIONS.map((n) => (
          <div key={n.id} className={`flex items-start gap-3 px-4 py-3 hover:bg-slate-50 transition-colors cursor-pointer ${n.unread ? 'bg-blue-50/30' : ''}`}>
            <div className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${n.dot}`} />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-slate-800">{n.title}</p>
              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{n.desc}</p>
              <p className="text-[10px] text-slate-400 mt-1">{n.time}</p>
            </div>
          </div>
        ))}
        {NOTIFICATIONS.length === 0 && <p className="px-4 py-8 text-center text-sm text-slate-500">No notifications yet.</p>}
      </div>
      {NOTIFICATIONS.length > 0 && <div className="px-4 py-2.5 border-t border-slate-100"><button type="button" className="text-xs font-semibold text-slate-400" disabled>Notification management is not configured.</button></div>}
    </motion.div>
  );
}

function UserMenu({ user, onLogout, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.96 }}
      transition={{ duration: 0.18 }}
      className="absolute right-0 top-full mt-2 w-56 rounded-2xl border border-slate-100 bg-white shadow-card-lg z-50 overflow-hidden"
    >
      <div className="px-4 py-3 border-b border-slate-100">
        <p className="text-sm font-bold text-slate-800">{user?.firstName} {user?.lastName}</p>
        <p className="text-xs text-slate-400 truncate">{user?.email}</p>
      </div>
      <div className="py-1.5">
        <Link to="/profile" onClick={onClose} className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
          <User size={15} /> My Profile
        </Link>
        <Link to="/profile" onClick={onClose} className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
          <Settings size={15} /> Settings
        </Link>
      </div>
      <div className="border-t border-slate-100 py-1.5">
        <button
          onClick={onLogout}
          className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut size={15} /> Sign out
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
    : 'U';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotif(false);
      if (userRef.current && !userRef.current.contains(e.target)) setShowUser(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <header className="sticky top-0 z-30 border-b border-slate-100 bg-white/90 backdrop-blur-xl">
      <div className="flex h-16 items-center gap-3 px-4 sm:px-6">

        {/* Mobile menu button */}
        <button
          onClick={onMenuClick}
          className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 lg:hidden transition-colors"
          aria-label="Open sidebar"
        >
          <Menu size={20} />
        </button>

        {/* Search */}
        <div className={`hidden md:flex flex-1 max-w-md items-center gap-2.5 rounded-xl border px-3.5 py-2.5 transition-all duration-200
          ${searchFocused ? 'border-blue-300 bg-white shadow-glow-sm ring-2 ring-blue-100' : 'border-slate-200 bg-slate-50'}`}
        >
          <Search size={15} className={`shrink-0 transition-colors ${searchFocused ? 'text-blue-500' : 'text-slate-400'}`} aria-hidden="true" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            placeholder="Search careers, skills, courses…"
            className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
            aria-label="Search"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-slate-400 hover:text-slate-600 transition-colors">
              <X size={13} />
            </button>
          )}
        </div>

        {/* Right actions */}
        <div className="ml-auto flex items-center gap-1.5">

          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => { setShowNotif(v => !v); setShowUser(false); }}
              className="relative rounded-xl p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              aria-label="Notifications"
            >
              <Bell size={18} />
              {NOTIFICATIONS.some((notification) => notification.unread) && <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-blue-600 ring-2 ring-white" />}
            </button>
            <AnimatePresence>
              {showNotif && <NotificationPanel onClose={() => setShowNotif(false)} />}
            </AnimatePresence>
          </div>

          {/* User menu */}
          <div className="relative" ref={userRef}>
            <button
              onClick={() => { setShowUser(v => !v); setShowNotif(false); }}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-2 py-1.5 hover:border-slate-300 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              aria-label="User menu"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 text-[11px] font-black text-white">
                {initials}
              </div>
              <span className="hidden sm:block max-w-[100px] truncate text-sm font-semibold text-slate-700">
                {user?.firstName}
              </span>
              <ChevronDown size={13} className={`hidden sm:block text-slate-400 transition-transform duration-200 ${showUser ? 'rotate-180' : ''}`} />
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

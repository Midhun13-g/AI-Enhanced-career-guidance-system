import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, LogOut, Menu, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function DashboardNavbar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const initials = user ? `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase() : 'U';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur-xl">
      <div className="flex h-16 items-center gap-3 px-4 sm:px-6 lg:px-8">
        <button onClick={onMenuClick} className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 lg:hidden" aria-label="Open sidebar">
          <Menu size={22} />
        </button>

        <div className="hidden min-w-0 flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 md:flex">
          <Search size={17} className="text-slate-400" aria-hidden="true" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search careers, skills, courses"
            className="w-full bg-transparent text-sm font-medium text-slate-700 outline-none placeholder:text-slate-400"
            aria-label="Search"
          />
        </div>

        <div className="ml-auto flex items-center gap-2">
          <button className="relative rounded-xl p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500" aria-label="Notifications">
            <Bell size={19} />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-white" />
          </button>
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-2 py-1.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 text-xs font-black text-white">{initials}</div>
            <div className="hidden sm:block">
              <p className="max-w-[140px] truncate text-sm font-bold text-slate-800">{user?.firstName || 'Student'}</p>
              <p className="text-xs text-slate-400">Learner</p>
            </div>
          </div>
          <button onClick={handleLogout} className="rounded-xl p-2 text-slate-500 hover:bg-red-50 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-blue-500" aria-label="Sign out">
            <LogOut size={19} />
          </button>
        </div>
      </div>
    </header>
  );
}

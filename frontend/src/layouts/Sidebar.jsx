import { Link, useLocation } from 'react-router-dom';
import { BarChart3, ClipboardCheck, Home, UserRound } from 'lucide-react';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: Home },
  { to: '/assessment', label: 'Assessment', icon: ClipboardCheck },
  { to: '/profile', label: 'Profile', icon: UserRound },
  { to: '/assessment/result', label: 'Results', icon: BarChart3 },
];

export default function Sidebar({ open, onClose }) {
  const location = useLocation();
  return (
    <>
      <div className={`fixed inset-0 z-40 bg-slate-950/40 transition-opacity lg:hidden ${open ? 'opacity-100' : 'pointer-events-none opacity-0'}`} onClick={onClose} />
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 border-r border-slate-200 bg-white px-4 py-5 shadow-xl transition-transform lg:sticky lg:top-0 lg:z-20 lg:h-screen lg:translate-x-0 lg:shadow-none ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <Link to="/dashboard" className="flex items-center gap-3 px-2" onClick={onClose}>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
            <ClipboardCheck size={21} aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-black text-slate-950">CareerAI</p>
            <p className="text-xs font-medium text-slate-500">Guidance System</p>
          </div>
        </Link>

        <nav className="mt-8 space-y-1" aria-label="Dashboard navigation">
          {navItems.map(({ to, label, icon: Icon }) => {
            const active = location.pathname === to || (to !== '/dashboard' && location.pathname.startsWith(to));
            return (
              <Link
                key={to}
                to={to}
                onClick={onClose}
                className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold transition focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  active ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-950'
                }`}
                aria-current={active ? 'page' : undefined}
              >
                <Icon size={18} aria-hidden="true" />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-5 left-4 right-4 rounded-xl bg-slate-50 p-4">
          <p className="text-xs font-bold uppercase tracking-wide text-blue-600">Module 3</p>
          <p className="mt-1 text-sm font-bold text-slate-900">Skills & Interest Assessment</p>
          <p className="mt-2 text-xs leading-5 text-slate-500">Evaluate aptitude, personality, interests, and technical readiness.</p>
        </div>
      </aside>
    </>
  );
}

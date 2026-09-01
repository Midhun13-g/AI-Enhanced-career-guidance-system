import { useState } from 'react';
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import { 
  FiGrid, FiUsers, FiBookOpen, FiFileText, 
  FiCheckSquare, FiMessageSquare, FiUser, FiLogOut, 
  FiMenu, FiX, FiShield 
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const NAV_ITEMS = [
  { label: 'Dashboard', to: '/mentor', icon: FiGrid },
  { label: 'Assigned Students', to: '/mentor/students', icon: FiUsers },
  { label: 'Assessments', to: '/mentor/assessments', icon: FiBookOpen },
  { label: 'Resume Reviews', to: '/mentor/resumes', icon: FiFileText },
  { label: 'Feedback Hub', to: '/mentor/feedback', icon: FiCheckSquare },
  { label: 'Messages', to: '/mentor/messages', icon: FiMessageSquare },
  { label: 'Advisor Profile', to: '/mentor/profile', icon: FiUser },
];

export default function MentorLayout() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const initials = user
    ? `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase()
    : 'M';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-neutral-900 antialiased selection:bg-[#0038FF] selection:text-white">
      
      {/* ── Mobile Backdrop ── */}
      {open && (
        <button
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-30 bg-neutral-950/40 backdrop-blur-xs lg:hidden cursor-default"
          aria-label="Close menu"
        />
      )}

      {/* ── Sidebar Rail ── */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col justify-between border-r border-neutral-200/80 bg-white transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          open ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* Top: Unboxed Prism Logo & Portal Badge */}
        <div>
          <div className="flex h-16 items-center justify-between px-5 border-b border-neutral-100">
            <Link to="/mentor" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
              <div className="h-7 w-7 flex items-center justify-center shrink-0">
                <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
                  <polygon points="16,2 28,9 16,16 4,9" fill="#0038FF" />
                  <polygon points="4,9 16,16 16,30 4,23" fill="#0026B3" />
                  <polygon points="28,9 16,16 16,30 28,23" fill="#3B82F6" />
                  <polygon points="16,2 16,16 4,9" fill="#FFFFFF" fillOpacity="0.2" />
                </svg>
              </div>
              <span className="text-sm font-extrabold tracking-tight text-neutral-950">
                CAREER<span className="text-[#0038FF]">AI</span>
              </span>
            </Link>

            <button
              onClick={() => setOpen(false)}
              className="lg:hidden rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition-colors"
              aria-label="Close navigation"
            >
              <FiX size={16} />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="p-3 space-y-0.5 overflow-y-auto overscroll-contain" aria-label="Advisor Navigation">
            <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-neutral-400 font-mono">
              Advisor Workspace
            </div>
            {NAV_ITEMS.map(({ label, to, icon: Icon }) => (
              <NavLink
                key={to}
                end={to === '/mentor'}
                to={to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-blue-50/70 text-[#0038FF] font-semibold border-l-2 border-[#0038FF]'
                      : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-50'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      size={14}
                      className={`shrink-0 ${
                        isActive ? 'text-[#0038FF]' : 'text-neutral-400'
                      }`}
                    />
                    <span className="truncate">{label}</span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Bottom Rail: User Info & Sign Out */}
        <div className="p-3 border-t border-neutral-100 bg-[#F8FAFC]/50 space-y-2">
          <div className="flex items-center gap-2.5 px-2 py-1.5">
            <div className="h-7 w-7 rounded bg-neutral-950 text-white flex items-center justify-center text-[10px] font-bold font-mono tracking-wider shrink-0">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-neutral-900 truncate">
                {user?.firstName ? `${user.firstName} ${user.lastName || ''}` : 'Advisor Account'}
              </p>
              <p className="text-[10px] font-mono text-neutral-400 truncate">
                {user?.email || 'mentor@academic.edu'}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-transparent hover:border-rose-100"
          >
            <FiLogOut size={13} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ── Main Content Area ── */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        
        {/* Top Header */}
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-neutral-200/80 bg-white px-4 sm:px-6 lg:px-8">
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setOpen(true)}
              className="rounded-lg border border-neutral-200 p-2 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800 lg:hidden transition-colors"
              aria-label="Open sidebar"
            >
              <FiMenu size={18} />
            </button>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-900 font-mono">
                  Mentor Portal
                </span>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-blue-50 border border-blue-100 text-[#0038FF] text-[9px] font-bold font-mono uppercase">
                  <FiShield size={9} /> Verified Advisor
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 hidden sm:block">
                Evaluate student roadmaps, assessments, and portfolio progress
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-semibold text-neutral-900">
                {user?.firstName} {user?.lastName}
              </p>
              <span className="text-[10px] font-mono text-neutral-400 uppercase">
                {user?.roles?.[0]?.replace('ROLE_', '') || 'MENTOR'}
              </span>
            </div>
            <div className="h-8 w-8 rounded bg-neutral-950 font-mono text-xs font-bold text-white flex items-center justify-center">
              {initials}
            </div>
          </div>
        </header>

        {/* Viewport Outlet Canvas */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1400px] w-full mx-auto">
          <Outlet />
        </main>
      </div>

    </div>
  );
}
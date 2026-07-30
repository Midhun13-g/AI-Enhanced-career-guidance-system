import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { BarChart3, BookOpenCheck, BriefcaseBusiness, FileText, LayoutDashboard, LogOut, Menu, Settings, ShieldCheck, Sparkles, Users, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const links = [
  ['Dashboard', '/admin', LayoutDashboard], ['Users', '/admin/users', Users], ['Student Profiles', '/admin/students', Users],
  ['Assessment Management', '/admin/assessments', BookOpenCheck], ['Resume Management', '/admin/resumes', FileText],
  ['Career Management', '/admin/careers', BriefcaseBusiness], ['Skills Management', '/admin/skills', Sparkles],
  ['Reports', '/admin/reports', BarChart3], ['Settings', '/admin/settings', Settings],
];
export default function AdminLayout() {
  const [open, setOpen] = useState(false); const { user, logout } = useAuth(); const navigate = useNavigate();
  const leave = () => { logout(); navigate('/login'); };
  return <div className="min-h-screen bg-[#f6f8fc] text-slate-800">
    {open && <button aria-label="Close menu" onClick={() => setOpen(false)} className="fixed inset-0 z-30 bg-slate-950/35 lg:hidden" />}
    <aside className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col bg-slate-950 p-5 text-slate-300 transition-transform lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="mb-10 flex items-center gap-3 px-2 text-white"><div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-400"><ShieldCheck size={21}/></div><div><p className="font-bold">CareerAI</p><p className="text-xs text-slate-500">Administration</p></div><button onClick={() => setOpen(false)} className="ml-auto lg:hidden"><X size={20}/></button></div>
      <nav className="space-y-1">{links.map(([label, to, Icon]) => <NavLink end={to === '/admin'} key={to} to={to} onClick={() => setOpen(false)} className={({isActive}) => `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${isActive ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' : 'hover:bg-slate-800 hover:text-white'}`}><Icon size={18}/>{label}</NavLink>)}</nav>
      <button onClick={leave} className="mt-auto flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-400 hover:bg-rose-500/10 hover:text-rose-300"><LogOut size={18}/>Logout</button>
    </aside>
    <main className="min-h-screen lg:pl-72"><header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-slate-200/80 bg-white/85 px-5 backdrop-blur lg:px-9"><button onClick={() => setOpen(true)} className="rounded-lg p-2 hover:bg-slate-100 lg:hidden"><Menu/></button><div className="hidden text-sm text-slate-500 sm:block">Administration <span className="mx-2 text-slate-300">/</span> Career Guidance System</div><div className="ml-auto flex items-center gap-3"><div className="grid h-9 w-9 place-items-center rounded-full bg-indigo-100 font-bold text-indigo-700">{(user?.firstName || 'A')[0]}</div><div className="hidden sm:block"><p className="text-sm font-semibold">{user?.firstName || 'Admin'} {user?.lastName || ''}</p><p className="text-xs text-slate-500">ROLE_ADMIN</p></div></div></header><div className="p-5 lg:p-9"><Outlet/></div></main>
  </div>;
}

import { useAuth } from '../context/AuthContext';

export default function DashboardPage() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-4xl rounded-xl bg-white p-8 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Dashboard</h2>
            <p className="text-slate-500">Welcome back, {user?.firstName || 'Student'}</p>
          </div>
          <button className="rounded bg-slate-800 px-4 py-2 text-white" onClick={logout}>Logout</button>
        </div>
      </div>
    </div>
  );
}

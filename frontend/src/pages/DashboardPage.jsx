import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const [completion, setCompletion] = useState({ profileCompletion: 0, missingFields: [] });

  useEffect(() => {
    const loadCompletion = async () => {
      try {
        const res = await api.get('/api/profile/completion');
        setCompletion(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    loadCompletion();
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <div className="rounded-xl bg-white p-8 shadow-lg">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold">Dashboard</h2>
              <p className="text-slate-500">Welcome back, {user?.firstName || 'Student'}</p>
            </div>
            <div className="flex gap-3">
              <Link to="/profile" className="rounded bg-blue-600 px-4 py-2 text-white">Manage Profile</Link>
              <button className="rounded bg-slate-800 px-4 py-2 text-white" onClick={logout}>Logout</button>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-xl bg-white p-6 shadow-lg">
            <h3 className="text-lg font-semibold">Career Guidance</h3>
            <p className="mt-2 text-slate-600">Complete your profile to unlock personalized career recommendations and skill insights.</p>
          </div>
          <div className="rounded-xl bg-white p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Profile Completion</h3>
              <span className="text-2xl font-semibold text-blue-600">{completion.profileCompletion}%</span>
            </div>
            <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-200">
              <div className="h-full rounded-full bg-blue-600" style={{ width: `${completion.profileCompletion}%` }} />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {completion.missingFields?.map((field) => (
                <span key={field} className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600">{field}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

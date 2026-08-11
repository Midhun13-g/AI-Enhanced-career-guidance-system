import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ClipboardList, Plus, RefreshCw } from 'lucide-react';
import { adminService } from '../../services/adminService';

export default function AssessmentsPage() {
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const load = async () => {
    setLoading(true); setError('');
    try { setAssessments(await adminService.getAssessments()); }
    catch { setError('Unable to load assessments. Please refresh and try again.'); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);
  return <div className="space-y-6">
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div><p className="text-xs font-bold uppercase tracking-widest text-indigo-600">Assessment Management</p><h1 className="mt-1 text-3xl font-extrabold text-slate-900">All Assessments</h1><p className="mt-2 text-sm text-slate-500">Published and draft assessments created for students.</p></div>
      <Link to="/admin/assessments/create" className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white"><Plus size={16} /> Create assessment</Link>
    </div>
    <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="mb-4 flex justify-end"><button onClick={load} className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600"><RefreshCw size={15} /> Refresh</button></div>
      {loading ? <p className="py-10 text-center text-sm text-slate-500">Loading assessments...</p> : error ? <p className="py-10 text-center text-sm text-rose-600">{error}</p> : assessments.length === 0 ? <div className="py-12 text-center"><ClipboardList className="mx-auto text-slate-300" size={34}/><p className="mt-3 font-semibold text-slate-700">No assessments yet</p><p className="mt-1 text-sm text-slate-500">Create one manually, or use AI for a starting point.</p></div> : <div className="space-y-3">{assessments.map((assessment) => <article key={assessment.id} className="flex flex-col gap-3 rounded-xl border border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="font-bold text-slate-900">{assessment.title}</h2><p className="mt-1 text-sm text-slate-500">{assessment.category} · {assessment.difficulty} · {assessment.totalQuestions} questions · {assessment.durationMinutes} min</p></div><span className={`w-fit rounded-full px-3 py-1 text-xs font-bold ${assessment.status === 'PUBLISHED' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>{assessment.status}</span></article>)}</div>}
    </section>
  </div>;
}

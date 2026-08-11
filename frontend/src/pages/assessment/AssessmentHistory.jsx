import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../../components/layout/AppLayout';
import DataTable from '../../components/ui/DataTable';
import Badge from '../../components/ui/Badge';
import api from '../../services/api';

export default function AssessmentHistory() {
  const [attempts, setAttempts] = useState([]); const [error, setError] = useState(''); const navigate = useNavigate();
  useEffect(() => { api.get('/api/assessment/published/history').then((response) => setAttempts(response.data)).catch((requestError) => setError(requestError.response?.data?.message || 'Unable to load assessment history.')); }, []);
  const rows = useMemo(() => attempts.map((item) => ({ ...item, name: item.assessmentTitle, score: Math.round(item.percentage), date: item.submittedAt, status: item.passed ? 'Passed' : 'Failed', duration: '—' })), [attempts]);
  const average = rows.length ? Math.round(rows.reduce((sum, row) => sum + row.score, 0) / rows.length) : 0;
  const columns = [{ key: 'name', label: 'Assessment', render: (value) => <b>{value}</b> }, { key: 'score', label: 'Score', render: (value) => <span className="font-bold text-blue-700">{value}%</span> }, { key: 'date', label: 'Completed', render: (value) => value ? new Date(value).toLocaleDateString('en-IN') : '—' }, { key: 'status', label: 'Status', render: (value) => <Badge label={value} dot /> }, { key: 'attemptId', label: 'Action', sortable: false, render: (_, row) => <button onClick={() => navigate(`/assessments/quiz/${row.assessmentId}/result/${row.attemptId}`)} className="rounded-lg border px-3 py-1 text-xs font-bold">View result</button> }];
  return <AppLayout><div className="space-y-7"><motion.header initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}><p className="text-xs font-bold uppercase tracking-widest text-blue-600">Assessment Records</p><h1 className="mt-1 text-3xl font-extrabold">Assessment History</h1><p className="mt-2 text-sm text-slate-500">Your real submitted assessment attempts.</p></motion.header>{error && <p className="rounded-xl bg-red-50 p-4 text-red-700">{error}</p>}<div className="grid gap-4 sm:grid-cols-3">{[['Submitted', rows.length], ['Passed', rows.filter((row) => row.passed).length], ['Average score', `${average}%`]].map(([label, value]) => <div key={label} className="rounded-2xl bg-white p-5 text-center shadow-card"><p className="text-3xl font-black text-blue-700">{value}</p><p className="text-sm text-slate-500">{label}</p></div>)}</div><DataTable columns={columns} data={rows} pageSize={8} searchPlaceholder="Search submitted assessments..." /></div></AppLayout>;
}

import { motion } from 'framer-motion';
import { Download, Filter } from 'lucide-react';
import AppLayout from '../../components/layout/AppLayout';
import DataTable from '../../components/ui/DataTable';
import Badge from '../../components/ui/Badge';

const historyData = [
  { name: 'Java Programming', category: 'Technical', score: 82, date: '2025-07-20', duration: '28 min', status: 'Passed' },
  { name: 'Logical Reasoning', category: 'Aptitude', score: 74, date: '2025-07-18', duration: '35 min', status: 'Passed' },
  { name: 'Communication Skills', category: 'Soft Skills', score: 91, date: '2025-07-15', duration: '22 min', status: 'Passed' },
  { name: 'Data Structures', category: 'Technical', score: 58, date: '2025-07-10', duration: '42 min', status: 'Failed' },
  { name: 'SQL & Database', category: 'Technical', score: 78, date: '2025-07-05', duration: '30 min', status: 'Passed' },
  { name: 'Quantitative Aptitude', category: 'Aptitude', score: 65, date: '2025-06-28', duration: '45 min', status: 'Passed' },
  { name: 'Leadership Assessment', category: 'Soft Skills', score: 88, date: '2025-06-22', duration: '20 min', status: 'Passed' },
  { name: 'Python Programming', category: 'Technical', score: 72, date: '2025-06-15', duration: '35 min', status: 'Passed' },
  { name: 'Behaviour Analysis', category: 'Personality', score: 80, date: '2025-06-10', duration: '18 min', status: 'Passed' },
  { name: 'Web Development', category: 'Technical', score: 55, date: '2025-06-05', duration: '40 min', status: 'Failed' },
  { name: 'Data Interpretation', category: 'Aptitude', score: 70, date: '2025-05-28', duration: '38 min', status: 'Passed' },
  { name: 'Career Interest Survey', category: 'Personality', score: 95, date: '2025-05-20', duration: '15 min', status: 'Passed' },
];

const columns = [
  {
    key: 'name', label: 'Assessment Name',
    render: (v) => <span className="font-semibold text-slate-800">{v}</span>,
  },
  {
    key: 'category', label: 'Category',
    render: (v) => <Badge label={v} variant={{ Technical: 'blue', Aptitude: 'indigo', 'Soft Skills': 'teal', Personality: 'purple' }[v] || 'slate'} />,
  },
  {
    key: 'score', label: 'Score',
    render: (v) => (
      <div className="flex items-center gap-2">
        <span className={`font-extrabold ${v >= 75 ? 'text-green-600' : v >= 60 ? 'text-amber-600' : 'text-red-500'}`}>{v}%</span>
        <div className="w-16 h-1.5 rounded-full bg-slate-100">
          <div className={`h-1.5 rounded-full ${v >= 75 ? 'bg-green-500' : v >= 60 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${v}%` }} />
        </div>
      </div>
    ),
  },
  {
    key: 'date', label: 'Date',
    render: (v) => <span className="text-slate-500">{new Date(v).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>,
  },
  {
    key: 'duration', label: 'Duration',
    render: (v) => <span className="text-slate-500">{v}</span>,
  },
  {
    key: 'status', label: 'Status',
    render: (v) => <Badge label={v} dot />,
  },
  {
    key: 'name', label: 'Action', sortable: false,
    render: (_, row) => (
      <button className="flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
        <Download size={11} /> Report
      </button>
    ),
  },
];

export default function AssessmentHistory() {
  const passed = historyData.filter((r) => r.status === 'Passed').length;
  const avgScore = Math.round(historyData.reduce((s, r) => s + r.score, 0) / historyData.length);

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-blue-600">Assessment Records</p>
            <h1 className="mt-1 text-2xl font-extrabold text-slate-900 sm:text-3xl">Assessment History</h1>
            <p className="mt-1 text-sm text-slate-500">Complete record of all your assessments and performance.</p>
          </div>
          <button className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors shadow-card">
            <Download size={15} /> Export All
          </button>
        </motion.div>

        {/* Summary */}
        <div className="grid gap-4 sm:grid-cols-4">
          {[
            { label: 'Total Attempts', value: historyData.length, color: 'text-slate-900' },
            { label: 'Passed', value: passed, color: 'text-green-600' },
            { label: 'Failed', value: historyData.length - passed, color: 'text-red-500' },
            { label: 'Average Score', value: `${avgScore}%`, color: 'text-blue-600' },
          ].map((item, i) => (
            <motion.div key={item.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }}
              className="rounded-2xl border border-slate-100 bg-white p-5 shadow-card text-center">
              <p className={`text-3xl font-black ${item.color}`}>{item.value}</p>
              <p className="mt-1 text-sm font-medium text-slate-500">{item.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Table */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <DataTable
            columns={columns}
            data={historyData}
            pageSize={8}
            searchPlaceholder="Search assessments..."
          />
        </motion.div>
      </div>
    </AppLayout>
  );
}

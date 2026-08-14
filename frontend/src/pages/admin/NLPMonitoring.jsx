import { motion } from 'framer-motion';
import { Activity, AlertCircle, CheckCircle2, Clock, Loader2, RefreshCw } from 'lucide-react';
import { nlpMonitoring } from '../resume/resumeData';

const STATUS_STYLE = {
  Success: { bg: 'bg-emerald-50 text-emerald-700', icon: CheckCircle2, iconColor: 'text-emerald-500' },
  Failed: { bg: 'bg-red-50 text-red-700', icon: AlertCircle, iconColor: 'text-red-500' },
  Pending: { bg: 'bg-amber-50 text-amber-700', icon: Loader2, iconColor: 'text-amber-500' },
};

const MODEL_METRICS = [
  { label: 'Entity Recognition Accuracy', value: 94.2, color: 'bg-blue-500' },
  { label: 'Skill Extraction Precision', value: 91.8, color: 'bg-indigo-500' },
  { label: 'Education Parsing Accuracy', value: 96.5, color: 'bg-teal-500' },
  { label: 'Project Detection Rate', value: 88.3, color: 'bg-purple-500' },
  { label: 'Certification Extraction', value: 93.1, color: 'bg-emerald-500' },
];

export default function NLPMonitoring() {
  const successCount = nlpMonitoring.filter((j) => j.status === 'Success').length;
  const failedCount = nlpMonitoring.filter((j) => j.status === 'Failed').length;
  const pendingCount = nlpMonitoring.filter((j) => j.status === 'Pending').length;
  const avgAccuracy = Math.round(nlpMonitoring.filter((j) => j.accuracy > 0).reduce((a, j) => a + j.accuracy, 0) / successCount);

  return (
    <>
      <header className="mb-7">
        <p className="text-sm font-semibold text-indigo-600">NLP MONITORING</p>
        <h1 className="mt-1 text-3xl font-bold text-slate-900">NLP Extraction Monitoring</h1>
        <p className="mt-2 text-slate-500">Real-time view of resume parsing jobs, accuracy, and AI model performance.</p>
      </header>

      {/* Summary cards */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Successful', value: successCount, color: 'text-emerald-600', bg: 'bg-emerald-50', icon: CheckCircle2 },
          { label: 'Failed', value: failedCount, color: 'text-red-600', bg: 'bg-red-50', icon: AlertCircle },
          { label: 'Pending', value: pendingCount, color: 'text-amber-600', bg: 'bg-amber-50', icon: Clock },
          { label: 'Avg Accuracy', value: `${avgAccuracy}%`, color: 'text-blue-600', bg: 'bg-blue-50', icon: Activity },
        ].map(({ label, value, color, bg, icon: Icon }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">{label}</p>
                <p className={`mt-2 text-3xl font-black ${color}`}>{value}</p>
              </div>
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${bg}`}>
                <Icon size={18} className={color} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* AI Model Performance */}
      <div className="mb-6 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-black text-slate-900">AI Model Performance</h2>
          <button className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-50">
            <RefreshCw size={13} /> Refresh
          </button>
        </div>
        <div className="space-y-4">
          {MODEL_METRICS.map((m, i) => (
            <div key={m.label}>
              <div className="mb-1.5 flex justify-between text-sm">
                <span className="font-semibold text-slate-700">{m.label}</span>
                <span className="font-black text-slate-900">{m.value}%</span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                <motion.div
                  className={`h-full rounded-full ${m.color}`}
                  initial={{ width: 0 }} animate={{ width: `${m.value}%` }}
                  transition={{ delay: i * 0.1, duration: 0.7 }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Processing jobs */}
      <div className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h2 className="font-black text-slate-900">Recent Processing Jobs</h2>
          <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> Live
          </span>
        </div>
        <div className="hidden grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-4 border-b border-slate-100 bg-slate-50 px-6 py-3 text-xs font-black uppercase tracking-widest text-slate-400 sm:grid">
          <span>File</span><span>Status</span><span>Accuracy</span><span>Duration</span><span>Time</span>
        </div>
        <div className="divide-y divide-slate-50">
          {nlpMonitoring.map((job, i) => {
            const style = STATUS_STYLE[job.status];
            const StatusIcon = style.icon;
            return (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                className="flex flex-wrap items-center gap-4 px-6 py-4"
              >
                <p className="flex-1 min-w-[140px] text-sm font-bold text-slate-800">{job.file}</p>
                <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${style.bg}`}>
                  <StatusIcon size={12} className={style.iconColor} />
                  {job.status}
                </span>
                <span className="w-16 text-sm font-bold text-slate-700">{job.accuracy > 0 ? `${job.accuracy}%` : '—'}</span>
                <span className="w-16 text-sm text-slate-500">{job.duration}</span>
                <span className="text-xs text-slate-400">{job.time}</span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </>
  );
}

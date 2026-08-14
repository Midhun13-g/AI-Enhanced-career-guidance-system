import { motion } from 'framer-motion';

export default function AssessmentProgress({ current, total, section, completion }) {
  return (
    <div className="sticky top-16 z-30 border-b border-slate-200 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">{section?.title || 'Assessment'}</p>
            <p className="text-sm font-medium text-slate-600">Question {current} of {total}</p>
          </div>
          <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-bold text-blue-700">{completion}% complete</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-blue-600 via-sky-500 to-emerald-500"
            initial={{ width: 0 }}
            animate={{ width: `${completion}%` }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
          />
        </div>
      </div>
    </div>
  );
}

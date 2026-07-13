import { motion } from 'framer-motion';
import { FiAlertCircle } from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi2';
import { Badge } from '../ui/index';

export default function ProgressCard({ completion }) {
  const pct = completion?.profileCompletion ?? 0;
  const color = pct >= 80 ? 'from-emerald-500 to-teal-500' : pct >= 50 ? 'from-blue-500 to-indigo-500' : 'from-amber-500 to-orange-500';
  const label = pct >= 80 ? 'Excellent' : pct >= 50 ? 'Good progress' : 'Getting started';

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center">
            <HiSparkles className="text-blue-600" size={16} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Profile Completion</h3>
            <p className="text-xs text-slate-500">Complete your profile to unlock AI features</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-3xl font-extrabold text-slate-900">{pct}%</span>
          <p className="text-xs text-slate-500 mt-0.5">{label}</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-3 bg-slate-100 rounded-full overflow-hidden mb-4">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1.3, ease: 'easeOut' }}
          className={`h-full rounded-full bg-gradient-to-r ${color}`}
        />
      </div>

      {/* Missing fields */}
      {completion?.missingFields?.length > 0 && (
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <FiAlertCircle className="text-amber-500" size={13} />
            <p className="text-xs font-semibold text-slate-600">Missing fields</p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {completion.missingFields.map(f => (
              <Badge key={f} variant="warning">{f}</Badge>
            ))}
          </div>
        </div>
      )}

      {pct === 100 && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 border border-emerald-100">
          <span className="text-emerald-600 text-sm">🎉</span>
          <p className="text-xs font-semibold text-emerald-700">Profile complete! AI recommendations are fully personalised.</p>
        </div>
      )}
    </div>
  );
}

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const toneMap = {
  blue:    { bg: 'bg-blue-50',    icon: 'bg-blue-600',    text: 'text-blue-700',    border: 'border-blue-100' },
  indigo:  { bg: 'bg-indigo-50',  icon: 'bg-indigo-600',  text: 'text-indigo-700',  border: 'border-indigo-100' },
  teal:    { bg: 'bg-teal-50',    icon: 'bg-teal-600',    text: 'text-teal-700',    border: 'border-teal-100' },
  green:   { bg: 'bg-green-50',   icon: 'bg-green-600',   text: 'text-green-700',   border: 'border-green-100' },
  amber:   { bg: 'bg-amber-50',   icon: 'bg-amber-500',   text: 'text-amber-700',   border: 'border-amber-100' },
  rose:    { bg: 'bg-rose-50',    icon: 'bg-rose-600',    text: 'text-rose-700',    border: 'border-rose-100' },
  purple:  { bg: 'bg-purple-50',  icon: 'bg-purple-600',  text: 'text-purple-700',  border: 'border-purple-100' },
};

export default function StatCard({ icon: Icon, label, value, trend, trendLabel, tone = 'blue', delay = 0 }) {
  const t = toneMap[tone] || toneMap.blue;
  const TrendIcon = trend > 0 ? TrendingUp : trend < 0 ? TrendingDown : Minus;
  const trendColor = trend > 0 ? 'text-green-600' : trend < 0 ? 'text-red-500' : 'text-slate-400';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      className={`rounded-2xl border ${t.border} bg-white p-5 shadow-card hover:shadow-card-md transition-shadow`}
    >
      <div className="flex items-start justify-between">
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${t.icon} text-white shadow-sm`}>
          <Icon size={20} aria-hidden="true" />
        </div>
        {trend !== undefined && (
          <div className={`flex items-center gap-1 text-xs font-semibold ${trendColor}`}>
            <TrendIcon size={13} />
            {trendLabel || `${Math.abs(trend)}%`}
          </div>
        )}
      </div>
      <p className="mt-4 text-2xl font-black text-slate-900">{value}</p>
      <p className={`mt-1 text-sm font-medium ${t.text}`}>{label}</p>
    </motion.div>
  );
}

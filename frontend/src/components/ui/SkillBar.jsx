import { motion } from 'framer-motion';

const colorMap = {
  blue:   { bar: 'bg-blue-600',   bg: 'bg-blue-50',   text: 'text-blue-700' },
  teal:   { bar: 'bg-teal-500',   bg: 'bg-teal-50',   text: 'text-teal-700' },
  green:  { bar: 'bg-green-500',  bg: 'bg-green-50',  text: 'text-green-700' },
  amber:  { bar: 'bg-amber-500',  bg: 'bg-amber-50',  text: 'text-amber-700' },
  purple: { bar: 'bg-purple-600', bg: 'bg-purple-50', text: 'text-purple-700' },
  rose:   { bar: 'bg-rose-500',   bg: 'bg-rose-50',   text: 'text-rose-700' },
  indigo: { bar: 'bg-indigo-600', bg: 'bg-indigo-50', text: 'text-indigo-700' },
};

export default function SkillBar({ label, value, maxValue = 100, color = 'blue', showValue = true, delay = 0, sublabel }) {
  const pct = Math.round((value / maxValue) * 100);
  const c = colorMap[color] || colorMap.blue;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-sm font-semibold text-slate-700">{label}</span>
          {sublabel && <span className="ml-2 text-xs text-slate-400">{sublabel}</span>}
        </div>
        {showValue && <span className={`text-sm font-bold ${c.text}`}>{pct}%</span>}
      </div>
      <div className={`h-2.5 w-full rounded-full ${c.bg}`}>
        <motion.div
          className={`h-2.5 rounded-full ${c.bar}`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.9, delay, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}

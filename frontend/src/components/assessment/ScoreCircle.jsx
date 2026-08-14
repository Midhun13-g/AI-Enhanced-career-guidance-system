import { motion } from 'framer-motion';

export default function ScoreCircle({ value = 0, label = 'Overall Score', size = 184 }) {
  const radius = 72;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg viewBox="0 0 184 184" className="-rotate-90">
          <circle cx="92" cy="92" r={radius} fill="none" stroke="#E2E8F0" strokeWidth="14" />
          <motion.circle
            cx="92"
            cy="92"
            r={radius}
            fill="none"
            stroke="#2563EB"
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-black text-slate-950">{value}</span>
          <span className="text-xs font-bold uppercase tracking-wide text-slate-400">/ 100</span>
        </div>
      </div>
      <p className="mt-3 text-sm font-bold text-slate-700">{label}</p>
    </div>
  );
}

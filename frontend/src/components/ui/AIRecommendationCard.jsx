import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Zap } from 'lucide-react';

export default function AIRecommendationCard({ title, reason, improvement, action, onAction, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.35 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 p-5 text-white shadow-glow"
    >
      {/* Background decoration */}
      <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/5" />
      <div className="pointer-events-none absolute -bottom-6 -left-6 h-24 w-24 rounded-full bg-white/5" />

      <div className="relative">
        <div className="flex items-center gap-2 mb-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/20">
            <Sparkles size={14} />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-blue-100">AI Recommendation</span>
        </div>

        <h3 className="text-lg font-extrabold leading-snug">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-blue-100">{reason}</p>

        {improvement && (
          <div className="mt-3 flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2">
            <Zap size={14} className="text-yellow-300 shrink-0" />
            <span className="text-xs font-semibold text-white">{improvement}</span>
          </div>
        )}

        {onAction && (
          <button
            onClick={onAction}
            className="mt-4 flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-bold text-blue-700 transition hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-white/50"
          >
            {action || 'Start Now'} <ArrowRight size={14} />
          </button>
        )}
      </div>
    </motion.div>
  );
}

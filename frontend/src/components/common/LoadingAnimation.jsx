import { motion } from 'framer-motion';
import { Brain, Sparkles } from 'lucide-react';

export default function LoadingAnimation({ title = 'Analyzing your responses...', subtitle = 'Finding your best career match...' }) {
  return (
    <div className="flex min-h-[420px] items-center justify-center px-4">
      <div className="text-center">
        <div className="relative mx-auto mb-6 h-24 w-24">
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-blue-100 border-t-blue-600"
            animate={{ rotate: 360 }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div
            className="absolute inset-4 rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-200"
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Brain className="mx-auto mt-4" size={30} aria-hidden="true" />
          </motion.div>
          <Sparkles className="absolute -right-2 top-2 text-emerald-500" size={20} aria-hidden="true" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">{title}</h2>
        <p className="mt-2 text-sm text-slate-500">{subtitle}</p>
      </div>
    </div>
  );
}

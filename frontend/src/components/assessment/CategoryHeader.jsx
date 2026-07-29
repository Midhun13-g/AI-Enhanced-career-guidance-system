import { motion } from 'framer-motion';

export default function CategoryHeader({ eyebrow, title, description, icon: Icon }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
      <div className="flex items-start gap-4">
        {Icon && (
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-200">
            <Icon size={24} aria-hidden="true" />
          </div>
        )}
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-blue-600">{eyebrow}</p>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl">{title}</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{description}</p>
        </div>
      </div>
    </motion.div>
  );
}

const variants = {
  blue:    'bg-blue-100 text-blue-700 border-blue-200',
  indigo:  'bg-indigo-100 text-indigo-700 border-indigo-200',
  teal:    'bg-teal-100 text-teal-700 border-teal-200',
  green:   'bg-green-100 text-green-700 border-green-200',
  amber:   'bg-amber-100 text-amber-700 border-amber-200',
  rose:    'bg-rose-100 text-rose-700 border-rose-200',
  purple:  'bg-purple-100 text-purple-700 border-purple-200',
  slate:   'bg-slate-100 text-slate-600 border-slate-200',
  ai:      'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-transparent',
};

const difficultyVariant = { Easy: 'green', Medium: 'amber', Hard: 'rose', Expert: 'purple' };
const statusVariant = { Completed: 'green', 'In Progress': 'blue', Pending: 'slate', Failed: 'rose', Passed: 'green' };

export default function Badge({ label, variant, dot = false }) {
  const v = variant || difficultyVariant[label] || statusVariant[label] || 'slate';
  const cls = variants[v] || variants.slate;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${cls}`}>
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />}
      {label}
    </span>
  );
}

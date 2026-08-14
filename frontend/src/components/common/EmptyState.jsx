import { ClipboardList } from 'lucide-react';

export default function EmptyState({ title = 'No data available', message = 'Once you begin the assessment, your answers and results will appear here.', action }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
        <ClipboardList size={24} aria-hidden="true" />
      </div>
      <h3 className="mt-4 text-base font-bold text-slate-900">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">{message}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

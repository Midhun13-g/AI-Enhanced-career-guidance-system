import { Check } from 'lucide-react';

export default function OptionCard({ label, description, selected, onSelect, disabled = false }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={disabled}
      className={`group flex w-full items-center justify-between gap-4 rounded-xl border p-4 text-left transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
        selected
          ? 'border-blue-500 bg-blue-50 shadow-sm'
          : 'border-slate-200 bg-white hover:border-blue-200 hover:bg-slate-50'
      }`}
      aria-pressed={selected}
    >
      <span>
        <span className={`block text-sm font-bold ${selected ? 'text-blue-800' : 'text-slate-800'}`}>{label}</span>
        {description && <span className="mt-1 block text-xs text-slate-500">{description}</span>}
      </span>
      <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${
        selected ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300 text-transparent group-hover:border-blue-300'
      }`}>
        <Check size={15} aria-hidden="true" />
      </span>
    </button>
  );
}

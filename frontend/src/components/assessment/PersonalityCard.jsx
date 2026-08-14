import { Brain, CheckCircle2 } from 'lucide-react';

export default function PersonalityCard({ type, strengths = [] }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white">
          <Brain size={24} aria-hidden="true" />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-500">Personality Type</p>
          <h3 className="mt-1 text-xl font-extrabold text-slate-950">{type}</h3>
        </div>
      </div>
      <div className="mt-5 space-y-3">
        {strengths.map((strength) => (
          <div key={strength} className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <CheckCircle2 size={17} className="text-emerald-500" aria-hidden="true" />
            {strength}
          </div>
        ))}
      </div>
    </div>
  );
}

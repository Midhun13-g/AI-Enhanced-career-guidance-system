import React from 'react';
import { ListOrdered, ArrowRight, BookOpen, Sparkles } from 'lucide-react';

export default function LearningPriorities({ learningPriorities, skillGaps }) {
  const priorities = Array.isArray(learningPriorities) ? learningPriorities : [];

  return (
    <div className="card p-6 space-y-6">
      <div className="border-b border-slate-100 pb-4">
        <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
          <ListOrdered className="text-blue-600" size={22} /> Recommended Learning Priorities
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Sequential roadmap targeting your highest impact skill acquisitions.
        </p>
      </div>

      {priorities.length === 0 ? (
        <p className="text-sm text-slate-400 italic">No learning priorities specified.</p>
      ) : (
        <div className="space-y-3">
          {priorities.map((item, idx) => {
            const label = typeof item === 'string' ? item : item.title || item.skill || JSON.stringify(item);
            const stepNum = idx + 1;

            return (
              <div
                key={idx}
                className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-gradient-to-r from-white via-slate-50/50 to-blue-50/30 p-4 hover:border-blue-200 transition"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 font-black text-white text-sm shadow-md shadow-blue-200">
                  #{stepNum}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    {label}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Step {stepNum} of {priorities.length} in your personalized acquisition plan.
                  </p>
                </div>
                <ArrowRight size={18} className="text-slate-400" />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

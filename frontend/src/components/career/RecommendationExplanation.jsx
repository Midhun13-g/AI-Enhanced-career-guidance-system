import React from 'react';
import { HelpCircle, Sparkles, Sliders, CheckCircle2 } from 'lucide-react';

export default function RecommendationExplanation({ explanations }) {
  const items = Array.isArray(explanations) ? explanations : [];

  if (items.length === 0) {
    return (
      <div className="card p-6 text-center text-slate-500">
        <HelpCircle className="mx-auto mb-2 text-slate-300" size={32} />
        <p className="font-bold">Explainability Data Not Available</p>
      </div>
    );
  }

  return (
    <div className="card p-6 space-y-6">
      <div className="border-b border-slate-100 pb-4">
        <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
          <Sparkles className="text-purple-600" size={22} /> Recommendation Explanations
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Model explainability detailing why specific skills, jobs, and courses were recommended.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {items.map((item, idx) => {
          const title = item.factor || item.recommendation || item.target || `Recommendation #${idx + 1}`;
          const rawType = (item.explanation_type || item.type || '').toUpperCase();
          const isShap = rawType.includes('SHAP');
          const typeLabel = isShap ? 'SHAP Feature Contribution' : 'Recommendation Explanation';
          
          const humanText = item.human_readable_explanation || item.explanation || item.reason || null;
          const features = item.feature_contributions || null;
          const featureEntries = features && typeof features === 'object' ? Object.entries(features) : [];

          return (
            <div key={idx} className="rounded-2xl border border-slate-100 bg-slate-50/50 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-black text-slate-900 text-sm">{title}</h3>
                <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${
                  isShap
                    ? 'bg-purple-100 text-purple-800 border-purple-200'
                    : 'bg-blue-100 text-blue-800 border-blue-200'
                }`}>
                  {typeLabel}
                </span>
              </div>

              {humanText && (
                <div className="rounded-xl bg-white p-4 border border-slate-100 text-xs text-slate-700 leading-relaxed">
                  <p className="font-semibold text-slate-900 mb-1 flex items-center gap-1.5">
                    <CheckCircle2 size={13} className="text-emerald-500" /> Explanation Details
                  </p>
                  {humanText}
                </div>
              )}

              {/* Feature contributions breakdown only if present from API */}
              {featureEntries.length > 0 && (
                <div className="space-y-2.5 bg-white p-4 rounded-xl border border-slate-100">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Sliders size={13} className="text-purple-600" /> Feature Weight Contributions
                  </h4>
                  {featureEntries.map(([feat, val], fIdx) => {
                    const numVal = typeof val === 'number' ? val : parseFloat(val) || 0;
                    const pct = Math.round(numVal * (Math.abs(numVal) <= 1 ? 100 : 1));
                    const isPositive = pct >= 0;
                    return (
                      <div key={fIdx}>
                        <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                          <span>{feat}</span>
                          <span className={isPositive ? 'text-purple-600' : 'text-rose-600'}>
                            {isPositive ? `+${pct}%` : `${pct}%`}
                          </span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${isPositive ? 'bg-purple-500' : 'bg-rose-500'}`}
                            style={{ width: `${Math.min(100, Math.abs(pct))}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

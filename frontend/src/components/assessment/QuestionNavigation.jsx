import { ArrowLeft, ArrowRight, Flag, SkipForward, Save } from 'lucide-react';

export default function QuestionNavigation({ onPrevious, onNext, onSkip, onSave, onFinish, canPrevious, isLastQuestion, finishDisabled }) {
  return (
    <div className="mt-6 flex flex-col gap-3 rounded-xl border border-slate-100 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <button
        type="button"
        onClick={onPrevious}
        disabled={!canPrevious}
        className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <ArrowLeft size={16} /> Previous
      </button>
      <div className="grid grid-cols-2 gap-2 sm:flex">
        <button type="button" onClick={onSkip} className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <SkipForward size={16} /> Skip
        </button>
        <button type="button" onClick={onSave} className="inline-flex items-center justify-center gap-2 rounded-xl border border-sky-200 bg-sky-50 px-4 py-2.5 text-sm font-semibold text-sky-700 transition hover:bg-sky-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <Save size={16} /> Save
        </button>
        {isLastQuestion ? (
          <button type="button" onClick={onFinish} disabled={finishDisabled} className="col-span-2 inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2">
            <Flag size={16} /> Finish Assessment
          </button>
        ) : (
          <button type="button" onClick={onNext} className="col-span-2 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            Next <ArrowRight size={16} />
          </button>
        )}
      </div>
    </div>
  );
}

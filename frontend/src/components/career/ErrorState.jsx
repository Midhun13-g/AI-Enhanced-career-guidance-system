import React from 'react';
import { AlertTriangle, RefreshCw, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ErrorState({ error, onRetry }) {
  const message = typeof error === 'string'
    ? error
    : (error?.message || 'We could not complete your resume analysis. Please try again.');

  return (
    <div className="mx-auto max-w-lg py-12 px-4 text-center">
      <div className="rounded-3xl border border-red-100 bg-red-50/40 p-8 shadow-sm space-y-4">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100 text-red-600">
          <AlertTriangle size={28} />
        </div>
        <div>
          <h2 className="text-lg font-black text-slate-900">Analysis Error</h2>
          <p className="text-sm font-medium text-red-700 mt-2 leading-relaxed">
            {message}
          </p>
        </div>
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          {onRetry && (
            <button
              onClick={onRetry}
              className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-red-700 transition"
            >
              <RefreshCw size={14} /> Try Again
            </button>
          )}
          <Link
            to="/resume/upload"
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white hover:bg-slate-800 transition"
          >
            <Upload size={14} /> Upload Another Resume
          </Link>
        </div>
      </div>
    </div>
  );
}

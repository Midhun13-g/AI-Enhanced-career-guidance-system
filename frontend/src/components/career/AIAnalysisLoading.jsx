import React from 'react';
import { Loader2, Sparkles, Cpu, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AIAnalysisLoading() {
  return (
    <div className="mx-auto max-w-xl py-12 px-4 text-center">
      <div className="rounded-3xl border border-blue-100 bg-white p-8 sm:p-12 shadow-xl shadow-blue-50/50 space-y-6">
        <div className="relative mx-auto flex h-20 w-20 items-center justify-center">
          <motion.div
            className="absolute inset-0 rounded-3xl bg-blue-600/10"
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-200">
            <Sparkles size={28} className="animate-pulse" />
          </div>
        </div>

        <div>
          <span className="text-xs font-black uppercase tracking-widest text-blue-600">
            AI CAREER GUIDANCE PIPELINE
          </span>
          <h2 className="text-2xl font-black text-slate-900 mt-1">
            Analyzing Your Resume
          </h2>
          <p className="text-sm font-semibold text-slate-500 mt-2">
            ⏳ Please wait while Hugging Face AI pipeline extracts your skills, computes semantic job matches, recommends target courses, and generates your career roadmap.
          </p>
        </div>

        <div className="space-y-3 rounded-2xl bg-slate-50 p-4 border border-slate-100 text-left text-xs font-semibold text-slate-600">
          <div className="flex items-center gap-2.5">
            <Loader2 className="animate-spin text-blue-600" size={16} />
            <span>Document Processing & OCR Extraction</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Loader2 className="animate-spin text-indigo-600" size={16} />
            <span>Hugging Face AI Vector Embedding & Semantic Matching</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Loader2 className="animate-spin text-purple-600" size={16} />
            <span>Skill-Gap & SHAP Course Recommendation Synthesis</span>
          </div>
        </div>

        <p className="text-xs text-slate-400 font-medium flex items-center justify-center gap-1.5">
          <ShieldCheck size={14} className="text-emerald-500" /> Safe & Private Execution via Spring Boot Gateway
        </p>
      </div>
    </div>
  );
}

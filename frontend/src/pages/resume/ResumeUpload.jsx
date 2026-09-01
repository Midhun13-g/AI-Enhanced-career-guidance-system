import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiArrowRight,
  FiCheckCircle,
  FiFileText,
  FiShield,
  FiZap,
  FiUploadCloud,
  FiActivity,
  FiAlertCircle,
} from 'react-icons/fi';
import AppLayout from '../../components/layout/AppLayout';
import ResumeDropzone from '../../components/resume/ResumeDropzone';
import { uploadResume, analyzeResumeAI } from '../../services/resumeService';
import { useToast } from '../../context/ToastContext';
import AIAnalysisLoading from '../../components/career/AIAnalysisLoading';

export default function ResumeUpload() {
  const navigate = useNavigate();
  const toast = useToast();
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingMode, setLoadingMode] = useState('');

  const selectFile = (next, message) => {
    setFile(next);
    setError(message);
  };

  // AI Pipeline upload
  const submitAI = async () => {
    if (!file) return setError('Please select a resume document to continue.');
    setLoading(true);
    setLoadingMode('ai');
    setError(null);
    try {
      const response = await analyzeResumeAI(file);
      toast?.('AI Resume Analysis complete!', 'success');
      navigate('/resume/ai-guidance', {
        state: {
          analysisData: response.data,
          filename: file.name,
        },
      });
    } catch (err) {
      console.error('AI Upload error:', err);
      const msg = err.response?.data?.message || 'AI pipeline processing failed. Please verify service connectivity.';
      toast?.(msg, 'error');
      setError(msg);
    } finally {
      setLoading(false);
      setLoadingMode('');
    }
  };

  // Standard upload
  const submitStandard = async () => {
    if (!file) return setError('Please select a resume document to continue.');
    setLoading(true);
    setLoadingMode('standard');
    setError(null);
    try {
      const { data } = await uploadResume(file);
      sessionStorage.setItem('resumeId', data?.resumeId ?? '');
      sessionStorage.setItem('resumeFile', file.name);
      toast?.('Resume uploaded successfully.', 'success');
      navigate('/resume/parsing');
    } catch {
      sessionStorage.setItem('resumeId', '');
      sessionStorage.setItem('resumeFile', file.name);
      toast?.('Upload failed. Please try again.', 'error');
    } finally {
      setLoading(false);
      setLoadingMode('');
    }
  };

  if (loading && loadingMode === 'ai') {
    return (
      <AppLayout>
        <div className="py-16 max-w-4xl mx-auto">
          <AIAnalysisLoading />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-8 max-w-[1400px] mx-auto pb-16 antialiased selection:bg-[#0038FF] selection:text-white">
        
        {/* ── Top Header Ribbon ── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-neutral-200/80 pb-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 font-mono">
                Resume Intelligence
              </span>
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-blue-50 border border-blue-100 text-[#0038FF] text-[9px] font-bold font-mono uppercase">
                <FiShield size={9} /> Module 03 Ingestion
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-950">
              Upload Candidate Resume
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 max-w-2xl leading-relaxed">
              Upload your latest resume document for semantic job matching, skill gap discovery, SHAP explainability, and multi-phase progression roadmaps.
            </p>
          </div>
        </div>

        {/* ── Main Ingestion Grid ── */}
        <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr] items-start">
          
          {/* Dropzone & Submission Actions */}
          <section className="rounded-2xl border border-neutral-200/90 bg-white p-6 sm:p-7 shadow-xs space-y-5">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#0038FF] font-mono">
                Source Document
              </span>
              <h2 className="text-base font-bold text-neutral-950 mt-0.5">
                Select File Payload
              </h2>
            </div>

            <ResumeDropzone file={file} error={error} onFile={selectFile} />

            {error && (
              <div className="flex items-center gap-2 text-xs font-mono text-rose-600 bg-rose-50 border border-rose-100 p-3 rounded-lg">
                <FiAlertCircle size={14} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-3 pt-2 font-mono">
              <button
                onClick={submitAI}
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-[#0038FF] hover:bg-blue-700 active:scale-[0.99] px-5 py-3 text-xs font-bold text-white transition-all shadow-md shadow-blue-500/20 disabled:opacity-60 group"
              >
                {loading && loadingMode === 'ai' ? (
                  <>
                    <FiActivity className="animate-spin" size={14} />
                    <span>Executing AI Pipeline...</span>
                  </>
                ) : (
                  <>
                    <FiZap size={14} />
                    <span>Analyze with AI Career Guidance</span>
                    <FiArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
                  </>
                )}
              </button>

              <button
                onClick={submitStandard}
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-50 active:scale-[0.99] px-5 py-2.5 text-xs font-bold text-neutral-800 transition-all shadow-2xs disabled:opacity-60"
              >
                {loading && loadingMode === 'standard' ? (
                  <>
                    <FiActivity className="animate-spin" size={13} />
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <FiUploadCloud size={13} className="text-[#0038FF]" />
                    <span>Standard Profile Parse</span>
                  </>
                )}
              </button>
            </div>
          </section>

          {/* Guidelines & Privacy Rail */}
          <aside className="space-y-5">
            
            {/* Requirements Card */}
            <div className="rounded-2xl border border-neutral-200/90 bg-white p-6 shadow-xs space-y-4 font-mono">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                  Pre-Upload Checklist
                </span>
                <div className="h-6 w-6 rounded-md bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0038FF]">
                  <FiFileText size={12} />
                </div>
              </div>

              <div className="space-y-3 font-sans">
                {[
                  'Ensure single-column layout for optimal OCR accuracy',
                  'Accepted file formats: PDF (.pdf) and Word (.docx)',
                  'Include clear Experience, Education, and Skills headers',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2.5 text-xs text-neutral-700">
                    <FiCheckCircle size={14} className="shrink-0 text-emerald-600 mt-0.5" />
                    <span className="leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Privacy & Governance Notice */}
            <div className="rounded-2xl border border-neutral-200/90 bg-[#F8FAFC] p-6 shadow-xs space-y-2.5 font-mono">
              <div className="flex items-center gap-2 text-xs font-bold text-neutral-900">
                <FiShield size={14} className="text-[#0038FF]" />
                <span className="uppercase tracking-wider text-[10px]">Data Privacy Policy</span>
              </div>
              <p className="text-xs text-neutral-500 leading-relaxed font-sans">
                Candidate payload data is encrypted in transit and exclusively processed for semantic role matching and taxonomy extraction.
              </p>
            </div>

          </aside>

        </div>

      </div>
    </AppLayout>
  );
}
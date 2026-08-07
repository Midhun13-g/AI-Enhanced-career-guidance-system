import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2, FileCheck, ShieldCheck } from 'lucide-react';
import AppLayout from '../../components/layout/AppLayout';
import ResumeDropzone from '../../components/resume/ResumeDropzone';
import { uploadResume } from '../../services/resumeService';
import { useToast } from '../../context/ToastContext';

export default function ResumeUpload() {
  const navigate = useNavigate();
  const toast = useToast();
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const selectFile = (next, message) => { setFile(next); setError(message); };

  const submit = async () => {
    if (!file) return setError('Please select a resume to continue.');
    setLoading(true);
    try {
      const { data } = await uploadResume(file);
      sessionStorage.setItem('resumeId', data?.resumeId ?? '');  // fixed: was data?.id
      sessionStorage.setItem('resumeFile', file.name);
      toast('Resume uploaded successfully.', 'success');
      navigate('/resume/parsing');  // go to NLP pipeline page
    } catch {
      sessionStorage.setItem('resumeId', '');
      sessionStorage.setItem('resumeFile', file.name);
      toast('Upload failed. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="mx-auto max-w-5xl">
        <p className="text-sm font-bold uppercase tracking-wider text-blue-600">Module 3 · Step 1 of 4</p>
        <h1 className="mt-2 text-3xl font-black text-slate-950">Upload your resume</h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          Upload your latest resume and let AI turn it into a polished, editable career profile.
        </p>
        <div className="mt-8 grid gap-6 lg:grid-cols-[1.25fr_.75fr]">
          <section className="card p-5 sm:p-7">
            <ResumeDropzone file={file} error={error} onFile={selectFile} />
            <button
              onClick={submit}
              disabled={loading}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-100 transition hover:bg-blue-700 disabled:opacity-60"
            >
              {loading ? 'Uploading…' : 'Upload and analyse'} <ArrowRight size={17} />
            </button>
          </section>
          <aside className="space-y-4">
            <div className="card p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                <FileCheck size={20} />
              </div>
              <h2 className="mt-4 font-bold text-slate-900">Before you upload</h2>
              <div className="mt-4 space-y-3">
                {['Use your most recent resume', 'Keep the layout clear and readable', 'Include education, skills, and projects'].map((item) => (
                  <p key={item} className="flex gap-2 text-sm text-slate-600">
                    <CheckCircle2 size={18} className="shrink-0 text-emerald-500" />{item}
                  </p>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-sky-100 bg-sky-50 p-5">
              <ShieldCheck className="text-sky-600" size={21} />
              <p className="mt-3 text-sm font-bold text-slate-800">Your data stays private</p>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                Your resume is only used to generate your career profile and recommendations.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </AppLayout>
  );
}

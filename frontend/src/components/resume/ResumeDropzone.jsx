import { useCallback, useRef, useState } from 'react';
import { FileUp, FileText, X } from 'lucide-react';

const MAX_SIZE = 5 * 1024 * 1024;

export default function ResumeDropzone({ onFile, file, error }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const validate = useCallback((candidate) => {
    if (!candidate) return;
    const valid = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!valid.includes(candidate.type) && !/\.(pdf|docx)$/i.test(candidate.name)) return onFile(null, 'Choose a PDF or DOCX file.');
    if (candidate.size > MAX_SIZE) return onFile(null, 'Your resume must be 5 MB or smaller.');
    onFile(candidate, null);
  }, [onFile]);
  const drop = (event) => { event.preventDefault(); setDragging(false); validate(event.dataTransfer.files?.[0]); };

  if (file) return <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5"><div className="flex items-center gap-4"><div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600"><FileText /></div><div className="min-w-0 flex-1"><p className="truncate font-bold text-slate-900">{file.name}</p><p className="mt-1 text-sm text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB · Ready to upload</p></div><button onClick={() => onFile(null, null)} aria-label="Remove selected file" className="rounded-lg p-2 text-slate-500 hover:bg-white hover:text-red-600"><X size={19} /></button></div></div>;
  return <div onDragOver={(e) => { e.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={drop} className={`rounded-2xl border-2 border-dashed p-8 text-center transition sm:p-12 ${dragging ? 'border-blue-500 bg-blue-50' : error ? 'border-red-300 bg-red-50/40' : 'border-slate-200 bg-slate-50 hover:border-blue-400 hover:bg-blue-50/30'}`}><input ref={inputRef} type="file" accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" className="hidden" onChange={(e) => validate(e.target.files?.[0])} /><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-600"><FileUp size={26} /></div><h3 className="mt-5 font-bold text-slate-900">Drag your resume here</h3><p className="mt-2 text-sm text-slate-500">or choose a file from your computer</p><button type="button" onClick={() => inputRef.current?.click()} className="mt-5 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">Browse file</button><p className="mt-5 text-xs font-medium text-slate-500">PDF or DOCX · Maximum file size 5 MB</p>{error && <p role="alert" className="mt-3 text-sm font-semibold text-red-600">{error}</p>}</div>;
}

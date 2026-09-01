import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiArrowLeft,
  FiArrowRight,
  FiDownload,
  FiFileText,
  FiMaximize2,
  FiMinimize2,
  FiRotateCw,
  FiZoomIn,
  FiZoomOut,
  FiShield,
  FiZap,
  FiCheckCircle,
  FiLayers,
} from 'react-icons/fi';
import AppLayout from '../../components/layout/AppLayout';

export default function ResumePreview() {
  const navigate = useNavigate();
  const documentRef = useRef(null);
  const fileName = sessionStorage.getItem('resumeFile') || 'Alex_Johnson_Resume.pdf';

  // Toolbar & Viewer States
  const [zoomLevel, setZoomLevel] = useState(1); // 1, 1.15, 1.3
  const [rotation, setRotation] = useState(0); // 0, 90, 180, 270
  const [currentPage, setCurrentPage] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const totalPages = 1;

  const handleZoom = () => {
    setZoomLevel((prev) => (prev >= 1.3 ? 1 : prev + 0.15));
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleFullscreen = () => {
    if (!documentRef.current) return;
    if (!document.fullscreenElement) {
      documentRef.current.requestFullscreen?.().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen?.().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const handleDownload = () => {
    // Generates plain text representation download of the current parsed preview
    const resumeText = `ALEX JOHNSON\nFrontend Developer · Bengaluru, India\nalex.johnson@email.com · +91 98765 43210 · linkedin.com/in/alexjohnson\n\nEXECUTIVE PROFILE\nAspiring software engineer with experience building responsive, accessible web applications and scalable backend microservices.\n\nCORE COMPETENCIES & TECH STACK\nJavaScript · TypeScript · React · Node.js · Python · SQL · Tailwind CSS · Docker · Git\n\nENGINEERING EXPERIENCE\nFrontend Developer Intern — TechLabs | Jun 2024 – Aug 2024\nBuilt reusable design system component interfaces and improved core page load latency by 32%.\n\nACADEMIC CREDENTIALS\nB.Tech in Computer Science & Engineering — National Institute of Technology | 2025`;
    const blob = new Blob([resumeText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName.replace(/\.pdf$/i, '') + '-parsed.txt';
    link.click();
    URL.revokeObjectURL(url);
  };

  const resumeSections = [
    {
      title: 'EXECUTIVE PROFILE',
      content: 'Aspiring software engineer with experience building responsive, accessible web applications, scalable backend microservices, and data-driven products.',
    },
    {
      title: 'CORE COMPETENCIES & TECH STACK',
      content: 'JavaScript · TypeScript · React · Node.js · Python · SQL · Tailwind CSS · Docker · Git',
    },
    {
      title: 'ENGINEERING EXPERIENCE',
      content: 'Frontend Developer Intern — TechLabs | Jun 2024 – Aug 2024\nBuilt reusable design system component interfaces and improved core page load latency by 32%.',
    },
    {
      title: 'ACADEMIC CREDENTIALS',
      content: 'B.Tech in Computer Science & Engineering — National Institute of Technology | 2025',
    },
  ];

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
                <FiShield size={9} /> Module 03 Preview Stage
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-950">
              Verify Document Payload
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 max-w-2xl leading-relaxed">
              Ensure formatting integrity and correct candidate details before submitting to the deep inference parsing pipeline.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => navigate('/resume/upload')}
              className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700 py-2.5 px-4 font-mono text-xs font-semibold tracking-wide transition-all shadow-2xs"
            >
              <FiArrowLeft size={13} />
              <span>Change Source File</span>
            </button>
          </div>
        </div>

        {/* ── Grid: Main Document Canvas + Sidebar ── */}
        <div className="grid gap-6 lg:grid-cols-[1fr_340px] items-start">
          
          {/* Document Viewer Frame */}
          <section
            ref={documentRef}
            className="overflow-hidden rounded-2xl border border-neutral-200/90 bg-neutral-100 shadow-xs flex flex-col"
          >
            {/* Viewer Top Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white px-5 py-3.5 border-b border-neutral-200/80 font-mono">
              <div className="flex items-center gap-2.5 text-xs font-bold text-neutral-900 min-w-0">
                <div className="h-7 w-7 rounded-md bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0038FF] shrink-0">
                  <FiFileText size={14} />
                </div>
                <span className="truncate max-w-[240px] sm:max-w-md">{fileName}</span>
              </div>

              {/* Functional Toolbar Buttons */}
              <div className="flex items-center gap-1">
                <button
                  onClick={handleZoom}
                  title={`Zoom (${Math.round(zoomLevel * 100)}%)`}
                  className={`rounded-lg p-2 transition-colors shadow-2xs ${
                    zoomLevel > 1 ? 'bg-blue-50 text-[#0038FF]' : 'text-neutral-500 hover:bg-neutral-100 hover:text-neutral-950'
                  }`}
                >
                  {zoomLevel > 1 ? <FiZoomOut size={14} /> : <FiZoomIn size={14} />}
                </button>

                <button
                  onClick={handleRotate}
                  title={`Rotate 90° (${rotation}°)`}
                  className={`rounded-lg p-2 transition-colors shadow-2xs ${
                    rotation > 0 ? 'bg-blue-50 text-[#0038FF]' : 'text-neutral-500 hover:bg-neutral-100 hover:text-neutral-950'
                  }`}
                >
                  <FiRotateCw size={14} />
                </button>

                <button
                  onClick={handleFullscreen}
                  title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                  className="rounded-lg p-2 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-950 transition-colors shadow-2xs"
                >
                  {isFullscreen ? <FiMinimize2 size={14} /> : <FiMaximize2 size={14} />}
                </button>

                <button
                  onClick={handleDownload}
                  title="Download Raw Text Payload"
                  className="rounded-lg p-2 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-950 transition-colors shadow-2xs"
                >
                  <FiDownload size={14} />
                </button>
              </div>
            </div>

            {/* Document Paper Surface */}
            <div className="p-4 sm:p-8 overflow-auto flex justify-center min-h-[580px] bg-neutral-200/50">
              <motion.div
                animate={{
                  scale: zoomLevel,
                  rotate: rotation,
                }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="w-full max-w-[760px] bg-white p-8 sm:p-12 shadow-md border border-neutral-200/90 rounded-xl space-y-6 origin-center my-auto"
              >
                {/* Candidate Resume Header */}
                <div className="border-b-2 border-neutral-950 pb-5 space-y-1.5">
                  <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-950 uppercase font-sans">
                    Alex Johnson
                  </h2>
                  <p className="text-xs font-mono font-bold text-[#0038FF]">
                    Frontend Developer · Bengaluru, India
                  </p>
                  <p className="text-[11px] font-mono text-neutral-400">
                    alex.johnson@email.com · +91 98765 43210 · linkedin.com/in/alexjohnson
                  </p>
                </div>

                {/* Structured Sections */}
                {resumeSections.map(({ title, content }) => (
                  <div key={title} className="space-y-1.5 pt-1">
                    <h3 className="text-[10px] font-mono font-bold tracking-widest text-neutral-950 uppercase border-b border-neutral-100 pb-1">
                      {title}
                    </h3>
                    <p className="whitespace-pre-line text-xs font-sans text-neutral-700 leading-relaxed pt-0.5">
                      {content}
                    </p>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Viewer Pagination Footer */}
            <div className="flex items-center justify-between bg-white px-5 py-3 border-t border-neutral-200/80 text-xs font-mono text-neutral-500">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="hover:text-neutral-950 disabled:opacity-30 transition-colors"
              >
                ← Previous Page
              </button>
              <span className="rounded bg-neutral-100 px-2 py-0.5 text-[10px] font-bold text-neutral-700">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="hover:text-neutral-950 disabled:opacity-30 transition-colors"
              >
                Next Page →
              </button>
            </div>
          </section>

          {/* Right Pipeline Action Rail */}
          <aside className="space-y-5">
            <div className="rounded-2xl border border-neutral-200/90 bg-white p-6 shadow-xs space-y-5">
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-50 border border-blue-100 text-[#0038FF] text-[9px] font-bold font-mono uppercase">
                  <FiZap size={9} /> Ready for Parser
                </div>
                <h2 className="text-base font-bold text-neutral-950 font-sans">
                  Execute Inference Engine
                </h2>
                <p className="text-xs text-neutral-500 leading-relaxed font-sans">
                  The AI pipeline will extract named entities, normalize skill taxonomy, and formulate career readiness scores.
                </p>
              </div>

              <div className="space-y-2 border-t border-neutral-100 pt-4 text-xs font-mono text-neutral-600">
                <div className="flex items-center gap-2">
                  <FiCheckCircle size={13} className="text-emerald-600 shrink-0" />
                  <span>OCR & Structure Validated</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiCheckCircle size={13} className="text-emerald-600 shrink-0" />
                  <span>Schema Parse Ready</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiLayers size={13} className="text-[#0038FF] shrink-0" />
                  <span>Taxonomy v4 Compatible</span>
                </div>
              </div>

              <button
                onClick={() => navigate('/resume/parsing')}
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-[#0038FF] hover:bg-blue-700 active:scale-[0.99] text-white py-3 px-4 font-mono text-xs font-semibold tracking-wide transition-all shadow-md shadow-blue-500/20 group"
              >
                <span>Parse Document with AI</span>
                <FiArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>

            <div className="rounded-2xl border border-neutral-200/90 bg-[#F8FAFC] p-5 text-neutral-500 text-[11px] font-mono leading-relaxed space-y-2">
              <p className="font-bold text-neutral-800 uppercase tracking-wider text-[10px]">
                Pipeline Notice
              </p>
              <p>
                PDF layouts with standard single-column text yield highest extraction accuracy and lowest token hallucination.
              </p>
            </div>
          </aside>

        </div>

      </div>
    </AppLayout>
  );
}
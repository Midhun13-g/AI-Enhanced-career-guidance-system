import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-neutral-200/80 bg-white px-4 sm:px-6 lg:px-8 py-5 antialiased">
      <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* ── Brand Identity & Sub-label ── */}
        <div className="flex items-center gap-2.5">
          <div className="h-6 w-6 flex items-center justify-center shrink-0">
            <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
              <polygon points="16,2 28,9 16,16 4,9" fill="#0038FF" />
              <polygon points="4,9 16,16 16,30 4,23" fill="#0026B3" />
              <polygon points="28,9 16,16 16,30 28,23" fill="#3B82F6" />
              <polygon points="16,2 16,16 4,9" fill="#FFFFFF" fillOpacity="0.2" />
            </svg>
          </div>
          <span className="text-xs font-extrabold tracking-tight text-neutral-950">
            CAREER<span className="text-[#0038FF]">AI</span>
          </span>
          <span className="text-neutral-300">·</span>
          <span className="text-[11px] text-neutral-400 font-mono tracking-tight">
            Academic Career Architecture & Guidance Engine
          </span>
        </div>

        {/* ── Navigation Links & System Stamp ── */}
        <div className="flex flex-wrap items-center gap-5 text-xs text-neutral-500">
          <Link 
            to="/student/dashboard" 
            className="hover:text-[#0038FF] transition-colors font-medium"
          >
            Dashboard
          </Link>
          <Link 
            to="/profile" 
            className="hover:text-[#0038FF] transition-colors font-medium"
          >
            Profile
          </Link>
          <Link 
            to="/assessments/categories" 
            className="hover:text-[#0038FF] transition-colors font-medium"
          >
            Assessments
          </Link>
          <span className="text-neutral-300">·</span>
          <span className="font-mono text-[11px] text-neutral-400">
            © {new Date().getFullYear()} CareerAI Inc.
          </span>
        </div>

      </div>
    </footer>
  );
}
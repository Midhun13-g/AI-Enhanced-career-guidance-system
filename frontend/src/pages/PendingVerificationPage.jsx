import { Link } from 'react-router-dom';
import { 
  FiClock, FiMail, FiShield, FiArrowLeft, 
  FiCheckCircle, FiFileText, FiHelpCircle, FiLogOut 
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui';

// Unboxed Faceted Prism Logo
const BrandLogo = () => (
  <Link to="/login" className="inline-flex items-center gap-2.5 transition-opacity hover:opacity-90">
    <div className="h-8 w-8 flex items-center justify-center">
      <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
        <polygon points="16,2 28,9 16,16 4,9" fill="#0038FF" />
        <polygon points="4,9 16,16 16,30 4,23" fill="#0026B3" />
        <polygon points="28,9 16,16 16,30 28,23" fill="#3B82F6" />
        <polygon points="16,2 16,16 4,9" fill="#FFFFFF" fillOpacity="0.2" />
      </svg>
    </div>
    <span className="text-base font-extrabold tracking-tight text-neutral-950">
      CAREER<span className="text-[#0038FF]">AI</span>
    </span>
  </Link>
);

export default function PendingVerificationPage() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex flex-col justify-between items-center bg-[#F8FAFC] text-neutral-900 p-6 relative overflow-hidden antialiased selection:bg-[#0038FF] selection:text-white">
      
      {/* Ambient Low-Poly Faceted Terrain Background */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <svg viewBox="0 0 1200 800" preserveAspectRatio="none" className="w-full h-full">
          <polygon points="0,0 300,100 150,250" fill="#E8EEFF" stroke="#D3E0FF" strokeWidth="0.75" />
          <polygon points="0,0 150,250 0,350" fill="#D8E4FF" stroke="#C0D3FF" strokeWidth="0.75" />
          <polygon points="300,100 500,0 450,180" fill="#F0F4FF" stroke="#D3E0FF" strokeWidth="0.75" />
          <polygon points="300,100 450,180 150,250" fill="#CCE0FF" stroke="#BACDFF" strokeWidth="0.75" />
          <polygon points="750,800 950,650 820,520" fill="#EBF0FF" stroke="#D1DEFF" strokeWidth="0.75" />
          <polygon points="950,650 1200,720 1050,550" fill="#DCE6FF" stroke="#BACDFF" strokeWidth="0.75" />
          <polygon points="1200,720 1200,800 950,800" fill="#BACDFF" stroke="#9AB9FF" strokeWidth="0.75" />
        </svg>
      </div>

      {/* Top Header */}
      <div className="relative z-10 w-full max-w-xl flex items-center justify-between pt-2">
        <BrandLogo />
        {logout && (
          <button
            onClick={logout}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-900 transition-colors"
          >
            <FiLogOut size={13} />
            <span>Sign out</span>
          </button>
        )}
      </div>

      {/* Central Status Card */}
      <div className="relative z-10 w-full max-w-xl my-auto space-y-5">
        <div className="bg-white border border-neutral-200 rounded-2xl p-8 sm:p-10 shadow-xl shadow-neutral-100">
          
          {/* Status Badge & Header */}
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/80 text-amber-700 text-xs font-bold uppercase tracking-wider font-mono">
              <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
              Application Under Review
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-950 leading-tight">
              Mentor credentials are being verified.
            </h1>
            
            <p className="text-sm text-neutral-600 leading-relaxed">
              Your profile and uploaded verification documents have been submitted to the administrative team. Access to mentor features will activate once approved.
            </p>
          </div>

          {/* Verification Progress Steps */}
          <div className="my-6 border-y border-neutral-100 py-5 space-y-3.5">
            <div className="flex items-center justify-between text-xs font-mono text-neutral-400 uppercase tracking-wider pb-1">
              <span>Audit Pipeline</span>
              <span>Est. 24–48 Hours</span>
            </div>

            <div className="flex items-center gap-3 text-xs text-neutral-700">
              <div className="h-5 w-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-200">
                <FiCheckCircle size={12} strokeWidth={2.5} />
              </div>
              <span className="font-medium">Application details & Drive links recorded</span>
            </div>

            <div className="flex items-center gap-3 text-xs text-[#0038FF]">
              <div className="h-5 w-5 rounded-full bg-blue-50 text-[#0038FF] flex items-center justify-center shrink-0 border border-blue-200">
                <FiClock size={12} strokeWidth={2.5} />
              </div>
              <span className="font-semibold">Manual document credential audit (In Progress)</span>
            </div>

            <div className="flex items-center gap-3 text-xs text-neutral-400 opacity-60">
              <div className="h-5 w-5 rounded-full bg-neutral-100 text-neutral-400 flex items-center justify-center shrink-0">
                <FiShield size={12} />
              </div>
              <span>Advisor dashboard activation</span>
            </div>
          </div>

          {/* Applicant Metadata Box */}
          <div className="bg-neutral-50/70 rounded-xl border border-neutral-200/80 p-4 space-y-2 mb-6">
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono text-neutral-400 uppercase">Applicant Account</span>
              <span className="font-semibold text-neutral-900">{user?.email || 'Registered Mentor'}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono text-neutral-400 uppercase">Status</span>
              <span className="font-semibold text-amber-600">Pending Administrative Sign-Off</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <a
              href="mailto:support@careerai.com?subject=Mentor Verification Inquiry"
              className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-50 text-xs font-semibold text-neutral-800 transition-all shadow-2xs"
            >
              <FiMail size={14} className="text-neutral-500" />
              <span>Contact Support Desk</span>
            </a>
            <Link
              to="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-[#0038FF] hover:bg-blue-700 text-white text-xs font-semibold transition-all shadow-md shadow-blue-500/20"
            >
              <FiArrowLeft size={14} />
              <span>Back to Sign In</span>
            </Link>
          </div>
        </div>

        {/* Security Tag */}
        <div className="flex items-center justify-center gap-1.5 text-xs text-neutral-400">
          <FiShield size={13} className="text-neutral-400" />
          <span>Manual compliance verification protocol · Zero automated approval</span>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 text-center text-[11px] text-neutral-400 font-mono py-2">
        © 2026 CareerAI Inc. · Advisor Verification Status
      </div>
    </div>
  );
}
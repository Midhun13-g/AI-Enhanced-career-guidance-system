import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMail, FiArrowLeft, FiSend, FiCheck, FiShield } from 'react-icons/fi';
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

export default function ForgotPasswordPage() {
  const [email, setEmail]     = useState('');
  const [sent, setSent]       = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setSent(true);
    setLoading(false);
  };

  const inputCls =
    'w-full border border-neutral-200 rounded-lg px-4 py-3 text-sm text-neutral-900 placeholder-neutral-400 bg-white hover:border-neutral-300 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#0038FF] transition-all shadow-2xs';

  return (
    <div className="min-h-screen flex flex-col justify-between items-center bg-[#F8FAFC] text-neutral-900 p-6 relative overflow-hidden antialiased selection:bg-[#0038FF] selection:text-white">
      
      {/* Ambient Low-Poly Faceted Terrain Background */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <svg viewBox="0 0 1200 800" preserveAspectRatio="none" className="w-full h-full">
          <polygon points="0,0 300,100 150,250" fill="#E8EEFF" stroke="#D3E0FF" strokeWidth="0.75" />
          <polygon points="0,0 150,250 0,350" fill="#D8E4FF" stroke="#C0D3FF" strokeWidth="0.75" />
          <polygon points="300,100 500,0 450,180" fill="#F0F4FF" stroke="#D3E0FF" strokeWidth="0.75" />
          <polygon points="300,100 450,180 150,250" fill="#CCE0FF" stroke="#BACDFF" strokeWidth="0.75" />
          <polygon points="450,180 500,0 750,80" fill="#E2ECFF" stroke="#D3E0FF" strokeWidth="0.75" />
          
          <polygon points="750,800 950,650 820,520" fill="#EBF0FF" stroke="#D1DEFF" strokeWidth="0.75" />
          <polygon points="950,650 1200,720 1050,550" fill="#DCE6FF" stroke="#BACDFF" strokeWidth="0.75" />
          <polygon points="1200,720 1200,800 950,800" fill="#BACDFF" stroke="#9AB9FF" strokeWidth="0.75" />
          <polygon points="820,520 1050,550 950,420" fill="#BACDFF" stroke="#9AB9FF" strokeWidth="0.75" />
          <polygon points="1050,550 1200,450 1200,720" fill="#8CB2FF" stroke="#6699FF" strokeWidth="0.75" />
        </svg>
      </div>

      {/* Top Brand Logo */}
      <div className="relative z-10 pt-4">
        <BrandLogo />
      </div>

      {/* Centered Recovery Container */}
      <div className="relative z-10 w-full max-w-md my-auto space-y-6">
        <div className="bg-white border border-neutral-200 rounded-2xl p-8 sm:p-10 shadow-xl shadow-neutral-100">
          <AnimatePresence mode="wait">
            {!sent ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
              >
                {/* Header */}
                <div className="space-y-1.5 mb-6 text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-50 text-[#0038FF] border border-blue-100 mb-2">
                    <FiMail size={20} />
                  </div>
                  <h1 className="text-2xl font-bold tracking-tight text-neutral-950">
                    Reset your password
                  </h1>
                  <p className="text-xs text-neutral-500 max-w-xs mx-auto leading-relaxed">
                    Enter the email address associated with your account and we’ll send a recovery link.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                  {/* Email Field */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider" htmlFor="fp-email">
                      Account Email
                    </label>
                    <div className="relative">
                      <FiMail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
                      <input
                        id="fp-email"
                        type="email"
                        placeholder="name@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        autoComplete="email"
                        className={`${inputCls} pl-10`}
                      />
                    </div>
                  </div>

                  {/* Primary Action Button */}
                  <Button
                    type="submit"
                    size="lg"
                    loading={loading}
                    className="w-full bg-[#0038FF] hover:bg-blue-700 active:scale-[0.99] text-white rounded-lg text-sm font-semibold py-3 transition-all flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 mt-2"
                  >
                    <span>{loading ? 'Sending link…' : 'Send Recovery Link'}</span>
                    {!loading && <FiSend size={15} />}
                  </Button>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.25 }}
                className="text-center py-2"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 mb-3">
                  <FiCheck size={22} strokeWidth={2.5} />
                </div>
                <h2 className="text-xl font-bold tracking-tight text-neutral-950">
                  Check your inbox
                </h2>
                <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
                  We've sent password reset instructions to<br />
                  <span className="font-semibold text-neutral-900 font-mono text-xs">{email}</span>
                </p>
                <div className="mt-4 p-3 bg-neutral-50 rounded-lg border border-neutral-200/60 text-[11px] text-neutral-500 leading-normal">
                  Didn't receive the email? Check your spam folder or verify that the address entered is correct.
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Back Navigation */}
          <div className="border-t border-neutral-100 mt-6 pt-5 text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-600 hover:text-[#0038FF] transition-colors"
            >
              <FiArrowLeft size={13} />
              <span>Back to sign in</span>
            </Link>
          </div>
        </div>

        {/* Security Tag */}
        <div className="flex items-center justify-center gap-1.5 text-xs text-neutral-400">
          <FiShield size={13} className="text-neutral-400" />
          <span>Encrypted security handshake · Time-limited token</span>
        </div>
      </div>

      {/* Muted Legal Footer */}
      <div className="relative z-10 text-center text-[11px] text-neutral-400 font-mono py-2">
        © 2026 CareerAI Inc. · Privacy & Terms
      </div>
    </div>
  );
}
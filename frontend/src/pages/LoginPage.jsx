import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight, FiCheck, FiShield } from 'react-icons/fi';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Button, Alert } from '../components/ui';

const CAPABILITIES = [
  'Role-targeted career matching',
  'Real-time skill gap analysis',
  'Curated progression roadmap',
  'Live labor market insights',
];

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '', remember: false });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/api/auth/login', form);
      const role = (res.data.roles || [])[0]?.replace('ROLE_', '');
      const user = {
        id: res.data.id,
        email: res.data.email,
        firstName: res.data.firstName,
        lastName: res.data.lastName,
        roles: res.data.roles,
        role,
        accountStatus: res.data.accountStatus,
      };
      login(user, res.data.token);
      if (role === 'ADMIN') navigate('/admin');
      else if (role === 'MENTOR')
        navigate(res.data.accountStatus === 'VERIFIED' ? '/mentor' : '/mentor/pending-verification');
      else navigate('/student/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputCls =
    'w-full border border-neutral-200 rounded-lg px-4 py-3 text-sm text-neutral-900 placeholder-neutral-400 bg-white hover:border-neutral-300 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#0038FF] transition-all shadow-2xs';

  return (
    <div className="min-h-screen flex bg-white text-neutral-900 antialiased selection:bg-[#0038FF] selection:text-white">
      {/* ── Left panel: Bold Editorial Showcase with Low-Poly Background ── */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#F8FAFC] border-r border-neutral-200 flex-col justify-between p-16 xl:p-20 relative overflow-hidden">
        
        {/* Ambient Low-Poly Faceted Terrain Background */}
        <div className="absolute inset-0 pointer-events-none opacity-45">
          <svg viewBox="0 0 800 1000" preserveAspectRatio="none" className="w-full h-full">
            <polygon points="500,0 680,60 800,0" fill="#E8EEFF" stroke="#D3E0FF" strokeWidth="0.75" />
            <polygon points="500,0 680,60 560,140" fill="#F0F4FF" stroke="#D3E0FF" strokeWidth="0.75" />
            <polygon points="680,60 800,0 800,120" fill="#D8E4FF" stroke="#C0D3FF" strokeWidth="0.75" />
            <polygon points="680,60 800,120 720,200" fill="#E2ECFF" stroke="#D3E0FF" strokeWidth="0.75" />
            <polygon points="560,140 680,60 720,200" fill="#CCE0FF" stroke="#BACDFF" strokeWidth="0.75" />
            <polygon points="560,140 720,200 620,260" fill="#BACDFF" stroke="#9AB9FF" strokeWidth="0.75" />
            <polygon points="720,200 800,120 800,280" fill="#D8E4FF" stroke="#BACDFF" strokeWidth="0.75" />
            <polygon points="720,200 800,280 760,340" fill="#BFD5FF" stroke="#9AB9FF" strokeWidth="0.75" />
            <polygon points="350,1000 500,880 420,780" fill="#EBF0FF" stroke="#D1DEFF" strokeWidth="0.75" />
            <polygon points="500,880 650,920 420,780" fill="#DCE6FF" stroke="#BACDFF" strokeWidth="0.75" />
            <polygon points="420,780 580,720 500,640" fill="#E4ECFF" stroke="#D1DEFF" strokeWidth="0.75" />
            <polygon points="420,780 500,880 580,720" fill="#BACDFF" stroke="#9AB9FF" strokeWidth="0.75" />
            <polygon points="580,720 700,800 500,880" fill="#A8C4FF" stroke="#87B0FF" strokeWidth="0.75" />
            <polygon points="580,720 740,680 700,800" fill="#C5D8FF" stroke="#A8C4FF" strokeWidth="0.75" />
            <polygon points="500,640 580,720 740,680" fill="#DCE6FF" stroke="#BACDFF" strokeWidth="0.75" />
            <polygon points="500,880 650,920 620,1000" fill="#A8C4FF" stroke="#87B0FF" strokeWidth="0.75" />
            <polygon points="650,920 700,800 790,880" fill="#8CB2FF" stroke="#6699FF" strokeWidth="0.75" />
            <polygon points="650,920 790,880 620,1000" fill="#BACDFF" stroke="#9AB9FF" strokeWidth="0.75" />
            <polygon points="700,800 740,680 800,750" fill="#B2CCFF" stroke="#8CB2FF" strokeWidth="0.75" />
            <polygon points="700,800 800,750 790,880" fill="#9AB9FF" stroke="#75A3FF" strokeWidth="0.75" />
            <polygon points="740,680 800,560 800,750" fill="#D8E4FF" stroke="#BACDFF" strokeWidth="0.75" />
            <polygon points="790,880 800,750 800,1000" fill="#A8C4FF" stroke="#8CB2FF" strokeWidth="0.75" />
            <polygon points="620,1000 790,880 800,1000" fill="#8CB2FF" stroke="#6699FF" strokeWidth="0.75" />
          </svg>
        </div>

        {/* Brand Header */}
        <div className="relative z-10 flex items-center gap-2.5">
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
        </div>

        {/* Hero Section */}
        <div className="relative z-10 max-w-lg space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-[#0038FF] text-xs font-semibold uppercase tracking-wider">
              Platform Overview
            </div>
            <h1 className="text-4xl xl:text-5xl font-extrabold tracking-tight text-neutral-950 leading-[1.15]">
              Structured paths for <span className="text-[#0038FF]">intentional</span> career growth.
            </h1>
            <p className="text-neutral-600 text-base leading-relaxed">
              Accelerate your trajectory with real-time competency benchmarks and customized role transitions.
            </p>
          </div>

          {/* Feature List */}
          <div className="space-y-3.5 border-t border-neutral-200/80 pt-8">
            {CAPABILITIES.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3.5 text-sm font-medium text-neutral-700">
                <span className="h-5 w-5 rounded-full bg-[#0038FF]/10 text-[#0038FF] flex items-center justify-center shrink-0">
                  <FiCheck size={12} strokeWidth={3} />
                </span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 flex items-center gap-2 text-xs font-mono text-neutral-500">
          <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block" />
          <span>All systems operational</span>
        </div>
      </div>

      {/* ── Right panel: Elevated Interactive Workspace ── */}
      <div className="flex-1 flex flex-col justify-between p-6 sm:p-12 lg:p-16 bg-white">
        
        {/* Mobile-only logo */}
        <div className="lg:hidden flex items-center gap-2.5 mb-6">
          <div className="h-8 w-8 bg-neutral-950 rounded-lg flex items-center justify-center shadow-sm">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <polygon points="12,2 22,8.5 12,15 2,8.5" fill="#0038FF" />
              <polygon points="2,8.5 12,15 12,22 2,15.5" fill="#002299" />
              <polygon points="22,8.5 12,15 12,22 22,15.5" fill="#3366FF" />
            </svg>
          </div>
          <span className="text-base font-bold tracking-tight text-neutral-900 uppercase">CareerAI</span>
        </div>

        <div className="w-full max-w-md mx-auto my-auto space-y-6">
          
          {/* Crisp Elevated Card Container */}
          <div className="bg-white border border-neutral-200 rounded-2xl p-8 sm:p-10 shadow-xl shadow-neutral-100">
            
            {/* Header */}
            <div className="space-y-1.5 mb-6">
              <h2 className="text-2xl font-bold tracking-tight text-neutral-950">
                Sign in to your account
              </h2>
              <p className="text-xs text-neutral-500">
                Enter your credentials or authenticate via enterprise SSO.
              </p>
            </div>

            {/* SSO Action Row */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <button
                type="button"
                className="flex items-center justify-center gap-2.5 px-3 py-2 border border-neutral-200 rounded-lg text-xs font-semibold text-neutral-700 hover:bg-neutral-50 hover:border-neutral-300 transition-all shadow-2xs"
              >
                <svg width="15" height="15" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Google</span>
              </button>
              <button
                type="button"
                className="flex items-center justify-center gap-2 px-3 py-2 border border-neutral-200 rounded-lg text-xs font-semibold text-neutral-700 hover:bg-neutral-50 hover:border-neutral-300 transition-all shadow-2xs"
              >
                <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
                <span>GitHub</span>
              </button>
            </div>

            {/* Segment Divider */}
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-200" />
              </div>
              <div className="relative flex justify-center text-[11px] uppercase tracking-wider font-mono">
                <span className="bg-white px-3 text-neutral-400">or continue with email</span>
              </div>
            </div>

            {error && <Alert variant="error" className="mb-5">{error}</Alert>}

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {/* Replace the Email Block inside LoginPage.jsx */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider" htmlFor="login-email">
                Email
              </label>
              <div className="relative">
                <FiMail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
                <input
                  id="login-email"
                  name="email"
                  type="email"
                  placeholder="student@gmail.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                  className={`${inputCls} pl-10`}
                />
              </div>
            </div>

              {/* Password Field */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider" htmlFor="login-password">
                    Password
                  </label>
                  <Link to="/forgot-password" className="text-xs font-semibold text-[#0038FF] hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <FiLock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
                  <input
                    id="login-password"
                    name="password"
                    type={showPwd ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={form.password}
                    onChange={handleChange}
                    required
                    autoComplete="current-password"
                    className={`${inputCls} pl-10 pr-10`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd((v) => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 transition-colors flex items-center justify-center p-1"
                    aria-label={showPwd ? 'Hide password' : 'Show password'}
                  >
                    {showPwd ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                  </button>
                </div>
              </div>

              {/* Remember Checkbox */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  id="remember"
                  name="remember"
                  type="checkbox"
                  checked={form.remember}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-neutral-300 text-[#0038FF] focus:ring-[#0038FF] accent-[#0038FF]"
                />
                <label htmlFor="remember" className="text-xs text-neutral-600 select-none cursor-pointer">
                  Remember this device for 30 days
                </label>
              </div>

              {/* Primary Action Button */}
              <Button
                type="submit"
                size="lg"
                loading={loading}
                className="w-full bg-[#0038FF] hover:bg-blue-700 active:scale-[0.99] text-white rounded-lg text-sm font-semibold py-3 transition-all flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 mt-2"
              >
                <span>{loading ? 'Signing in…' : 'Sign in to workspace'}</span>
                {!loading && <FiArrowRight size={16} />}
              </Button>
            </form>

            {/* Bottom Register Prompt */}
            <div className="border-t border-neutral-100 mt-6 pt-5 text-center">
              <p className="text-xs text-neutral-600">
                Don't have an account?{' '}
                <Link to="/register" className="font-semibold text-[#0038FF] hover:underline">
                  Create an account
                </Link>
              </p>
            </div>
          </div>

          {/* Trust & Security Tag */}
          <div className="flex items-center justify-center gap-1.5 text-xs text-neutral-400">
            <FiShield size={13} className="text-neutral-400" />
            <span>End-to-end encrypted 256-bit SSL session</span>
          </div>

        </div>

        {/* Muted Legal Footer */}
        <div className="text-center text-[11px] text-neutral-400 font-mono">
          © 2026 CareerAI Inc. · Privacy & Terms
        </div>
      </div>
    </div>
  );
}
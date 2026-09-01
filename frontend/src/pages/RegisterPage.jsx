import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FiUser, FiMail, FiLock, FiPhone, FiMapPin, FiEye, FiEyeOff, 
  FiBriefcase, FiArrowRight, FiCheck, FiShield, FiBookOpen, FiAward 
} from 'react-icons/fi';
import api from '../services/api';
import { Button, Alert } from '../components/ui';

const STATS = [
  { num: '10,000+', label: 'Students actively guided' },
  { num: '95.4%',  label: 'Verified career match accuracy' },
  { num: '500+',   label: 'Structured skill pathways mapped' },
];

export default function RegisterPage() {
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', password: '',
    phone: '', gender: '', dob: '', educationLevel: '',
    collegeName: '', cgpa: '', location: '',
  });
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError(''); setSuccess('');
    try {
      await api.post('/api/auth/register', form);
      setSuccess('Account created successfully! Redirecting to login…');
      setTimeout(() => navigate('/login'), 1600);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputCls =
    'w-full border border-neutral-200 rounded-lg px-3.5 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 bg-white hover:border-neutral-300 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#0038FF] transition-all shadow-2xs';
  const labelCls = 'block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5';

  return (
    <div className="min-h-screen flex bg-white text-neutral-900 antialiased selection:bg-[#0038FF] selection:text-white">
      {/* ── Left panel: Editorial Showcase with Low-Poly Background ── */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#F8FAFC] border-r border-neutral-200 flex-col justify-between p-16 xl:p-20 relative overflow-hidden sticky top-0 h-screen">
        
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
              Onboarding
            </div>
            <h1 className="text-4xl xl:text-5xl font-extrabold tracking-tight text-neutral-950 leading-[1.15]">
              Begin your structured <span className="text-[#0038FF]">development</span> journey.
            </h1>
            <p className="text-neutral-600 text-base leading-relaxed">
              Join thousands of engineers and learners building verified, data-backed career paths.
            </p>
          </div>

          {/* Metric Stats */}
          <div className="space-y-3 border-t border-neutral-200/80 pt-8">
            {STATS.map((s, idx) => (
              <div key={idx} className="flex items-center gap-4 bg-white/70 backdrop-blur-xs border border-neutral-200/80 rounded-xl px-4 py-3 shadow-2xs">
                <span className="text-lg font-extrabold text-neutral-950 font-mono">{s.num}</span>
                <span className="text-xs font-medium text-neutral-600">{s.label}</span>
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

      {/* ── Right panel: Registration Form ── */}
      <div className="flex-1 flex flex-col justify-between p-6 sm:p-12 lg:p-16 bg-white overflow-y-auto">
        
        {/* Mobile-only brand header */}
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

        <div className="w-full max-w-xl mx-auto my-auto space-y-6 py-4">
          
          {/* Main Elevated Card Container */}
          <div className="bg-white border border-neutral-200 rounded-2xl p-8 sm:p-10 shadow-xl shadow-neutral-100">
            
            {/* Header */}
            <div className="space-y-1.5 mb-6">
              <h2 className="text-2xl font-bold tracking-tight text-neutral-950">
                Create your account
              </h2>
              <p className="text-xs text-neutral-500">
                Provide your profile details to initialize your personalized curriculum.
              </p>
            </div>

            {/* Mentor Callout Banner */}
            <Link
              to="/mentor/signup"
              className="mb-6 flex items-center justify-between gap-4 rounded-xl border border-neutral-200 bg-neutral-50/70 p-3.5 text-left transition-all hover:border-[#0038FF]/40 hover:bg-[#0038FF]/5 group"
            >
              <span className="flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-neutral-950 text-white shadow-2xs group-hover:bg-[#0038FF] transition-colors">
                  <FiBriefcase size={16} />
                </span>
                <span>
                  <span className="block text-xs font-bold text-neutral-900">Want to guide students?</span>
                  <span className="block text-[11px] text-neutral-500">Apply to become a verified mentor.</span>
                </span>
              </span>
              <span className="text-xs font-semibold text-[#0038FF] flex items-center gap-1 group-hover:underline">
                Apply now <FiArrowRight size={13} />
              </span>
            </Link>

            {error   && <Alert variant="error"   className="mb-5">{error}</Alert>}
            {success && <Alert variant="success" className="mb-5">{success}</Alert>}

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {/* Name row */}
              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className={labelCls} htmlFor="r-fn">First name</label>
                  <div className="relative">
                    <FiUser size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
                    <input id="r-fn" name="firstName" placeholder="Jane" value={form.firstName} onChange={handleChange} required className={`${inputCls} pl-9`} />
                  </div>
                </div>
                <div>
                  <label className={labelCls} htmlFor="r-ln">Last name</label>
                  <input id="r-ln" name="lastName" placeholder="Doe" value={form.lastName} onChange={handleChange} required className={inputCls} />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className={labelCls} htmlFor="r-email">Email</label>
                <div className="relative">
                  <FiMail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
                  <input id="r-email" name="email" type="email" placeholder="jane.doe@gmail.com" value={form.email} onChange={handleChange} required autoComplete="email" className={`${inputCls} pl-9`} />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className={labelCls} htmlFor="r-pwd">Password</label>
                <div className="relative">
                  <FiLock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
                  <input id="r-pwd" name="password" type={showPwd ? 'text' : 'password'} placeholder="Min. 8 characters" value={form.password} onChange={handleChange} required autoComplete="new-password" className={`${inputCls} pl-9 pr-10`} />
                  <button type="button" onClick={() => setShowPwd(v => !v)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 transition-colors flex items-center justify-center p-1" aria-label={showPwd ? 'Hide' : 'Show'}>
                    {showPwd ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                  </button>
                </div>
              </div>

              {/* Phone + Gender */}
              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className={labelCls} htmlFor="r-phone">Phone</label>
                  <div className="relative">
                    <FiPhone size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
                    <input id="r-phone" name="phone" placeholder="+1 (555) 000-0000" value={form.phone} onChange={handleChange} className={`${inputCls} pl-9`} />
                  </div>
                </div>
                <div>
                  <label className={labelCls} htmlFor="r-gender">Gender</label>
                  <select id="r-gender" name="gender" value={form.gender} onChange={handleChange} className={inputCls}>
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* DOB + Location */}
              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className={labelCls} htmlFor="r-dob">Date of birth</label>
                  <input id="r-dob" name="dob" type="date" value={form.dob} onChange={handleChange} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls} htmlFor="r-loc">Location</label>
                  <div className="relative">
                    <FiMapPin size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
                    <input id="r-loc" name="location" placeholder="City, Country" value={form.location} onChange={handleChange} className={`${inputCls} pl-9`} />
                  </div>
                </div>
              </div>

              {/* College + Education */}
              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className={labelCls} htmlFor="r-college">Institution</label>
                  <div className="relative">
                    <FiBookOpen size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
                    <input id="r-college" name="collegeName" placeholder="University / College" value={form.collegeName} onChange={handleChange} className={`${inputCls} pl-9`} />
                  </div>
                </div>
                <div>
                  <label className={labelCls} htmlFor="r-edu">Education level</label>
                  <select id="r-edu" name="educationLevel" value={form.educationLevel} onChange={handleChange} className={inputCls}>
                    <option value="">Select degree</option>
                    <option value="BE">BE / B.Tech</option>
                    <option value="ME">ME / M.Tech</option>
                    <option value="BSc">BSc / BS</option>
                    <option value="MSc">MSc / MS</option>
                    <option value="MBA">MBA</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* CGPA */}
              <div>
                <label className={labelCls} htmlFor="r-cgpa">Cumulative GPA / Score</label>
                <div className="relative">
                  <FiAward size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
                  <input id="r-cgpa" name="cgpa" type="number" step="0.01" min="0" max="10" placeholder="e.g. 8.75" value={form.cgpa} onChange={handleChange} className={`${inputCls} pl-9`} />
                </div>
              </div>

              {/* Primary Action Button */}
              <Button
                type="submit"
                size="lg"
                loading={loading}
                className="w-full bg-[#0038FF] hover:bg-blue-700 active:scale-[0.99] text-white rounded-lg text-sm font-semibold py-3 transition-all flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 mt-3"
              >
                <span>{loading ? 'Creating account…' : 'Create account & continue'}</span>
                {!loading && <FiArrowRight size={16} />}
              </Button>
            </form>

            {/* Login Prompt Footer */}
            <div className="border-t border-neutral-100 mt-6 pt-5 text-center">
              <p className="text-xs text-neutral-600">
                Already have an account?{' '}
                <Link to="/login" className="font-semibold text-[#0038FF] hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </div>

          {/* Trust Tag */}
          <div className="flex items-center justify-center gap-1.5 text-xs text-neutral-400">
            <FiShield size={13} className="text-neutral-400" />
            <span>Encrypted data transmission · Zero telemetry sharing</span>
          </div>

        </div>

        {/* Footer */}
        <div className="text-center text-[11px] text-neutral-400 font-mono py-2">
          © 2026 CareerAI Inc. · Privacy & Terms
        </div>
      </div>
    </div>
  );
}
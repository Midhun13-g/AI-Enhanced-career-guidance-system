import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi2';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Button, Alert } from '../components/ui';

const FEATURES = [
  { icon: '🎯', text: 'AI-powered career matching' },
  { icon: '📊', text: 'Real-time skill gap analysis' },
  { icon: '🗺️', text: 'Personalised learning roadmap' },
  { icon: '💼', text: 'Live job market insights' },
];

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/api/auth/login', form);
      login({ id: res.data.id, email: res.data.email, firstName: res.data.firstName, lastName: res.data.lastName, roles: res.data.roles }, res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputCls = 'w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200';

  return (
    <div className="min-h-screen flex">
      {/* ── Left panel ── */}
      <div className="hidden lg:flex lg:w-[52%] relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700">
        <div className="absolute -top-32 -left-20 w-96 h-96 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-20 -right-16 w-80 h-80 rounded-full bg-teal-400/20 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-indigo-500/10 blur-3xl" />

        <div className="relative z-10 flex flex-col justify-between p-14 text-white w-full">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center">
              <HiSparkles size={20} />
            </div>
            <span className="text-xl font-bold tracking-tight">CareerAI</span>
          </div>

          {/* Centre */}
          <div className="space-y-10">
            {/* Floating AI orb */}
            <div className="flex justify-center">
              <motion.div
                animate={{ y: [0, -14, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
                className="relative"
              >
                <div className="w-52 h-52 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-2xl">
                  <div className="w-36 h-36 rounded-full bg-white/20 border border-white/30 flex items-center justify-center">
                    <HiSparkles size={60} className="text-white drop-shadow-lg" />
                  </div>
                </div>
                {[0, 72, 144, 216, 288].map((deg, i) => (
                  <motion.div key={i}
                    className="absolute w-3 h-3 rounded-full bg-white/70"
                    style={{ top: `${50 + 50 * Math.sin((deg * Math.PI) / 180)}%`, left: `${50 + 50 * Math.cos((deg * Math.PI) / 180)}%`, transform: 'translate(-50%,-50%)' }}
                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.4 }}
                  />
                ))}
              </motion.div>
            </div>

            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }}>
              <h2 className="text-4xl font-extrabold leading-tight tracking-tight">
                Your AI-Powered<br />Career Navigator
              </h2>
              <p className="text-blue-100 mt-3 text-lg leading-relaxed">
                Discover your perfect career path with intelligent guidance tailored just for you.
              </p>
            </motion.div>

            <div className="space-y-3">
              {FEATURES.map((f, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.45 + i * 0.1 }}
                  className="flex items-center gap-3.5 bg-white/10 backdrop-blur-sm rounded-2xl px-5 py-3.5 border border-white/10"
                >
                  <span className="text-xl">{f.icon}</span>
                  <span className="text-sm font-medium text-blue-50">{f.text}</span>
                </motion.div>
              ))}
            </div>
          </div>

          <p className="text-blue-300 text-sm">© 2025 CareerAI · All rights reserved.</p>
        </div>
      </div>

      {/* ── Right panel ── */}
      <div className="flex-1 flex items-center justify-center p-6 bg-slate-50">
        <motion.div
          initial={{ opacity: 0, x: 32 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-200">
              <HiSparkles className="text-white" size={17} />
            </div>
            <span className="text-xl font-bold text-slate-900">Career<span className="text-blue-600">AI</span></span>
          </div>

          <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 sm:p-10">
            <div className="mb-8">
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Welcome back 👋</h1>
              <p className="text-slate-500 mt-1.5 text-sm">Sign in to continue your career journey</p>
            </div>

            {error && <Alert variant="error" className="mb-6">{error}</Alert>}

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5" htmlFor="login-email">Email address</label>
                <div className="relative">
                  <FiMail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input id="login-email" name="email" type="email" placeholder="you@example.com" value={form.email} onChange={handleChange} required autoComplete="email" className={`${inputCls} pl-10`} />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-sm font-medium text-slate-700" htmlFor="login-password">Password</label>
                  <Link to="/forgot-password" className="text-xs text-blue-600 hover:text-blue-700 font-semibold transition-colors">Forgot password?</Link>
                </div>
                <div className="relative">
                  <FiLock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input id="login-password" name="password" type={showPwd ? 'text' : 'password'} placeholder="Enter your password" value={form.password} onChange={handleChange} required autoComplete="current-password" className={`${inputCls} pl-10 pr-11`} />
                  <button type="button" onClick={() => setShowPwd(v => !v)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors" aria-label={showPwd ? 'Hide password' : 'Show password'}>
                    {showPwd ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                  </button>
                </div>
              </div>

              <Button type="submit" variant="gradient" size="lg" loading={loading} className="w-full mt-1">
                {loading ? 'Signing in…' : 'Sign In'}
              </Button>
            </form>

            <p className="mt-7 text-center text-sm text-slate-500">
              Don't have an account?{' '}
              <Link to="/register" className="text-blue-600 font-semibold hover:text-blue-700 transition-colors">Create one free →</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

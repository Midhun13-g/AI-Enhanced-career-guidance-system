import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiLock, FiEye, FiEyeOff, FiArrowLeft, FiCheckCircle } from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi2';
import { Button, Alert } from '../components/ui';

export default function ResetPasswordPage() {
  const [form, setForm]       = useState({ password: '', confirm: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone]       = useState(false);
  const [error, setError]     = useState('');
  const [searchParams]        = useSearchParams();
  const navigate              = useNavigate();

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) { setError('Passwords do not match.'); return; }
    if (form.password.length < 8)       { setError('Password must be at least 8 characters.'); return; }
    setLoading(true); setError('');
    // Wire to real API: api.post('/api/auth/reset-password', { token: searchParams.get('token'), password: form.password })
    await new Promise(r => setTimeout(r, 1200));
    setDone(true);
    setLoading(false);
    setTimeout(() => navigate('/login'), 2500);
  };

  const ic = 'w-full border border-slate-200 rounded-xl pl-10 pr-11 py-3 text-sm text-slate-900 placeholder-slate-400 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/40 to-indigo-50/40 p-6 relative overflow-hidden">
      <div className="absolute -top-32 -right-20 w-96 h-96 rounded-full bg-blue-100/50 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-16 w-80 h-80 rounded-full bg-indigo-100/50 blur-3xl pointer-events-none" />

      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="relative w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Link to="/login" className="flex items-center gap-2.5">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-200">
              <HiSparkles className="text-white" size={20} />
            </div>
            <span className="text-xl font-bold text-slate-900">Career<span className="text-blue-600">AI</span></span>
          </Link>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 sm:p-10">
          {!done ? (
            <>
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 mb-4">
                  <FiLock className="text-indigo-600" size={28} />
                </div>
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Set new password</h1>
                <p className="text-slate-500 mt-2 text-sm">Must be at least 8 characters long.</p>
              </div>

              {error && <Alert variant="error" className="mb-5">{error}</Alert>}

              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5" htmlFor="rp-pwd">New password</label>
                  <div className="relative">
                    <FiLock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <input id="rp-pwd" name="password" type={showPwd ? 'text' : 'password'} placeholder="Enter new password" value={form.password} onChange={handleChange} required className={ic} />
                    <button type="button" onClick={() => setShowPwd(v => !v)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                      {showPwd ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5" htmlFor="rp-confirm">Confirm password</label>
                  <div className="relative">
                    <FiLock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <input id="rp-confirm" name="confirm" type={showPwd ? 'text' : 'password'} placeholder="Confirm new password" value={form.confirm} onChange={handleChange} required className={ic} />
                  </div>
                </div>
                <Button type="submit" variant="gradient" size="lg" loading={loading} className="w-full">
                  {loading ? 'Resetting…' : 'Reset Password'}
                </Button>
              </form>
            </>
          ) : (
            <motion.div initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-4">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 280, damping: 20, delay: 0.1 }}
                className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-100 mb-4">
                <FiCheckCircle className="text-emerald-600" size={30} />
              </motion.div>
              <h2 className="text-xl font-extrabold text-slate-900">Password reset!</h2>
              <p className="text-slate-500 mt-2 text-sm">Redirecting you to sign in…</p>
            </motion.div>
          )}

          <div className="mt-7 text-center">
            <Link to="/login" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600 transition-colors font-medium">
              <FiArrowLeft size={14} />Back to sign in
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

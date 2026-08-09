import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiLock, FiPhone, FiMapPin, FiEye, FiEyeOff, FiBriefcase } from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi2';
import api from '../services/api';
import { Button, Alert } from '../components/ui';

const STATS = [
  { num: '10K+', label: 'Students guided' },
  { num: '95%',  label: 'Career match accuracy' },
  { num: '500+', label: 'Career paths mapped' },
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
      setSuccess('Account created! Redirecting to login…');
      setTimeout(() => navigate('/login'), 1600);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const ic = 'w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200';
  const lbl = 'block text-sm font-medium text-slate-700 mb-1.5';

  return (
    <div className="min-h-screen flex">
      {/* ── Left panel ── */}
      <div className="hidden lg:flex lg:w-[42%] relative overflow-hidden bg-gradient-to-br from-indigo-600 via-blue-600 to-teal-500">
        <div className="absolute -top-24 -right-16 w-96 h-96 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 w-80 h-80 rounded-full bg-blue-300/20 blur-3xl" />

        <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center">
              <HiSparkles size={20} />
            </div>
            <span className="text-xl font-bold">CareerAI</span>
          </div>

          <div className="space-y-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <h2 className="text-3xl font-extrabold leading-tight tracking-tight">
                Start Your AI Career Journey Today
              </h2>
              <p className="text-blue-100 mt-3 leading-relaxed">
                Join thousands of students who found their dream career with intelligent AI guidance.
              </p>
            </motion.div>

            <div className="space-y-4">
              {STATS.map((s, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.12 }}
                  className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-2xl px-5 py-4 border border-white/10"
                >
                  <span className="text-2xl font-extrabold">{s.num}</span>
                  <span className="text-blue-100 text-sm">{s.label}</span>
                </motion.div>
              ))}
            </div>
          </div>

          <p className="text-blue-300 text-sm">© 2025 CareerAI · All rights reserved.</p>
        </div>
      </div>

      {/* ── Right panel ── */}
      <div className="flex-1 flex items-start justify-center p-6 bg-slate-50 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, x: 28 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45 }}
          className="w-full max-w-xl py-8"
        >
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-200">
              <HiSparkles className="text-white" size={17} />
            </div>
            <span className="text-xl font-bold text-slate-900">Career<span className="text-blue-600">AI</span></span>
          </div>

            <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 sm:p-10">
              <div className="mb-7">
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Create your account</h1>
                <p className="text-slate-500 mt-1.5 text-sm">Fill in your details to get started for free</p>
              </div>

              <Link
                to="/mentor/signup"
                className="mb-6 flex items-center justify-between gap-4 rounded-2xl border border-teal-200 bg-teal-50 p-4 text-left transition-colors hover:border-teal-400 hover:bg-teal-100"
              >
                <span className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-teal-600 text-white"><FiBriefcase size={18} /></span>
                  <span>
                    <span className="block text-sm font-bold text-slate-900">Want to guide students?</span>
                    <span className="block text-xs text-slate-600">Apply to become a verified mentor.</span>
                  </span>
                </span>
                <span className="text-sm font-bold text-teal-700">Become a mentor →</span>
              </Link>

              {error   && <Alert variant="error"   className="mb-5">{error}</Alert>}
            {success && <Alert variant="success" className="mb-5">{success}</Alert>}

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {/* Name row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={lbl} htmlFor="r-fn">First name</label>
                  <div className="relative">
                    <FiUser size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <input id="r-fn" name="firstName" placeholder="John" value={form.firstName} onChange={handleChange} required className={`${ic} pl-9`} />
                  </div>
                </div>
                <div>
                  <label className={lbl} htmlFor="r-ln">Last name</label>
                  <input id="r-ln" name="lastName" placeholder="Doe" value={form.lastName} onChange={handleChange} required className={ic} />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className={lbl} htmlFor="r-email">Email address</label>
                <div className="relative">
                  <FiMail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input id="r-email" name="email" type="email" placeholder="you@example.com" value={form.email} onChange={handleChange} required autoComplete="email" className={`${ic} pl-9`} />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className={lbl} htmlFor="r-pwd">Password</label>
                <div className="relative">
                  <FiLock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input id="r-pwd" name="password" type={showPwd ? 'text' : 'password'} placeholder="Min. 8 characters" value={form.password} onChange={handleChange} required autoComplete="new-password" className={`${ic} pl-9 pr-11`} />
                  <button type="button" onClick={() => setShowPwd(v => !v)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors" aria-label={showPwd ? 'Hide' : 'Show'}>
                    {showPwd ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                  </button>
                </div>
              </div>

              {/* Phone + Gender */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={lbl} htmlFor="r-phone">Phone</label>
                  <div className="relative">
                    <FiPhone size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <input id="r-phone" name="phone" placeholder="+91 XXXXX XXXXX" value={form.phone} onChange={handleChange} className={`${ic} pl-9`} />
                  </div>
                </div>
                <div>
                  <label className={lbl} htmlFor="r-gender">Gender</label>
                  <select id="r-gender" name="gender" value={form.gender} onChange={handleChange} className={ic}>
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* DOB + Location */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={lbl} htmlFor="r-dob">Date of birth</label>
                  <input id="r-dob" name="dob" type="date" value={form.dob} onChange={handleChange} className={ic} />
                </div>
                <div>
                  <label className={lbl} htmlFor="r-loc">Location</label>
                  <div className="relative">
                    <FiMapPin size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <input id="r-loc" name="location" placeholder="City, State" value={form.location} onChange={handleChange} className={`${ic} pl-9`} />
                  </div>
                </div>
              </div>

              {/* College + Education */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={lbl} htmlFor="r-college">College name</label>
                  <input id="r-college" name="collegeName" placeholder="Your college" value={form.collegeName} onChange={handleChange} className={ic} />
                </div>
                <div>
                  <label className={lbl} htmlFor="r-edu">Education level</label>
                  <select id="r-edu" name="educationLevel" value={form.educationLevel} onChange={handleChange} className={ic}>
                    <option value="">Select</option>
                    <option value="BE">BE / B.Tech</option>
                    <option value="ME">ME / M.Tech</option>
                    <option value="BSc">BSc</option>
                    <option value="MSc">MSc</option>
                    <option value="MBA">MBA</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* CGPA */}
              <div>
                <label className={lbl} htmlFor="r-cgpa">CGPA</label>
                <input id="r-cgpa" name="cgpa" type="number" step="0.01" min="0" max="10" placeholder="e.g. 8.5" value={form.cgpa} onChange={handleChange} className={ic} />
              </div>

              <Button type="submit" variant="gradient" size="lg" loading={loading} className="w-full mt-2">
                {loading ? 'Creating account…' : 'Create Account'}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 font-semibold hover:text-blue-700 transition-colors">Sign in →</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FiArrowLeft, FiBriefcase, FiCheckCircle, FiExternalLink, 
  FiGithub, FiLinkedin, FiGlobe, FiLock, FiMail, FiPhone, 
  FiUser, FiShield, FiFileText, FiClock 
} from 'react-icons/fi';
import api from '../services/api';
import { Alert, Button } from '../components/ui';

const requiredDocuments = [
  ['governmentId', 'Government ID', 'Passport, National ID, or Driver License share link'],
  ['professionalId', 'Professional / Work ID', 'Company ID badge, offer letter, or work verification link'],
  ['resume', 'Curriculum Vitae / Resume', 'Updated PDF resume link with public view access'],
];

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

export default function MentorSignupPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: '', email: '', password: '', confirmPassword: '',
    phone: '', company: '', jobTitle: '', experienceYears: '',
    expertise: '', bio: '', linkedinUrl: '', githubUrl: '', portfolioUrl: ''
  });
  const [documentLinks, setDocumentLinks] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const change = (e) =>
    setForm((current) => ({ ...current, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) {
      return setError('Passwords do not match.');
    }
    if (!requiredDocuments.every(([key]) => documentLinks[key]?.trim())) {
      return setError('Please provide a Google Drive share link for all three required verification documents.');
    }
    setLoading(true);
    try {
      const documents = requiredDocuments.map(([documentType]) => ({
        documentType,
        fileUrl: documentLinks[documentType].trim()
      }));
      const { confirmPassword, ...payload } = form;
      await api.post('/api/auth/register/mentor', {
        ...payload,
        experienceYears: Number(payload.experienceYears),
        documents
      });
      navigate('/login', {
        state: { message: 'Your mentor application was sent to the administration team. You can sign in once verified.' }
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to submit your application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputCls =
    'w-full border border-neutral-200 rounded-lg px-3.5 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 bg-white hover:border-neutral-300 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#0038FF] transition-all shadow-2xs';

  return (
    <main className="min-h-screen bg-[#F8FAFC] text-neutral-900 px-4 py-8 sm:px-6 lg:py-12 relative overflow-hidden antialiased selection:bg-[#0038FF] selection:text-white">
      
      {/* Ambient Low-Poly Faceted Vector Background */}
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

      <div className="mx-auto max-w-4xl relative z-10 space-y-6">
        
        {/* Top Header & Breadcrumb */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <BrandLogo />
          <Link
            to="/register"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-600 hover:text-[#0038FF] transition-colors"
          >
            <FiArrowLeft size={14} /> Back to student registration
          </Link>
        </div>

        {/* Main Application Container */}
        <div className="bg-white border border-neutral-200 rounded-2xl shadow-xl shadow-neutral-100 overflow-hidden">
          
          {/* Header Banner */}
          <div className="border-b border-neutral-200 bg-white p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <div className="h-11 w-11 shrink-0 rounded-xl bg-blue-50 border border-blue-100 text-[#0038FF] flex items-center justify-center shadow-2xs">
                <FiBriefcase size={20} />
              </div>
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-blue-50 text-[#0038FF] text-[10px] font-bold uppercase tracking-wider font-mono">
                  Advisor Portal
                </div>
                <h1 className="text-2xl font-extrabold tracking-tight text-neutral-950">
                  Apply as a Career Mentor
                </h1>
                <p className="text-xs text-neutral-500 max-w-2xl leading-relaxed">
                  Join our verified industry mentor network. Submit your professional profile and credentials for administrative review.
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={submit} className="p-6 sm:p-8 space-y-8" noValidate>
            {error && <Alert variant="error">{error}</Alert>}

            {/* Section 1: Personal Details */}
            <section className="space-y-4">
              <div>
                <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-900">
                  1. Contact Information
                </h2>
                <p className="text-xs text-neutral-500">How students and admins can identify and reach you.</p>
              </div>
              <div className="grid gap-3.5 sm:grid-cols-2">
                <Field label="Full Name" icon={<FiUser />}>
                  <input
                    className={`${inputCls} pl-9`}
                    name="fullName"
                    value={form.fullName}
                    onChange={change}
                    required
                    placeholder="e.g. Dr. Sarah Jenkins"
                  />
                </Field>
                <Field label="Work / Professional Email" icon={<FiMail />}>
                  <input
                    className={`${inputCls} pl-9`}
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={change}
                    required
                    placeholder="sarah.jenkins@company.com"
                  />
                </Field>
                <Field label="Phone Number" icon={<FiPhone />}>
                  <input
                    className={`${inputCls} pl-9`}
                    name="phone"
                    value={form.phone}
                    onChange={change}
                    placeholder="+1 (555) 000-0000"
                  />
                </Field>
                <Field label="Years of Experience" icon={<FiClock />}>
                  <input
                    className={`${inputCls} pl-9`}
                    name="experienceYears"
                    type="number"
                    min="1"
                    value={form.experienceYears}
                    onChange={change}
                    required
                    placeholder="e.g. 6"
                  />
                </Field>
              </div>
            </section>

            {/* Section 2: Professional Profile */}
            <section className="space-y-4 border-t border-neutral-100 pt-6">
              <div>
                <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-900">
                  2. Professional Background
                </h2>
                <p className="text-xs text-neutral-500">Your current role, organization, and domain competencies.</p>
              </div>
              <div className="grid gap-3.5 sm:grid-cols-2">
                <Field label="Current Company / Organization" icon={<FiBriefcase />}>
                  <input
                    className={`${inputCls} pl-9`}
                    name="company"
                    value={form.company}
                    onChange={change}
                    required
                    placeholder="e.g. Stripe, AWS, Google"
                  />
                </Field>
                <Field label="Job Title">
                  <input
                    className={inputCls}
                    name="jobTitle"
                    value={form.jobTitle}
                    onChange={change}
                    required
                    placeholder="e.g. Staff Systems Architect"
                  />
                </Field>
                <Field label="LinkedIn Profile" icon={<FiLinkedin />}>
                  <input
                    className={`${inputCls} pl-9`}
                    name="linkedinUrl"
                    type="url"
                    value={form.linkedinUrl}
                    onChange={change}
                    placeholder="https://linkedin.com/in/username"
                  />
                </Field>
                <Field label="GitHub Profile" icon={<FiGithub />}>
                  <input
                    className={`${inputCls} pl-9`}
                    name="githubUrl"
                    type="url"
                    value={form.githubUrl}
                    onChange={change}
                    placeholder="https://github.com/username"
                  />
                </Field>
                <Field label="Portfolio / Personal Site" icon={<FiGlobe />}>
                  <input
                    className={`${inputCls} pl-9`}
                    name="portfolioUrl"
                    type="url"
                    value={form.portfolioUrl}
                    onChange={change}
                    placeholder="https://yourportfolio.io"
                  />
                </Field>
                <Field label="Domain Expertise & Core Skills">
                  <input
                    className={inputCls}
                    name="expertise"
                    value={form.expertise}
                    onChange={change}
                    placeholder="Distributed Systems, Cloud Architecture, ML Pipelines"
                  />
                </Field>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                    Mentor Biography <span className="font-normal text-neutral-400 lowercase">(optional)</span>
                  </label>
                  <textarea
                    className={`${inputCls} min-h-[90px] resize-y`}
                    name="bio"
                    value={form.bio}
                    onChange={change}
                    placeholder="Provide a brief summary of your background, industry focus, and how you want to guide students..."
                  />
                </div>
              </div>
            </section>

            {/* Section 3: Verification Documents */}
            <section className="space-y-4 border-t border-neutral-100 pt-6">
              <div>
                <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-900">
                  3. Credential Verification
                </h2>
                <p className="text-xs text-neutral-500">
                  Provide Google Drive share links. Ensure permissions are set to <strong className="text-neutral-700">"Anyone with the link can view"</strong>.
                </p>
              </div>
              <div className="grid gap-3.5 sm:grid-cols-3">
                {requiredDocuments.map(([key, title, help]) => (
                  <DriveLinkInput
                    key={key}
                    title={title}
                    help={help}
                    value={documentLinks[key] || ''}
                    onChange={(value) =>
                      setDocumentLinks((current) => ({ ...current, [key]: value }))
                    }
                  />
                ))}
              </div>
            </section>

            {/* Section 4: Security */}
            <section className="space-y-4 border-t border-neutral-100 pt-6">
              <div>
                <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-900">
                  4. Account Password
                </h2>
                <p className="text-xs text-neutral-500">Set a secure password for your mentor account.</p>
              </div>
              <div className="grid gap-3.5 sm:grid-cols-2">
                <Field label="Password" icon={<FiLock />}>
                  <input
                    className={`${inputCls} pl-9`}
                    name="password"
                    type="password"
                    minLength="8"
                    value={form.password}
                    onChange={change}
                    required
                    placeholder="Min. 8 characters"
                  />
                </Field>
                <Field label="Confirm Password" icon={<FiLock />}>
                  <input
                    className={`${inputCls} pl-9`}
                    name="confirmPassword"
                    type="password"
                    minLength="8"
                    value={form.confirmPassword}
                    onChange={change}
                    required
                    placeholder="Repeat password"
                  />
                </Field>
              </div>
            </section>

            {/* Form Actions */}
            <div className="border-t border-neutral-100 pt-6 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-neutral-500">
                <FiShield className="text-[#0038FF] shrink-0" size={14} />
                <span>Submissions are audited manually before verification.</span>
              </div>
              <Button
                type="submit"
                size="lg"
                loading={loading}
                className="bg-[#0038FF] hover:bg-blue-700 active:scale-[0.99] text-white rounded-lg text-sm font-semibold px-6 py-3 transition-all flex items-center justify-center gap-2 shadow-md shadow-blue-500/20"
              >
                <span>{loading ? 'Submitting…' : 'Submit Application'}</span>
              </Button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center text-[11px] text-neutral-400 font-mono py-2">
          © 2026 CareerAI Inc. · Advisor Verification Protocol
        </div>
      </div>
    </main>
  );
}

function Field({ label, icon, children }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none text-sm">
            {icon}
          </span>
        )}
        {children}
      </div>
    </div>
  );
}

function DriveLinkInput({ title, help, value, onChange }) {
  const isFilled = Boolean(value?.trim());
  return (
    <div
      className={`rounded-xl border p-4 transition-all ${
        isFilled
          ? 'border-[#0038FF]/40 bg-blue-50/30'
          : 'border-dashed border-neutral-200 bg-neutral-50/50 hover:bg-neutral-50'
      }`}
    >
      <div className="flex items-center justify-between">
        <FiFileText className={isFilled ? 'text-[#0038FF]' : 'text-neutral-400'} size={18} />
        {isFilled && (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#0038FF]">
            <FiCheckCircle size={12} /> Ready
          </span>
        )}
      </div>
      <p className="mt-2 text-xs font-bold text-neutral-900">{title}</p>
      <p className="mt-1 text-[11px] text-neutral-500 leading-tight min-h-[28px]">{help}</p>
      <div className="relative mt-3">
        <FiExternalLink className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 text-xs pointer-events-none" />
        <input
          required
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://drive.google.com/..."
          className="w-full rounded-lg border border-neutral-200 bg-white pl-8 pr-3 py-2 text-xs text-neutral-900 placeholder-neutral-400 outline-none focus:border-transparent focus:ring-2 focus:ring-[#0038FF] transition-all shadow-2xs"
        />
      </div>
    </div>
  );
}
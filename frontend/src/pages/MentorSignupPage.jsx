import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiBriefcase, FiCheckCircle, FiFileText, FiGithub, FiLinkedin, FiLock, FiMail, FiPhone, FiUploadCloud, FiUser } from 'react-icons/fi';
import api from '../services/api';
import { Alert, Button } from '../components/ui';

const requiredDocuments = [
  ['governmentId', 'Government ID', 'PDF, JPG or PNG'],
  ['professionalId', 'Professional / company ID', 'PDF, JPG or PNG'],
  ['resume', 'Resume', 'PDF preferred'],
];

export default function MentorSignupPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: '', email: '', password: '', confirmPassword: '', phone: '', company: '', jobTitle: '', experienceYears: '', expertise: '', bio: '', linkedinUrl: '', githubUrl: '', portfolioUrl: '' });
  const [files, setFiles] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const change = event => setForm(current => ({ ...current, [event.target.name]: event.target.value }));

  const submit = async event => {
    event.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) return setError('Passwords do not match.');
    if (!requiredDocuments.every(([key]) => files[key])) return setError('Please upload all three required documents.');
    setLoading(true);
    try {
      const documents = [];
      for (const [documentType, file] of Object.entries(files)) {
        const body = new FormData();
        body.append('file', file);
        const { data } = await api.post('/api/auth/mentor-documents', body);
        documents.push({ documentType, fileUrl: data.fileUrl });
      }
      const { confirmPassword, ...payload } = form;
      await api.post('/api/auth/register/mentor', { ...payload, experienceYears: Number(payload.experienceYears), documents });
      navigate('/login', { state: { message: 'Your mentor application was sent to the admin for review. You can sign in after approval.' } });
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to submit your application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const input = 'w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100';
  const label = 'mb-1.5 block text-sm font-semibold text-slate-700';
  return <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:py-12">
    <div className="mx-auto max-w-5xl">
      <Link to="/register" className="mb-7 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-teal-700"><FiArrowLeft /> Back to student registration</Link>
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60">
        <header className="bg-gradient-to-r from-teal-700 to-cyan-600 px-6 py-8 text-white sm:px-10">
          <div className="flex items-start gap-4"><span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white/15"><FiBriefcase size={23} /></span><div><p className="text-sm font-semibold text-teal-100">MENTOR APPLICATION</p><h1 className="mt-1 text-3xl font-extrabold">Share your experience with students</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-teal-50">Submit your professional profile and documents. Only an administrator can approve or reject mentor access.</p></div></div>
        </header>
        <form onSubmit={submit} className="p-6 sm:p-10">
          {error && <Alert variant="error" className="mb-6">{error}</Alert>}
          <section><h2 className="text-lg font-bold text-slate-900">Your details</h2><p className="mt-1 text-sm text-slate-500">Tell us who you are and how to contact you.</p><div className="mt-5 grid gap-4 md:grid-cols-2">
            <Field label="Full name" icon={<FiUser />}><input className={input} name="fullName" value={form.fullName} onChange={change} required placeholder="Your full name" /></Field>
            <Field label="Email address" icon={<FiMail />}><input className={input} name="email" type="email" value={form.email} onChange={change} required placeholder="you@example.com" /></Field>
            <Field label="Phone number" icon={<FiPhone />}><input className={input} name="phone" value={form.phone} onChange={change} placeholder="+91 XXXXX XXXXX" /></Field>
            <Field label="Years of experience"><input className={input} name="experienceYears" type="number" min="1" value={form.experienceYears} onChange={change} required placeholder="e.g. 5" /></Field>
          </div></section>
          <section className="mt-9 border-t border-slate-100 pt-8"><h2 className="text-lg font-bold text-slate-900">Professional profile</h2><div className="mt-5 grid gap-4 md:grid-cols-2">
            <Field label="Current company"><input className={input} name="company" value={form.company} onChange={change} required placeholder="Company name" /></Field>
            <Field label="Job title"><input className={input} name="jobTitle" value={form.jobTitle} onChange={change} required placeholder="Your role" /></Field>
            <Field label="LinkedIn URL" icon={<FiLinkedin />}><input className={input} name="linkedinUrl" type="url" value={form.linkedinUrl} onChange={change} placeholder="https://linkedin.com/in/..." /></Field>
            <Field label="GitHub URL" icon={<FiGithub />}><input className={input} name="githubUrl" type="url" value={form.githubUrl} onChange={change} placeholder="https://github.com/..." /></Field>
            <Field label="Portfolio URL"><input className={input} name="portfolioUrl" type="url" value={form.portfolioUrl} onChange={change} placeholder="https://yourportfolio.com" /></Field>
            <Field label="Expertise / skills"><input className={input} name="expertise" value={form.expertise} onChange={change} placeholder="Java, product design, data science..." /></Field>
            <div className="md:col-span-2"><label className={label}>Short bio <span className="font-normal text-slate-400">(optional)</span></label><textarea className={`${input} min-h-28 resize-y`} name="bio" value={form.bio} onChange={change} placeholder="Briefly describe your professional background and the areas you can mentor in." /></div>
          </div></section>
          <section className="mt-9 border-t border-slate-100 pt-8"><h2 className="text-lg font-bold text-slate-900">Verification documents</h2><p className="mt-1 text-sm text-slate-500">These documents are visible only to administrators reviewing your application.</p><div className="mt-5 grid gap-4 md:grid-cols-3">{requiredDocuments.map(([key, title, help]) => <DocumentInput key={key} title={title} help={help} file={files[key]} onChange={file => setFiles(current => ({ ...current, [key]: file }))} />)}</div></section>
          <section className="mt-9 border-t border-slate-100 pt-8"><h2 className="text-lg font-bold text-slate-900">Set your password</h2><div className="mt-5 grid gap-4 md:grid-cols-2"><Field label="Password" icon={<FiLock />}><input className={input} name="password" type="password" minLength="8" value={form.password} onChange={change} required placeholder="At least 8 characters" /></Field><Field label="Confirm password" icon={<FiLock />}><input className={input} name="confirmPassword" type="password" minLength="8" value={form.confirmPassword} onChange={change} required placeholder="Repeat password" /></Field></div></section>
          <div className="mt-9 flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:items-center sm:justify-between"><p className="flex items-center gap-2 text-sm text-slate-500"><FiCheckCircle className="text-teal-600" /> Your account remains pending until an admin decides.</p><Button type="submit" variant="gradient" size="lg" loading={loading}>{loading ? 'Sending application…' : 'Send to admin for review'}</Button></div>
        </form>
      </div>
    </div>
  </main>;
}

function Field({ label, icon, children }) { return <div><label className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-slate-700">{icon && <span className="text-teal-600">{icon}</span>}{label}</label>{children}</div>; }
function DocumentInput({ title, help, file, onChange }) { return <label className="group cursor-pointer rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 transition hover:border-teal-500 hover:bg-teal-50"><input hidden type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={event => onChange(event.target.files?.[0])} /><FiUploadCloud className="text-teal-600" size={23} /><p className="mt-3 text-sm font-bold text-slate-800">{file?.name || title}</p><p className="mt-1 text-xs text-slate-500">{file ? 'Ready to submit' : help}</p>{file && <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-emerald-700"><FiFileText /> Uploaded</span>}</label>; }

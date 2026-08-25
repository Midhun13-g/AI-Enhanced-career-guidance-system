import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Save, X } from 'lucide-react';
import AppLayout from '../../components/layout/AppLayout';
import { getResume, updateResume } from '../../services/resumeService';
import { useToast } from '../../context/ToastContext';

const EMPTY_PROFILE = { name: '', email: '', phone: '', location: '', linkedin: '', github: '' };

export default function ResumeEditor() {
  const navigate = useNavigate();
  const toast = useToast();
  const resumeId = sessionStorage.getItem('resumeId');
  const [profile, setProfile] = useState(EMPTY_PROFILE);
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!resumeId) {
      setError('No resume found. Please upload and process a resume first.');
      setLoading(false);
      return;
    }
    getResume(resumeId)
      .then(({ data }) => setSkills(data?.skills ?? []))
      .catch(() => setError('Failed to load the extracted resume profile.'))
      .finally(() => setLoading(false));
  }, [resumeId]);

  const setField = (event) => setProfile({ ...profile, [event.target.name]: event.target.value });
  const addSkill = () => {
    const skill = newSkill.trim();
    if (skill && !skills.includes(skill)) setSkills([...skills, skill]);
    setNewSkill('');
  };

  const save = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      await updateResume(resumeId, { ...profile, skills });
      toast('Extracted profile saved.', 'success');
      navigate('/resume/analysis');
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to save the extracted profile.';
      setError(message);
      toast(message, 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <AppLayout><div className="py-16 text-center text-slate-500">Loading extracted profile...</div></AppLayout>;
  if (error) return <AppLayout><div className="mx-auto max-w-lg py-16 text-center"><p className="font-bold text-red-600">{error}</p><button onClick={() => navigate('/resume/upload')} className="mt-4 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white">Upload Resume</button></div></AppLayout>;

  return (
    <AppLayout>
      <div className="mx-auto max-w-5xl">
        <p className="text-sm font-bold uppercase tracking-wider text-blue-600">Module 3 · Extracted Profile</p>
        <h1 className="mt-2 text-3xl font-black text-slate-950">Review your extracted profile</h1>
        <p className="mt-2 text-slate-600">Edit the values returned by the resume processing pipeline before saving.</p>
        <form onSubmit={save} className="mt-7 space-y-6">
          <section className="card grid gap-4 p-6 sm:grid-cols-2">
            {Object.keys(EMPTY_PROFILE).map((field) => (
              <label key={field} className="block"><span className="mb-1.5 block text-xs font-bold capitalize text-slate-600">{field}</span><input name={field} value={profile[field]} onChange={setField} className="input-field py-2.5" /></label>
            ))}
          </section>
          <section className="card p-6">
            <h2 className="font-black text-slate-900">Extracted skills</h2>
            <div className="mt-4 flex flex-wrap gap-2">{skills.map((skill) => <span key={skill} className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1.5 text-sm font-bold text-blue-700">{skill}<button type="button" onClick={() => setSkills(skills.filter((item) => item !== skill))} aria-label={`Remove ${skill}`}><X size={14} /></button></span>)}</div>
            <div className="mt-4 flex gap-2"><input value={newSkill} onChange={(event) => setNewSkill(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && (event.preventDefault(), addSkill())} className="input-field py-2" placeholder="Add a skill" /><button type="button" onClick={addSkill} className="inline-flex items-center gap-1 rounded-xl bg-slate-900 px-4 py-2 text-sm font-bold text-white"><Plus size={16} />Add</button></div>
          </section>
          <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white disabled:opacity-60"><Save size={17} />{saving ? 'Saving...' : 'Save profile'}</button>
        </form>
      </div>
    </AppLayout>
  );
}
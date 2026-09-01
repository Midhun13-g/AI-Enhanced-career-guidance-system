import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiSave,
  FiPlus,
  FiX,
  FiShield,
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiLinkedin,
  FiGithub,
  FiUploadCloud,
  FiLayers,
  FiArrowLeft,
  FiCheck,
  FiActivity,
  FiAlertCircle,
} from 'react-icons/fi';
import AppLayout from '../../components/layout/AppLayout';
import { getResume, updateResume } from '../../services/resumeService';
import { useToast } from '../../context/ToastContext';

const EMPTY_PROFILE = {
  name: '',
  email: '',
  phone: '',
  location: '',
  linkedin: '',
  github: '',
};

const FIELD_CONFIG = [
  { key: 'name', label: 'Full Candidate Name', icon: FiUser, placeholder: 'e.g. Sughas Kabilan' },
  { key: 'email', label: 'Primary Email Address', icon: FiMail, placeholder: 'name@domain.com' },
  { key: 'phone', label: 'Contact Phone Number', icon: FiPhone, placeholder: '+1 (555) 000-0000' },
  { key: 'location', label: 'Location & Region', icon: FiMapPin, placeholder: 'San Francisco, CA' },
  { key: 'linkedin', label: 'LinkedIn Profile URL', icon: FiLinkedin, placeholder: 'linkedin.com/in/username' },
  { key: 'github', label: 'GitHub Profile URL', icon: FiGithub, placeholder: 'github.com/username' },
];

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
      setError('No active resume record found. Please upload and parse a resume first.');
      setLoading(false);
      return;
    }
    getResume(resumeId)
      .then(({ data }) => {
        if (data) {
          setProfile({
            name: data.name || '',
            email: data.email || '',
            phone: data.phone || '',
            location: data.location || '',
            linkedin: data.linkedin || '',
            github: data.github || '',
          });
          setSkills(Array.isArray(data.skills) ? data.skills : []);
        }
      })
      .catch(() => setError('Failed to load the extracted resume profile from the server.'))
      .finally(() => setLoading(false));
  }, [resumeId]);

  const setField = (event) =>
    setProfile({ ...profile, [event.target.name]: event.target.value });

  const addSkill = () => {
    const skill = newSkill.trim();
    if (skill && !skills.includes(skill)) {
      setSkills([...skills, skill]);
    }
    setNewSkill('');
  };

  const removeSkill = (skillToRemove) => {
    setSkills(skills.filter((item) => item !== skillToRemove));
  };

  const save = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await updateResume(resumeId, { ...profile, skills });
      toast?.('Extracted candidate profile updated successfully.', 'success');
      navigate('/resume/analysis');
    } catch (err) {
      const message =
        err.response?.data?.message || 'Failed to save the extracted profile modifications.';
      setError(message);
      toast?.(message, 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex h-72 flex-col items-center justify-center gap-3 text-neutral-400 font-mono text-xs">
          <FiActivity className="animate-spin text-[#0038FF]" size={24} />
          <span>Loading extracted candidate profile...</span>
        </div>
      </AppLayout>
    );
  }

  if (error && !profile.name && skills.length === 0) {
    return (
      <AppLayout>
        <div className="mx-auto max-w-lg py-16 text-center antialiased">
          <div className="rounded-2xl border border-neutral-200/90 bg-white p-8 shadow-xs space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-rose-50 text-rose-600 border border-rose-100">
              <FiAlertCircle size={22} />
            </div>
            <p className="text-xs font-bold text-neutral-900 font-mono">{error}</p>
            <button
              onClick={() => navigate('/resume/upload')}
              className="inline-flex items-center gap-2 rounded-lg bg-[#0038FF] hover:bg-blue-700 active:scale-[0.99] text-white px-5 py-2.5 text-xs font-mono font-bold transition-all shadow-md shadow-blue-500/20"
            >
              <FiUploadCloud size={14} />
              <span>Upload Resume</span>
            </button>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-8 max-w-5xl mx-auto pb-16 antialiased selection:bg-[#0038FF] selection:text-white">
        
        {/* ── Top Header Ribbon ── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-neutral-200/80 pb-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <Link to="/resume" className="text-neutral-400 hover:text-neutral-800 transition-colors">
                <FiArrowLeft size={16} />
              </Link>
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 font-mono">
                Resume Intelligence
              </span>
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-blue-50 border border-blue-100 text-[#0038FF] text-[9px] font-bold font-mono uppercase">
                <FiShield size={9} /> Module 03 Schema Editor
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-950">
              Review Extracted Resume Profile
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 max-w-2xl leading-relaxed">
              Verify and calibrate candidate attributes extracted by the parser pipeline before running deep AI diagnostic benchmarks[cite: 1, 2].
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => navigate('/resume/analysis')}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700 py-2.5 px-4 font-mono text-xs font-semibold tracking-wide transition-all shadow-2xs"
            >
              <span>Cancel</span>
            </button>

            <button
              onClick={save}
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#0038FF] hover:bg-blue-700 active:scale-[0.99] text-white py-2.5 px-5 font-mono text-xs font-semibold tracking-wide transition-all shadow-md shadow-blue-500/20 disabled:opacity-60 group"
            >
              {saving ? <FiActivity className="animate-spin" size={13} /> : <FiSave size={13} />}
              <span>{saving ? 'Saving Schema...' : 'Save & Proceed'}</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-3 rounded-xl border border-rose-200 bg-rose-50/60 p-4 text-xs font-mono text-rose-800">
            <FiAlertCircle size={16} className="shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={save} className="space-y-6">
          
          {/* ── Section 1: Contact & Demographics Data Fields ── */}
          <section className="rounded-2xl border border-neutral-200/90 bg-white p-6 sm:p-7 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#0038FF] font-mono">
                  Identity Schema
                </span>
                <h2 className="text-base font-bold text-neutral-950 mt-0.5">
                  Contact & Identity Entities
                </h2>
              </div>
              <span className="text-[10px] font-mono text-neutral-400 uppercase">
                Structured Parsing
              </span>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              {FIELD_CONFIG.map(({ key, label, icon: Icon, placeholder }) => (
                <div key={key} className="space-y-1.5">
                  <label className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-neutral-500 font-mono">
                    <Icon size={12} className="text-neutral-400" />
                    <span>{label}</span>
                  </label>
                  <input
                    name={key}
                    value={profile[key]}
                    onChange={setField}
                    placeholder={placeholder}
                    className="w-full rounded-lg border border-neutral-200 bg-white px-3.5 py-2.5 text-xs text-neutral-900 placeholder-neutral-400 outline-none focus:border-transparent focus:ring-2 focus:ring-[#0038FF] transition-all shadow-2xs font-mono"
                  />
                </div>
              ))}
            </div>
          </section>

          {/* ── Section 2: Skills Taxonomy Tagging ── */}
          <section className="rounded-2xl border border-neutral-200/90 bg-white p-6 sm:p-7 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#0038FF] font-mono">
                  Competency Vector
                </span>
                <h2 className="text-base font-bold text-neutral-950 mt-0.5">
                  Extracted Skills & Accreditations
                </h2>
              </div>
              <span className="text-[10px] font-mono text-neutral-500 bg-neutral-100 px-2.5 py-1 rounded">
                {skills.length} Extracted
              </span>
            </div>

            {/* Existing Skills Cloud */}
            <div className="flex flex-wrap gap-2 pt-1 min-h-[48px]">
              <AnimatePresence>
                {skills.map((skill) => (
                  <motion.span
                    key={skill}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-blue-100 bg-blue-50/60 px-3 py-1.5 text-xs font-mono font-medium text-[#0038FF]"
                  >
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      aria-label={`Remove ${skill}`}
                      className="text-blue-400 hover:text-blue-700 transition-colors p-0.5 rounded"
                    >
                      <FiX size={13} />
                    </button>
                  </motion.span>
                ))}
              </AnimatePresence>

              {skills.length === 0 && (
                <p className="text-xs font-mono text-neutral-400 py-2">
                  No skills identified. Type below and press enter to add candidate competencies.
                </p>
              )}
            </div>

            {/* Add New Skill Input Group */}
            <div className="pt-2 border-t border-neutral-100">
              <div className="flex gap-2.5 max-w-md">
                <input
                  value={newSkill}
                  onChange={(event) => setNewSkill(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault();
                      addSkill();
                    }
                  }}
                  placeholder="Add custom skill (e.g. PyTorch, Docker, React)"
                  className="flex-1 rounded-lg border border-neutral-200 bg-white px-3.5 py-2 text-xs text-neutral-900 placeholder-neutral-400 outline-none focus:border-transparent focus:ring-2 focus:ring-[#0038FF] transition-all shadow-2xs font-mono"
                />
                <button
                  type="button"
                  onClick={addSkill}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-neutral-950 hover:bg-neutral-800 active:scale-[0.99] px-4 py-2 text-xs font-mono font-bold text-white transition-all shadow-2xs shrink-0"
                >
                  <FiPlus size={14} />
                  <span>Append</span>
                </button>
              </div>
            </div>
          </section>

          {/* ── Footer Submission Bar ── */}
          <div className="flex items-center justify-between pt-2">
            <p className="text-[11px] font-mono text-neutral-400">
              Saving updates the cached resume profile for subsequent AI diagnostic stages[cite: 1, 2].
            </p>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-lg bg-[#0038FF] hover:bg-blue-700 active:scale-[0.99] text-white px-6 py-2.5 text-xs font-mono font-bold transition-all shadow-md shadow-blue-500/20 disabled:opacity-60"
            >
              {saving ? <FiActivity className="animate-spin" size={14} /> : <FiSave size={14} />}
              <span>{saving ? 'Committing Changes...' : 'Save Profile Schema'}</span>
            </button>
          </div>

        </form>
      </div>
    </AppLayout>
  );
}
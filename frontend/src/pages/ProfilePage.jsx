import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiCamera,
  FiMail,
  FiPhone,
  FiBook,
  FiTarget,
  FiMapPin,
  FiCalendar,
  FiUserCheck,
  FiEdit2,
  FiAward,
  FiLayers,
  FiGlobe,
  FiLinkedin,
  FiGithub,
  FiBriefcase,
  FiShield,
  FiCheckCircle,
  FiAlertCircle,
} from 'react-icons/fi';
import api from '../services/api';
import AppLayout from '../components/layout/AppLayout';
import ProfileForm from '../components/profile/ProfileForm';
import { Alert, SkeletonCard, Skeleton, Button } from '../components/ui/index';
import { useToast } from '../context/ToastContext';

function InlineProfileCard({ profile, onEdit }) {
  const initials = profile?.name
    ? profile.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'KS';

  return (
    <div className="bg-white border border-neutral-200/90 rounded-2xl overflow-hidden shadow-xs">
      {/* High-Contrast Technical Header */}
      <div className="bg-[#03081E] p-6 pb-12 relative flex items-center justify-between border-b border-neutral-800">
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-white/10 text-blue-200 text-[9px] font-bold font-mono uppercase tracking-wider">
          Student Record
        </span>
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
      </div>

      <div className="px-6 pb-6 pt-0 relative">
        {/* Floating Identity Avatar & Quick Edit */}
        <div className="flex items-end justify-between -mt-9 mb-4">
          <div className="relative">
            {profile?.profileImageUrl ? (
              <img
                src={profile.profileImageUrl}
                alt={profile?.name || 'Candidate Avatar'}
                className="h-16 w-16 rounded-xl object-cover border-2 border-white shadow-md bg-neutral-100"
              />
            ) : (
              <div className="h-16 w-16 rounded-xl bg-neutral-950 border-2 border-white text-white flex items-center justify-center font-mono font-bold text-lg shadow-md">
                {initials}
              </div>
            )}
            <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-white shadow-2xs" />
          </div>

          <button
            onClick={onEdit}
            className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-50 px-3 py-1.5 text-xs font-mono font-bold text-neutral-800 transition-all shadow-2xs"
          >
            <FiEdit2 size={12} className="text-[#0038FF]" />
            <span>Edit Profile</span>
          </button>
        </div>

        {/* Candidate Identity Meta */}
        <div className="space-y-1">
          <h2 className="text-lg font-black tracking-tight text-neutral-950 font-sans">
            {profile?.name || 'Kabilan S'}
          </h2>

          {profile?.careerGoal && (
            <p className="text-xs font-mono font-bold text-[#0038FF] flex items-center gap-1.5">
              <FiBriefcase size={12} className="text-[#0038FF] shrink-0" />
              <span>{profile.careerGoal}</span>
            </p>
          )}

          {(profile?.collegeName || profile?.department) && (
            <p className="text-xs text-neutral-500 font-sans leading-relaxed pt-0.5">
              {[profile?.collegeName, profile?.department].filter(Boolean).join(' · ')}
            </p>
          )}
        </div>

        {/* Core Competency Tags */}
        {profile?.skills?.length > 0 && (
          <div className="mt-5 pt-4 border-t border-neutral-100 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 font-mono block">
              Core Skills
            </span>
            <div className="flex flex-wrap gap-1.5">
              {profile.skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-neutral-100 border border-neutral-200/80 text-[11px] font-mono font-medium text-neutral-800"
                >
                  <span className="h-1 w-1 rounded-full bg-[#0038FF]" />
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Verified Profile Links */}
        <div className="mt-5 pt-4 border-t border-neutral-100 flex items-center gap-4 text-xs font-mono text-neutral-600">
          {profile?.linkedin && (
            <a
              href={profile.linkedin.startsWith('http') ? profile.linkedin : `https://${profile.linkedin}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 hover:text-[#0038FF] transition-colors"
            >
              <FiLinkedin size={13} />
              <span>LinkedIn</span>
            </a>
          )}
          {profile?.github && (
            <a
              href={profile.github.startsWith('http') ? profile.github : `https://${profile.github}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 hover:text-[#0038FF] transition-colors"
            >
              <FiGithub size={13} />
              <span>GitHub</span>
            </a>
          )}
          {profile?.portfolio && (
            <a
              href={profile.portfolio.startsWith('http') ? profile.portfolio : `https://${profile.portfolio}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 hover:text-[#0038FF] transition-colors"
            >
              <FiGlobe size={13} />
              <span>Portfolio</span>
            </a>
          )}
          {!profile?.linkedin && !profile?.github && !profile?.portfolio && (
            <span className="text-[11px] text-neutral-400">No external links attached.</span>
          )}
        </div>
      </div>
    </div>
  );
}

function InlineProgressCard({ completion }) {
  const pct = Math.min(100, Math.max(0, Math.round(completion?.profileCompletion ?? 100)));
  const isComplete = pct >= 100;

  return (
    <div className="bg-white border border-neutral-200/90 rounded-2xl p-6 shadow-xs space-y-4 font-mono">
      <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
        <div className="flex items-center gap-1.5">
          <FiShield size={13} className="text-[#0038FF]" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
            Profile Readiness
          </span>
        </div>
        <span className="text-[10px] font-bold text-neutral-500 uppercase">
          {isComplete ? 'Calibrated' : 'In Progress'}
        </span>
      </div>

      <div className="flex items-baseline justify-between">
        <span className="text-xs font-bold text-neutral-800 font-sans">
          Dossier Completion
        </span>
        <span className="text-2xl font-black text-neutral-950 font-mono tracking-tight">
          {pct}%
        </span>
      </div>

      {/* Klein Blue Progress Rail */}
      <div className="h-2 w-full rounded-full bg-neutral-100 overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-[#0038FF]"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>

      {/* Status Message */}
      <div
        className={`rounded-xl border p-3 flex items-start gap-2.5 text-xs font-sans ${
          isComplete
            ? 'bg-blue-50/50 border-blue-100 text-neutral-800'
            : 'bg-amber-50/50 border-amber-200/80 text-neutral-800'
        }`}
      >
        {isComplete ? (
          <FiCheckCircle size={14} className="text-[#0038FF] shrink-0 mt-0.5" />
        ) : (
          <FiAlertCircle size={14} className="text-amber-600 shrink-0 mt-0.5" />
        )}
        <p className="text-[11px] leading-relaxed">
          {isComplete
            ? 'Profile complete. Career guidance and AI recommendation vectors calibrated.'
            : `Add missing fields (${completion?.missingFields?.slice(0, 2).join(', ') || 'skills, GPA'}) for maximum accuracy.`}
        </p>
      </div>
    </div>
  );
}

function DataRow({ icon: Icon, label, value }) {
  if (!value) return null;
  return (
    <div className="flex items-center justify-between py-3 border-b border-neutral-100 last:border-none text-xs font-mono">
      <div className="flex items-center gap-2.5 text-neutral-400 uppercase text-[10px] tracking-wider">
        <Icon size={13} className="text-[#0038FF] shrink-0" />
        <span>{label}</span>
      </div>
      <span className="font-semibold text-neutral-900 text-right max-w-[60%] truncate font-sans">
        {value}
      </span>
    </div>
  );
}

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [completion, setCompletion] = useState({ profileCompletion: 100, missingFields: [] });
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [mentorEmail, setMentorEmail] = useState('');
  const [mentorSaving, setMentorSaving] = useState(false);
  const toast = useToast();

  const fetchProfile = async () => {
    try {
      const [profileRes, completionRes] = await Promise.all([
        api.get('/api/profile'),
        api.get('/api/profile/completion'),
      ]);
      setProfile(profileRes.data);
      setCompletion(completionRes.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load profile data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSubmit = async (payload) => {
    setSubmitting(true);
    setError('');
    setSuccess('');
    try {
      const res = await api.put('/api/profile', payload);
      setProfile(res.data);
      setEditing(false);
      setSuccess('Profile updated successfully');
      toast?.('Profile updated successfully!', 'success');
      fetchProfile();
    } catch (err) {
      const data = err.response?.data;
      const msg = data?.message || (data && Object.values(data)[0]) || 'Unable to save profile';
      setError(msg);
      toast?.(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await api.post('/api/profile/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setProfile(res.data);
      setSuccess('Avatar updated successfully');
      toast?.('Profile photo updated!', 'success');
    } catch (err) {
      const msg = err.response?.data?.message || 'Image upload failed';
      setError(msg);
      toast?.(msg, 'error');
    }
  };

  const chooseMentor = async (event) => {
    event.preventDefault();
    setMentorSaving(true);
    setError('');
    try {
      await api.post('/api/student/mentor', { mentorEmail });
      setSuccess('Mentor linked successfully.');
      setMentorEmail('');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to link requested mentor.');
    } finally {
      setMentorSaving(false);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6 max-w-[1400px] mx-auto pb-12 antialiased selection:bg-[#0038FF] selection:text-white">
        {/* Header Ribbon */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 pb-5">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 font-mono">
              Student Record
            </span>
            <h1 className="text-2xl font-extrabold tracking-tight text-neutral-950 mt-0.5">
              Profile & Academic Configuration
            </h1>
          </div>

          <div className="flex items-center gap-2.5">
            {!editing && (
              <>
                <label className="cursor-pointer inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-50 text-xs font-mono font-semibold text-neutral-800 transition-all shadow-2xs">
                  <FiCamera size={13} className="text-neutral-500" />
                  <span>Change Avatar</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                </label>
                <Button
                  onClick={() => setEditing(true)}
                  className="bg-[#0038FF] hover:bg-blue-700 active:scale-[0.99] text-white rounded-lg text-xs font-mono font-semibold px-4 py-2 flex items-center gap-1.5 shadow-md shadow-blue-500/20"
                >
                  <FiEdit2 size={12} />
                  <span>Edit Profile</span>
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Global Alerts */}
        {error && !editing && <Alert variant="error">{error}</Alert>}
        {success && !editing && (
          <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}>
            <Alert variant="success">{success}</Alert>
          </motion.div>
        )}

        {loading ? (
          <div className="grid gap-6 lg:grid-cols-12">
            <div className="lg:col-span-4 space-y-4">
              <SkeletonCard />
              <div className="bg-white rounded-2xl border border-neutral-200 p-6 space-y-3">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-3 w-full" />
              </div>
            </div>
            <div className="lg:col-span-8 space-y-4">
              <SkeletonCard />
              <SkeletonCard />
            </div>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {!editing ? (
              <motion.div
                key="view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid gap-6 lg:grid-cols-12"
              >
                {/* Left Rail (4 cols): User Card + Completion */}
                <div className="lg:col-span-4 space-y-6">
                  <InlineProfileCard profile={profile} onEdit={() => setEditing(true)} />
                  <InlineProgressCard completion={completion} />
                </div>

                {/* Right Rail (8 cols): Structured Sections */}
                <div className="lg:col-span-8 space-y-6">
                  {/* Mentor Assignment Box */}
                  <div className="bg-white border border-neutral-200/90 rounded-2xl p-6 shadow-xs space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500 font-mono">
                          Assigned Mentor
                        </h2>
                        <p className="text-xs text-neutral-500 mt-0.5 font-sans">
                          Link a verified advisor's institutional email to grant roadmap visibility.
                        </p>
                      </div>
                      <span className="h-7 w-7 rounded-lg bg-blue-50 text-[#0038FF] flex items-center justify-center">
                        <FiUserCheck size={14} />
                      </span>
                    </div>

                    <form onSubmit={chooseMentor} className="flex flex-col sm:flex-row gap-2 pt-1" noValidate>
                      <input
                        required
                        type="email"
                        value={mentorEmail}
                        onChange={(e) => setMentorEmail(e.target.value)}
                        placeholder="mentor@gmail.com"
                        className="flex-1 rounded-lg border border-neutral-200 px-3.5 py-2 text-xs text-neutral-900 placeholder-neutral-400 outline-none focus:border-transparent focus:ring-2 focus:ring-[#0038FF] transition-all shadow-2xs font-mono"
                      />
                      <Button
                        type="submit"
                        disabled={mentorSaving}
                        className="bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-mono font-semibold px-4 py-2 transition-all shrink-0"
                      >
                        {mentorSaving ? 'Connecting…' : 'Assign Advisor'}
                      </Button>
                    </form>
                  </div>

                  {/* Academic & Target Calibration */}
                  <div className="bg-white border border-neutral-200/90 rounded-2xl p-6 shadow-xs space-y-2">
                    <div className="flex items-center justify-between border-b border-neutral-100 pb-3 mb-1">
                      <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500 font-mono">
                        Academic & Target Specialization
                      </h2>
                      <span className="text-[10px] font-mono text-neutral-400 uppercase">Verified Data</span>
                    </div>

                    <DataRow icon={FiBook} label="Institution" value={profile?.collegeName} />
                    <DataRow icon={FiLayers} label="Department" value={profile?.department} />
                    <DataRow icon={FiAward} label="Degree / Program" value={profile?.degree} />
                    <DataRow icon={FiCalendar} label="Year of Study" value={profile?.yearOfStudy} />
                    <DataRow icon={FiAward} label="Cumulative GPA" value={profile?.cgpa?.toString()} />
                    <DataRow icon={FiTarget} label="Target Career Goal" value={profile?.careerGoal} />
                  </div>

                  {/* Contact & Demographics */}
                  <div className="bg-white border border-neutral-200/90 rounded-2xl p-6 shadow-xs space-y-2">
                    <div className="flex items-center justify-between border-b border-neutral-100 pb-3 mb-1">
                      <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500 font-mono">
                        Contact & Identity
                      </h2>
                      <span className="text-[10px] font-mono text-neutral-400 uppercase">Personal</span>
                    </div>

                    <DataRow icon={FiMail} label="Student Email" value={profile?.email} />
                    <DataRow icon={FiPhone} label="Contact Phone" value={profile?.phone} />
                    <DataRow
                      icon={FiCalendar}
                      label="Date of Birth"
                      value={
                        profile?.dateOfBirth
                          ? Array.isArray(profile.dateOfBirth)
                            ? profile.dateOfBirth.join('-')
                            : profile.dateOfBirth
                          : null
                      }
                    />
                    <DataRow
                      icon={FiMapPin}
                      label="Current Location"
                      value={[profile?.city, profile?.state, profile?.country].filter(Boolean).join(', ') || null}
                    />
                  </div>

                  {/* Competency & Skill Tags */}
                  {(profile?.skills?.length > 0 || profile?.interests?.length > 0) && (
                    <div className="bg-white border border-neutral-200/90 rounded-2xl p-6 shadow-xs space-y-4">
                      <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500 font-mono">
                        Competencies & Technical Domain Focus
                      </h2>

                      {profile?.skills?.length > 0 && (
                        <div>
                          <p className="text-[11px] font-mono text-neutral-400 uppercase mb-2">Primary Skills</p>
                          <div className="flex flex-wrap gap-1.5">
                            {profile.skills.map((s) => (
                              <span
                                key={s}
                                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-neutral-100 border border-neutral-200 text-xs font-medium text-neutral-800 font-mono"
                              >
                                <span className="h-1.5 w-1.5 rounded-full bg-[#0038FF]" />
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {profile?.interests?.length > 0 && (
                        <div className="pt-2">
                          <p className="text-[11px] font-mono text-neutral-400 uppercase mb-2">
                            Research & Industry Interests
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {profile.interests.map((i) => (
                              <span
                                key={i}
                                className="inline-flex items-center px-3 py-1 rounded-md bg-neutral-50 border border-neutral-200 text-xs text-neutral-600 font-medium font-sans"
                              >
                                {i}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Biography */}
                  {profile?.bio && (
                    <div className="bg-white border border-neutral-200/90 rounded-2xl p-6 shadow-xs space-y-2">
                      <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500 font-mono">
                        Candidate Summary
                      </h2>
                      <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed pt-1 font-sans">
                        {profile.bio}
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div key="edit" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <ProfileForm
                  profile={profile}
                  onSubmit={handleSubmit}
                  submitting={submitting}
                  error={error}
                  success={success}
                  onCancel={() => {
                    setEditing(false);
                    setError('');
                    setSuccess('');
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </AppLayout>
  );
}
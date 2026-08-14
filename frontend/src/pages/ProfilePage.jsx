import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCamera, FiMail, FiPhone, FiBook, FiTarget, FiMapPin, FiCalendar } from 'react-icons/fi';
import api from '../services/api';
import AppLayout from '../components/layout/AppLayout';
import ProfileCard from '../components/profile/ProfileCard';
import ProfileForm from '../components/profile/ProfileForm';
import ProgressCard from '../components/profile/ProgressCard';
import { Alert, Badge, SkeletonCard, Skeleton, Button } from '../components/ui/index';
import { useToast } from '../context/ToastContext';

function DetailItem({ icon: Icon, label, value }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors">
      <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
        <Icon size={14} className="text-slate-500" />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{label}</p>
        <p className="text-sm font-semibold text-slate-800 mt-0.5 break-words">{value}</p>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const [profile, setProfile]       = useState(null);
  const [completion, setCompletion] = useState({ profileCompletion: 0, missingFields: [] });
  const [loading, setLoading]       = useState(true);
  const [editing, setEditing]       = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]           = useState('');
  const [success, setSuccess]       = useState('');
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
      setError(err.response?.data?.message || 'Unable to load profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProfile(); }, []);

  const handleSubmit = async (payload) => {
    setSubmitting(true); setError(''); setSuccess('');
    try {
      const res = await api.put('/api/profile', payload);
      setProfile(res.data);
      setEditing(false);
      setSuccess('Profile saved successfully');
      toast?.('Profile saved successfully!', 'success');
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
      const res = await api.post('/api/profile/image', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setProfile(res.data);
      setSuccess('Profile image uploaded');
      toast?.('Profile photo updated!', 'success');
    } catch (err) {
      const msg = err.response?.data?.message || 'Image upload failed';
      setError(msg);
      toast?.(msg, 'error');
    }
  };

  const chooseMentor = async (event) => {
    event.preventDefault(); setMentorSaving(true); setError('');
    try { await api.post('/api/student/mentor', { mentorEmail }); setSuccess('Mentor selected successfully.'); setMentorEmail(''); }
    catch (err) { setError(err.response?.data?.message || 'Unable to select mentor.'); }
    finally { setMentorSaving(false); }
  };

  return (
    <AppLayout>
      <div className="space-y-6">

        {/* Page header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">My Profile</h1>
            <p className="text-sm text-slate-500 mt-0.5">Manage your information and career preferences</p>
          </div>
          <div className="flex items-center gap-3">
            {!editing && (
              <label className="cursor-pointer">
                <Button variant="outline" size="sm" className="flex items-center gap-2 pointer-events-none">
                  <FiCamera size={14} /> Upload Photo
                </Button>
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              </label>
            )}
          </div>
        </div>

        {/* Global alerts */}
        {error   && !editing && <Alert variant="error">{error}</Alert>}
        {success && !editing && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
            <Alert variant="success">{success}</Alert>
          </motion.div>
        )}

        {loading ? (
          /* Skeleton loading */
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="space-y-4">
              <SkeletonCard />
              <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-3">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-5/6" />
              </div>
            </div>
            <div className="lg:col-span-2 space-y-4">
              <SkeletonCard />
              <SkeletonCard />
            </div>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {!editing ? (
              /* ── View mode ── */
              <motion.div key="view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="grid gap-6 lg:grid-cols-3">

                {/* Left column */}
                <div className="space-y-5">
                  <ProfileCard profile={profile} onEdit={() => setEditing(true)} />
                  <ProgressCard completion={completion} />
                </div>

                {/* Right column */}
                <div className="lg:col-span-2 space-y-5">

                  {/* Details grid */}
                  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                    <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-600 inline-block" />
                      Contact & Personal
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-1">
                      <DetailItem icon={FiMail}     label="Email"         value={profile?.email} />
                      <DetailItem icon={FiPhone}    label="Phone"         value={profile?.phone} />
                      <DetailItem icon={FiCalendar} label="Date of Birth" value={profile?.dateOfBirth ? (Array.isArray(profile.dateOfBirth) ? profile.dateOfBirth.join('-') : profile.dateOfBirth) : null} />
                      <DetailItem icon={FiMapPin}   label="Location"      value={[profile?.city, profile?.state, profile?.country].filter(Boolean).join(', ') || null} />
                    </div>
                  </div>

                  <form onSubmit={chooseMentor} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                    <h3 className="text-sm font-bold text-slate-700">Choose your mentor</h3>
                    <p className="mt-1 text-sm text-slate-500">Enter the verified mentor’s Gmail address to request guidance.</p>
                    <div className="mt-4 flex flex-col gap-3 sm:flex-row"><input required type="email" value={mentorEmail} onChange={(event) => setMentorEmail(event.target.value)} placeholder="mentor@gmail.com" className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm" /><Button type="submit" disabled={mentorSaving}>{mentorSaving ? 'Saving…' : 'Choose mentor'}</Button></div>
                  </form>

                  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                    <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-indigo-600 inline-block" />
                      Education & Career
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-1">
                      <DetailItem icon={FiBook}   label="College"      value={profile?.collegeName} />
                      <DetailItem icon={FiBook}   label="Department"   value={profile?.department} />
                      <DetailItem icon={FiBook}   label="Degree"       value={profile?.degree} />
                      <DetailItem icon={FiBook}   label="Year"         value={profile?.yearOfStudy} />
                      <DetailItem icon={FiBook}   label="CGPA"         value={profile?.cgpa?.toString()} />
                      <DetailItem icon={FiTarget} label="Career Goal"  value={profile?.careerGoal} />
                    </div>
                  </div>

                  {/* Skills & Interests */}
                  {(profile?.skills?.length > 0 || profile?.interests?.length > 0) && (
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                      <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-teal-500 inline-block" />
                        Skills & Interests
                      </h3>
                      {profile?.skills?.length > 0 && (
                        <div className="mb-4">
                          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Skills</p>
                          <div className="flex flex-wrap gap-1.5">
                            {profile.skills.map(s => <Badge key={s} variant="primary">{s}</Badge>)}
                          </div>
                        </div>
                      )}
                      {profile?.interests?.length > 0 && (
                        <div>
                          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Interests</p>
                          <div className="flex flex-wrap gap-1.5">
                            {profile.interests.map(i => <Badge key={i} variant="teal">{i}</Badge>)}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Bio */}
                  {profile?.bio && (
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                      <h3 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-purple-500 inline-block" />
                        Bio
                      </h3>
                      <p className="text-sm text-slate-600 leading-relaxed">{profile.bio}</p>
                    </div>
                  )}
                </div>
              </motion.div>
            ) : (
              /* ── Edit mode ── */
              <motion.div key="edit" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <ProfileForm
                  profile={profile}
                  onSubmit={handleSubmit}
                  submitting={submitting}
                  error={error}
                  success={success}
                  onCancel={() => { setEditing(false); setError(''); setSuccess(''); }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </AppLayout>
  );
}

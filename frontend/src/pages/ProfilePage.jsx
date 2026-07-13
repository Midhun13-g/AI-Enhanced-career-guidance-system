import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import ProfileCard from '../components/profile/ProfileCard';
import ProfileForm from '../components/profile/ProfileForm';
import ProgressCard from '../components/profile/ProgressCard';

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [completion, setCompletion] = useState({ profileCompletion: 0, missingFields: [] });
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

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
      setSuccess('Profile saved successfully');
      fetchProfile();
    } catch (err) {
      const data = err.response?.data;
      const msg = data?.message || (data && Object.values(data)[0]) || 'Unable to save profile';
      setError(msg);
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
    } catch (err) {
      setError(err.response?.data?.message || 'Image upload failed');
    }
  };

  if (loading) {
    return <div className="p-6 text-slate-600">Loading profile...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-100 p-4 sm:p-6">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <div className="flex items-center justify-between rounded-2xl bg-white p-6 shadow-sm">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Student Profile</h2>
            <p className="text-slate-500">Complete your profile to get better career recommendations.</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => navigate('/dashboard')} className="rounded-lg border px-4 py-2 text-sm font-medium text-slate-700">Back to Dashboard</button>
            <label className="cursor-pointer rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white">
              Upload Photo
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </label>
          </div>
        </div>

        <ProgressCard completion={completion} />
        {!editing ? (
          <div className="space-y-6">
            <ProfileCard profile={profile} onEdit={() => setEditing(true)} />
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold text-slate-900">Profile Details</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div><span className="text-sm text-slate-500">Email</span><p className="font-medium">{profile?.email || '—'}</p></div>
                <div><span className="text-sm text-slate-500">Phone</span><p className="font-medium">{profile?.phone || '—'}</p></div>
                <div><span className="text-sm text-slate-500">College</span><p className="font-medium">{profile?.collegeName || '—'}</p></div>
                <div><span className="text-sm text-slate-500">Department</span><p className="font-medium">{profile?.department || '—'}</p></div>
                <div><span className="text-sm text-slate-500">Skills</span><p className="font-medium">{profile?.skills?.join(', ') || '—'}</p></div>
                <div><span className="text-sm text-slate-500">Interests</span><p className="font-medium">{profile?.interests?.join(', ') || '—'}</p></div>
              </div>
            </div>
          </div>
        ) : (
          <ProfileForm profile={profile} onSubmit={handleSubmit} submitting={submitting} error={error} success={success} />
        )}
      </div>
    </div>
  );
}

export default function ProfileCard({ profile, onEdit }) {
  const initials = `${profile?.firstName?.[0] || 'S'}${profile?.lastName?.[0] || 'P'}`;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-xl font-semibold text-white">
            {profile?.profileImage ? <img src={profile.profileImage} alt="Profile" className="h-16 w-16 rounded-full object-cover" /> : initials}
          </div>
          <div>
            <h3 className="text-xl font-semibold text-slate-900">{profile?.firstName || 'Student'} {profile?.lastName || ''}</h3>
            <p className="text-sm text-slate-500">{profile?.collegeName || 'Complete your profile'}</p>
            <p className="text-sm text-slate-500">{profile?.careerGoal || 'Set your career goal'}</p>
          </div>
        </div>
        <button onClick={onEdit} className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white">Edit Profile</button>
      </div>
    </div>
  );
}

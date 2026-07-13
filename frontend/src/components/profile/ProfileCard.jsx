import { motion } from 'framer-motion';
import { FiEdit2, FiMapPin, FiBook, FiTarget, FiExternalLink } from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi2';
import { Badge, Button } from '../ui/index';

export default function ProfileCard({ profile, onEdit }) {
  const initials = `${profile?.firstName?.[0] || 'S'}${profile?.lastName?.[0] || 'P'}`.toUpperCase();

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      {/* Banner */}
      <div className="h-24 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 relative">
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
      </div>

      <div className="px-6 pb-6">
        {/* Avatar + edit row */}
        <div className="flex items-end justify-between -mt-10 mb-4">
          <motion.div whileHover={{ scale: 1.04 }} className="relative">
            <div className="h-20 w-20 rounded-2xl border-4 border-white shadow-lg overflow-hidden bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              {profile?.profileImage
                ? <img src={profile.profileImage} alt="Profile" className="h-full w-full object-cover" />
                : <span className="text-2xl font-extrabold text-white">{initials}</span>
              }
            </div>
            <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-emerald-500 border-2 border-white" title="Active" />
          </motion.div>

          <Button variant="outline" size="sm" onClick={onEdit} className="flex items-center gap-1.5">
            <FiEdit2 size={13} /> Edit Profile
          </Button>
        </div>

        {/* Name & info */}
        <div className="space-y-1.5 mb-4">
          <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
            {profile?.firstName || 'Student'} {profile?.lastName || ''}
          </h3>
          {profile?.careerGoal && (
            <div className="flex items-center gap-1.5 text-sm text-slate-600">
              <FiTarget size={13} className="text-blue-500 shrink-0" />
              <span>{profile.careerGoal}</span>
            </div>
          )}
          {profile?.collegeName && (
            <div className="flex items-center gap-1.5 text-sm text-slate-500">
              <FiBook size={13} className="text-slate-400 shrink-0" />
              <span>{profile.collegeName}{profile.department ? ` · ${profile.department}` : ''}</span>
            </div>
          )}
          {(profile?.city || profile?.country) && (
            <div className="flex items-center gap-1.5 text-sm text-slate-500">
              <FiMapPin size={13} className="text-slate-400 shrink-0" />
              <span>{[profile.city, profile.country].filter(Boolean).join(', ')}</span>
            </div>
          )}
        </div>

        {/* Skills */}
        {profile?.skills?.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Skills</p>
            <div className="flex flex-wrap gap-1.5">
              {profile.skills.slice(0, 8).map(s => <Badge key={s} variant="primary">{s}</Badge>)}
              {profile.skills.length > 8 && <Badge variant="default">+{profile.skills.length - 8} more</Badge>}
            </div>
          </div>
        )}

        {/* AI badge */}
        <div className="flex items-center gap-2 p-3 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 mb-4">
          <HiSparkles className="text-blue-600 shrink-0" size={14} />
          <p className="text-xs text-blue-700 font-medium">AI recommendations are based on your profile data</p>
        </div>

        {/* Social links */}
        {(profile?.linkedinUrl || profile?.githubUrl || profile?.portfolioUrl) && (
          <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
            {profile.linkedinUrl && (
              <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-blue-600 transition-colors font-medium">
                <FiExternalLink size={13} /> LinkedIn
              </a>
            )}
            {profile.githubUrl && (
              <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 transition-colors font-medium">
                <FiExternalLink size={13} /> GitHub
              </a>
            )}
            {profile.portfolioUrl && (
              <a href={profile.portfolioUrl} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-teal-600 transition-colors font-medium">
                <FiExternalLink size={13} /> Portfolio
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

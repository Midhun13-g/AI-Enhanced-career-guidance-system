import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FiUser, FiMail, FiPhone, FiMapPin, FiBook, FiTarget,
  FiExternalLink, FiGlobe, FiFileText, FiSave, FiX,
} from 'react-icons/fi';
import { Button, Alert } from '../ui/index';

const emptyForm = {
  firstName: '', lastName: '', email: '', phone: '', gender: '',
  dateOfBirth: '', address: '', city: '', state: '', country: '',
  collegeName: '', department: '', degree: '', yearOfStudy: '',
  cgpa: '', skills: '', interests: '', careerGoal: '',
  preferredLocation: '', linkedinUrl: '', githubUrl: '', portfolioUrl: '', bio: '',
};

function toDateString(val) {
  if (!val) return '';
  if (typeof val === 'string') return val.substring(0, 10);
  if (Array.isArray(val)) {
    const [y, m, d] = val;
    return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  }
  return '';
}

const ic = 'w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200';
const icIcon = `${ic} pl-10`;
const lbl = 'block text-sm font-medium text-slate-700 mb-1.5';

function FieldIcon({ icon: Icon }) {
  return <Icon size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />;
}

function Section({ title, icon: Icon, children }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
        <div className="h-7 w-7 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center">
          <Icon size={13} className="text-blue-600" />
        </div>
        <h4 className="text-sm font-bold text-slate-700">{title}</h4>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">{children}</div>
    </div>
  );
}

function FullWidth({ children }) {
  return <div className="sm:col-span-2">{children}</div>;
}

export default function ProfileForm({ profile, onSubmit, submitting, error, success, onCancel }) {
  const [form, setForm] = useState({
    ...emptyForm,
    ...profile,
    dateOfBirth: toDateString(profile?.dateOfBirth),
    skills:      profile?.skills?.join(', ')     || '',
    interests:   profile?.interests?.join(', ')  || '',
  });

  const set = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...form,
      skills:    form.skills.split(',').map(s => s.trim()).filter(Boolean),
      interests: form.interests.split(',').map(s => s.trim()).filter(Boolean),
      cgpa:      form.cgpa ? Number(form.cgpa) : null,
    });
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-8 space-y-8"
      noValidate
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-extrabold text-slate-900">Edit Profile</h3>
          <p className="text-sm text-slate-500 mt-0.5">Update your information to improve AI recommendations</p>
        </div>
        {onCancel && (
          <button type="button" onClick={onCancel} className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors" aria-label="Cancel">
            <FiX size={18} />
          </button>
        )}
      </div>

      {error   && <Alert variant="error">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      {/* Personal */}
      <Section title="Personal Information" icon={FiUser}>
        <div>
          <label className={lbl}>First name</label>
          <div className="relative"><FieldIcon icon={FiUser} /><input name="firstName" value={form.firstName} onChange={set} placeholder="First name" required className={icIcon} /></div>
        </div>
        <div>
          <label className={lbl}>Last name</label>
          <input name="lastName" value={form.lastName} onChange={set} placeholder="Last name" required className={ic} />
        </div>
        <div>
          <label className={lbl}>Email</label>
          <div className="relative"><FieldIcon icon={FiMail} /><input name="email" type="email" value={form.email} onChange={set} placeholder="Email" required className={icIcon} /></div>
        </div>
        <div>
          <label className={lbl}>Phone</label>
          <div className="relative"><FieldIcon icon={FiPhone} /><input name="phone" value={form.phone} onChange={set} placeholder="Phone" required className={icIcon} /></div>
        </div>
        <div>
          <label className={lbl}>Gender</label>
          <select name="gender" value={form.gender} onChange={set} required className={ic}>
            <option value="">Select gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div>
          <label className={lbl}>Date of birth</label>
          <input name="dateOfBirth" type="date" value={form.dateOfBirth || ''} onChange={set} className={ic} />
        </div>
      </Section>

      {/* Location */}
      <Section title="Location" icon={FiMapPin}>
        <FullWidth>
          <label className={lbl}>Address</label>
          <input name="address" value={form.address} onChange={set} placeholder="Street address" className={ic} />
        </FullWidth>
        <div>
          <label className={lbl}>City</label>
          <input name="city" value={form.city} onChange={set} placeholder="City" className={ic} />
        </div>
        <div>
          <label className={lbl}>State</label>
          <input name="state" value={form.state} onChange={set} placeholder="State" className={ic} />
        </div>
        <div>
          <label className={lbl}>Country</label>
          <input name="country" value={form.country} onChange={set} placeholder="Country" className={ic} />
        </div>
        <div>
          <label className={lbl}>Preferred location</label>
          <div className="relative"><FieldIcon icon={FiMapPin} /><input name="preferredLocation" value={form.preferredLocation} onChange={set} placeholder="Preferred work location" required className={icIcon} /></div>
        </div>
      </Section>

      {/* Education */}
      <Section title="Education" icon={FiBook}>
        <div>
          <label className={lbl}>College name</label>
          <div className="relative"><FieldIcon icon={FiBook} /><input name="collegeName" value={form.collegeName} onChange={set} placeholder="College name" required className={icIcon} /></div>
        </div>
        <div>
          <label className={lbl}>Department</label>
          <input name="department" value={form.department} onChange={set} placeholder="Department" required className={ic} />
        </div>
        <div>
          <label className={lbl}>Degree</label>
          <input name="degree" value={form.degree} onChange={set} placeholder="e.g. BE, BSc" required className={ic} />
        </div>
        <div>
          <label className={lbl}>Year of study</label>
          <input name="yearOfStudy" value={form.yearOfStudy} onChange={set} placeholder="e.g. 3" required className={ic} />
        </div>
        <div>
          <label className={lbl}>CGPA</label>
          <input name="cgpa" type="number" step="0.01" min="0" max="10" value={form.cgpa || ''} onChange={set} placeholder="e.g. 8.5" className={ic} />
        </div>
      </Section>

      {/* Career */}
      <Section title="Career & Skills" icon={FiTarget}>
        <FullWidth>
          <label className={lbl}>Career goal</label>
          <div className="relative"><FieldIcon icon={FiTarget} /><input name="careerGoal" value={form.careerGoal} onChange={set} placeholder="e.g. Full Stack Developer" required className={icIcon} /></div>
        </FullWidth>
        <FullWidth>
          <label className={lbl}>Skills <span className="text-slate-400 font-normal">(comma separated)</span></label>
          <input name="skills" value={form.skills} onChange={set} placeholder="React, Java, Python…" className={ic} />
        </FullWidth>
        <FullWidth>
          <label className={lbl}>Interests <span className="text-slate-400 font-normal">(comma separated)</span></label>
          <input name="interests" value={form.interests} onChange={set} placeholder="Web Development, AI, Cloud…" className={ic} />
        </FullWidth>
      </Section>

      {/* Social */}
      <Section title="Social & Portfolio" icon={FiGlobe}>
        <div>
          <label className={lbl}>LinkedIn URL</label>
          <div className="relative"><FieldIcon icon={FiExternalLink} /><input name="linkedinUrl" value={form.linkedinUrl} onChange={set} placeholder="https://linkedin.com/in/…" className={icIcon} /></div>
        </div>
        <div>
          <label className={lbl}>GitHub URL</label>
          <div className="relative"><FieldIcon icon={FiExternalLink} /><input name="githubUrl" value={form.githubUrl} onChange={set} placeholder="https://github.com/…" className={icIcon} /></div>
        </div>
        <FullWidth>
          <label className={lbl}>Portfolio URL</label>
          <div className="relative"><FieldIcon icon={FiGlobe} /><input name="portfolioUrl" value={form.portfolioUrl} onChange={set} placeholder="https://yourportfolio.com" className={icIcon} /></div>
        </FullWidth>
      </Section>

      {/* Bio */}
      <div>
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
          <div className="h-7 w-7 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center">
            <FiFileText size={13} className="text-blue-600" />
          </div>
          <h4 className="text-sm font-bold text-slate-700">Bio</h4>
        </div>
        <textarea name="bio" value={form.bio} onChange={set} placeholder="Write a short bio about yourself…" rows={4}
          className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none" />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2">
        <Button type="submit" variant="gradient" size="lg" loading={submitting} className="flex items-center gap-2">
          <FiSave size={15} />
          {submitting ? 'Saving…' : 'Save Profile'}
        </Button>
        {onCancel && (
          <Button type="button" variant="secondary" size="lg" onClick={onCancel}>Cancel</Button>
        )}
      </div>
    </motion.form>
  );
}

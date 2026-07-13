import { useState } from 'react';

const emptyForm = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  gender: '',
  dateOfBirth: '',
  address: '',
  city: '',
  state: '',
  country: '',
  collegeName: '',
  department: '',
  degree: '',
  yearOfStudy: '',
  cgpa: '',
  skills: '',
  interests: '',
  careerGoal: '',
  preferredLocation: '',
  linkedinUrl: '',
  githubUrl: '',
  portfolioUrl: '',
  bio: '',
};

export default function ProfileForm({ profile, onSubmit, submitting, error, success }) {
  const toDateString = (val) => {
    if (!val) return '';
    if (typeof val === 'string') return val.substring(0, 10);
    if (Array.isArray(val)) {
      const [y, m, d] = val;
      return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    }
    return '';
  };

  const [form, setForm] = useState({
    ...emptyForm,
    ...profile,
    dateOfBirth: toDateString(profile?.dateOfBirth),
    skills: profile?.skills?.join(', ') || '',
    interests: profile?.interests?.join(', ') || '',
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      skills: form.skills.split(',').map((item) => item.trim()).filter(Boolean),
      interests: form.interests.split(',').map((item) => item.trim()).filter(Boolean),
      cgpa: form.cgpa ? Number(form.cgpa) : null,
    };
    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      {error && <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
      {success && <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">{success}</div>}

      <div className="grid gap-4 md:grid-cols-2">
        <input name="firstName" value={form.firstName} onChange={handleChange} placeholder="First name" className="rounded-lg border px-3 py-2" required />
        <input name="lastName" value={form.lastName} onChange={handleChange} placeholder="Last name" className="rounded-lg border px-3 py-2" required />
        <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email" className="rounded-lg border px-3 py-2" required />
        <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" className="rounded-lg border px-3 py-2" required />
        <select name="gender" value={form.gender} onChange={handleChange} className="rounded-lg border px-3 py-2" required>
          <option value="">Select gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        <input name="dateOfBirth" type="date" value={form.dateOfBirth || ''} onChange={handleChange} className="rounded-lg border px-3 py-2" />
        <input name="address" value={form.address} onChange={handleChange} placeholder="Address" className="rounded-lg border px-3 py-2" />
        <input name="city" value={form.city} onChange={handleChange} placeholder="City" className="rounded-lg border px-3 py-2" />
        <input name="state" value={form.state} onChange={handleChange} placeholder="State" className="rounded-lg border px-3 py-2" />
        <input name="country" value={form.country} onChange={handleChange} placeholder="Country" className="rounded-lg border px-3 py-2" />
        <input name="collegeName" value={form.collegeName} onChange={handleChange} placeholder="College name" className="rounded-lg border px-3 py-2" required />
        <input name="department" value={form.department} onChange={handleChange} placeholder="Department" className="rounded-lg border px-3 py-2" required />
        <input name="degree" value={form.degree} onChange={handleChange} placeholder="Degree" className="rounded-lg border px-3 py-2" required />
        <input name="yearOfStudy" value={form.yearOfStudy} onChange={handleChange} placeholder="Year of study" className="rounded-lg border px-3 py-2" required />
        <input name="cgpa" type="number" step="0.01" value={form.cgpa || ''} onChange={handleChange} placeholder="CGPA" className="rounded-lg border px-3 py-2" />
        <input name="skills" value={form.skills} onChange={handleChange} placeholder="Skills (comma separated)" className="rounded-lg border px-3 py-2" />
        <input name="interests" value={form.interests} onChange={handleChange} placeholder="Interests (comma separated)" className="rounded-lg border px-3 py-2" />
        <input name="careerGoal" value={form.careerGoal} onChange={handleChange} placeholder="Career goal" className="rounded-lg border px-3 py-2" required />
        <input name="preferredLocation" value={form.preferredLocation} onChange={handleChange} placeholder="Preferred location" className="rounded-lg border px-3 py-2" required />
        <input name="linkedinUrl" value={form.linkedinUrl} onChange={handleChange} placeholder="LinkedIn URL" className="rounded-lg border px-3 py-2" />
        <input name="githubUrl" value={form.githubUrl} onChange={handleChange} placeholder="GitHub URL" className="rounded-lg border px-3 py-2" />
        <input name="portfolioUrl" value={form.portfolioUrl} onChange={handleChange} placeholder="Portfolio URL" className="rounded-lg border px-3 py-2" />
      </div>
      <textarea name="bio" value={form.bio} onChange={handleChange} placeholder="Short bio" rows="4" className="w-full rounded-lg border px-3 py-2" />
      <button type="submit" disabled={submitting} className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white disabled:opacity-60">
        {submitting ? 'Saving...' : 'Save Profile'}
      </button>
    </form>
  );
}

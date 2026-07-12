import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function RegisterPage() {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', phone: '', gender: '', dob: '', educationLevel: '', collegeName: '', cgpa: '', location: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await api.post('/api/auth/register', form);
      setSuccess('Registration successful. Please login.');
      setTimeout(() => navigate('/login'), 1000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 py-8">
      <div className="mx-auto max-w-2xl rounded-xl bg-white p-8 shadow-lg">
        <h2 className="text-2xl font-semibold mb-2">Create account</h2>
        <p className="text-sm text-slate-500 mb-6">Join the AI-enhanced career guidance platform</p>
        {error && <div className="mb-4 rounded bg-red-100 p-2 text-sm text-red-700">{error}</div>}
        {success && <div className="mb-4 rounded bg-green-100 p-2 text-sm text-green-700">{success}</div>}
        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
          <input className="border rounded px-3 py-2" name="firstName" placeholder="First name" value={form.firstName} onChange={handleChange} required />
          <input className="border rounded px-3 py-2" name="lastName" placeholder="Last name" value={form.lastName} onChange={handleChange} required />
          <input className="border rounded px-3 py-2 md:col-span-2" name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
          <input className="border rounded px-3 py-2 md:col-span-2" name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
          <input className="border rounded px-3 py-2" name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} />
          <input className="border rounded px-3 py-2" name="gender" placeholder="Gender" value={form.gender} onChange={handleChange} />
          <input className="border rounded px-3 py-2" name="dob" type="date" value={form.dob} onChange={handleChange} />
          <input className="border rounded px-3 py-2" name="educationLevel" placeholder="Education level" value={form.educationLevel} onChange={handleChange} />
          <input className="border rounded px-3 py-2" name="collegeName" placeholder="College name" value={form.collegeName} onChange={handleChange} />
          <input className="border rounded px-3 py-2" name="cgpa" type="number" step="0.01" placeholder="CGPA" value={form.cgpa} onChange={handleChange} />
          <input className="border rounded px-3 py-2" name="location" placeholder="Location" value={form.location} onChange={handleChange} />
          <div className="md:col-span-2">
            <button className="w-full rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-60" disabled={loading}>{loading ? 'Creating account...' : 'Register'}</button>
          </div>
        </form>
        <p className="mt-4 text-sm">
          Already have an account? <Link to="/login" className="text-blue-600">Login</Link>
        </p>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await api.post('/api/auth/login', form);
      login({
        id: res.data.id,
        email: res.data.email,
        firstName: res.data.firstName,
        lastName: res.data.lastName,
        roles: res.data.roles,
      }, res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
        <h2 className="text-2xl font-semibold mb-2">Sign in</h2>
        <p className="text-sm text-slate-500 mb-6">Access your career guidance dashboard</p>
        {error && <div className="mb-4 rounded bg-red-100 p-2 text-sm text-red-700">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input className="w-full border rounded px-3 py-2" name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
          <input className="w-full border rounded px-3 py-2" name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
          <button className="w-full rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-60" disabled={loading}>{loading ? 'Signing in...' : 'Login'}</button>
        </form>
        <div className="mt-4 flex justify-between text-sm">
          <Link to="/register" className="text-blue-600">Create account</Link>
          <Link to="/forgot-password" className="text-blue-600">Forgot password?</Link>
        </div>
      </div>
    </div>
  );
}

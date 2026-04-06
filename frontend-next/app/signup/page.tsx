'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '../../lib/api';
import { UserPlus, AlertCircle, ArrowRight } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await apiFetch('/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ name, email, password, role }),
      });
      window.localStorage.setItem('token', response.token);
      window.localStorage.setItem('user', JSON.stringify(response.user));
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="page-section">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Create Account</p>
          <h2>Deploy a recruiter identity</h2>
        </div>
      </div>

      <div className="card">
        {error && (
          <div className="badge badge-danger" style={{ marginBottom: '1rem' }}>
            <AlertCircle size={18} /> {error}
          </div>
        )}
        <form className="field-group" onSubmit={handleSubmit}>
          <div className="field-group">
            <label>Full name</label>
            <input
              className="input"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Jane Recruiter"
            />
          </div>
          <div className="field-group">
            <label>Email address</label>
            <input
              className="input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="name@company.com"
            />
          </div>
          <div className="field-group">
            <label>Password</label>
            <input
              className="input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Min 8 characters"
            />
          </div>
          <div className="field-group">
            <label>Role</label>
            <select className="select" value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="user">Recruiter</option>
              <option value="admin">Administrator</option>
            </select>
          </div>
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? 'Deploying...' : 'Create Account'} <UserPlus size={16} />
          </button>
        </form>
        <p style={{ marginTop: '1rem', color: '#64748b' }}>
          Already have access? <a href="/login">Sign in now</a>
        </p>
      </div>
    </section>
  );
}

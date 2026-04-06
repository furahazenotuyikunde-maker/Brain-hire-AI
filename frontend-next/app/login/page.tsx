'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '../../lib/api';
import { ShieldCheck, AlertCircle, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await apiFetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      window.localStorage.setItem('token', response.token);
      window.localStorage.setItem('user', JSON.stringify(response.user));
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="page-section">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Secure Login</p>
          <h2>Recruiter access</h2>
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
              placeholder="••••••••"
            />
          </div>
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? 'Authorizing...' : 'Login to Dashboard'} <ArrowRight size={16} />
          </button>
        </form>
        <p style={{ marginTop: '1rem', color: '#64748b' }}>
          New user? <a href="/signup">Create recruiter account</a>
        </p>
      </div>
    </section>
  );
}

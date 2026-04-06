'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Home, LayoutDashboard, UploadCloud, LogOut, ShieldCheck } from 'lucide-react';

export default function Navbar() {
  const [userName, setUserName] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const stored = window.localStorage.getItem('user');
    if (!stored) return;
    try {
      const parsed = JSON.parse(stored);
      setUserName(parsed.name);
      setRole(parsed.role);
    } catch {
      setUserName(null);
      setRole(null);
    }
  }, []);

  const handleLogout = () => {
    window.localStorage.removeItem('token');
    window.localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <header className="card navbar">
      <div className="brand-group">
        <div>
          <p className="eyebrow">BrainHire AI</p>
          <h1>Recruiter Portal</h1>
        </div>
      </div>

      <nav className="nav-links">
        <Link href="/" className="nav-item">
          <Home size={18} /> Home
        </Link>
        <Link href="/dashboard" className="nav-item">
          <LayoutDashboard size={18} /> Dashboard
        </Link>
        <Link href="/upload" className="nav-item">
          <UploadCloud size={18} /> Upload
        </Link>
      </nav>

      <div className="nav-actions">
        {userName ? (
          <>
            <span className="badge">{userName}</span>
            {role === 'admin' ? <span className="badge badge-success">Admin</span> : null}
            <button className="btn btn-secondary" onClick={handleLogout}>
              <LogOut size={16} /> Logout
            </button>
          </>
        ) : (
          <Link href="/login" className="btn btn-primary">
            Sign In
          </Link>
        )}
      </div>
    </header>
  );
}

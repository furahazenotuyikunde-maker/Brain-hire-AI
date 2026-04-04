import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileUp, ShieldCheck, BrainCircuit } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="glass sticky top-4 mx-4 z-50 flex items-center justify-between px-8 py-4 my-4">
      <Link to="/" className="flex items-center gap-3 no-underline">
        <div className="p-2 bg-indigo-600 rounded-lg">
          <BrainCircuit size={28} className="text-white" />
        </div>
        <span className="font-bold text-2xl tracking-tight text-white">BrainHireAI</span>
      </Link>

      <div className="flex items-center gap-6">
        <Link to="/dashboard" className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}>
          <LayoutDashboard size={18} /> Dashboard
        </Link>
        <Link to="/upload" className={`nav-link ${isActive('/upload') ? 'active' : ''}`}>
          <FileUp size={18} /> New Hire
        </Link>
        <Link to="/admin" className={`nav-link ${isActive('/admin') ? 'active' : ''}`}>
          <ShieldCheck size={18} /> Admin
        </Link>
        <button className="btn btn-secondary px-6">Login</button>
      </div>

      <style>{`
        .nav-link {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--text-muted);
          text-decoration: none;
          font-weight: 500;
          font-size: 0.95rem;
          transition: all 0.2s ease;
        }
        .nav-link:hover, .nav-link.active {
          color: white;
        }
        .nav-link.active {
          position: relative;
        }
        .nav-link.active::after {
          content: '';
          position: absolute;
          bottom: -8px;
          left: 0;
          width: 100%;
          height: 2px;
          background: var(--primary);
          border-radius: 2px;
        }
      `}</style>
    </nav>
  );
};

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container pb-20">
        {children}
      </main>
      <footer className="py-12 border-t border-white/5 opacity-50 mt-12 bg-black/20">
        <div className="container text-center">
          <p>© 2026 BrainHireAI — Intelligent Recruitment Platform</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;

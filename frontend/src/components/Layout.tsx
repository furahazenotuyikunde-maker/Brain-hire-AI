import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileUp, ShieldCheck, LogOut } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="glass sticky top-4 mx-4 z-50 flex items-center justify-between px-8 py-4 my-4 border-slate-200">
      <Link to="/" className="flex items-center gap-3 no-underline">
        <img src="/logo.png" alt="BrainHireAI" className="h-10 w-auto" />
      </Link>

      <div className="flex items-center gap-6">
        <Link to="/dashboard" className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}>
          <LayoutDashboard size={18} /> Dashboard
        </Link>
        <Link to="/upload" className={`nav-link ${isActive('/upload') ? 'active' : ''}`}>
          <FileUp size={18} /> New Hire
        </Link>
        {user?.role === 'admin' && (
          <Link to="/admin" className={`nav-link ${isActive('/admin') ? 'active' : ''}`}>
            <ShieldCheck size={18} /> Admin
          </Link>
        )}
        
        {user ? (
          <div className="flex items-center gap-4 ml-4 pl-4 border-l border-slate-200">
            <div className="flex flex-col items-end">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-tighter">Welcome</span>
              <span className="text-sm font-bold text-slate-900">{user.name}</span>
            </div>
            <button onClick={handleLogout} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors">
              <LogOut size={20} />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
             <Link to="/login" className="btn btn-secondary px-6">Login</Link>
             <Link to="/signup" className="btn btn-primary px-6">Sign Up</Link>
          </div>
        )}
      </div>

      <style>{`
        .nav-link {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--text-muted);
          text-decoration: none;
          font-weight: 600;
          font-size: 0.95rem;
          transition: all 0.2s ease;
        }
        .nav-link:hover, .nav-link.active {
          color: var(--text-main);
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
    <div className="min-h-screen bg-[var(--bg-main)]">
      <Navbar />
      <main className="container pb-20">
        {children}
      </main>
      <footer className="py-12 border-t border-slate-200 opacity-70 mt-12 bg-white">
        <div className="container text-center">
          <p className="text-slate-500 font-medium tracking-tight">© 2026 BrainHireAI — Intelligent Recruitment Platform</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;

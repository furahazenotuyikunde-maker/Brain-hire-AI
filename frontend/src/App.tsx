import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import JobUpload from './pages/JobUpload';
import Results from './pages/Results';
import Login from './pages/Login';
import Signup from './pages/Signup';

// Admin Panel Mock Component (Until we build the full one)
const Admin = () => {
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    
    if (!user || user.role !== 'admin') {
        return <Navigate to="/dashboard" />;
    }

    return (
        <div className="pt-24 flex flex-col items-center justify-start min-h-[80vh] space-y-12 animate-fade-in text-center max-w-5xl mx-auto pb-32">
            <div className="p-8 bg-indigo-600/10 rounded-full shadow-lg shadow-indigo-100/20 border border-slate-100">
                <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center m-auto shadow-indigo-500/40">
                    <h1 className="text-white text-3xl font-black">A</h1>
                </div>
            </div>
            <h1 className="text-6xl font-black leading-tight bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-600 bg-clip-text text-transparent tracking-tighter">
                Control Center
            </h1>
            <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-3xl">
                Configure organization settings, manage user permissions, and customize AI intelligence models from the BrainHireAI control center.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full pt-12">
                <div className="glass p-10 bg-white/50 border-slate-200 space-y-4 hover:border-indigo-500/30 transition-all cursor-pointer">
                    <h3 className="text-2xl font-bold text-slate-900 leading-none">User Deployment</h3>
                    <p className="text-slate-500 font-medium leading-relaxed">Manage recruiter access and team permissions across the platform.</p>
                </div>
                <div className="glass p-10 bg-white/50 border-slate-200 space-y-4 hover:border-indigo-500/30 transition-all cursor-pointer">
                    <h3 className="text-2xl font-bold text-slate-900 leading-none">Neural Model Heuristics</h3>
                    <p className="text-slate-500 font-medium leading-relaxed">Fine-tune ranking heuristics and keyword sensitivity for better results.</p>
                </div>
            </div>
        </div>
    );
};

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/upload" element={<JobUpload />} />
          <Route path="/results" element={<Results />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;

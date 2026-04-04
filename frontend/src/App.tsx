import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import JobUpload from './pages/JobUpload';
import Results from './pages/Results';

const Admin = () => (
  <div className="pt-16 flex flex-col items-center justify-start min-h-[80vh] space-y-12 animate-fade-in text-center max-w-4xl mx-auto">
    <div className="p-8 bg-indigo-600/10 rounded-full">
      <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center m-auto shadow-indigo-500/40">
        <h1 className="text-white text-3xl font-black">A</h1>
      </div>
    </div>
    <h1 className="text-6xl font-black leading-tight bg-gradient-to-br from-white via-white to-indigo-400 bg-clip-text text-transparent">
      Admin Portal
    </h1>
    <p className="text-xl text-slate-400 font-light leading-relaxed">
      Configure organization settings, manage user permissions, and customize AI intelligence models from the BrainHireAI control center.
    </p>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full pt-12">
        <div className="glass p-10 border-white/5 space-y-4">
            <h3 className="text-2xl font-bold">User Management</h3>
            <p className="text-slate-500">Manage recruiter access and team permissions across the platform.</p>
        </div>
        <div className="glass p-10 border-white/5 space-y-4">
            <h3 className="text-2xl font-bold">AI Model Settings</h3>
            <p className="text-slate-500">Fine-tune ranking heuristics and keyword sensitivity for better results.</p>
        </div>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
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

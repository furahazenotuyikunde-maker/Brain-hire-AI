import { ArrowRight, BrainCircuit, ShieldCheck, Zap, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center pt-24 animate-fade-in pb-32">
      {/* Badge */}
      <div className="inline-flex items-center gap-3 px-4 py-2 bg-white border border-slate-200 text-slate-500 text-xs font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-indigo-100/20 mb-12">
        <span className="flex h-2 w-2 rounded-full bg-indigo-600 animate-pulse"></span>
        Enterprise Neural Ranking Engine v4.0
      </div>

      {/* Hero Section */}
      <div className="text-center space-y-10 max-w-5xl px-4 relative">
        <h1 className="text-8xl font-black leading-none tracking-tighter text-slate-900 overflow-visible py-4">
           Evaluate <span className="bg-gradient-to-br from-indigo-600 via-indigo-500 to-indigo-800 bg-clip-text text-transparent">Talent</span> <br/>
           With Precision.
        </h1>
        <p className="text-2xl text-slate-500 font-medium leading-relaxed max-w-3xl mx-auto tracking-tight">
          Eliminate manual screening. Deploy our neural ranking protocol to identify high-quality matches across candidate dossiers within seconds.
        </p>

        <div className="flex flex-col md:flex-row items-center justify-center gap-6 pt-10">
          <button 
            onClick={() => navigate('/upload')} 
            className="btn btn-primary px-16 py-7 text-2xl font-black shadow-indigo-200 group"
          >
            Start Neural Scan <ArrowRight className="ml-3 group-hover:translate-x-2 transition-transform" />
          </button>
          <button 
            onClick={() => navigate('/dashboard')}
            className="btn btn-secondary px-12 py-7 text-2xl font-black border-slate-200 bg-white hover:bg-slate-50"
          >
            Access Portal <ArrowUpRight className="ml-3 text-slate-400" />
          </button>
        </div>
      </div>

      {/* Trust Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-32 w-full max-w-7xl px-4">
         <div className="glass p-12 bg-white border-slate-200 shadow-xl shadow-indigo-100/20 space-y-8 flex flex-col group hover:border-indigo-500/30 transition-all">
            <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center border border-indigo-100 group-hover:bg-indigo-600 group-hover:rotate-12 transition-all">
                <BrainCircuit size={32} className="text-indigo-600 group-hover:text-white transition-colors" />
            </div>
            <div className="space-y-4">
                <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-none">Neural Ranking</h3>
                <p className="text-slate-500 font-medium leading-relaxed">Advanced NLP parsing designed to understand technical expertise nuances better than standard keyword matching.</p>
            </div>
            <div className="flex items-center gap-2 text-indigo-600 font-black text-sm uppercase tracking-widest pt-4">
                Explore Tech <ArrowRight size={16} />
            </div>
         </div>

         <div className="glass p-12 bg-white border-slate-200 shadow-xl shadow-indigo-100/20 space-y-8 flex flex-col group hover:border-indigo-500/30 transition-all">
            <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center border border-emerald-100 group-hover:bg-emerald-600 group-hover:-rotate-12 transition-all">
                <ShieldCheck size={32} className="text-emerald-600 group-hover:text-white transition-colors" />
            </div>
            <div className="space-y-4">
                <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-none">Secure Dossiers</h3>
                <p className="text-slate-500 font-medium leading-relaxed">Enterprise-grade security for candidate data. All dossiers are encrypted and managed with strict access controls.</p>
            </div>
            <div className="flex items-center gap-2 text-emerald-600 font-black text-sm uppercase tracking-widest pt-4">
                Security Brief <ArrowRight size={16} />
            </div>
         </div>

         <div className="glass p-12 bg-white border-slate-200 shadow-xl shadow-indigo-100/20 space-y-8 flex flex-col group hover:border-indigo-500/30 transition-all">
            <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center border border-amber-100 group-hover:bg-amber-600 group-hover:scale-110 transition-all">
                <Zap size={32} className="text-amber-600 group-hover:text-white transition-colors" />
            </div>
            <div className="space-y-4">
                <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-none">Instant Velocity</h3>
                <p className="text-slate-500 font-medium leading-relaxed">From upload to insights in under 3 seconds. Scale your recruitment velocity without increasing headcount.</p>
            </div>
            <div className="flex items-center gap-2 text-amber-600 font-black text-sm uppercase tracking-widest pt-4">
                View Benchmarks <ArrowRight size={16} />
            </div>
         </div>
      </div>

      {/* Proof Section */}
      <div className="mt-40 text-center space-y-16 max-w-4xl px-4">
         <h2 className="text-5xl font-black text-slate-800 tracking-tighter">Accelerating Talent Streams</h2>
          <div className="flex flex-wrap items-center justify-center gap-x-20 gap-y-10">
             <img src="/logo.png" alt="BrainHireAI Logo" className="h-20 grayscale hover:grayscale-0 transition-all opacity-80 hover:opacity-100" />
             <div className="text-2xl font-black text-slate-700 font-outfit uppercase tracking-widest border-l border-slate-200 pl-8">Enterprise Ranking Protocol</div>
         </div>
      </div>

      {/* CTA Footer */}
      <div className="mt-40 w-full glass p-20 bg-indigo-600 border-indigo-500 shadow-2xl shadow-indigo-200 flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-20 opacity-10 rotate-12">
              <BrainCircuit size={300} className="text-white" />
          </div>
          <div className="space-y-6 relative z-10">
              <h2 className="text-6xl font-black text-white tracking-tighter leading-none">Ready to automate <br/>candidate ranking?</h2>
              <div className="grid grid-cols-2 gap-6 pt-4 text-white/80 font-bold">
                 <div className="flex items-center gap-3"><CheckCircle2 size={24} /> Automated Batch Scans</div>
                 <div className="flex items-center gap-3"><CheckCircle2 size={24} /> AI Rationale Generation</div>
                 <div className="flex items-center gap-3"><CheckCircle2 size={24} /> Enterprise DB Migration</div>
                 <div className="flex items-center gap-3"><CheckCircle2 size={24} /> High-Precision Ranking</div>
              </div>
          </div>
          <div className="relative z-10 w-full md:w-auto">
             <button onClick={() => navigate('/signup')} className="btn bg-white text-indigo-600 px-16 py-8 text-3xl font-black rounded-3xl shadow-xl shadow-black/10 hover:bg-slate-50 transition-colors w-full uppercase tracking-tighter">
                Deploy Account <ArrowRight className="ml-4" />
             </button>
             <p className="text-center text-indigo-200 mt-6 font-bold text-lg">No configuration fees. Instant deployment.</p>
          </div>
      </div>
    </div>
  );
};

export default Home;

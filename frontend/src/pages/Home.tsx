import { ArrowRight, Users, Target, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="relative pt-24 pb-32 overflow-hidden animate-fade-in group">
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/30 blur-[130px] rounded-full -z-10 group-hover:bg-indigo-600/40 transition-all duration-500"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-600/20 blur-[110px] rounded-full -z-10 group-hover:bg-purple-600/30 transition-all duration-500"></div>

      <div className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 border border-indigo-500/30 rounded-full bg-indigo-500/10 text-indigo-300 font-medium text-sm animate-pulse">
           Recruiting at the speed of intelligence
        </div>

        <h1 className="text-6xl md:text-8xl font-black leading-tight bg-gradient-to-br from-white via-white to-indigo-400 bg-clip-text text-transparent">
          Hire Smarter, <br/><span className="text-indigo-400">Score Brighter</span>
        </h1>

        <p className="text-xl md:text-2xl text-slate-400 font-light leading-relaxed max-w-2xl">
          The ultimate platform for modern HR teams. Upload CVs, parse data, and rank candidates using advanced intelligence.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-6 pt-4">
          <Link to="/upload" className="btn btn-primary px-10 py-5 text-lg group">
            Start New Ranking <ArrowRight id="arrow" className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link to="/dashboard" className="btn btn-secondary px-10 py-5 text-lg">
            View Dashboard
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-32 w-full">
          {[
            { icon: Users, title: "Batch Processing", desc: "Upload and analyze hundreds of resumes in seconds." },
            { icon: Target, title: "Precision Ranking", desc: "Our heuristic engine identifies the best fit for your JD." },
            { icon: ShieldCheck, title: "Unbiased Selection", desc: "Standardized scoring reduces manual screening bias." }
          ].map((feature, i) => (
            <div key={i} className="glass p-10 hover:border-indigo-500/50 transition-all duration-300 group">
              <div className="mb-6 w-14 h-14 bg-indigo-600/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <feature.icon className="text-indigo-400" size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
              <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
      
      <style>{`
        #arrow {
          margin-left: 10px;
        }
      `}</style>
    </section>
  );
};

export default Hero;

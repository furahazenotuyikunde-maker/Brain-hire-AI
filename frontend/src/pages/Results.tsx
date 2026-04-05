import { useEffect, useState } from 'react';
import { Award, TrendingUp, Search, Filter, Info, Mail, ExternalLink, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

interface Candidate {
  candidateName: string;
  score: number;
  reasoning: string;
  matchedKeywords: string[];
  email: string;
  status: string;
  analysis?: {
      strengths: string;
      gaps: string;
  };
}

interface AnalysisResult {
  jobTitle: string;
  totalAnalyzed: number;
  candidates: Candidate[];
}

const Results = () => {
    const [results, setResults] = useState<AnalysisResult | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

    useEffect(() => {
        const stored = localStorage.getItem('latest_results');
        if (stored) {
            const data = JSON.parse(stored);
            // Sorting by score to get Rank
            data.candidates.sort((a: any, b: any) => b.score - a.score);
            setResults(data);
        }
    }, []);

    const getVerdict = (score: number) => {
        if (score >= 90) return { text: 'Strong Hire', style: 'bg-emerald-100 text-emerald-600 border-emerald-200' };
        if (score >= 75) return { text: 'Hire', style: 'bg-indigo-100 text-indigo-600 border-indigo-200' };
        if (score >= 50) return { text: 'Maybe', style: 'bg-amber-100 text-amber-600 border-amber-200' };
        return { text: 'No Hire', style: 'bg-rose-100 text-rose-600 border-rose-200' };
    };

    if (!results) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
                <Search size={64} className="text-slate-300" />
                <h1 className="text-4xl font-black text-slate-900">No Active Analysis</h1>
                <p className="text-slate-500 font-medium max-w-md mx-auto">Start by uploading candidate dossiers in the Recruit round.</p>
                <div className="pt-6">
                    <a href="/upload" className="btn btn-primary px-12 py-5 text-lg">Start Scan Now</a>
                </div>
            </div>
        );
    }

    const filteredCandidates = results.candidates.filter(c => 
        c.candidateName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="pt-16 max-w-7xl mx-auto space-y-12 animate-fade-in pb-32">
            <header className="flex flex-col md:flex-row items-end justify-between gap-6 mb-12">
                <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 text-slate-500 text-xs font-bold uppercase tracking-widest rounded-lg shadow-sm">
                        <ShieldCheck size={14} className="text-indigo-600" /> Authorized Ranking Report
                    </div>
                    <h1 className="text-5xl font-black text-slate-900 tracking-tighter">{results.jobTitle || 'Role Overview'}</h1>
                    <p className="text-slate-500 text-xl font-medium max-w-2xl leading-relaxed">Analyzed {results.totalAnalyzed} candidate profiles against role specifications.</p>
                </div>
                
                <div className="flex gap-4">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                        <input 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Find candidate..." 
                            className="bg-white border border-slate-200 px-12 py-4 rounded-xl focus:outline-none focus:border-indigo-500/50 w-64 text-slate-800 font-bold"
                        />
                    </div>
                    <button className="btn btn-secondary py-4 px-6 border-slate-200 bg-white"><Filter size={18} /> Filters</button>
                </div>
            </header>

            <div className="glass overflow-hidden border-slate-200 bg-white shadow-2xl shadow-indigo-100/30">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-slate-100 bg-slate-50/50">
                            <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Rank</th>
                            <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Candidate</th>
                            <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Score</th>
                            <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest w-[25%]">Strengths</th>
                            <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest w-[25%]">Gaps</th>
                            <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Verdict</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {filteredCandidates.map((c, i) => {
                            const verdict = getVerdict(c.score);
                            return (
                                <tr 
                                    key={i} 
                                    className={`hover:bg-slate-50/80 transition-all cursor-pointer group ${selectedCandidate?.candidateName === c.candidateName ? 'bg-indigo-50/50' : 'bg-white'}`}
                                    onClick={() => setSelectedCandidate(c)}
                                >
                                    <td className="px-8 py-10">
                                        <span className="text-3xl font-black text-indigo-600 tracking-tighter transition-all group-hover:scale-110 block">
                                            #{i + 1}
                                        </span>
                                    </td>
                                    <td className="px-8 py-10">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-all tracking-tight leading-none">{c.candidateName}</span>
                                            <span className="text-xs text-slate-400 font-bold tracking-tight lowercase">{c.email || `${c.candidateName.toLowerCase().replace(' ','.')}@example.com`}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-10">
                                        <div className="flex items-center gap-4">
                                            <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-50">
                                                <motion.div 
                                                    initial={{ width: 0 }} 
                                                    animate={{ width: `${c.score}%` }} 
                                                    transition={{ duration: 1.2, delay: i * 0.1 }}
                                                    className={`h-full rounded-full ${c.score > 75 ? 'bg-emerald-500' : c.score > 40 ? 'bg-indigo-500' : 'bg-amber-500'}`}
                                                />
                                            </div>
                                            <span className="font-black text-2xl text-slate-800 tracking-tighter">
                                                {c.score}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-10">
                                        <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-[250px]">
                                            {c.analysis?.strengths || `Candidate shows technical proficiency in core role matching metrics.`}
                                        </p>
                                    </td>
                                    <td className="px-8 py-10">
                                        <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-[250px]">
                                            {c.analysis?.gaps || `Minimal technical deviations identified.`}
                                        </p>
                                    </td>
                                    <td className="px-8 py-10">
                                        <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-tighter border whitespace-nowrap shadow-sm ${verdict.style}`}>
                                            {verdict.text}
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Sticky Detailed Analysis Sidebar (Same logic if selected) */}
            {selectedCandidate && (
                <div className="fixed inset-y-0 right-0 w-1/3 bg-white border-l border-slate-200 shadow-2xl p-12 z-[101] animate-slide-in overflow-y-auto">
                    <button onClick={() => setSelectedCandidate(null)} className="absolute top-6 right-6 p-2 bg-slate-50 rounded-lg text-slate-400 hover:text-slate-900 transition-colors">
                        <Search size={24} className="rotate-45" />
                    </button>
                    <div className="space-y-10">
                        <div className="flex items-start justify-between border-b border-slate-100 pb-8">
                            <div className="space-y-2">
                                <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-none">{selectedCandidate.candidateName}</h2>
                                <p className="text-slate-400 font-bold tracking-tight">{selectedCandidate.email}</p>
                            </div>
                            <div className="p-4 bg-emerald-50 text-emerald-600 rounded-3xl border border-emerald-100 shadow-sm">
                                <Award size={32} />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Matching Rationale</h4>
                            <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100 leading-relaxed text-xl font-medium text-slate-700 italic">
                                "{selectedCandidate.reasoning}"
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Identified Expertise</h4>
                            <div className="flex flex-wrap gap-2">
                                {selectedCandidate.matchedKeywords.map((k, i) => (
                                    <span key={i} className="px-4 py-2 bg-white border border-slate-200 text-slate-900 text-sm font-bold rounded-xl shadow-sm">
                                        {k}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="pt-10 space-y-4">
                            <button className="btn btn-primary w-full py-6 text-2xl font-black shadow-indigo-100">Contact Candidate</button>
                            <p className="text-center text-sm font-bold text-slate-400 flex items-center justify-center gap-2 cursor-pointer hover:text-slate-900 transition-colors">
                                <ExternalLink size={14} /> Full Dossier Profile
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Results;

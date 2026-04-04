import React, { useEffect, useState } from 'react';
import { Award, TrendingUp, TrendingDown, Info, Table, LayoutGrid, CheckCircle, Search, Filter, Mail, Phone, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

interface Candidate {
  candidateName: string;
  score: number;
  reasoning: string;
  matchedKeywords: string[];
  email: string;
  status: string;
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
            setResults(JSON.parse(stored));
        }
    }, []);

    if (!results) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
                <div className="p-8 bg-indigo-600/10 rounded-full animate-pulse">
                    <Search size={64} className="text-indigo-400" />
                </div>
                <h1 className="text-4xl font-black">No Active Analysis</h1>
                <p className="text-slate-400 text-lg max-w-md mx-auto">You haven't scanned any candidates yet. Start by uploading a job description and resumes.</p>
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
        <div className="pt-16 max-w-7xl mx-auto space-y-12 animate-fade-in">
            <header className="flex flex-col md:flex-row items-end justify-between gap-6 mb-12">
                <div className="space-y-3">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-widest rounded-lg">
                        Intelligence Scan Results
                    </div>
                    <h1 className="text-5xl font-black">{results.jobTitle || 'Role Ranking Overview'}</h1>
                    <p className="text-slate-400 text-xl font-light">Analyzed {results.totalAnalyzed} candidate profiles against role requirements.</p>
                </div>
                
                <div className="flex gap-4">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <input 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Find candidate..." 
                            className="bg-white/5 border border-white/10 px-12 py-4 rounded-xl focus:outline-none focus:border-indigo-500/50 w-64"
                        />
                    </div>
                    <button className="btn btn-secondary py-4 px-6 border-white/10"><Filter size={18} /> Filters</button>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Table Section */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="glass overflow-hidden border-white/5">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/5 bg-white/5">
                                    <th className="px-10 py-6 text-sm font-bold text-slate-400 uppercase tracking-widest">Rank</th>
                                    <th className="px-10 py-6 text-sm font-bold text-slate-400 uppercase tracking-widest">Candidate Profile</th>
                                    <th className="px-10 py-6 text-sm font-bold text-slate-400 uppercase tracking-widest">AI Relevance Score</th>
                                    <th className="px-10 py-6 text-sm font-bold text-slate-400 uppercase tracking-widest">Aptitude Match</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredCandidates.map((c, i) => (
                                    <tr 
                                        key={i} 
                                        className={`hover:bg-white/5 transition-colors cursor-pointer group ${selectedCandidate?.candidateName === c.candidateName ? 'bg-indigo-600/5' : ''}`}
                                        onClick={() => setSelectedCandidate(c)}
                                    >
                                        <td className="px-10 py-8">
                                            <div className="flex items-center gap-4">
                                                <span className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-xl 
                                                    ${i === 0 ? 'bg-amber-400/20 text-amber-500' : 'bg-slate-700/20 text-slate-400'}`}>
                                                    {i + 1}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="flex flex-col">
                                                <span className="text-xl font-bold group-hover:text-indigo-400 transition-all">{c.candidateName}</span>
                                                <span className="text-sm text-slate-500 font-medium">Software Engineering Dept.</span>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="flex items-center gap-4">
                                                <div className="flex-grow h-2 bg-slate-800 rounded-full overflow-hidden w-32">
                                                    <motion.div 
                                                        initial={{ width: 0 }} 
                                                        animate={{ width: `${c.score}%` }} 
                                                        transition={{ duration: 1, delay: i * 0.1 }}
                                                        className={`h-full rounded-full ${c.score > 70 ? 'bg-emerald-500' : c.score > 40 ? 'bg-amber-500' : 'bg-rose-500'}`}
                                                    />
                                                </div>
                                                <span className={`font-black text-2xl ${c.score > 70 ? 'text-emerald-400' : c.score > 40 ? 'text-amber-400' : 'text-rose-400'}`}>
                                                    {c.score}%
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="flex items-center gap-2">
                                                {c.score > 60 ? <TrendingUp size={20} className="text-emerald-400" /> : <TrendingDown size={20} className="text-rose-400" />}
                                                <span className="font-semibold">{c.score > 60 ? 'Positive Match' : 'Gap in Expertise'}</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Details Sidebar */}
                <div className="space-y-6">
                    <div className="glass p-10 sticky top-32 border-indigo-500/10 min-h-[600px] flex flex-col">
                        {!selectedCandidate ? (
                            <div className="h-full flex flex-col items-center justify-center text-center opacity-50 space-y-4 m-auto">
                                <Info size={48} className="mb-4" />
                                <h3 className="text-2xl font-bold leading-tight">Select a candidate <br/>for deeper analysis</h3>
                                <p className="text-slate-400">View reasoning, skills breakdown, and recommended next steps.</p>
                            </div>
                        ) : (
                            <div className="animate-fade-in h-6 w-full flex flex-col flex-grow">
                                <div className="space-y-8 flex flex-col flex-grow">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h2 className="text-3xl font-black mb-1">{selectedCandidate.candidateName}</h2>
                                            <div className="flex items-center gap-4 mt-4">
                                                <a href="#" className="flex items-center gap-2 text-indigo-400 text-sm font-bold no-underline hover:underline"><Mail size={16}/> Email</a>
                                                <a href="#" className="flex items-center gap-2 text-indigo-400 text-sm font-bold no-underline hover:underline"><Phone size={16}/> Interview</a>
                                            </div>
                                        </div>
                                        <div className={`p-4 rounded-2xl ${selectedCandidate.score > 70 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-500/10 text-slate-400'}`}>
                                            <Award size={32} />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">AI Matching Rationale</h4>
                                        <div className="p-6 bg-white/5 rounded-2xl border border-white/5 leading-relaxed text-lg">
                                            {selectedCandidate.reasoning}
                                        </div>
                                    </div>

                                    <div className="space-y-4 flex-grow">
                                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Matched Expertise Tags</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedCandidate.matchedKeywords.length > 0 ? (
                                                selectedCandidate.matchedKeywords.slice(0, 15).map((word, i) => (
                                                    <span key={i} className="px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-bold rounded-full">
                                                        {word}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-slate-500 text-sm">No significant skill matches found.</span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="pt-8 border-t border-white/5 mt-auto">
                                        <button className="btn btn-primary w-full py-5 text-xl font-bold shadow-indigo-500/30">Schedule Interview</button>
                                        <p className="text-center text-sm text-slate-500 mt-4 font-medium flex items-center justify-center gap-2 cursor-pointer hover:text-white transition-colors">
                                            <ExternalLink size={14}/> View Full CV Profile
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Results;

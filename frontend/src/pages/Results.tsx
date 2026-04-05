import { useEffect, useState } from 'react';
import { Award, TrendingUp, TrendingDown, Info, Search, Filter, Mail, Phone, ExternalLink, ShieldCheck, Download, Trash2 } from 'lucide-react';
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
            <div className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-8 animate-fade-in">
                <div className="p-12 bg-indigo-50 rounded-full animate-pulse border border-indigo-100 shadow-xl shadow-indigo-100/30">
                    <Search size={80} className="text-indigo-400" />
                </div>
                <div className="space-y-4">
                    <h1 className="text-5xl font-black text-slate-900 tracking-tighter">No Active Neural Scan</h1>
                    <p className="text-slate-500 text-xl font-medium max-w-lg mx-auto leading-relaxed">The ranking engine is idle. Start by deploying a role requirement and uploading candidate dossier batches.</p>
                </div>
                <div className="pt-8">
                    <a href="/upload" className="btn btn-primary px-16 py-6 text-2xl font-black shadow-indigo-100">Initialize Scan Now</a>
                </div>
            </div>
        );
    }

    const filteredCandidates = results.candidates.filter(c => 
        c.candidateName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="pt-16 max-w-7xl mx-auto space-y-12 animate-fade-in pb-32">
            <header className="flex flex-col md:flex-row items-end justify-between gap-8 mb-12">
                <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 text-slate-500 text-xs font-bold uppercase tracking-widest rounded-lg shadow-sm">
                        <ShieldCheck size={14} className="text-indigo-600" /> Authorized Neural Map Report
                    </div>
                    <h1 className="text-6xl font-black text-slate-900 tracking-tighter overflow-hidden text-ellipsis line-clamp-1">{results.jobTitle || 'Role Ranking Overview'}</h1>
                    <p className="text-slate-500 text-xl font-medium max-w-2xl leading-relaxed">Analyzed {results.totalAnalyzed} candidate profiles against role specifications with 96.4% precision.</p>
                </div>
                
                <div className="flex gap-4 items-center">
                    <div className="relative group shadow-sm">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
                        <input 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Find candidate by identity..." 
                            className="bg-white border border-slate-200 px-12 py-5 rounded-2xl focus:outline-none focus:border-indigo-500/50 w-80 text-lg font-bold text-slate-900 transition-all"
                        />
                    </div>
                    <button className="btn btn-secondary py-5 px-8 border-slate-200 bg-white"><Filter size={20} /> Filters</button>
                    <button className="p-3 hover:bg-slate-100 rounded-2xl text-slate-400 transition-colors border border-slate-100">
                        <Download size={24} />
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Table Section */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="glass overflow-hidden border-slate-200 bg-white shadow-xl shadow-indigo-100/20">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-100 bg-slate-50/50">
                                    <th className="px-10 py-6 text-xs font-black text-slate-400 uppercase tracking-widest">Rank</th>
                                    <th className="px-10 py-6 text-xs font-black text-slate-400 uppercase tracking-widest">Candidate Identity</th>
                                    <th className="px-10 py-6 text-xs font-black text-slate-400 uppercase tracking-widest">AI Relevance Index</th>
                                    <th className="px-10 py-6 text-xs font-black text-slate-400 uppercase tracking-widest">Match Quality</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filteredCandidates.map((c, i) => (
                                    <tr 
                                        key={i} 
                                        className={`hover:bg-slate-50/80 transition-all cursor-pointer group ${selectedCandidate?.candidateName === c.candidateName ? 'bg-indigo-50/50' : 'bg-white'}`}
                                        onClick={() => setSelectedCandidate(c)}
                                    >
                                        <td className="px-10 py-8">
                                            <div className="flex items-center gap-4">
                                                <span className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-2xl border
                                                    ${i === 0 ? 'bg-amber-400 shadow-lg shadow-amber-200/50 text-white border-amber-500' : 'bg-slate-50 text-slate-400 border-slate-100'}`}>
                                                    {i + 1}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-2xl font-black text-slate-900 group-hover:text-indigo-600 transition-all tracking-tight leading-none">{c.candidateName}</span>
                                                <span className="text-xs text-slate-500 font-bold uppercase tracking-widest">Expertise Match Protocol</span>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="flex items-center gap-5">
                                                <div className="flex-grow h-3 bg-slate-100 rounded-full overflow-hidden w-40 border border-slate-50 shadow-inner">
                                                    <motion.div 
                                                        initial={{ width: 0 }} 
                                                        animate={{ width: `${c.score}%` }} 
                                                        transition={{ duration: 1.2, delay: i * 0.1 }}
                                                        className={`h-full rounded-full shadow-lg ${c.score > 70 ? 'bg-emerald-500' : c.score > 40 ? 'bg-amber-500' : 'bg-rose-500'}`}
                                                    />
                                                </div>
                                                <span className={`font-black text-3xl tracking-tighter ${c.score > 70 ? 'text-emerald-600' : c.score > 40 ? 'text-amber-600' : 'text-rose-600'}`}>
                                                    {c.score}%
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="flex items-center gap-3">
                                                {c.score > 60 ? 
                                                    <div className="bg-emerald-50 text-emerald-600 p-2 rounded-lg border border-emerald-100"><TrendingUp size={24} /></div> : 
                                                    <div className="bg-rose-50 text-rose-600 p-2 rounded-lg border border-rose-100"><TrendingDown size={24} /></div>
                                                }
                                                <span className="font-bold text-slate-700 text-lg">{c.score > 60 ? 'High Match' : 'Gap in Profile'}</span>
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
                    <div className="glass p-12 sticky top-32 border-slate-200 bg-white shadow-2xl shadow-indigo-100/50 min-h-[700px] flex flex-col justify-between">
                        {!selectedCandidate ? (
                            <div className="h-full flex flex-col items-center justify-center text-center opacity-60 space-y-6 m-auto">
                                <div className="p-8 bg-slate-50 rounded-full border border-slate-100">
                                   <Info size={56} className="text-slate-300" />
                                </div>
                                <div className="space-y-3">
                                    <h3 className="text-3xl font-black text-slate-900 tracking-tight leading-none">Select Profile for <br/>Neural Breakdown</h3>
                                    <p className="text-slate-500 text-lg font-medium leading-relaxed">Examine AI-generated matching rationale and expertise mapping.</p>
                                </div>
                            </div>
                        ) : (
                            <div className="animate-fade-in flex flex-col flex-grow">
                                <div className="space-y-10 flex flex-col flex-grow">
                                    <div className="flex items-start justify-between pb-8 border-b border-slate-100">
                                        <div className="space-y-4">
                                            <h2 className="text-4xl font-black text-slate-900 tracking-tighter leading-none">{selectedCandidate.candidateName}</h2>
                                            <div className="flex items-center gap-4">
                                                <a href="#" className="flex items-center gap-2 text-indigo-600 text-sm font-black no-underline hover:text-indigo-800 transition-colors bg-indigo-50 px-4 py-2 rounded-xl border border-indigo-100"><Mail size={16}/> Email</a>
                                                <button className="flex items-center gap-2 text-slate-500 text-sm font-black hover:text-slate-900 transition-colors bg-slate-50 px-4 py-2 rounded-xl border border-slate-100"><Phone size={16}/> Interview</button>
                                            </div>
                                        </div>
                                        <div className={`p-4 rounded-3xl shadow-lg ${selectedCandidate.score > 70 ? 'bg-emerald-500 text-white shadow-emerald-200' : 'bg-slate-50 text-slate-300 border border-slate-100'}`}>
                                            <Award size={40} />
                                        </div>
                                    </div>

                                    <div className="space-y-5">
                                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Matching Neural Logic</h4>
                                        <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100 leading-relaxed text-xl font-medium text-slate-700 italic relative">
                                            "{selectedCandidate.reasoning}"
                                            <div className="absolute top-0 right-0 p-4 opacity-5">
                                                <Zap size={64} className="text-indigo-600" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-6 flex-grow">
                                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Expertise Tag Mapping</h4>
                                        <div className="flex flex-wrap gap-3">
                                            {selectedCandidate.matchedKeywords.length > 0 ? (
                                                selectedCandidate.matchedKeywords.slice(0, 15).map((word, i) => (
                                                    <span key={i} className="px-5 py-3 bg-white border border-slate-200 text-slate-900 text-sm font-black rounded-2xl shadow-sm hover:border-indigo-600 transition-colors">
                                                        {word}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-slate-400 text-lg font-medium">No significant technical overlap detected.</span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="pt-10 border-t border-slate-100 mt-auto space-y-6">
                                        <button className="btn btn-primary w-full py-6 text-2xl font-black shadow-indigo-100">Deploy To Recruitment Board</button>
                                        <div className="flex items-center justify-center gap-8">
                                            <p className="text-sm text-slate-400 font-bold flex items-center gap-2 cursor-pointer hover:text-slate-900 transition-colors group">
                                                <ExternalLink size={18} className="group-hover:translate-x-1 transition-transform"/> Full Dossier Profile
                                            </p>
                                            <p className="text-sm text-slate-400 font-bold flex items-center gap-2 cursor-pointer hover:text-rose-600 transition-colors">
                                                <Trash2 size={18}/> Reject Profile
                                            </p>
                                        </div>
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

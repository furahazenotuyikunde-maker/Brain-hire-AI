import { useState, type ChangeEvent, type FormEvent } from 'react';
import { Upload, FileText, Send, Info, X, Briefcase } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const JobUpload = () => {
    const navigate = useNavigate();
    const [jobTitle, setJobTitle] = useState('');
    const [jobDescription, setJobDescription] = useState('');
    const [files, setFiles] = useState<File[]>([]);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<string | null>(null);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFiles([...files, ...Array.from(e.target.files)]);
        }
    };

    const removeFile = (index: number) => {
        setFiles(files.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        
        if (!token) {
            setStatus('Please log in to perform analysis.');
            navigate('/login');
            return;
        }

        if (files.length === 0 || !jobDescription) {
            setStatus('Please provide a job description and at least one CV.');
            return;
        }

        setLoading(true);
        setStatus('Initializing BrainHireAI Ranking engine...');
        
        try {
            // 1. Create a Job first to get an ID (since our new backend links CVs to Jobs)
            const jobRes = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/jobs`, {
                title: jobTitle,
                description: jobDescription,
                skills: [], // Could parse this or let backend handle it
                qualifications: ""
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const jobId = jobRes.data._id;
            const analysisResults = [];

            // 2. Upload each CV
            for (const file of files) {
                const formData = new FormData();
                formData.append('cv', file);
                formData.append('jobId', jobId);

                const cvRes = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/cvs/upload`, formData, {
                    headers: { 
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${token}`
                    }
                });
                analysisResults.push(cvRes.data);
            }

            const formattedResults = {
                jobTitle: jobTitle,
                totalAnalyzed: analysisResults.length,
                candidates: analysisResults.map(cv => ({
                    candidateName: cv.candidateName,
                    score: cv.score,
                    reasoning: cv.analysis.reasoning,
                    matchedKeywords: cv.analysis.matchedKeywords,
                    email: 'recruiting@brainhire.ai',
                    status: cv.status
                }))
            };
            
            localStorage.setItem('latest_results', JSON.stringify(formattedResults));
            setStatus('Intelligence analysis complete! Porting data...');
            setTimeout(() => navigate('/results'), 1500);
        } catch (error: any) {
            console.error('API Error:', error);
            const errMsg = error.response?.data?.error || error.message || 'Communication failure with ranking server.';
            setStatus(`Analysis Failure: ${errMsg}`);
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto pt-16 animate-fade-in pb-32">
            <header className="mb-12 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 text-xs font-bold uppercase tracking-widest rounded-lg">
                    Neural Ranking Protocol
                </div>
                <h1 className="text-5xl font-black tracking-tighter text-slate-900">Initialize Recruitment Round</h1>
                <p className="text-slate-500 text-xl font-medium max-w-3xl leading-relaxed">Map your role requirements to candidate expertise using our high-precision AI ranking engine.</p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Job Details Section */}
                    <div className="glass p-10 bg-white border-slate-200 shadow-xl shadow-indigo-100/20 space-y-8">
                        <div className="flex items-center gap-3 pb-6 border-b border-slate-100 mb-2">
                           <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
                               <Briefcase size={20} className="text-white" />
                           </div>
                           <h3 className="text-xl font-bold text-slate-800 tracking-tight">Role Specification</h3>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 pl-1">Target Designation</label>
                            <input 
                                value={jobTitle}
                                onChange={(e) => setJobTitle(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-6 py-4 text-lg focus:outline-none focus:border-indigo-500/50 transition-all font-bold text-slate-900" 
                                placeholder="e.g. Senior Neural Architect"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 pl-1">Core Requirements Profile</label>
                            <textarea 
                                value={jobDescription}
                                onChange={(e) => setJobDescription(e.target.value)}
                                rows={8}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-6 py-4 text-lg focus:outline-none focus:border-indigo-500/50 transition-all font-medium text-slate-700 resize-none leading-relaxed" 
                                placeholder="Paste the key responsibilities and technical expertise required..."
                                required
                            />
                        </div>
                    </div>

                    {/* File Upload Section */}
                    <div className="glass p-10 bg-white border-slate-200 shadow-xl shadow-indigo-100/20 flex flex-col">
                         <div className="flex items-center gap-3 pb-6 border-b border-slate-100 mb-8">
                           <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
                               <FileText size={20} className="text-white" />
                           </div>
                           <h3 className="text-xl font-bold text-slate-800 tracking-tight">Candidate Repository</h3>
                        </div>
                        
                        <div className="flex-grow border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center p-12 hover:border-indigo-500/50 transition-all group cursor-pointer relative bg-slate-50/50">
                            <input 
                                type="file" 
                                multiple 
                                accept=".pdf,.txt"
                                onChange={handleFileChange}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                            />
                            <div className="w-20 h-20 bg-indigo-600/10 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Upload className="text-indigo-600" size={40} />
                            </div>
                            <p className="text-xl font-bold text-slate-900 leading-tight">Drop dossiers here or click</p>
                            <p className="text-slate-500 text-sm mt-2 font-medium">Accepts PDF and Document formats (Batch scan supported)</p>
                        </div>

                        {files.length > 0 && (
                            <div className="mt-10 space-y-4">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Identified Profiles ({files.length})</p>
                                <div className="space-y-3 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                                    {files.map((f, i) => (
                                        <div key={i} className="flex items-center justify-between bg-slate-50 px-5 py-4 rounded-xl border border-slate-200 group hover:border-indigo-500/30 transition-all">
                                            <div className="flex items-center gap-4">
                                                <div className="p-2 bg-white rounded-lg border border-slate-100">
                                                    <FileText size={18} className="text-indigo-600" />
                                                </div>
                                                <span className="text-sm font-bold text-slate-700 truncate max-w-[200px]">{f.name}</span>
                                            </div>
                                            <button type="button" onClick={() => removeFile(i)} className="text-slate-400 hover:text-rose-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <X size={20} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {status && (
                    <div className="glass bg-indigo-50 border-indigo-200 p-8 flex items-center gap-6 animate-fade-in shadow-lg shadow-indigo-100/20">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border border-indigo-200 shadow-sm">
                            <Info className="text-indigo-600" size={24} />
                        </div>
                        <span className="font-bold text-xl text-indigo-900 tracking-tight">{status}</span>
                    </div>
                )}

                <div className="flex justify-end pt-12 items-center gap-10">
                    <p className="text-slate-400 font-medium text-lg leading-relaxed max-w-sm text-right">
                        Ensure all candidate dossiers are attached before initializing neural ranking.
                    </p>
                    <button 
                        type="submit" 
                        disabled={loading}
                        className={`btn btn-primary px-16 py-7 text-2xl font-black tracking-tighter ${loading ? 'opacity-50 cursor-not-allowed' : ''} group`}
                    >
                        {loading ? 'Executing Neural Map...' : 'Initialize Intelligence Scan'} 
                        {!loading && <Send className="ml-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" size={28} />}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default JobUpload;

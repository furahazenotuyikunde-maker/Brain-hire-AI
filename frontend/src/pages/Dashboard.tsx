import { useEffect, useState, useRef } from 'react';
import { Users, FileUser, Briefcase, TrendingUp, Calendar, Zap, Search, ArrowUpRight, ShieldCheck, Info, FileUp, Plus, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState([
        { label: 'Total Applicants', value: '0', icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-600/10' },
        { label: 'Active Jobs', value: '0', icon: Briefcase, color: 'text-emerald-600', bg: 'bg-emerald-600/10' },
        { label: 'AI Scans Run', value: '0', icon: Zap, color: 'text-amber-600', bg: 'bg-amber-600/10' },
        { label: 'Top Candidates', value: '0', icon: FileUser, color: 'text-rose-600', bg: 'bg-rose-600/10' },
    ]);
    const [activeJobs, setActiveJobs] = useState<any[]>([]);
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [uploadingJobId, setUploadingJobId] = useState<string | null>(null);
    const [uploadStatus, setUploadStatus] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        
        if (!token || !storedUser) {
            navigate('/login');
            return;
        }

        const userData = JSON.parse(storedUser);
        setUser(userData);

        const fetchDashboardData = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const [jobsRes, cvsRes] = await Promise.all([
                    axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/jobs`, config),
                    axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/cvs${userData.role === 'admin' ? '' : '/my-cvs'}`, config)
                ]);

                const jobs = jobsRes.data;
                const cvs = cvsRes.data;

                setStats([
                    { label: 'Total Applicants', value: cvs.length.toLocaleString(), icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-600/10' },
                    { label: 'Active Jobs', value: jobs.length.toLocaleString(), icon: Briefcase, color: 'text-emerald-600', bg: 'bg-emerald-600/10' },
                    { label: 'AI Scans Run', value: cvs.filter((c: any) => c.status === 'analyzed').length.toLocaleString(), icon: Zap, color: 'text-amber-600', bg: 'bg-amber-600/10' },
                    { label: 'Top Candidates', value: cvs.filter((c: any) => c.score > 75).length.toLocaleString(), icon: FileUser, color: 'text-rose-600', bg: 'bg-rose-600/10' },
                ]);

                const mappedJobs = jobs.map((j: any) => ({
                    _id: j._id,
                    title: j.title,
                    description: j.description,
                    applicants: cvs.filter((c: any) => c.matchedJobId?._id === j._id || c.matchedJobId === j._id).length,
                    status: 'Active',
                    date: new Date(j.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
                }));
                setActiveJobs(mappedJobs);

            } catch (err) {
                console.error("Dashboard failed to fetch real data", err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [navigate]);

    const handleApply = (jobId: string) => {
        setUploadingJobId(jobId);
        fileInputRef.current?.click();
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !uploadingJobId) return;

        const token = localStorage.getItem('token');
        setUploadStatus('Deploying Dossier...');
        
        const formData = new FormData();
        formData.append('cv', file);
        formData.append('jobId', uploadingJobId);

        try {
            await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/cvs/upload`, formData, {
                headers: { 
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                }
            });
            setUploadStatus('Success! Profile analyzed.');
            setTimeout(() => {
                setUploadStatus(null);
                setUploadingJobId(null);
                window.location.reload(); // Refresh to update CV count
            }, 2000);
        } catch (err: any) {
            setUploadStatus('Failed to upload/analyze profile.');
            setTimeout(() => setUploadStatus(null), 3000);
        }
    };

    if (loading) return (
        <div className="pt-32 flex flex-col items-center justify-center space-y-6">
            <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-500 font-bold tracking-widest uppercase text-sm">Initializing Dashboard Intelligence...</p>
        </div>
    );

    return (
        <div className="pt-16 max-w-7xl mx-auto space-y-12 animate-fade-in pb-32">
            <header className="flex flex-col md:flex-row items-end justify-between gap-6 mb-12">
                <div className="space-y-3">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 text-slate-500 text-xs font-bold uppercase tracking-widest rounded-lg shadow-sm">
                        <ShieldCheck size={14} className="text-indigo-600" /> Authorized Control Portal
                    </div>
                    <h1 className="text-5xl font-black tracking-tighter text-slate-900">Recruiting Intelligence</h1>
                    <p className="text-slate-500 text-xl font-medium max-w-2xl leading-relaxed">System-wide performance overview for {user?.name}.</p>
                </div>
                <div className="flex gap-4">
                     {user?.role === 'admin' ? (
                        <button 
                         onClick={() => navigate('/upload')} 
                         className="btn btn-primary px-8 py-5 text-lg font-bold shadow-indigo-100 group"
                       >
                           Initialize New Role <Plus size={20} className="ml-2 group-hover:rotate-90 transition-transform"/>
                       </button>
                     ) : (
                        <div className="flex items-center gap-3 bg-indigo-50 px-6 py-4 rounded-2xl border border-indigo-100">
                             <Zap size={20} className="text-indigo-600" />
                             <span className="font-black text-indigo-700 tracking-tighter uppercase text-xs">Standard User Mode</span>
                        </div>
                     )}
                </div>
            </header>

            {/* Hidden File Input for Users */}
            <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept=".pdf,.txt"
                onChange={handleFileUpload}
            />

            {uploadStatus && (
                <div className="glass fixed bottom-10 right-10 p-6 bg-white border-slate-200 shadow-2xl z-[100] flex items-center gap-4 animate-fade-in min-w-[300px]">
                    {uploadStatus.includes('Success') ? <CheckCircle2 className="text-emerald-500" /> : <Info className="text-indigo-600 animate-pulse" />}
                    <span className="font-bold text-slate-800">{uploadStatus}</span>
                </div>
            )}

            {/* Performance Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {stats.map((s, i) => (
                    <motion.div 
                        key={i} 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="glass p-10 flex flex-col gap-6 group hover:border-indigo-500/30 transition-all duration-300 bg-white border-slate-200 shadow-lg shadow-indigo-100/10"
                    >
                        <div className={`w-14 h-14 ${s.bg} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform border border-transparent group-hover:border-indigo-200`}>
                            <s.icon className={s.color} size={32} />
                        </div>
                        <div className="space-y-1">
                            <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">{s.label}</span>
                            <h2 className="text-5xl font-black text-slate-900 tracking-tighter">{s.value}</h2>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-emerald-600 font-bold bg-emerald-50 self-start px-3 py-1 rounded-full border border-emerald-100">
                            <TrendingUp size={16} /> +12% Efficiency
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 pt-8">
                {/* Active Jobs Table */}
                <div className="lg:col-span-2 glass overflow-hidden border-slate-200 bg-white shadow-xl shadow-indigo-100/20">
                    <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                                <Briefcase size={16} className="text-white" />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Available Roles Profiles</h3>
                        </div>
                    </div>
                    <div className="divide-y divide-slate-50">
                        {activeJobs.length === 0 ? (
                           <div className="p-20 text-center space-y-6">
                               <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center m-auto border border-slate-100">
                                   <Info size={32} className="text-slate-300" />
                               </div>
                               <p className="text-slate-400 font-medium text-lg">No active organizational roles detected.</p>
                               {user?.role === 'admin' && <button onClick={() => navigate('/upload')} className="btn btn-secondary border-indigo-200 text-indigo-600 font-bold px-8">Create First Role</button>}
                           </div>
                        ) : activeJobs.map((job, i) => (
                            <div key={i} className="px-10 py-10 flex items-center justify-between group hover:bg-slate-50/80 transition-all cursor-pointer">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <h4 className="text-2xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors tracking-tight leading-none">{job.title}</h4>
                                        <span className="bg-slate-100 text-slate-500 text-[10px] uppercase font-black tracking-widest px-2 py-1 rounded-md">ID: {job._id?.slice(-6)}</span>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-slate-500 font-bold">
                                        <span className="flex items-center gap-2 bg-indigo-50 text-indigo-600 px-3 py-1 rounded-lg border border-indigo-100"><Users size={16}/> {job.applicants} Candidates</span>
                                        <span className="flex items-center gap-2"><Calendar size={16}/> Initialized {job.date}</span>
                                    </div>
                                    <p className="text-slate-500 text-lg font-medium leading-relaxed max-w-[500px]">{job.description}</p>
                                </div>
                                <div className="flex items-center gap-8">
                                    {user?.role === 'admin' ? (
                                        <div className="flex items-center gap-4">
                                            <span className="px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest border border-emerald-200 bg-emerald-50 text-emerald-600 shadow-sm">
                                                {job.status}
                                            </span>
                                            <button className="w-14 h-14 bg-white border border-slate-200 rounded-2xl flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-600 hover:shadow-lg hover:shadow-indigo-100 transition-all">
                                                <ArrowUpRight size={28}/>
                                            </button>
                                        </div>
                                    ) : (
                                        <button 
                                            onClick={() => handleApply(job._id)}
                                            className="btn btn-secondary px-8 py-5 border-indigo-200 text-indigo-600 font-black tracking-tighter uppercase text-sm hover:bg-indigo-600 hover:text-white transition-all shadow-lg shadow-indigo-100/50"
                                        >
                                            Upload Dossier <FileUp size={18} className="ml-2" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Training & Analysis Section */}
                <div className="space-y-8 h-full">
                    <div className="glass p-10 bg-indigo-600 border-indigo-500 space-y-8 flex flex-col h-full shadow-2xl shadow-indigo-200/50">
                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg shadow-black/10">
                            <Zap className="text-indigo-600" size={32} />
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-3xl font-black text-white leading-tight tracking-tight">AI Protocol Active</h3>
                            <p className="text-indigo-100 text-lg leading-relaxed font-medium">Candidate profiles are cross-referenced with your historical hiring patterns for top precision.</p>
                        </div>
                        <button 
                            className="bg-white text-indigo-600 w-full py-5 text-xl font-black rounded-2xl shadow-lg shadow-black/10 hover:bg-indigo-50 transition-colors uppercase tracking-widest flex items-center justify-center gap-3"
                            onClick={() => user?.role === 'admin' ? navigate('/upload') : navigate('/results')}
                        >
                            {user?.role === 'admin' ? <><FileUp size={24} /> Neural Scan</> : <><Search size={24} /> View Results</>}
                        </button>
                        <hr className="border-white/10" />
                        <div className="space-y-5 pt-4">
                            <h4 className="text-xs font-black text-indigo-200 uppercase tracking-widest flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Ranking Subsystem Health
                            </h4>
                            <div className="grid grid-cols-1 gap-4">
                                <div className="p-4 bg-white/10 rounded-xl border border-white/10 backdrop-blur-md flex items-center justify-between">
                                    <div className="space-y-1">
                                        <p className="text-xs text-indigo-200 font-bold uppercase tracking-tighter">Analysis Accuracy</p>
                                        <p className="text-3xl font-black text-white">96.4%</p>
                                    </div>
                                    <div className="p-2 bg-emerald-500/20 rounded-lg">
                                        <TrendingUp className="text-emerald-400" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

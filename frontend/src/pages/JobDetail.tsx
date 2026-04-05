import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Briefcase, MapPin, Building, Calendar, ArrowLeft, FileUp, ShieldCheck, Zap, Info, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';

interface Job {
    _id: string;
    title: string;
    company: string;
    location: string;
    description: string;
    type: string;
    createdAt: string;
}

const JobDetail = () => {
    const { id } = useParams<{ id: string }>();
    const [job, setJob] = useState<Job | null>(null);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/jobs/${id}`);
                setJob(res.data);
            } catch (err) {
                console.error('Failed to fetch job');
            } finally {
                setLoading(false);
            }
        };
        fetchJob();
    }, [id]);

    const handleUpload = async () => {
        if (!file || !job) return;
        setUploading(true);
        const formData = new FormData();
        formData.append('cv', file);
        formData.append('jobId', job._id);

        try {
            const token = localStorage.getItem('token');
            await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/cvs/upload`, formData, {
                headers: { 
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                }
            });
            navigate('/results');
        } catch (err) {
            alert('Upload failed. Please login first.');
            navigate('/login');
        } finally {
            setUploading(false);
        }
    };

    if (loading) return (
        <div className="pt-32 text-center">
            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-slate-500 font-bold tracking-widest uppercase text-xs">Accessing Neural Database...</p>
        </div>
    );

    if (!job) return <div className="pt-32 text-center text-slate-500">Job Intelligence Model Not Found.</div>;

    const sections = job.description.split('\n\n');

    return (
        <div className="pt-24 max-w-6xl mx-auto px-4 pb-32">
            <Link to="/dashboard" className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 font-bold transition-colors mb-12 no-underline group text-sm uppercase tracking-widest">
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Left Column: Job Info */}
                <div className="lg:col-span-2 space-y-12">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        <div className="flex flex-wrap items-center gap-4">
                            <span className="px-4 py-1.5 bg-indigo-600/10 text-indigo-600 rounded-full text-xs font-black uppercase tracking-widest border border-indigo-200">
                                {job.type || 'Full-Time Deployment'}
                            </span>
                            <span className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-widest">
                                <Calendar size={14} /> Posted {new Date(job.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                        
                        <h1 className="text-6xl font-black leading-tight text-slate-900 tracking-tighter">
                            {job.title}
                        </h1>

                        <div className="flex flex-wrap items-center gap-8 text-slate-500 font-bold">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-slate-100 rounded-lg text-slate-400"><Building size={18} /></div>
                                {job.company || 'BrainHire Participant'}
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-slate-100 rounded-lg text-slate-400"><MapPin size={18} /></div>
                                {job.location || 'Remote'}
                            </div>
                        </div>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="glass p-10 bg-white/70 border-slate-200"
                    >
                        <h2 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3 tracking-tight">
                             <div className="w-1.5 h-8 bg-indigo-600 rounded-full"></div>
                             Intelligence Requirements
                        </h2>
                        
                        <div className="prose prose-slate max-w-none space-y-8">
                            {sections.map((section, idx) => (
                                <div key={idx} className="space-y-4">
                                    <p className="text-lg text-slate-600 font-medium leading-relaxed">
                                        {section}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Right Column: Profile Evaluation (Apply) */}
                <div className="space-y-8">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="sticky top-32 glass p-8 bg-gradient-to-br from-indigo-600 to-indigo-800 border-none shadow-2xl shadow-indigo-200 ring-1 ring-white/20"
                    >
                        <div className="space-y-8">
                            <div className="text-center space-y-2">
                                <h3 className="text-2xl font-black text-white leading-none">Neural Ranking</h3>
                                <p className="text-indigo-100 font-bold text-xs uppercase tracking-widest opacity-80 underline underline-offset-4 decoration-indigo-400">Initialize Profile Analysis</p>
                            </div>

                            <div className="space-y-4">
                                <div className="p-4 bg-white/10 rounded-xl border border-white/10 flex items-start gap-3">
                                    <Zap className="text-yellow-400 shrink-0" size={20} />
                                    <p className="text-white font-medium text-sm leading-relaxed">
                                        Our AI engine will compare your technical specs vs this deployment in real-time.
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="relative group overflow-hidden rounded-2xl bg-white/10 border-2 border-dashed border-white/30 hover:border-white transition-all cursor-pointer">
                                    <input 
                                        type="file" 
                                        className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                                    />
                                    <div className="p-10 text-center flex flex-col items-center gap-3">
                                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-indigo-600 shadow-lg">
                                            <FileUp size={24} />
                                        </div>
                                        <p className="text-white font-black tracking-tight">
                                            {file ? file.name : 'Upload Credentials'}
                                        </p>
                                        <p className="text-indigo-200 text-xs font-bold uppercase tracking-widest">PDF or TEXT format</p>
                                    </div>
                                </div>

                                <button 
                                    disabled={!file || uploading}
                                    onClick={handleUpload}
                                    className="w-full bg-white text-indigo-600 py-5 rounded-2xl font-black text-xl hover:bg-slate-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed group shadow-xl"
                                >
                                    {uploading ? 'Analyzing Matrix...' : 'Start Evaluation'}
                                    {!uploading && <ChevronRight size={24} className="inline ml-1 group-hover:translate-x-1 transition-transform" />}
                                </button>
                            </div>
                        </div>
                    </motion.div>

                    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
                         <div className="flex items-center gap-3 text-slate-800 font-black text-sm uppercase tracking-widest">
                            <ShieldCheck size={18} className="text-emerald-500" /> Secure Encryption
                         </div>
                         <p className="text-slate-500 text-xs font-bold leading-relaxed">
                            Your personal intelligence data is encrypted and only shared with the authorized deployment team.
                         </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobDetail;

import React, { useState } from 'react';
import { Upload, Plus, FileText, Send, CheckCircle, Info, Trash2, X } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const JobUpload = () => {
    const navigate = useNavigate();
    const [jobTitle, setJobTitle] = useState('');
    const [jobDescription, setJobDescription] = useState('');
    const [files, setFiles] = useState<File[]>([]);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFiles([...files, ...Array.from(e.target.files)]);
        }
    };

    const removeFile = (index: number) => {
        setFiles(files.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (files.length === 0 || !jobDescription) {
            setStatus('Please provide a job description and at least one CV.');
            return;
        }

        setLoading(true);
        setStatus('Processing resumes...');
        
        const formData = new FormData();
        formData.append('jobTitle', jobTitle);
        formData.append('jobDescription', jobDescription);
        files.forEach(file => formData.append('resumes', file));

        try {
            console.log('Starting API Request to:', `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/analyze`);
            const response = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/analyze`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            
            console.log('API Response Success:', response.data);
            localStorage.setItem('latest_results', JSON.stringify(response.data));
            setStatus('Analysis complete! Redirecting...');
            setTimeout(() => navigate('/results'), 1500);
        } catch (error: any) {
            console.error('API Error:', error);
            const errMsg = error.response?.data?.error || error.message || 'Unknown network error.';
            setStatus(`Error analyzing files: ${errMsg}. Check console for details.`);
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto pt-16 animate-fade-in">
            <header className="mb-12">
                <h1 className="text-4xl font-black mb-4">Start New Recruiting Round</h1>
                <p className="text-slate-400 text-lg">Define your role requirements and upload candidate profiles for instant ranking.</p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-12 pb-24">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Job Details Section */}
                    <div className="glass p-10 space-y-8">
                        <div>
                            <label className="block text-sm font-bold text-indigo-400 uppercase tracking-widest mb-3">Job Title</label>
                            <input 
                                value={jobTitle}
                                onChange={(e) => setJobTitle(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-lg focus:outline-none focus:border-indigo-500/50 transition-colors" 
                                placeholder="e.g. Senior Frontend Engineer"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-indigo-400 uppercase tracking-widest mb-3">Job Description (JD)</label>
                            <textarea 
                                value={jobDescription}
                                onChange={(e) => setJobDescription(e.target.value)}
                                rows={8}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-lg focus:outline-none focus:border-indigo-500/50 transition-colors resize-none" 
                                placeholder="Paste the key responsibilities, requirements, and tech stack here..."
                                required
                            />
                        </div>
                    </div>

                    {/* File Upload Section */}
                    <div className="glass p-10 flex flex-col">
                        <label className="block text-sm font-bold text-indigo-400 uppercase tracking-widest mb-3">Candidate Resumes (PDF)</label>
                        
                        <div className="flex-grow border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center p-8 hover:border-indigo-500/50 transition-colors group cursor-pointer relative">
                            <input 
                                type="file" 
                                multiple 
                                accept=".pdf,.txt"
                                onChange={handleFileChange}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                            />
                            <div className="w-16 h-16 bg-indigo-600/10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <Upload className="text-indigo-400" size={32} />
                            </div>
                            <p className="text-lg font-bold">Drop files here or click to upload</p>
                            <p className="text-slate-500 text-sm mt-1">Supports PDF and Text files (batch upload)</p>
                        </div>

                        {files.length > 0 && (
                            <div className="mt-8 space-y-3">
                                <p className="text-sm font-bold text-slate-400 mb-2">Selected Files ({files.length})</p>
                                {files.map((f, i) => (
                                    <div key={i} className="flex items-center justify-between bg-white/5 px-4 py-3 rounded-lg border border-white/10 group">
                                        <div className="flex items-center gap-3">
                                            <FileText size={18} className="text-indigo-400" />
                                            <span className="text-sm font-medium truncate max-w-[180px]">{f.name}</span>
                                        </div>
                                        <button type="button" onClick={() => removeFile(i)} className="text-slate-500 hover:text-red-400 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <X size={18} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {status && (
                    <div className="glass bg-indigo-600/10 border-indigo-500/30 p-6 flex items-center gap-4 animate-fade-in">
                        <Info className="text-indigo-400" />
                        <span className="font-medium text-lg">{status}</span>
                    </div>
                )}

                <div className="flex justify-end pt-8">
                    <button 
                        type="submit" 
                        disabled={loading}
                        className={`btn btn-primary px-16 py-6 text-2xl font-black ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {loading ? 'Analyzing Resumes...' : 'Launch Intelligence Scan'} <Send className="ml-4" size={28} />
                    </button>
                </div>
            </form>
        </div>
    );
};

export default JobUpload;

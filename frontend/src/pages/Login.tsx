import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, LogIn, AlertCircle, ShieldAlert } from 'lucide-react';
import axios from 'axios';
import logo from '../assets/logo.png';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/login`, {
                email,
                password
            });
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            navigate('/dashboard');
        } catch (error) {
            const message = axios.isAxiosError(error)
                ? error.response?.data?.error || error.message
                : error instanceof Error
                ? error.message
                : 'Authentication failed. Please check your credentials.';
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="pt-24 flex flex-col items-center justify-center animate-fade-in max-w-lg mx-auto">
            <div className="w-full glass p-12 border-slate-200 bg-white/70 shadow-xl shadow-indigo-100/30">
                <div className="space-y-4 mb-10 text-center">
                    <img src={logo} alt="BrainHireAI" className="h-20 w-auto mx-auto mb-6 drop-shadow-xl" />
                    <h1 className="text-4xl font-black tracking-tight">Intelligence Log-In</h1>
                    <p className="text-slate-500 font-medium leading-relaxed">Secure access to the BrainHireAI Ranking engine.</p>
                </div>

                {error && (
                    <div className="bg-rose-50 border border-rose-200 text-rose-600 p-4 rounded-xl flex items-center gap-3 mb-8 animate-pulse text-sm font-bold uppercase tracking-tight">
                        <AlertCircle size={20} /> {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="space-y-3">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Authorized Email Address</label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                            <input 
                                type="email" 
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@organization.ai" 
                                className="w-full bg-slate-50 border border-slate-200 px-12 py-4 rounded-xl focus:outline-none focus:border-indigo-500/50 transition-all text-slate-800"
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Secure Passkey</label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                            <input 
                                type="password" 
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••" 
                                className="w-full bg-slate-50 border border-slate-200 px-12 py-4 rounded-xl focus:outline-none focus:border-indigo-500/50 transition-all text-slate-800"
                            />
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="btn btn-primary w-full py-5 text-xl font-bold shadow-indigo-500/10 group overflow-hidden"
                    >
                        {loading ? 'Initializing Interface...' : 'Authorize Login'}
                        {!loading && <LogIn size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />}
                    </button>
                    
                    <div className="pt-6 border-t border-slate-100 mt-6 text-center">
                        <p className="text-slate-500 font-medium">New User? <Link to="/signup" className="text-indigo-600 font-bold hover:underline">Deploy Account Profile <ShieldAlert size={14} className="inline ml-1"/></Link></p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;

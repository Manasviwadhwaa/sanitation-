import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, Globe, ArrowRight, AlertTriangle, Key } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({ username: '', password: '' });

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const success = await login({ 
        username: formData.username, 
        password: formData.password 
      });
      if (success) {
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || "Unable to connect to the city hub. Please ensure the server is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md space-y-10">
        {/* Branding */}
        <div className="text-center space-y-4">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl mx-auto shadow-2xl">S</div>
          <h1 className="text-3xl font-bold tracking-tight">SAAF Smart City</h1>
          <p className="text-slate-500 text-sm">Sign in to help keep your city clean and safe.</p>
        </div>

        {/* Login Box */}
        <div className="bg-[#0f0f0f] border border-[#1f1f1f] rounded-3xl p-10 shadow-2xl space-y-8">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Username</label>
              <div className="relative">
                <Globe size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" />
                <input 
                  type="text" 
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  placeholder="Enter your username"
                  className="w-full bg-black/40 border border-[#1f1f1f] rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-blue-500/50 transition-all text-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" />
                <input 
                  type="password" 
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  placeholder="Enter your password"
                  className="w-full bg-black/40 border border-[#1f1f1f] rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-blue-500/50 transition-all text-sm"
                />
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-500/5 border border-red-500/10 text-red-500 text-[11px] font-medium rounded-2xl flex items-center gap-3">
                <AlertTriangle size={14} className="shrink-0" />
                {error}
              </div>
            )}

            <button 
              type="submit"
              disabled={loading}
              className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-xl shadow-blue-600/10 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In'}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          {/* Preset Buttons for Non-Tech Users */}
          <div className="pt-8 border-t border-[#1f1f1f] space-y-4">
             <p className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em] text-center">Common Logins</p>
             <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => { setFormData({ username: 'admin@sanitrax.local', password: 'Admin@123' }); }}
                  className="p-4 bg-white/5 border border-white/5 rounded-2xl text-left hover:bg-white/10 transition-all group"
                >
                   <Key size={14} className="text-blue-500 mb-2" />
                   <p className="text-[11px] font-bold text-white">Staff Admin</p>
                   <p className="text-[9px] text-slate-500 font-medium mt-1">Full Control</p>
                </button>
                <button 
                  onClick={() => { setFormData({ username: 'worker1', password: '1234' }); }}
                  className="p-4 bg-white/5 border border-white/5 rounded-2xl text-left hover:bg-white/10 transition-all group"
                >
                   <Key size={14} className="text-amber-500 mb-2" />
                   <p className="text-[11px] font-bold text-white">Field Worker</p>
                   <p className="text-[9px] text-slate-500 font-medium mt-1">Safety Checks</p>
                </button>
             </div>
          </div>
        </div>

        <button 
          onClick={() => navigate('/')}
          className="text-xs font-bold text-slate-600 hover:text-white transition-colors uppercase tracking-[0.3em] block mx-auto pt-4"
        >
          Return to Start
        </button>
      </div>
    </div>
  );
};

export default LoginPage;

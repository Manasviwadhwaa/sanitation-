import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Shield, User, Lock, Key, Loader2 } from 'lucide-react';

const LoginPage: React.FC = () => {
  const [role, setRole] = useState<'admin' | 'cleaner'>('admin');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [cleanerId, setCleanerId] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const credentials = role === 'admin' 
        ? { role, username, password }
        : { role, cleaner_id: cleanerId, pin };

      const hostname = window.location.hostname;
      const API_URL = import.meta.env.VITE_API_URL || `http://${hostname}:4000`;
      
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Authentication Failed');
      
      await login(data); // Pass the data to context login
      const from = (location.state as any)?.from?.pathname || (role === 'admin' ? '/admin' : '/cleaner');
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-atmosBg flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-atmosAccent/5 rounded-full blur-[120px] pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[440px] relative z-10"
      >
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-6">
            <Shield className="text-atmosAccent" size={14} />
            <span className="text-[10px] text-atmosTextMuted font-bold uppercase tracking-widest">Secure Access Gateway</span>
          </div>
          <h1 className="text-4xl font-bold text-atmosText tracking-tighter mb-2">SAFAI <span className="text-atmosAccent">SAAF</span></h1>
          <p className="text-atmosTextSubtle text-xs tracking-tight">Smart Automated Attendance & Facilities Monitor</p>
        </div>

        <div className="bg-atmosBgAlt/60 backdrop-blur-3xl border border-white/5 rounded-[40px] p-8 md:p-10 shadow-2xl">
          {/* Role Switcher */}
          <div className="flex bg-black/20 p-1.5 rounded-2xl mb-8">
            <button 
              onClick={() => setRole('admin')}
              className={`flex-1 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${role === 'admin' ? 'bg-atmosAccent text-black shadow-[0_0_20px_rgba(59,130,246,0.3)]' : 'text-atmosTextMuted hover:text-atmosText'}`}
            >
              Administrator
            </button>
            <button 
              onClick={() => setRole('cleaner')}
              className={`flex-1 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${role === 'cleaner' ? 'bg-atmosAccent text-black shadow-[0_0_20px_rgba(59,130,246,0.3)]' : 'text-atmosTextMuted hover:text-atmosText'}`}
            >
              Facility Staff
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <AnimatePresence mode="wait">
              {role === 'admin' ? (
                <motion.div 
                  key="admin" 
                  initial={{ opacity: 0, x: -10 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <label className="text-[9px] text-atmosTextMuted font-bold uppercase tracking-widest px-1">Username</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-atmosTextSubtle" size={18} />
                      <input 
                        type="text" 
                        required
                        className="w-full bg-black/30 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm text-atmosText focus:outline-none focus:border-atmosAccent/50 transition-all"
                        placeholder="admin@saaf.local"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] text-atmosTextMuted font-bold uppercase tracking-widest px-1">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-atmosTextSubtle" size={18} />
                      <input 
                        type="password" 
                        required
                        className="w-full bg-black/30 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm text-atmosText focus:outline-none focus:border-atmosAccent/50 transition-all"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="cleaner" 
                  initial={{ opacity: 0, x: 10 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <label className="text-[9px] text-atmosTextMuted font-bold uppercase tracking-widest px-1">Cleaner ID</label>
                    <div className="relative">
                      <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-atmosTextSubtle" size={18} />
                      <input 
                        type="text" 
                        required
                        className="w-full bg-black/30 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm text-atmosText focus:outline-none focus:border-atmosAccent/50 transition-all"
                        placeholder="CLEANER1"
                        value={cleanerId}
                        onChange={(e) => setCleanerId(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] text-atmosTextMuted font-bold uppercase tracking-widest px-1">Security PIN</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-atmosTextSubtle" size={18} />
                      <input 
                        type="password" 
                        required
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        className="w-full bg-black/30 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm text-atmosText focus:outline-none focus:border-atmosAccent/50 transition-all"
                        placeholder="••••"
                        value={pin}
                        onChange={(e) => setPin(e.target.value)}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-[10px] text-red-400 font-bold text-center uppercase tracking-wider"
              >
                {error}
              </motion.div>
            )}

            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-atmosAccent text-black text-[10px] font-bold uppercase tracking-[0.2em] rounded-2xl hover:bg-atmosAccentSoft transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                'Authenticate'
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Activity, Shield, ChevronRight, Cpu, Globe } from 'lucide-react';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#020617] text-white flex flex-col items-center justify-center overflow-hidden relative">
      {/* Background Cinematic Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-[180px] animate-pulse" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
      </div>

      <div className="relative z-10 text-center space-y-12 max-w-4xl px-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-center gap-4 mb-12">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black text-3xl shadow-[0_0_50px_rgba(37,99,235,0.4)]">S</div>
            <div className="text-left">
              <h1 className="text-5xl font-black tracking-tighter leading-none">SAAF <span className="text-blue-500 text-6xl">OS</span></h1>
              <p className="text-xs font-black uppercase tracking-[0.5em] text-slate-500 mt-2">Smart City Municipal Hub</p>
            </div>
          </div>
          
          <p className="text-2xl text-slate-400 font-medium leading-relaxed">
            A high-fidelity operating system for municipal intelligence, 
            <span className="text-white"> real-time telemetry</span>, and urban transparency.
          </p>
        </motion.div>

        {/* The One and Only START Button */}
        <motion.button
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 200, damping: 15 }}
          onClick={() => navigate('/public')}
          className="group relative inline-flex items-center gap-4 px-12 py-6 bg-blue-600 rounded-3xl text-xl font-black uppercase tracking-[0.2em] shadow-[0_20px_80px_rgba(37,99,235,0.3)] hover:bg-blue-500 hover:scale-105 active:scale-95 transition-all duration-300"
        >
          <Cpu className="group-hover:rotate-180 transition-transform duration-700" />
          START SAAF ENGINE
          <ChevronRight className="group-hover:translate-x-2 transition-transform" />
          
          <div className="absolute inset-0 bg-white/20 blur-2xl rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
        </motion.button>

        {/* Status Indicators */}
        <div className="flex flex-wrap justify-center gap-12 pt-20">
          {[
            { label: 'Grid Integrity', value: 'Nominal', icon: Activity, color: 'text-emerald-500' },
            { label: 'Neural Core', value: 'Ready', icon: Shield, color: 'text-blue-500' },
            { label: 'Global Sync', value: 'Active', icon: Globe, color: 'text-purple-500' }
          ].map((status, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 + i * 0.1 }}
              className="flex items-center gap-3 text-slate-500"
            >
              <status.icon size={16} className={status.color} />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">{status.label}: {status.value}</span>
            </motion.div>
          ))}
        </div>
      </div>

      <p className="absolute bottom-10 text-[10px] font-black text-slate-700 uppercase tracking-[0.8em]">© 2026 SAAF OS. SECURE GATEWAY ENABLED.</p>
    </div>
  );
};

export default LandingPage;

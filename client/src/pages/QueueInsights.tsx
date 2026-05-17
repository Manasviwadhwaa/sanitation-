import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, Clock, Activity, ShieldCheck, 
  MapPin, Users,
  ArrowRight, BarChart3,
  TrendingUp, Smartphone, QrCode, Search,
  ChevronRight, RefreshCw, Cpu, Database, Eye, Globe
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLiveData } from '../context/LiveDataContext';

const QueueInsights: React.FC = () => {
  const navigate = useNavigate();
  const { facilities, recommendation, isLive } = useLiveData();
  const [selectedUnitId, setSelectedUnitId] = useState<number | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  // Initializing logic to ensure data is present
  useEffect(() => {
    if (facilities.length > 0) {
      const timer = setTimeout(() => setIsInitializing(false), 800);
      return () => clearTimeout(timer);
    }
  }, [facilities]);

  const activeUnit = useMemo(() => {
    if (selectedUnitId) return facilities.find(f => f.id === selectedUnitId) || facilities[0];
    return recommendation?.best || facilities[0] || null;
  }, [selectedUnitId, facilities, recommendation]);

  const steps = [
    {
      title: "Sensors detect usage",
      desc: "IR motion sensors and cubicle occupancy detectors count entries and exits in real-time.",
      icon: <Users size={20} />,
      status: isLive ? "Active Sensing" : "Connecting...",
      active: true
    },
    {
      title: "System calculates",
      desc: "Occupancy percentage, estimated wait times, and pressure levels are computed instantly.",
      icon: <Activity size={20} />,
      status: "Logic Layer",
      active: isLive
    },
    {
      title: "Public sees availability",
      desc: "Live status nodes update across all city platforms and maps instantly.",
      icon: <MapPin size={20} />,
      status: "Broadcast",
      active: true
    },
    {
      title: "Decision support",
      desc: "The system recommends the best nearby facility based on your location and current wait times.",
      icon: <Zap size={20} />,
      status: recommendation?.best ? "Optimal Found" : "Scanning...",
      active: !!recommendation?.best
    },
    {
      title: "Hygiene monitoring",
      desc: "Air quality and usage intensity sensors monitor cleanliness and trigger cleaning alerts.",
      icon: <ShieldCheck size={20} />,
      status: "Quality Control",
      active: true
    },
    {
      title: "Rapid response",
      desc: "Maintenance teams receive automated alerts and verify services via QR and photo proof.",
      icon: <Clock size={20} />,
      status: "Field Ops",
      active: true
    },
    {
      title: "Trust & Transparency",
      desc: "Every service action is logged to the public budget portal for full accountability.",
      icon: <BarChart3 size={20} />,
      status: "Public Audit",
      active: true
    }
  ];

  if (isInitializing || facilities.length === 0) {
    return (
      <div className="min-h-screen bg-premium-bg flex flex-col items-center justify-center text-center px-6">
        <motion.div 
          animate={{ rotate: 360, scale: [1, 1.2, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="mb-12 relative"
        >
          <div className="absolute inset-0 bg-premium-accent/40 blur-[60px] rounded-full" />
          <Zap className="text-premium-accent relative z-10" size={84} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <h2 className="text-5xl font-black text-white tracking-tighter uppercase">Synchronizing <span className="text-premium-muted/20">Neural Stream</span></h2>
          <div className="flex items-center gap-4 justify-center text-premium-muted">
             <RefreshCw size={18} className="animate-spin text-premium-accent" />
             <span className="text-[11px] font-black uppercase tracking-[0.4em]">Handshaking with Dehradun Grid Node</span>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-premium-bg text-white pb-32 pt-28 overflow-x-hidden">
      {/* Cinematic Background Layer */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] right-[-5%] w-[100%] h-[100%] bg-premium-accent/10 rounded-full blur-[250px]" 
        />
        <div className="absolute bottom-[-10%] left-[-10%] w-[80%] h-[80%] bg-emerald-500/5 rounded-full blur-[200px]" />
        
        {/* 3D High-Velocity Grid */}
        <div className="absolute inset-0 perspective-1000 opacity-20">
          <motion.div 
            initial={{ rotateX: 65, y: "10%" }}
            animate={{ backgroundPosition: ["0px 0px", "0px 180px"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-[-100%] left-[-100%] right-[-100%] top-[-50%] bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:80px_80px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_80%)]"
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-10 relative z-10">
        <header className="max-w-4xl mb-32">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4 mb-8"
          >
            <div className="flex items-center gap-3 px-5 py-1.5 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black text-premium-muted uppercase tracking-[0.4em]">
              <Eye size={14} className="text-premium-accent" />
              Strategic Neural Surveillance
            </div>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 1, ease: "circOut" }}
            className="text-7xl md:text-9xl font-black text-white tracking-tighter mb-10 leading-none"
          >
            Crowd <span className="text-premium-muted/20">Dynamics.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-2xl text-premium-muted font-medium leading-relaxed max-w-3xl opacity-80"
          >
            Interconnected with {facilities.length} active municipal nodes across the Dehradun grid. 
            Our neural sensing layer processes footfall and biometric hygiene data to provide real-time strategic support.
          </motion.p>
        </header>

        {/* 7-Step System Logic Flow */}
        <section className="mb-40">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-16 gap-8">
            <div>
              <h2 className="text-4xl font-black text-white tracking-tighter">Intelligence Synthesis Flow</h2>
              <p className="text-[11px] font-black text-premium-muted uppercase tracking-[0.4em] mt-2">End-to-End Operational Lifecycle</p>
            </div>
            <div className="flex items-center gap-4 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-3xl shadow-2xl">
               <div className={`w-2.5 h-2.5 rounded-full ${isLive ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse' : 'bg-red-500'}`} />
               <span className="text-[11px] font-black text-white uppercase tracking-[0.3em]">{isLive ? 'Grid Link Established' : 'Connecting to Node...'}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className={`glass-panel p-10 flex flex-col group hover:border-premium-accent/40 transition-all duration-500 relative overflow-hidden shadow-2xl ${i === steps.length - 1 ? 'lg:col-span-2' : ''}`}
              >
                <div className="flex items-center justify-between mb-10 relative z-10">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 border border-white/5 ${step.active ? 'bg-premium-accent text-white shadow-2xl shadow-premium-accent/20' : 'bg-white/5 text-premium-muted'}`}>
                    {React.cloneElement(step.icon as React.ReactElement<any>, { size: 24 })}
                  </div>
                  <span className="text-[10px] font-black text-premium-muted/30 uppercase tracking-[0.5em]">0{i + 1}</span>
                </div>
                <h3 className={`text-2xl font-black mb-4 tracking-tighter transition-colors ${step.active ? 'text-white group-hover:text-premium-accent' : 'text-premium-muted'}`}>{step.title}</h3>
                <p className="text-[13px] text-premium-muted font-medium leading-relaxed mb-10 flex-1 opacity-70 group-hover:opacity-100 transition-opacity">{step.desc}</p>
                <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between relative z-10">
                  <span className="text-[10px] font-black text-premium-muted uppercase tracking-[0.4em]">{step.status}</span>
                  {step.active && <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse" />}
                </div>
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-premium-accent/5 rounded-full -mr-16 -mt-16 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
              </motion.div>
            ))}
          </div>
        </section>

        {/* Hardware Mockup & Predictive Layer */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-40">
          <div className="lg:col-span-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-10 mb-12">
              <div>
                <h2 className="text-4xl font-black text-white tracking-tighter">Display Terminal</h2>
                <p className="text-[11px] font-black text-premium-muted uppercase tracking-[0.4em] mt-2">Active Strategic Node Interface</p>
              </div>
              
              <div className="relative group min-w-[320px]">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-premium-muted group-hover:text-premium-accent transition-colors" size={18} />
                <select 
                  value={selectedUnitId || (activeUnit?.id || '')}
                  onChange={(e) => setSelectedUnitId(Number(e.target.value))}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-10 text-[11px] font-black text-white uppercase tracking-[0.3em] outline-none focus:border-premium-accent/60 appearance-none cursor-pointer hover:bg-white/10 transition-all shadow-2xl backdrop-blur-3xl"
                >
                  {facilities.map(f => (
                    <option key={f.id} value={f.id} className="bg-premium-bg">{f.name}</option>
                  ))}
                </select>
                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-premium-muted">
                   <ChevronRight size={16} className="rotate-90" />
                </div>
              </div>
            </div>
            
            {/* Smart Pole Mockup (Subtle 3D) */}
            <AnimatePresence mode="wait">
              <motion.div 
                key={activeUnit?.id}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -20 }}
                transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
                className="relative p-16 bg-white/[0.02] border border-white/5 rounded-[4.5rem] overflow-hidden group shadow-[0_60px_150px_rgba(0,0,0,0.5)]"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-premium-accent/10 to-transparent pointer-events-none" />
                
                <motion.div 
                  whileHover={{ rotateY: 8, rotateX: -4 }}
                  className="max-w-md mx-auto glass-panel p-16 rounded-[4rem] border-white/10 shadow-[0_80px_160px_rgba(0,0,0,0.8)] transform-gpu transition-all duration-1000 relative z-10"
                >
                  <div className="flex items-center justify-between mb-16">
                     <div className="flex items-center gap-3">
                        <Globe size={16} className="text-premium-accent" />
                        <span className="text-[14px] font-black text-white uppercase tracking-[0.3em]">{activeUnit?.name?.split(' – ')[0] || 'Unknown Node'}</span>
                     </div>
                     <div className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] border ${['GREEN', 'OPEN'].includes(activeUnit?.current_status || '') ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
                       {activeUnit?.current_status || 'SCANNING'}
                     </div>
                  </div>

                  {/* Hardware Traffic Light */}
                  <div className="flex gap-5 mb-20 justify-center">
                     <div className={`w-20 h-4 rounded-full transition-all duration-1000 ${activeUnit && (activeUnit.occupancy ?? 0) < 60 ? 'bg-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.8)]' : 'bg-white/5'}`} />
                     <div className={`w-20 h-4 rounded-full transition-all duration-1000 ${activeUnit && (activeUnit.occupancy ?? 0) >= 60 && (activeUnit.occupancy ?? 0) < 85 ? 'bg-amber-500 shadow-[0_0_30px_rgba(245,158,11,0.8)]' : 'bg-white/5'}`} />
                     <div className={`w-20 h-4 rounded-full transition-all duration-1000 ${activeUnit && (activeUnit.occupancy ?? 0) >= 85 ? 'bg-red-500 shadow-[0_0_30px_rgba(239,68,68,0.8)]' : 'bg-white/5'}`} />
                  </div>

                  <div className="space-y-12">
                     <div className="flex justify-between items-baseline border-b border-white/5 pb-10">
                        <span className="text-[13px] font-black text-premium-muted uppercase tracking-[0.4em]">Wait Period</span>
                        <span className="text-6xl font-black text-white tracking-tighter">
                          {activeUnit?.wait_time !== undefined && !isNaN(activeUnit.wait_time) ? `${String(activeUnit.wait_time).padStart(2, '0')}m` : '--m'}
                        </span>
                     </div>
                     <div className="flex justify-between items-baseline border-b border-white/5 pb-10">
                        <span className="text-[13px] font-black text-premium-muted uppercase tracking-[0.4em]">Occupancy</span>
                        <span className={`text-6xl font-black tracking-tighter ${activeUnit && (activeUnit.occupancy ?? 0) >= 85 ? 'text-red-500' : 'text-white'}`}>
                          {activeUnit?.occupancy ?? 0}%
                        </span>
                     </div>
                     <div className="flex justify-between items-baseline">
                        <span className="text-[13px] font-black text-premium-muted uppercase tracking-[0.4em]">Performance</span>
                        <span className="text-6xl font-black text-emerald-500 tracking-tighter uppercase italic">Optimal</span>
                     </div>
                  </div>

                  <div className="mt-20 p-8 bg-white/5 rounded-[2.5rem] border border-white/5 flex items-center justify-between group/qr cursor-pointer hover:bg-premium-accent/10 transition-all duration-500 hover:border-premium-accent/40 shadow-2xl group/btn">
                     <div className="flex items-center gap-6">
                       <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-premium-accent group-hover/btn:bg-premium-accent group-hover/btn:text-white transition-all duration-500">
                         <QrCode size={32} />
                       </div>
                       <div className="text-left">
                         <span className="text-[12px] font-black text-white uppercase tracking-[0.3em]">Unit Identity Log</span>
                         <p className="text-[9px] text-premium-muted font-black uppercase tracking-[0.2em] mt-1 opacity-60">Cryptographic Audit Profile</p>
                       </div>
                     </div>
                     <ArrowRight size={24} className="text-premium-muted group-hover/btn:translate-x-2 group-hover/btn:text-premium-accent transition-all duration-500" />
                  </div>
                </motion.div>

                <p className="mt-16 text-center text-[12px] text-premium-muted uppercase tracking-[0.6em] font-black opacity-30">
                  Secure Data Stream Terminal // ID: {activeUnit?.id || '---'}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-10">
            <div className="flex items-center gap-4 mb-4">
              <Cpu size={24} className="text-premium-accent" />
              <h2 className="text-3xl font-black text-white tracking-tighter">Neural Forecasting</h2>
            </div>

            {/* Predictive Rush Card */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="glass-panel p-10 relative overflow-hidden group hover:border-amber-500/40 transition-all duration-700 shadow-2xl"
            >
               <TrendingUp className="text-amber-500 mb-8" size={32} />
               <h4 className="text-2xl font-black text-white mb-4 tracking-tighter">Traffic Anomaly</h4>
               <p className="text-sm text-premium-muted mb-10 leading-relaxed font-medium opacity-70 group-hover:opacity-100 transition-opacity">
                 {recommendation?.best && (recommendation.best.occupancy ?? 0) > 70 
                   ? `High density vector detected at ${recommendation.best.name?.split(' – ')[0] || 'Unit'}. Strategic alternative routing advised.`
                   : "Predictive patterns indicate a 22% increase in node pressure in the next 15 cycles based on public transit data."}
               </p>
               <div className={`flex items-center gap-3 px-6 py-3 border rounded-2xl w-fit ${recommendation?.best && (recommendation.best.occupancy ?? 0) > 70 ? 'bg-red-500/10 border-red-500/20 text-red-500 shadow-2xl shadow-red-500/20' : 'bg-amber-500/10 border-amber-500/20 text-amber-500 shadow-2xl shadow-amber-500/20'}`}>
                  <span className="text-[11px] font-black uppercase tracking-[0.3em]">
                    {recommendation?.best && (recommendation.best.occupancy ?? 0) > 70 ? "Protocol: Redirect" : "Surge Threshold Approaching"}
                  </span>
               </div>
               <div className="absolute top-0 right-0 p-10 opacity-0 group-hover:opacity-10 transition-all duration-1000 group-hover:scale-150">
                  <Activity size={100} className="text-amber-500" />
               </div>
            </motion.div>

            {/* Cleanliness Impact Card */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="glass-panel p-10 border-white/5 hover:border-emerald-500/40 transition-all duration-700 shadow-2xl relative overflow-hidden"
            >
               <ShieldCheck className="text-emerald-500 mb-8" size={32} />
               <h4 className="text-2xl font-black text-white mb-4 tracking-tighter">Surface Integrity</h4>
               <p className="text-sm text-premium-muted mb-10 leading-relaxed font-medium opacity-70 group-hover:opacity-100 transition-opacity">
                 Strategic cleaning priority is dynamically adjusted via neural analysis of node pressure and air quality.
               </p>
               <div className="space-y-6">
                  <div className="flex justify-between text-[11px] font-black uppercase tracking-[0.4em]">
                     <span className="text-premium-muted">Load Intensity</span>
                     <span className="text-white">{activeUnit?.occupancy ?? 0}%</span>
                  </div>
                  <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden border border-white/5">
                     <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${activeUnit?.occupancy ?? 0}%` }}
                        transition={{ duration: 1.5, ease: "circOut" }}
                        className={`h-full transition-all duration-1000 ${activeUnit && (activeUnit.occupancy ?? 0) > 80 ? 'bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.6)]' : 'bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.6)]'}`} 
                     />
                  </div>
                  <p className="text-[10px] text-premium-muted uppercase font-black tracking-[0.3em] opacity-60">
                    {activeUnit && (activeUnit.occupancy ?? 0) > 80 ? "Service Protocol Generated" : "Environmental Health: Optimal"}
                  </p>
               </div>
               <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl" />
            </motion.div>
          </div>
        </div>

        {/* Public Feedback Integration */}
        <motion.section 
          whileHover={{ y: -5 }}
          className="p-16 md:p-24 glass-panel rounded-[5rem] border-white/5 overflow-hidden relative shadow-[0_80px_200px_rgba(0,0,0,0.8)]"
        >
          <div className="max-w-3xl relative z-10">
            <div className="flex items-center gap-4 mb-8">
               <Database size={24} className="text-premium-accent" />
               <span className="text-[11px] font-black text-premium-accent uppercase tracking-[0.5em]">Audit Registry 2.0</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter leading-none">Public <br /><span className="text-premium-muted/20">Accountability.</span></h2>
            <p className="text-premium-muted text-xl font-medium mb-12 leading-relaxed opacity-80 max-w-2xl">
              Every municipal node maintains a unique cryptographic identity. Discrepancies are 
              instantly synchronized with field operations and surface in the public transparency ledger.
            </p>
            <div className="flex flex-wrap gap-8">
              <button 
                onClick={() => navigate('/cleaner')}
                className="flex items-center gap-5 px-14 py-7 bg-premium-accent text-white rounded-3xl text-[12px] font-black uppercase tracking-[0.3em] shadow-[0_20px_50px_rgba(59,130,246,0.3)] hover:scale-105 active:scale-95 transition-all duration-500"
              >
                <Smartphone size={24} /> Deploy Field Service
              </button>
              <button 
                onClick={() => navigate('/budget')}
                className="flex items-center gap-5 px-14 py-7 bg-white/5 text-white rounded-3xl border border-white/10 text-[12px] font-black uppercase tracking-[0.3em] hover:bg-white/10 transition-all shadow-2xl backdrop-blur-3xl"
              >
                <QrCode size={24} /> Audit Trail Log
              </button>
            </div>
          </div>
          <div className="absolute right-0 bottom-0 p-24 opacity-5 hidden lg:block select-none pointer-events-none">
             <QrCode size={450} className="text-premium-accent rotate-12" />
          </div>
          {/* Background Glow */}
          <div className="absolute inset-0 bg-gradient-to-t from-premium-accent/5 to-transparent pointer-events-none" />
        </motion.section>

        <footer className="mt-32 pt-16 border-t border-white/5 text-center">
           <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-4 mx-auto text-[13px] text-premium-muted font-black uppercase tracking-[0.5em] hover:text-white transition-all duration-500 group"
           >
             <ArrowRight className="rotate-180 group-hover:-translate-x-3 transition-transform duration-500" size={24} /> 
             Return to Central Command
           </button>
        </footer>
      </div>
    </div>
  );
};

export default QueueInsights;

import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowUpRight, Zap, Database } from 'lucide-react';

interface FooterProps {
  onOpenDeepDive?: () => void;
}

const Footer: React.FC<FooterProps> = ({ onOpenDeepDive }) => {
  const navigate = useNavigate();

  return (
    <footer className="relative z-10 px-10 py-40 border-t border-white/5 bg-premium-bg overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-[40%] bg-premium-accent/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-6xl mx-auto text-center mb-40 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "circOut" }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-xl bg-white/5 text-premium-muted text-[10px] font-black uppercase tracking-[0.4em] mb-12 border border-white/10">
            <Zap size={14} className="text-premium-accent" />
            Infrastructure Synthesis
          </div>
          <h3 className="text-6xl md:text-9xl font-black text-white mb-12 tracking-tighter leading-[0.85]">
            Command your <br />
            <span className="text-premium-accent">Metropolis.</span>
          </h3>
          <p className="text-premium-muted mb-16 text-xl max-w-3xl mx-auto leading-relaxed font-medium opacity-80">
            Join the digital sanitation revolution. SAAF transforms municipal hygiene 
            into a mission-critical utility with deep AI-driven operational intelligence.
          </p>
          <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
            <button 
              onClick={() => navigate('/login')}
              className="group px-14 py-6 bg-white text-black font-black text-[11px] uppercase tracking-[0.3em] rounded-2xl transition-all shadow-2xl hover:scale-105 active:scale-95 flex items-center gap-4"
            >
              Request Access
              <ArrowUpRight size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </button>
            <button 
              onClick={onOpenDeepDive}
              className="px-14 py-6 bg-white/5 hover:bg-white/10 text-white font-black text-[11px] uppercase tracking-[0.3em] rounded-2xl border border-white/10 transition-all backdrop-blur-3xl hover:border-premium-accent/30"
            >
              System Specs
            </button>
          </div>
        </motion.div>
      </div>
      
      <div className="max-w-7xl mx-auto pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-12 text-premium-muted text-[10px] font-black uppercase tracking-[0.2em] relative z-10">
        <div className="flex items-center gap-6">
          <div className="w-12 h-12 rounded-2xl bg-premium-accent flex items-center justify-center font-black text-white text-xl shadow-2xl shadow-premium-accent/20">S</div>
          <div>
            <div className="text-white mb-1">© 2026 SAAF GRID</div>
            <div className="opacity-40">Digital Municipal Command Center</div>
          </div>
        </div>
        <div className="flex items-center gap-12">
          <a href="#" className="hover:text-white transition-colors flex items-center gap-2">
            <ShieldCheck size={14} /> Security
          </a>
          <a href="#" className="hover:text-white transition-colors">Privacy Protocol</a>
          <a href="#" className="hover:text-white transition-colors flex items-center gap-2">
            <Database size={14} /> Core API
          </a>
          <a href="#" className="hover:text-premium-accent transition-colors">v2.1 Master</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

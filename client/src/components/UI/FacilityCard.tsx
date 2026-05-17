import React from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Clock, MapPin, Star, Shield, Users } from 'lucide-react';

export interface FacilityData {
  id: number;
  name: string;
  location: string;
  address?: string;
  lat?: number;
  lng?: number;
  type?: string;
  current_status: 'GREEN' | 'AMBER' | 'RED';
  health: {
    verification_photo?: string;
    last_cleaned_at?: string;
    cleanliness_score?: number;
    ammonia?: number;
    humidity?: number;
    last_reading?: string;
    odor?: number;
  };
  is_verified?: boolean;
  cleanliness_score?: number;
  last_verified_at?: string;
  wait_time?: number;
  rating?: number | null;
  review_count?: number;
  status?: string;
  hours?: string;
  owning_agency?: string;
  ward_number?: string;
  zone?: string;
  contractor_name?: string;
  compliance_score?: number;
  total_stalls?: number;
  occupancy?: number;
}

const FacilityCard: React.FC<{ facility: FacilityData; onClick?: () => void }> = ({ facility, onClick }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [4, -4]);
  const rotateY = useTransform(x, [-100, 100], [-4, 4]);

  function handleMouseMove(event: React.MouseEvent) {
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(event.clientX - centerX);
    y.set(event.clientY - centerY);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  const waitTimeText = facility.wait_time !== undefined ? `${facility.wait_time}m wait` : 'Ready';

  return (
    <motion.div
      style={{ rotateX, rotateY, perspective: 1000 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ y: -8, transition: { duration: 0.3, ease: "easeOut" } }}
      onClick={onClick}
      className="glass-panel p-8 cursor-pointer group hover:border-premium-accent/40 flex flex-col gap-6 relative overflow-hidden"
    >
      <div className="flex justify-between items-start relative z-10">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
             <div className="w-1.5 h-1.5 rounded-full bg-premium-accent shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
             <span className="text-[10px] font-black text-premium-muted uppercase tracking-[0.2em]">{facility.type || 'Sanitation Hub'}</span>
          </div>
          <h3 className="text-2xl font-black text-white tracking-tighter line-clamp-1 group-hover:text-premium-accent transition-colors duration-500">
            {facility.name}
          </h3>
          <div className="flex items-center gap-2 text-premium-muted mt-2">
            <MapPin size={12} className="text-premium-accent" />
            <span className="text-[11px] font-bold uppercase tracking-wider line-clamp-1">{facility.location}</span>
          </div>
        </div>
        <div className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border backdrop-blur-md ${
          facility.status === 'CLOSED' ? 'bg-status-issue/10 text-status-issue border-status-issue/20 shadow-[0_0_15px_rgba(239,68,68,0.1)]' : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]'
        }`}>
          {facility.status === 'CLOSED' ? 'Inactive' : 'Online'}
        </div>
      </div>

      <div className="flex items-center gap-6 py-5 border-y border-white/5 relative z-10">
        <div className="flex flex-col gap-1">
          <span className="text-[9px] font-black text-premium-muted uppercase tracking-widest">Quality Score</span>
          <div className="flex items-center gap-1.5">
            <Star size={14} className="text-status-attention fill-status-attention" />
            <span className="text-sm text-white font-black">{facility.rating?.toFixed(1) || 'NEW'}</span>
          </div>
        </div>
        <div className="w-[1px] h-8 bg-white/5" />
        <div className="flex flex-col gap-1">
          <span className="text-[9px] font-black text-premium-muted uppercase tracking-widest">Load Status</span>
          <div className="flex items-center gap-2">
            <Clock size={14} className="text-premium-accent" />
            <span className="text-sm font-black text-white">{waitTimeText}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-auto relative z-10">
        <div className="flex items-center gap-3">
           <div className="w-8 h-8 bg-white/5 rounded-xl flex items-center justify-center group-hover:bg-premium-accent/10 transition-colors border border-white/5 group-hover:border-premium-accent/20">
             <Shield size={14} className="text-premium-muted group-hover:text-premium-accent transition-colors" />
           </div>
           <div className="flex flex-col">
             <span className="text-[8px] font-black text-premium-muted uppercase tracking-[0.1em]">Certified by</span>
             <span className="text-[10px] font-bold text-white tracking-tight">
               {facility.owning_agency || 'Nagar Nigam'}
             </span>
           </div>
        </div>
        <div className="text-right">
           <span className="text-[9px] font-black text-premium-muted uppercase tracking-widest block mb-1">Schedule</span>
           <span className="text-[10px] font-bold text-white uppercase tracking-tighter">
             {facility.hours || '24/7'}
           </span>
        </div>
      </div>

      {/* Interactive Hover Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-premium-accent/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
      <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-premium-accent/10 blur-[40px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
    </motion.div>
  );
};

export default FacilityCard;



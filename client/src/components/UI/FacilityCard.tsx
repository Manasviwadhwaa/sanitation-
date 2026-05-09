import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Accessibility, MapPin, Zap } from 'lucide-react';
import StatusBadge from './StatusBadge';
import QueueBar from './QueueBar';
import { useNavigate } from 'react-router-dom';

export interface FacilityData {
  id: number;
  name: string;
  location: string;
  current_status: 'GREEN' | 'AMBER' | 'RED';
  health: {
    ammonia: number;
    humidity: number;
    last_reading?: string;
  };
  occupancy: number;
  wait_time: number;
  type: 'men' | 'women' | 'unisex' | 'accessible';
  total_stalls: number;
  lat?: number;
  lng?: number;
  aiRecommendation?: string;
  rushPrediction?: string;
}

const FacilityCard: React.FC<{ facility: FacilityData }> = ({ facility }) => {
  const navigate = useNavigate();

  const getCleanlinessScore = () => {
    const base = 100 - (facility.health?.ammonia * 1.5 || 0);
    return Math.max(Math.min(base, 100), 0);
  };

  const getStatusLabel = () => {
    switch(facility.current_status) {
      case 'GREEN': return 'Clean & Clear';
      case 'AMBER': return 'High Load';
      case 'RED': return 'Critical / OOS';
      default: return 'Online';
    }
  };

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      onClick={() => navigate(`/facility/${facility.id}`)}
      className="group relative bg-atmosBgAlt/60 backdrop-blur-xl p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-white/5 hover:border-atmosAccent/30 transition-all duration-500 overflow-hidden cursor-pointer h-full flex flex-col"
    >
      {/* Dynamic Status Glow */}
      <div className={`absolute -top-24 -right-24 w-32 md:w-48 h-32 md:h-48 blur-[100px] rounded-full opacity-10 group-hover:opacity-30 transition-all duration-700 ${facility.current_status === 'GREEN' ? 'bg-green-500' : facility.current_status === 'AMBER' ? 'bg-amber-500' : 'bg-red-500'}`} />

      <div className="flex justify-between items-start mb-6 md:mb-8 relative z-10">
        <div className="flex-1 pr-4 min-w-0">
          <h3 className="text-xl md:text-2xl font-bold text-atmosText tracking-tighter mb-2 group-hover:text-atmosAccent transition-colors leading-tight truncate">{facility.name}</h3>
          <div className="flex items-center gap-2 text-[9px] md:text-[10px] text-atmosTextMuted font-bold uppercase tracking-widest truncate">
            <MapPin size={12} className="text-atmosAccent shrink-0" />
            <span className="truncate">{facility.location}</span>
          </div>
        </div>
        <div className="shrink-0 scale-90 md:scale-100 origin-right">
          <StatusBadge 
            status={facility.current_status} 
            label={getStatusLabel()} 
          />
        </div>
      </div>

      <div className="space-y-4 md:space-y-6 mb-6 md:mb-8 flex-1 relative z-10">
        <QueueBar 
          label="Hygiene Index" 
          value={`${getCleanlinessScore().toFixed(0)}%`} 
          progress={getCleanlinessScore()} 
        />
        <QueueBar 
          label="Neural Occupancy" 
          value={`${facility.occupancy || 0} Users`} 
          progress={(facility.occupancy / (facility.total_stalls || 15)) * 100} 
        />
      </div>

      <div className="flex items-center justify-between pt-4 md:pt-6 border-t border-white/5 relative z-10">
        <div className="flex items-center gap-2 text-atmosTextMuted">
          <Clock size={12} className="text-atmosAccent" />
          <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-wider">Wait: <span className="text-atmosText">{facility.wait_time || 0}m</span></span>
        </div>
        
        <div className="flex items-center gap-1.5">
           <div className="w-7 h-7 md:w-8 md:h-8 flex items-center justify-center rounded-xl bg-white/5 text-[9px] md:text-[10px] font-bold text-atmosAccentSoft border border-white/5 group-hover:border-atmosAccent/20 transition-colors uppercase">
              {facility.type.charAt(0)}
           </div>
           {facility.type === 'accessible' && (
             <div className="w-7 h-7 md:w-8 md:h-8 flex items-center justify-center rounded-xl bg-white/5 text-atmosAccentSoft border border-white/5">
                <Accessibility size={12} md:size={14} />
             </div>
           )}
        </div>
      </div>

      <AnimatePresence>
        {facility.aiRecommendation && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 md:mt-6 p-3 md:p-4 bg-atmosAccent/5 border border-atmosAccent/10 rounded-[1.2rem] md:rounded-[1.5rem] relative z-10"
          >
            <div className="flex items-center gap-2 mb-1.5 md:mb-2">
              <Zap className="text-atmosAccentSoft" size={10} md:size={12} />
              <span className="text-[8px] md:text-[9px] font-bold text-atmosAccentSoft uppercase tracking-widest">NVIDIA NIM Insight</span>
            </div>
            <p className="text-[10px] md:text-[11px] text-atmosText italic leading-relaxed line-clamp-2 md:line-clamp-none">
              "{facility.aiRecommendation}"
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default FacilityCard;

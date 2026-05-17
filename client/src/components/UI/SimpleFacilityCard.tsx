import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Activity, Shield, Clock, Star, ArrowRight } from 'lucide-react';
import type { FacilityData } from './FacilityCard';

interface SimpleFacilityCardProps {
  facility: FacilityData;
  onClick?: () => void;
}

const SimpleFacilityCard: React.FC<SimpleFacilityCardProps> = ({ facility, onClick }) => {
  const isGood = facility.current_status === 'GREEN';

  return (
    <motion.div 
      whileHover={{ y: -4, borderColor: 'rgba(59, 130, 246, 0.4)' }}
      className="bg-[#0f0f0f] border border-[#1f1f1f] rounded-2xl p-6 hover:bg-[#161616] transition-all cursor-pointer group shadow-xl"
      onClick={onClick}
    >
      {/* Human Friendly Header */}
      <div className="flex justify-between items-start mb-6">
        <div className="space-y-1">
          <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors leading-tight">{facility.name}</h3>
          <div className="flex items-center gap-2 text-slate-500">
            <MapPin size={14} className="text-blue-500/60" />
            <span className="text-xs font-medium">{facility.location}</span>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
          isGood ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-amber-500/10 border-amber-500/20 text-amber-500'
        }`}>
          {isGood ? 'All Clear' : 'Attention'}
        </div>
      </div>

      {/* Simplified Status Info */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white/5 p-4 rounded-xl border border-white/5">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Cleanliness</p>
          <div className="flex items-center gap-2">
            <Activity size={16} className="text-emerald-500" />
            <span className="text-sm font-bold text-white">{isGood ? 'Great' : 'Average'}</span>
          </div>
        </div>
        <div className="bg-white/5 p-4 rounded-xl border border-white/5">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">How Busy</p>
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-blue-500" />
            <span className="text-sm font-bold text-white">{facility.wait_time > 10 ? 'Busy' : 'Free'}</span>
          </div>
        </div>
      </div>

      {/* Actions & Simple Stats */}
      <div className="flex items-center justify-between pt-5 border-t border-white/5">
        <div className="flex items-center gap-4">
           <div className="flex items-center gap-1.5 text-xs font-bold text-white">
              <Star size={14} className="text-amber-500 fill-amber-500" />
              <span>{facility.rating?.toFixed(1) || 'N/A'}</span>
           </div>
           <div className="w-1 h-1 rounded-full bg-slate-700" />
           <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Public Rating</span>
        </div>
        
        <div className="flex items-center gap-2 text-xs font-bold text-blue-500 group-hover:gap-3 transition-all">
          Check Details <ArrowRight size={14} />
        </div>
      </div>
    </motion.div>
  );
};

export default SimpleFacilityCard;

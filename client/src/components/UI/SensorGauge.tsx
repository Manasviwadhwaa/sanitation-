import React from 'react';
import { motion } from 'framer-motion';

interface SensorGaugeProps {
  label: string;
  value: number;
  unit: string;
  max: number;
  color: string;
}

const SensorGauge: React.FC<SensorGaugeProps> = ({ label, value, unit, max, color }) => {
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <div className="p-6 bg-atmosBgAlt/30 border border-white/5 rounded-3xl relative overflow-hidden group">
      <div className="relative z-10">
        <div className="text-[9px] text-atmosTextSubtle font-bold uppercase tracking-widest mb-4">{label}</div>
        <div className="flex items-baseline gap-1 mb-6">
          <span className="text-3xl font-bold text-atmosText">{value.toFixed(1)}</span>
          <span className="text-xs text-atmosTextMuted font-medium">{unit}</span>
        </div>
        
        {/* Progress Bar */}
        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full rounded-full"
            style={{ backgroundColor: color }}
          />
        </div>
      </div>
      
      {/* Background Pulse */}
      <div 
        className="absolute -right-4 -bottom-4 w-24 h-24 blur-[40px] opacity-10 group-hover:opacity-20 transition-opacity"
        style={{ backgroundColor: color }}
      />
    </div>
  );
};

export default SensorGauge;

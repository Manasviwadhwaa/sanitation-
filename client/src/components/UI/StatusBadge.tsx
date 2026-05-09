import React from 'react';
import { motion } from 'framer-motion';

interface StatusBadgeProps {
  status: 'GREEN' | 'AMBER' | 'RED';
  label: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, label }) => {
  const colors = {
    GREEN: 'bg-atmosSuccess',
    AMBER: 'bg-atmosWarning',
    RED: 'bg-atmosError',
  };

  return (
    <div className={`flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10`}>
      <motion.div 
        animate={{ opacity: [1, 0.4, 1], scale: [1, 1.2, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
        className={`w-2 h-2 rounded-full ${colors[status]} shadow-[0_0_8px_rgba(34,197,94,0.5)]`}
      />
      <span className="text-[10px] font-bold uppercase tracking-widest text-atmosText">
        {label}
      </span>
    </div>
  );
};

export default StatusBadge;

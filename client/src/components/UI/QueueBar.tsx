import React from 'react';

interface QueueBarProps {
  progress: number; // 0 to 100
  label: string;
  value: string;
}

const QueueBar: React.FC<QueueBarProps> = ({ progress, label, value }) => {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-end">
        <span className="text-[10px] text-atmosTextMuted uppercase font-bold tracking-wider">{label}</span>
        <span className="text-xs font-mono font-bold text-atmosAccent">{value}</span>
      </div>
      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-atmosAccent to-atmosAccentSoft rounded-full transition-all duration-1000"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default QueueBar;

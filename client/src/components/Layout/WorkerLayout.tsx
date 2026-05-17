import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { ClipboardList, Map, CheckCircle, Bell, User, Clock } from 'lucide-react';

const WorkerLayout: React.FC = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#ededed] font-sans selection:bg-blue-500/30">
      {/* Worker Header: High Contrast & Functional */}
      <header className="sticky top-0 z-50 bg-[#0f0f0f] border-b border-[#1f1f1f] px-6 py-4 flex items-center justify-between shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-amber-500 rounded flex items-center justify-center font-bold text-black shadow-lg shadow-amber-500/20">W</div>
          <div className="flex flex-col">
            <span className="text-xs font-black tracking-widest uppercase">Field Force</span>
            <span className="text-[10px] text-amber-500 font-bold uppercase tracking-tighter">Operational Mode</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex flex-col items-end">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active Shift</p>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-500">
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
               08:00 - 16:00
            </div>
          </div>
          <div className="h-8 w-[1px] bg-[#1f1f1f]"></div>
          <button className="p-2 text-slate-500 hover:text-white transition-colors relative">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-blue-600 rounded-full animate-ping"></span>
          </button>
        </div>
      </header>

      {/* Mobile Task Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#0f0f0f] border-t border-[#1f1f1f] grid grid-cols-4 px-2 py-3 shadow-[0_-20px_40px_rgba(0,0,0,0.5)]">
        {[
          { label: 'Jobs', icon: ClipboardList, path: '/worker' },
          { label: 'Map', icon: Map, path: '/worker/map' },
          { label: 'History', icon: CheckCircle, path: '/worker/history' },
          { label: 'Profile', icon: User, path: '/worker/profile' },
        ].map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center gap-1.5 transition-all ${
              location.pathname === item.path ? 'text-amber-500 scale-105' : 'text-slate-600 hover:text-slate-300'
            }`}
          >
            <item.icon size={22} className={location.pathname === item.path ? 'drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]' : ''} />
            <span className="text-[9px] font-black uppercase tracking-widest">{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* Operations Surface */}
      <main className="pb-32 pt-8 px-6 max-w-lg mx-auto">
        <Outlet />
      </main>

      {/* Status Overlay: Always visible for non-tech reassurance */}
      <div className="fixed bottom-24 right-6 pointer-events-none">
         <div className="bg-[#1a1a1a] border border-white/5 rounded-full px-4 py-2 flex items-center gap-3 shadow-2xl backdrop-blur-xl">
            <Clock size={12} className="text-amber-500" />
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">SLA: 02h 45m left</span>
         </div>
      </div>
    </div>
  );
};

export default WorkerLayout;

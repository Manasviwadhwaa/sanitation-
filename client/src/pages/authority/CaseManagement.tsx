import React from 'react';
import { 
  ListFilter, 
  Search, 
  MoreVertical, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  ArrowRight,
  Filter
} from 'lucide-react';

const CaseManagement: React.FC = () => {
  const cases = [
    { id: 'CAS-1024', title: 'Major Leak: Sector 4', worker: 'Rohan S.', status: 'IN_PROGRESS', time: '2h active', priority: 'URGENT' },
    { id: 'CAS-1025', title: 'Trash Overflow: Market', worker: 'Anita M.', status: 'ASSIGNED', time: '10m ago', priority: 'HIGH' },
    { id: 'CAS-1026', title: 'Odor Report: Central', worker: 'Unassigned', status: 'PENDING', time: '1h ago', priority: 'NORMAL' },
    { id: 'CAS-1027', title: 'Wall Graffiti: Park', worker: 'Suresh K.', status: 'COMPLETED', time: 'Finished', priority: 'LOW' },
  ];

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tighter">Case Management</h1>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-2">Internal Workflow & Task Distribution</p>
        </div>
        <div className="flex items-center gap-4">
           <button className="flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400">
              <Filter size={14} /> All Departments
           </button>
           <button className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest text-white hover:bg-blue-700 transition-all">
              Batch Actions
           </button>
        </div>
      </div>

      {/* Control Strip */}
      <div className="bg-[#0f172a] border border-white/5 p-6 rounded-2xl flex flex-col md:flex-row items-center gap-6 shadow-2xl">
         <div className="relative flex-1 w-full">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <input type="text" placeholder="Search case by ID, worker name, or location..." className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-12 pr-6 text-xs text-white outline-none focus:border-blue-500/50" />
         </div>
         <div className="h-6 w-[1px] bg-white/5 hidden md:block" />
         <div className="flex items-center gap-3">
            {['PENDING', 'ACTIVE', 'RESOLVED'].map(s => (
              <button key={s} className="px-4 py-2 rounded-lg text-[9px] font-black text-slate-500 hover:text-white transition-colors">{s}</button>
            ))}
         </div>
      </div>

      {/* Case Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {cases.map((c, i) => (
          <div key={i} className="bg-[#0f172a] border border-white/5 rounded-[2rem] p-8 space-y-8 group hover:border-blue-500/30 transition-all shadow-2xl">
             <div className="flex justify-between items-start">
                <div className="space-y-1">
                   <div className="flex items-center gap-3">
                      <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">{c.id}</span>
                      <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                        c.priority === 'URGENT' ? 'bg-red-500 text-white' : 'bg-slate-700 text-slate-300'
                      }`}>{c.priority}</span>
                   </div>
                   <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">{c.title}</h3>
                </div>
                <button className="p-2 text-slate-600 hover:text-white transition-colors">
                   <MoreVertical size={20} />
                </button>
             </div>

             <div className="grid grid-cols-2 gap-8 pt-4 border-t border-white/5">
                <div className="space-y-2">
                   <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Assigned Specialist</p>
                   <div className="flex items-center gap-3 text-sm font-bold text-slate-300">
                      <div className="w-6 h-6 bg-white/5 rounded-full flex items-center justify-center text-[10px]">{c.worker.charAt(0)}</div>
                      {c.worker}
                   </div>
                </div>
                <div className="space-y-2">
                   <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Status / Duration</p>
                   <div className="flex items-center gap-3 text-sm font-bold text-slate-300">
                      <Clock size={16} className="text-blue-500" />
                      {c.time}
                   </div>
                </div>
             </div>

             <div className="flex items-center justify-between pt-4">
                <div className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${
                  c.status === 'COMPLETED' ? 'text-emerald-500' : 'text-amber-500'
                }`}>
                   <div className={`w-2 h-2 rounded-full animate-pulse ${
                     c.status === 'COMPLETED' ? 'bg-emerald-500' : 'bg-amber-500'
                   }`} />
                   {c.status.replace('_', ' ')}
                </div>
                <button className="flex items-center gap-2 text-[10px] font-black text-blue-500 uppercase tracking-widest group-hover:gap-3 transition-all">
                   Manage Case <ArrowRight size={14} />
                </button>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CaseManagement;

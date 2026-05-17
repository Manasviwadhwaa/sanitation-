import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ClipboardList, MapPin, Clock, Camera, CheckCircle2, 
  AlertTriangle, ArrowRight, ChevronRight, Menu, Zap,
  Crosshair, ShieldCheck, Play
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const WorkerHome: React.FC = () => {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState<'tasks'|'camera'>('tasks');

  const jobs = [
    { id: 'JOB-902', area: 'Central Market', priority: 'CRITICAL', type: 'Biohazard Cleanup', sla: '12m left' },
    { id: 'JOB-905', area: 'North Wing Transit', priority: 'HIGH', type: 'Restocking', sla: '45m left' },
    { id: 'JOB-910', area: 'Sector 5 Node', priority: 'NORMAL', type: 'Routine Wash', sla: '2h left' },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-blue-500/30">
      
      {/* Worker Header */}
      <header className="bg-[#0f172a] text-white p-8 rounded-b-[3rem] shadow-2xl relative overflow-hidden">
         <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 blur-[80px] rounded-full" />
         
         <div className="flex justify-between items-center relative z-10 mb-8">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-white/10 rounded-full border-2 border-white/20 flex items-center justify-center overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150" alt="Worker Profile" className="w-full h-full object-cover" />
               </div>
               <div>
                  <h1 className="text-xl font-black tracking-tight uppercase leading-none">Ram Kumar</h1>
                  <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mt-1">Field Operative • Zone A</p>
               </div>
            </div>
            <button className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/10">
               <Menu size={24} />
            </button>
         </div>

         <div className="relative z-10 grid grid-cols-2 gap-4">
            <div className="bg-white/10 backdrop-blur-md rounded-[2rem] p-6 border border-white/10">
               <p className="text-[9px] font-black text-blue-300 uppercase tracking-[0.2em] mb-1">Shift Time</p>
               <p className="text-2xl font-black tracking-tighter">04:22</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-[2rem] p-6 border border-white/10">
               <p className="text-[9px] font-black text-emerald-400 uppercase tracking-[0.2em] mb-1">Completed</p>
               <p className="text-2xl font-black tracking-tighter">12 <span className="text-sm text-slate-400">/ 15</span></p>
            </div>
         </div>
      </header>

      <div className="p-6 space-y-8 -mt-6 relative z-20">
         
         {/* Action Hub */}
         <section className="grid grid-cols-2 gap-4">
            <button className="bg-blue-600 hover:bg-blue-700 text-white p-6 rounded-[2.5rem] flex flex-col items-start gap-4 shadow-xl shadow-blue-600/20 active:scale-95 transition-all group">
               <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                  <Camera size={24} />
               </div>
               <div className="text-left">
                  <span className="block text-sm font-black uppercase tracking-tight">Audit Proof</span>
                  <span className="text-[9px] font-bold text-blue-200 uppercase tracking-widest">Upload Photo</span>
               </div>
            </button>
            <button className="bg-white hover:bg-slate-50 text-slate-900 p-6 rounded-[2.5rem] flex flex-col items-start gap-4 shadow-xl shadow-slate-200/50 border border-slate-100 active:scale-95 transition-all group">
               <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-600">
                  <CheckCircle2 size={24} />
               </div>
               <div className="text-left">
                  <span className="block text-sm font-black uppercase tracking-tight">End Shift</span>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Clock Out</span>
               </div>
            </button>
         </section>

         {/* Dispatch Queue */}
         <section className="space-y-6">
            <div className="flex justify-between items-end px-2">
               <div>
                  <h2 className="text-2xl font-black tracking-tighter uppercase text-slate-900">Dispatch List</h2>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Pending Assignments</p>
               </div>
               <div className="px-3 py-1.5 bg-red-100 text-red-600 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                  <Zap size={12} fill="currentColor" /> 1 Critical
               </div>
            </div>

            <div className="space-y-4">
               {jobs.map((job, i) => (
                  <motion.div 
                     key={i}
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ delay: i * 0.1, duration: 0.4, ease: "easeOut" }}
                     className="bg-white border-2 border-slate-100 rounded-[2.5rem] p-6 hover:border-blue-500 transition-colors shadow-sm group cursor-pointer"
                  >
                     <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-3">
                           <div className={`w-3 h-3 rounded-full shadow-sm ${
                              job.priority === 'CRITICAL' ? 'bg-red-500 shadow-red-500/50' : 
                              job.priority === 'HIGH' ? 'bg-amber-500 shadow-amber-500/50' : 'bg-emerald-500 shadow-emerald-500/50'
                           }`} />
                           <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{job.id}</span>
                        </div>
                        <div className="flex items-center gap-1 text-[10px] font-black text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg uppercase tracking-wider">
                           <Clock size={12} /> {job.sla}
                        </div>
                     </div>
                     
                     <div className="space-y-1 mb-6">
                        <h3 className="text-xl font-black tracking-tighter uppercase text-slate-900">{job.area}</h3>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{job.type}</p>
                     </div>

                     <div className="flex gap-3">
                        <button className="flex-1 py-4 bg-slate-50 group-hover:bg-blue-50 text-slate-500 group-hover:text-blue-600 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-colors border border-slate-100 flex items-center justify-center gap-2">
                           <MapPin size={14} /> Location
                        </button>
                        <button className="w-16 bg-slate-900 hover:bg-blue-600 text-white rounded-2xl flex items-center justify-center transition-colors shadow-lg shadow-slate-900/10">
                           <Play size={18} fill="currentColor" />
                        </button>
                     </div>
                  </motion.div>
               ))}
            </div>
         </section>
         
         {/* Protocol Disclaimer */}
         <div className="bg-blue-50 border border-blue-100 rounded-[2rem] p-6 flex gap-4 items-start pb-24">
            <ShieldCheck size={24} className="text-blue-600 shrink-0" />
            <p className="text-[10px] font-black text-blue-800 leading-relaxed uppercase tracking-wider">
               Compliance Required: Visual photographic evidence must be uploaded post-resolution for automatic SLA verification.
            </p>
         </div>
      </div>
    </div>
  );
};

export default WorkerHome;

import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, ArrowLeft, Search, Filter, ShieldCheck, Navigation, Info, ArrowRight, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLiveData } from '../../context/LiveDataContext';

const PublicMap: React.FC = () => {
  const navigate = useNavigate();
  const { facilities } = useLiveData();
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const filtered = useMemo(() => {
    return facilities.filter(f => 
      f.name.toLowerCase().includes(search.toLowerCase()) || 
      f.location.toLowerCase().includes(search.toLowerCase()) ||
      (f.address && f.address.toLowerCase().includes(search.toLowerCase()))
    );
  }, [facilities, search]);

  const selectedFacility = useMemo(() => 
    facilities.find(f => f.id === selectedId), 
  [facilities, selectedId]);

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] overflow-hidden -mt-6">
      {/* Search Header */}
      <div className="p-6 bg-white border-b border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between z-20 shadow-sm">
         <div className="flex items-center gap-4 w-full md:w-auto">
            <button onClick={() => navigate('/public')} className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-400 hover:text-blue-600 transition-all">
              <ArrowLeft size={20} />
            </button>
            <div className="relative flex-1 md:w-96">
               <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
               <input 
                 type="text" 
                 placeholder="Search SAAF certified nodes..." 
                 value={search}
                 onChange={(e) => setSearch(e.target.value)}
                 className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 pl-12 pr-4 text-sm outline-none focus:border-blue-500 transition-all"
               />
            </div>
         </div>
         <div className="flex items-center gap-3 w-full md:w-auto">
            <button className="flex-1 md:flex-none px-6 py-3 bg-slate-900 text-white font-bold rounded-2xl text-[10px] uppercase tracking-widest flex items-center justify-center gap-2">
               <Filter size={14} /> Filter Range
            </button>
         </div>
      </div>

      <div className="flex-1 relative flex flex-col md:flex-row overflow-hidden">
        
        {/* Map Surface */}
        <div className="flex-1 bg-[#f1f5f9] relative overflow-hidden group">
           {/* Grid Pattern */}
           <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-60" />
           
           {/* Interactive Markers with Zoom Effect */}
           <motion.div 
             animate={{ 
               scale: selectedId ? 1.8 : 1,
               x: selectedId ? '-10%' : '0%',
               y: selectedId ? '-10%' : '0%'
             }}
             transition={{ type: "spring", stiffness: 100, damping: 20 }}
             className="absolute inset-0 p-12 origin-center"
           >
              {filtered.map((f, i) => (
                <motion.button
                  key={f.id}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ 
                    scale: 1, 
                    opacity: 1,
                    x: `${(i * 15) % 80}%`, 
                    y: `${(i * 12) % 70}%` 
                  }}
                  whileHover={{ scale: 1.2, zIndex: 30 }}
                  onClick={() => setSelectedId(f.id)}
                  className={`absolute p-1 rounded-full border-4 shadow-2xl transition-colors ${
                    selectedId === f.id ? 'border-blue-600 bg-white scale-125 z-40' : 'border-white bg-blue-600'
                  }`}
                >
                   <div className={`w-3 h-3 rounded-full ${
                     f.current_status === 'RED' ? 'bg-red-500' : 
                     f.current_status === 'AMBER' ? 'bg-amber-500' : 'bg-emerald-400'
                   } ${selectedId === f.id ? '' : 'animate-pulse'}`} />
                   
                   {/* Mini Label */}
                   <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-1 bg-slate-900 text-white rounded-lg text-[8px] font-black uppercase tracking-widest whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                      {f.name}
                   </div>
                </motion.button>
              ))}
           </motion.div>

           {/* Selected Detail Tooltip (Desktop) */}
           <AnimatePresence>
              {selectedFacility && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, x: '-50%' }}
                  animate={{ opacity: 1, y: 0, x: '-50%' }}
                  exit={{ opacity: 0, y: 10, x: '-50%' }}
                  className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white p-6 rounded-[2.5rem] border border-white/10 shadow-2xl z-50 min-w-[320px]"
                >
                   <div className="flex justify-between items-start mb-6">
                      <div className="space-y-1">
                         <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest">SBM Certified Hub</span>
                         <h4 className="text-xl font-black uppercase tracking-tighter">{selectedFacility.name}</h4>
                      </div>
                      <button onClick={() => setSelectedId(null)} className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors">
                         <X size={16} />
                      </button>
                   </div>
                   <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="space-y-1">
                         <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Status</p>
                         <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${selectedFacility.current_status === 'GREEN' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                            <span className="text-xs font-bold uppercase">{selectedFacility.current_status}</span>
                         </div>
                      </div>
                      <div className="space-y-1 text-right">
                         <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Efficiency</p>
                         <p className="text-xs font-black text-blue-500">98.4%</p>
                      </div>
                   </div>
                   <button 
                    onClick={() => navigate(`/public/report?facilityId=${selectedFacility.id}`)}
                    className="w-full py-4 bg-blue-600 hover:bg-blue-700 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2"
                   >
                      Tap to Report Issue <ArrowRight size={14} />
                   </button>
                </motion.div>
              )}
           </AnimatePresence>

           <div className="absolute top-8 right-8 flex flex-col gap-3">
              <button className="p-4 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-blue-600 transition-all shadow-xl active:scale-95">
                 <Navigation size={24} />
              </button>
              <button className="p-4 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-blue-600 transition-all shadow-xl active:scale-95">
                 <Info size={24} />
              </button>
           </div>
        </div>

        {/* List Sidebar */}
        <div className="w-full md:w-96 bg-white border-l border-slate-100 overflow-y-auto p-8 space-y-8 h-1/2 md:h-auto">
           <div className="flex items-center justify-between">
              <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Facilities Indexed</h2>
              <span className="px-2 py-1 bg-slate-100 rounded text-[10px] font-black text-slate-600 uppercase">{filtered.length} Nodes</span>
           </div>
           
           <div className="space-y-4">
              {filtered.map((f) => (
                <button 
                  key={f.id}
                  onClick={() => setSelectedId(f.id)}
                  className={`w-full text-left p-6 rounded-[2rem] border transition-all space-y-3 group ${
                    selectedId === f.id ? 'bg-slate-900 border-slate-900 shadow-2xl' : 'bg-slate-50 border-slate-100 hover:border-blue-500/30'
                  }`}
                >
                   <div className="flex justify-between items-start">
                      <div className={`p-2 rounded-xl transition-colors ${selectedId === f.id ? 'bg-blue-600 text-white' : 'bg-white text-slate-400 group-hover:text-blue-600'}`}>
                         <MapPin size={18} />
                      </div>
                      <div className={`w-2 h-2 rounded-full ${
                        f.current_status === 'GREEN' ? 'bg-emerald-500' : 'bg-amber-500'
                      }`} />
                   </div>
                   <div>
                      <h4 className={`text-sm font-black uppercase tracking-tight ${selectedId === f.id ? 'text-white' : 'text-slate-900'}`}>{f.name}</h4>
                      <p className={`text-[10px] font-bold uppercase tracking-widest ${selectedId === f.id ? 'text-slate-400' : 'text-slate-500'}`}>{f.location}</p>
                   </div>
                   {selectedId === f.id && (
                     <motion.div 
                       initial={{ opacity: 0, height: 0 }}
                       animate={{ opacity: 1, height: 'auto' }}
                       className="pt-4 border-t border-white/10 flex items-center justify-between"
                     >
                        <div className="flex items-center gap-2 text-blue-400 text-[10px] font-black uppercase">
                           <Activity size={14} /> Live Sync
                        </div>
                        <ArrowRight size={14} className="text-white" />
                     </motion.div>
                   )}
                </button>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};

const X = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);

export default PublicMap;

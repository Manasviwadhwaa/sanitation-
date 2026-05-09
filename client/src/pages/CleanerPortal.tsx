import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Clock, MapPin, Shield, RefreshCcw, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Skeleton from '../components/UI/Skeleton';

const CleanerPortal: React.FC = () => {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const [tasks, setTasks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const hostname = window.location.hostname;
      const API_URL = import.meta.env.VITE_API_URL || `http://${hostname}:4000`;
      const res = await fetch(`${API_URL}/api/dashboard/alerts-stream`);
      const data = await res.json();
      setTasks(data);
    } catch (e) {
      showToast('Task synchronization failed', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
    const interval = setInterval(fetchTasks, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleCompleteTask = async (taskId: number) => {
    showToast('Submitting completion proof...', 'info');
    try {
      const hostname = window.location.hostname;
      const API_URL = import.meta.env.VITE_API_URL || `http://${hostname}:4000`;
      const res = await fetch(`${API_URL}/api/maintenance/${taskId}/complete`, {
        method: 'PUT'
      });
      if (res.ok) {
        showToast('Sanitization verified & logged', 'success');
        setTasks(prev => prev.filter(t => t.id !== taskId));
      }
    } catch (e) {
      showToast('Submission error', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col">
      {/* Mobile-First Staff Header */}
      <div className="p-4 md:p-6 bg-atmosBgAlt/50 backdrop-blur-2xl border-b border-white/5 sticky top-0 z-50 flex items-center justify-between">
        <div className="flex items-center gap-3 md:gap-4">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-atmosAccent/10 border border-atmosAccent/20 flex items-center justify-center">
            <Shield className="text-atmosAccent w-5 h-5 md:w-6 md:h-6" />
          </div>
          <div>
            <h2 className="text-xs md:text-sm font-bold tracking-tight uppercase truncate max-w-[150px]">{user?.name}</h2>
            <p className="text-[8px] md:text-[9px] text-atmosAccent font-bold uppercase tracking-widest">{user?.role} · Active</p>
          </div>
        </div>
        <button onClick={() => logout()} className="p-2 md:p-3 text-red-500/50 hover:text-red-500 transition-colors">
          <LogOut className="w-4.5 h-4.5 md:w-5 md:h-5" />
        </button>
      </div>

      <main className="flex-1 p-4 md:p-6 max-w-lg mx-auto w-full space-y-6 md:space-y-8 pb-24">
        <div className="flex items-center justify-between">
           <h3 className="text-[9px] md:text-[10px] text-atmosTextMuted font-bold uppercase tracking-[0.2em]">Operational Queue</h3>
           <button onClick={fetchTasks} className="text-atmosAccent p-2">
              <RefreshCcw size={14} className={isLoading ? 'animate-spin' : ''} />
           </button>
        </div>

        {/* Live Task Feed */}
        <div className="space-y-4 md:space-y-6">
          {isLoading ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-40 rounded-3xl" />) : (
            <AnimatePresence>
              {tasks.map((task) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="p-6 md:p-8 bg-atmosBgAlt/30 border border-white/5 rounded-[2rem] md:rounded-[2.5rem] relative overflow-hidden shadow-2xl"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="px-2 md:px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full text-[7px] md:text-[8px] font-bold uppercase tracking-widest">
                      Urgent Sanitization
                    </div>
                    <div className="flex items-center gap-1 text-[8px] md:text-[9px] text-atmosTextSubtle font-mono">
                      <Clock size={10} /> {new Date(task.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>

                  <h4 className="text-lg md:text-xl font-bold mb-2 tracking-tight">{task.facility_name}</h4>
                  <p className="text-xs md:text-sm text-atmosTextSubtle mb-6 md:mb-8 leading-relaxed">{task.issue_reason}</p>

                  <div className="flex flex-col sm:flex-row items-stretch gap-3 md:gap-4 pt-6 border-t border-white/5">
                     <button 
                       onClick={() => handleCompleteTask(task.id)}
                       className="flex-1 py-4 md:py-5 bg-atmosAccent text-black text-[10px] md:text-[11px] font-bold uppercase tracking-widest rounded-2xl hover:bg-atmosAccentSoft transition-all flex items-center justify-center gap-2 active:scale-95 touch-manipulation"
                     >
                        <CheckCircle2 size={16} /> Mark as Sanitized
                     </button>
                     <button className="py-4 md:py-5 px-6 bg-white/5 rounded-2xl text-atmosTextSubtle hover:text-atmosText transition-colors flex items-center justify-center gap-2 border border-white/5">
                        <MapPin size={18} /> <span className="sm:hidden text-[10px] font-bold uppercase">Navigate</span>
                     </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}

          {!isLoading && tasks.length === 0 && (
            <div className="text-center py-20 bg-white/[0.02] border border-dashed border-white/10 rounded-[3rem]">
               <CheckCircle2 className="mx-auto text-atmosSuccess opacity-20 mb-4" size={48} />
               <p className="text-[9px] md:text-[10px] text-atmosTextSubtle uppercase tracking-[0.3em]">All Zones Operational</p>
            </div>
          )}
        </div>
      </main>

      {/* Persistence Bar - Optimized for thumb reach */}
      <div className="fixed bottom-0 left-0 w-full p-4 pb-6 md:p-6 bg-atmosBg/90 backdrop-blur-2xl border-t border-white/10 flex justify-center gap-12 md:gap-16 z-50 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
         <button className="flex flex-col items-center gap-1.5 text-atmosAccent group">
            <div className="p-2 rounded-xl bg-atmosAccent/10 group-active:scale-90 transition-transform">
               <Clock size={20} />
            </div>
            <span className="text-[8px] font-bold uppercase tracking-widest">My Queue</span>
         </button>
         <button className="flex flex-col items-center gap-1.5 opacity-30 hover:opacity-100 transition-opacity group">
            <div className="p-2 rounded-xl bg-white/5 group-active:scale-90 transition-transform">
               <Shield size={20} />
            </div>
            <span className="text-[8px] font-bold uppercase tracking-widest">Protocol</span>
         </button>
      </div>
    </div>
  );
};

export default CleanerPortal;

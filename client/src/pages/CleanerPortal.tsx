import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, Play, Package, Camera, CheckCircle2, RefreshCw, Layout, Activity, Shield, ChevronRight, Zap, Target, ClipboardList } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useLiveData } from '../context/LiveDataContext';
import { API_URL } from '../lib/api';

const CleanerPortal: React.FC = () => {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const { facilities, alerts, uploadPhoto, fetchInitial } = useLiveData();
  
  const [activeTask, setActiveTask] = useState<any>(null);
  const [taskStatus, setTaskStatus] = useState<'IDLE' | 'IN_PROGRESS' | 'RESTOCKING' | 'VERIFYING'>('IDLE');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verificationPhoto, setVerificationPhoto] = useState<File | null>(null);

  const handleStartTask = async (task: any) => {
    setActiveTask(task);
    setTaskStatus('IN_PROGRESS');
    showToast('Service window initialized', 'info');
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setVerificationPhoto(e.target.files[0]);
      setTaskStatus('VERIFYING');
      showToast('Visual evidence attached', 'success');
    }
  };

  const handleComplete = async () => {
    setIsSubmitting(true);
    showToast('Syncing service log to cloud...', 'info');
    
    try {
      let photoUrl = '';
      if (verificationPhoto) {
        const formData = new FormData();
        formData.append('photo', verificationPhoto);
        const uploadRes = await uploadPhoto(formData);
        photoUrl = uploadRes.url;
      }

      const res = await fetch(`${API_URL}/api/maintenance/${activeTask.id}/complete`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          photo: photoUrl,
          cost_inr: 450,
          notes: 'Standard service protocol complete.'
        })
      });

      if (res.ok) {
        setActiveTask(null);
        setTaskStatus('IDLE');
        setVerificationPhoto(null);
        showToast('Service verified & closed', 'success');
        fetchInitial();
      }
    } catch (err) {
      showToast('Offline sync failed', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const pendingTasks = alerts.filter(a => a.status === 'PENDING');

  return (
    <div className="min-h-screen bg-premium-bg text-white pb-32 pt-28 overflow-x-hidden">
      {/* Background Depth */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[10%] left-[-5%] w-[600px] h-[600px] bg-premium-accent/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-[10%] right-[-5%] w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-md mx-auto px-8 relative z-10">
        
        {/* Profile Header */}
        <header className="flex justify-between items-center mb-16">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-[1.5rem] bg-premium-accent text-white flex items-center justify-center font-black text-3xl shadow-2xl shadow-premium-accent/20 border border-white/10 group-hover:scale-110 transition-transform">
              {user?.name?.[0] || 'S'}
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tighter text-white">Service <span className="text-premium-muted/40">Terminal</span></h1>
              <p className="text-[11px] font-black text-premium-muted uppercase tracking-[0.4em]">{user?.name || 'Staff Associate'}</p>
            </div>
          </div>
          <button 
            onClick={() => logout()} 
            className="w-14 h-14 bg-white/5 rounded-2xl text-premium-muted hover:text-white transition-all border border-white/5 hover:bg-white/10 flex items-center justify-center"
          >
            <LogOut size={24} />
          </button>
        </header>

        <AnimatePresence mode="wait">
          {activeTask ? (
            <motion.div 
              key="active"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-panel rounded-[3.5rem] p-12 flex flex-col gap-12 shadow-[0_40px_100px_rgba(0,0,0,0.4)] border-premium-accent/30 relative overflow-hidden"
            >
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-2 h-2 rounded-full bg-premium-accent animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                  <span className="text-[10px] font-black text-premium-accent uppercase tracking-[0.4em]">Active Assignment</span>
                </div>
                <h2 className="text-5xl font-black text-white tracking-tighter mb-6 leading-none">{activeTask.facility_name}</h2>
                <div className="flex items-start gap-4 text-premium-muted bg-white/5 p-6 rounded-2xl border border-white/5">
                  <div className="mt-1">
                    <Activity size={18} className="text-premium-accent" />
                  </div>
                  <span className="text-sm font-medium leading-relaxed opacity-80">{activeTask.description}</span>
                </div>
              </div>

              {/* Progress Stepper */}
              <div className="flex flex-col gap-5">
                {[
                  { label: 'System Init', status: 'done', icon: Play },
                  { label: 'Resource Check', status: taskStatus === 'RESTOCKING' || taskStatus === 'VERIFYING' ? 'done' : 'pending', icon: Package },
                  { label: 'Visual Log', status: taskStatus === 'VERIFYING' ? 'done' : 'pending', icon: Camera }
                ].map((step, i) => (
                  <div 
                    key={i} 
                    className={`flex items-center justify-between p-6 rounded-[2rem] border transition-all duration-700 ${
                      step.status === 'done' 
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500 shadow-inner' 
                        : 'bg-white/5 border-white/5 text-premium-muted'
                    }`}
                  >
                    <div className="flex items-center gap-6">
                      <div className={`p-3 rounded-xl ${step.status === 'done' ? 'bg-emerald-500/20' : 'bg-white/5'}`}>
                        <step.icon size={20} />
                      </div>
                      <span className="text-[11px] font-black uppercase tracking-[0.3em]">{step.label}</span>
                    </div>
                    {step.status === 'done' && <CheckCircle2 size={20} className="animate-pulse" />}
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-6 mt-4 relative z-10">
                {taskStatus === 'IN_PROGRESS' && (
                  <button 
                    onClick={() => setTaskStatus('RESTOCKING')}
                    className="w-full py-8 bg-premium-accent text-white rounded-[2.5rem] font-black text-xs uppercase tracking-[0.4em] shadow-2xl shadow-premium-accent/20 hover:scale-[1.02] active:scale-95 transition-all duration-500"
                  >
                    Authorize Supplies
                  </button>
                )}

                {taskStatus === 'RESTOCKING' && (
                  <label className="w-full py-8 bg-white text-black rounded-[2.5rem] font-black text-xs uppercase tracking-[0.4em] shadow-2xl hover:scale-[1.02] active:scale-95 transition-all duration-500 flex items-center justify-center gap-4 cursor-pointer">
                    <Camera size={24} />
                    Capture Log Proof
                    <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handlePhotoUpload} />
                  </label>
                )}

                {taskStatus === 'VERIFYING' && (
                  <button 
                    onClick={handleComplete}
                    disabled={isSubmitting}
                    className="w-full py-8 bg-emerald-600 text-white rounded-[2.5rem] font-black text-xs uppercase tracking-[0.4em] shadow-2xl shadow-emerald-600/20 hover:scale-[1.02] active:scale-95 transition-all duration-500 flex items-center justify-center gap-4 disabled:opacity-50"
                  >
                    {isSubmitting ? <RefreshCw size={24} className="animate-spin" /> : <Shield size={24} />}
                    {isSubmitting ? 'Syncing...' : 'Verify & Close Log'}
                  </button>
                )}
              </div>
              {/* Background Decoration */}
              <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-premium-accent/5 to-transparent pointer-events-none" />
            </motion.div>
          ) : (
            <motion.div 
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col gap-10"
            >
              <div className="flex justify-between items-center px-4">
                <div className="flex items-center gap-4">
                   <ClipboardList size={18} className="text-premium-accent" />
                   <h3 className="text-[11px] font-black text-premium-muted uppercase tracking-[0.4em]">Active Protocols</h3>
                </div>
                <span className="px-5 py-2 bg-white/5 text-premium-muted text-[10px] font-black rounded-xl border border-white/10 backdrop-blur-xl shadow-inner">{pendingTasks.length} NODES</span>
              </div>

              <div className="flex flex-col gap-6">
                {pendingTasks.length > 0 ? pendingTasks.map((task) => (
                  <button
                    key={task.id}
                    onClick={() => handleStartTask(task)}
                    className="w-full glass-panel p-10 rounded-[3rem] text-left hover:border-premium-accent/40 transition-all duration-500 group flex justify-between items-center shadow-2xl border-white/5 relative overflow-hidden"
                  >
                    <div className="flex-1 pr-8 relative z-10">
                      <h4 className="text-3xl font-black text-white tracking-tighter group-hover:text-premium-accent transition-colors duration-500">{task.facility_name}</h4>
                      <p className="text-[10px] font-black text-premium-muted uppercase tracking-[0.3em] mt-4 leading-relaxed opacity-60">{task.description}</p>
                    </div>
                    <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-premium-muted group-hover:text-white transition-all duration-500 group-hover:bg-premium-accent group-hover:rotate-90 border border-white/5 relative z-10 shadow-2xl">
                      <ChevronRight size={24} />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-br from-premium-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                  </button>
                )) : (
                  <div className="text-center py-32 bg-white/[0.02] rounded-[4rem] border-2 border-dashed border-white/10 relative overflow-hidden group">
                    <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-10 border border-emerald-500/20 shadow-2xl group-hover:scale-110 transition-transform duration-1000">
                      <CheckCircle2 size={40} className="text-emerald-500" />
                    </div>
                    <p className="text-[11px] font-black text-premium-muted uppercase tracking-[0.4em] relative z-10">Operational Zones Clear</p>
                    <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                  </div>
                )}
              </div>

              {/* Session Performance Card */}
              <div className="mt-8 p-12 bg-premium-accent rounded-[3.5rem] shadow-[0_40px_100px_-15px_rgba(59,130,246,0.4)] flex justify-between items-center overflow-hidden relative group border border-white/10">
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <Target size={14} className="text-white/60" />
                    <span className="text-[10px] font-black text-white/60 uppercase tracking-[0.4em]">Efficiency Metrics</span>
                  </div>
                  <div className="text-4xl font-black text-white tracking-tighter">12 Nodes <span className="text-white/40">Synced</span></div>
                </div>
                <div className="w-16 h-16 rounded-[1.5rem] bg-white/20 backdrop-blur-xl flex items-center justify-center relative z-10 border border-white/20 group-hover:rotate-12 transition-transform duration-700 shadow-2xl">
                   <Zap size={28} className="text-white" />
                </div>
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-20 -mt-20 blur-[100px] group-hover:scale-150 transition-transform duration-[2s]" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full -ml-10 -mb-10 blur-[80px]" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CleanerPortal;

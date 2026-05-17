import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AreaChart, Area, XAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useLiveData } from '../../context/LiveDataContext';

interface DeepDiveProps {
  isOpen: boolean;
  onClose: () => void;
}

const DeepDive: React.FC<DeepDiveProps> = ({ isOpen, onClose }) => {
  const { alerts, globalStats, budgetSummary, wardPerformance, contractorPerformance } = useLiveData();

  const chartData = [
    { time: '00:00', ammonia: 12, users: 40 },
    { time: '04:00', ammonia: 8, users: 10 },
    { time: '08:00', ammonia: 25, users: 95 },
    { time: '12:00', ammonia: 18, users: 120 },
    { time: '16:00', ammonia: 30, users: 150 },
    { time: '20:00', ammonia: 15, users: 80 },
    { time: '23:59', ammonia: 10, users: 30 },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-[#fcf8fa]/80 backdrop-blur-2xl"
        >
          <motion.div
            initial={{ scale: 0.95, y: 30 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 30 }}
            className="w-full max-w-7xl h-full max-h-[92vh] bg-white/70 border border-white/80 rounded-[3rem] overflow-hidden flex flex-col shadow-[0px_40px_100px_rgba(0,0,0,0.1)]"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-10 border-b border-gray-100/50">
              <div>
                <h2 className="text-4xl font-bold text-black tracking-tighter">Neural Deep Dive</h2>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.3em]">Operational Diagnostic Suite</span>
                  <div className="px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-full text-[9px] text-emerald-600 font-black uppercase tracking-widest flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Verified Municipal Audit Active
                  </div>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="w-14 h-14 rounded-2xl bg-black text-white hover:scale-110 transition-all flex items-center justify-center shadow-xl"
              >
                <span className="material-symbols-outlined text-2xl">close</span>
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-10 grid grid-cols-1 lg:grid-cols-4 gap-10 custom-scrollbar bg-gray-50/30">
              
              {/* Left Column: Intelligence Feed */}
              <div className="lg:col-span-1 flex flex-col gap-8">
                <div className="flex items-center gap-3 px-2">
                   <span className="material-symbols-outlined text-blue-600">sensors</span>
                   <h3 className="text-lg font-bold text-black uppercase tracking-widest">Incident Stream</h3>
                </div>
                <div className="space-y-4 pr-2">
                  {alerts.slice(0, 10).map((alert) => (
                    <div key={alert.id} className="p-6 bg-white/80 rounded-3xl border border-white/60 shadow-lg hover:border-blue-600/30 transition-all group">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] text-blue-600 font-bold uppercase tracking-widest">{alert.facility_name}</span>
                        <span className="text-[10px] text-gray-400 font-bold uppercase">{new Date(alert.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <div className="text-xs font-bold text-black mb-1">{alert.task_type}</div>
                      <p className="text-[10px] text-gray-500 font-medium leading-relaxed line-clamp-2">{alert.description}</p>
                      
                      {alert.photo && (
                        <div className="mt-4 rounded-2xl overflow-hidden border border-gray-100 aspect-video grayscale hover:grayscale-0 transition-all cursor-zoom-in shadow-inner">
                          <img src={alert.photo} alt="Evidence" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Center & Right Column: Diagnostic Analytics */}
              <div className="lg:col-span-3 flex flex-col gap-10">
                
                {/* Global KPI Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {[
                    { label: 'City Spend', value: `₹${(budgetSummary?.total_spent || 0).toLocaleString()}`, icon: 'payments', color: 'text-black' },
                    { label: 'Critical Tasks', value: globalStats?.open_alerts || 0, icon: 'warning', color: 'text-red-500' },
                    { label: 'SLA Velocity', value: `${globalStats?.avg_response_time_mins_today || 0}m`, icon: 'timer', color: 'text-blue-600' },
                    { label: 'Grid Integrity', value: '99.8%', icon: 'verified', color: 'text-emerald-500' }
                  ].map((s, i) => (
                    <motion.div 
                      key={i} 
                      whileHover={{ y: -5 }}
                      className="p-8 bg-white/80 rounded-[2.5rem] border border-white/60 shadow-xl"
                    >
                      <span className={`material-symbols-outlined ${s.color} text-3xl mb-4`}>{s.icon}</span>
                      <div className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">{s.label}</div>
                      <div className="text-3xl font-bold text-black mt-1 tracking-tighter">{s.value}</div>
                    </motion.div>
                  ))}
                </div>

                {/* Main Telemetry Panel */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
                   {/* Strategic Area Chart */}
                   <div className="p-10 bg-white/80 rounded-[3rem] border border-white/60 shadow-xl h-[400px] flex flex-col">
                      <div className="flex items-center justify-between mb-10">
                         <h3 className="text-xl font-bold text-black tracking-tight">Metropolitan Load Gradient</h3>
                         <div className="px-4 py-1.5 bg-gray-50 rounded-xl text-[9px] font-bold text-gray-400 uppercase tracking-widest">7D Prediction Mode</div>
                      </div>
                      <div className="flex-1 min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={chartData}>
                            <defs>
                              <linearGradient id="colorPulse" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#000000" stopOpacity={0.05}/>
                                <stop offset="95%" stopColor="#000000" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#00000005" vertical={false} />
                            <XAxis dataKey="time" stroke="#00000020" fontSize={10} tickLine={false} axisLine={false} />
                            <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: 'none', borderRadius: '16px', boxShadow: '0 20px 50px rgba(0,0,0,0.1)' }} />
                            <Area type="monotone" dataKey="ammonia" stroke="#000000" fillOpacity={1} fill="url(#colorPulse)" strokeWidth={3} />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                   </div>

                   {/* Ward Performance Analysis */}
                   <div className="p-10 bg-white/80 rounded-[3rem] border border-white/60 shadow-xl flex flex-col">
                      <div className="flex items-center justify-between mb-10">
                         <h3 className="text-xl font-bold text-black tracking-tight">Regional Compliance</h3>
                         <span className="material-symbols-outlined text-gray-300">map</span>
                      </div>
                      <div className="flex-1 space-y-4 overflow-y-auto custom-scrollbar pr-4">
                         {wardPerformance.map((w, i) => (
                           <div key={i} className="flex items-center justify-between p-6 bg-gray-50/50 rounded-3xl border border-white/40 hover:bg-white hover:shadow-lg transition-all cursor-pointer">
                              <div>
                                 <div className="text-[11px] font-bold text-black uppercase tracking-tight">{w.ward_number || 'ZONE DELTA'}</div>
                                 <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1">{w.toilet_count} Nodes · {w.total_complaints} Logs</div>
                              </div>
                              <div className="text-right">
                                 <div className={`text-xl font-bold ${w.avg_compliance > 80 ? 'text-emerald-600' : 'text-amber-600'}`}>
                                   {w.avg_compliance?.toFixed(1)}%
                                 </div>
                                 <div className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Integrity</div>
                              </div>
                           </div>
                         ))}
                      </div>
                   </div>
                </div>

                {/* Contractor Performance Grid */}
                <div className="p-10 bg-black text-white rounded-[3rem] shadow-2xl relative overflow-hidden">
                   <div className="flex items-center justify-between mb-12 relative z-10">
                      <div className="flex items-center gap-4">
                         <span className="material-symbols-outlined text-3xl">verified_user</span>
                         <h3 className="text-2xl font-bold tracking-tight">Contractor Trust Matrix</h3>
                      </div>
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">SLA Audit Mode</span>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                      {contractorPerformance.slice(0, 3).map((c, i) => (
                        <div key={i} className="p-8 bg-white/5 rounded-[2rem] border border-white/5 hover:border-white/20 transition-all group">
                           <div className="text-sm font-bold uppercase mb-6 truncate group-hover:text-blue-400 transition-colors">{c.contractor_name}</div>
                           <div className="space-y-4">
                              <div className="flex justify-between items-center">
                                 <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Performance</span>
                                 <span className="text-sm font-bold text-white">{c.avg_compliance?.toFixed(1)}%</span>
                              </div>
                              <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                                 <div className="h-full bg-white transition-all duration-1000" style={{ width: `${c.avg_compliance}%` }} />
                              </div>
                              <div className="flex justify-between text-[8px] font-bold text-gray-500 uppercase tracking-widest pt-2">
                                 <span>{c.managed_facilities} Nodes</span>
                                 <span>{c.tasks_done} Certified Cleans</span>
                              </div>
                           </div>
                        </div>
                      ))}
                   </div>
                   <div className="absolute top-0 right-0 p-20 opacity-[0.03] pointer-events-none">
                      <span className="material-symbols-outlined text-[300px]">shield</span>
                   </div>
                </div>

              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DeepDive;

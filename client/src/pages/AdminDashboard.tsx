import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, AlertTriangle, CheckCircle, Clock, IndianRupee, Plus, Filter, Layout, Menu, X } from 'lucide-react';
import { useLiveData } from '../context/LiveDataContext';
import { useToast } from '../context/ToastContext';
import FacilityMap from '../components/Map/FacilityMap';
import Skeleton from '../components/UI/Skeleton';

const AdminDashboard: React.FC = () => {
  const { facilities, isLive } = useLiveData();
  const { showToast } = useToast();
  const [overview, setOverview] = useState<any>(null);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const hostname = window.location.hostname;
      const API_URL = import.meta.env.VITE_API_URL || `http://${hostname}:4000`;
      
      const [ovRes, alRes] = await Promise.all([
        fetch(`${API_URL}/api/dashboard/overview`),
        fetch(`${API_URL}/api/dashboard/alerts-stream`)
      ]);
      setOverview(await ovRes.json());
      setAlerts(await alRes.json());
    } catch (e) {
      showToast('Neural link synchronization failed', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleCreateTask = async (facilityId: number, issue: string) => {
    try {
      const hostname = window.location.hostname;
      const API_URL = import.meta.env.VITE_API_URL || `http://${hostname}:4000`;
      
      const res = await fetch(`${API_URL}/api/maintenance/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ facility_id: facilityId, issue_reason: issue, severity: 'HIGH' })
      });
      if (res.ok) {
        showToast(`Task deployed for ${facilities.find(f => f.id === facilityId)?.name}`, 'success');
        fetchDashboardData();
      }
    } catch (e) {
      showToast('Failed to deploy maintenance unit', 'error');
    }
  };

  const kpis = [
    { label: 'Network Units', value: facilities.length || '0', icon: Activity, color: 'text-blue-400' },
    { label: 'Priority Alerts', value: alerts.length || '0', icon: AlertTriangle, color: 'text-red-400' },
    { label: 'Active Deployments', value: overview?.tasks_in_progress || '0', icon: Clock, color: 'text-amber-400' },
    { label: 'SLA Response', value: `${overview?.avg_response_time_mins_today || 0}m`, icon: CheckCircle, color: 'text-green-400' },
    { label: "Daily Ops Burn", value: `₹${overview?.today_cost_inr || 0}`, icon: IndianRupee, color: 'text-violet-400' },
  ];

  return (
    <div className="min-h-screen bg-atmosBg pt-20 md:pt-24 pb-12 px-4 md:px-8 lg:px-12 max-w-[1600px] mx-auto">
      <header className="mb-8 md:mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-4 mb-4">
            <div className="h-[1px] w-12 bg-atmosAccent" />
            <span className="text-atmosAccent text-[8px] md:text-[10px] font-bold uppercase tracking-[0.3em]">Command Center</span>
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-atmosText tracking-tighter">
            Network <span className="text-atmosAccentSoft">Operations</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-2 md:gap-4 bg-atmosBgAlt/30 border border-white/5 p-2 rounded-full backdrop-blur-xl self-start md:self-auto">
           <div className="flex items-center gap-2 px-3 md:px-4 border-r border-white/10">
              <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-500 shadow-[0_0_8px_green]' : 'bg-red-500'} `} />
              <span className="text-[8px] md:text-[10px] text-atmosTextMuted font-bold uppercase tracking-widest">{isLive ? 'LIVE LINK' : 'OFFLINE'}</span>
           </div>
           <button className="p-2 md:p-3 hover:text-atmosAccent transition-colors"><Filter size={16} md:size={18} /></button>
           <button className="p-2 md:p-3 bg-atmosAccent text-black rounded-full shadow-lg shadow-atmosAccent/20"><Plus size={16} md:size={18} /></button>
        </div>
      </header>

      {/* Operational KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-6 mb-8 md:mb-12">
        {kpis.map((kpi, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 md:p-8 bg-atmosBgAlt/50 backdrop-blur-xl border border-white/5 rounded-[2rem] md:rounded-[2.5rem] relative overflow-hidden"
          >
            <div className={`mb-4 md:mb-6 ${kpi.color}`}>
              <kpi.icon size={24} md:size={28} />
            </div>
            {isLoading ? <Skeleton className="h-8 md:h-10 w-20 md:w-24 mb-2" /> : (
              <div className="text-2xl md:text-3xl font-bold text-atmosText mb-1 font-outfit tracking-tight">{kpi.value}</div>
            )}
            <div className="text-[8px] md:text-[10px] text-atmosTextMuted font-bold uppercase tracking-[0.3em] font-inter">{kpi.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Alerts & Tactical Stream */}
        <div className="lg:col-span-1 p-6 md:p-8 bg-atmosBgAlt/30 border border-white/5 rounded-[2rem] md:rounded-[3rem]">
          <div className="flex items-center justify-between mb-6 md:mb-8">
            <h3 className="text-base md:text-lg font-bold text-atmosText tracking-tight">Active Incident Stream</h3>
            <div className="px-2 py-1 bg-red-500/10 text-red-500 text-[7px] md:text-[8px] font-bold rounded-md animate-pulse">CRITICAL</div>
          </div>
          
          <div className="space-y-4 max-h-[400px] lg:max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
            {isLoading ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-2xl" />) : (
              <AnimatePresence>
                {alerts.map((alert) => (
                  <motion.div 
                    key={alert.id} 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="p-5 md:p-6 bg-white/5 border-l-4 border-red-500 rounded-r-2xl hover:bg-white/10 transition-all cursor-pointer group"
                    onClick={() => handleCreateTask(alert.facility_id, alert.issue_reason)}
                  >
                    <div className="flex justify-between items-start mb-2">
                       <span className="text-[9px] md:text-[10px] text-red-400 font-bold uppercase tracking-widest truncate">{alert.facility_name}</span>
                       <span className="text-[8px] md:text-[9px] text-atmosTextSubtle font-mono whitespace-nowrap ml-2">{new Date(alert.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <p className="text-xs md:text-sm text-atmosText font-medium mb-3 md:mb-4 line-clamp-2">{alert.issue_reason}</p>
                    <button className="text-[8px] md:text-[9px] text-atmosAccent font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Deploy Team →</button>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
            {!isLoading && alerts.length === 0 && (
              <div className="text-center py-16">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-atmosSuccess/5 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                  <CheckCircle className="text-atmosSuccess opacity-20" size={24} md:size={32} />
                </div>
                <p className="text-[8px] md:text-[10px] text-atmosTextSubtle uppercase tracking-[0.4em]">All units operational</p>
              </div>
            )}
          </div>
        </div>

        {/* Global Operations Map */}
        <div className="lg:col-span-2 flex flex-col gap-6 md:gap-8">
           <div className="p-3 md:p-4 bg-atmosBgAlt/30 border border-white/5 rounded-[2rem] md:rounded-[3rem] overflow-hidden">
              <div className="px-4 md:px-6 py-3 md:py-4 flex items-center justify-between border-b border-white/5 mb-4">
                 <div className="flex items-center gap-3">
                    <Layout size={14} md:size={16} className="text-atmosAccent" />
                    <span className="text-[9px] md:text-[10px] text-atmosText font-bold uppercase tracking-widest">Tactical Network View</span>
                 </div>
                 <div className="hidden sm:flex gap-4">
                    <div className="flex items-center gap-2 text-[8px] text-atmosTextSubtle font-bold uppercase"><div className="w-1.5 h-1.5 rounded-full bg-green-500" /> Optimal</div>
                    <div className="flex items-center gap-2 text-[8px] text-atmosTextSubtle font-bold uppercase"><div className="w-1.5 h-1.5 rounded-full bg-red-500" /> Critical</div>
                 </div>
              </div>
              <div className="h-[350px] md:h-[500px] lg:h-[600px] w-full">
                <FacilityMap facilities={facilities} height="100%" zoom={13} />
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

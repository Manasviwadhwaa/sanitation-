import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  AlertTriangle, 
  HelpCircle,
  RefreshCw,
  Search,
  ArrowRight
} from 'lucide-react';
import { useLiveData } from '../context/LiveDataContext';
import SimpleFacilityCard from '../components/UI/SimpleFacilityCard';
import { useNavigate } from 'react-router-dom';

const AnalyticsPage: React.FC = () => {
  const { globalStats, wardPerformance, facilities } = useLiveData();
  const navigate = useNavigate();

  const summaryMetrics = [
    { label: 'Overall Health', value: 'Excellent', sub: '98% of city is clear', icon: CheckCircle, color: 'text-emerald-500' },
    { label: 'Busy Areas', value: 'None', sub: 'Wait times are low', icon: Clock, color: 'text-blue-500' },
    { label: 'Citizen Rating', value: '4.8/5', sub: 'Based on 500 reviews', icon: TrendingUp, color: 'text-emerald-400' },
    { label: 'Needs Cleaning', value: globalStats?.open_alerts || 0, sub: 'Assigned to team', icon: AlertTriangle, color: 'text-amber-500' },
  ];

  return (
    <div className="space-y-12">
      {/* Human-Friendly Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-white tracking-tight">City Performance</h1>
          <p className="text-sm text-slate-400 max-w-lg">
            A simple overview of how the city is being maintained and how people feel about the services.
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
           <RefreshCw size={12} className="animate-spin-slow" />
           Updated 10 seconds ago
        </div>
      </div>

      {/* Simplified Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryMetrics.map((m, i) => (
          <div key={i} className="bg-[#0f0f0f] border border-[#1f1f1f] p-8 rounded-2xl space-y-4">
            <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center ${m.color}`}>
              <m.icon size={20} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-1">{m.label}</p>
              <h3 className="text-2xl font-bold text-white">{m.value}</h3>
              <p className="text-[11px] text-slate-500 font-medium mt-1">{m.sub}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 pt-8">
        
        {/* Simplified Ward Rankings */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex justify-between items-center border-b border-white/5 pb-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-widest">Cleanliness by Area</h2>
            <HelpCircle size={14} className="text-slate-600" />
          </div>
          
          <div className="space-y-6">
             {wardPerformance?.slice(0, 5).map((ward, i) => (
               <div key={i} className="flex items-center gap-6">
                 <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-sm font-bold text-slate-400">
                    {i + 1}
                 </div>
                 <div className="flex-1 space-y-2">
                    <div className="flex justify-between text-xs font-bold">
                       <span className="text-white">Ward Area {ward.ward_number}</span>
                       <span className="text-slate-400">{ward.avg_compliance > 80 ? 'Excellent' : 'Average'}</span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                       <div className={`h-full ${ward.avg_compliance > 80 ? 'bg-emerald-500' : 'bg-blue-500'}`} style={{ width: `${ward.avg_compliance}%` }} />
                    </div>
                 </div>
                 <div className="text-right">
                    <p className="text-xs font-bold text-white">{ward.avg_compliance}%</p>
                    <p className="text-[9px] text-slate-500 font-bold uppercase tracking-tighter">Rating</p>
                 </div>
               </div>
             ))}
          </div>
        </div>

        {/* Actionable Advice / Prediction */}
        <div className="space-y-8">
          <div className="bg-blue-600 rounded-3xl p-8 text-white">
            <h3 className="text-xl font-bold mb-4">Daily Tip</h3>
            <p className="text-sm text-blue-100/90 leading-relaxed mb-8">
              Based on our data, <span className="font-bold underline decoration-blue-200">Area 4</span> might get a bit busy around 6:30 PM. It might be a good time to check cleaning staff schedules there.
            </p>
            <button className="w-full py-4 bg-white text-blue-600 rounded-xl text-xs font-bold uppercase tracking-widest hover:scale-105 transition-all">
               Check Area 4 Now
            </button>
          </div>

          <div className="bg-[#0f0f0f] border border-[#1f1f1f] p-8 rounded-3xl space-y-6">
             <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Recent Updates</h3>
             <div className="space-y-6">
                {[
                  { msg: 'Cleaning finished in Area 2', time: 'Just now' },
                  { msg: 'New review: "Very clean!"', time: '10m ago' },
                  { msg: 'Trash bin emptied in Area 5', time: '1h ago' }
                ].map((update, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5" />
                    <div>
                       <p className="text-xs font-bold text-white">{update.msg}</p>
                       <p className="text-[10px] text-slate-500 font-bold">{update.time}</p>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>

      {/* Simplified Node Grid */}
      <div className="pt-12">
        <h2 className="text-sm font-bold text-white uppercase tracking-widest mb-10 border-b border-white/5 pb-4">Check Specific Places</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {facilities.slice(0, 3).map(f => (
            <SimpleFacilityCard key={f.id} facility={f} onClick={() => navigate(`/dashboard/facility/${f.id}`)} />
          ))}
        </div>
        <button className="w-full mt-10 py-4 border border-white/10 rounded-2xl text-[10px] font-bold text-slate-500 uppercase tracking-widest hover:text-white hover:bg-white/5 transition-all">
           See all 24 locations
        </button>
      </div>
    </div>
  );
};

export default AnalyticsPage;

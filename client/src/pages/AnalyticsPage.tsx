import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Activity, Zap, TrendingUp, Search, Clock } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import Skeleton from '../components/UI/Skeleton';

const AnalyticsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { showToast } = useToast();
  const [heatmap, setHeatmap] = useState<any[]>([]);
  const [trends, setTrends] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const facilityId = searchParams.get('facilityId') || '';

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const hostname = window.location.hostname;
      const API_URL = import.meta.env.VITE_API_URL || `http://${hostname}:4000`;
      
      const hRes = await fetch(`${API_URL}/api/analytics/heatmap?facilityId=${facilityId}`);
      const hData = await hRes.json();
      setHeatmap(hData);

      const tRes = await fetch(`${API_URL}/api/analytics/trends?facilityId=${facilityId}`);
      const tData = await tRes.json();
      setTrends(tData);
    } catch (e) {
      showToast('Failed to sync intelligence stream', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [facilityId]);

  const setFilter = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) newParams.set(key, value);
    else newParams.delete(key);
    setSearchParams(newParams);
  };

  return (
    <div className="min-h-screen bg-atmosBg pt-24 pb-20 px-6 max-w-[1200px] mx-auto">
      <header className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <div className="flex items-center gap-4 mb-4">
            <div className="h-[1px] w-12 bg-atmosAccent" />
            <span className="text-atmosAccent text-[10px] font-bold uppercase tracking-[0.3em]">Predictive Intelligence</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-atmosText tracking-tighter">System <span className="text-atmosAccentSoft">Analytics</span></h1>
        </div>

        {/* Tactical Filter */}
        <div className="flex items-center gap-2 px-6 py-3 bg-atmosBgAlt/30 border border-white/5 rounded-full backdrop-blur-xl">
           <Search size={14} className="text-atmosAccent" />
           <select 
             className="bg-transparent text-[10px] text-atmosText font-bold uppercase focus:outline-none appearance-none cursor-pointer"
             value={facilityId}
             onChange={(e) => setFilter('facilityId', e.target.value)}
           >
             <option value="" className="bg-atmosBg">Global Network</option>
             <option value="1" className="bg-atmosBg">ISBT PLATFORM</option>
             <option value="2" className="bg-atmosBg">ISBT FOOD COURT</option>
             <option value="3" className="bg-atmosBg">RAILWAY STATION</option>
           </select>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Heatmap Section */}
        <div className="lg:col-span-2 p-8 bg-atmosBgAlt/30 border border-white/5 rounded-[40px] relative overflow-hidden">
           <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-bold text-atmosText tracking-tight">7x24 Network Density</h3>
              <Activity className="text-atmosAccentSubtle" size={20} />
           </div>
           
           {isLoading ? (
             <Skeleton className="h-64 w-full" />
           ) : (
             <div className="grid grid-cols-[auto_1fr] gap-2">
                <div className="flex flex-col justify-between text-[8px] text-atmosTextSubtle font-bold uppercase py-2">
                   {['Mon', 'Wed', 'Fri', 'Sun'].map(d => <span key={d}>{d}</span>)}
                </div>
                <div className="grid grid-cols-24 gap-1">
                   {heatmap.map((h, i) => (
                     <div 
                      key={i} 
                      className="aspect-square rounded-sm transition-all hover:scale-125 cursor-pointer"
                      style={{ 
                        backgroundColor: `rgba(59, 130, 246, ${h.value / 100})`,
                        boxShadow: h.value > 80 ? '0 0 10px rgba(59, 130, 246, 0.3)' : 'none'
                      }}
                      title={`Day ${h.day}, Hour ${h.hour}: ${h.value}%`}
                     />
                   ))}
                </div>
             </div>
           )}
           <div className="mt-6 flex justify-end gap-4 text-[8px] text-atmosTextSubtle font-bold uppercase">
              <span>Low Density</span>
              <div className="flex gap-1">
                 {[0.2, 0.4, 0.6, 0.8, 1].map(o => (
                   <div key={o} className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: `rgba(59, 130, 246, ${o})` }} />
                 ))}
              </div>
              <span>Neural Peak</span>
           </div>
        </div>

        {/* Predictive Intelligence */}
        <div className="lg:col-span-1 space-y-6">
           <div className="p-8 bg-atmosBgAlt/30 border border-white/5 rounded-[40px] relative overflow-hidden group">
             <div className="relative z-10">
               <Zap className="text-amber-400 mb-6 group-hover:scale-110 transition-transform" size={24} />
               <div className="text-sm font-bold text-atmosText mb-2 tracking-tight">AI Surge Forecast</div>
               {isLoading ? <Skeleton className="h-10 w-24" /> : (
                 <div className="text-3xl font-bold text-atmosText mb-1">{trends?.peak_hours?.[0] || '14:30'}</div>
               )}
               <div className="text-[10px] text-atmosTextSubtle font-bold uppercase tracking-widest flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  92% Neural Confidence
               </div>
             </div>
             <div className="absolute top-0 right-0 p-8 opacity-5">
                <TrendingUp size={80} />
             </div>
           </div>

           <div className="p-8 bg-atmosBgAlt/30 border border-white/5 rounded-[40px]">
              <div className="flex items-center justify-between mb-6">
                 <h4 className="text-[10px] text-atmosTextMuted font-bold uppercase tracking-widest">Satisfaction Trends</h4>
                 <Clock size={12} className="text-atmosTextSubtle" />
              </div>
              {isLoading ? <Skeleton className="h-24 w-full" /> : (
                <>
                  <div className="flex items-end gap-2 h-24 mb-4">
                    {trends?.satisfaction?.map((s: number, i: number) => (
                      <motion.div 
                        key={i} 
                        initial={{ height: 0 }}
                        animate={{ height: `${(s / 5) * 100}%` }}
                        className="flex-1 bg-atmosAccent/20 border-t-2 border-atmosAccent rounded-t-sm" 
                      />
                    ))}
                  </div>
                  <div className="flex justify-between text-[8px] text-atmosTextSubtle font-bold uppercase">
                    <span>Monday</span>
                    <span>Sunday</span>
                  </div>
                </>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;

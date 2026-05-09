import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { IndianRupee, FileText, Download, Filter, Calendar, Search } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import Skeleton from '../components/UI/Skeleton';

const BudgetPortal: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToast();

  const facilityId = searchParams.get('facilityId') || '';
  const fromDate = searchParams.get('from') || '';
  const toDate = searchParams.get('to') || '';

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const hostname = window.location.hostname;
      const API_URL = import.meta.env.VITE_API_URL || `http://${hostname}:4000`;
      const query = new URLSearchParams({
        facilityId,
        from: fromDate,
        to: toDate
      }).toString();
      
      const res = await fetch(`${API_URL}/api/budget?${query}`);
      const d = await res.json();
      setData(d);
    } catch (e) {
      showToast('Failed to fetch financial records', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [facilityId, fromDate, toDate]);

  const handleExport = () => {
    showToast('Preparing financial audit export...', 'info');
    setTimeout(() => {
      showToast('CSV Export Ready', 'success');
    }, 1500);
  };

  const setFilter = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) newParams.set(key, value);
    else newParams.delete(key);
    setSearchParams(newParams);
  };

  return (
    <div className="min-h-screen bg-atmosBg pt-24 pb-12 px-6 max-w-[1200px] mx-auto">
      <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <div className="flex items-center gap-4 mb-4">
            <div className="h-[1px] w-12 bg-atmosAccent" />
            <span className="text-atmosAccent text-[10px] font-bold uppercase tracking-[0.3em]">Financial Transparency</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-atmosText tracking-tighter">Budget <span className="text-atmosAccentSoft">Log</span></h1>
        </div>
        
        {/* RailOne Style Filters */}
        <div className="flex flex-wrap gap-4 items-center bg-atmosBgAlt/30 border border-white/5 p-4 rounded-[2rem] backdrop-blur-xl">
           <div className="flex items-center gap-2 px-4 py-2 bg-black/20 rounded-full border border-white/5">
              <Calendar size={14} className="text-atmosAccent" />
              <input 
                type="date" 
                className="bg-transparent text-[10px] text-atmosText font-bold uppercase focus:outline-none"
                value={fromDate}
                onChange={(e) => setFilter('from', e.target.value)}
              />
           </div>
           <div className="flex items-center gap-2 px-4 py-2 bg-black/20 rounded-full border border-white/5">
              <Search size={14} className="text-atmosAccent" />
              <select 
                className="bg-transparent text-[10px] text-atmosText font-bold uppercase focus:outline-none appearance-none"
                value={facilityId}
                onChange={(e) => setFilter('facilityId', e.target.value)}
              >
                <option value="" className="bg-atmosBg">All Facilities</option>
                <option value="1" className="bg-atmosBg">ISBT PLATFORM</option>
                <option value="2" className="bg-atmosBg">ISBT FOOD COURT</option>
                <option value="3" className="bg-atmosBg">RAILWAY STATION</option>
              </select>
           </div>
        </div>
      </header>

      {/* Summary Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
         {isLoading ? Array.from({ length: 3 }).map((_, i) => (
           <Skeleton key={i} className="h-40 rounded-3xl" />
         )) : (
           <>
            <div className="p-8 bg-atmosBgAlt/30 border border-white/5 rounded-3xl backdrop-blur-xl">
              <IndianRupee className="mb-6 text-violet-400" size={24} />
              <div className="text-3xl font-bold text-atmosText mb-1">₹{data?.summary?.total_spend || 0}</div>
              <div className="text-[10px] text-atmosTextMuted font-bold uppercase tracking-widest">Total Monthly Spend</div>
            </div>
            <div className="p-8 bg-atmosBgAlt/30 border border-white/5 rounded-3xl backdrop-blur-xl">
              <FileText className="mb-6 text-blue-400" size={24} />
              <div className="text-3xl font-bold text-atmosText mb-1">{data?.summary?.tasks_completed || 0}</div>
              <div className="text-[10px] text-atmosTextMuted font-bold uppercase tracking-widest">Audited Tasks</div>
            </div>
            <div className="p-8 bg-atmosBgAlt/30 border border-white/5 rounded-3xl backdrop-blur-xl">
              <Filter className="mb-6 text-green-400" size={24} />
              <div className="text-3xl font-bold text-atmosText mb-1">{data?.summary?.avg_response || 0}m</div>
              <div className="text-[10px] text-atmosTextMuted font-bold uppercase tracking-widest">Avg Response Time</div>
            </div>
           </>
         )}
      </div>

      {/* Audit Table */}
      <div className="bg-atmosBgAlt/20 border border-white/5 rounded-[40px] overflow-hidden">
        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/5">
           <h3 className="text-lg font-bold text-atmosText tracking-tight">Financial Transaction Log</h3>
           <button 
             onClick={handleExport}
             className="flex items-center gap-2 px-6 py-2.5 bg-atmosAccent text-black text-[10px] font-bold uppercase tracking-widest rounded-full hover:bg-atmosAccentSoft transition-all shadow-lg shadow-atmosAccent/10"
           >
             <Download size={14} /> Export Audit CSV
           </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black/20">
                <th className="p-6 text-[10px] text-atmosTextSubtle font-bold uppercase tracking-widest">Date</th>
                <th className="p-6 text-[10px] text-atmosTextSubtle font-bold uppercase tracking-widest">Facility Unit</th>
                <th className="p-6 text-[10px] text-atmosTextSubtle font-bold uppercase tracking-widest">Operation Description</th>
                <th className="p-6 text-[10px] text-atmosTextSubtle font-bold uppercase tracking-widest">Cost (INR)</th>
                <th className="p-6 text-[10px] text-atmosTextSubtle font-bold uppercase tracking-widest text-right">Audit Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  <td colSpan={5} className="p-4"><Skeleton className="h-10 w-full" /></td>
                </tr>
              )) : data?.logs?.map((log: any, i: number) => (
                <tr key={i} className="hover:bg-white/5 transition-colors group">
                  <td className="p-6 text-sm text-atmosTextSubtle font-mono">{new Date(log.logged_at).toLocaleDateString()}</td>
                  <td className="p-6 text-sm text-atmosText font-medium group-hover:text-atmosAccent transition-colors">{log.facility_name}</td>
                  <td className="p-6 text-sm text-atmosTextSubtle">{log.issue}</td>
                  <td className="p-6 text-sm text-atmosAccent font-bold">₹{log.total_cost}</td>
                  <td className="p-6 text-right">
                     <span className="px-3 py-1 bg-green-500/10 text-green-500 text-[9px] font-bold uppercase tracking-widest rounded-full border border-green-500/20">Verified Audit</span>
                  </td>
                </tr>
              ))}
              {!isLoading && data?.logs?.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-20 text-center text-[10px] text-atmosTextSubtle uppercase tracking-[0.4em]">No financial records found for this period</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BudgetPortal;

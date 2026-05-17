import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  Search, 
  Clock, 
  MapPin, 
  CheckCircle, 
  ChevronRight, 
  Filter, 
  AlertCircle, 
  Calendar, 
  ArrowLeft,
  Images,
  Ticket,
  History,
  Activity,
  ArrowRight,
  ShieldCheck,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TrackRequest: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const tab = searchParams.get('tab'); // 'receipts', 'alerts', 'evidence', 'history', 'sla'
  const queryId = searchParams.get('id');
  
  const [searchId, setSearchId] = useState(queryId || '');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const handleSearch = async (idToSearch?: string) => {
    const id = idToSearch || searchId;
    if (!id) return;
    setIsLoading(true);
    setError('');
    setResult(null);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4001'}/api/feedback/${id}`);
      if (!response.ok) throw new Error('Request ID not found.');
      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (queryId) {
      handleSearch(queryId);
    }
  }, [queryId]);

  // Interface configurations
  const isEvidenceView = tab === 'evidence';
  const isHistoryView = tab === 'history';
  const isReceiptsView = tab === 'receipts';

  const getInterfaceTitle = () => {
    if (isEvidenceView) return 'Forensic Evidence';
    if (isHistoryView) return 'Civic Archive';
    if (isReceiptsView) return 'Digital Wallet';
    if (tab === 'sla') return 'Guarantee Tracker';
    return 'Status Terminal';
  };

  return (
    <div className={`min-h-[100dvh] -mx-6 -mt-6 pb-24 transition-colors duration-700 font-sans ${isEvidenceView ? 'bg-indigo-950' : isHistoryView ? 'bg-[#0f172a]' : 'bg-[#050505]'}`}>
      
      {/* Premium Dark Header */}
      <header className={`pt-16 pb-24 px-12 text-white relative overflow-hidden transition-all duration-700 ${
        isEvidenceView ? 'bg-indigo-900/40' : isHistoryView ? 'bg-slate-800/40' : isReceiptsView ? 'bg-emerald-900/40' : 'bg-gradient-to-b from-[#1a1a1a] to-[#050505]'
      }`}>
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />
         <div className="relative z-10 max-w-xl mx-auto space-y-8">
            <button onClick={() => navigate('/public/services')} className="w-12 h-12 bg-white/5 border border-white/10 hover:bg-white/10 rounded-2xl flex items-center justify-center transition-all">
               <ArrowLeft size={20} />
            </button>
            <div className="space-y-4">
               <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center">
                    {isEvidenceView ? <Images size={28} className="text-indigo-400" /> : 
                     isHistoryView ? <History size={28} className="text-slate-400" /> : 
                     isReceiptsView ? <Ticket size={28} className="text-emerald-400" /> :
                     <Activity size={28} className="text-blue-500 animate-pulse" />}
                  </div>
                  <div>
                    <h1 className="text-4xl font-black tracking-tighter uppercase leading-none bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">{getInterfaceTitle()}</h1>
                    <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] mt-2">SAAF Municipal Grid</p>
                  </div>
               </div>
            </div>
         </div>
      </header>

      <div className="max-w-xl mx-auto px-6 -mt-16 relative z-20 space-y-8">
         
         {/* Search Interface (Hidden in History/Receipts for now) */}
         {!isHistoryView && !isReceiptsView && (
            <div className="bg-[#0f0f0f] rounded-[3rem] p-10 shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/5 space-y-8 relative overflow-hidden backdrop-blur-3xl">
               <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500/0 via-blue-500 to-blue-500/0" />
               <div className="relative group">
                  <Search size={24} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-all" />
                  <input 
                    type="text" 
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="Enter Ticket ID..."
                    className="w-full bg-[#050505] border border-white/10 rounded-[2rem] py-6 pl-16 pr-8 text-xl outline-none focus:border-blue-500 transition-all font-black text-white placeholder:text-slate-700"
                  />
               </div>
               <button 
                 onClick={() => handleSearch()}
                 className="w-full py-6 bg-blue-600 text-white font-black rounded-[2rem] text-xs uppercase tracking-[0.2em] hover:bg-blue-500 transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] active:scale-95"
               >
                  {isLoading ? 'Decrypting Records...' : 'Access Real-time Status'}
               </button>
               <button 
                onClick={() => {
                  setSearchId('1');
                  handleSearch('1');
                }}
                className="w-full py-4 bg-white/5 border border-white/5 rounded-2xl text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] hover:bg-white/10 hover:text-white transition-all"
               >
                  Test with SAAF-001
               </button>

               {error && (
                 <motion.div 
                   initial={{ opacity: 0, y: -10 }}
                   animate={{ opacity: 1, y: 0 }}
                   className="p-6 mt-6 bg-red-500/10 border border-red-500/20 rounded-[2rem] flex items-center justify-center gap-4 text-center"
                 >
                    <AlertCircle size={24} className="text-red-500 flex-shrink-0" />
                    <p className="text-xs font-black text-red-400 uppercase tracking-tight">{error}</p>
                 </motion.div>
               )}
            </div>
         )}

         {/* Specialized Views */}
         <AnimatePresence mode="wait">
            {isHistoryView && (
               <motion.div 
                 key="history"
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 className="space-y-6"
               >
                  {[
                    { id: 'SAAF-901', title: 'Street Cleaning', date: 'Oct 24, 2023', status: 'VERIFIED' },
                    { id: 'SAAF-852', title: 'Water Leakage', date: 'Oct 12, 2023', status: 'RESOLVED' },
                    { id: 'SAAF-743', title: 'Odor Alert', date: 'Sep 28, 2023', status: 'RESOLVED' }
                  ].map((item, i) => (
                    <div key={i} className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm flex items-center justify-between group hover:border-blue-500 transition-all">
                       <div className="flex items-center gap-6">
                          <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                             <FileText size={24} />
                          </div>
                          <div>
                             <h4 className="text-lg font-black text-slate-900 tracking-tight">{item.title}</h4>
                             <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{item.id} • {item.date}</p>
                          </div>
                       </div>
                       <div className="flex items-center gap-4">
                          <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full">{item.status}</span>
                          <ChevronRight size={18} className="text-slate-300 group-hover:text-blue-600" />
                       </div>
                    </div>
                  ))}
               </motion.div>
            )}

            {isReceiptsView && (
               <motion.div 
                 key="receipts"
                 initial={{ opacity: 0, scale: 0.95 }}
                 animate={{ opacity: 1, scale: 1 }}
                 className="grid grid-cols-1 gap-6"
               >
                  {[
                    { id: 'SAAF-123-456', type: 'Public Report', facility: 'Old Cantt Market', amount: 'FREE' },
                    { id: 'SAAF-789-012', type: 'Emergency', facility: 'ISBT Flyover', amount: 'FREE' }
                  ].map((rec, i) => (
                    <div key={i} className="bg-white border-2 border-slate-100 rounded-[2.5rem] p-10 space-y-8 relative overflow-hidden group">
                       <div className="flex justify-between items-start">
                          <div className="space-y-1">
                             <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2 py-1 rounded inline-block">Valid Digital Receipt</p>
                             <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{rec.id}</h3>
                          </div>
                          <Ticket size={40} className="text-slate-100 group-hover:text-emerald-500/20 transition-all" />
                       </div>
                       <div className="flex justify-between border-t border-slate-100 pt-8 text-[10px] font-black uppercase tracking-widest text-slate-400">
                          <span>{rec.type}</span>
                          <span>{rec.facility}</span>
                       </div>
                       <button 
                         onClick={() => {
                           const content = `================================================\nSAAF DIGITAL RECEIPT WALLET\n================================================\nReceipt ID: ${rec.id}\nType: ${rec.type}\nFacility: ${rec.facility}\nAmount: ${rec.amount}\nTimestamp: ${new Date().toISOString()}\n================================================\nVERIFIED SECURE TRANSACTION`;
                           const blob = new Blob([content], { type: 'text/plain' });
                           const url = URL.createObjectURL(blob);
                           const link = document.createElement('a');
                           link.href = url;
                           link.download = `SAAF_RECEIPT_${rec.id}.txt`;
                           document.body.appendChild(link);
                           link.click();
                           document.body.removeChild(link);
                           URL.revokeObjectURL(url);
                         }}
                         className="w-full py-4 border-2 border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all"
                       >
                          Download Receipt Proof
                       </button>
                    </div>
                  ))}
               </motion.div>
            )}

             {/* Status Timeline */}
          {result && !isHistoryView && !isReceiptsView && (
             <motion.div 
               key="status"
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="space-y-8"
             >
                <div className="bg-[#0f0f0f] border border-white/5 rounded-[3rem] p-10 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden backdrop-blur-xl">
                   <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-blue-500/5 blur-[80px] rounded-full pointer-events-none" />
                   <div className="flex flex-col md:flex-row justify-between items-start gap-8 relative z-10">
                      <div className="space-y-4 flex-1">
                         <div>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2 flex items-center gap-2">
                               <Activity size={12} className="text-blue-500 animate-pulse" /> Live Telemetry
                            </p>
                            <h2 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">{result.issue_type}</h2>
                         </div>
                         <div className="flex flex-wrap gap-4 pt-2">
                            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
                               <MapPin size={16} className="text-blue-500" />
                               <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">{result.facility_name}</span>
                            </div>
                         </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                         <span className="px-6 py-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                            {result.resolution_status || 'VERIFIED'}
                         </span>
                      </div>
                   </div>

                   {/* Visual Timeline Interface */}
                   <div className="mt-16 flex items-center justify-between relative px-4">
                      <div className="absolute left-4 right-4 h-1 bg-white/5 top-1/2 -translate-y-1/2 rounded-full" />
                      <div className="absolute left-4 w-2/3 h-1 bg-gradient-to-r from-blue-600 to-blue-400 top-1/2 -translate-y-1/2 rounded-full shadow-[0_0_15px_rgba(37,99,235,0.5)]" />
                      
                      {[
                         { label: 'Logged', icon: Clock, active: true },
                         { label: 'Dispatch', icon: MapPin, active: true },
                         { label: 'Audit', icon: ShieldCheck, active: false }
                      ].map((step, i) => (
                         <div key={i} className="relative z-10 flex flex-col items-center gap-4">
                            <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center transition-all duration-500 ${
                               step.active ? 'bg-blue-600 text-white scale-110 shadow-[0_0_20px_rgba(37,99,235,0.4)]' : 'bg-[#1a1a1a] text-slate-600 border border-white/5'
                            }`}>
                               <step.icon size={28} />
                            </div>
                            <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${step.active ? 'text-white' : 'text-slate-600'}`}>{step.label}</span>
                         </div>
                      ))}
                   </div>
                </div>

                {isEvidenceView && (
                  <div className="bg-[#0f0f0f] border border-white/5 rounded-[3rem] p-10 space-y-8 shadow-xl backdrop-blur-xl">
                     <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-2">
                        <Images size={16} className="text-indigo-500" /> Forensic Documentation
                     </h4>
                       <div className="grid grid-cols-2 gap-6">
                          <div className="space-y-3">
                             <div className="aspect-square bg-slate-100 rounded-[2rem] overflow-hidden border border-slate-200 flex items-center justify-center text-slate-400">
                                <Plus size={32} />
                             </div>
                             <p className="text-[9px] font-black text-center text-slate-500 uppercase">Before Audit</p>
                          </div>
                          <div className="space-y-3">
                             <div className="aspect-square bg-blue-50 rounded-[2rem] overflow-hidden border border-blue-100 flex items-center justify-center text-blue-300">
                                <CheckCircle size={32} />
                             </div>
                             <p className="text-[9px] font-black text-center text-blue-600 uppercase tracking-widest">Verified After</p>
                          </div>
                       </div>
                    </div>
                  )}
               </motion.div>
            )}
         </AnimatePresence>

         {error && (
            <div className="bg-red-50 border border-red-100 p-8 rounded-[2rem] flex items-center gap-6 text-red-600 shadow-sm">
               <AlertCircle size={32} />
               <div>
                  <p className="font-black uppercase tracking-widest text-[10px]">Security Alert</p>
                  <p className="text-sm font-bold">{error}</p>
               </div>
            </div>
         )}
      </div>
    </div>
  );
};

export default TrackRequest;

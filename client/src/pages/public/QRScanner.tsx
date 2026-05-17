import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { QrCode, ArrowLeft, Camera, ShieldCheck, Clock, RefreshCw, X, BarChart3, FileText, Star, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLiveData } from '../../context/LiveDataContext';

const QRScanner: React.FC = () => {
  const navigate = useNavigate();
  const { facilities } = useLiveData();
  const [status, setStatus] = useState<'IDLE' | 'SCANNING' | 'REPORT'>('IDLE');
  const [scannedFacility, setScannedFacility] = useState<any>(null);

  const startScan = () => {
    setStatus('SCANNING');
    // Simulate scan delay
    setTimeout(() => {
      const randomFac = facilities[Math.floor(Math.random() * facilities.length)];
      setScannedFacility(randomFac);
      setStatus('REPORT');
    }, 2000);
  };

  return (
    <div className="max-w-xl mx-auto space-y-12 pb-24">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/public')} className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-blue-600 transition-all shadow-sm">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight text-left">QR Hub</h1>
          <p className="text-sm text-slate-500 font-medium text-left">Instant Facility Intelligence & Reporting.</p>
        </div>
      </div>

      {/* Scanner / Report Surface */}
      <AnimatePresence mode="wait">
        {status === 'IDLE' && (
           <motion.div 
             key="idle"
             initial={{ opacity: 0, scale: 0.95 }}
             animate={{ opacity: 1, scale: 1 }}
             exit={{ opacity: 0, scale: 1.05 }}
             className="bg-[#0f172a] rounded-[3rem] p-12 text-center space-y-8 shadow-2xl border-8 border-white/5"
           >
              <div className="w-32 h-32 bg-blue-600/10 rounded-[2rem] flex items-center justify-center text-blue-500 mx-auto">
                 <QrCode size={64} />
              </div>
              <div className="space-y-4">
                 <h3 className="text-2xl font-bold text-white">Ready to Scan</h3>
                 <p className="text-sm text-slate-400 max-w-xs mx-auto font-medium">Point your camera at the SAAF QR board to generate an instant facility report.</p>
              </div>
              <button 
                onClick={startScan}
                className="px-10 py-5 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 uppercase tracking-widest text-xs"
              >
                 Open Scanner Hub
              </button>
           </motion.div>
        )}

        {status === 'SCANNING' && (
           <motion.div 
             key="scanning"
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             className="bg-[#0f172a] rounded-[3rem] p-12 flex flex-col items-center justify-center space-y-8 border-8 border-white/5"
           >
              <div className="relative w-64 h-64 border-4 border-blue-500/30 rounded-3xl overflow-hidden">
                 <div className="absolute inset-0 bg-blue-500/10 animate-pulse" />
                 <motion.div 
                   animate={{ top: ['0%', '100%', '0%'] }}
                   transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                   className="absolute left-0 right-0 h-1 bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,1)] z-10"
                 />
                 <div className="absolute inset-0 flex items-center justify-center text-blue-500/20">
                    <Camera size={120} />
                 </div>
              </div>
              <div className="text-center space-y-2">
                 <p className="text-sm font-black text-blue-500 uppercase tracking-[0.5em] animate-pulse">Analyzing QR Payload...</p>
                 <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Generating Encrypted Report</p>
              </div>
           </motion.div>
        )}

        {status === 'REPORT' && (
           <motion.div 
             key="report"
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="space-y-8"
           >
              {/* Facility Intelligence Report Card */}
              <div className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-slate-200/50">
                 {/* Report Header */}
                 <div className="bg-slate-900 p-8 text-white flex justify-between items-center">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-black">R</div>
                       <div>
                          <h3 className="text-xs font-black text-blue-500 uppercase tracking-widest">Facility Audit Report</h3>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Timestamp: {new Date().toLocaleTimeString()}</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                       <ShieldCheck size={14} className="text-emerald-500" />
                       <span className="text-[10px] font-black text-emerald-500 uppercase">Verified</span>
                    </div>
                 </div>

                 {/* Report Body */}
                 <div className="p-10 space-y-10">
                    <div className="flex justify-between items-start">
                       <div>
                          <h2 className="text-3xl font-black text-slate-900 tracking-tighter">{scannedFacility?.name}</h2>
                          <div className="flex items-center gap-2 mt-2 text-sm text-slate-500 font-bold">
                             <MapPin size={16} className="text-blue-600" />
                             {scannedFacility?.location}
                          </div>
                       </div>
                       <div className="text-right">
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Current Grade</p>
                          <p className="text-4xl font-black text-blue-600 tracking-tighter">A+</p>
                       </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                       <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                          <BarChart3 size={18} className="text-blue-600 mb-3" />
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Health Index</p>
                          <p className="text-sm font-bold text-slate-900">98% Nominal</p>
                       </div>
                       <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                          <Clock size={18} className="text-amber-500 mb-3" />
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Last Cleaned</p>
                          <p className="text-sm font-bold text-slate-900">45m ago</p>
                       </div>
                       <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 col-span-2 md:col-span-1">
                          <Star size={18} className="text-amber-500 mb-3" />
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Citizen Rating</p>
                          <p className="text-sm font-bold text-slate-900">{scannedFacility?.rating?.toFixed(1) || '4.8'}/5.0</p>
                       </div>
                    </div>

                    <div className="space-y-4">
                       <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-3 flex items-center gap-2">
                          <FileText size={16} className="text-blue-500" />
                          Operational Metadata
                       </h4>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 text-xs font-bold text-slate-600">
                          <div className="flex justify-between">
                             <span>Responsible Body:</span>
                             <span className="text-slate-900 font-black">Zone-C Authority</span>
                          </div>
                          <div className="flex justify-between">
                             <span>SLA Compliance:</span>
                             <span className="text-emerald-600 font-black">100% Guaranteed</span>
                          </div>
                          <div className="flex justify-between">
                             <span>Protocol:</span>
                             <span className="text-slate-900 font-black">Bio-Clean Standard</span>
                          </div>
                          <div className="flex justify-between">
                             <span>Sensor Status:</span>
                             <span className="text-blue-500 font-black">Real-time Online</span>
                          </div>
                       </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                       <button 
                        onClick={() => navigate(`/public/report?facilityId=${scannedFacility?.id}`)}
                        className="flex items-center justify-center gap-3 py-5 bg-blue-600 text-white font-black rounded-2xl text-[11px] uppercase tracking-widest shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all"
                       >
                          <ShieldAlert size={18} />
                          Report Concern
                       </button>
                       <button className="flex items-center justify-center gap-3 py-5 bg-emerald-500 text-white font-black rounded-2xl text-[11px] uppercase tracking-widest shadow-xl shadow-emerald-500/20 hover:bg-emerald-600 transition-all">
                          <CheckCircle size={18} />
                          Praise Staff
                       </button>
                    </div>
                 </div>
              </div>

              <button 
                onClick={() => setStatus('IDLE')}
                className="flex items-center gap-2 text-[10px] font-black text-slate-400 hover:text-blue-600 transition-colors mx-auto uppercase tracking-[0.4em]"
              >
                <RefreshCw size={14} /> Scan Different Facility
              </button>
           </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default QRScanner;

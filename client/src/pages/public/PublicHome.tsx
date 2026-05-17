import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  PlusCircle, 
  Search, 
  MapPin, 
  Clock, 
  CheckCircle, 
  ArrowRight,
  QrCode,
  Map as MapIcon,
  ShieldCheck,
  Star
} from 'lucide-react';
import { useLiveData } from '../../context/LiveDataContext';

const PublicHome: React.FC = () => {
  const navigate = useNavigate();
  const { facilities } = useLiveData();

  // Filter for SBM branded facilities to show on home
  const featuredFacilities = facilities.filter(f => f.name.startsWith('SBM')).slice(0, 3);

  return (
    <div className="space-y-12 pb-16">
      {/* Hero: Calm & Helpful */}
      <section className="text-center space-y-6">
        <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-none">Your city, <span className="text-blue-600">better.</span></h1>
        <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium">
          Report issues, track maintenance, and help us maintain the highest standards of urban transparency.
        </p>
      </section>

      {/* Main Action Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/public/report')}
          className="bg-white border border-slate-200 p-10 rounded-[2.5rem] text-left space-y-6 shadow-xl shadow-slate-200/40 group hover:border-blue-500 transition-all relative overflow-hidden"
        >
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-inner">
             <PlusCircle size={32} />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-900">Report an Issue</h3>
            <p className="text-sm text-slate-500 mt-2 font-medium">Spotted a problem? Report it with a photo in seconds.</p>
          </div>
          <div className="flex items-center gap-2 text-blue-600 font-bold uppercase tracking-widest text-[10px] pt-4">
             Start Request <ArrowRight size={14} />
          </div>
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-all" />
        </motion.button>

        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/public/track')}
          className="bg-slate-900 p-10 rounded-[2.5rem] text-left space-y-6 shadow-2xl group transition-all relative overflow-hidden"
        >
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-white group-hover:bg-white group-hover:text-slate-900 transition-all">
             <Search size={32} />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">Track Progress</h3>
            <p className="text-sm text-slate-400 mt-2 font-medium">Enter your Ticket ID to see real-time updates.</p>
          </div>
          <div className="flex items-center gap-2 text-white/50 font-bold uppercase tracking-widest text-[10px] pt-4 group-hover:text-white transition-colors">
             View Live Status <ArrowRight size={14} />
          </div>
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-all" />
        </motion.button>
      </div>

      {/* Quick Tools */}
      <div className="grid grid-cols-2 gap-6">
         <button 
          onClick={() => navigate('/public/scan')}
          className="flex items-center gap-4 p-6 bg-white border border-slate-200 rounded-3xl hover:bg-slate-50 transition-all group"
         >
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-all">
               <QrCode size={20} />
            </div>
            <div className="text-left">
               <p className="text-sm font-bold text-slate-900">Scan QR Code</p>
               <p className="text-[10px] text-slate-500 font-medium uppercase tracking-tighter">Instant Facility Feedback</p>
            </div>
         </button>
         <button 
          onClick={() => navigate('/public/map')}
          className="flex items-center gap-4 p-6 bg-white border border-slate-200 rounded-3xl hover:bg-slate-50 transition-all group"
         >
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl group-hover:bg-emerald-600 group-hover:text-white transition-all">
               <MapIcon size={20} />
            </div>
            <div className="text-left">
               <p className="text-sm font-bold text-slate-900">Map View</p>
               <p className="text-[10px] text-slate-500 font-medium uppercase tracking-tighter">Find Nearby Facilities</p>
            </div>
         </button>
      </div>

      {/* Nearby Facilities / Transparency Cards */}
      <section className="space-y-8 pt-6">
        <div className="flex justify-between items-center border-b border-slate-100 pb-4">
           <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Nearby Facilities</h2>
           <button 
            onClick={() => navigate('/public/services')}
            className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline"
           >
             View All
           </button>
        </div>
        <div className="grid grid-cols-1 gap-8">
           {featuredFacilities.map((f, i) => (
             <motion.div 
               key={f.id} 
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: i * 0.1 }}
               className="bg-white border border-slate-200 rounded-[2.5rem] p-10 space-y-8 shadow-xl shadow-slate-200/30 group hover:border-blue-500 transition-all"
             >
                <div className="flex justify-between items-start">
                   <div className="space-y-2">
                      <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{f.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-slate-500 font-bold">
                         <MapPin size={18} className="text-blue-500" />
                         {f.location}
                      </div>
                   </div>
                   <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] ${
                     f.current_status === 'GREEN' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'
                   }`}>
                     {f.current_status === 'GREEN' ? 'Operational' : 'Under Review'}
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Last Cleaned</p>
                      <p className="text-xl font-bold text-slate-900">{f.last_verified_at || 'Just now'}</p>
                   </div>
                   <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Department</p>
                      <p className="text-xl font-bold text-slate-900">Zone-A Sanitation</p>
                   </div>
                </div>

                <div className="flex items-center justify-between pt-4">
                   <div className="flex items-center gap-3">
                      <Star size={20} className="text-amber-500 fill-amber-500" />
                      <span className="text-lg font-black text-slate-900">{f.rating?.toFixed(1) || '4.5'}</span>
                      <span className="text-sm text-slate-400 font-bold">(200+ Reviews)</span>
                   </div>
                   <button 
                    onClick={() => navigate(`/public/report?facilityId=${f.id}`)}
                    className="text-sm font-black text-blue-600 hover:text-blue-800 transition-colors uppercase tracking-widest"
                   >
                     Submit Feedback
                   </button>
                </div>
             </motion.div>
           ))}
        </div>
      </section>

      {/* History Teaser */}
      <div className="bg-blue-600 rounded-[3rem] p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl shadow-blue-600/20">
         <div className="space-y-2 text-center md:text-left">
            <h3 className="text-3xl font-black tracking-tight">Your History</h3>
            <p className="text-sm text-blue-100 font-medium opacity-80">View all your past reports and their resolutions in one place.</p>
         </div>
         <button 
          onClick={() => navigate('/public/track')}
          className="px-10 py-4 bg-white text-blue-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-xl"
         >
            View Request History
         </button>
      </div>
    </div>
  );
};

export default PublicHome;

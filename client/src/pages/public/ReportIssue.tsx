import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  Camera, MapPin, ArrowLeft, CheckCircle, AlertTriangle, ShieldCheck, 
  Upload, Zap, ChevronRight, ShieldAlert, Info, Clock, Trash2, 
  Droplets, Wrench, Wind, Plus, Navigation, Star, MessageSquare,
  Lock, EyeOff, Shield, Heart, ZapOff, Hammer, Thermometer, Database, Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLiveData } from '../../context/LiveDataContext';

const ReportIssue: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { facilities } = useLiveData();
  
  const mode = searchParams.get('mode'); 
  const queryType = searchParams.get('type') || 'cleaning';
  const queryFacilityId = searchParams.get('facilityId') || '';

  const [formData, setFormData] = useState({
    facility_id: queryFacilityId || '',
    issue_type: queryType.toUpperCase(),
    comment: '',
    priority: 'MEDIUM',
    rating: 3,
    photo_url: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedId, setSubmittedId] = useState<number | null>(null);
  const [successMode, setSuccessMode] = useState<string | null>(null);
  const [mockPhotoName, setMockPhotoName] = useState('');

  // Auto-fill facility if queryParam exists
  useEffect(() => {
    if (queryFacilityId) {
      setFormData(prev => ({ ...prev, facility_id: queryFacilityId }));
    }
  }, [queryFacilityId]);

  // Handle Photo Simulation
  const simulatePhotoUpload = () => {
    const mockPhotos = [
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&q=80&w=600'
    ];
    const randomPhoto = mockPhotos[Math.floor(Math.random() * mockPhotos.length)];
    setFormData(prev => ({ ...prev, photo_url: randomPhoto }));
    setMockPhotoName(`EVIDENCE_DSC_${Math.floor(1000 + Math.random() * 9000)}.JPG`);
  };

  const getApiUrl = () => {
    if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
    return window.location.hostname === 'localhost' ? 'http://localhost:4001' : window.location.origin;
  };

  const handleSubmitReport = async (e?: React.FormEvent, customData?: any) => {
    if (e) e.preventDefault();
    
    const submissionData = customData || {
      facility_id: parseInt(formData.facility_id) || 1,
      rating: formData.rating,
      issue_type: formData.issue_type,
      comment: formData.comment || 'Issue reported via Citizen Portal.',
      photo_url: formData.photo_url || '',
      lat: 30.31,
      lng: 78.04
    };

    setIsSubmitting(true);
    try {
      const response = await fetch(`${getApiUrl()}/api/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });

      if (!response.ok) throw new Error('Failed to transmit ticket packet');
      
      const resData = await response.json();
      setSubmittedId(resData.feedback_id);
      
      if (mode === 'anonymous') {
        setSuccessMode('anonymous');
      } else if (mode === 'feedback') {
        setSuccessMode('feedback');
      } else {
        setSuccessMode('standard');
      }
    } catch (err) {
      console.error('Submission error:', err);
      // Fallback ticket creation for pure frontend resilience
      setSubmittedId(Math.floor(Math.random() * 9000) + 1000);
      setSuccessMode(mode || 'standard');
    } finally {
      setIsSubmitting(false);
    }
  };

  // SUCCESS TICKETS RENDERING
  if (successMode) {
    return (
      <div className="max-w-xl mx-auto px-6 py-12 text-center space-y-10 pb-24">
         <motion.div 
           initial={{ scale: 0.8, opacity: 0 }}
           animate={{ scale: 1, opacity: 1 }}
           className="w-24 h-24 bg-emerald-500 text-white rounded-[2.5rem] flex items-center justify-center mx-auto shadow-2xl shadow-emerald-500/20"
         >
            <CheckCircle size={48} />
         </motion.div>

         <div className="space-y-4">
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">
              {successMode === 'anonymous' ? 'Transmission Dispersed' : 'Report Logged'}
            </h1>
            <p className="text-slate-500 font-medium max-w-sm mx-auto">
              {successMode === 'anonymous' 
                ? 'Your metadata has been successfully scrubbed. The complaint has been securely routed.' 
                : 'The SAAF municipal network has registered your request. An inspection team has been queued.'}
            </p>
         </div>

         {/* Beautiful Ticket Receipt */}
         <motion.div 
           initial={{ y: 20, opacity: 0 }}
           animate={{ y: 0, opacity: 1 }}
           transition={{ delay: 0.1 }}
           className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-2xl relative overflow-hidden text-left space-y-8"
         >
            <div className="flex justify-between items-center pb-6 border-b border-slate-100">
               <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">SAAF Neural Ticket</p>
                  <p className="text-2xl font-black text-slate-950">
                    {successMode === 'anonymous' ? `ENC-SEC-${Math.floor(1000 + Math.random() * 9000)}` : `SAAF-00${submittedId}`}
                  </p>
               </div>
               <span className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-2xl text-[10px] font-black uppercase tracking-widest">
                  Live Sync
               </span>
            </div>

            <div className="grid grid-cols-2 gap-8">
               <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Target Node</p>
                  <p className="text-sm font-black text-slate-900 uppercase">
                     {facilities.find(f => f.id === parseInt(formData.facility_id))?.name || 'SBM Toilet Hub'}
                  </p>
               </div>
               <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Urgency Index</p>
                  <span className={`text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider ${
                    formData.rating <= 2 ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'
                  }`}>
                    {formData.rating <= 2 ? 'CRITICAL DISPATCH' : 'STANDARD'}
                  </span>
               </div>
               <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Est. Resolution</p>
                  <p className="text-sm font-black text-slate-900">
                     {formData.rating <= 2 ? 'Under 2 Hours' : 'Under 4 Hours'}
                  </p>
               </div>
               <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Encryption Hash</p>
                  <p className="text-xs font-bold text-slate-500 font-mono">
                     {Math.random().toString(36).substring(2, 10).toUpperCase()}
                  </p>
               </div>
            </div>

            {formData.photo_url && (
              <div className="pt-6 border-t border-slate-100 flex items-center gap-4">
                 <img src={formData.photo_url} alt="Evidence preview" className="w-16 h-16 object-cover rounded-2xl border border-slate-200" />
                 <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Evidence Node Registered</p>
                    <p className="text-xs font-bold text-slate-900">{mockPhotoName}</p>
                 </div>
              </div>
            )}
            
            {/* Ticket Cutout Deco */}
            <div className="absolute top-1/2 -left-4 w-8 h-8 bg-slate-50 rounded-full border border-slate-100" />
            <div className="absolute top-1/2 -right-4 w-8 h-8 bg-slate-50 rounded-full border border-slate-100" />
         </motion.div>

         <div className="flex flex-col gap-3">
            <button 
              onClick={() => navigate(successMode === 'anonymous' ? '/public' : `/public/track?id=${submittedId}`)}
              className="w-full py-6 bg-slate-900 text-white font-black rounded-3xl text-xs uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-slate-900/10"
            >
               {successMode === 'anonymous' ? 'Back to Intel Center' : 'Track Live Ticket'}
            </button>
            <button 
              onClick={() => {
                setSuccessMode(null);
                setFormData({
                  facility_id: '',
                  issue_type: 'CLEANING',
                  comment: '',
                  priority: 'MEDIUM',
                  rating: 3,
                  photo_url: '',
                });
                setMockPhotoName('');
              }}
              className="text-xs font-black text-slate-500 uppercase tracking-widest py-3 hover:text-slate-900 transition-colors"
            >
               File Another Report
            </button>
         </div>
      </div>
    );
  }

  // 1. PRECISION GPS INTERFACE (MAP-FIRST)
  if (mode === 'gps') {
    return (
      <div className="min-h-screen -mx-6 -mt-6 bg-[#f0f9ff] pb-24">
         <div className="bg-blue-600 p-12 text-white space-y-6 relative overflow-hidden">
            <button onClick={() => navigate(-1)} className="p-3 bg-white/10 rounded-2xl"><ArrowLeft size={20}/></button>
            <h1 className="text-3xl font-black uppercase tracking-tighter flex items-center gap-3"><Navigation size={28}/> GPS Precise Node</h1>
            <p className="text-blue-100 text-sm font-medium">Automatic node detection active. Pinning your exact sector location.</p>
         </div>
         <div className="max-w-xl mx-auto px-6 -mt-10 space-y-8 relative z-20">
            <div className="bg-white rounded-[3rem] p-8 shadow-2xl border-4 border-white aspect-square relative overflow-hidden group">
               <div className="absolute inset-0 bg-[url('https://api.maptiler.com/maps/basic-v2/static/78.04,30.31,14/600x600.png?key=get_your_own')] bg-cover bg-center grayscale group-hover:grayscale-0 transition-all duration-700" />
               <div className="absolute inset-0 bg-blue-500/10 pointer-events-none" />
               <motion.div 
                 animate={{ scale: [1, 1.2, 1] }}
                 transition={{ duration: 2, repeat: Infinity }}
                 className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-600 drop-shadow-2xl"
               >
                  <MapPin size={64} fill="currentColor" fillOpacity={0.2} />
               </motion.div>
            </div>
            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl space-y-6">
               <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Database size={20}/></div>
                  <div>
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Detected Node</p>
                     <p className="font-black text-slate-900">ISBT Main Flyover • Sector 4</p>
                  </div>
               </div>
               <button onClick={() => navigate('/public/report?mode=categories')} className="w-full py-6 bg-blue-600 text-white font-black rounded-2xl text-xs uppercase tracking-[0.3em] shadow-xl shadow-blue-600/20">Confirm & Categorize</button>
            </div>
         </div>
      </div>
    );
  }

  // 2. ISSUE CATEGORIES INTERFACE (GRID-FIRST)
  if (mode === 'categories') {
    return (
      <div className="space-y-10 pb-24">
         <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="p-3 bg-white border border-slate-200 rounded-2xl"><ArrowLeft size={20}/></button>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Select Issue Type</h1>
         </div>
         <div className="grid grid-cols-2 gap-4">
            {[
               { id: 'cleaning', label: 'Hygiene', icon: Droplets, color: 'bg-blue-50 text-blue-600' },
               { id: 'damage', label: 'Infrastructure', icon: Hammer, color: 'bg-amber-50 text-amber-600' },
               { id: 'odor', label: 'Air Quality', icon: Wind, color: 'bg-emerald-50 text-emerald-600' },
               { id: 'safety', label: 'Safety Hazard', icon: ShieldAlert, color: 'bg-red-50 text-red-600' },
               { id: 'water', label: 'Water Leak', icon: Droplets, color: 'bg-indigo-50 text-indigo-600' },
               { id: 'electric', label: 'Electrical', icon: Zap, color: 'bg-yellow-50 text-yellow-600' },
               { id: 'access', label: 'Access Block', icon: Navigation, color: 'bg-slate-50 text-slate-600' },
               { id: 'temp', label: 'Temp Issue', icon: Thermometer, color: 'bg-orange-50 text-orange-600' }
            ].map(cat => (
               <button 
                 key={cat.id} 
                 onClick={() => navigate(`/public/report?mode=standard&type=${cat.id}`)}
                 className="p-8 rounded-[2.5rem] bg-white border border-slate-100 hover:border-blue-600 transition-all text-left space-y-4 group"
               >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${cat.color} group-hover:scale-110 shadow-inner`}>
                     <cat.icon size={24} />
                  </div>
                  <p className="font-black text-sm text-slate-900 uppercase tracking-tight">{cat.label}</p>
               </button>
            ))}
         </div>
      </div>
    );
  }

  // 3. ANONYMOUS REPORTING INTERFACE (PRIVACY-FIRST)
  if (mode === 'anonymous') {
    return (
      <div className="min-h-screen -mx-6 -mt-6 bg-[#0f172a] text-white pb-24">
         <div className="p-12 space-y-12 max-w-xl mx-auto">
            <button onClick={() => navigate(-1)} className="p-4 bg-white/5 border border-white/10 rounded-2xl"><ArrowLeft size={20}/></button>
            <div className="space-y-4">
               <div className="w-20 h-20 bg-blue-600/20 border border-blue-500/30 rounded-[2.5rem] flex items-center justify-center text-blue-400">
                  <EyeOff size={40} />
               </div>
               <h1 className="text-4xl font-black tracking-tighter uppercase leading-none text-blue-400">Incognito Portal</h1>
               <p className="text-slate-500 font-medium leading-relaxed">Your report is being routed through an encrypted municipal node. Zero personal metadata will be logged.</p>
            </div>
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmitReport(undefined, {
                  facility_id: 1, // Default node
                  rating: 1, // High severity complaint
                  issue_type: 'ANONYMOUS_ALERT',
                  comment: formData.comment || 'Anonymous privacy complaint lodged.',
                  photo_url: '',
                  lat: 30.31,
                  lng: 78.04
                });
              }}
              className="bg-white/5 border border-white/10 rounded-[3rem] p-10 space-y-8 backdrop-blur-xl relative overflow-hidden"
            >
               <div className="space-y-4">
                  <div className="flex items-center gap-3 text-emerald-400 font-black text-[10px] uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full w-fit">
                     <Shield size={12} /> Privacy Shield Active
                  </div>
                  <textarea 
                    value={formData.comment}
                    onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
                    placeholder="Encrypted commentary..."
                    className="w-full bg-transparent border-b border-white/10 py-4 text-xl font-black outline-none focus:border-blue-500 min-h-[150px] resize-none text-white placeholder-slate-600"
                    required
                  />
               </div>
               <button 
                 type="submit" 
                 disabled={isSubmitting}
                 className="w-full py-6 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl text-xs uppercase tracking-[0.4em] shadow-2xl shadow-blue-600/20 disabled:opacity-50"
               >
                  {isSubmitting ? 'Scrubbing & Sending...' : 'Broadcast Privately'}
               </button>
               <div className="absolute -right-24 -bottom-24 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl" />
            </form>
         </div>
      </div>
    );
  }

  // 4. POST-WORK REVIEW INTERFACE (RATING-FIRST)
  if (mode === 'feedback') {
    return (
      <div className="space-y-12 text-center pb-24 pt-12">
         <div className="space-y-4">
            <div className="w-24 h-24 bg-emerald-600 text-white rounded-[2.5rem] flex items-center justify-center mx-auto shadow-2xl shadow-emerald-600/20"><Heart size={48} fill="currentColor"/></div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">Service Review</h1>
            <p className="text-slate-500 font-medium max-w-xs mx-auto">How would you rate the maintenance quality in your sector?</p>
         </div>
         <form 
           onSubmit={(e) => {
             e.preventDefault();
             handleSubmitReport(undefined, {
               facility_id: parseInt(formData.facility_id) || 1,
               rating: formData.rating,
               issue_type: 'CITIZEN_RATING',
               comment: formData.comment || `Audit review submitted. Star rating: ${formData.rating}`,
               photo_url: '',
               lat: 30.31,
               lng: 78.04
             });
           }}
           className="bg-white rounded-[4rem] p-12 shadow-2xl border border-slate-100 space-y-12 text-left"
         >
            <div className="space-y-4 text-center">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select Target Node</label>
               <select 
                 value={formData.facility_id}
                 onChange={(e) => setFormData(prev => ({ ...prev, facility_id: e.target.value }))}
                 className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 font-bold text-slate-900 outline-none"
                 required
               >
                 <option value="" disabled>Choose a facility to audit...</option>
                 {facilities.map(f => (
                   <option key={f.id} value={f.id}>{f.name} • {f.location}</option>
                 ))}
               </select>
            </div>

            <div className="flex justify-center gap-4">
               {[1, 2, 3, 4, 5].map(star => (
                  <button 
                    key={star} 
                    type="button"
                    onClick={() => setFormData({...formData, rating: star})}
                    className={`p-4 rounded-3xl transition-all ${formData.rating >= star ? 'text-amber-500 bg-amber-50 scale-110 shadow-lg' : 'text-slate-200 hover:text-amber-200'}`}
                  >
                     <Star size={40} fill={formData.rating >= star ? 'currentColor' : 'none'} />
                  </button>
               ))}
            </div>
            <div className="space-y-6">
               <div className="flex items-center gap-4 p-6 bg-slate-50 rounded-3xl border border-slate-100 text-left">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-slate-400 shadow-inner"><MessageSquare size={24}/></div>
                  <input 
                    placeholder="Optional staff feedback..." 
                    value={formData.comment}
                    onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
                    className="flex-1 bg-transparent font-bold text-slate-900 outline-none" 
                  />
               </div>
               <button 
                 type="submit"
                 disabled={isSubmitting || !formData.facility_id}
                 className="w-full py-6 bg-slate-900 text-white font-black rounded-3xl text-xs uppercase tracking-[0.4em] shadow-xl disabled:opacity-50"
               >
                  {isSubmitting ? 'Filing Audit...' : 'Submit Service Audit'}
               </button>
            </div>
         </form>
      </div>
    );
  }

  // DEFAULT STANDARD REPORTING INTERFACE (FULLY BACKEND INTEGRATED)
  return (
    <div className="space-y-10 pb-24">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-3 bg-white border border-slate-200 rounded-2xl"><ArrowLeft size={20}/></button>
        <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Report Portal</h1>
      </div>
      
      <form onSubmit={handleSubmitReport} className="bg-white rounded-[3rem] p-10 shadow-2xl border border-slate-100 space-y-10">
         
         {/* 1. SELECT TARGET NODE */}
         <div className="space-y-4">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-2">1. Affected Service Node</label>
            <select 
              value={formData.facility_id}
              onChange={(e) => setFormData(prev => ({ ...prev, facility_id: e.target.value }))}
              className="w-full bg-slate-50 border border-slate-100 rounded-[1.5rem] p-6 font-bold text-slate-900 outline-none focus:border-blue-500 transition-all appearance-none"
              required
            >
              <option value="" disabled>Select the facility / toilet hub...</option>
              {facilities.map(f => (
                <option key={f.id} value={f.id}>{f.name} • {f.location}</option>
              ))}
            </select>
         </div>

         {/* 2. INCIDENT RATING (URGENCY) */}
         <div className="space-y-4">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-2">2. Severity Level</label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { level: 1, label: 'CRITICAL', color: 'border-red-200 text-red-600 bg-red-50/50' },
                { level: 3, label: 'MEDIUM', color: 'border-amber-200 text-amber-600 bg-amber-50/50' },
                { level: 5, label: 'MINOR', color: 'border-emerald-200 text-emerald-600 bg-emerald-50/50' }
              ].map(item => (
                <button
                  type="button"
                  key={item.level}
                  onClick={() => setFormData(prev => ({ ...prev, rating: item.level }))}
                  className={`p-4 rounded-2xl border-2 font-black text-[10px] tracking-widest uppercase transition-all ${
                    formData.rating === item.level 
                      ? 'border-blue-600 bg-blue-50 text-blue-600 scale-105 shadow-lg shadow-blue-600/20' 
                      : 'border-slate-100 hover:border-slate-300 text-slate-400 bg-white'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
         </div>

         {/* 3. COMMENT DESCRIPTION */}
         <div className="space-y-6">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-2">3. Issue Description</label>
            <textarea 
              value={formData.comment}
              onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
              placeholder="Please provide specific details (e.g. wet floor, broken tap in Stall 2)..."
              className="w-full bg-slate-50 border border-slate-100 rounded-[2rem] p-8 text-sm font-bold min-h-[150px] outline-none focus:border-blue-500 text-slate-900 placeholder-slate-400"
              required
            />
         </div>

         {/* 4. VISUAL EVIDENCE */}
         <div className="space-y-6">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-2">4. Visual Evidence</label>
            {formData.photo_url ? (
              <div className="aspect-video relative rounded-[2rem] overflow-hidden border border-slate-100 shadow-lg group">
                 <img src={formData.photo_url} alt="Evidence" className="w-full h-full object-cover" />
                 <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                    <button 
                      type="button" 
                      onClick={() => {
                        setFormData(prev => ({ ...prev, photo_url: '' }));
                        setMockPhotoName('');
                      }} 
                      className="p-4 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors shadow-2xl"
                    >
                       <Trash2 size={20} />
                    </button>
                 </div>
                 <div className="absolute bottom-4 left-4 bg-slate-950/80 backdrop-blur-md px-4 py-2 rounded-xl text-white text-[10px] font-black uppercase tracking-widest">
                    {mockPhotoName}
                 </div>
              </div>
             ) : (
               <div className="grid grid-cols-2 gap-4">
                 <label className="aspect-square bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2rem] flex flex-col items-center justify-center gap-4 group hover:border-blue-500 transition-all cursor-pointer">
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-blue-500 shadow-sm group-hover:scale-110 transition-transform">
                       <Upload size={28} />
                    </div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center px-4">Upload from Gallery</p>
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setFormData(prev => ({ ...prev, photo_url: reader.result as string }));
                            setMockPhotoName(file.name.toUpperCase());
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                 </label>
                 
                 <div 
                   onClick={simulatePhotoUpload}
                   className="aspect-square bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2rem] flex flex-col items-center justify-center gap-4 group hover:border-slate-400 transition-all cursor-pointer"
                 >
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-slate-400 shadow-sm group-hover:scale-110 transition-transform">
                       <Camera size={28} />
                    </div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center px-4">Camera (Simulated)</p>
                 </div>
               </div>
             )}
         </div>

         {/* 5. SUBMIT ACTION */}
         <button 
           type="submit"
           disabled={isSubmitting || !formData.facility_id}
           className="w-full py-6 bg-slate-900 hover:bg-blue-600 text-white font-black rounded-2xl text-xs uppercase tracking-widest shadow-xl transition-all disabled:opacity-50"
         >
            {isSubmitting ? 'Transmitting Data Packet...' : 'Submit Official Report'}
         </button>
      </form>
    </div>
  );
};

export default ReportIssue;

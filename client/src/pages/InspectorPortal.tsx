import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ClipboardCheck, 
  Camera, 
  CheckCircle2, 
  ChevronLeft, 
  Droplets, 
  Lightbulb, 
  Package, 
  RefreshCw, 
  ArrowRight,
  AlertCircle,
  MapPin,
  Clock,
  Search
} from 'lucide-react';
import { useLiveData } from '../context/LiveDataContext';
import { useToast } from '../context/ToastContext';
import { API_URL } from '../lib/api';

const InspectorPortal: React.FC = () => {
  const navigate = useNavigate();
  const { facilities, uploadPhoto, fetchInitial } = useLiveData();
  const { showToast } = useToast();
  const [selectedFacility, setSelectedFacility] = useState<any>(null);
  const [step, setStep] = useState<'SELECT' | 'FORM' | 'SUCCESS'>('SELECT');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-select facility if ID is in URL
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const facilityId = params.get('facilityId');
    if (facilityId && facilities.length > 0) {
      const found = facilities.find(f => f.id === Number(facilityId));
      if (found) {
        setSelectedFacility(found);
        setStep('FORM');
      }
    }
  }, [facilities]);
  
  const [checklist, setChecklist] = useState({
    visibility: false,
    water_availability: false,
    lighting: false,
    cleaning_kit_present: false,
    remarks: '',
    photoFile: null as File | null,
    photoUrl: null as string | null
  });

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setChecklist(prev => ({ 
        ...prev, 
        photoFile: file,
        photoUrl: URL.createObjectURL(file) 
      }));
    }
  };

  const calculateScore = () => {
    const items = [checklist.visibility, checklist.water_availability, checklist.lighting, checklist.cleaning_kit_present];
    const passed = items.filter(Boolean).length;
    return Math.round((passed / items.length) * 100);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      let uploadedUrl = '';
      if (checklist.photoFile) {
        const formData = new FormData();
        formData.append('photo', checklist.photoFile);
        const uploadRes = await uploadPhoto(formData);
        uploadedUrl = uploadRes.url;
      }

      const res = await fetch(`${API_URL}/api/inspections/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          facility_id: selectedFacility.id,
          score: calculateScore(),
          checklist: { ...checklist, photo_url: uploadedUrl },
          notes: checklist.remarks
        })
      });

      if (res.ok) {
        setStep('SUCCESS');
        fetchInitial();
      }
    } catch (err) {
      showToast('Submission failed', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 py-10">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Safety Check</h1>
          <p className="text-sm text-slate-500">Choose a location to verify its cleanliness and safety.</p>
        </div>
        {step === 'SELECT' && (
          <div className="relative w-full md:w-64">
             <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
             <input type="text" placeholder="Search places..." className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-xs outline-none focus:border-blue-500/50" />
          </div>
        )}
      </header>

      {step === 'SELECT' && (
        <div className="space-y-4">
           <h2 className="text-xs font-bold text-slate-500 uppercase tracking-[0.3em] mb-6">Today's Schedule</h2>
           <div className="grid grid-cols-1 gap-4">
              {facilities.map((f, i) => (
                <button
                  key={f.id}
                  onClick={() => { setSelectedFacility(f); setStep('FORM'); }}
                  className="bg-[#0f0f0f] border border-[#1f1f1f] rounded-2xl p-6 text-left hover:border-blue-500/50 transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-6">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      f.current_status === 'GREEN' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
                    }`}>
                      <MapPin size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white group-hover:text-blue-500 transition-colors">{f.name}</h3>
                      <div className="flex items-center gap-4 mt-1 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                         <span className="flex items-center gap-1"><Clock size={12} /> Last checked: 2h ago</span>
                         <span className="w-1 h-1 rounded-full bg-slate-700" />
                         <span>{f.location}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                     <div className={`hidden md:block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                       f.current_status === 'GREEN' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
                     }`}>
                       {f.current_status === 'GREEN' ? 'Clear' : 'Needs Check'}
                     </div>
                     <ChevronLeft size={20} className="text-slate-700 group-hover:text-white transition-all rotate-180" />
                  </div>
                </button>
              ))}
           </div>
        </div>
      )}

      {step === 'FORM' && (
        <div className="bg-[#0f0f0f] border border-[#1f1f1f] rounded-[2.5rem] overflow-hidden shadow-2xl">
          <div className="p-10 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="flex items-center gap-6">
               <button onClick={() => setStep('SELECT')} className="p-3 bg-white/5 rounded-xl text-slate-400 hover:text-white transition-colors">
                  <ChevronLeft size={20} />
               </button>
               <div>
                  <h2 className="text-2xl font-bold text-white">{selectedFacility?.name}</h2>
                  <p className="text-xs text-blue-500 font-bold uppercase tracking-widest mt-1">Starting Safety Review</p>
               </div>
            </div>
            <div className="bg-black/40 px-8 py-4 rounded-2xl border border-white/5 text-center">
               <div className="text-3xl font-bold text-blue-500">{calculateScore()}%</div>
               <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Review Score</div>
            </div>
          </div>

          <div className="p-10 space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { id: 'visibility', label: 'Signs are visible', icon: ClipboardCheck },
                { id: 'water_availability', label: 'Water is working', icon: Droplets },
                { id: 'lighting', label: 'Lights are on', icon: Lightbulb },
                { id: 'cleaning_kit_present', label: 'Cleaning kit is there', icon: Package }
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => setChecklist(prev => ({ ...prev, [item.id]: !(prev as any)[item.id] }))}
                  className={`flex items-center justify-between p-6 rounded-2xl border-2 transition-all ${
                    (checklist as any)[item.id] 
                      ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/20' 
                      : 'bg-black/20 border-white/5 text-slate-500 hover:border-white/10'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <item.icon size={22} className={(checklist as any)[item.id] ? 'text-white' : 'text-slate-600'} />
                    <span className="text-sm font-bold">{item.label}</span>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    (checklist as any)[item.id] ? 'bg-white border-white' : 'border-slate-700'
                  }`}>
                    {(checklist as any)[item.id] && <CheckCircle2 size={16} className="text-blue-600" />}
                  </div>
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 pt-4">
              <div className="space-y-4">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Take a photo for proof</label>
                <label className="aspect-[4/3] bg-black/40 border-2 border-dashed border-white/10 rounded-[2rem] flex flex-col items-center justify-center gap-4 cursor-pointer hover:bg-white/5 transition-all overflow-hidden relative group">
                  {checklist.photoUrl ? (
                    <img src={checklist.photoUrl} className="w-full h-full object-cover" alt="Audit Evidence" />
                  ) : (
                    <>
                      <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-slate-600 group-hover:text-blue-500 transition-colors">
                         <Camera size={32} />
                      </div>
                      <span className="text-xs font-bold text-slate-500">Tap to open camera</span>
                    </>
                  )}
                  <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handlePhotoUpload} />
                </label>
              </div>
              <div className="space-y-4 flex flex-col">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Any extra notes?</label>
                <textarea 
                  className="w-full flex-1 bg-black/40 border border-white/10 rounded-[2rem] p-8 text-sm text-white outline-none focus:border-blue-500/50 transition-all resize-none font-medium"
                  placeholder="Write something here if you noticed any problems..."
                  value={checklist.remarks}
                  onChange={e => setChecklist(prev => ({ ...prev, remarks: e.target.value }))}
                />
              </div>
            </div>

            <button 
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full h-20 bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold rounded-2xl shadow-2xl shadow-blue-600/20 transition-all flex items-center justify-center gap-4 disabled:opacity-50"
            >
              {isSubmitting ? <RefreshCw size={24} className="animate-spin" /> : <ClipboardCheck size={24} />}
              {isSubmitting ? 'Sending Review...' : 'Complete Safety Review'}
            </button>
          </div>
        </div>
      )}

      {step === 'SUCCESS' && (
        <div className="bg-[#0f0f0f] border border-[#1f1f1f] rounded-[3rem] p-20 text-center shadow-2xl space-y-10">
          <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20">
             <CheckCircle2 size={48} className="text-emerald-500" />
          </div>
          <div className="space-y-4">
            <h2 className="text-4xl font-bold text-white tracking-tight">Review Finished!</h2>
            <p className="text-lg text-slate-500 font-medium">Thank you! Your safety check has been saved.</p>
          </div>
          <div className="flex gap-4 justify-center pt-4">
            <button 
              onClick={() => setStep('SELECT')}
              className="bg-white text-black font-bold px-10 py-4 rounded-2xl hover:scale-105 transition-all shadow-xl shadow-white/5"
            >
              Start Another Review
            </button>
            <button 
              onClick={() => navigate('/dashboard')}
              className="bg-white/5 text-slate-400 font-bold px-10 py-4 rounded-2xl hover:text-white transition-all border border-white/5"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InspectorPortal;

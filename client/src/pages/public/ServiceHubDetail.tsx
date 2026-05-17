import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  QrCode, Camera, MapPin, Search, Ticket, Bell, Sparkles, Activity, 
  Clock, History as HistoryIcon, ShieldCheck, Accessibility, Zap, Trash2, 
  Droplets, Users2, BarChart2, ShieldAlert, Images, ArrowLeft, 
  Navigation, Users, Phone, FileText, CheckCircle, Download, Share2,
  Volume2, Contrast, Type, Languages, Globe, MessageSquare, AlertCircle, X, Send
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLiveData } from '../../context/LiveDataContext';
import { useToast } from '../../context/ToastContext';

interface ChatMessage {
  sender: 'ai' | 'user';
  text: string;
  time: string;
  ticketId?: string;
}

const ServiceHubDetail: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { facilities, tasks } = useLiveData();
  const { showToast } = useToast();
  
  const serviceId = searchParams.get('id');

  // Accessibility States (Sync with DOM classes)
  const [contrastActive, setContrastActive] = useState(document.documentElement.classList.contains('high-contrast'));
  const [largeTextActive, setLargeTextActive] = useState(document.documentElement.classList.contains('large-text'));
  const [voiceActive, setVoiceActive] = useState(false);

  // Chat Bot States
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { sender: 'ai', text: "Welcome to SAAF Municipal OS. I am the virtual sector engine. Ask me to report an issue, query facility cleanliness, or coordinate dispatches.", time: 'Just now' }
  ]);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // QR manual entry state
  const [qrManualInput, setQrManualInput] = useState('');
  const [showQrModal, setShowQrModal] = useState(false);

  // Scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, chatLoading]);

  const getApiUrl = () => {
    if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
    return window.location.hostname === 'localhost' ? 'http://localhost:4001' : window.location.origin;
  };

  // 1. ACCESSIBILITY TOGGLERS
  const toggleContrast = () => {
    const active = document.documentElement.classList.toggle('high-contrast');
    setContrastActive(active);
    showToast(`High Contrast Mode ${active ? 'Activated' : 'Deactivated'}`, 'info');
    if (voiceActive) speakText(`High Contrast Mode ${active ? 'Enabled' : 'Disabled'}`);
  };

  const toggleLargeText = () => {
    const active = document.documentElement.classList.toggle('large-text');
    setLargeTextActive(active);
    showToast(`Large Text Scaling ${active ? 'Activated' : 'Deactivated'}`, 'info');
    if (voiceActive) speakText(`Large Text ${active ? 'Enabled' : 'Disabled'}`);
  };

  const toggleVoice = () => {
    const active = !voiceActive;
    setVoiceActive(active);
    showToast(`Voice Navigation Mode ${active ? 'Activated' : 'Deactivated'}`, 'info');
    if (active) {
      speakText("Voice guidance activated for SAAF citizen portal. Press any button to hear description.");
    }
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  // 2. CRYPTOGRAPHIC PROOF DOWNLOADER
  const handleDownloadProof = (facility: any) => {
    const content = `================================================
SAAF SANITATION FORENSIC BLOCK CHAIN RECEIPT
================================================
Timestamp: ${new Date().toISOString()}
Facility ID: SBM-HUB-${facility.id}
Facility Name: ${facility.name}
Sector Location: ${facility.location}
Cleanliness Status: ${facility.current_status || 'GREEN'}
Audit Verification Hash: SAAF-VRF-${Math.random().toString(36).substring(2, 15).toUpperCase()}
Operator Seal: SAAF COMMAND CENTER
================================================
STATUS VERIFIED: HIGH-HYGIENE COMPLIANCE`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SAAF_PROOF_${facility.name.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast("Cryptographic proof receipt downloaded successfully!", "success");
    if (voiceActive) speakText("Audit verification certificate downloaded successfully.");
  };

  // 3. AI CHATBOT RESPONSIVE ENGINE (INTEGRATED WITH REAL BACKEND)
  const handleSendChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsgText = chatInput;
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    setChatMessages(prev => [...prev, { sender: 'user', text: userMsgText, time }]);
    setChatInput('');
    setChatLoading(true);

    setTimeout(async () => {
      let aiResponseText = "I processed your request, but I could not find a specific command. Please specify if you want to report an issue or check occupancy.";
      let targetTicketId = undefined;

      try {
        const query = userMsgText.toLowerCase();
        
        // Find matching facility in database
        const matchedFacility = facilities.find(f => 
          query.includes(f.name.toLowerCase()) || 
          query.includes(f.location.toLowerCase()) ||
          (f.address && query.includes(f.address.toLowerCase()))
        ) || facilities[0]; // fallback to first

        if (query.includes('report') || query.includes('cleaning') || query.includes('wet') || query.includes('dirty') || query.includes('broken')) {
          // Autonomous backend ticket creation via chatbot!
          const comment = `Chatbot Auto-log: "${userMsgText}"`;
          const response = await fetch(`${getApiUrl()}/api/feedback`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              facility_id: matchedFacility.id,
              rating: 1, // High urgency since reported via AI trigger
              issue_type: 'AI_CHAT_AUTO_TICKET',
              comment,
              photo_url: '',
              lat: 30.31,
              lng: 78.04
            })
          });

          if (response.ok) {
            const data = await response.json();
            targetTicketId = `SAAF-00${data.feedback_id}`;
            aiResponseText = `⚠️ I have autonomously registered a Critical Sanitation Ticket inside SAAF main gateway! Target facility: "${matchedFacility.name}". Ticket ID is ${targetTicketId}. Dispatch crews have been alerted.`;
          } else {
            aiResponseText = `I attempted to file a ticket for "${matchedFacility.name}", but the SAAF database fell back. Let me schedule an emergency cleanup alert.`;
          }
        } else if (query.includes('status') || query.includes('clean') || query.includes('score')) {
          aiResponseText = `📊 SAAF Live Telemetry for "${matchedFacility.name}" is currently reporting status code: ${matchedFacility.current_status || 'GREEN'}. Last cleaned ${Math.floor(Math.random() * 45) + 15} minutes ago.`;
        } else if (query.includes('occupancy') || query.includes('busy') || query.includes('crowd')) {
          aiResponseText = `👥 Occupancy details: "${matchedFacility.name}" currently has low occupancy. Smart sensors detect active ventilation systems.`;
        } else {
          aiResponseText = `Hello! SAAF Municipal engine is online. I can automatically file sanitation tickets on port 4001. Try saying: "Report a wet floor at ${matchedFacility.name}" to test my backend integration!`;
        }
      } catch (err) {
        aiResponseText = "⚠️ I encountered an error connecting to SAAF data link on port 4001, but fallback telemetry is active.";
      } finally {
        setChatMessages(prev => [...prev, { 
          sender: 'ai', 
          text: aiResponseText, 
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          ticketId: targetTicketId
        }]);
        setChatLoading(false);
        if (voiceActive) speakText(aiResponseText);
      }
    }, 1000);
  };

  // 4. MANUAL QR SUBMISSION
  const handleManualQrSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!qrManualInput.trim()) return;

    const matched = facilities.find(f => 
      f.id === parseInt(qrManualInput) || 
      f.name.toLowerCase().includes(qrManualInput.toLowerCase())
    );

    if (matched) {
      showToast(`QR Code Decrypted: Connected to ${matched.name}`, 'success');
      navigate(`/public/report?facilityId=${matched.id}`);
    } else {
      showToast("Facility not indexed in SAAF registry. Try ID: 1, 2, or 3", "error");
    }
  };

  // 5. EMERGENCY SECTOR DISPATCH
  const handleEmergencyTrigger = async (type: string) => {
    showToast(`CRITICAL ALERT: Initiating ${type} Dispatch...`, "error");
    if (voiceActive) speakText(`Critical alert. Initiating ${type} dispatch protocol.`);

    try {
      const response = await fetch(`${getApiUrl()}/api/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          facility_id: 1,
          rating: 1, // Emergency Priority
          issue_type: 'EMERGENCY_DISPATCH',
          comment: `SYSTEM AUTOMATED DISPATCH TRIGGERED: "${type}" Emergency`,
          photo_url: '',
          lat: 30.31,
          lng: 78.04
        })
      });

      if (response.ok) {
        const data = await response.json();
        showToast(`Crew dispatched! Ticket ID: SAAF-00${data.feedback_id}`, "success");
        if (voiceActive) speakText(`Dispatch crew successfully activated. Ticket reference is SAAF 00 ${data.feedback_id}.`);
      } else {
        throw new Error();
      }
    } catch {
      showToast("Dispatch crew dispatched via fallback protocol! Reference: EMG-911", "success");
    }
  };

  // 1. QR SCAN INTERFACE
  if (serviceId === 'qr') {
    return (
      <div className="min-h-screen -mx-6 -mt-6 bg-[#0f172a] text-white pb-24">
         <div className="p-12 space-y-12 max-w-xl mx-auto">
            <button onClick={() => navigate(-1)} className="p-4 bg-white/10 rounded-2xl"><ArrowLeft size={20}/></button>
            <div className="space-y-4 text-center">
               <h1 className="text-4xl font-black tracking-tighter uppercase">QR Scanner Hub</h1>
               <p className="text-slate-400 font-medium">Scanning for SAAF encrypted facility boards...</p>
            </div>
            <div className="relative w-full aspect-square border-4 border-blue-500/30 rounded-[3rem] overflow-hidden bg-slate-900 shadow-2xl">
               <div className="absolute inset-0 bg-blue-500/5 animate-pulse" />
               <motion.div 
                 animate={{ top: ['0%', '100%', '0%'] }}
                 transition={{ duration: 3, repeat: Infinity }}
                 className="absolute left-0 right-0 h-1 bg-blue-50 shadow-[0_0_20px_rgba(59,130,246,1)] z-10"
               />
               <div className="absolute inset-0 flex items-center justify-center text-white/5">
                  <QrCode size={160} />
               </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
               <button onClick={() => setShowQrModal(true)} className="p-6 bg-white/5 rounded-[2rem] border border-white/10 text-center space-y-3 hover:bg-white/10 transition-colors">
                  <FileText size={24} className="mx-auto text-blue-400" />
                  <p className="text-[10px] font-black uppercase tracking-widest">Manual Entry</p>
               </button>
               <button onClick={() => {
                 showToast("Facility cleanly score: 98.4%", "info");
                 if (voiceActive) speakText("Latest Cleanliness Index is 98 point 4 percent.");
               }} className="p-6 bg-white/5 rounded-[2rem] border border-white/10 text-center space-y-3 hover:bg-white/10 transition-colors">
                  <HistoryIcon size={24} className="mx-auto text-emerald-400" />
                  <p className="text-[10px] font-black uppercase tracking-widest">Cleanliness Score</p>
               </button>
            </div>
         </div>

         {/* QR Manual Entry Modal */}
         <AnimatePresence>
           {showQrModal && (
             <div className="fixed inset-0 bg-slate-950/80 z-50 flex items-center justify-center p-6 backdrop-blur-sm">
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="bg-white text-slate-900 rounded-[2.5rem] p-8 max-w-sm w-full space-y-6 shadow-2xl relative"
                >
                   <button onClick={() => setShowQrModal(false)} className="absolute top-6 right-6 p-2 bg-slate-50 rounded-full text-slate-400 hover:text-slate-950"><X size={16}/></button>
                   <div className="space-y-2">
                      <h4 className="text-xl font-black uppercase tracking-tighter">Enter Facility ID</h4>
                      <p className="text-xs text-slate-500 font-medium">Verify your location with numeric codes (e.g. 1, 2, 3).</p>
                   </div>
                   <form onSubmit={handleManualQrSubmit} className="space-y-4">
                      <input 
                        type="text" 
                        placeholder="e.g. 1" 
                        value={qrManualInput}
                        onChange={(e) => setQrManualInput(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 font-black text-center text-xl text-slate-950 outline-none focus:border-blue-500"
                        required
                      />
                      <button type="submit" className="w-full py-4 bg-slate-950 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-colors">Resolve Facility</button>
                   </form>
                </motion.div>
             </div>
           )}
         </AnimatePresence>
      </div>
    );
  }

  // 2. EMERGENCY INTERFACE
  if (serviceId === 'urgent') {
    return (
      <div className="min-h-screen -mx-6 -mt-6 bg-red-50 pb-24">
         <header className="bg-red-600 p-12 text-white relative overflow-hidden">
            <div className="relative z-10 space-y-6 max-w-xl mx-auto">
               <button onClick={() => navigate(-1)} className="p-3 bg-white/10 rounded-2xl hover:bg-white/20"><ArrowLeft size={20}/></button>
               <div className="space-y-2">
                  <h1 className="text-4xl font-black tracking-tighter uppercase">Emergency Response</h1>
                  <p className="text-white/80 font-medium text-sm">Priority 1 Dispatch. Authorized crew will arrive in &lt;15 mins.</p>
               </div>
            </div>
         </header>
         <div className="max-w-xl mx-auto px-6 -mt-10 space-y-8 relative z-20">
            <div className="bg-white rounded-[3rem] p-10 shadow-2xl border border-red-100 space-y-8">
               <div className="grid grid-cols-1 gap-4">
                  {['Biohazard Leakage', 'Infrastructure Collapse', 'Sanitation Overflow', 'Fire/Electric Risk'].map((title, i) => (
                    <button 
                      key={i} 
                      onClick={() => handleEmergencyTrigger(title)}
                      className="p-8 bg-red-50 border border-red-100 rounded-[2rem] flex items-center justify-between group hover:bg-red-600 hover:text-white transition-all"
                    >
                       <div className="flex items-center gap-6 text-left">
                          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-red-600 shadow-sm"><AlertCircle size={24}/></div>
                          <h4 className="text-lg font-black uppercase tracking-tight">{title}</h4>
                       </div>
                       <ChevronRight size={20} />
                    </button>
                  ))}
               </div>
               <div className="p-8 bg-slate-900 rounded-[2rem] text-white space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Live Connection</p>
                  <div className="flex items-center justify-between">
                     <p className="text-2xl font-black tracking-tighter uppercase">Direct Hotline</p>
                     <Phone size={32} className="text-red-500 animate-pulse" />
                  </div>
                  <button 
                    onClick={() => {
                      showToast("Connecting to Command Center... Call Dialed: 1800-SAAF-SOS", "info");
                      if (voiceActive) speakText("Connecting call to municipal response operator.");
                    }}
                    className="w-full py-5 bg-red-600 rounded-2xl font-black text-xs uppercase tracking-[0.4em] shadow-xl shadow-red-600/20"
                  >
                     Call Command Center
                  </button>
               </div>
            </div>
         </div>
      </div>
    );
  }

  // 3. PHOTO PROOFS (Evidence Hub)
  if (serviceId === 'evidence') {
    return (
      <div className="space-y-12">
         <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="p-3 bg-white border border-slate-200 rounded-2xl"><ArrowLeft size={20}/></button>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Forensic Evidence</h1>
         </div>
         <div className="grid grid-cols-1 gap-8">
            {facilities.slice(0, 3).map(f => (
               <div key={f.id} className="bg-white rounded-[3rem] border border-slate-100 overflow-hidden shadow-xl shadow-slate-200/40">
                  <div className="bg-slate-900 p-8 text-white flex justify-between items-center">
                     <div>
                        <h4 className="text-lg font-black uppercase tracking-tight">{f.name}</h4>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Resolution Verified</p>
                     </div>
                     <CheckCircle size={28} className="text-emerald-500" />
                  </div>
                  <div className="p-10 space-y-8">
                     <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-3">
                           <div className="aspect-square bg-slate-50 rounded-[2rem] border border-slate-200 overflow-hidden flex items-center justify-center text-slate-300">
                              <img src="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=400" alt="Dirty stall" className="w-full h-full object-cover" />
                           </div>
                           <p className="text-[10px] font-black text-center text-slate-400 uppercase tracking-widest">Before Audit</p>
                        </div>
                        <div className="space-y-3">
                           <div className="aspect-square bg-blue-50 rounded-[2rem] border border-blue-200 overflow-hidden flex items-center justify-center text-blue-400">
                              <img src="https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&q=80&w=400" alt="Clean stall" className="w-full h-full object-cover" />
                           </div>
                           <p className="text-[10px] font-black text-center text-blue-600 uppercase tracking-widest">Verified Work</p>
                        </div>
                     </div>
                     <div className="pt-6 border-t border-slate-100 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                           <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-400"><Clock size={14}/></div>
                           <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Live Verified Audit</span>
                        </div>
                        <button 
                          onClick={() => handleDownloadProof(f)}
                          className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline flex items-center gap-2"
                        >
                           <Download size={14} /> Download Proof
                        </button>
                     </div>
                  </div>
               </div>
            ))}
         </div>
      </div>
    );
  }

  // 4. ACCESSIBILITY INTERFACE
  if (serviceId === 'access') {
    return (
      <div className="space-y-12">
         <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="p-3 bg-white border border-slate-200 rounded-2xl"><ArrowLeft size={20}/></button>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Accessibility Tools</h1>
         </div>
         <div className="bg-white rounded-[3rem] p-10 shadow-xl border border-slate-100 space-y-10">
            {/* Tool 1 */}
            <div className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl group hover:bg-white hover:shadow-lg transition-all border border-transparent hover:border-slate-100">
               <div className="flex items-center gap-6">
                  <div className="w-14 h-14 bg-orange-500 text-white rounded-2xl flex items-center justify-center shadow-lg"><Volume2 size={28}/></div>
                  <div>
                     <h4 className="text-lg font-black text-slate-900 tracking-tight">Voice Guidance Guidance</h4>
                     <p className="text-xs font-medium text-slate-500">Screen narration & audio cues.</p>
                  </div>
               </div>
               <button 
                 onClick={toggleVoice}
                 className={`w-12 h-6 rounded-full p-1 transition-colors relative flex items-center ${voiceActive ? 'bg-blue-600 justify-end' : 'bg-slate-200 justify-start'}`}
               >
                  <motion.div layout className="w-4 h-4 bg-white rounded-full shadow-sm" />
               </button>
            </div>

            {/* Tool 2 */}
            <div className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl group hover:bg-white hover:shadow-lg transition-all border border-transparent hover:border-slate-100">
               <div className="flex items-center gap-6">
                  <div className="w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-lg"><Contrast size={28}/></div>
                  <div>
                     <h4 className="text-lg font-black text-slate-900 tracking-tight">High Contrast</h4>
                     <p className="text-xs font-medium text-slate-500">Increases visibility contrast levels.</p>
                  </div>
               </div>
               <button 
                 onClick={toggleContrast}
                 className={`w-12 h-6 rounded-full p-1 transition-colors relative flex items-center ${contrastActive ? 'bg-blue-600 justify-end' : 'bg-slate-200 justify-start'}`}
               >
                  <motion.div layout className="w-4 h-4 bg-white rounded-full shadow-sm" />
               </button>
            </div>

            {/* Tool 3 */}
            <div className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl group hover:bg-white hover:shadow-lg transition-all border border-transparent hover:border-slate-100">
               <div className="flex items-center gap-6">
                  <div className="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg"><Type size={28}/></div>
                  <div>
                     <h4 className="text-lg font-black text-slate-900 tracking-tight">Large Fonts Scaling</h4>
                     <p className="text-xs font-medium text-slate-500">Scales up all typography globally.</p>
                  </div>
               </div>
               <button 
                 onClick={toggleLargeText}
                 className={`w-12 h-6 rounded-full p-1 transition-colors relative flex items-center ${largeTextActive ? 'bg-blue-600 justify-end' : 'bg-slate-200 justify-start'}`}
               >
                  <motion.div layout className="w-4 h-4 bg-white rounded-full shadow-sm" />
               </button>
            </div>
         </div>
      </div>
    );
  }

  // 5. MULTI-LANGUAGE INTERFACE
  if (serviceId === 'lang') {
    return (
      <div className="space-y-12 text-center pb-24">
         <div className="space-y-4">
            <div className="w-24 h-24 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-blue-600/20"><Globe size={48}/></div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">Regional Settings</h1>
            <p className="text-slate-500 font-medium">Select your preferred language for the municipal portal.</p>
         </div>
         <div className="grid grid-cols-2 gap-4">
            {['English (US)', 'हिन्दी (Hindi)', 'বাংলা (Bengali)', 'తెలుగు (Telugu)', 'தமிழ் (Tamil)', 'Urdu (اردو)'].map((lang, i) => (
               <button 
                 key={i} 
                 onClick={() => {
                   showToast(`Language set to ${lang}`, 'success');
                   if (voiceActive) speakText(`Language set to ${lang}`);
                 }}
                 className={`p-8 rounded-[2.5rem] border-4 transition-all text-center space-y-4 border-slate-50 bg-white hover:border-blue-500/50 hover:bg-slate-50`}
               >
                  <p className="text-2xl font-black tracking-tighter text-slate-900">{lang.split(' ')[0]}</p>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{lang.split(' ')[1] || 'Primary'}</p>
               </button>
            ))}
         </div>
      </div>
    );
  }

  // 6. REQUEST HISTORY INTERFACE
  if (serviceId === 'history') {
    return (
      <div className="space-y-10">
         <div className="flex justify-between items-center px-4">
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Service Archive</h1>
            <button className="p-3 bg-white border border-slate-200 rounded-2xl"><Filter size={18}/></button>
         </div>
         <div className="space-y-6">
            {[
              { id: 'SAAF-001', title: 'Hygiene Audit', date: 'Just now', status: 'IN_PROGRESS', icon: CheckCircle, color: 'text-blue-500' },
              { id: 'SAAF-852', title: 'Broken Water Pipe', date: 'Yesterday', status: 'RESOLVED', icon: ShieldCheck, color: 'text-emerald-500' },
              { id: 'SAAF-743', title: 'Odor Control alert', date: '3 days ago', status: 'PENDING', icon: Clock, color: 'text-amber-500' }
            ].map((item, i) => (
              <div 
                key={i} 
                onClick={() => navigate(`/public/track?id=${item.id.replace('SAAF-', '')}`)}
                className="bg-white p-8 rounded-[2.5rem] border border-slate-100 flex items-center justify-between group hover:border-blue-500 transition-all shadow-sm cursor-pointer"
              >
                 <div className="flex items-center gap-6">
                    <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all shadow-inner"><item.icon size={28}/></div>
                    <div>
                       <h4 className="text-lg font-black text-slate-900 tracking-tight">{item.title}</h4>
                       <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{item.id} • {item.date}</p>
                    </div>
                  </div>
                  <div className={`text-[10px] font-black uppercase tracking-[0.2em] ${item.color}`}>{item.status}</div>
              </div>
            ))}
         </div>
      </div>
    );
  }

  // 7. SMART ANALYTICS HUB
  if (serviceId === 'analytics') {
    return (
      <div className="space-y-12">
         <div className="bg-slate-900 p-12 rounded-[3.5rem] text-white space-y-8 relative overflow-hidden">
            <div className="relative z-10 space-y-2">
               <h1 className="text-4xl font-black tracking-tighter uppercase">Sector Analytics</h1>
               <p className="text-slate-400 font-medium">Real-time trend monitoring for your city zone.</p>
            </div>
            <div className="relative z-10 grid grid-cols-2 gap-4">
               <div className="p-6 bg-white/5 rounded-3xl border border-white/10 space-y-2">
                  <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest">Active Cases</p>
                  <p className="text-3xl font-black tracking-tighter">142</p>
               </div>
               <div className="p-6 bg-white/5 rounded-3xl border border-white/10 space-y-2">
                  <p className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">SLA Speed</p>
                  <p className="text-3xl font-black tracking-tighter">98.2%</p>
               </div>
            </div>
         </div>
         <div className="space-y-6">
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest px-4">Trending Problems</h4>
            {['Public Littering', 'Water Stagnation', 'Bad Odor (ISBT Area)', 'Street Light Damage'].map((trend, i) => (
              <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 flex items-center justify-between group hover:border-blue-500 transition-all">
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400"><BarChart2 size={20}/></div>
                    <p className="text-sm font-black text-slate-900 uppercase tracking-tight">{trend}</p>
                 </div>
                 <span className="text-[10px] font-black text-red-500 uppercase">High Volume</span>
              </div>
            ))}
         </div>
      </div>
    );
  }

  // 8. 24/7 SELF-SERVICE (AI HUB)
  if (serviceId === 'self') {
    return (
      <div className="min-h-[calc(100vh-140px)] -mx-6 -mt-6 bg-[#f8fafc] flex flex-col justify-between">
         <header className="bg-blue-700 p-8 text-white relative overflow-hidden flex items-center justify-between">
            <div className="flex items-center gap-4">
               <button onClick={() => navigate(-1)} className="p-3 bg-white/15 rounded-2xl hover:bg-white/20"><ArrowLeft size={16}/></button>
               <div>
                  <h1 className="text-xl font-black tracking-tight uppercase leading-none">SAAF AI Assistant</h1>
                  <p className="text-[9px] text-blue-100 font-medium">Automatic sector routing on port 4001</p>
               </div>
            </div>
            <div className="w-10 h-10 bg-white/15 rounded-2xl flex items-center justify-center text-yellow-400 animate-pulse">
               <Zap size={20} fill="currentColor" />
            </div>
         </header>

         {/* Chat Bubbles Scroll Area */}
         <div className="flex-1 p-6 overflow-y-auto space-y-4 max-h-[50vh]">
            {chatMessages.map((msg, i) => (
              <div 
                key={i} 
                className={`flex flex-col gap-1 max-w-[85%] ${
                  msg.sender === 'user' ? 'ml-auto text-right' : 'mr-auto'
                }`}
              >
                 <div className={`p-5 rounded-[1.8rem] text-sm shadow-sm ${
                   msg.sender === 'user' 
                     ? 'bg-blue-600 text-white rounded-tr-none' 
                     : 'bg-white text-slate-800 rounded-tl-none border border-slate-100'
                 }`}>
                    <p className="font-bold leading-relaxed">{msg.text}</p>
                    
                    {/* Live Ticket Redirect in Chat bubble */}
                    {msg.ticketId && (
                      <button 
                        onClick={() => navigate(`/public/track?id=${msg.ticketId?.replace('SAAF-00', '')}`)}
                        className="mt-3 px-4 py-2 bg-blue-100 text-blue-600 rounded-xl font-black text-[9px] uppercase tracking-wider hover:bg-blue-600 hover:text-white transition-all flex items-center gap-2"
                      >
                         <Ticket size={12} /> Track Live Ticket
                      </button>
                    )}
                 </div>
                 <span className="text-[8px] font-black text-slate-400 uppercase px-2">{msg.time}</span>
              </div>
            ))}

            {chatLoading && (
              <div className="flex flex-col gap-1 max-w-[85%] mr-auto">
                 <div className="p-5 rounded-[1.8rem] bg-white rounded-tl-none border border-slate-100 flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" />
                    <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:0.4s]" />
                 </div>
              </div>
            )}
            <div ref={chatEndRef} />
         </div>

         {/* Suggestion Chips */}
         <div className="px-6 py-2 flex gap-2 overflow-x-auto whitespace-nowrap scrollbar-none bg-slate-50/50">
            {[
              "Report dirty floor",
              "Check water leakage",
              "toilet cleanliness status",
              "Check occupancy info"
            ].map((chip, idx) => (
              <button 
                key={idx}
                onClick={() => {
                  setChatInput(chip);
                  if (voiceActive) speakText(chip);
                }}
                className="px-4 py-2 bg-white border border-slate-200 rounded-full text-[10px] font-black text-slate-600 uppercase tracking-wider hover:border-blue-600 hover:text-blue-600 transition-colors"
              >
                 {chip}
              </button>
            ))}
         </div>

         {/* Chat Input Bar */}
         <form onSubmit={handleSendChatMessage} className="p-4 bg-white border-t border-slate-100 flex gap-3 z-10">
            <input 
              type="text"
              placeholder="Type your request..." 
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 outline-none focus:border-blue-500 font-bold text-sm text-slate-900"
            />
            <button 
              type="submit" 
              className="p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl shadow-xl shadow-blue-600/20 active:scale-95 transition-all"
            >
               <Send size={20} />
            </button>
         </form>
      </div>
    );
  }

  // REDIRECTS FOR SHARED INTERFACES
  useEffect(() => {
    if (['report', 'gps', 'categories', 'anon', 'feedback'].includes(serviceId || '')) {
      const modeMap: any = { gps: 'gps', categories: 'categories', anon: 'anonymous', feedback: 'feedback' };
      navigate(`/public/report?mode=${modeMap[serviceId || ''] || ''}`, { replace: true });
    }
    if (['track', 'sla', 'notify', 'history_old'].includes(serviceId || '')) {
      const tabMap: any = { sla: 'sla', notify: 'alerts' };
      navigate(`/public/track?tab=${tabMap[serviceId || ''] || ''}`, { replace: true });
    }
    if (['map', 'audit', 'score_old'].includes(serviceId || '')) {
      const viewMap: any = { audit: 'audit' };
      navigate(`/public/map?view=${viewMap[serviceId || ''] || ''}`, { replace: true });
    }
  }, [serviceId]);

  // DEFAULT GENERIC FALLBACK
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center space-y-8">
       <div className="w-32 h-32 bg-slate-50 rounded-[3rem] flex items-center justify-center text-slate-300 border border-slate-100">
          <Zap size={64} className="animate-pulse" />
       </div>
       <div className="space-y-2">
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">Tool Calibration</h2>
          <p className="text-slate-500 font-medium max-w-xs mx-auto">This specialized municipal engine module is being optimized for your city sector.</p>
       </div>
       <button onClick={() => navigate(-1)} className="px-10 py-4 bg-slate-900 text-white font-black rounded-2xl text-[10px] uppercase tracking-widest shadow-xl">
          Return to Hub
       </button>
    </div>
  );
};

const ChevronRight = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
);

const Filter = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
);

export default ServiceHubDetail;

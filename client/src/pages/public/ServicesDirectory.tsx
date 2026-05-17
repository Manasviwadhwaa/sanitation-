import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { 
  QrCode, Camera, Search, Ticket, Bell, MapPin, Map as MapIcon, 
  CheckCircle, Images, Trash2, Lock, Languages, History, Clock, 
  AlertTriangle, ShieldCheck, Accessibility, Zap, Activity, 
  Users, BarChart2, Droplets, Users2, Info, ChevronRight, Sparkles
} from 'lucide-react';
import { useLiveData } from '../../context/LiveDataContext';

const ServicesDirectory: React.FC = () => {
  const navigate = useNavigate();
  const { facilities } = useLiveData();

  const sections = [
    {
      title: 'Primary Access',
      subtitle: 'Entry points to the municipal engine',
      services: [
        { id: 'qr', title: 'QR Scan Access', desc: 'Scan facility QR boards for instant reporting.', icon: QrCode, path: '/public/scan', size: 'large', color: 'bg-blue-600' },
        { id: 'report', title: 'Quick Reporting', desc: '30-second reporting with AI detection.', icon: Camera, path: '/public/report', size: 'large', color: 'bg-slate-900' },
      ]
    },
    {
      title: 'Reporting Tools',
      subtitle: 'Precise issue communication',
      services: [
        { id: 'urgent', title: 'Emergency Tagging', desc: 'Flag life-safety or biohazard risks.', icon: AlertTriangle, path: '/public/report?priority=HIGH', variant: 'emergency' },
        { id: 'gps', title: 'GPS Reporting', desc: 'Auto-pinpoint location for fast response.', icon: MapPin, path: '/public/report?mode=gps' },
        { id: 'categories', title: 'Issue Categories', desc: 'Categorized sanitation and safety types.', icon: Trash2, path: '/public/report?mode=categories' },
        { id: 'anon', title: 'Anonymous Hub', desc: 'Submit complaints without identity reveal.', icon: Lock, path: '/public/report?mode=anonymous' },
      ]
    },
    {
      title: 'Real-time Tracking',
      subtitle: 'Monitor progress and telemetry',
      services: [
        { id: 'track', title: 'Live Tracking', desc: 'Real-time telemetry from submission to finish.', icon: Activity, path: '/public/track' },
        { id: 'receipt', title: 'Digital Receipts', desc: 'Secure Ticket IDs and PDF proofs.', icon: Ticket, path: '/public/track?tab=receipts' },
        { id: 'notify', title: 'Real-time Alerts', desc: 'Instant push updates and SMS notices.', icon: Bell, path: '/public/track?tab=alerts' },
        { id: 'history', title: 'Request History', desc: 'Review your complete service archive.', icon: History, path: '/public/track?tab=history' },
        { id: 'sla', title: 'Estimated Time', desc: 'SLA predictions and queue tracking.', icon: Clock, path: '/public/track?tab=sla' },
      ]
    },
    {
      title: 'Transparency & Data',
      subtitle: 'Live municipal intelligence',
      services: [
        { id: 'score', title: 'Cleanliness Score', desc: 'Real-time hygiene ranking of all nodes.', icon: Sparkles, path: '/public/map', variant: 'featured' },
        { id: 'map', title: 'Nearby Grid Map', desc: 'Explore nearby sanitation zones & status.', icon: MapIcon, path: '/public/map' },
        { id: 'audit', title: 'Facility Audit', desc: 'Review maintenance & inspection logs.', icon: ShieldCheck, path: '/public/map?view=audit' },
        { id: 'evidence', title: 'Photo Proofs', desc: 'View verified before/after evidence.', icon: Images, path: '/public/track?tab=evidence' },
        { id: 'feedback', title: 'Post-Work Review', desc: 'Rate maintenance quality after resolution.', icon: CheckCircle, path: '/public/report?mode=feedback' },
      ]
    },
    {
      title: 'Advanced Features',
      subtitle: 'Smart city utility modules',
      services: [
        { id: 'staff', title: 'Staff Availability', desc: 'Live view of active maintenance teams.', icon: Users, path: '#', variant: 'soon' },
        { id: 'analytics', title: 'Smart Analytics', desc: 'Trending problems in your city zone.', icon: BarChart2, path: '#', variant: 'soon' },
        { id: 'community', title: 'Community Vote', desc: 'Upvote existing reports to reduce noise.', icon: Users2, path: '#', variant: 'soon' },
        { id: 'water', title: 'Water Monitor', desc: 'Live tracking of facility water usage.', icon: Droplets, path: '#', variant: 'soon' },
      ]
    },
    {
      title: 'Accessibility & Support',
      subtitle: 'Inclusive municipal services',
      services: [
        { id: 'access', title: 'Accessibility UI', desc: 'Voice, contrast, and large text tools.', icon: Accessibility, path: '#', variant: 'utility' },
        { id: 'lang', title: 'Multi-Language', desc: 'Platform support in regional languages.', icon: Languages, path: '#', variant: 'utility' },
        { id: 'self', title: '24/7 Self-Service', desc: 'AI-driven routing and automated support.', icon: Zap, path: '/public', variant: 'utility' },
      ]
    }
  ];

  return (
    <div className="space-y-16">
      {sections.map((section, idx) => (
        <section key={idx} className="space-y-8">
           <div className="px-2">
              <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">{section.title}</h2>
              <p className="text-sm text-slate-500 font-medium">{section.subtitle}</p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {section.services.map((s, i) => (
                <motion.div
                  key={s.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={s.size === 'large' ? 'md:col-span-2' : ''}
                >
                <Link
                  to={s.path === '#' ? '/public/services' : `/public/service-hub?id=${s.id}`}
                  className={`group relative overflow-hidden rounded-[2.5rem] p-8 border transition-all h-full flex flex-col justify-between ${
                    s.variant === 'emergency' ? 'bg-red-600 border-red-500 text-white shadow-xl shadow-red-600/20' :
                    s.variant === 'featured' ? 'bg-blue-600 border-blue-500 text-white shadow-xl shadow-blue-600/20' :
                    s.size === 'large' ? `${s.color} text-white shadow-2xl` :
                    'bg-white border-slate-100 hover:border-blue-500 hover:shadow-xl'
                  }`}
                >
                    <div className="space-y-6">
                       <div className="flex justify-between items-start">
                          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
                            s.variant === 'emergency' || s.variant === 'featured' || s.size === 'large' ? 'bg-white/10 text-white' : 'bg-slate-50 text-slate-400 group-hover:bg-blue-600 group-hover:text-white shadow-inner'
                          }`}>
                             <s.icon size={28} />
                          </div>
                          {s.variant === 'soon' && <span className="text-[8px] font-black uppercase tracking-widest bg-slate-900 text-white px-2 py-1 rounded">Beta</span>}
                          {s.variant === 'emergency' && <span className="text-[10px] font-black uppercase tracking-widest bg-white/20 px-2 py-1 rounded animate-pulse">Critical</span>}
                       </div>
                       
                       <div className="space-y-2">
                          <h3 className={`text-xl font-black tracking-tight ${s.variant === 'emergency' || s.variant === 'featured' || s.size === 'large' ? 'text-white' : 'text-slate-900'}`}>
                            {s.title}
                          </h3>
                          <p className={`text-sm font-medium leading-relaxed ${s.variant === 'emergency' || s.variant === 'featured' || s.size === 'large' ? 'text-white/70' : 'text-slate-500'}`}>
                            {s.desc}
                          </p>
                       </div>
                    </div>

                    <div className={`mt-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all ${
                      s.variant === 'emergency' || s.variant === 'featured' || s.size === 'large' ? 'text-white' : 'text-blue-600'
                    }`}>
                       Launch Service Module <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </div>

                    {/* Accents */}
                    <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/5 rounded-full blur-3xl" />
                  </Link>
                </motion.div>
              ))}
           </div>
        </section>
      ))}

      {/* Facility Quick List Section */}
      <section className="space-y-8 pt-12 border-t border-slate-100">
         <div className="px-2">
            <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">Live Facility Index</h2>
            <p className="text-sm text-slate-500 font-medium">Verified sanitation nodes with real-time health scoring.</p>
         </div>
         <div className="grid grid-cols-1 gap-4">
            {facilities.map(f => (
               <div key={f.id} className="bg-white border border-slate-100 p-6 rounded-[2rem] flex items-center justify-between group hover:border-blue-500 transition-all">
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                        <MapPin size={20} />
                     </div>
                     <div>
                        <h4 className="text-sm font-black text-slate-900">{f.name}</h4>
                        <div className="flex items-center gap-2">
                           <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                           <span className="text-[10px] font-bold text-slate-400 uppercase">Score: 98% • Active</span>
                        </div>
                     </div>
                  </div>
                  <Link to={`/public/report?facilityId=${f.id}`} className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-blue-600 hover:text-white transition-all">
                     <ChevronRight size={18} />
                  </Link>
               </div>
            ))}
         </div>
      </section>
    </div>
  );
};

export default ServicesDirectory;

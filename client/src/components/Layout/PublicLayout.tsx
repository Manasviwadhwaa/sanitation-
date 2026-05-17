import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  Home, 
  PlusCircle, 
  Search, 
  History, 
  HelpCircle, 
  ArrowLeft, 
  User, 
  Bell,
  Activity,
  X,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PublicLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);

  const navItems = [
    { icon: Home, label: 'Home', path: '/public' },
    { icon: PlusCircle, label: 'Report', path: '/public/report' },
    { icon: Search, label: 'Track', path: '/public/track' },
    { icon: History, label: 'History', path: '/public/track?tab=history' },
    { icon: HelpCircle, label: 'Help', path: '/public/services' }
  ];

  const notifications = [
    { id: 1, title: 'Request Completed', desc: 'SBM Toilet - ISBT Flyover cleaning verified.', type: 'success', time: '2m ago' },
    { id: 2, title: 'Crew Dispatched', desc: 'Emergency team is on the way to Old Cantt.', type: 'info', time: '15m ago' },
    { id: 3, title: 'System Alert', desc: 'New smart sensors active in Sector 4.', type: 'alert', time: '1h ago' }
  ];

  const getPageTitle = () => {
    if (location.pathname === '/public') return 'SAAF Citizen Portal';
    if (location.pathname.includes('report')) return 'Report Hub';
    if (location.pathname.includes('track')) return 'Progress Hub';
    if (location.pathname.includes('map')) return 'City Grid Map';
    if (location.pathname.includes('services')) return 'Service Directory';
    if (location.pathname.includes('scan')) return 'QR Scanner';
    if (location.pathname.includes('service-hub')) return 'Service Module';
    return 'Citizen Portal';
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col pb-24">
      {/* 1. TOP NAVIGATION BAR */}
      <header className="sticky top-0 z-[100] bg-white/80 backdrop-blur-xl border-b border-slate-100 px-6 py-4">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            {location.pathname !== '/public' && (
              <button 
                onClick={() => navigate(-1)} 
                className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-slate-400 hover:text-blue-600 transition-all"
              >
                <ArrowLeft size={18} />
              </button>
            )}
            <div>
              <h1 className="text-lg font-black text-slate-900 tracking-tight">{getPageTitle()}</h1>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Engine Online</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 relative">
             <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className={`p-2.5 rounded-xl transition-all relative ${showNotifications ? 'bg-blue-600 text-white' : 'bg-slate-50 border border-slate-100 text-slate-400 hover:text-blue-600'}`}
             >
                <Bell size={18} />
                {!showNotifications && <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />}
             </button>
             <button 
              onClick={() => navigate('/login')}
              className="p-2.5 bg-slate-900 rounded-xl text-white shadow-lg shadow-slate-900/10 hover:bg-blue-600 transition-colors"
             >
                <User size={18} />
             </button>

             {/* Notifications Dropdown */}
             <AnimatePresence>
               {showNotifications && (
                 <motion.div 
                   initial={{ opacity: 0, y: 10, scale: 0.95 }}
                   animate={{ opacity: 1, y: 0, scale: 1 }}
                   exit={{ opacity: 0, y: 10, scale: 0.95 }}
                   className="absolute top-14 right-0 w-80 bg-white border border-slate-100 rounded-[2rem] shadow-2xl z-[1000] overflow-hidden"
                 >
                    <div className="p-6 bg-slate-900 text-white flex justify-between items-center">
                       <h4 className="font-black uppercase tracking-widest text-xs">Live Engine Alerts</h4>
                       <button onClick={() => setShowNotifications(false)}><X size={16}/></button>
                    </div>
                    <div className="p-2">
                       {notifications.map(n => (
                         <div key={n.id} className="p-4 rounded-2xl hover:bg-slate-50 transition-all flex gap-4 border border-transparent hover:border-slate-100">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                              n.type === 'success' ? 'bg-emerald-50 text-emerald-500' : 
                              n.type === 'info' ? 'bg-blue-50 text-blue-500' : 'bg-amber-50 text-amber-500'
                            }`}>
                               {n.type === 'success' ? <CheckCircle size={18}/> : 
                                n.type === 'info' ? <Activity size={18}/> : <AlertTriangle size={18}/>}
                            </div>
                            <div className="space-y-1">
                               <p className="text-sm font-black text-slate-900 leading-tight">{n.title}</p>
                               <p className="text-[10px] font-medium text-slate-500 leading-relaxed">{n.desc}</p>
                               <p className="text-[8px] font-black text-slate-300 uppercase">{n.time}</p>
                            </div>
                         </div>
                       ))}
                    </div>
                    <button className="w-full py-4 bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-blue-600 transition-all">Clear All Notices</button>
                 </motion.div>
               )}
             </AnimatePresence>
          </div>
        </div>
      </header>

      {/* 2. MAIN CONTENT AREA */}
      <main className="flex-1 w-full max-w-xl mx-auto p-6">
        <Outlet />
      </main>

      {/* 3. BOTTOM NAVIGATION BAR */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-2xl border-t border-slate-100 px-6 py-4 pb-8 z-[100]">
        <div className="max-w-xl mx-auto flex items-center justify-between">
           {navItems.map((item) => {
             const [itemPath, itemQuery] = item.path.split('?');
             const [currentPath, currentQuery] = (location.pathname + location.search).split('?');
             
             const isActive = itemQuery 
               ? (currentPath === itemPath && currentQuery?.includes(itemQuery))
               : (currentPath === itemPath && !currentQuery);

             return (
               <Link 
                 key={item.label}
                 to={item.path}
                 className="flex flex-col items-center gap-1.5 group outline-none"
               >
                  <div className={`p-3 rounded-2xl transition-all duration-300 relative ${
                    isActive ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' : 'text-slate-400 hover:bg-slate-50'
                  }`}>
                     <item.icon size={22} />
                     {isActive && (
                       <motion.div 
                         layoutId="nav-pill"
                         className="absolute inset-0 bg-blue-600 rounded-2xl -z-10"
                         transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                       />
                     )}
                  </div>
                  <span className={`text-[9px] font-black uppercase tracking-widest transition-colors ${
                    isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'
                  }`}>
                    {item.label}
                  </span>
               </Link>
             );
           })}
        </div>
      </nav>
    </div>
  );
};

export default PublicLayout;

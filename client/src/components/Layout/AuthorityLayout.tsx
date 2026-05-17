import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ListFilter, 
  BarChart3, 
  Users2, 
  ShieldAlert, 
  FileText, 
  Settings, 
  LogOut,
  Search,
  Bell,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AuthorityLayout: React.FC = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const navItems = [
    { label: 'Control Center', icon: LayoutDashboard, path: '/authority' },
    { label: 'Case Management', icon: ListFilter, path: '/authority/cases' },
    { label: 'Resource Trends', icon: BarChart3, path: '/authority/analytics' },
    { label: 'Staff Activity', icon: Users2, path: '/authority/staff' },
    { label: 'Audit Logs', icon: FileText, path: '/authority/audit' },
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-[#f8fafc] font-sans flex">
      {/* Authority Sidebar: Wide & Detailed */}
      <aside className={`fixed inset-y-0 left-0 z-50 bg-[#020617] border-r border-white/5 transition-all duration-300 ${isSidebarOpen ? 'w-72' : 'w-20'}`}>
        <div className="flex flex-col h-full">
          <div className="p-8 border-b border-white/5 flex items-center justify-between">
            <div className={`flex items-center gap-4 ${!isSidebarOpen && 'hidden'}`}>
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-black text-white shadow-2xl">A</div>
              <div>
                <h2 className="text-lg font-black tracking-tighter leading-tight text-white">SAAF Command</h2>
                <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Authority Core</p>
              </div>
            </div>
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-slate-500 hover:text-white transition-colors">
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          <nav className="flex-1 p-6 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all group ${
                  location.pathname === item.path 
                    ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' 
                    : 'text-slate-500 hover:text-white hover:bg-white/5'
                }`}
              >
                <item.icon size={22} className={location.pathname === item.path ? 'text-white' : 'text-slate-500 group-hover:text-blue-400 transition-colors'} />
                {isSidebarOpen && <span className="text-[11px] font-bold uppercase tracking-[0.15em]">{item.label}</span>}
              </Link>
            ))}
          </nav>

          <div className="p-8 border-t border-white/5">
            <div className={`flex items-center gap-4 mb-8 ${!isSidebarOpen && 'hidden'}`}>
               <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center font-bold text-sm">
                  {user?.name.charAt(0)}
               </div>
               <div>
                  <p className="text-xs font-bold text-white">{user?.name}</p>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{user?.role}</p>
               </div>
            </div>
            <button onClick={logout} className="w-full flex items-center gap-4 p-4 text-slate-500 hover:text-red-500 hover:bg-red-500/5 rounded-xl transition-all group">
              <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
              {isSidebarOpen && <span className="text-[11px] font-bold uppercase tracking-widest">Terminate Session</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Analytical Surface */}
      <div className={`flex-1 flex flex-col min-h-screen transition-all ${isSidebarOpen ? 'ml-72' : 'ml-20'}`}>
        <header className="h-20 px-12 border-b border-white/5 flex items-center justify-between sticky top-0 z-40 bg-[#020617]/80 backdrop-blur-xl">
           <div className="flex items-center gap-6 flex-1 max-w-2xl">
              <div className="relative w-full group">
                 <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                 <input 
                   type="text" 
                   placeholder="Search case ID, worker, or ward..." 
                   className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-6 text-xs text-white outline-none focus:border-blue-500/50 transition-all font-medium"
                 />
              </div>
           </div>

           <div className="flex items-center gap-8">
              <div className="flex items-center gap-3 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                 <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest leading-none">Governance Engine Active</span>
              </div>
              <button className="relative text-slate-500 hover:text-white transition-colors">
                 <Bell size={22} />
                 <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-600 rounded-full border-2 border-[#020617]"></span>
              </button>
              <button className="text-slate-500 hover:text-white transition-colors">
                 <ShieldAlert size={22} />
              </button>
           </div>
        </header>

        <main className="flex-1 p-12 overflow-x-hidden">
          <div className="max-w-[1600px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AuthorityLayout;

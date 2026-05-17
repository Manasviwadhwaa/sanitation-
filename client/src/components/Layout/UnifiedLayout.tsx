import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutGrid, 
  BarChart2, 
  Users, 
  LogOut, 
  Bell, 
  Menu, 
  X, 
  ShieldCheck,
  Search,
  Globe,
  Settings2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const UnifiedLayout: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const isStaff = user && ['SuperAdmin', 'Finance', 'Supervisor', 'Worker', 'WardAuthority'].includes(user.role);

  const menuItems = [
    { label: 'Dashboard', icon: LayoutGrid, path: '/dashboard', show: true },
    { label: 'Analytics', icon: BarChart2, path: '/dashboard/analytics', show: true },
    { label: 'Finances', icon: Globe, path: '/dashboard/budget', show: true },
    { label: 'Inspections', icon: ShieldCheck, path: '/dashboard/inspector', show: ['SuperAdmin', 'Supervisor', 'WardAuthority'].includes(user?.role || '') },
    { label: 'Staff Portal', icon: Users, path: '/dashboard/cleaner', show: user?.role === 'Worker' },
  ].filter(item => item.show);

  return (
    <div className="flex min-h-screen bg-[#0a0a0a] text-[#ededed] font-sans">
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0f0f0f] border-r border-[#1f1f1f] transition-all duration-300 lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-[#1f1f1f]">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center font-bold text-xs text-white">S</div>
              <span className="text-sm font-bold tracking-tight text-white">SAAF Smart City</span>
            </Link>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-md transition-all text-sm font-medium ${
                  location.pathname === item.path 
                    ? 'bg-[#1f1f1f] text-white shadow-sm' 
                    : 'text-[#888] hover:text-white hover:bg-[#161616]'
                }`}
              >
                <item.icon size={16} />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t border-[#1f1f1f] space-y-4">
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-3 px-3 py-2">
                  <div className="w-8 h-8 rounded-full bg-[#1f1f1f] flex items-center justify-center text-xs font-medium border border-[#2f2f2f]">
                    {user?.name.charAt(0)}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-xs font-semibold truncate text-white">{user?.name}</p>
                    <p className="text-[10px] text-blue-500 uppercase font-bold tracking-tight">{user?.role}</p>
                  </div>
                </div>
                <button 
                  onClick={() => { logout(); navigate('/'); }}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-xs font-medium text-[#888] hover:text-red-400 hover:bg-red-900/10 transition-all"
                >
                  <LogOut size={14} /> 
                  Sign Out
                </button>
              </>
            ) : (
              <Link 
                to="/login"
                className="w-full flex items-center justify-center py-2 bg-white text-black rounded-md text-xs font-bold hover:bg-[#ccc] transition-all"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </aside>

      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        <header className="h-14 px-6 flex items-center justify-between sticky top-0 z-40 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-[#1f1f1f]">
          <div className="flex items-center gap-4 flex-1">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="lg:hidden text-[#888] hover:text-white">
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="relative max-w-sm w-full hidden md:block">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555]" />
              <input 
                type="text" 
                placeholder="Find facility or data point..."
                className="w-full bg-[#0f0f0f] border border-[#1f1f1f] rounded-md py-1.5 pl-9 pr-4 text-xs outline-none focus:border-blue-500/50 transition-all text-white"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2">
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
               <span className="text-[10px] font-bold text-[#888] uppercase tracking-tight">System Online</span>
            </div>
            <div className="h-4 w-[1px] bg-[#1f1f1f]"></div>
            <button className="p-2 text-[#888] hover:text-white transition-colors relative">
              <Bell size={18} />
              <span className="absolute top-2 right-2 w-1 h-1 bg-blue-500 rounded-full"></span>
            </button>
            <button className="p-2 text-[#888] hover:text-white transition-colors">
              <Settings2 size={18} />
            </button>
          </div>
        </header>

        <main className="p-8 md:p-12">
          <div className="max-w-6xl mx-auto">
             <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default UnifiedLayout;

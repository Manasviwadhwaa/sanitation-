import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Map as MapIcon, 
  ClipboardList, 
  TrendingUp, 
  Settings,
  Shield,
  CreditCard,
  Heart,
  LogOut,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Infrastructure', path: '/', icon: MapIcon },
    { name: 'Field Audits', path: '/inspector', icon: ClipboardList },
    { name: 'Analytics', path: '/analytics', icon: TrendingUp },
    { name: 'Budget Control', path: '/budget', icon: CreditCard },
    { name: 'Staff Welfare', path: '/welfare', icon: Heart },
    { name: 'System Settings', path: '/settings', icon: Settings },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-[280px] h-screen fixed left-0 top-0 bg-[#0f172a] border-r border-white/5 p-6 z-50">
      {/* Brand */}
      <div className="flex items-center gap-3 px-2 mb-10">
        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">S</div>
        <span className="text-xl font-bold tracking-tight">SAAF OS</span>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 space-y-1">
        {navigation.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => 
              `flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                isActive ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            <div className="flex items-center gap-3">
              <item.icon size={20} />
              <span className="text-sm font-medium">{item.name}</span>
            </div>
            {location.pathname === item.path && <ChevronRight size={14} />}
          </NavLink>
        ))}
      </nav>

      {/* Profile & Logout */}
      <div className="mt-auto pt-6 border-t border-white/5">
        <div className="flex items-center gap-3 px-2 mb-6">
          <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-sm font-bold">
            {user?.name?.[0] || 'A'}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">{user?.name || 'Administrator'}</span>
            <span className="text-xs text-slate-500">{user?.role || 'Staff'}</span>
          </div>
        </div>
        <button 
          onClick={() => logout()}
          className="flex items-center gap-3 w-full px-4 py-3 text-slate-400 hover:text-red-400 transition-colors"
        >
          <LogOut size={20} />
          <span className="text-sm font-medium">Log out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

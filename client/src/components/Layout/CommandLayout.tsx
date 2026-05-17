import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Search, Bell, Menu } from 'lucide-react';

const CommandLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-[#0f172a] text-white">
      <Sidebar />
      
      <div className="flex-1 lg:ml-[280px] flex flex-col min-h-screen">
        {/* Header / Navbar */}
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-[#0f172a]/80 backdrop-blur-md sticky top-0 z-40">
          <div className="flex items-center gap-4 flex-1">
            <Menu size={20} className="lg:hidden text-slate-400" />
            <div className="relative max-w-md w-full">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input 
                type="text" 
                placeholder="Search infrastructure..." 
                className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-sm outline-none focus:border-blue-500/50 transition-all"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <button className="relative text-slate-400 hover:text-white transition-colors">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-600 rounded-full border-2 border-[#0f172a]"></span>
            </button>
            <div className="h-8 w-[1px] bg-white/5"></div>
            <div className="text-xs font-semibold text-blue-500 bg-blue-500/10 px-3 py-1 rounded-full uppercase tracking-wider">
              Live Grid
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default CommandLayout;

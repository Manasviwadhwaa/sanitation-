import React from 'react';
import { Search, Bell, User, Map, Activity } from 'lucide-react';
import { useSearch } from '../../context/SearchContext';

const Navbar: React.FC = () => {
  const { searchQuery, setSearchQuery } = useSearch();

  return (
    <header className="hidden lg:flex justify-between items-center px-12 h-20 fixed top-0 right-0 left-[320px] bg-premium-bg/80 backdrop-blur-2xl border-b border-white/5 z-40">
      <div className="flex items-center gap-12 flex-1">
        <div className="relative flex items-center group max-w-md w-full">
          <Search size={18} className="absolute left-5 text-premium-muted group-focus-within:text-premium-accent transition-colors" />
          <input 
            type="text" 
            placeholder="Search municipal infrastructure..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/5 rounded-2xl py-3 pl-14 pr-6 text-sm text-white outline-none focus:border-premium-accent/40 focus:bg-white/[0.08] transition-all placeholder:text-premium-muted/50 font-medium"
          />
        </div>
        
        <nav className="flex gap-10 h-full items-center">
          <a href="#" className="text-[11px] font-black text-white uppercase tracking-[0.3em] relative group">
            Dashboard
            <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-premium-accent scale-x-100 transition-transform" />
          </a>
          <a href="#" className="text-[11px] font-black text-premium-muted hover:text-white transition-all uppercase tracking-[0.3em] group relative">
            Analytics
            <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-premium-accent scale-x-0 group-hover:scale-x-100 transition-transform" />
          </a>
          <a href="#" className="text-[11px] font-black text-premium-muted hover:text-white transition-all uppercase tracking-[0.3em] group relative">
            Nodes
            <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-premium-accent scale-x-0 group-hover:scale-x-100 transition-transform" />
          </a>
        </nav>
      </div>

      <div className="flex items-center gap-8">
        <button className="flex items-center gap-3 px-6 py-2.5 bg-premium-accent text-white rounded-xl font-black text-[11px] uppercase tracking-[0.2em] hover:scale-[0.98] transition-all shadow-2xl shadow-premium-accent/20 border border-white/10 active:scale-95">
          <Map size={16} />
          Live Map
        </button>
        <div className="flex items-center gap-4">
          <button className="p-3 text-premium-muted hover:text-white transition-all relative bg-white/5 rounded-xl border border-white/5 hover:border-white/10">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-premium-bg shadow-[0_0_8px_rgba(239,68,68,0.5)]"></span>
          </button>
          <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-premium-muted hover:text-white transition-all cursor-pointer">
            <User size={20} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

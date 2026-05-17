import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const CitizenLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const navLinks = [
    { label: 'Transparency', path: '/' },
    { label: 'Audits', path: '/budget' },
    { label: 'Analytics', path: '/analytics' }
  ];

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans selection:bg-blue-500/30">
      {/* Simple Header */}
      <nav className="sticky top-0 z-50 bg-[#0f172a]/80 backdrop-blur-md border-b border-white/5 px-6 md:px-10 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-12">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center text-white font-bold text-sm">S</div>
              <span className="text-xl font-bold tracking-tighter text-white">SAAF<span className="text-blue-500">OS</span></span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              {navLinks.map(link => (
                <Link 
                  key={link.path}
                  to={link.path}
                  className={`text-xs font-bold uppercase tracking-widest transition-colors ${
                    location.pathname === link.path ? 'text-white' : 'text-slate-500 hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-6">
            {user ? (
              <div className="flex items-center gap-6">
                 <div className="hidden sm:flex flex-col items-end">
                    <span className="text-xs font-bold text-white">{user.name}</span>
                    <span className="text-[10px] text-slate-500 font-bold uppercase">{user.role}</span>
                 </div>
                 <button 
                   onClick={() => navigate(user.role === 'Citizen' ? '/' : '/admin')}
                   className="bg-white text-black px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-slate-200 transition-colors"
                 >
                   Portal
                 </button>
                 <button onClick={logout} className="text-xs font-bold text-slate-500 hover:text-red-500 transition-colors uppercase tracking-widest">
                   Exit
                 </button>
              </div>
            ) : (
              <Link 
                to="/login"
                className="text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-white transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 md:px-10 pt-10">
        <Outlet />
      </main>

      {/* Simple Footer */}
      <footer className="max-w-7xl mx-auto px-6 md:px-10 py-20 mt-20 border-t border-white/5">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left">
            <h4 className="text-sm font-bold text-white mb-2 uppercase tracking-widest">SAAF Municipal Hub</h4>
            <p className="text-xs text-slate-500">Real-time city infrastructure monitoring and transparency.</p>
          </div>
          <p className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.3em]">
            © 2026 SAAF OS. ALL RIGHTS RESERVED.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default CitizenLayout;

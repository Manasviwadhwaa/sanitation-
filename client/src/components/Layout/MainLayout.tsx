import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#fcf8fa] text-[#1b1b1d] font-sans antialiased flex">
      <Sidebar />
      <div className="flex-1 md:ml-[280px] min-h-screen flex flex-col relative">
        <Navbar />
        <main className="relative z-10 p-8 mt-16">
          <div className="max-w-[1440px] mx-auto">
             <Outlet />
          </div>
        </main>
      </div>
      
      {/* Ambient Background Glows */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[0%] left-[20%] w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[120px]" />
      </div>
    </div>
  );
};

export default MainLayout;

import React from 'react';
import SceneCanvas from '../components/Three/SceneCanvas';
import FacilityGrid from '../components/UI/FacilityGrid';
import Footer from '../components/Layout/Footer';
import InteractiveHero from '../components/Three/ScrollChapters';
import { LiveDataProvider, useLiveData } from '../context/LiveDataContext';
import { motion } from 'framer-motion';

const HomeContent: React.FC = () => {
  const { facilities, isLive, lastUpdated } = useLiveData();

  return (
    <main className="relative w-full bg-atmosBg min-h-screen">
      {/* 3D Background - Pinned background */}
      <div className="fixed inset-0 z-0">
        <SceneCanvas facilities={facilities} />
      </div>

      {/* Real DOM Content */}
      <div className="relative z-10 w-full overflow-x-hidden">
        
        {/* Interactive Hero Surface */}
        <InteractiveHero />

        {/* Feature Depth & Tactical Analysis Section */}
        <div id="impact-analytics" className="px-6 md:px-12 lg:px-24 max-w-[1440px] mx-auto py-20 md:py-32 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ amount: 0.3 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-4 mb-6 md:mb-8">
              <div className="h-[1px] w-12 bg-atmosAccent" />
              <span className="text-atmosAccent text-[8px] md:text-[10px] font-bold uppercase tracking-[0.3em]">Operational Framework</span>
            </div>
            <h2 className="text-4xl md:text-6xl lg:text-8xl font-bold text-atmosText tracking-tighter leading-[0.9] lg:leading-[0.85] mb-8 md:mb-12">
              Beyond <span className="text-atmosAccentSoft">Monitoring.</span><br className="hidden md:block" />
              Total Control.
            </h2>
            <div className="space-y-6 md:space-y-8 text-atmosTextMuted text-base md:text-lg leading-relaxed max-w-xl">
              <p>
                SAFAI isn't just a dashboard; it's a mission-critical operating system for municipal sanitation. We've engineered a closed-loop system where <span className="text-atmosText font-bold">IoT telemetry</span> directly drives <span className="text-atmosText font-bold">Workforce Dispatch</span>.
              </p>
              <p>
                When our neural sensors detect an ammonia spike or a density surge at ISBT, the system doesn't just alert—it deploys. Real-time verification ensures that every rupee of the municipal budget is mapped to a verified sanitation event.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-6 md:gap-8 mt-12 md:mt-16">
              <div>
                <div className="text-2xl md:text-3xl font-bold text-atmosText mb-2">99.8%</div>
                <div className="text-[8px] md:text-[10px] text-atmosTextSubtle font-bold uppercase tracking-widest">Uptime Reliability</div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-bold text-atmosText mb-2">&lt;15m</div>
                <div className="text-[8px] md:text-[10px] text-atmosTextSubtle font-bold uppercase tracking-widest">Avg Response Time</div>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 gap-4 md:gap-6">
             {[
               { title: "Neural Incident Feed", desc: "Every hygiene event is captured, logged, and audited in a real-time tactical stream for admin oversight." },
               { title: "Predictive Staffing", desc: "AI models forecast commuter surges at major transit hubs, allowing for proactive personnel deployment." },
               { title: "Public Trust Portal", desc: "Citizen-facing transparency tools that showcase performance metrics and vendor accountability scores." }
             ].map((f, i) => (
               <motion.div 
                 key={i} 
                 initial={{ opacity: 0, x: 50 }}
                 whileInView={{ opacity: 1, x: 0 }}
                 viewport={{ amount: 0.5 }}
                 transition={{ duration: 0.6, delay: i * 0.1 }}
                 className="p-6 md:p-8 bg-atmosBgAlt/30 border border-white/5 rounded-[2rem] md:rounded-[2.5rem] backdrop-blur-xl hover:bg-atmosBgAlt/50 transition-all group"
               >
                 <div className="text-atmosAccent font-bold text-[10px] md:text-xs mb-2 md:mb-3">0{i+1}</div>
                 <h4 className="text-lg md:text-xl font-bold text-atmosText mb-2 md:mb-3 tracking-tight">{f.title}</h4>
                 <p className="text-atmosTextSubtle text-xs md:text-sm leading-relaxed">{f.desc}</p>
               </motion.div>
             ))}
          </div>
        </div>
        
        {/* Live Facility Pulse Section */}
        <div id="facility-grid" className="px-4 md:px-12 lg:px-24 max-w-[1440px] mx-auto pb-20 md:pb-32 bg-atmosBg/95 backdrop-blur-3xl border-t border-white/5 pt-20 md:pt-32 shadow-[0_-50px_100px_rgba(0,0,0,0.8)]">
          <div className="mb-10 md:mb-12">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-[1px] w-12 bg-atmosAccent" />
              <span className="text-atmosAccent text-[8px] md:text-[10px] font-bold uppercase tracking-[0.3em]">Live Infrastructure</span>
            </div>
            <h2 className="text-3xl md:text-5xl lg:text-7xl font-bold text-atmosText tracking-tighter mb-6 md:mb-8 leading-tight">Facility <span className="text-atmosAccentSoft">Pulse</span></h2>
            
            <div className="flex flex-wrap items-center gap-3 md:gap-4">
              {facilities.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="inline-flex items-center gap-2 md:gap-3 px-3 md:px-4 py-1.5 bg-atmosAccent/10 border border-atmosAccent/20 rounded-full"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-atmosAccent animate-pulse" />
                  <span className="text-[8px] md:text-[9px] text-atmosAccent font-bold uppercase tracking-widest truncate max-w-[200px] sm:max-w-none">
                    Neural Pick: {facilities.sort((a,b) => (b.health?.ammonia || 0) - (a.health?.ammonia || 0))[0]?.name} is Optimal
                  </span>
                </motion.div>
              )}
              
              <div className="inline-flex items-center gap-2 md:gap-3 px-3 md:px-4 py-1.5 bg-white/5 border border-white/10 rounded-full">
                <div className={`w-1 h-1 md:w-1.5 md:h-1.5 rounded-full ${isLive ? 'bg-atmosSuccess shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-red-500'} `} />
                <span className="text-[8px] md:text-[9px] text-atmosTextMuted font-bold uppercase tracking-widest">
                  {isLive ? 'Link Active' : 'Neural Dropout'}
                </span>
              </div>
            </div>
          </div>

          <FacilityGrid facilities={facilities} />
          
          {/* Recent System Alerts Strip */}
          <div id="admin-alerts" className="mt-20 md:mt-32 p-6 md:p-12 bg-atmosBgAlt/30 border border-white/5 rounded-[2rem] md:rounded-[3rem] backdrop-blur-xl">
             <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl md:text-2xl font-bold text-atmosText tracking-tight">Operation Log</h3>
                <span className="text-[8px] md:text-[10px] text-atmosAccent font-bold uppercase tracking-widest px-2 md:px-3 py-1 bg-atmosAccent/10 border border-atmosAccent/20 rounded-full">Live Monitor</span>
             </div>
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {facilities.slice(0, 3).map((f, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                     <div className={`w-2 h-2 rounded-full ${f.current_status === 'GREEN' ? 'bg-atmosSuccess' : 'bg-atmosWarning'}`} />
                     <div className="flex-1 min-w-0">
                        <div className="text-[10px] text-atmosText font-bold uppercase truncate">{f.name}</div>
                        <div className="text-[8px] text-atmosTextSubtle uppercase tracking-wider truncate">{f.current_status} Operations</div>
                     </div>
                     <span className="text-[8px] text-atmosTextMuted font-mono whitespace-nowrap">14:2{i} PM</span>
                  </div>
                ))}
             </div>
          </div>

          <Footer />
        </div>
      </div>

      {/* Global Status Indicator */}
      <div className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 z-[60] flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 bg-atmosBgAlt/80 backdrop-blur-xl border border-white/5 rounded-full pointer-events-none shadow-2xl">
        <div className={`w-1 h-1 md:w-1.5 md:h-1.5 rounded-full ${isLive ? 'bg-atmosSuccess shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-red-500'} `} />
        <span className="text-[8px] md:text-[9px] text-atmosTextMuted font-bold uppercase tracking-[0.2em]">
          {isLive ? `Neural Sync: ${lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : 'Signal Lost'}
        </span>
      </div>
    </main>
  );
};

const Home: React.FC = () => {
  return (
    <LiveDataProvider>
      <HomeContent />
    </LiveDataProvider>
  );
};

export default Home;

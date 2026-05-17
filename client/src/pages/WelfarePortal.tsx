import React from 'react';
import { IndianRupee, TrendingUp, Users, ShieldCheck, HeartPulse, Zap, Globe, Database, ArrowRightCircle } from 'lucide-react';

const WelfarePortal: React.FC = () => {
  const moneyFlow = [
    { from: 'Central Govt', to: 'State Dept', amount: '₹14.5Cr', status: 'RELEASED' },
    { from: 'State Dept', to: 'Nagar Nigam', amount: '₹8.2Cr', status: 'TRANSFERRED' },
    { from: 'Nagar Nigam', to: 'Ward HQ', amount: '₹42L', status: 'ALLOCATED' },
    { from: 'Ward 18', to: 'Staff', amount: '₹12L', status: 'IN_FLOW' },
  ];

  return (
    <div className="space-y-10 pb-20">
      <header>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Staff Welfare & Capital Flow</h1>
        <p className="text-slate-400">Tracking transparency in budget allocation for sanitation services.</p>
      </header>

      {/* Flow Visualization */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {moneyFlow.map((step, i) => (
          <div key={i} className="bg-[#1e293b] border border-white/5 p-6 rounded-xl relative group">
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-4">
               <Globe size={12} className="text-blue-500" />
               {step.from}
            </div>
            <div className="text-3xl font-bold mb-2">{step.amount}</div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{step.status}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Utilization */}
        <div className="bg-[#1e293b] border border-white/5 rounded-2xl p-8">
          <h3 className="text-lg font-bold mb-8 flex items-center gap-2">
            <TrendingUp className="text-blue-400" size={20} />
            Utilization Breakdown
          </h3>
          <div className="space-y-8">
            {[
              { label: 'Staff Salaries', amount: '₹22.40L', pct: 65, color: 'bg-blue-600' },
              { label: 'Sanitation Supplies', amount: '₹5.20L', pct: 15, color: 'bg-emerald-500' },
              { label: 'Maintenance', amount: '₹3.80L', pct: 10, color: 'bg-amber-500' },
              { label: 'Utilities', amount: '₹2.60L', pct: 10, color: 'bg-slate-700' },
            ].map((item, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium">{item.label}</span>
                  <span className="font-bold">{item.amount}</span>
                </div>
                <div className="h-2 bg-[#0f172a] rounded-full overflow-hidden">
                  <div className={`h-full ${item.color}`} style={{ width: `${item.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Impact */}
        <div className="bg-[#1e293b] border border-white/5 rounded-2xl p-8">
          <h3 className="text-lg font-bold mb-8 flex items-center gap-2">
            <HeartPulse className="text-red-500" size={20} />
            Social Impact Metrics
          </h3>
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-[#0f172a] p-6 rounded-xl border border-white/5">
              <div className="text-3xl font-bold mb-1">2,450+</div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Service Instances</div>
            </div>
            <div className="bg-[#0f172a] p-6 rounded-xl border border-white/5">
              <div className="text-3xl font-bold text-emerald-500 mb-1">92%</div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Health Index</div>
            </div>
          </div>
          <div className="mt-8 p-6 bg-blue-600/10 border border-blue-600/20 rounded-xl">
            <div className="flex items-center gap-3 mb-3 text-blue-400">
               <Users size={18} />
               <span className="text-xs font-bold uppercase tracking-wider">Staff Welfare Policy</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Automated PF/ESIC contributions synchronized. direct bank transfers scheduled for the 5th of each month.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelfarePortal;

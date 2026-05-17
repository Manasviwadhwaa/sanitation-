import React, { useState, useEffect } from 'react';
import { Activity, Landmark, Receipt, Filter, ArrowLeft, TrendingUp, Wallet, FileText, PieChart, ShieldCheck, Search } from 'lucide-react';
import { useLiveData } from '../context/LiveDataContext';

const BudgetPortal: React.FC = () => {
  const { budgetSummary, wardPerformance } = useLiveData();

  return (
    <div className="space-y-10 pb-20">
      <header>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Fiscal Audit & Transparency</h1>
        <p className="text-slate-400">Live tracking of municipal expenditure for sanitation projects.</p>
      </header>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#1e293b] border border-white/5 p-8 rounded-2xl">
          <div className="flex items-center gap-3 text-blue-500 mb-4">
             <Landmark size={24} />
             <span className="text-xs font-bold uppercase tracking-wider">Total Disbursed</span>
          </div>
          <div className="text-4xl font-bold">₹{((budgetSummary?.total_spent || 0) / 100000).toFixed(1)}L</div>
          <p className="text-xs text-slate-500 mt-2">Fiscal Year 2024-25</p>
        </div>
        <div className="bg-[#1e293b] border border-white/5 p-8 rounded-2xl">
          <div className="flex items-center gap-3 text-emerald-500 mb-4">
             <Receipt size={24} />
             <span className="text-xs font-bold uppercase tracking-wider">Audit Verified</span>
          </div>
          <div className="text-4xl font-bold">{budgetSummary?.total_tasks || 0}</div>
          <p className="text-xs text-slate-500 mt-2">Successful Operations</p>
        </div>
        <div className="bg-[#1e293b] border border-white/5 p-8 rounded-2xl">
          <div className="flex items-center gap-3 text-purple-500 mb-4">
             <TrendingUp size={24} />
             <span className="text-xs font-bold uppercase tracking-wider">Avg Unit Cost</span>
          </div>
          <div className="text-4xl font-bold">₹{budgetSummary?.avg_cost_per_task?.toFixed(0) || 0}</div>
          <p className="text-xs text-slate-500 mt-2">Operational Efficiency</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Expenditure List */}
        <div className="lg:col-span-2 bg-[#1e293b] border border-white/5 rounded-2xl overflow-hidden">
          <div className="p-8 border-b border-white/5 flex justify-between items-center">
            <h3 className="font-bold flex items-center gap-2">
              <FileText size={18} className="text-blue-400" />
              Recent Disbursements
            </h3>
            <button className="text-xs font-bold text-slate-500 hover:text-white uppercase flex items-center gap-2">
               <Filter size={14} /> Filter
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5 text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-slate-800/30">
                  <th className="px-8 py-4">Transaction ID</th>
                  <th className="px-8 py-4">Beneficiary</th>
                  <th className="px-8 py-4">Amount</th>
                  <th className="px-8 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {[1,2,3,4,5].map((item) => (
                  <tr key={item} className="hover:bg-white/5 transition-colors">
                    <td className="px-8 py-5 text-sm font-mono text-blue-400">#TXN-902{item}</td>
                    <td className="px-8 py-5 text-sm font-medium">Ward {10 + item} Maintenance</td>
                    <td className="px-8 py-5 text-sm font-bold">₹4,250</td>
                    <td className="px-8 py-5">
                      <span className="px-2 py-1 bg-emerald-500/10 text-emerald-500 text-[10px] font-bold rounded uppercase">Verified</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Ward Performance */}
        <div className="bg-[#1e293b] border border-white/5 rounded-2xl p-8">
           <h3 className="font-bold mb-8 flex items-center gap-2">
            <PieChart size={18} className="text-blue-400" />
            Ward Performance Index
          </h3>
          <div className="space-y-6">
            {wardPerformance?.slice(0, 5).map((ward, i) => (
              <div key={i} className="flex flex-col gap-2">
                <div className="flex justify-between text-xs">
                   <span className="font-bold">Ward {ward.ward_number}</span>
                   <span className="text-slate-400">{ward.avg_compliance}% Compliance</span>
                </div>
                <div className="h-1.5 bg-[#0f172a] rounded-full overflow-hidden">
                   <div className="h-full bg-blue-600" style={{ width: `${ward.avg_compliance}%` }} />
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-10 py-4 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-bold uppercase transition-colors">
             View Full Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default BudgetPortal;

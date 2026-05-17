import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus,
  Filter,
  ArrowUpRight,
  ChevronRight,
  MoreHorizontal
} from 'lucide-react';
import { useLiveData } from '../context/LiveDataContext';
import SimpleFacilityCard from '../components/UI/SimpleFacilityCard';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { facilities, globalStats } = useLiveData();

  const metrics = [
    { label: 'Network Health', value: '98.2%', change: '+0.4%', color: 'text-emerald-500' },
    { label: 'Active Alerts', value: globalStats?.open_alerts || 0, change: '-2', color: 'text-amber-500' },
    { label: 'Daily Users', value: globalStats?.total_users_last_24h || 0, change: '+12%', color: 'text-blue-500' },
    { label: 'Budget Usage', value: '₹12.4L', change: 'On Track', color: 'text-[#888]' },
  ];

  return (
    <div className="space-y-12">
      {/* Page Heading */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Municipal Overview</h1>
          <p className="text-sm text-[#888] mt-1">Live status of {facilities.length} active facilities across the city.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-[#1f1f1f] rounded-md text-xs font-medium text-[#888] hover:text-white hover:bg-[#161616] transition-all">
            <Filter size={14} /> 
            Filters
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 rounded-md text-xs font-bold text-white hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/10">
            <Plus size={14} />
            Add Facility
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((stat, i) => (
          <div key={i} className="bg-[#0f0f0f] border border-[#1f1f1f] p-6 rounded-xl space-y-2 group hover:border-[#2f2f2f] transition-all">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-[#555] uppercase tracking-wider">{stat.label}</span>
              <div className={`text-[10px] font-bold flex items-center gap-0.5 ${stat.color}`}>
                <ArrowUpRight size={10} />
                {stat.change}
              </div>
            </div>
            <p className="text-3xl font-bold text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Facility Grid Section */}
      <div className="space-y-8">
        <div className="flex justify-between items-center border-b border-[#1f1f1f] pb-4">
           <h2 className="text-sm font-bold text-white uppercase tracking-wider">Active Facilities</h2>
           <button className="text-[10px] font-bold text-blue-500 hover:underline uppercase tracking-tight">Manage All</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {facilities.map(facility => (
            <SimpleFacilityCard 
              key={facility.id} 
              facility={facility} 
              onClick={() => navigate(`/dashboard/facility/${facility.id}`)}
            />
          ))}
        </div>
      </div>

      {/* Recent Activity Log: Compact and User-Friendly */}
      <div className="bg-[#0f0f0f] border border-[#1f1f1f] rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-[#1f1f1f] flex justify-between items-center">
          <h3 className="text-xs font-bold text-white uppercase tracking-widest">Recent Activity</h3>
          <MoreHorizontal size={14} className="text-[#555]" />
        </div>
        <div className="divide-y divide-[#1f1f1f]">
          {[
            { area: 'Node A-12', event: 'Odor levels normalized', time: '2m ago' },
            { area: 'Clock Tower', event: 'New audit report submitted', time: '15m ago' },
            { area: 'Market Sector', event: 'System maintenance scheduled', time: '1h ago' },
          ].map((log, i) => (
            <div key={i} className="px-6 py-4 flex justify-between items-center hover:bg-[#161616] transition-all group cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                <span className="text-sm text-[#ededed] font-medium group-hover:text-white transition-colors">{log.area}</span>
              </div>
              <div className="flex items-center gap-8">
                <span className="text-xs text-[#888]">{log.event}</span>
                <span className="text-xs text-[#555] font-medium">{log.time}</span>
                <ChevronRight size={14} className="text-[#333] group-hover:text-[#555]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;

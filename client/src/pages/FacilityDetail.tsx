import React, { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  MapPin, 
  Shield, 
  CheckCircle, 
  Activity, 
  Thermometer, 
  Wind, 
  Clock, 
  Star,
  Users,
  AlertTriangle
} from 'lucide-react';
import { useLiveData } from '../context/LiveDataContext';

const FacilityDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { facilities } = useLiveData();
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'SENSORS' | 'REVIEWS'>('OVERVIEW');

  const facility = useMemo(() => 
    facilities.find(f => f.id === Number(id)), 
  [facilities, id]);

  if (!facility) return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
       <div className="text-center">
         <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
         <p className="text-slate-400 font-medium">Loading infrastructure node...</p>
       </div>
    </div>
  );

  return (
    <div className="space-y-10 pb-20">
      {/* Navigation & Actions */}
      <div className="flex justify-between items-center">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={18} />
          Back to Overview
        </button>
        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
            facility.current_status === 'GREEN' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
          }`}>
            {facility.current_status} Protocol
          </span>
          <button 
            onClick={() => navigate(`/dashboard/inspector?facilityId=${facility.id}`)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-lg shadow-blue-600/20"
          >
            Request Audit
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-[#1e293b] border border-white/5 rounded-3xl p-10 shadow-2xl">
        <div className="flex flex-col md:flex-row justify-between gap-10">
          <div className="space-y-6">
            <h1 className="text-5xl font-bold tracking-tight">{facility.name}</h1>
            <div className="flex items-center gap-3 text-slate-400">
               <MapPin size={20} className="text-blue-500" />
               <span className="text-xl font-medium">{facility.location}</span>
            </div>
            <div className="flex flex-wrap gap-8 pt-4">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Total Stalls</span>
                <span className="text-2xl font-bold">{facility.total_stalls || 0}</span>
              </div>
              <div className="w-[1px] h-10 bg-white/5 hidden md:block" />
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Current Load</span>
                <span className="text-2xl font-bold">{facility.occupancy || 0} Users</span>
              </div>
              <div className="w-[1px] h-10 bg-white/5 hidden md:block" />
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Wait Time</span>
                <span className="text-2xl font-bold text-blue-400">{facility.wait_time || 0}m</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col gap-4 min-w-[240px]">
            <div className="bg-[#0f172a] p-6 rounded-2xl border border-white/5">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-bold text-slate-500 uppercase">Quality Score</span>
                <Star size={16} className="text-amber-500 fill-amber-500" />
              </div>
              <div className="text-4xl font-bold mb-1">{facility.rating?.toFixed(1) || 'N/A'}</div>
              <div className="flex gap-1">
                {[1,2,3,4,5].map(i => (
                  <div key={i} className={`h-1 flex-1 rounded-full ${i <= (facility.rating || 0) ? 'bg-blue-500' : 'bg-white/5'}`} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/5 gap-8">
        {['OVERVIEW', 'SENSORS', 'REVIEWS'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`pb-4 text-xs font-bold uppercase tracking-widest transition-all relative ${
              activeTab === tab ? 'text-blue-500' : 'text-slate-500 hover:text-white'
            }`}
          >
            {tab}
            {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500" />}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Left Column: Metrics */}
        <div className="lg:col-span-2 space-y-8">
          {activeTab === 'OVERVIEW' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#1e293b] border border-white/5 p-8 rounded-2xl">
                <h3 className="font-bold mb-6 flex items-center gap-2">
                  <Activity size={18} className="text-blue-400" />
                  Live Heartbeat
                </h3>
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-400">Ammonia Level</span>
                    <span className="text-sm font-bold text-emerald-400">{facility.health.ammonia || 0} PPM</span>
                  </div>
                  <div className="h-1.5 bg-[#0f172a] rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500" style={{ width: `${Math.min(100, (facility.health.ammonia || 0) * 2)}%` }} />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-400">Humidity</span>
                    <span className="text-sm font-bold text-blue-400">{facility.health.humidity || 0}%</span>
                  </div>
                  <div className="h-1.5 bg-[#0f172a] rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500" style={{ width: `${facility.health.humidity || 0}%` }} />
                  </div>
                </div>
              </div>

              <div className="bg-[#1e293b] border border-white/5 p-8 rounded-2xl">
                <h3 className="font-bold mb-6 flex items-center gap-2">
                  <Shield size={18} className="text-purple-400" />
                  Entity Profile
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-xs text-slate-500 uppercase font-bold">Contractor</span>
                    <span className="text-sm font-medium">{facility.contractor_name || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-slate-500 uppercase font-bold">Zone</span>
                    <span className="text-sm font-medium">{facility.zone || 'Central'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-slate-500 uppercase font-bold">Schedule</span>
                    <span className="text-sm font-medium">{facility.hours || '24/7'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-slate-500 uppercase font-bold">Last Audit</span>
                    <span className="text-sm font-medium">{facility.last_verified_at || 'Recently'}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'SENSORS' && (
             <div className="bg-[#1e293b] border border-white/5 p-8 rounded-2xl text-center py-20">
                <AlertTriangle size={48} className="text-amber-500 mx-auto mb-6" />
                <h3 className="text-xl font-bold mb-2">Sensor Matrix Detailed View</h3>
                <p className="text-slate-400 max-w-sm mx-auto">This module provides high-resolution telemetry data from individual IoT nodes within the facility.</p>
             </div>
          )}
        </div>

        {/* Right Column: Registry */}
        <div className="space-y-8">
           <div className="bg-blue-600/10 border border-blue-600/20 p-8 rounded-2xl">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <CheckCircle size={18} className="text-blue-500" />
                Certified Integrity
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed mb-6">
                This facility has been certified for hygiene and safety standards by the Municipal Corporation audit team.
              </p>
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">S</div>
                 <div>
                    <div className="text-xs font-bold text-white uppercase tracking-wider">Sanitrax Verified</div>
                    <div className="text-[10px] text-slate-500 font-medium">Digital Signature: #S-90210</div>
                 </div>
              </div>
           </div>

           <div className="bg-[#1e293b] border border-white/5 p-8 rounded-2xl">
              <h3 className="font-bold mb-6 flex items-center gap-2">
                <Users size={18} className="text-slate-400" />
                Recent Activity
              </h3>
              <div className="space-y-6">
                {[
                  { time: '10m ago', msg: 'Cleaning cycle complete', type: 'info' },
                  { time: '2h ago', msg: 'Weekly safety inspection', type: 'audit' },
                  { time: '5h ago', msg: 'Supply replenishment', type: 'info' },
                ].map((log, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-700 mt-1.5" />
                    <div>
                      <p className="text-sm font-medium">{log.msg}</p>
                      <span className="text-[10px] text-slate-500 font-bold uppercase">{log.time}</span>
                    </div>
                  </div>
                ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default FacilityDetail;

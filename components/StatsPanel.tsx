import React from 'react';
import { JobPosting } from '../types';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell, LineChart, Line } from 'recharts';
import { Activity, TrendingUp, Users } from 'lucide-react';

interface StatsPanelProps {
  jobs: JobPosting[];
  className?: string;
}

export const StatsPanel: React.FC<StatsPanelProps> = ({ jobs, className }) => {
  
  // Calculate stats
  const totalJobs = jobs.length;
  const mncCount = jobs.filter(j => j.company.tags.includes('MNC')).length;
  const remoteCount = jobs.filter(j => j.location.type === 'Remote').length;
  
  // Simple data transformation for charts
  const jobsByCity = jobs.reduce((acc, job) => {
    acc[job.location.city] = (acc[job.location.city] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.keys(jobsByCity).slice(0, 5).map(city => ({
    name: city,
    count: jobsByCity[city]
  }));

  // Mock time series data
  const timeData = [
    { time: '10am', value: 12 },
    { time: '11am', value: 19 },
    { time: '12pm', value: 35 },
    { time: '1pm', value: 22 },
    { time: '2pm', value: totalJobs > 40 ? 45 : totalJobs },
  ];

  return (
    <div className={`flex flex-col gap-6 p-4 h-full overflow-y-auto ${className}`}>
      <div className="flex items-center gap-2 text-slate-800 font-bold text-lg mb-2">
        <Activity size={20} />
        <h2>Market Pulse</h2>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
           <div className="text-xs text-slate-500 uppercase font-semibold">Active Jobs</div>
           <div className="text-2xl font-bold text-slate-800 mt-1">{totalJobs}</div>
        </div>
         <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
           <div className="text-xs text-slate-500 uppercase font-semibold">Remote</div>
           <div className="text-2xl font-bold text-emerald-600 mt-1">{remoteCount}</div>
        </div>
      </div>

      {/* Chart 1: Top Locations */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
            <MapPinIcon /> Top Hubs
        </h3>
        <div className="h-32 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="name" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ fontSize: '12px', padding: '4px' }}
                cursor={{fill: '#f1f5f9'}}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === 0 ? '#4f46e5' : '#94a3b8'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 2: Ingestion Rate */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
            <TrendingUp size={14} /> Ingestion Rate
        </h3>
        <div className="h-32 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={timeData}>
              <XAxis dataKey="time" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ fontSize: '12px', padding: '4px' }} />
              <Line type="monotone" dataKey="value" stroke="#0ea5e9" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="p-3 bg-blue-50 rounded text-xs text-blue-700 border border-blue-100">
        <p className="font-semibold mb-1 flex items-center gap-1">
            <Users size={12}/> System Status
        </p>
        <p>Crawlers active on LinkedIn, BdJobs, Greenhouse.</p>
        <p className="mt-1 opacity-75">Next sync in 4s...</p>
      </div>

    </div>
  );
};

const MapPinIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
);
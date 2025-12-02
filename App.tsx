import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { FilterSidebar } from './components/FilterSidebar';
import { StatsPanel } from './components/StatsPanel';
import { JobCard } from './components/JobCard';
import { JobPosting, FilterState } from './types';
import { generateInitialJobs, generateRandomJob } from './services/mockDataService';
import { AlertTriangle } from 'lucide-react';

const INITIAL_JOBS_COUNT = 15;

export default function App() {
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    jobTypes: [],
    tags: [],
    minSalary: 0,
  });
  
  // Initialization
  useEffect(() => {
    setJobs(generateInitialJobs(INITIAL_JOBS_COUNT));
  }, []);

  // Real-time Simulation: Ingest a new job every 4-8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const newJob = generateRandomJob();
      setJobs(prev => [newJob, ...prev].slice(0, 100)); // Keep max 100 in memory for performance
    }, Math.random() * 4000 + 4000);

    return () => clearInterval(interval);
  }, []);

  // Filtering Logic
  const filteredJobs = jobs.filter(job => {
    // 1. Search (Title or Company)
    if (filters.search) {
      const q = filters.search.toLowerCase();
      const match = job.normalized_title.includes(q) || job.company.name.toLowerCase().includes(q);
      if (!match) return false;
    }
    // 2. Job Type
    if (filters.jobTypes.length > 0 && !filters.jobTypes.includes(job.location.type)) {
      return false;
    }
    // 3. Tags
    if (filters.tags.length > 0) {
      const hasTag = filters.tags.some(tag => job.company.tags.includes(tag));
      if (!hasTag) return false;
    }
    // 4. Salary
    if (filters.minSalary > 0) {
      if (job.salary.max < filters.minSalary) return false;
    }

    return true;
  });

  return (
    <div className="h-screen w-full flex flex-col bg-slate-50">
      <Header filters={filters} setFilters={setFilters} />
      
      <div className="flex-1 flex overflow-hidden max-w-[1600px] w-full mx-auto">
        
        {/* Left Rail: Filters (Hidden on Mobile) */}
        <aside className="hidden lg:block w-72 border-r border-slate-200 bg-white z-10">
          <FilterSidebar filters={filters} setFilters={setFilters} />
        </aside>

        {/* Center Rail: Feed */}
        <main className="flex-1 overflow-y-auto relative scroll-smooth p-4 md:p-6">
          <div className="max-w-2xl mx-auto">
            <div className="flex justify-between items-end mb-4">
               <h1 className="text-xl font-bold text-slate-800">
                 Live Feed <span className="text-slate-400 font-normal text-sm ml-2">({filteredJobs.length} active)</span>
               </h1>
               <div className="flex items-center gap-1 text-[10px] text-slate-500 font-mono bg-slate-100 px-2 py-1 rounded">
                 <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                 WEBSOCKET: CONNECTED
               </div>
            </div>

            {filteredJobs.length === 0 ? (
              <div className="text-center py-20 text-slate-400">
                <AlertTriangle className="mx-auto mb-2 opacity-50" size={32}/>
                <p>No jobs match your filters. Wait for live updates...</p>
              </div>
            ) : (
              filteredJobs.map(job => (
                <JobCard key={job.id} job={job} />
              ))
            )}
          </div>
        </main>

        {/* Right Rail: Stats (Hidden on Tablet/Mobile) */}
        <aside className="hidden xl:block w-80 border-l border-slate-200 bg-white z-10">
           <StatsPanel jobs={jobs} />
        </aside>

      </div>
    </div>
  );
}
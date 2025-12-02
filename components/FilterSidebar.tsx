import React from 'react';
import { FilterState, JobType } from '../types';
import { Filter, Building, MapPin, DollarSign, Briefcase } from 'lucide-react';

interface FilterSidebarProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  className?: string;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({ filters, setFilters, className }) => {
  
  const toggleJobType = (type: JobType) => {
    setFilters(prev => {
      const exists = prev.jobTypes.includes(type);
      return {
        ...prev,
        jobTypes: exists 
          ? prev.jobTypes.filter(t => t !== type)
          : [...prev.jobTypes, type]
      };
    });
  };

  const toggleTag = (tag: string) => {
    setFilters(prev => {
      const exists = prev.tags.includes(tag);
      return {
        ...prev,
        tags: exists
          ? prev.tags.filter(t => t !== tag)
          : [...prev.tags, tag]
      };
    });
  };

  return (
    <div className={`flex flex-col gap-6 p-4 h-full overflow-y-auto ${className}`}>
      <div className="flex items-center gap-2 text-slate-800 font-bold text-lg mb-2">
        <Filter size={20} />
        <h2>Filters</h2>
      </div>

      {/* Job Type Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-500 uppercase tracking-wider">
          <Briefcase size={14} />
          <span>Work Type</span>
        </div>
        <div className="space-y-2">
          {Object.values(JobType).map(type => (
            <label key={type} className="flex items-center gap-2 cursor-pointer group">
              <input 
                type="checkbox" 
                checked={filters.jobTypes.includes(type)}
                onChange={() => toggleJobType(type)}
                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm text-slate-700 group-hover:text-indigo-600 transition-colors">{type}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="h-px bg-slate-200"></div>

      {/* Company Tags */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-500 uppercase tracking-wider">
          <Building size={14} />
          <span>Company Class</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {['Unicorn', 'MNC', 'Startup', 'FinTech', 'Govt'].map(tag => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                filters.tags.includes(tag)
                  ? 'bg-indigo-100 border-indigo-200 text-indigo-700 font-medium'
                  : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <div className="h-px bg-slate-200"></div>

      {/* Salary Range */}
      <div className="space-y-3">
         <div className="flex items-center gap-2 text-sm font-semibold text-slate-500 uppercase tracking-wider">
          <DollarSign size={14} />
          <span>Min Salary (BDT)</span>
        </div>
        <input 
          type="range" 
          min="0" 
          max="200000" 
          step="10000" 
          value={filters.minSalary}
          onChange={(e) => setFilters(prev => ({...prev, minSalary: Number(e.target.value)}))}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
        />
        <div className="flex justify-between text-xs text-slate-500 font-mono">
          <span>0</span>
          <span>> ৳{(filters.minSalary / 1000).toFixed(0)}k</span>
          <span>200k+</span>
        </div>
      </div>
    </div>
  );
};
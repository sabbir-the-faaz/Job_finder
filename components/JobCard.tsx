import React, { useState } from 'react';
import { JobPosting, Currency } from '../types';
import { MapPin, Clock, Building2, Banknote, Globe, Sparkles } from 'lucide-react';
import { getJobInsight } from '../services/geminiService';

interface JobCardProps {
  job: JobPosting;
}

export const JobCard: React.FC<JobCardProps> = ({ job }) => {
  const [insight, setInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const formatSalary = (min: number, max: number, currency: string) => {
    if (currency === Currency.BDT) {
      return `৳${(min / 1000).toFixed(0)}k - ${(max / 1000).toFixed(0)}k`;
    }
    return `$${min} - $${max}`;
  };

  const getTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  const handleAIInsight = async () => {
    if (insight) return; // Already loaded
    setLoading(true);
    const result = await getJobInsight(job);
    setInsight(result);
    setLoading(false);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow animate-enter mb-3 relative group">
      {/* "New" Indicator for very fresh jobs */}
      {new Date().getTime() - job.dates.extracted.getTime() < 30000 && (
         <span className="absolute -top-2 -right-2 bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm animate-pulse z-10">
           LIVE
         </span>
      )}

      <div className="flex items-start gap-4">
        {/* Company Logo */}
        <div className="w-12 h-12 rounded bg-slate-100 flex-shrink-0 overflow-hidden border border-slate-100">
           <img src={job.company.logo_url} alt={job.company.name} className="w-full h-full object-cover" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 leading-tight truncate pr-4">
                {job.title}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm font-medium text-slate-700">{job.company.name}</span>
                {job.company.tags.map(tag => (
                  <span 
                    key={tag} 
                    className={`text-[10px] px-1.5 py-0.5 rounded border ${
                      tag === 'Unicorn' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                      tag === 'MNC' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                      tag === 'Startup' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                      'bg-slate-50 text-slate-600 border-slate-200'
                    }`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="text-right flex-shrink-0">
               <div className="text-sm font-bold text-slate-900">
                 {formatSalary(job.salary.min, job.salary.max, job.salary.currency)}
               </div>
               <div className="text-xs text-slate-500 mt-1 flex items-center justify-end gap-1">
                 <Clock size={12} />
                 {getTimeAgo(job.dates.extracted)}
               </div>
            </div>
          </div>

          {/* Metadata Row */}
          <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-slate-500">
             <div className="flex items-center gap-1">
               <MapPin size={12} />
               <span>{job.location.area}, {job.location.city} ({job.location.type})</span>
             </div>
             
             {/* Source Deduplication Visualization */}
             <div className="flex items-center gap-1 pl-2 border-l border-slate-200">
               <Globe size={12} />
               <span className="mr-1">Found on:</span>
               <div className="flex -space-x-1">
                 {job.sources.map((source, idx) => (
                   <div 
                    key={idx} 
                    className="w-4 h-4 rounded-full bg-slate-200 border border-white flex items-center justify-center text-[8px] font-bold text-slate-600 title-provider"
                    title={source.provider}
                   >
                     {source.provider[0]}
                   </div>
                 ))}
               </div>
               <span className="ml-2 text-slate-400">
                 {job.sources.length > 1 ? `+${job.sources.length - 1} duplicates merged` : ''}
               </span>
             </div>
          </div>

          {/* AI Insight Section */}
          <div className="mt-3 pt-3 border-t border-slate-100">
             {!insight ? (
               <button 
                onClick={handleAIInsight}
                disabled={loading}
                className="flex items-center gap-1.5 text-xs text-indigo-600 font-medium hover:text-indigo-800 transition-colors"
               >
                 <Sparkles size={12} />
                 {loading ? 'Analyzing...' : 'Generate AI Insight'}
               </button>
             ) : (
               <div className="bg-indigo-50 p-2 rounded text-xs text-indigo-900 border border-indigo-100">
                 <div className="flex items-center gap-1 mb-1 font-semibold text-indigo-700">
                   <Sparkles size={12} />
                   <span>Gemini Intelligence</span>
                 </div>
                 {insight}
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};
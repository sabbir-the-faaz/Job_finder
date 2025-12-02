import React from 'react';
import { Search, Bell, Menu } from 'lucide-react';
import { FilterState } from '../types';

interface HeaderProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
}

export const Header: React.FC<HeaderProps> = ({ filters, setFilters }) => {
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center px-4 md:px-6 justify-between sticky top-0 z-50 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="md:hidden">
            <Menu className="text-slate-600" />
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">
            KS
          </div>
          <span className="text-lg font-bold text-slate-900 hidden md:block tracking-tight">Kormo<span className="text-indigo-600">Stream</span></span>
        </div>
      </div>

      <div className="flex-1 max-w-xl mx-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search roles (e.g. 'Software Engineer' OR 'DevOps')" 
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            className="w-full h-10 pl-10 pr-4 bg-slate-100 border-none rounded-full text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all placeholder:text-slate-400"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="relative w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-50 text-slate-600 transition-colors">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden border border-slate-300">
           <img src="https://picsum.photos/100/100" alt="User" />
        </div>
      </div>
    </header>
  );
};
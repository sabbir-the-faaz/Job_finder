export enum JobType {
  OnSite = 'On-site',
  Remote = 'Remote',
  Hybrid = 'Hybrid'
}

export enum Currency {
  BDT = 'BDT',
  USD = 'USD'
}

export interface JobSource {
  provider: string; // "LinkedIn", "Bdjobs", "Glassdoor"
  url: string;
  is_primary: boolean;
}

export interface CompanyInfo {
  name: string;
  logo_url?: string;
  tags: string[]; // ['MNC', 'Unicorn', 'Tech', 'Startup', 'Govt']
}

export interface JobLocation {
  city: string; // "Dhaka"
  area: string; // "Banani"
  type: JobType;
}

export interface SalaryRange {
  min: number;
  max: number;
  currency: Currency;
  is_negotiable: boolean;
}

export interface JobDates {
  posted: Date;
  extracted: Date;
  expires: Date;
}

// Canonical Data Model
export interface JobPosting {
  id: string; // UUID
  fingerprint: string; // Deduplication hash
  title: string;
  normalized_title: string; // for search
  company: CompanyInfo;
  location: JobLocation;
  salary: SalaryRange;
  dates: JobDates;
  sources: JobSource[];
  status: 'active' | 'expired' | 'removed';
  description?: string; // Short summary
}

export interface FilterState {
  search: string;
  jobTypes: JobType[];
  tags: string[];
  minSalary: number;
}
import { JobPosting, JobType, Currency } from '../types';

const COMPANIES = [
  { name: 'Pathao', tags: ['Unicorn', 'Tech', 'Startup'], logo: 'https://picsum.photos/40/40?random=1' },
  { name: 'bKash', tags: ['Unicorn', 'FinTech', 'MNC'], logo: 'https://picsum.photos/40/40?random=2' },
  { name: 'ShopUp', tags: ['Startup', 'Tech', 'Supply Chain'], logo: 'https://picsum.photos/40/40?random=3' },
  { name: 'Grameenphone', tags: ['MNC', 'Telco'], logo: 'https://picsum.photos/40/40?random=4' },
  { name: 'Berger Paints', tags: ['MNC', 'Manufacturing'], logo: 'https://picsum.photos/40/40?random=5' },
  { name: 'Chaldal', tags: ['Startup', 'Tech'], logo: 'https://picsum.photos/40/40?random=6' },
  { name: 'Brain Station 23', tags: ['Tech', 'Software'], logo: 'https://picsum.photos/40/40?random=7' },
  { name: 'British American Tobacco', tags: ['MNC', 'FMCG'], logo: 'https://picsum.photos/40/40?random=8' },
  { name: 'Unilever BD', tags: ['MNC', 'FMCG'], logo: 'https://picsum.photos/40/40?random=9' },
  { name: '10 Minute School', tags: ['Startup', 'EdTech'], logo: 'https://picsum.photos/40/40?random=10' },
];

const ROLES = [
  'Senior Software Engineer', 'Product Manager', 'Data Analyst', 
  'DevOps Engineer', 'Marketing Executive', 'Sales Associate', 
  'Human Resources Manager', 'Full Stack Developer', 'UX/UI Designer',
  'Supply Chain Officer', 'Account Manager', 'React Developer'
];

const LOCATIONS = [
  { city: 'Dhaka', area: 'Gulshan 1' },
  { city: 'Dhaka', area: 'Banani' },
  { city: 'Dhaka', area: 'Uttara' },
  { city: 'Dhaka', area: 'Dhanmondi' },
  { city: 'Dhaka', area: 'Karwan Bazar' },
  { city: 'Chittagong', area: 'Agrabad' },
  { city: 'Sylhet', area: 'Zindabazar' },
  { city: 'Remote', area: 'Anywhere' },
];

const SOURCES = ['LinkedIn', 'BdJobs', 'Glassdoor', 'Company Site', 'Facebook'];

const generateId = () => Math.random().toString(36).substr(2, 9);

export const generateRandomJob = (): JobPosting => {
  const company = COMPANIES[Math.floor(Math.random() * COMPANIES.length)];
  const role = ROLES[Math.floor(Math.random() * ROLES.length)];
  const locBase = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];
  
  const isRemote = locBase.city === 'Remote' || Math.random() > 0.8;
  const jobType = isRemote ? JobType.Remote : (Math.random() > 0.7 ? JobType.Hybrid : JobType.OnSite);
  
  const minSal = Math.floor(Math.random() * 8 + 3) * 10000; // 30k to 110k
  const maxSal = minSal + Math.floor(Math.random() * 5 + 2) * 10000;
  
  const numSources = Math.floor(Math.random() * 2) + 1;
  const jobSources = Array.from({ length: numSources }).map((_, i) => ({
    provider: SOURCES[Math.floor(Math.random() * SOURCES.length)],
    url: '#',
    is_primary: i === 0
  }));

  // Simulating deduplication by combining multiple sources on one object
  if (numSources > 1 && !jobSources.find(s => s.provider === 'BdJobs')) {
      jobSources.push({ provider: 'BdJobs', url: '#', is_primary: false });
  }

  const now = new Date();
  
  return {
    id: generateId(),
    fingerprint: generateId(),
    title: role,
    normalized_title: role.toLowerCase(),
    company: {
      name: company.name,
      logo_url: company.logo,
      tags: company.tags
    },
    location: {
      city: locBase.city,
      area: locBase.area,
      type: jobType
    },
    salary: {
      min: minSal,
      max: maxSal,
      currency: Currency.BDT,
      is_negotiable: Math.random() > 0.5
    },
    dates: {
      posted: new Date(now.getTime() - Math.random() * 1000 * 60 * 60 * 24), // Random time in last 24h
      extracted: now,
      expires: new Date(now.getTime() + 1000 * 60 * 60 * 24 * 30)
    },
    sources: jobSources,
    status: 'active',
    description: `We are looking for a talented ${role} to join our team at ${company.name}. This is an exciting opportunity to work on large-scale systems serving millions of users in Bangladesh.`
  };
};

export const generateInitialJobs = (count: number): JobPosting[] => {
  return Array.from({ length: count }).map(() => generateRandomJob());
};
import React from 'react';
import Link from 'next/link';

// Job type definition
export interface Job {
  id: string;
  title: string;
  description: string;
  budget: {
    amount: number;
    currency: 'SOL' | 'ETH' | 'USDC';
  };
  deadline: Date;
  skills: string[];
  client: {
    id: string;
    name: string;
    rating: number;
  };
  status: 'open' | 'in_progress' | 'completed' | 'disputed' | 'cancelled';
  bidCount: number;
  createdAt: Date;
}

interface JobListingProps {
  job: Job;
  compact?: boolean;
}

const getCurrencySymbol = (currency: string) => {
  switch (currency) {
    case 'SOL':
      return '◎';
    case 'ETH':
      return 'Ξ';
    case 'USDC':
      return '$';
    default:
      return '';
  }
};

const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const JobListing: React.FC<JobListingProps> = ({ job, compact = false }) => {
  const statusColors = {
    open: 'bg-green-100 text-green-800',
    in_progress: 'bg-blue-100 text-blue-800',
    completed: 'bg-purple-100 text-purple-800',
    disputed: 'bg-red-100 text-red-800',
    cancelled: 'bg-gray-100 text-gray-800',
  };

  if (compact) {
    return (
      <Link href={`/jobs/${job.id}`} className="block">
        <div className="bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg p-4 transition-all duration-200 ease-in-out">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold text-white">{job.title}</h3>
            <span className={`text-sm px-2 py-1 rounded-full ${statusColors[job.status]}`}>
              {job.status.replace('_', ' ')}
            </span>
          </div>
          <div className="flex justify-between items-center text-gray-300 text-sm mb-3">
            <span>
              {getCurrencySymbol(job.budget.currency)}{job.budget.amount} {job.budget.currency}
            </span>
            <span>{job.bidCount} bids</span>
          </div>
          <div className="flex flex-wrap gap-1 mt-2">
            {job.skills.slice(0, 3).map((skill, index) => (
              <span key={index} className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">
                {skill}
              </span>
            ))}
            {job.skills.length > 3 && (
              <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">
                +{job.skills.length - 3}
              </span>
            )}
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/jobs/${job.id}`} className="block">
      <div className="bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg p-6 transition-all duration-200 ease-in-out">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-white">{job.title}</h3>
          <span className={`text-sm px-3 py-1 rounded-full ${statusColors[job.status]}`}>
            {job.status.replace('_', ' ')}
          </span>
        </div>
        
        <p className="text-gray-300 mb-4 line-clamp-2">{job.description}</p>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-gray-400 text-sm">Budget</p>
            <p className="text-white font-semibold">
              {getCurrencySymbol(job.budget.currency)}{job.budget.amount} {job.budget.currency}
            </p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Deadline</p>
            <p className="text-white">{formatDate(job.deadline)}</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Client</p>
            <div className="flex items-center">
              <span className="text-white mr-2">{job.client.name}</span>
              <div className="flex items-center">
                <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
                <span className="text-white ml-1">{job.client.rating.toFixed(1)}</span>
              </div>
            </div>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Proposals</p>
            <p className="text-white">{job.bidCount} bids</p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {job.skills.map((skill, index) => (
            <span key={index} className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">
              {skill}
            </span>
          ))}
        </div>
        
        <div className="flex justify-between items-center text-gray-400 text-sm">
          <span>Posted {formatDate(job.createdAt)}</span>
          <span className="text-indigo-400 hover:text-indigo-300">View Details →</span>
        </div>
      </div>
    </Link>
  );
};

export default JobListing; 
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import GridBackground from '../../components/GridBackground';

// Mock job data
const MOCK_JOBS = [
  {
    id: 1,
    title: 'Smart Contract Developer for NFT Marketplace',
    description: 'Looking for an experienced Solidity developer to create smart contracts for our NFT marketplace. Must have experience with ERC-721 and ERC-1155 standards.',
    budget: 5000,
    currency: 'USDC',
    deadline: '2023-12-30',
    client: {
      name: 'CryptoArt Inc.',
      rating: 4.8,
      jobsPosted: 12
    },
    skills: ['Solidity', 'NFT', 'Smart Contracts', 'Ethereum'],
    createdAt: '2023-11-15',
    bids: 7
  },
  {
    id: 2,
    title: 'Cross-Chain Bridge UI Implementation',
    description: 'We need a frontend developer to build the UI for our cross-chain bridge. Experience with React and web3.js is required.',
    budget: 3500,
    currency: 'USDC',
    deadline: '2023-12-15',
    client: {
      name: 'Bridge Protocol',
      rating: 4.9,
      jobsPosted: 8
    },
    skills: ['React', 'TypeScript', 'Web3.js', 'UI/UX'],
    createdAt: '2023-11-10',
    bids: 5
  },
  {
    id: 3,
    title: 'Solana Program Development for DeFi App',
    description: 'We are seeking a Rust developer to build a Solana program for our DeFi application. Must have experience with Anchor framework.',
    budget: 7500,
    currency: 'SOL',
    deadline: '2024-01-20',
    client: {
      name: 'SolFinance',
      rating: 4.7,
      jobsPosted: 5
    },
    skills: ['Rust', 'Solana', 'Anchor', 'DeFi'],
    createdAt: '2023-11-05',
    bids: 3
  },
  {
    id: 4,
    title: 'DAO Governance Dashboard',
    description: 'Looking for a full-stack developer to create a governance dashboard for our DAO. Should include proposal creation, voting, and treasury management.',
    budget: 6000,
    currency: 'USDC',
    deadline: '2024-01-10',
    client: {
      name: 'MetaDAO',
      rating: 4.6,
      jobsPosted: 9
    },
    skills: ['React', 'Node.js', 'Ethereum', 'DAO'],
    createdAt: '2023-11-01',
    bids: 8
  },
  {
    id: 5,
    title: 'Security Audit for Lending Protocol',
    description: 'Need a security expert to audit our DeFi lending protocol smart contracts. Looking for someone with a track record in identifying vulnerabilities.',
    budget: 9000,
    currency: 'ETH',
    deadline: '2023-12-25',
    client: {
      name: 'SecureLend',
      rating: 5.0,
      jobsPosted: 3
    },
    skills: ['Security', 'Solidity', 'Auditing', 'DeFi'],
    createdAt: '2023-10-28',
    bids: 4
  },
  {
    id: 6,
    title: 'NFT Collection Artwork Design',
    description: 'We need a talented digital artist to create artwork for our upcoming NFT collection. The collection will feature 5,000 unique space-themed characters.',
    budget: 8000,
    currency: 'USDC',
    deadline: '2023-12-20',
    client: {
      name: 'SpaceNFT',
      rating: 4.9,
      jobsPosted: 6
    },
    skills: ['Digital Art', 'NFT', 'Illustration', 'Creative Design'],
    createdAt: '2023-10-25',
    bids: 12
  }
];

const JobsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [budgetRange, setBudgetRange] = useState<[number, number] | null>(null);
  
  // All available skills
  const allSkills = [...new Set(MOCK_JOBS.flatMap(job => job.skills))].sort();
  
  // Filter jobs based on search, selected skills, and budget range
  const filteredJobs = MOCK_JOBS.filter(job => {
    const matchesSearch = searchTerm === '' || 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
      
    const matchesSkills = selectedSkills.length === 0 || 
      selectedSkills.every(skill => job.skills.includes(skill));
    
    const matchesBudget = !budgetRange || 
      (job.budget >= budgetRange[0] && job.budget <= budgetRange[1]);
      
    return matchesSearch && matchesSkills && matchesBudget;
  });
  
  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev => 
      prev.includes(skill) 
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };
  
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedSkills([]);
    setBudgetRange(null);
  };
  
  // Format date to relative time (e.g., "2 days ago")
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };
  
  return (
    <div className="min-h-screen py-8">
      <div className="relative">
        <div className="absolute inset-0 -z-10 opacity-20">
          <GridBackground />
        </div>
        
        {/* Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 fade-in-up">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4 text-gradient">Available Jobs</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Find Web3 projects that match your skills and interests
            </p>
          </div>
          
          {/* Search and Filters */}
          <div className="mt-8 glass-card p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search by title, description, or skills..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-gray-700/60 border border-gray-600/50 rounded-md py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <button
                className="btn-primary bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md"
                onClick={clearFilters}
              >
                Clear Filters
              </button>
            </div>
            
            {/* Skills filters */}
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-300 mb-2">Filter by skills:</h3>
              <div className="flex flex-wrap gap-2">
                {allSkills.map((skill) => (
                  <button
                    key={skill}
                    onClick={() => toggleSkill(skill)}
                    className={`text-xs px-3 py-1 rounded-full transition-colors ${
                      selectedSkills.includes(skill)
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-700/60 text-gray-300 hover:bg-gray-600/80'
                    }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Budget filter */}
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-300 mb-2">Quick budget filters:</h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setBudgetRange([0, 3000])}
                  className={`text-xs px-3 py-1 rounded-full transition-colors ${
                    budgetRange && budgetRange[1] === 3000
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-700/60 text-gray-300 hover:bg-gray-600/80'
                  }`}
                >
                  Under $3,000
                </button>
                <button
                  onClick={() => setBudgetRange([3000, 6000])}
                  className={`text-xs px-3 py-1 rounded-full transition-colors ${
                    budgetRange && budgetRange[0] === 3000 && budgetRange[1] === 6000
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-700/60 text-gray-300 hover:bg-gray-600/80'
                  }`}
                >
                  $3,000 - $6,000
                </button>
                <button
                  onClick={() => setBudgetRange([6000, Infinity])}
                  className={`text-xs px-3 py-1 rounded-full transition-colors ${
                    budgetRange && budgetRange[0] === 6000
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-700/60 text-gray-300 hover:bg-gray-600/80'
                  }`}
                >
                  $6,000+
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Job Listings */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredJobs.length > 0 ? (
            <div className="space-y-6">
              {filteredJobs.map((job) => (
                <div key={job.id} className="glass-card p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex-1">
                      <Link href={`/jobs/${job.id}`} className="inline-block">
                        <h3 className="text-xl font-semibold mb-2 text-white hover:text-indigo-400 transition-colors">{job.title}</h3>
                      </Link>
                      <div className="flex items-center mb-3">
                        <span className="text-gray-300">{job.client.name}</span>
                        <span className="mx-2 text-gray-500">•</span>
                        <div className="flex items-center text-yellow-400">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span className="ml-1 text-sm">{job.client.rating}</span>
                        </div>
                        <span className="mx-2 text-gray-500">•</span>
                        <span className="text-gray-400 text-sm">{job.client.jobsPosted} jobs posted</span>
                      </div>
                      <p className="text-gray-300 mb-4 line-clamp-2">{job.description}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {job.skills.map(skill => (
                          <span key={skill} className="bg-indigo-900/70 text-indigo-200 px-2 py-1 rounded-full text-xs">
                            {skill}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center text-sm text-gray-400">
                        <div>Posted {formatRelativeTime(job.createdAt)}</div>
                        <span className="mx-2">•</span>
                        <div>{job.bids} bids</div>
                        <span className="mx-2">•</span>
                        <div>Deadline: {new Date(job.deadline).toLocaleDateString()}</div>
                      </div>
                    </div>
                    <div className="mt-4 lg:mt-0 lg:ml-8 flex flex-col items-center lg:items-end">
                      <div className="mb-2 text-2xl font-bold text-gradient">
                        {job.budget} {job.currency}
                      </div>
                      <Link href={`/jobs/${job.id}`} className="btn-primary w-full lg:w-auto block text-center bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md transition-colors">
                        View Job
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 glass-card">
              <div className="text-2xl font-semibold mb-2 text-gray-300">No jobs found</div>
              <p className="text-gray-400 mb-6">Try adjusting your search filters</p>
              <button
                onClick={clearFilters}
                className="btn-primary bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
        
        {/* CTA */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 mb-8">
          <div className="glass-card p-8 text-center border-gradient relative overflow-hidden">
            <div className="absolute inset-0 z-0">
              <img 
                src="/assets/images/backgrounds/cta-bg.jpg" 
                alt="Background" 
                className="w-full h-full object-cover opacity-15"
              />
            </div>
            <div className="relative z-10">
              <h2 className="text-2xl font-bold mb-4 text-gradient">Have a job that needs blockchain expertise?</h2>
              <p className="text-gray-300 mb-6">Post your job and get bids from talented freelancers within minutes</p>
              <Link href="/jobs/post" className="btn-primary bg-white text-indigo-900 hover:bg-gray-200 px-6 py-3 rounded-lg font-medium transition-colors">
                Post a Job
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobsPage; 
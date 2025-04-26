'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import GridBackground from '../components/GridBackground';

// Mock freelancer data
const MOCK_FREELANCERS = [
  {
    id: 1,
    name: 'Alex Rivera',
    title: 'Solana Developer',
    rating: 4.9,
    skills: ['Rust', 'Anchor', 'Web3.js', 'React'],
    hourlyRate: 85,
    completedJobs: 24,
    image: '/assets/freelancer1.jpg'
  },
  {
    id: 2,
    name: 'Sarah Chen',
    title: 'Smart Contract Engineer',
    rating: 4.8,
    skills: ['Solidity', 'Ethereum', 'DeFi', 'Security Audits'],
    hourlyRate: 95,
    completedJobs: 37,
    image: '/assets/freelancer2.jpg'
  },
  {
    id: 3,
    name: 'Michael Johnson',
    title: 'Blockchain Frontend Developer',
    rating: 4.7,
    skills: ['React', 'TypeScript', 'Web3.js', 'UI/UX'],
    hourlyRate: 75,
    completedJobs: 19,
    image: '/assets/freelancer3.jpg'
  },
  {
    id: 4,
    name: 'Emma Wilson',
    title: 'NFT Developer',
    rating: 4.9,
    skills: ['Solidity', 'ERC-721', 'IPFS', 'Metadata'],
    hourlyRate: 90,
    completedJobs: 42,
    image: '/assets/freelancer4.jpg'
  },
  {
    id: 5,
    name: 'Daniel Park',
    title: 'Cross-chain Integration Specialist',
    rating: 4.6,
    skills: ['Solana', 'Ethereum', 'Wormhole', 'Rust'],
    hourlyRate: 110,
    completedJobs: 15,
    image: '/assets/freelancer5.jpg'
  },
  {
    id: 6,
    name: 'Olivia Martinez',
    title: 'DeFi Protocol Developer',
    rating: 4.8,
    skills: ['Solidity', 'AMMs', 'Yield Farming', 'Staking'],
    hourlyRate: 100,
    completedJobs: 28,
    image: '/assets/freelancer6.jpg'
  }
];

const FreelancersPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  
  // All available skills
  const allSkills = [...new Set(MOCK_FREELANCERS.flatMap(f => f.skills))].sort();
  
  // Filter freelancers based on search and selected skills
  const filteredFreelancers = MOCK_FREELANCERS.filter(freelancer => {
    const matchesSearch = searchTerm === '' || 
      freelancer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      freelancer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      freelancer.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
      
    const matchesSkills = selectedSkills.length === 0 || 
      selectedSkills.every(skill => freelancer.skills.includes(skill));
      
    return matchesSearch && matchesSkills;
  });
  
  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev => 
      prev.includes(skill) 
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
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
            <h1 className="text-4xl font-bold mb-4 text-gradient">Find Top Web3 Talent</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Connect with skilled blockchain developers, designers, and experts for your next project
            </p>
          </div>
          
          {/* Search and Filters */}
          <div className="mt-8 glass-card p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search by name, title, or skill..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-gray-700/60 border border-gray-600/50 rounded-md py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <button
                className="btn-primary bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md"
                onClick={() => setSearchTerm('')}
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
          </div>
        </div>
        
        {/* Freelancer List */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFreelancers.length > 0 ? (
              filteredFreelancers.map((freelancer) => (
                <div key={freelancer.id} className="glass-card p-6 flex flex-col h-full">
                  <div className="flex items-center mb-4">
                    <div className="w-16 h-16 bg-indigo-500/30 rounded-full flex items-center justify-center text-xl font-bold overflow-hidden">
                      <img 
                        src={`/assets/images/profiles/freelancer${freelancer.id}.jpg`} 
                        alt={freelancer.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-xl font-semibold text-white">{freelancer.name}</h3>
                      <p className="text-gray-300">{freelancer.title}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center mb-4">
                    <div className="flex items-center text-yellow-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="ml-1 text-white">{freelancer.rating}</span>
                    </div>
                    <div className="ml-4 text-gray-300">
                      {freelancer.completedJobs} jobs completed
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="text-sm font-medium text-gray-300 mb-2">Skills:</div>
                    <div className="flex flex-wrap gap-2">
                      {freelancer.skills.map(skill => (
                        <span key={skill} className="bg-indigo-900/70 text-indigo-200 px-2 py-1 rounded-full text-xs">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <div className="text-sm font-medium text-gray-300 mb-1">Hourly Rate:</div>
                    <div className="text-2xl font-bold text-gradient">${freelancer.hourlyRate}/hr</div>
                  </div>
                  
                  <div className="mt-auto">
                    <Link href={`/freelancers/${freelancer.id}`} className="btn-primary w-full block text-center bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition-colors">
                      View Profile
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center py-12">
                <div className="text-2xl font-semibold mb-2 text-gray-300">No freelancers found</div>
                <p className="text-gray-400 mb-6">Try adjusting your search filters</p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedSkills([]);
                  }}
                  className="btn-primary bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* CTA */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 mb-8">
          <div className="glass-card p-8 text-center border-gradient">
            <h2 className="text-2xl font-bold mb-4 text-gradient">Are you a Web3 Freelancer?</h2>
            <p className="text-gray-300 mb-6">Join our marketplace and start receiving job offers from top clients</p>
            <Link href="/auth/signup?type=freelancer" className="btn-primary bg-white text-indigo-900 hover:bg-gray-200 px-6 py-3 rounded-lg font-medium transition-colors">
              Create Freelancer Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreelancersPage; 
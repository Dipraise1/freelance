'use client';

import { FC, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

// Mock data for freelancers
const MOCK_FREELANCERS = [
  {
    id: 1,
    name: 'Alex Johnson',
    role: 'Full Stack Developer',
    rating: 4.9,
    completedJobs: 37,
    hourlyRate: 85,
    skills: ['React', 'Node.js', 'TypeScript', 'MongoDB'],
    profileImage: '/assets/images/team/placeholder1.jpg',
  },
  {
    id: 2,
    name: 'Sophia Chen',
    role: 'UI/UX Designer',
    rating: 4.8,
    completedJobs: 42,
    hourlyRate: 90,
    skills: ['Figma', 'Adobe XD', 'User Research', 'Wireframing'],
    profileImage: '/assets/images/team/placeholder2.jpg',
  },
  {
    id: 3,
    name: 'Marcus Johnson',
    role: 'Blockchain Developer',
    rating: 4.7,
    completedJobs: 15,
    hourlyRate: 120,
    skills: ['Solidity', 'Smart Contracts', 'Ethereum', 'Web3.js'],
    profileImage: '/assets/images/team/placeholder3.jpg',
  },
  {
    id: 4,
    name: 'Aisha Patel',
    role: 'Content Writer',
    rating: 4.9,
    completedJobs: 63,
    hourlyRate: 55,
    skills: ['Blog Writing', 'Copywriting', 'SEO', 'Content Strategy'],
    profileImage: '/assets/images/team/placeholder4.jpg',
  },
  {
    id: 5,
    name: 'Carlos Rodriguez',
    role: 'Mobile Developer',
    rating: 4.6,
    completedJobs: 29,
    hourlyRate: 95,
    skills: ['React Native', 'Flutter', 'Swift', 'Kotlin'],
    profileImage: '/assets/images/team/placeholder1.jpg',
  },
  {
    id: 6,
    name: 'Elena Kim',
    role: 'Data Scientist',
    rating: 4.8,
    completedJobs: 22,
    hourlyRate: 110,
    skills: ['Python', 'Machine Learning', 'Data Analysis', 'TensorFlow'],
    profileImage: '/assets/images/team/placeholder2.jpg',
  },
];

// Define skill categories for filtering
const SKILL_CATEGORIES = [
  'Development',
  'Design',
  'Writing',
  'Marketing',
  'Blockchain',
  'Data Science',
  'Mobile',
];

const FreelancersPage: FC = () => {
  const [freelancers] = useState(MOCK_FREELANCERS);
  const [filteredFreelancers, setFilteredFreelancers] = useState(MOCK_FREELANCERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [minRate, setMinRate] = useState('');
  const [maxRate, setMaxRate] = useState('');
  const [minRating, setMinRating] = useState<number | null>(null);
  
  // Filter freelancers based on search and filters
  useEffect(() => {
    let results = freelancers;
    
    // Filter by search term
    if (searchTerm) {
      const lowerCaseSearch = searchTerm.toLowerCase();
      results = results.filter(freelancer => 
        freelancer.name.toLowerCase().includes(lowerCaseSearch) ||
        freelancer.role.toLowerCase().includes(lowerCaseSearch) ||
        freelancer.skills.some(skill => skill.toLowerCase().includes(lowerCaseSearch))
      );
    }
    
    // Filter by selected skills
    if (selectedSkills.length > 0) {
      results = results.filter(freelancer =>
        selectedSkills.some(skill => 
          freelancer.skills.some(s => s.toLowerCase().includes(skill.toLowerCase()))
        )
      );
    }
    
    // Filter by hourly rate
    if (minRate) {
      results = results.filter(freelancer => 
        freelancer.hourlyRate >= parseInt(minRate)
      );
    }
    
    if (maxRate) {
      results = results.filter(freelancer => 
        freelancer.hourlyRate <= parseInt(maxRate)
      );
    }
    
    // Filter by minimum rating
    if (minRating) {
      results = results.filter(freelancer => 
        freelancer.rating >= minRating
      );
    }
    
    setFilteredFreelancers(results);
  }, [freelancers, searchTerm, selectedSkills, minRate, maxRate, minRating]);
  
  const handleSkillToggle = (skill: string) => {
    setSelectedSkills(prev => 
      prev.includes(skill)
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };
  
  const handleRatingFilter = (rating: number) => {
    setMinRating(prev => prev === rating ? null : rating);
  };
  
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedSkills([]);
    setMinRate('');
    setMaxRate('');
    setMinRating(null);
  };
  
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.6 }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg 
            key={star}
            xmlns="http://www.w3.org/2000/svg" 
            className={`h-4 w-4 ${rating >= star ? 'text-yellow-400' : 'text-gray-300'}`} 
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        <span className="ml-2 text-sm text-gray-300">({rating})</span>
      </div>
    );
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Header */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="relative max-w-7xl mx-auto">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
              Top Freelancers
            </h1>
            <p className="text-xl max-w-3xl mx-auto text-gray-300 mb-8">
              Find the perfect talent for your project from our pool of verified freelancers with proven blockchain expertise.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter and Search Section */}
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-xl border border-white/10 backdrop-blur-sm p-6">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-grow">
                <label htmlFor="search" className="sr-only">Search freelancers</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    id="search"
                    name="search"
                    type="text"
                    placeholder="Search by name, role, or skills..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-white/10 rounded-lg bg-black/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="flex space-x-2">
                <div className="min-w-[100px]">
                  <label htmlFor="minRate" className="sr-only">Min Rate</label>
                  <input
                    id="minRate"
                    name="minRate"
                    type="number"
                    placeholder="Min $"
                    value={minRate}
                    onChange={(e) => setMinRate(e.target.value)}
                    className="block w-full px-3 py-2 border border-white/10 rounded-lg bg-black/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div className="min-w-[100px]">
                  <label htmlFor="maxRate" className="sr-only">Max Rate</label>
                  <input
                    id="maxRate"
                    name="maxRate"
                    type="number"
                    placeholder="Max $"
                    value={maxRate}
                    onChange={(e) => setMaxRate(e.target.value)}
                    className="block w-full px-3 py-2 border border-white/10 rounded-lg bg-black/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                >
                  Clear
                </button>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-300 mb-3">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {SKILL_CATEGORIES.map((skill) => (
                  <button
                    key={skill}
                    onClick={() => handleSkillToggle(skill)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      selectedSkills.includes(skill)
                        ? 'bg-blue-500 text-white'
                        : 'bg-white/10 text-gray-300 hover:bg-white/20'
                    }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-300 mb-3">Rating</h3>
              <div className="flex flex-wrap gap-2">
                {[4, 4.5, 4.8].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => handleRatingFilter(rating)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      minRating === rating
                        ? 'bg-blue-500 text-white'
                        : 'bg-white/10 text-gray-300 hover:bg-white/20'
                    }`}
                  >
                    {rating}+ ★
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Freelancers List */}
      <section className="py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">{filteredFreelancers.length} Freelancers Available</h2>
            <div className="text-gray-300">
              <select 
                className="bg-black/50 border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                defaultValue="featured"
                aria-label="Sort freelancers by"
              >
                <option value="featured">Featured</option>
                <option value="rating">Highest Rating</option>
                <option value="rate-low">Rate: Low to High</option>
                <option value="rate-high">Rate: High to Low</option>
                <option value="jobs">Most Jobs Completed</option>
              </select>
            </div>
          </div>
          
          {filteredFreelancers.length === 0 ? (
            <div className="text-center py-12">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <h3 className="text-xl font-semibold mb-2">No freelancers found</h3>
              <p className="text-gray-400 max-w-md mx-auto">
                We couldn&apos;t find any freelancers matching your criteria. Try adjusting your filters or search terms.
              </p>
              <button 
                onClick={clearFilters}
                className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredFreelancers.map((freelancer) => (
                <motion.div
                  key={freelancer.id}
                  variants={fadeIn}
                  className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-xl border border-white/10 backdrop-blur-sm overflow-hidden transition-transform hover:scale-[1.02]"
                >
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="relative w-16 h-16 rounded-full overflow-hidden mr-4 border-2 border-blue-400">
                        <Image 
                          src={freelancer.profileImage}
                          alt={freelancer.name}
                          width={64}
                          height={64}
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold">{freelancer.name}</h3>
                        <p className="text-blue-400">{freelancer.role}</p>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      {renderStars(freelancer.rating)}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                      <div>
                        <p className="text-gray-400">Hourly Rate</p>
                        <p className="font-semibold text-lg">${freelancer.hourlyRate}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Jobs Completed</p>
                        <p className="font-semibold text-lg">{freelancer.completedJobs}</p>
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <p className="text-gray-400 text-sm mb-2">Skills</p>
                      <div className="flex flex-wrap gap-2">
                        {freelancer.skills.map((skill, index) => (
                          <span 
                            key={index}
                            className="text-xs bg-white/10 text-gray-300 px-2 py-1 rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Link 
                        href={`/freelancers/${freelancer.id}`}
                        className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg text-center font-medium hover:from-blue-600 hover:to-purple-700 transition-colors"
                      >
                        View Profile
                      </Link>
                      <button
                        className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
                      >
                        Contact
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
};

export default FreelancersPage; 
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createJob } from '@/utils/solana';
import { PublicKey } from '@solana/web3.js';

interface WalletWindow extends Window {
  solana?: {
    isPhantom?: boolean;
    connect: () => Promise<{ publicKey: PublicKey }>;
  };
}

type Wallet = {
  publicKey: PublicKey;
  connect: () => Promise<{ publicKey: PublicKey }>;
  isPhantom: boolean;
};

const PostJobPage = () => {
  const router = useRouter();
   
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    amount: '',
    currency: 'USDC',
    deadline: '',
    category: '',
    skills: [] as string[],
    paymentMethod: 'escrow',
    skill: '', // Used for skill input
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [transactionStatus, setTransactionStatus] = useState({
    message: '',
    type: '' // 'success' or 'error'
  });

  // Initialize wallet connection on component mount
  useEffect(() => {
    // This function can be called explicitly if needed
    // We're not auto-connecting on page load
  }, []);

  const categories = [
    'Blockchain Development',
    'Smart Contract Development',
    'NFT Creation',
    'Web3 Frontend Development',
    'DeFi Development',
    'Solana Development',
    'Ethereum Development',
    'Tokenomics',
    'Blockchain Consulting',
    'Web3 Marketing',
  ];

  const suggestedSkills = [
    'Solidity', 'Rust', 'React', 'Anchor', 'Web3.js', 'Ethers.js',
    'NFTs', 'DeFi', 'Smart Contracts', 'Solana', 'Ethereum', 'TypeScript',
    'API Integration', 'Cross-chain', 'Wormhole', 'ERC-20', 'ERC-721', 'SPL',
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleAddSkill = () => {
    const skill = formData.skill.trim();
    if (skill && !formData.skills.includes(skill)) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skill],
        skill: '',
      }));
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove),
    }));
  };

  const handleSuggestedSkill = (skill: string) => {
    if (!formData.skills.includes(skill)) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skill],
      }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!formData.title) newErrors.title = 'Title is required';
    if (!formData.description) newErrors.description = 'Description is required';
    if (!formData.amount) newErrors.amount = 'Budget amount is required';
    if (isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) {
      newErrors.amount = 'Budget must be a positive number';
    }
    if (!formData.currency) newErrors.currency = 'Currency is required';
    if (!formData.deadline) newErrors.deadline = 'Deadline is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (formData.skills.length === 0) newErrors.skills = 'At least one skill is required';
    
    // Check if wallet is connected
    if (!isWalletConnected) {
      newErrors.wallet = 'Please connect your wallet first';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleConnectWallet = async () => {
    try {
      const windowWithWallet = window as WalletWindow;
      const solana = windowWithWallet.solana;
      
      if (solana) {
        if (solana.isPhantom) {
          try {
            const response = await solana.connect();
            // For development, simulate a connected wallet
            const connectedWallet: Wallet = {
              publicKey: response.publicKey,
              connect: solana.connect,
              isPhantom: true
            };
            setWallet(connectedWallet);
            setIsWalletConnected(true);
            console.log('Wallet connected with public key:', response.publicKey.toString());
          } catch (err) {
            console.error('User rejected the wallet connection request', err);
          }
        } else {
          window.open('https://phantom.app/', '_blank');
        }
      } else {
        // For development without Phantom, create a mock wallet
        const mockWallet: Wallet = {
          publicKey: new PublicKey('Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS'),
          connect: async () => ({ publicKey: new PublicKey('Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS') }),
          isPhantom: true
        };
        setWallet(mockWallet);
        setIsWalletConnected(true);
        console.log('Mock wallet connected for development');
        
        // If in production, direct to install Phantom
        if (process.env.NODE_ENV === 'production') {
          alert('Phantom wallet not found. Please install it to continue.');
          window.open('https://phantom.app/', '_blank');
        }
      }
    } catch (error) {
      console.error('Error connecting to wallet:', error instanceof Error ? error.message : 'Unknown error');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setTransactionStatus({ message: 'Processing transaction...', type: '' });
    
    try {
      // Convert deadline to unix timestamp
      const deadlineDate = new Date(formData.deadline);
      const deadlineTimestamp = Math.floor(deadlineDate.getTime() / 1000);
      
      // Generate a job ID (in production this should be handled by the server or contract)
      const jobId = Math.floor(Date.now() / 1000);
      
      // Call the Solana contract
      if (wallet && isWalletConnected) {
        const result = await createJob(
          wallet,
          jobId,
          formData.title,
          formData.description,
          Number(formData.amount),
          deadlineTimestamp,
          formData.currency
        );
        
        if (result.success) {
          setTransactionStatus({
            message: `Job posted successfully! Transaction signature: ${result.signature ? result.signature.slice(0, 8) + '...' : 'Processing'}`,
            type: 'success'
          });
          
          // Redirect after a short delay
          setTimeout(() => {
            router.push('/jobs/browse');
          }, 2000);
        } else {
          setTransactionStatus({
            message: `Error posting job: ${result.error}`,
            type: 'error'
          });
          setIsSubmitting(false);
        }
      } else {
        setTransactionStatus({
          message: 'Wallet not connected',
          type: 'error'
        });
        setIsSubmitting(false);
      }
    } catch (error: unknown) {
      console.error('Error posting job:', error);
      setTransactionStatus({
        message: `Failed to post job: ${error instanceof Error ? error.message : 'Unknown error'}`,
        type: 'error'
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-8 fade-in-up">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gradient">Post a New Job</h1>
          <p className="text-gray-400 mt-2">Hire top Web3 talent for your blockchain projects</p>
        </div>

        {/* Wallet Connection Status */}
        {!isWalletConnected && (
          <div className="glass-card p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Connect Your Wallet</h3>
                <p className="text-gray-400">You need to connect your wallet to post a job</p>
              </div>
              <button
                onClick={handleConnectWallet}
                className="btn-primary px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none"
              >
                Connect Wallet
              </button>
            </div>
            {errors.wallet && <p className="mt-2 text-sm text-red-500">{errors.wallet}</p>}
          </div>
        )}

        {!isSubmitting ? (
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="glass-card p-6">
              <h2 className="text-xl font-semibold mb-4 text-white">Job Details</h2>
              
              <div className="space-y-6">
                {/* Title */}
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-300">
                    Job Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className={`mt-1 block w-full bg-gray-700/60 border ${errors.title ? 'border-red-500' : 'border-gray-600/50'} rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                    placeholder="e.g., Solidity Smart Contract Developer"
                  />
                  {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
                </div>

                {/* Description */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-300">
                    Job Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={6}
                    className={`mt-1 block w-full bg-gray-700/60 border ${errors.description ? 'border-red-500' : 'border-gray-600/50'} rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                    placeholder="Describe the job requirements, deliverables, and any specific qualifications needed..."
                  />
                  {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
                </div>

                {/* Category */}
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-300">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className={`mt-1 block w-full bg-gray-700/60 border ${errors.category ? 'border-red-500' : 'border-gray-600/50'} rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  {errors.category && <p className="mt-1 text-sm text-red-500">{errors.category}</p>}
                </div>

                {/* Skills */}
                <div>
                  <label className="block text-sm font-medium text-gray-300">
                    Required Skills <span className="text-red-500">*</span>
                  </label>
                  <div className="flex flex-wrap gap-2 mt-1 mb-2">
                    {formData.skills.map((skill) => (
                      <div key={skill} className="bg-indigo-900/70 text-indigo-200 px-3 py-1 rounded-full flex items-center border border-indigo-700/50">
                        <span>{skill}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(skill)}
                          className="ml-2 text-indigo-300 hover:text-indigo-100"
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex">
                    <input
                      type="text"
                      id="skill"
                      name="skill"
                      value={formData.skill}
                      onChange={handleChange}
                      className={`flex-grow bg-gray-700/60 border ${errors.skills ? 'border-red-500' : 'border-gray-600/50'} rounded-l-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                      placeholder="Add a required skill..."
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddSkill();
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleAddSkill}
                      className="btn-primary bg-indigo-600 text-white px-4 py-2 rounded-r-md hover:bg-indigo-700 focus:outline-none"
                    >
                      Add
                    </button>
                  </div>
                  {errors.skills && <p className="mt-1 text-sm text-red-500">{errors.skills}</p>}
                  
                  <div className="mt-2">
                    <p className="text-sm text-gray-400 mb-1">Suggested skills:</p>
                    <div className="flex flex-wrap gap-2">
                      {suggestedSkills
                        .filter(skill => !formData.skills.includes(skill))
                        .slice(0, 8)
                        .map((skill) => (
                          <button
                            key={skill}
                            type="button"
                            onClick={() => handleSuggestedSkill(skill)}
                            className="bg-gray-700/60 text-gray-300 hover:bg-gray-600 px-2 py-1 rounded-md text-xs border border-gray-600/30"
                          >
                            + {skill}
                          </button>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-card p-6">
              <h2 className="text-xl font-semibold mb-4 text-white">Budget & Timeline</h2>
              
              <div className="space-y-6">
                {/* Budget */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-300">
                      Budget Amount <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="amount"
                      name="amount"
                      value={formData.amount}
                      onChange={handleChange}
                      className={`mt-1 block w-full bg-gray-700/60 border ${errors.amount ? 'border-red-500' : 'border-gray-600/50'} rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                      placeholder="e.g., 1000"
                    />
                    {errors.amount && <p className="mt-1 text-sm text-red-500">{errors.amount}</p>}
                  </div>
                  
                  <div>
                    <label htmlFor="currency" className="block text-sm font-medium text-gray-300">
                      Currency <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="currency"
                      name="currency"
                      value={formData.currency}
                      onChange={handleChange}
                      className={`mt-1 block w-full bg-gray-700/60 border ${errors.currency ? 'border-red-500' : 'border-gray-600/50'} rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                    >
                      <option value="USDC">USDC</option>
                      <option value="ETH">ETH</option>
                      <option value="SOL">SOL</option>
                    </select>
                    {errors.currency && <p className="mt-1 text-sm text-red-500">{errors.currency}</p>}
                  </div>
                </div>

                {/* Deadline */}
                <div>
                  <label htmlFor="deadline" className="block text-sm font-medium text-gray-300">
                    Deadline <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    id="deadline"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                    className={`mt-1 block w-full bg-gray-700/60 border ${errors.deadline ? 'border-red-500' : 'border-gray-600/50'} rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  />
                  {errors.deadline && <p className="mt-1 text-sm text-red-500">{errors.deadline}</p>}
                </div>

                {/* Payment Method */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Payment Method
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center bg-gray-700/60 p-3 rounded-md border border-gray-600/50 hover:border-indigo-500/30 transition-colors">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="escrow"
                        checked={formData.paymentMethod === 'escrow'}
                        onChange={handleChange}
                        className="mr-3"
                      />
                      <div>
                        <div className="font-medium">Escrow (Recommended)</div>
                        <div className="text-sm text-gray-400">Funds are held in escrow until you approve the work</div>
                      </div>
                    </label>
                    <label className="flex items-center bg-gray-700/30 p-3 rounded-md border border-gray-600/30 opacity-50 cursor-not-allowed">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="milestone"
                        disabled
                        className="mr-3"
                      />
                      <div>
                        <div className="font-medium">Milestone Payments</div>
                        <div className="text-sm text-gray-400">Pay in installments as work progresses (Coming soon)</div>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {transactionStatus.message && (
              <div className={`${
                transactionStatus.type === 'error' 
                  ? 'bg-red-900/70 border-red-700/50' 
                  : transactionStatus.type === 'success'
                    ? 'bg-green-900/70 border-green-700/50'
                    : 'bg-gray-800/70 border-gray-700/50'
              } text-white p-4 rounded-md border`}>
                {transactionStatus.message}
              </div>
            )}

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-2 border border-gray-600/50 rounded-md text-gray-300 hover:bg-gray-800/50 focus:outline-none transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!isWalletConnected}
                className={`btn-primary px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900 ${!isWalletConnected ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Post Job
              </button>
            </div>
          </form>
        ) : (
          <div className="glass-card p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto mb-4"></div>
            <h2 className="text-xl font-bold mb-2 text-white">Posting Your Job...</h2>
            <p className="text-gray-400">Please confirm the transaction in your wallet</p>
            {transactionStatus.message && (
              <p className={`mt-4 ${transactionStatus.type === 'error' ? 'text-red-400' : 'text-gray-300'}`}>
                {transactionStatus.message}
              </p>
            )}
          </div>
        )}

        <div className="mt-12 glass-card p-6 border-gradient">
          <h2 className="text-lg font-semibold mb-3 text-gradient">Why post a job on DecentWork Market?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            <div className="absolute inset-0 z-0 opacity-5">
              <img 
                src="/assets/images/projects/project3.jpg" 
                alt="Blockchain Project" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="relative z-10">
              <div className="text-indigo-400 mb-2">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="font-medium mb-1 text-white">Secure Payments</h3>
              <p className="text-sm text-gray-400">Funds are held in escrow until you approve the completed work.</p>
            </div>
            <div className="relative z-10">
              <div className="text-indigo-400 mb-2">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-medium mb-1 text-white">Web3 Talent</h3>
              <p className="text-sm text-gray-400">Access skilled blockchain developers, designers, and consultants.</p>
            </div>
            <div className="relative z-10">
              <div className="text-indigo-400 mb-2">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
              </div>
              <h3 className="font-medium mb-1 text-white">Dispute Resolution</h3>
              <p className="text-sm text-gray-400">Our support team helps resolve any issues that may arise.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostJobPage; 
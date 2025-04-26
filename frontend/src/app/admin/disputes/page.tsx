'use client';

import React, { useState } from 'react';
import Link from 'next/link';

// Mock data types
interface User {
  id: string;
  name: string;
  walletAddress: string;
  avatar?: string;
}

interface DisputeJob {
  id: string;
  title: string;
  description: string;
  budget: {
    amount: number;
    currency: 'SOL' | 'ETH' | 'USDC';
  };
  deadline: Date;
  client: User;
  freelancer: User;
  status: 'disputed';
  createdAt: Date;
}

interface Message {
  id: string;
  sender: User;
  content: string;
  timestamp: Date;
  attachments?: { name: string; url: string; type: string }[];
}

interface Evidence {
  id: string;
  title: string;
  description: string;
  url: string;
  submittedBy: User;
  submittedAt: Date;
  type: 'document' | 'image' | 'code' | 'other';
}

interface Dispute {
  id: string;
  job: DisputeJob;
  reason: string;
  initiator: User;
  respondent: User;
  status: 'pending' | 'reviewing' | 'resolved';
  resolutionType?: 'freelancer' | 'client' | 'split';
  splitRatio?: number;
  messages: Message[];
  evidence: Evidence[];
  createdAt: Date;
  resolvedAt?: Date;
  resolvedBy?: User;
  notes?: string;
}

// Mock dispute data
const MOCK_DISPUTES: Dispute[] = [
  {
    id: 'd1',
    job: {
      id: 'j1',
      title: 'Smart Contract Development for NFT Marketplace',
      description: 'Create ERC-721 and ERC-1155 smart contracts for an NFT marketplace with royalty features.',
      budget: {
        amount: 2.5,
        currency: 'ETH',
      },
      deadline: new Date('2023-12-15'),
      client: {
        id: 'u1',
        name: 'John Doe',
        walletAddress: '0x1234...5678',
        avatar: '/avatars/john.jpg',
      },
      freelancer: {
        id: 'u2',
        name: 'Jane Smith',
        walletAddress: '0x8765...4321',
        avatar: '/avatars/jane.jpg',
      },
      status: 'disputed',
      createdAt: new Date('2023-11-01'),
    },
    reason: 'Work not completed according to specifications',
    initiator: {
      id: 'u1',
      name: 'John Doe',
      walletAddress: '0x1234...5678',
      avatar: '/avatars/john.jpg',
    },
    respondent: {
      id: 'u2',
      name: 'Jane Smith',
      walletAddress: '0x8765...4321',
      avatar: '/avatars/jane.jpg',
    },
    status: 'pending',
    messages: [
      {
        id: 'm1',
        sender: {
          id: 'u1',
          name: 'John Doe',
          walletAddress: '0x1234...5678',
        },
        content: 'The delivered smart contracts do not include the royalty functionality as specified in the requirements.',
        timestamp: new Date('2023-11-20T10:30:00'),
      },
      {
        id: 'm2',
        sender: {
          id: 'u2',
          name: 'Jane Smith',
          walletAddress: '0x8765...4321',
        },
        content: 'The royalty functionality is implemented in the setRoyalties() function. Please check the documentation I provided.',
        timestamp: new Date('2023-11-20T11:45:00'),
        attachments: [
          {
            name: 'documentation.pdf',
            url: '/files/documentation.pdf',
            type: 'application/pdf',
          },
        ],
      },
    ],
    evidence: [
      {
        id: 'e1',
        title: 'Original Job Requirements',
        description: 'The original job posting with detailed requirements',
        url: '/files/requirements.pdf',
        submittedBy: {
          id: 'u1',
          name: 'John Doe',
          walletAddress: '0x1234...5678',
        },
        submittedAt: new Date('2023-11-20T09:15:00'),
        type: 'document',
      },
      {
        id: 'e2',
        title: 'Delivered Code',
        description: 'The smart contract code I delivered',
        url: '/files/smart-contract.sol',
        submittedBy: {
          id: 'u2',
          name: 'Jane Smith',
          walletAddress: '0x8765...4321',
        },
        submittedAt: new Date('2023-11-20T11:30:00'),
        type: 'code',
      },
    ],
    createdAt: new Date('2023-11-20T09:00:00'),
  },
  {
    id: 'd2',
    job: {
      id: 'j2',
      title: 'Solana DeFi Dashboard UI',
      description: 'Create a user interface for a Solana DeFi application with wallet integration.',
      budget: {
        amount: 120,
        currency: 'SOL',
      },
      deadline: new Date('2023-11-30'),
      client: {
        id: 'u3',
        name: 'Alice Johnson',
        walletAddress: 'Avs23...9f8h',
      },
      freelancer: {
        id: 'u4',
        name: 'Bob Williams',
        walletAddress: 'SjkL1...p09m',
      },
      status: 'disputed',
      createdAt: new Date('2023-10-15'),
    },
    reason: 'Missed deadline without communication',
    initiator: {
      id: 'u3',
      name: 'Alice Johnson',
      walletAddress: 'Avs23...9f8h',
    },
    respondent: {
      id: 'u4',
      name: 'Bob Williams',
      walletAddress: 'SjkL1...p09m',
    },
    status: 'reviewing',
    messages: [
      {
        id: 'm3',
        sender: {
          id: 'u3',
          name: 'Alice Johnson',
          walletAddress: 'Avs23...9f8h',
        },
        content: 'The deadline was November 15th, but I have not received any updates or final work.',
        timestamp: new Date('2023-11-16T14:20:00'),
      },
      {
        id: 'm4',
        sender: {
          id: 'u4',
          name: 'Bob Williams',
          walletAddress: 'SjkL1...p09m',
        },
        content: 'I apologize for the delay. I had a family emergency and couldn't work for a week. I've completed 80% of the work and can deliver the final version by November 25th.',
        timestamp: new Date('2023-11-17T09:10:00'),
      },
    ],
    evidence: [
      {
        id: 'e3',
        title: 'Contract Agreement',
        description: 'Contract showing the agreed deadline',
        url: '/files/contract.pdf',
        submittedBy: {
          id: 'u3',
          name: 'Alice Johnson',
          walletAddress: 'Avs23...9f8h',
        },
        submittedAt: new Date('2023-11-16T14:25:00'),
        type: 'document',
      },
      {
        id: 'e4',
        title: 'Work Progress',
        description: 'Screenshots of the current progress',
        url: '/files/progress.zip',
        submittedBy: {
          id: 'u4',
          name: 'Bob Williams',
          walletAddress: 'SjkL1...p09m',
        },
        submittedAt: new Date('2023-11-17T09:15:00'),
        type: 'image',
      },
    ],
    createdAt: new Date('2023-11-16T14:00:00'),
  },
];

const AdminDisputesPage = () => {
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  const [adminNote, setAdminNote] = useState('');
  const [resolutionType, setResolutionType] = useState<string>('');
  const [splitRatio, setSplitRatio] = useState<number>(50);

  const handleResolveDispute = () => {
    // In a real app, this would call a smart contract function to resolve the dispute
    alert(`Dispute resolved with: ${resolutionType} ${resolutionType === 'split' ? `(${splitRatio}% to freelancer)` : ''}`);
    // Reset the form
    setResolutionType('');
    setSplitRatio(50);
    setAdminNote('');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dispute Resolution</h1>
          <p className="text-gray-400">Resolve disputes between clients and freelancers</p>
        </header>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Disputes List */}
          <div className="lg:w-1/3">
            <div className="bg-gray-800 rounded-lg p-4">
              <h2 className="text-xl font-semibold mb-4">Active Disputes</h2>
              <div className="space-y-4">
                {MOCK_DISPUTES.map((dispute) => (
                  <div 
                    key={dispute.id} 
                    className={`p-4 rounded-lg cursor-pointer transition-all ${
                      selectedDispute?.id === dispute.id 
                        ? 'bg-indigo-900 border border-indigo-500' 
                        : 'bg-gray-700 hover:bg-gray-600'
                    }`}
                    onClick={() => setSelectedDispute(dispute)}
                  >
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">{dispute.job.title}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        dispute.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        dispute.status === 'reviewing' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {dispute.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-300 mb-2">
                      {dispute.reason.length > 60 
                        ? `${dispute.reason.substring(0, 60)}...` 
                        : dispute.reason}
                    </p>
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>Initiated: {dispute.createdAt.toLocaleDateString()}</span>
                      <span>{dispute.job.budget.amount} {dispute.job.budget.currency}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Dispute Details */}
          {selectedDispute ? (
            <div className="lg:w-2/3">
              <div className="bg-gray-800 rounded-lg p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold">{selectedDispute.job.title}</h2>
                    <p className="text-indigo-400">Dispute ID: {selectedDispute.id}</p>
                  </div>
                  <span className={`text-sm px-3 py-1 rounded-full ${
                    selectedDispute.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    selectedDispute.status === 'reviewing' ? 'bg-blue-100 text-blue-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {selectedDispute.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2">Client</h3>
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold mr-3">
                        {selectedDispute.job.client.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium">{selectedDispute.job.client.name}</p>
                        <p className="text-sm text-gray-400">{selectedDispute.job.client.walletAddress}</p>
                      </div>
                    </div>
                    {selectedDispute.initiator.id === selectedDispute.job.client.id && (
                      <div className="mt-2 text-xs bg-red-900 text-red-300 px-2 py-1 rounded inline-block">
                        Dispute Initiator
                      </div>
                    )}
                  </div>
                  
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2">Freelancer</h3>
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold mr-3">
                        {selectedDispute.job.freelancer.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium">{selectedDispute.job.freelancer.name}</p>
                        <p className="text-sm text-gray-400">{selectedDispute.job.freelancer.walletAddress}</p>
                      </div>
                    </div>
                    {selectedDispute.initiator.id === selectedDispute.job.freelancer.id && (
                      <div className="mt-2 text-xs bg-red-900 text-red-300 px-2 py-1 rounded inline-block">
                        Dispute Initiator
                      </div>
                    )}
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-3">Dispute Details</h3>
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <p className="mb-4"><strong>Reason:</strong> {selectedDispute.reason}</p>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-400">Budget</p>
                        <p className="font-medium">{selectedDispute.job.budget.amount} {selectedDispute.job.budget.currency}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Deadline</p>
                        <p className="font-medium">{selectedDispute.job.deadline.toLocaleDateString()}</p>
                      </div>
                    </div>
                    <p className="text-sm"><strong>Job Description:</strong> {selectedDispute.job.description}</p>
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-3">Evidence</h3>
                  <div className="bg-gray-700 p-4 rounded-lg">
                    {selectedDispute.evidence.map((evidence) => (
                      <div key={evidence.id} className="mb-4 pb-4 border-b border-gray-600 last:border-b-0 last:mb-0 last:pb-0">
                        <div className="flex justify-between mb-2">
                          <h4 className="font-medium">{evidence.title}</h4>
                          <span className="text-xs bg-gray-600 text-gray-300 px-2 py-1 rounded">
                            {evidence.type}
                          </span>
                        </div>
                        <p className="text-sm text-gray-300 mb-2">{evidence.description}</p>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-gray-400">
                            Submitted by {evidence.submittedBy.name} on {evidence.submittedAt.toLocaleString()}
                          </span>
                          <a 
                            href={evidence.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-indigo-400 hover:underline"
                          >
                            View Evidence
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-3">Messages</h3>
                  <div className="bg-gray-700 p-4 rounded-lg max-h-80 overflow-y-auto">
                    {selectedDispute.messages.map((message) => (
                      <div key={message.id} className="mb-4 last:mb-0">
                        <div className="flex items-start mb-2">
                          <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-sm font-bold mr-2">
                            {message.sender.name.charAt(0)}
                          </div>
                          <div>
                            <div className="flex items-center">
                              <p className="font-medium">{message.sender.name}</p>
                              <span className="text-xs text-gray-400 ml-2">
                                {message.timestamp.toLocaleString()}
                              </span>
                            </div>
                            <p className="text-sm mt-1">{message.content}</p>
                            {message.attachments && message.attachments.length > 0 && (
                              <div className="mt-2">
                                {message.attachments.map((attachment, index) => (
                                  <a 
                                    key={index}
                                    href={attachment.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center text-xs bg-gray-600 text-gray-200 px-2 py-1 rounded mr-2 hover:bg-gray-500"
                                  >
                                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clipRule="evenodd" />
                                    </svg>
                                    {attachment.name}
                                  </a>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Dispute Resolution Form */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Resolve Dispute</h3>
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Resolution Type
                      </label>
                      <div className="grid grid-cols-3 gap-4">
                        <label className="flex items-center p-3 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors">
                          <input
                            type="radio"
                            name="resolutionType"
                            value="freelancer"
                            checked={resolutionType === 'freelancer'}
                            onChange={(e) => setResolutionType(e.target.value)}
                            className="mr-2"
                          />
                          <span>Pay Freelancer</span>
                        </label>
                        <label className="flex items-center p-3 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors">
                          <input
                            type="radio"
                            name="resolutionType"
                            value="client"
                            checked={resolutionType === 'client'}
                            onChange={(e) => setResolutionType(e.target.value)}
                            className="mr-2"
                          />
                          <span>Refund Client</span>
                        </label>
                        <label className="flex items-center p-3 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors">
                          <input
                            type="radio"
                            name="resolutionType"
                            value="split"
                            checked={resolutionType === 'split'}
                            onChange={(e) => setResolutionType(e.target.value)}
                            className="mr-2"
                          />
                          <span>Split Funds</span>
                        </label>
                      </div>
                    </div>

                    {resolutionType === 'split' && (
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Split Ratio (% to freelancer)
                        </label>
                        <div className="flex items-center">
                          <input
                            type="range"
                            min="0"
                            max="100"
                            step="5"
                            value={splitRatio}
                            onChange={(e) => setSplitRatio(parseInt(e.target.value))}
                            className="w-full mr-4"
                          />
                          <span className="w-16 text-center bg-gray-800 py-1 px-2 rounded">
                            {splitRatio}%
                          </span>
                        </div>
                        <div className="flex justify-between mt-2 text-sm text-gray-400">
                          <span>Freelancer: {splitRatio}%</span>
                          <span>Client: {100 - splitRatio}%</span>
                        </div>
                      </div>
                    )}

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Admin Notes
                      </label>
                      <textarea
                        value={adminNote}
                        onChange={(e) => setAdminNote(e.target.value)}
                        className="w-full bg-gray-800 border border-gray-600 rounded-md py-2 px-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        rows={3}
                        placeholder="Enter your resolution notes here..."
                      ></textarea>
                    </div>

                    <div className="flex justify-end">
                      <button
                        onClick={handleResolveDispute}
                        disabled={!resolutionType}
                        className={`px-4 py-2 rounded-md ${
                          resolutionType
                            ? 'bg-indigo-600 hover:bg-indigo-700'
                            : 'bg-gray-600 cursor-not-allowed'
                        } transition-colors`}
                      >
                        Resolve Dispute
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="lg:w-2/3">
              <div className="bg-gray-800 rounded-lg p-6 h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="text-gray-400 mb-4">
                    <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">No Dispute Selected</h3>
                  <p className="text-gray-400 max-w-md">
                    Select a dispute from the list to view details and resolve the conflict.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDisputesPage; 
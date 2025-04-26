import React from 'react';
import Link from 'next/link';
import GridBackground from '../components/GridBackground';

const HowItWorksPage = () => {
  return (
    <div className="min-h-screen py-8">
      <div className="relative">
        <div className="absolute inset-0 -z-10 opacity-20">
          <GridBackground />
        </div>
        
        {/* Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 fade-in-up">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4 text-gradient">How DecentWork Market Works</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              A simple, secure process for Web3 freelancing and hiring talent
            </p>
          </div>
        </div>
        
        {/* Process Overview */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="glass-card p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500/30 to-purple-600/30 border border-indigo-500/50 rounded-full flex items-center justify-center mb-4 text-xl font-bold mx-auto">1</div>
              <h3 className="text-xl font-semibold mb-2 text-white">Create Profile</h3>
              <p className="text-gray-300">Set up your account with your wallet and build your on-chain portfolio</p>
            </div>
            
            <div className="glass-card p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500/30 to-purple-600/30 border border-indigo-500/50 rounded-full flex items-center justify-center mb-4 text-xl font-bold mx-auto">2</div>
              <h3 className="text-xl font-semibold mb-2 text-white">Post or Find Jobs</h3>
              <p className="text-gray-300">Post a job or browse available projects to find the perfect match</p>
            </div>
            
            <div className="glass-card p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500/30 to-purple-600/30 border border-indigo-500/50 rounded-full flex items-center justify-center mb-4 text-xl font-bold mx-auto">3</div>
              <h3 className="text-xl font-semibold mb-2 text-white">Secure Escrow</h3>
              <p className="text-gray-300">Funds are secured in a decentralized escrow smart contract</p>
            </div>
            
            <div className="glass-card p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500/30 to-purple-600/30 border border-indigo-500/50 rounded-full flex items-center justify-center mb-4 text-xl font-bold mx-auto">4</div>
              <h3 className="text-xl font-semibold mb-2 text-white">Get Paid</h3>
              <p className="text-gray-300">Complete the work and receive payment directly to your wallet</p>
            </div>
          </div>
        </div>
        
        {/* For Clients Section */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <div className="glass-card p-8">
            <h2 className="text-3xl font-bold mb-6 text-gradient">For Clients</h2>
            
            <div className="space-y-6">
              <div className="flex">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-10 h-10 bg-indigo-500/30 border border-indigo-500/50 rounded-full flex items-center justify-center text-lg font-bold">1</div>
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-semibold mb-2 text-white">Post Your Job</h3>
                  <p className="text-gray-300 mb-3">Create a detailed job listing with your requirements, budget, and timeline. Be specific about the skills and experience you're looking for.</p>
                  <div className="bg-gray-800/50 p-4 rounded-md border border-gray-700/50">
                    <p className="text-gray-400 text-sm"><strong>Pro Tip:</strong> Include clear deliverables and project milestones to attract more qualified freelancers.</p>
                  </div>
                </div>
              </div>
              
              <div className="flex">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-10 h-10 bg-indigo-500/30 border border-indigo-500/50 rounded-full flex items-center justify-center text-lg font-bold">2</div>
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-semibold mb-2 text-white">Review Bids</h3>
                  <p className="text-gray-300 mb-3">Talented freelancers will submit bids with their proposals, timelines, and rates. Review their on-chain portfolios and past work history to make an informed decision.</p>
                  <div className="bg-gray-800/50 p-4 rounded-md border border-gray-700/50">
                    <p className="text-gray-400 text-sm"><strong>Pro Tip:</strong> Look beyond the price - consider the freelancer's expertise, communication skills, and specialized knowledge.</p>
                  </div>
                </div>
              </div>
              
              <div className="flex">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-10 h-10 bg-indigo-500/30 border border-indigo-500/50 rounded-full flex items-center justify-center text-lg font-bold">3</div>
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-semibold mb-2 text-white">Fund the Escrow</h3>
                  <p className="text-gray-300 mb-3">Once you've selected a freelancer, fund the escrow smart contract with your payment. The funds remain secure and are only released when you approve the completed work.</p>
                  <div className="bg-gray-800/50 p-4 rounded-md border border-gray-700/50">
                    <p className="text-gray-400 text-sm"><strong>Pro Tip:</strong> For larger projects, consider funding in milestones to manage risk and ensure continuous progress.</p>
                  </div>
                </div>
              </div>
              
              <div className="flex">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-10 h-10 bg-indigo-500/30 border border-indigo-500/50 rounded-full flex items-center justify-center text-lg font-bold">4</div>
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-semibold mb-2 text-white">Release Payment</h3>
                  <p className="text-gray-300 mb-3">Review the delivered work and release payment from escrow when satisfied. The funds are immediately transferred to the freelancer's wallet.</p>
                  <div className="bg-gray-800/50 p-4 rounded-md border border-gray-700/50">
                    <p className="text-gray-400 text-sm"><strong>Pro Tip:</strong> Provide feedback and ratings to help build the freelancer's reputation on the platform.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 text-center">
              <Link href="/jobs/post" className="btn-primary px-8 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-medium transition-colors">
                Post a Job Now
              </Link>
            </div>
          </div>
        </div>
        
        {/* For Freelancers Section */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <div className="glass-card p-8">
            <h2 className="text-3xl font-bold mb-6 text-gradient">For Freelancers</h2>
            
            <div className="space-y-6">
              <div className="flex">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-10 h-10 bg-purple-500/30 border border-purple-500/50 rounded-full flex items-center justify-center text-lg font-bold">1</div>
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-semibold mb-2 text-white">Create Your Portfolio</h3>
                  <p className="text-gray-300 mb-3">Build your on-chain portfolio showcasing your skills, past projects, and Web3 experience. Your work history and client ratings are stored permanently on the blockchain.</p>
                  <div className="bg-gray-800/50 p-4 rounded-md border border-gray-700/50">
                    <p className="text-gray-400 text-sm"><strong>Pro Tip:</strong> Highlight specialized skills and niche expertise to stand out in the competitive Web3 space.</p>
                  </div>
                </div>
              </div>
              
              <div className="flex">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-10 h-10 bg-purple-500/30 border border-purple-500/50 rounded-full flex items-center justify-center text-lg font-bold">2</div>
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-semibold mb-2 text-white">Find and Bid on Jobs</h3>
                  <p className="text-gray-300 mb-3">Browse available projects that match your skills. Submit detailed proposals explaining your approach, timeline, and why you're the right person for the job.</p>
                  <div className="bg-gray-800/50 p-4 rounded-md border border-gray-700/50">
                    <p className="text-gray-400 text-sm"><strong>Pro Tip:</strong> Personalize each bid and demonstrate your understanding of the project requirements to increase your chances of being selected.</p>
                  </div>
                </div>
              </div>
              
              <div className="flex">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-10 h-10 bg-purple-500/30 border border-purple-500/50 rounded-full flex items-center justify-center text-lg font-bold">3</div>
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-semibold mb-2 text-white">Complete the Work</h3>
                  <p className="text-gray-300 mb-3">Once your bid is accepted and the escrow is funded, start working on the project. Communicate regularly with the client and deliver according to the agreed timeline.</p>
                  <div className="bg-gray-800/50 p-4 rounded-md border border-gray-700/50">
                    <p className="text-gray-400 text-sm"><strong>Pro Tip:</strong> Keep clear documentation of your work process for transparency and to help resolve any potential disputes.</p>
                  </div>
                </div>
              </div>
              
              <div className="flex">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-10 h-10 bg-purple-500/30 border border-purple-500/50 rounded-full flex items-center justify-center text-lg font-bold">4</div>
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-semibold mb-2 text-white">Get Paid Instantly</h3>
                  <p className="text-gray-300 mb-3">Once the client approves your work, payment is automatically released from escrow to your wallet. No delays, no intermediaries.</p>
                  <div className="bg-gray-800/50 p-4 rounded-md border border-gray-700/50">
                    <p className="text-gray-400 text-sm"><strong>Pro Tip:</strong> Ask satisfied clients for reviews to build your on-chain reputation and attract more high-quality projects.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 text-center">
              <Link href="/jobs/browse" className="btn-primary px-8 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors">
                Find Jobs Now
              </Link>
            </div>
          </div>
        </div>
        
        {/* Dispute Resolution */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <div className="glass-card p-8 border-gradient">
            <h2 className="text-3xl font-bold mb-4 text-gradient">Fair Dispute Resolution</h2>
            <p className="text-gray-300 mb-6">In the rare event of a disagreement, our decentralized dispute resolution protocol ensures fair outcomes for both parties.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-800/50 p-5 rounded-md border border-gray-700/50">
                <div className="text-indigo-400 mb-3">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="font-medium mb-2 text-white">Impartial Mediation</h3>
                <p className="text-sm text-gray-400">Disputes are reviewed by a decentralized panel of experienced mediators who examine the evidence and project history.</p>
              </div>
              
              <div className="bg-gray-800/50 p-5 rounded-md border border-gray-700/50">
                <div className="text-indigo-400 mb-3">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                  </svg>
                </div>
                <h3 className="font-medium mb-2 text-white">Evidence-Based</h3>
                <p className="text-sm text-gray-400">All relevant project communications, deliverables, and milestones are considered when resolving disputes.</p>
              </div>
              
              <div className="bg-gray-800/50 p-5 rounded-md border border-gray-700/50">
                <div className="text-indigo-400 mb-3">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="font-medium mb-2 text-white">Quick Resolution</h3>
                <p className="text-sm text-gray-400">Our streamlined process ensures disputes are resolved quickly, typically within 3-5 days.</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* FAQ Section */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center text-gradient">Frequently Asked Questions</h2>
          
          <div className="space-y-4">
            <div className="glass-card p-6">
              <h3 className="text-xl font-semibold mb-2 text-white">What cryptocurrencies are supported?</h3>
              <p className="text-gray-300">Currently, we support payments in USDC, ETH, and SOL. More tokens will be added in the future based on community demand.</p>
            </div>
            
            <div className="glass-card p-6">
              <h3 className="text-xl font-semibold mb-2 text-white">How are platform fees calculated?</h3>
              <p className="text-gray-300">We charge a 5% platform fee on completed jobs, which is automatically deducted when funds are released from escrow. There are no additional hidden fees.</p>
            </div>
            
            <div className="glass-card p-6">
              <h3 className="text-xl font-semibold mb-2 text-white">How do I connect my wallet?</h3>
              <p className="text-gray-300">We support Phantom and MetaMask wallets. Simply click on "Connect Wallet" in the top right corner and follow the prompts to connect your preferred wallet.</p>
            </div>
            
            <div className="glass-card p-6">
              <h3 className="text-xl font-semibold mb-2 text-white">What if I need to cancel a job?</h3>
              <p className="text-gray-300">If work hasn't started, clients can cancel a job and receive a full refund. If work is in progress, the dispute resolution process will determine how to fairly allocate the escrowed funds based on completed work.</p>
            </div>
            
            <div className="glass-card p-6">
              <h3 className="text-xl font-semibold mb-2 text-white">Is my data private?</h3>
              <p className="text-gray-300">While job listings and portfolios are public, private communications and project details are encrypted and only accessible to the involved parties.</p>
            </div>
          </div>
        </div>
        
        {/* CTA */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <div className="glass-card p-10 text-center relative overflow-hidden">
            <div className="absolute inset-0 z-0">
              <img 
                src="/assets/images/projects/project1.jpg" 
                alt="Blockchain Project" 
                className="w-full h-full object-cover opacity-10"
              />
            </div>
            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-4 text-gradient">Ready to get started?</h2>
              <p className="text-xl text-gray-300 mb-8">Join thousands of Web3 professionals already using DecentWork Market</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/auth/signup?type=client" className="btn-primary px-8 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-medium transition-colors">
                  Hire Talent
                </Link>
                <Link href="/auth/signup?type=freelancer" className="btn-primary px-8 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors">
                  Find Work
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorksPage; 
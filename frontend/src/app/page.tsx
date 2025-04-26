import Link from 'next/link';
import GridBackground from './components/GridBackground';

export default function Home() {
  return (
    <div className="text-white">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center min-h-[80vh]">
        <div className="absolute inset-0 opacity-20">
          <GridBackground />
        </div>
        <div className="absolute inset-0 z-0">
          <img 
            src="/assets/images/backgrounds/hero-bg.jpg" 
            alt="Background" 
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto text-center fade-in-up">
          <h1 className="text-4xl sm:text-6xl font-bold mb-6 text-gradient">
            Decentralized Freelancing for Web3 Talent
          </h1>
          <p className="text-xl sm:text-2xl mb-10 text-gray-300">
            Connect, work, and get paid securely across blockchains with our trustless freelance marketplace
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/jobs/browse" className="btn-primary px-8 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-medium transition-colors">
              Find Work
            </Link>
            <Link href="/jobs/post" className="btn-primary px-8 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors">
              Hire Talent
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gradient">Why Choose DecentWork Market</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-card p-6">
              <div className="w-12 h-12 bg-indigo-500/30 border border-indigo-500/50 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Cross-Chain Escrow</h3>
              <p className="text-gray-300">Work and get paid in either Solana or Ethereum with our secure cross-chain escrow system</p>
            </div>
            
            <div className="glass-card p-6">
              <div className="w-12 h-12 bg-purple-500/30 border border-purple-500/50 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Fair Dispute Resolution</h3>
              <p className="text-gray-300">Transparent dispute resolution protocol with impartial mediators and on-chain evidence</p>
            </div>
            
            <div className="glass-card p-6">
              <div className="w-12 h-12 bg-blue-500/30 border border-blue-500/50 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">On-Chain Portfolios</h3>
              <p className="text-gray-300">Build a verifiable reputation with on-chain portfolios showcasing your project history</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gradient">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center glass-card p-6">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500/30 to-purple-600/30 border border-indigo-500/50 rounded-full flex items-center justify-center mb-4 text-xl font-bold">1</div>
              <h3 className="text-xl font-semibold mb-2 text-white">Post a Job</h3>
              <p className="text-gray-300">Create a detailed job listing with your requirements and budget</p>
            </div>
            
            <div className="flex flex-col items-center text-center glass-card p-6">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500/30 to-purple-600/30 border border-indigo-500/50 rounded-full flex items-center justify-center mb-4 text-xl font-bold">2</div>
              <h3 className="text-xl font-semibold mb-2 text-white">Choose Talent</h3>
              <p className="text-gray-300">Review bids from qualified freelancers and select the best match</p>
            </div>
            
            <div className="flex flex-col items-center text-center glass-card p-6">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500/30 to-purple-600/30 border border-indigo-500/50 rounded-full flex items-center justify-center mb-4 text-xl font-bold">3</div>
              <h3 className="text-xl font-semibold mb-2 text-white">Secure Escrow</h3>
              <p className="text-gray-300">Funds are held securely until project milestones are completed</p>
            </div>
            
            <div className="flex flex-col items-center text-center glass-card p-6">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500/30 to-purple-600/30 border border-indigo-500/50 rounded-full flex items-center justify-center mb-4 text-xl font-bold">4</div>
              <h3 className="text-xl font-semibold mb-2 text-white">Release Payment</h3>
              <p className="text-gray-300">Approve work and release payment to the freelancer</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-800/50 to-purple-900/50 backdrop-blur-sm"></div>
        <div className="absolute inset-0 z-0">
          <img 
            src="/assets/images/backgrounds/cta-bg.jpg" 
            alt="Background" 
            className="w-full h-full object-cover opacity-30"
          />
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10 glass-card p-10 border-gradient">
          <h2 className="text-3xl font-bold mb-6 text-gradient">Ready to join the future of work?</h2>
          <p className="text-xl mb-8 text-gray-300">Create your profile today and start connecting with the best Web3 talent worldwide</p>
          <Link href="/auth/signup" className="btn-primary px-8 py-3 bg-white text-indigo-900 hover:bg-gray-200 rounded-lg font-medium transition-colors">
            Get Started
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 glass-card bg-opacity-30 mt-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 text-gradient">DecentWork Market</h3>
            <p className="text-gray-400">The premier decentralized marketplace for Web3 freelancers and clients.</p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-white">For Freelancers</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/jobs/browse" className="hover:text-white transition-colors">Find Jobs</Link></li>
              <li><Link href="/profile/create" className="hover:text-white transition-colors">Create Profile</Link></li>
              <li><Link href="/resources/freelancers" className="hover:text-white transition-colors">Resources</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-white">For Clients</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/jobs/post" className="hover:text-white transition-colors">Post a Job</Link></li>
              <li><Link href="/freelancers/browse" className="hover:text-white transition-colors">Find Talent</Link></li>
              <li><Link href="/resources/clients" className="hover:text-white transition-colors">Resources</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-white">Connect</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              <li><Link href="/docs" className="hover:text-white transition-colors">Documentation</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-gray-700/50 text-center text-gray-400">
          <p>© 2023 DecentWork Market. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

'use client';

import { FC } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

const AboutPage: FC = () => {
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
        staggerChildren: 0.2
      }
    }
  };

  const teamMembers = [
    {
      id: 1,
      name: 'Alex Smith',
      role: 'Founder & CEO',
      image: '/assets/images/team/placeholder1.jpg'
    },
    {
      id: 2,
      name: 'Sophia Chen',
      role: 'CTO',
      image: '/assets/images/team/placeholder2.jpg'
    },
    {
      id: 3,
      name: 'Marcus Johnson',
      role: 'Lead Developer',
      image: '/assets/images/team/placeholder3.jpg'
    },
    {
      id: 4,
      name: 'Aisha Patel',
      role: 'Product Manager',
      image: '/assets/images/team/placeholder4.jpg'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Hero Section */}
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
              About Our Marketplace
            </h1>
            <p className="text-xl max-w-3xl mx-auto text-gray-300 mb-8">
              We&apos;re building the future of decentralized work through blockchain technology, creating opportunities for freelancers and clients worldwide.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-black/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="relative rounded-2xl p-8 backdrop-blur-sm bg-white/5 border border-white/10"
          >
            <h2 className="text-3xl font-bold mb-6 text-center">Our Mission</h2>
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div>
                <p className="text-lg text-gray-300 mb-6">
                  Our mission is to revolutionize the freelance marketplace by leveraging blockchain technology to create a transparent, secure, and efficient platform where talent meets opportunity.
                </p>
                <p className="text-lg text-gray-300">
                  We believe in a future where work is borderless, payments are instant, and trust is built into the system through smart contracts and decentralized verification.
                </p>
              </div>
              <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 p-6 rounded-xl border border-white/10">
                <h3 className="text-xl font-semibold mb-4">Key Objectives</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="mr-2 text-green-400">✓</span>
                    <span>Eliminate intermediaries and reduce fees</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-green-400">✓</span>
                    <span>Ensure secure and transparent payments</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-green-400">✓</span>
                    <span>Create verifiable reputation systems</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-green-400">✓</span>
                    <span>Empower global remote work opportunities</span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.h2 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-3xl font-bold mb-12 text-center"
          >
            Our Technology
          </motion.h2>
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-8"
          >
            <motion.div variants={fadeIn} className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 p-6 rounded-xl border border-white/10 backdrop-blur-sm">
              <div className="bg-blue-500/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Blockchain Infrastructure</h3>
              <p className="text-gray-300">
                Built on Solana for fast, low-cost transactions. Our platform leverages the power of decentralized networks to provide seamless experiences.
              </p>
            </motion.div>
            
            <motion.div variants={fadeIn} className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 p-6 rounded-xl border border-white/10 backdrop-blur-sm">
              <div className="bg-purple-500/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Enhanced Security</h3>
              <p className="text-gray-300">
                Cryptographic verification ensures identity protection and secure transactions, without the need for centralized intermediaries.
              </p>
            </motion.div>
            
            <motion.div variants={fadeIn} className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 p-6 rounded-xl border border-white/10 backdrop-blur-sm">
              <div className="bg-green-500/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Smart Contracts</h3>
              <p className="text-gray-300">
                Our escrow systems and dispute resolution processes are built on immutable smart contracts that execute automatically when conditions are met.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-black/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <motion.h2 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-3xl font-bold mb-12 text-center"
          >
            Meet Our Team
          </motion.h2>
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {teamMembers.map((member) => (
              <motion.div 
                key={member.id}
                variants={fadeIn}
                className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-xl border border-white/10 overflow-hidden backdrop-blur-sm"
              >
                <div className="aspect-square relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent z-10"></div>
                  <Image 
                    src={member.image}
                    alt={`${member.name} - ${member.role}`}
                    width={300}
                    height={300}
                    className="object-cover"
                  />
                </div>
                <div className="p-4 text-center">
                  <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                  <p className="text-gray-400">{member.role}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="bg-gradient-to-br from-blue-900/40 to-purple-900/40 rounded-2xl p-8 md:p-12 border border-white/10 text-center backdrop-blur-sm"
          >
            <h2 className="text-3xl font-bold mb-4">Join Our Community</h2>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Be part of the revolution in decentralized freelancing. Create your account today and connect with a global community of talent.
            </p>
            <Link href="/signup" className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-lg transition-all duration-200 transform hover:scale-105">
              Sign Up Now
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage; 
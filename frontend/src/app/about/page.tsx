'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function AboutPage() {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
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

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center text-center">
            <motion.h1 
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="text-5xl md:text-6xl font-bold text-gray-900 mb-6"
            >
              About Our Marketplace
            </motion.h1>
            <motion.p 
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="text-xl text-gray-600 max-w-3xl mb-10"
            >
              Building the future of decentralized commerce where privacy, security, and ownership are fundamental rights.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              className="md:w-1/2"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-gray-600 mb-6">
                We&apos;re building a new paradigm for digital commerce that puts users first. Our decentralized marketplace eliminates intermediaries, reduces fees, and returns control to both buyers and sellers.
              </p>
              <p className="text-gray-600 mb-6">
                By leveraging blockchain technology, we ensure that transactions are secure, transparent, and immutable. Smart contracts automate agreements and escrow services, eliminating the need for trust in unknown parties.
              </p>
              <p className="text-gray-600">
                We believe the future of commerce is decentralized, open, and equitable for all participants.
              </p>
            </motion.div>
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              className="md:w-1/2"
            >
              <div className="relative h-80 w-full rounded-lg overflow-hidden shadow-xl">
                <Image 
                  src="/assets/images/mission.jpg" 
                  alt="Our mission" 
                  fill
                  className="object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Our Technology</h2>
            <p className="text-xl text-gray-600 mt-4 max-w-3xl mx-auto">
              Powered by cutting-edge blockchain technology to ensure security, transparency, and trust.
            </p>
          </div>
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              {
                icon: 'blockchain',
                title: 'Blockchain Infrastructure',
                description: 'Built on Ethereum and other leading blockchains to provide a robust foundation for decentralized commerce.'
              },
              {
                icon: 'security',
                title: 'Enhanced Security',
                description: 'Military-grade encryption and decentralized architecture protect your data and transactions.'
              },
              {
                icon: 'escrow',
                title: 'Smart Contracts',
                description: 'Automated escrow services and dispute resolution through programmable smart contracts.'
              }
            ].map((feature, index) => (
              <motion.div 
                key={index}
                variants={fadeIn}
                className="bg-white p-8 rounded-lg shadow-md"
              >
                <div className="w-12 h-12 mb-4">
                  <Image 
                    src={`/assets/images/icons/${feature.icon}.svg`}
                    alt={feature.title}
                    width={48}
                    height={48}
                    className="text-blue-600"
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Our Team</h2>
            <p className="text-xl text-gray-600 mt-4 max-w-3xl mx-auto">
              Meet the innovators and blockchain experts building the future of decentralized commerce.
            </p>
          </div>
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-4 gap-8"
          >
            {[
              {
                name: 'Alex Johnson',
                title: 'CEO & Founder',
                image: '/assets/images/team-1.jpg'
              },
              {
                name: 'Sarah Chen',
                title: 'CTO',
                image: '/assets/images/team-2.jpg'
              },
              {
                name: 'Michael Rodriguez',
                title: 'Head of Product',
                image: '/assets/images/team-3.jpg'
              },
              {
                name: 'Jamie Wilson',
                title: 'Blockchain Lead',
                image: '/assets/images/team-4.jpg'
              }
            ].map((member, index) => (
              <motion.div 
                key={index}
                variants={fadeIn}
                className="text-center"
              >
                <div className="relative h-64 w-64 mx-auto rounded-full overflow-hidden mb-4">
                  <Image 
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
                <p className="text-gray-600">{member.title}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Join Us Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <h2 className="text-3xl font-bold mb-6">Join Our Community</h2>
            <p className="text-xl max-w-3xl mx-auto mb-8">
              Be part of the revolution in decentralized commerce. Join our growing community of buyers, sellers, and blockchain enthusiasts.
            </p>
            <Link 
              href="/signup" 
              className="inline-block px-8 py-3 bg-white text-blue-600 rounded-full font-semibold hover:bg-blue-50 transition-colors"
            >
              Sign Up Now
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
} 
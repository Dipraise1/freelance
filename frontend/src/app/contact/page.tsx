'use client';

import { FC, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const ContactPage: FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('submitting');
    
    // Simulate form submission
    try {
      // In a real implementation, you would send this data to your API
      await new Promise(resolve => setTimeout(resolve, 1500));
      setFormStatus('success');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch {
      setFormStatus('error');
    }
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
        staggerChildren: 0.2
      }
    }
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
              Contact Us
            </h1>
            <p className="text-xl max-w-3xl mx-auto text-gray-300 mb-8">
              Have questions or need assistance? We&apos;re here to help you get the most out of our decentralized marketplace.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Form and Information */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 p-8 rounded-xl border border-white/10 backdrop-blur-sm"
            >
              <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
              
              {formStatus === 'success' && (
                <div className="mb-6 p-4 bg-green-500/20 border border-green-500/30 rounded-lg">
                  <p className="text-green-300">Your message has been sent! We&apos;ll get back to you soon.</p>
                </div>
              )}
              
              {formStatus === 'error' && (
                <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
                  <p className="text-red-300">There was an error sending your message. Please try again.</p>
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Your Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-black/50 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-black/50 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-1">Subject</label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-black/50 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select a topic</option>
                    <option value="general">General Inquiry</option>
                    <option value="support">Technical Support</option>
                    <option value="billing">Billing Question</option>
                    <option value="partnership">Partnership Opportunity</option>
                  </select>
                </div>
                
                <div className="mb-6">
                  <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">Your Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-2 bg-black/50 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  disabled={formStatus === 'submitting'}
                  className="w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-70 disabled:transform-none"
                >
                  {formStatus === 'submitting' ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </motion.div>
            
            {/* Contact Information */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="space-y-8"
            >
              <motion.div variants={fadeIn} className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 p-6 rounded-xl border border-white/10 backdrop-blur-sm">
                <h3 className="text-xl font-semibold mb-4">Connect With Us</h3>
                <p className="text-gray-300 mb-6">
                  Our team is available to assist you with any questions about our decentralized marketplace platform.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-blue-500/20 w-10 h-10 rounded-lg flex items-center justify-center mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-400">Email</h4>
                      <a href="mailto:support@decentralizedmarket.com" className="text-blue-400 hover:text-blue-300">
                        support@decentralizedmarket.com
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-purple-500/20 w-10 h-10 rounded-lg flex items-center justify-center mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-400">Discord</h4>
                      <a href="https://discord.gg/decentralized-marketplace" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300">
                        Join our community
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-green-500/20 w-10 h-10 rounded-lg flex items-center justify-center mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-400">Response Time</h4>
                      <p className="text-white">
                        We typically respond within 24 hours
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              <motion.div variants={fadeIn} className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 p-6 rounded-xl border border-white/10 backdrop-blur-sm">
                <h3 className="text-xl font-semibold mb-4">FAQ</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-lg font-medium mb-1">How do I create a profile?</h4>
                    <p className="text-gray-300">
                      Connect your wallet and click on &quot;Sign Up&quot; to create your profile as a freelancer or client.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-medium mb-1">How does escrow work?</h4>
                    <p className="text-gray-300">
                      Our escrow system uses smart contracts to securely hold funds until project milestones are completed and approved.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-medium mb-1">What if there&apos;s a dispute?</h4>
                    <p className="text-gray-300">
                      Our platform includes a fair dispute resolution process that involves community-based arbitration.
                    </p>
                  </div>
                  
                  <div className="pt-2">
                    <Link href="/faq" className="text-blue-400 hover:text-blue-300 flex items-center">
                      <span>View all FAQs</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Map or Location Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-black/50">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Our Global Presence</h2>
            <p className="text-gray-300 max-w-3xl mx-auto">
              While we&apos;re a decentralized platform with team members around the world, you can find our core team in these locations.
            </p>
          </motion.div>
          
          <div className="relative h-96 rounded-xl overflow-hidden border border-white/10">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 to-purple-900/30 flex items-center justify-center">
              <div className="text-center p-8 backdrop-blur-sm bg-black/20 rounded-xl border border-white/10 max-w-md">
                <h3 className="text-xl font-semibold mb-2">Decentralized & Distributed</h3>
                <p className="text-gray-300 mb-4">
                  Our team is distributed across the globe, working remotely to build the future of decentralized marketplaces.
                </p>
                <div className="flex justify-center space-x-4">
                  <div className="text-center">
                    <div className="font-bold text-3xl text-blue-400">24+</div>
                    <div className="text-sm text-gray-400">Countries</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-3xl text-purple-400">100+</div>
                    <div className="text-sm text-gray-400">Team Members</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-3xl text-green-400">5+</div>
                    <div className="text-sm text-gray-400">Time Zones</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage; 
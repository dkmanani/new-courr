'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Home() {
  const [trackingId, setTrackingId] = useState('');
  const [trackingResult, setTrackingResult] = useState<any>(null);

  const handleTracking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingId.trim()) return;
    
    // Mock tracking data
    const mockResult = {
      id: trackingId,
      fromName: 'John Doe',
      toName: 'Jane Smith',
      fromPlace: 'New York',
      toPlace: 'Los Angeles',
      date: '2024-01-15',
      expectedDelivery: '2024-01-18',
      status: 'In Transit',
      timeline: [
        { status: 'Picked up', date: '2024-01-15', time: '09:00 AM' },
        { status: 'In Transit', date: '2024-01-16', time: '02:30 PM' },
        { status: 'Out for Delivery', date: '2024-01-17', time: '08:00 AM' }
      ]
    };
    
    setTrackingResult(mockResult);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/admin/login" className="text-blue-600 hover:text-blue-800 flex items-center text-xs sm:text-sm">
              <i className="ri-admin-line w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center mr-1 sm:mr-2"></i>
              <span className="hidden sm:inline">Admin Login</span>
              <span className="sm:hidden">Admin</span>
            </Link>
            
            <div className="text-center">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900" style={{ fontFamily: 'Pacifico, serif' }}>
                CourierPro
              </h1>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Link href="/agent/login" className="text-blue-600 hover:text-blue-800 flex items-center text-xs sm:text-sm">
                <i className="ri-user-line w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center mr-1 sm:mr-2"></i>
                <span className="hidden sm:inline">Agent Login</span>
                <span className="sm:hidden">Agent</span>
              </Link>
              <a href="https://wa.me/1234567890" className="bg-green-500 text-white px-2 sm:px-4 py-1 sm:py-2 rounded-full hover:bg-green-600 flex items-center whitespace-nowrap text-xs sm:text-sm">
                <i className="ri-whatsapp-line w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center mr-1 sm:mr-2"></i>
                <span className="hidden sm:inline">WhatsApp Help</span>
                <span className="sm:hidden">Help</span>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section with Animated Background */}
      <section className="relative py-12 sm:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-90"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://readdy.ai/api/search-image?query=Modern%20courier%20delivery%20service%20with%20professional%20delivery%20vehicles%2C%20packages%2C%20and%20logistics%20operations%20in%20a%20clean%20blue%20and%20white%20color%20scheme%20with%20geometric%20patterns%20in%20the%20background&width=1200&height=600&seq=hero1&orientation=landscape')`
          }}
        ></div>
        
        <div className="relative w-full px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-bounce mb-6 sm:mb-8">
            <i className="ri-truck-line w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center text-white text-4xl sm:text-6xl mx-auto"></i>
          </div>
          
          <h2 className="text-2xl sm:text-4xl lg:text-6xl font-bold text-white mb-4 sm:mb-6">
            Fast & Reliable Courier Service
          </h2>
          <p className="text-base sm:text-xl text-white/90 mb-8 sm:mb-12 max-w-2xl mx-auto">
            Track your packages in real-time with our advanced courier management system
          </p>

          {/* Tracking Box */}
          <div className="bg-white rounded-2xl shadow-2xl p-4 sm:p-8 max-w-md mx-auto">
            <h3 className="text-lg sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6">Track Your Package</h3>
            
            <form onSubmit={handleTracking} className="space-y-3 sm:space-y-4">
              <div className="relative">
                <input
                  type="text"
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                  placeholder="Enter Courier ID (e.g., JOH123)"
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs sm:text-sm"
                  required
                />
                <i className="ri-search-line w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center absolute right-3 top-2 sm:top-3 text-gray-400"></i>
              </div>
              
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 sm:py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold whitespace-nowrap text-xs sm:text-sm"
              >
                Track Package
              </button>
            </form>

            {/* Tracking Results */}
            {trackingResult && (
              <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2 sm:mb-3 text-sm sm:text-base">Tracking Results</h4>
                <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
                  <p><span className="font-medium">From:</span> {trackingResult.fromName} - {trackingResult.fromPlace}</p>
                  <p><span className="font-medium">To:</span> {trackingResult.toName} - {trackingResult.toPlace}</p>
                  <p><span className="font-medium">Status:</span> 
                    <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                      {trackingResult.status}
                    </span>
                  </p>
                  <p><span className="font-medium">Expected:</span> {trackingResult.expectedDelivery}</p>
                </div>
                
                <div className="mt-3 sm:mt-4">
                  <h5 className="font-medium text-gray-900 mb-1 sm:mb-2 text-xs sm:text-sm">Timeline:</h5>
                  <div className="space-y-1">
                    {trackingResult.timeline.map((item: any, index: number) => (
                      <div key={index} className="flex items-center space-x-2 text-xs">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span>{item.status} - {item.date} {item.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-12 sm:py-20 bg-white">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-16">
            <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">Why Choose CourierPro?</h2>
            <p className="text-base sm:text-xl text-gray-600 max-w-2xl mx-auto">
              We provide exceptional courier services with cutting-edge technology and unmatched reliability
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="text-center group hover:transform hover:scale-105 transition-all duration-300 p-4">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <i className="ri-time-line w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-white text-xl sm:text-2xl"></i>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-4">Lightning Fast Delivery</h3>
              <p className="text-sm sm:text-base text-gray-600">
                Same-day and next-day delivery options available. Our advanced logistics network ensures your packages reach their destination quickly and safely.
              </p>
            </div>

            <div className="text-center group hover:transform hover:scale-105 transition-all duration-300 p-4">
              <div className="bg-gradient-to-r from-green-500 to-teal-500 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <i className="ri-shield-check-line w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-white text-xl sm:text-2xl"></i>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-4">100% Secure & Insured</h3>
              <p className="text-sm sm:text-base text-gray-600">
                All packages are fully insured and tracked with real-time monitoring. Our secure handling process ensures your items are protected throughout the journey.
              </p>
            </div>

            <div className="text-center group hover:transform hover:scale-105 transition-all duration-300 p-4">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <i className="ri-customer-service-line w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-white text-xl sm:text-2xl"></i>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-4">24/7 Customer Support</h3>
              <p className="text-sm sm:text-base text-gray-600">
                Our dedicated support team is available round the clock to assist you. Get instant help via WhatsApp, phone, or email whenever you need it.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Services Section */}
      <section className="py-12 sm:py-20 bg-gray-50">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-16">
            <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">Our Services</h2>
            <p className="text-base sm:text-xl text-gray-600">From local to international, we deliver everywhere</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="h-32 sm:h-48 bg-gradient-to-br from-blue-500 to-blue-600 relative overflow-hidden">
                <img 
                  src="https://readdy.ai/api/search-image?query=Local%20district%20courier%20delivery%20service%20with%20delivery%20van%20and%20packages%20in%20urban%20city%20environment%2C%20professional%20blue%20and%20white%20color%20scheme&width=400&height=200&seq=service1&orientation=landscape"
                  alt="District Delivery"
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-blue-600/20"></div>
              </div>
              <div className="p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">District Delivery</h3>
                <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
                  Fast local delivery within your district. Same-day delivery available for urgent packages.
                </p>
                <div className="flex items-center text-blue-600">
                  <i className="ri-map-pin-line w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center mr-2"></i>
                  <span className="text-xs sm:text-sm">Local Coverage</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="h-32 sm:h-48 bg-gradient-to-br from-green-500 to-green-600 relative overflow-hidden">
                <img 
                  src="https://readdy.ai/api/search-image?query=State-wide%20courier%20delivery%20service%20with%20interstate%20highway%2C%20delivery%20trucks%2C%20and%20state%20boundary%20map%2C%20professional%20green%20and%20white%20color%20scheme&width=400&height=200&seq=service2&orientation=landscape"
                  alt="State Delivery"
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-green-600/20"></div>
              </div>
              <div className="p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">State-Wide Delivery</h3>
                <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
                  Reliable interstate delivery services. Connect with customers across the entire state network.
                </p>
                <div className="flex items-center text-green-600">
                  <i className="ri-roadster-line w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center mr-2"></i>
                  <span className="text-xs sm:text-sm">Interstate Network</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="h-32 sm:h-48 bg-gradient-to-br from-purple-500 to-purple-600 relative overflow-hidden">
                <img 
                  src="https://readdy.ai/api/search-image?query=International%20courier%20delivery%20service%20with%20airplane%2C%20world%20map%2C%20and%20global%20shipping%20containers%2C%20professional%20purple%20and%20white%20color%20scheme&width=400&height=200&seq=service3&orientation=landscape"
                  alt="International Delivery"
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-purple-600/20"></div>
              </div>
              <div className="p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">International Delivery</h3>
                <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
                  Global shipping solutions with customs clearance and international tracking support.
                </p>
                <div className="flex items-center text-purple-600">
                  <i className="ri-plane-line w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center mr-2"></i>
                  <span className="text-xs sm:text-sm">Worldwide Coverage</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Us Footer */}
      <footer className="bg-white py-8 sm:py-16">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Contact Us</h3>
              <form className="space-y-3 sm:space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <input
                    type="text"
                    placeholder="Your Name"
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs sm:text-sm"
                  />
                  <input
                    type="email"
                    placeholder="Your Email"
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs sm:text-sm"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Subject"
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs sm:text-sm"
                />
                <textarea
                  placeholder="Your Message"
                  rows={4}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs sm:text-sm"
                  maxLength={500}
                ></textarea>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 sm:px-8 py-2 sm:py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold whitespace-nowrap hover:shadow-lg hover:transform hover:scale-105 text-xs sm:text-sm"
                >
                  Send Message
                </button>
              </form>
            </div>

            <div className="flex flex-col justify-center items-center">
              <div className="text-center mb-6 sm:mb-8">
                <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-2 sm:mb-4" style={{ fontFamily: 'Pacifico, serif' }}>
                  CourierPro
                </h2>
                <p className="text-sm sm:text-base text-gray-600 max-w-md">
                  Your trusted partner for fast, secure, and reliable courier services worldwide.
                </p>
              </div>
              
              <div className="flex space-x-4 sm:space-x-6">
                <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors">
                  <i className="ri-facebook-fill w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-xl sm:text-2xl"></i>
                </a>
                <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors">
                  <i className="ri-twitter-fill w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-xl sm:text-2xl"></i>
                </a>
                <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors">
                  <i className="ri-instagram-fill w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-xl sm:text-2xl"></i>
                </a>
                <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors">
                  <i className="ri-linkedin-fill w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-xl sm:text-2xl"></i>
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-200 mt-8 sm:mt-12 pt-6 sm:pt-8 text-center">
            <p className="text-xs sm:text-base text-gray-600">
              © 2024 CourierPro. All rights reserved. Fast, Secure, Reliable.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
import FlightSearch from '../components/FlightSearch';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <section className="text-center space-y-6 mb-12">
          <div className="space-y-4">
            <h1 className="text-5xl font-bold text-gray-900 leading-tight">
              Find Your Perfect
              <span className="text-indigo-600 block">Flight</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Book flights across India with top airlines including IndiGo, Air India, SpiceJet, and Vistara. 
              Compare prices, choose your seats, and enjoy seamless booking experience.
            </p>
          </div>
          
          {/* Key Features */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mt-8">
            <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 shadow-sm">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 text-sm">Best Prices</h3>
              <p className="text-xs text-gray-600 mt-1">Guaranteed lowest fares</p>
            </div>
            
            <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 shadow-sm">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 text-sm">Instant Booking</h3>
              <p className="text-xs text-gray-600 mt-1">Book in under 2 minutes</p>
            </div>
            
            <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 shadow-sm">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 text-sm">24/7 Support</h3>
              <p className="text-xs text-gray-600 mt-1">Round-the-clock assistance</p>
            </div>
            
            <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 shadow-sm">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 text-sm">Secure Payment</h3>
              <p className="text-xs text-gray-600 mt-1">100% safe & secure</p>
            </div>
          </div>
        </section>
        
        {/* Flight Search Component */}
        <FlightSearch />
        
        {/* Statistics Section */}
        <section className="mt-16 bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose SkyBook?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Join thousands of satisfied travelers who trust us for their flight bookings</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-indigo-600 mb-2">15+</div>
              <div className="text-gray-600">Major Cities</div>
              <div className="text-sm text-gray-500 mt-1">Connected across India</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">50K+</div>
              <div className="text-gray-600">Happy Customers</div>
              <div className="text-sm text-gray-500 mt-1">Satisfied travelers</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">100+</div>
              <div className="text-gray-600">Daily Flights</div>
              <div className="text-sm text-gray-500 mt-1">Multiple options</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">4.8★</div>
              <div className="text-gray-600">Customer Rating</div>
              <div className="text-sm text-gray-500 mt-1">Excellent service</div>
            </div>
          </div>
        </section>
        
        {/* Airlines Section */}
        <section className="mt-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Airline Partners</h2>
            <p className="text-gray-600">Book with India's most trusted airlines</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">6E</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">IndiGo</h3>
              <p className="text-sm text-gray-600">India's largest airline with on-time performance</p>
            </div>
            
            <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-red-600">AI</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Air India</h3>
              <p className="text-sm text-gray-600">National carrier with premium services</p>
            </div>
            
            <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-orange-600">SG</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">SpiceJet</h3>
              <p className="text-sm text-gray-600">Low-cost carrier with great value</p>
            </div>
            
            <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">UK</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Vistara</h3>
              <p className="text-sm text-gray-600">Premium full-service experience</p>
            </div>
          </div>
        </section>
        
        {/* Popular Routes */}
        <section className="mt-16 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Popular Routes</h2>
            <p className="text-gray-600">Most searched flight routes in India</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-900">DEL</div>
                  <div className="text-sm text-gray-600">Delhi</div>
                </div>
                <div className="flex-1 mx-4">
                  <div className="border-t-2 border-dashed border-gray-300 relative">
                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                      <svg className="w-4 h-4 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-900">BOM</div>
                  <div className="text-sm text-gray-600">Mumbai</div>
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-600">Starting from</div>
                <div className="text-xl font-bold text-indigo-600">₹5,500</div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-900">BOM</div>
                  <div className="text-sm text-gray-600">Mumbai</div>
                </div>
                <div className="flex-1 mx-4">
                  <div className="border-t-2 border-dashed border-gray-300 relative">
                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                      <svg className="w-4 h-4 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-900">BLR</div>
                  <div className="text-sm text-gray-600">Bengaluru</div>
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-600">Starting from</div>
                <div className="text-xl font-bold text-indigo-600">₹4,900</div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-900">DEL</div>
                  <div className="text-sm text-gray-600">Delhi</div>
                </div>
                <div className="flex-1 mx-4">
                  <div className="border-t-2 border-dashed border-gray-300 relative">
                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                      <svg className="w-4 h-4 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-900">BLR</div>
                  <div className="text-sm text-gray-600">Bengaluru</div>
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-600">Starting from</div>
                <div className="text-xl font-bold text-indigo-600">₹7,800</div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="mt-16 mb-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Complete Travel Solution</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Everything you need for a seamless travel experience</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Easy Booking</h3>
              <p className="text-gray-600">Simple 3-step booking process with instant confirmation</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Flexible Payment</h3>
              <p className="text-gray-600">Multiple payment options including UPI, cards, and net banking</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Mobile Friendly</h3>
              <p className="text-gray-600">Book on-the-go with our responsive mobile interface</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}



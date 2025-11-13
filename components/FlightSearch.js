'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../lib/auth';

export default function FlightSearch() {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState('');
  const [results, setResults] = useState([]);
  const [fromOptions, setFromOptions] = useState([]);
  const [toOptions, setToOptions] = useState([]);
  const [reco, setReco] = useState([]);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { user } = useAuth();

  async function onSearch(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const params = new URLSearchParams({ from, to, date });
      const res = await fetch(`/api/flights/search?${params.toString()}`);
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      setResults(data.flights || []);
    } catch (e) {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  async function suggest(which, term) {
    if (!term) {
      which === 'from' ? setFromOptions([]) : setToOptions([]);
      return;
    }
    const r = await fetch(`/api/airports/suggest?term=${encodeURIComponent(term)}`);
    const d = await r.json();
    which === 'from' ? setFromOptions(d.airports || []) : setToOptions(d.airports || []);
  }

  async function loadRecommendations() {
    try {
      const r = await fetch('/api/flights/recommendations');
      if (!r.ok) throw new Error('Failed');
      const d = await r.json();
      setReco(d.flights || []);
    } catch (e) {
      setReco([]);
    }
  }

  useEffect(() => { 
    loadRecommendations();
  }, []);

  function handleBookNow(flight) {
    if (!user) {
      if (confirm('You need to login to book flights. Would you like to login now?')) {
        router.push('/login');
      }
      return;
    }
    router.push(`/book?flightId=${flight.flight_id}`);
  }

  const getAirlineLogo = (flightNumber) => {
    if (flightNumber.startsWith('6E')) return { bg: 'bg-blue-100', text: 'text-blue-600', code: '6E', name: 'IndiGo' };
    if (flightNumber.startsWith('AI')) return { bg: 'bg-red-100', text: 'text-red-600', code: 'AI', name: 'Air India' };
    if (flightNumber.startsWith('SG')) return { bg: 'bg-orange-100', text: 'text-orange-600', code: 'SG', name: 'SpiceJet' };
    if (flightNumber.startsWith('UK')) return { bg: 'bg-purple-100', text: 'text-purple-600', code: 'UK', name: 'Vistara' };
    return { bg: 'bg-gray-100', text: 'text-gray-600', code: 'GA', name: 'GoFirst' };
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Search Form */}
      <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
        <form onSubmit={onSearch} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* From Input */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <input 
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all" 
                  placeholder="City, Airport or Code" 
                  value={from} 
                  onChange={e=>{ const v=e.target.value; setFrom(v); suggest('from', v); }} 
                />
                {fromOptions.length>0 && (
                  <div className="absolute z-20 bg-white border border-gray-200 rounded-lg shadow-lg w-full mt-1 max-h-60 overflow-auto">
                    {fromOptions.map(o => (
                      <button 
                        type="button" 
                        key={o.airport_id} 
                        onClick={()=>{ setFrom(o.airport_code); setFromOptions([]); }} 
                        className="w-full text-left px-4 py-3 hover:bg-indigo-50 border-b border-gray-100 last:border-b-0 transition-colors"
                      >
                        <div className="font-medium text-gray-900">{o.airport_code}</div>
                        <div className="text-sm text-gray-600">{o.airport_name}, {o.city}</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* To Input */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <input 
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all" 
                  placeholder="City, Airport or Code" 
                  value={to} 
                  onChange={e=>{ const v=e.target.value; setTo(v); suggest('to', v); }} 
                />
                {toOptions.length>0 && (
                  <div className="absolute z-20 bg-white border border-gray-200 rounded-lg shadow-lg w-full mt-1 max-h-60 overflow-auto">
                    {toOptions.map(o => (
                      <button 
                        type="button" 
                        key={o.airport_id} 
                        onClick={()=>{ setTo(o.airport_code); setToOptions([]); }} 
                        className="w-full text-left px-4 py-3 hover:bg-indigo-50 border-b border-gray-100 last:border-b-0 transition-colors"
                      >
                        <div className="font-medium text-gray-900">{o.airport_code}</div>
                        <div className="text-sm text-gray-600">{o.airport_name}, {o.city}</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Date Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Departure Date</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <input 
                  type="date" 
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all" 
                  value={date} 
                  onChange={e=>setDate(e.target.value)} 
                />
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <button 
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-4 px-12 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Searching...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <span>Search Flights</span>
                </div>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Results */}
      <div className="space-y-4">
        {results.map(f => {
          const airline = getAirlineLogo(f.flight_number);
          
          return (
            <div key={f.flight_id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-100">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className={`w-12 h-12 ${airline.bg} rounded-full flex items-center justify-center`}>
                      <span className={`text-lg font-bold ${airline.text}`}>{airline.code}</span>
                    </div>
                    <div>
                      <div className="flex items-center space-x-3">
                        <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
                          {f.flight_number}
                        </span>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{airline.name}</span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mt-1">{f.flight_name}</h3>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="text-center md:text-left">
                      <div className="text-2xl font-bold text-gray-900">
                        {f.departure_date ? new Date(f.departure_date).toLocaleTimeString('en-IN', {hour: '2-digit', minute: '2-digit'}) : '--:--'}
                      </div>
                      <div className="text-sm text-gray-600">{f.departure_airport_code}</div>
                      <div className="text-xs text-gray-500">Departure</div>
                    </div>
                    
                    <div className="flex flex-col items-center justify-center">
                      <div className="text-sm text-gray-500 mb-1">{f.journey_time || '2h 30m'}</div>
                      <div className="flex items-center space-x-2 w-full">
                        <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                        <div className="flex-1 border-t-2 border-dashed border-gray-300 relative">
                          <svg className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                          </svg>
                        </div>
                        <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">Non-stop</div>
                    </div>
                    
                    <div className="text-center md:text-right">
                      <div className="text-2xl font-bold text-gray-900">
                        {f.arrival_date ? new Date(f.arrival_date).toLocaleTimeString('en-IN', {hour: '2-digit', minute: '2-digit'}) : '--:--'}
                      </div>
                      <div className="text-sm text-gray-600">{f.arrival_airport_code}</div>
                      <div className="text-xs text-gray-500">Arrival</div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <span>{f.available_seats} seats left</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Refundable</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                      <span>7kg Cabin Bag</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                      </svg>
                      <span>Meal Available</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right ml-6">
                  <div className="mb-2">
                    <div className="text-xs text-gray-500 line-through">₹{(Number(f.price) * 1.15).toLocaleString()}</div>
                    <div className="text-3xl font-bold text-indigo-600">₹{Number(f.price).toLocaleString()}</div>
                    <div className="text-xs text-green-600 font-medium">Save ₹{(Number(f.price) * 0.15).toLocaleString()}</div>
                  </div>
                  <div className="text-xs text-gray-500 mb-3">per person</div>
                  <button 
                    onClick={() => handleBookNow(f)}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-lg transition-colors shadow-md hover:shadow-lg"
                  >
                    Book Now
                  </button>
                  <div className="text-xs text-gray-500 mt-2">Instant Confirmation</div>
                </div>
              </div>
            </div>
          );
        })}
        
        {!loading && results.length === 0 && reco.length > 0 && (
          <div className="space-y-4">
            <div className="text-center py-8">
              <div className="text-gray-400 mb-4">
                <svg className="h-16 w-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No flights found</h3>
              <p className="text-gray-600 mb-6">Try different dates or check out these popular routes</p>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Recommended Flights</h4>
            {reco.map(f => (
              <div key={`reco-${f.flight_id}`} className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl shadow-sm p-6 border-l-4 border-indigo-400">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-3">
                      <div className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                        {f.flight_number}
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">{f.flight_name}</h3>
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">Recommended</span>
                    </div>
                    <div className="flex items-center space-x-6 text-gray-600">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-lg">{f.departure_airport_code}</span>
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                        <span className="font-medium text-lg">{f.arrival_airport_code}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-sm">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{f.journey_time}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-sm">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span>{f.available_seats} seats left</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-gray-700">₹{Number(f.price).toLocaleString()}</div>
                    <button 
                      onClick={() => handleBookNow(f)}
                      className="mt-3 bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {!loading && results.length === 0 && reco.length === 0 && (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <svg className="h-24 w-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">No flights available</h3>
            <p className="text-gray-600">Try searching with different criteria or check back later</p>
          </div>
        )}
      </div>
    </div>
  );
}
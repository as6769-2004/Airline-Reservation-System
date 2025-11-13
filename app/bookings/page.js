'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../lib/auth';

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const router = useRouter();
  const { user } = useAuth();


  async function load() {
    setLoading(true);
    setError('');
    try {
      // Load bookings and user stats in parallel
      const [bookingsRes, statsRes] = await Promise.all([
        fetch('/api/bookings', { credentials: 'include' }),
        fetch('/api/user-stats', { credentials: 'include' })
      ]);
      
      const bookingsData = await bookingsRes.json();
      if (!bookingsRes.ok) throw new Error(bookingsData.error || 'Failed to load bookings');
      setBookings(bookingsData.bookings || []);
      
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setUserStats(statsData);
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function cancelBooking(id) {
    if (!confirm('Cancel this booking?')) return;
    try {
      const res = await fetch(`/api/bookings/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ booking_status: 'Cancelled' }), credentials: 'include' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to cancel');
      await load();
    } catch (e) {
      alert(e.message);
    }
  }

  function startModifyBooking(booking) {
    router.push(`/bookings/modify?bookingId=${booking.booking_id}`);
  }

  async function viewBookingDetails(booking) {
    setSelectedBooking(booking);
    setDetailsLoading(true);
    try {
      const [flightRes, passengersRes, baggageRes] = await Promise.all([
        fetch(`/api/flights/${booking.flight_id}`, { credentials: 'include' }),
        fetch(`/api/bookings/${booking.booking_id}/passengers`, { credentials: 'include' }),
        fetch(`/api/bookings/${booking.booking_id}/baggage`, { credentials: 'include' })
      ]);
      
      const flightData = flightRes.ok ? await flightRes.json() : null;
      const passengersData = passengersRes.ok ? await passengersRes.json() : { passengers: [] };
      const baggageData = baggageRes.ok ? await baggageRes.json() : { baggage: [] };
      
      setBookingDetails({
        flight: flightData?.flight || null,
        passengers: passengersData.passengers || [],
        baggage: baggageData.baggage || []
      });
    } catch (e) {
      console.error('Error loading booking details:', e);
    } finally {
      setDetailsLoading(false);
    }
  }

  function closeDetailsModal() {
    setSelectedBooking(null);
    setBookingDetails(null);
  }



  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
        {user && (
          <div className="text-sm text-gray-600">
            Welcome back, <span className="font-medium">{user.name || user.username}</span>
          </div>
        )}
      </div>

      {/* User Statistics Dashboard */}
      {userStats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                <p className="text-2xl font-bold text-gray-900">{userStats.stats.total_bookings}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Spent</p>
                <p className="text-2xl font-bold text-gray-900">₹{Number(userStats.stats.total_spent || 0).toLocaleString()}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Trips</p>
                <p className="text-2xl font-bold text-gray-900">{userStats.stats.total_trips}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Confirmed</p>
                <p className="text-2xl font-bold text-gray-900">{userStats.stats.confirmed_bookings}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {error && <p className="text-red-600 mb-3 bg-red-50 border border-red-200 p-3 rounded">{error}</p>}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading bookings...</p>
        </div>
      ) : bookings && bookings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {bookings.map((b) => (
            <div key={b.booking_id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-200 cursor-pointer" onClick={() => viewBookingDetails(b)}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-semibold">
                      PNR: {b.pnr_number}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      b.booking_status === 'Confirmed' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {b.booking_status}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{b.flight_name}</h3>
                  <p className="text-sm text-gray-500 mb-3">{b.flight_number}</p>
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-gray-600">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="font-medium">{b.departure_code}</span>
                  <svg className="w-4 h-4 mx-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                  <span className="font-medium">{b.arrival_code}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  <span>Seat: {b.seat_number || 'NA'}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>₹{b.total_amount}</span>
                </div>
                {b.departure_date && (
                  <div className="flex items-center text-gray-600">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{new Date(b.departure_date).toLocaleDateString()}</span>
                  </div>
                )}
              </div>

              {b.booking_status === 'Confirmed' && (
                <div className="flex space-x-2 mt-4">
                  <button 
                    onClick={(e) => { e.stopPropagation(); startModifyBooking(b); }}
                    className="flex-1 bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-300 px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Modify
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); router.push(`/bookings/cancel?bookingId=${b.booking_id}`); }}
                    className="flex-1 bg-red-50 text-red-600 hover:bg-red-100 border border-red-300 px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              )}
              
              <div className="mt-3 pt-3 border-t border-gray-200">
                <p className="text-xs text-gray-500 text-center">Click to view full details</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
          <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No bookings found</h3>
          <p className="text-gray-600 mb-6">Your flight bookings will appear here</p>
          <a href="/" className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors">
            Book a Flight
          </a>
        </div>
      )}

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Booking Details</h2>
              <button onClick={closeDetailsModal} className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {detailsLoading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading details...</p>
              </div>
            ) : (
              <div className="p-6 space-y-6">
                {/* Booking Header */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-semibold">
                          PNR: {selectedBooking.pnr_number}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          selectedBooking.booking_status === 'Confirmed' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {selectedBooking.booking_status}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">{selectedBooking.flight_name}</h3>
                      <p className="text-gray-600">{selectedBooking.flight_number}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-indigo-600">₹{Number(selectedBooking.total_amount).toLocaleString()}</div>
                      <div className="text-sm text-gray-500">Total Amount</div>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    <p>Booked on: {new Date(selectedBooking.booking_date).toLocaleString()}</p>
                  </div>
                </div>

                {/* Flight Details */}
                {bookingDetails?.flight && (
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h4 className="text-lg font-semibold mb-4">Flight Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900">
                          {new Date(bookingDetails.flight.departure_date).toLocaleTimeString('en-IN', {hour: '2-digit', minute: '2-digit'})}
                        </div>
                        <div className="text-lg font-medium text-gray-700">{bookingDetails.flight.departure_airport_code}</div>
                        <div className="text-sm text-gray-600">{bookingDetails.flight.departure_airport_name}</div>
                        <div className="text-sm text-gray-500">{bookingDetails.flight.departure_city}</div>
                      </div>
                      
                      <div className="flex flex-col items-center justify-center">
                        <div className="text-sm text-gray-500 mb-2">{bookingDetails.flight.journey_time || '2h 30m'}</div>
                        <div className="flex items-center space-x-2 w-full">
                          <div className="w-3 h-3 bg-indigo-600 rounded-full"></div>
                          <div className="flex-1 border-t-2 border-dashed border-gray-300 relative">
                            <svg className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                            </svg>
                          </div>
                          <div className="w-3 h-3 bg-indigo-600 rounded-full"></div>
                        </div>
                        <div className="text-xs text-gray-500 mt-2">Non-stop</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900">
                          {new Date(bookingDetails.flight.arrival_date).toLocaleTimeString('en-IN', {hour: '2-digit', minute: '2-digit'})}
                        </div>
                        <div className="text-lg font-medium text-gray-700">{bookingDetails.flight.arrival_airport_code}</div>
                        <div className="text-sm text-gray-600">{bookingDetails.flight.arrival_airport_name}</div>
                        <div className="text-sm text-gray-500">{bookingDetails.flight.arrival_city}</div>
                      </div>
                    </div>
                    
                    <div className="mt-4 bg-gray-50 rounded-lg p-3">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <div className="text-gray-500">Aircraft</div>
                          <div className="font-medium">{bookingDetails.flight.aircraft_model || 'Boeing 737'}</div>
                        </div>
                        <div>
                          <div className="text-gray-500">Seat</div>
                          <div className="font-medium">{selectedBooking.seat_number || 'Not assigned'}</div>
                        </div>
                        <div>
                          <div className="text-gray-500">Date</div>
                          <div className="font-medium">{new Date(bookingDetails.flight.departure_date).toLocaleDateString()}</div>
                        </div>
                        <div>
                          <div className="text-gray-500">Status</div>
                          <div className="font-medium text-green-600">{bookingDetails.flight.status || 'Scheduled'}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Passengers */}
                {bookingDetails?.passengers && bookingDetails.passengers.length > 0 && (
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h4 className="text-lg font-semibold mb-4">Passengers ({bookingDetails.passengers.length})</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {bookingDetails.passengers.map((passenger, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-3">
                          <div className="font-medium text-gray-900">{passenger.name}</div>
                          <div className="text-sm text-gray-600 space-y-1">
                            <p>Gender: {passenger.gender}</p>
                            <p>Age: {passenger.age || new Date().getFullYear() - new Date(passenger.date_of_birth).getFullYear()}</p>
                            {passenger.aadhar && <p>Aadhar: {passenger.aadhar}</p>}
                            {passenger.phone && <p>Phone: {passenger.phone}</p>}
                            {passenger.seat_number && <p>Seat: {passenger.seat_number}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Baggage & Services */}
                {bookingDetails?.baggage && bookingDetails.baggage.length > 0 && (
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h4 className="text-lg font-semibold mb-4">Baggage & Services</h4>
                    <div className="space-y-3">
                      {bookingDetails.baggage.map((item, index) => (
                        <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <div>
                            <div className="font-medium text-gray-900">{item.baggage_type || 'Service'}</div>
                            <div className="text-sm text-gray-600">{item.description}</div>
                            {item.weight && <div className="text-xs text-gray-500">Weight: {item.weight}kg</div>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                {selectedBooking.booking_status === 'Confirmed' && (
                  <div className="flex space-x-4 pt-4 border-t border-gray-200">
                    <button 
                      onClick={() => { closeDetailsModal(); startModifyBooking(selectedBooking); }}
                      className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Modify Booking
                    </button>
                    <button 
                      onClick={() => { closeDetailsModal(); router.push(`/bookings/cancel?bookingId=${selectedBooking.booking_id}`); }}
                      className="flex-1 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Cancel Booking
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}



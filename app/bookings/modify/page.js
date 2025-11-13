'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../../lib/auth';

export default function ModifyBookingPage() {
  const [booking, setBooking] = useState(null);
  const [availableFlights, setAvailableFlights] = useState([]);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [passengers, setPassengers] = useState([]);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [modifyLoading, setModifyLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    
    const bookingId = searchParams.get('bookingId');
    if (!bookingId) {
      router.push('/bookings');
      return;
    }

    loadBookingAndFlights(bookingId);
  }, [user, searchParams]);

  async function loadBookingAndFlights(bookingId) {
    try {
      // Load current booking with passengers
      const bookingRes = await fetch(`/api/bookings/${bookingId}`, { credentials: 'include' });
      const bookingData = await bookingRes.json();
      
      if (!bookingRes.ok) {
        alert('Booking not found');
        router.push('/bookings');
        return;
      }

      setBooking(bookingData.booking);
      setFrom(bookingData.booking.departure_code);
      setTo(bookingData.booking.arrival_code);
      setDate(new Date(bookingData.booking.departure_date).toISOString().split('T')[0]);

      // Load passengers for this booking
      const cacheKey = `booking_passengers_${bookingId}`;
      const cached = localStorage.getItem(cacheKey);
      
      if (cached) {
        setPassengers(JSON.parse(cached));
      } else {
        const passengersRes = await fetch(`/api/bookings/${bookingId}/passengers`, { credentials: 'include' });
        const passengersData = await passengersRes.json();
        
        if (passengersRes.ok) {
          setPassengers(passengersData.passengers || []);
          localStorage.setItem(cacheKey, JSON.stringify(passengersData.passengers || []));
        }
      }

      // Load available flights
      const flightsRes = await fetch('/api/flights');
      const flightsData = await flightsRes.json();
      
      if (flightsRes.ok) {
        setAvailableFlights(flightsData.flights || []);
      }
    } catch (e) {
      alert('Error loading data');
      router.push('/bookings');
    } finally {
      setLoading(false);
    }
  }

  async function searchFlights() {
    if (!from || !to || !date) return;
    
    try {
      const params = new URLSearchParams({ from, to, date });
      const res = await fetch(`/api/flights/search?${params.toString()}`);
      const data = await res.json();
      
      if (res.ok) {
        setAvailableFlights(data.flights || []);
      }
    } catch (e) {
      console.error('Search failed:', e);
    }
  }

  async function addExtraBaggage() {
    const weight = document.getElementById('baggageWeight').value;
    const type = document.getElementById('baggageType').value;
    
    if (!weight || weight < 1) {
      alert('Please enter valid baggage weight');
      return;
    }

    try {
      const res = await fetch('/api/bookings/modify', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          bookingId: booking.booking_id,
          action: 'add_baggage',
          baggageWeight: parseFloat(weight),
          baggageType: type
        })
      });

      const data = await res.json();
      
      if (res.ok) {
        alert(data.message);
        document.getElementById('baggageWeight').value = '';
        loadBookingAndFlights(booking.booking_id);
      } else {
        alert(data.error || 'Failed to add baggage');
      }
    } catch (e) {
      alert('Failed to add baggage');
    }
  }

  async function changeFlightDate() {
    const newDate = document.getElementById('newFlightDate').value;
    
    if (!newDate) {
      alert('Please select a new date');
      return;
    }

    try {
      const res = await fetch('/api/bookings/modify', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          bookingId: booking.booking_id,
          action: 'change_date',
          newDate: newDate
        })
      });

      const data = await res.json();
      
      if (res.ok) {
        alert(data.message);
        router.push('/bookings');
      } else {
        alert(data.error || 'Failed to change date');
      }
    } catch (e) {
      alert('Failed to change date');
    }
  }

  async function handleModifyBooking() {
    if (!selectedFlight) {
      alert('Please select a new flight');
      return;
    }

    setModifyLoading(true);
    try {
      const res = await fetch('/api/bookings/modify', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          bookingId: booking.booking_id,
          newFlightId: selectedFlight.flight_id
        })
      });

      const data = await res.json();
      
      if (res.ok) {
        alert(`Booking modified successfully! ${data.message}`);
        router.push('/bookings');
      } else {
        alert(data.error || 'Failed to modify booking');
      }
    } catch (e) {
      alert('Failed to modify booking');
    } finally {
      setModifyLoading(false);
    }
  }

  function calculatePriceDifference() {
    if (!booking || !selectedFlight) return 0;
    return selectedFlight.price - booking.price;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Booking not found</h2>
          <button onClick={() => router.push('/bookings')} className="bg-indigo-600 text-white px-6 py-2 rounded-lg">
            Back to Bookings
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Modify Booking</h1>

        {/* Current Booking Details */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Current Booking Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center space-x-4 mb-2">
                <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
                  PNR: {booking.pnr_number}
                </span>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  {booking.booking_status}
                </span>
              </div>
              <h3 className="text-lg font-semibold">{booking.flight_name}</h3>
              <p className="text-gray-600">{booking.flight_number}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-indigo-600">₹{Number(booking.total_amount).toLocaleString()}</div>
              <div className="text-sm text-gray-500">Current Amount</div>
            </div>
          </div>
          
          <div className="mt-4 flex items-center space-x-4 text-gray-600">
            <span className="font-medium">{booking.departure_code}</span>
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
            <span className="font-medium">{booking.arrival_code}</span>
            <span className="text-sm">Seat: {booking.seat_number}</span>
          </div>
          
          {booking.departure_date && (
            <div className="mt-2 text-gray-600">
              <span>Departure: {new Date(booking.departure_date).toLocaleString()}</span>
            </div>
          )}
        </div>

        {/* Passenger Details */}
        {passengers.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Passengers</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {passengers.map((passenger, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900">{passenger.name}</h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>Age: {passenger.age || 'N/A'}</p>
                    <p>Gender: {passenger.gender}</p>
                    <p>Seat: {passenger.seat_number}</p>
                    {passenger.aadhar && <p>Aadhar: {passenger.aadhar}</p>}
                    {passenger.phone && <p>Phone: {passenger.phone}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Flight Search */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Search New Flights</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
              <select
                className="w-full p-2 border border-gray-300 rounded-lg"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
              >
                <option value="">Select departure</option>
                <option value="DEL">Delhi (DEL)</option>
                <option value="BOM">Mumbai (BOM)</option>
                <option value="BLR">Bengaluru (BLR)</option>
                <option value="MAA">Chennai (MAA)</option>
                <option value="CCU">Kolkata (CCU)</option>
                <option value="HYD">Hyderabad (HYD)</option>
                <option value="AMD">Ahmedabad (AMD)</option>
                <option value="JAI">Jaipur (JAI)</option>
                <option value="GOI">Goa (GOI)</option>
                <option value="COK">Kochi (COK)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
              <select
                className="w-full p-2 border border-gray-300 rounded-lg"
                value={to}
                onChange={(e) => setTo(e.target.value)}
              >
                <option value="">Select destination</option>
                <option value="DEL">Delhi (DEL)</option>
                <option value="BOM">Mumbai (BOM)</option>
                <option value="BLR">Bengaluru (BLR)</option>
                <option value="MAA">Chennai (MAA)</option>
                <option value="CCU">Kolkata (CCU)</option>
                <option value="HYD">Hyderabad (HYD)</option>
                <option value="AMD">Ahmedabad (AMD)</option>
                <option value="JAI">Jaipur (JAI)</option>
                <option value="GOI">Goa (GOI)</option>
                <option value="COK">Kochi (COK)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                className="w-full p-2 border border-gray-300 rounded-lg"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={searchFlights}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Available Flights */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Select New Flight</h2>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {availableFlights.map(flight => (
              <div 
                key={flight.flight_id} 
                className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                  selectedFlight?.flight_id === flight.flight_id 
                    ? 'border-indigo-500 bg-indigo-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedFlight(flight)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-2">
                      <div className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                        {flight.flight_number}
                      </div>
                      <h3 className="text-lg font-semibold">{flight.flight_name}</h3>
                    </div>
                    <div className="flex items-center space-x-6 text-gray-600">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-lg">{flight.departure_airport_code}</span>
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                        <span className="font-medium text-lg">{flight.arrival_airport_code}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-sm">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span>{flight.available_seats} seats left</span>
                      </div>
                    </div>
                    {flight.departure_date && (
                      <div className="mt-2 text-sm text-gray-500">
                        Departure: {new Date(flight.departure_date).toLocaleString()}
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-indigo-600">₹{Number(flight.price).toLocaleString()}</div>
                    {selectedFlight?.flight_id === flight.flight_id && (
                      <div className="text-sm text-green-600 font-medium">Selected</div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Baggage Modification */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Add Extra Baggage</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Baggage Weight (kg)</label>
              <input
                type="number"
                min="1"
                max="30"
                className="w-full p-2 border border-gray-300 rounded-lg"
                placeholder="Enter weight"
                id="baggageWeight"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Baggage Type</label>
              <select className="w-full p-2 border border-gray-300 rounded-lg" id="baggageType">
                <option value="Extra">Extra Baggage</option>
                <option value="Sports">Sports Equipment</option>
                <option value="Musical">Musical Instrument</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={addExtraBaggage}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
              >
                Add Baggage (₹500/kg)
              </button>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">Extra baggage will be charged at ₹500 per kg</p>
        </div>

        {/* Date Change */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Change Flight Date</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Date</label>
              <input
                type="date"
                className="w-full p-2 border border-gray-300 rounded-lg"
                min={new Date().toISOString().split('T')[0]}
                id="newFlightDate"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={changeFlightDate}
                className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Change Date
              </button>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">Find flights on the same route for your new preferred date</p>
        </div>

        {/* Price Summary */}
        {selectedFlight && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Price Summary</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Current booking amount</span>
                <span>₹{Number(booking.total_amount).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>New flight price</span>
                <span>₹{Number(selectedFlight.price).toLocaleString()}</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-semibold text-lg">
                <span>Price difference</span>
                <span className={calculatePriceDifference() >= 0 ? 'text-red-600' : 'text-green-600'}>
                  {calculatePriceDifference() >= 0 ? '+' : ''}₹{calculatePriceDifference().toLocaleString()}
                </span>
              </div>
              <div className="border-t pt-2 flex justify-between font-bold text-xl">
                <span>New total amount</span>
                <span className="text-indigo-600">₹{(Number(booking.total_amount) + calculatePriceDifference()).toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-4">
          <button
            onClick={() => router.push('/bookings')}
            className="flex-1 bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleModifyBooking}
            disabled={!selectedFlight || modifyLoading}
            className="flex-1 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            {modifyLoading ? 'Processing...' : 'Confirm Modification'}
          </button>
        </div>
      </div>
    </div>
  );
}
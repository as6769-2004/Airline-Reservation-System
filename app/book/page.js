'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../lib/auth';

export default function BookingPage() {
  const [flight, setFlight] = useState(null);
  const [selectedPassengers, setSelectedPassengers] = useState([]);
  const [existingPassengers, setExistingPassengers] = useState([]);
  const [selectedMeals, setSelectedMeals] = useState({});
  const [selectedBaggage, setSelectedBaggage] = useState({});
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: authLoading } = useAuth();

  // Cache user session
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    }
  }, [user]);

  const meals = [
    { id: 'veg', name: 'Vegetarian Meal', price: 250 },
    { id: 'nonveg', name: 'Non-Vegetarian Meal', price: 350 },
    { id: 'jain', name: 'Jain Meal', price: 300 },
    { id: 'none', name: 'No Meal', price: 0 }
  ];

  const baggageOptions = [
    { id: 'none', name: 'No Extra Baggage', weight: 0, price: 0, description: '7kg cabin bag included' },
    { id: '15kg', name: 'Extra 15kg', weight: 15, price: 1200, description: '15kg checked baggage' },
    { id: '20kg', name: 'Extra 20kg', weight: 20, price: 1500, description: '20kg checked baggage' },
    { id: '25kg', name: 'Extra 25kg', weight: 25, price: 1800, description: '25kg checked baggage' },
    { id: '30kg', name: 'Extra 30kg', weight: 30, price: 2100, description: '30kg checked baggage' }
  ];

  useEffect(() => {
    if (authLoading) return; // Wait for auth to load
    
    const flightId = searchParams.get('flightId');
    if (!flightId) {
      router.push('/');
      return;
    }

    // Check if user is available or in localStorage
    const cachedUser = localStorage.getItem('user');
    if (!user && !cachedUser) {
      router.push('/login');
      return;
    }

    setAuthChecked(true);
    loadFlight(flightId);
    loadExistingPassengers();
  }, [user, authLoading, searchParams, router]);

  async function loadFlight(flightId) {
    try {
      const res = await fetch(`/api/flights/${flightId}`);
      const data = await res.json();
      if (res.ok) {
        setFlight(data.flight);
      } else {
        alert('Flight not found');
        router.push('/');
      }
    } catch (e) {
      alert('Error loading flight');
      router.push('/');
    } finally {
      setLoading(false);
    }
  }

  async function loadExistingPassengers() {
    try {
      const res = await fetch('/api/passengers', { credentials: 'include' });
      const data = await res.json();
      if (res.ok) {
        const passengers = data.passengers || [];
        setExistingPassengers(passengers);
        // Initialize with one passenger slot if passengers exist
        if (passengers.length > 0) {
          setSelectedPassengers([null]);
        }
      }
    } catch (e) {
      console.error('Error loading passengers:', e);
    }
  }

  function addPassenger() {
    if (selectedPassengers.length < existingPassengers.length) {
      setSelectedPassengers([...selectedPassengers, null]);
    }
  }

  function removePassenger(index) {
    if (selectedPassengers.length > 1) {
      const newSelected = selectedPassengers.filter((_, i) => i !== index);
      setSelectedPassengers(newSelected);
      
      const newMeals = { ...selectedMeals };
      const newBaggage = { ...selectedBaggage };
      delete newMeals[index];
      delete newBaggage[index];
      
      // Reindex remaining meals and baggage
      const reindexedMeals = {};
      const reindexedBaggage = {};
      Object.entries(newMeals).forEach(([key, value]) => {
        const keyIndex = parseInt(key);
        if (keyIndex > index) {
          reindexedMeals[keyIndex - 1] = value;
        } else if (keyIndex < index) {
          reindexedMeals[keyIndex] = value;
        }
      });
      Object.entries(newBaggage).forEach(([key, value]) => {
        const keyIndex = parseInt(key);
        if (keyIndex > index) {
          reindexedBaggage[keyIndex - 1] = value;
        } else if (keyIndex < index) {
          reindexedBaggage[keyIndex] = value;
        }
      });
      setSelectedMeals(reindexedMeals);
      setSelectedBaggage(reindexedBaggage);
    }
  }

  function selectPassenger(index, passenger) {
    const newSelected = [...selectedPassengers];
    newSelected[index] = passenger;
    setSelectedPassengers(newSelected);
  }

  function updateMeal(passengerIndex, mealId) {
    setSelectedMeals({
      ...selectedMeals,
      [passengerIndex]: mealId
    });
  }

  function updateBaggage(passengerIndex, baggageId) {
    setSelectedBaggage({
      ...selectedBaggage,
      [passengerIndex]: baggageId
    });
  }

  function calculateTotal() {
    const basePrice = flight ? flight.price * selectedPassengers.length : 0;
    const mealPrice = Object.values(selectedMeals).reduce((total, mealId) => {
      const meal = meals.find(m => m.id === mealId);
      return total + (meal ? meal.price : 0);
    }, 0);
    const baggagePrice = Object.values(selectedBaggage).reduce((total, baggageId) => {
      const baggage = baggageOptions.find(b => b.id === baggageId);
      return total + (baggage ? baggage.price : 0);
    }, 0);
    return basePrice + mealPrice + baggagePrice;
  }

  async function handleBooking() {
    for (let i = 0; i < selectedPassengers.length; i++) {
      if (!selectedPassengers[i]) {
        alert(`Please select passenger ${i + 1}`);
        return;
      }
    }

    setBookingLoading(true);
    try {
      const bookingData = {
        flightId: flight.flight_id,
        passengers: selectedPassengers.map((p, i) => ({
          name: p.name,
          age: new Date().getFullYear() - new Date(p.date_of_birth).getFullYear(),
          gender: p.gender,
          aadhar: p.aadhar,
          phone: p.phone,
          email: p.email,
          meal: selectedMeals[i] || 'none',
          baggage: selectedBaggage[i] || 'none'
        })),
        totalAmount: calculateTotal()
      };

      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(bookingData)
      });

      const data = await res.json();
      
      if (res.ok) {
        router.push(`/payment/success?pnr=${data.pnr}`);
      } else {
        alert(data.error || 'Booking failed');
      }
    } catch (e) {
      alert('Booking failed. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  }

  if (authLoading || loading || !authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!flight) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Flight not found</h2>
          <button onClick={() => router.push('/')} className="bg-indigo-600 text-white px-6 py-2 rounded-lg">
            Back to Search
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Complete Your Booking</h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-6">Flight Details</h2>
          
          {/* Flight Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                flight.flight_number.startsWith('6E') ? 'bg-blue-100' :
                flight.flight_number.startsWith('AI') ? 'bg-red-100' :
                flight.flight_number.startsWith('SG') ? 'bg-orange-100' :
                flight.flight_number.startsWith('UK') ? 'bg-purple-100' : 'bg-gray-100'
              }`}>
                <span className={`text-lg font-bold ${
                  flight.flight_number.startsWith('6E') ? 'text-blue-600' :
                  flight.flight_number.startsWith('AI') ? 'text-red-600' :
                  flight.flight_number.startsWith('SG') ? 'text-orange-600' :
                  flight.flight_number.startsWith('UK') ? 'text-purple-600' : 'text-gray-600'
                }`}>
                  {flight.flight_number.substring(0, 2)}
                </span>
              </div>
              <div>
                <div className="flex items-center space-x-3">
                  <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
                    {flight.flight_number}
                  </span>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {flight.flight_number.startsWith('6E') ? 'IndiGo' :
                     flight.flight_number.startsWith('AI') ? 'Air India' :
                     flight.flight_number.startsWith('SG') ? 'SpiceJet' :
                     flight.flight_number.startsWith('UK') ? 'Vistara' : 'Airline'}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mt-1">{flight.flight_name}</h3>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-indigo-600">₹{Number(flight.price).toLocaleString()}</div>
              <div className="text-sm text-gray-500">per person</div>
            </div>
          </div>

          {/* Route Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="text-center md:text-left">
              <div className="text-2xl font-bold text-gray-900">
                {flight.departure_date ? new Date(flight.departure_date).toLocaleTimeString('en-IN', {hour: '2-digit', minute: '2-digit'}) : '--:--'}
              </div>
              <div className="text-lg font-medium text-gray-700">{flight.departure_airport_code}</div>
              <div className="text-sm text-gray-600">{flight.departure_airport_name}</div>
              <div className="text-sm text-gray-500">{flight.departure_city}</div>
              <div className="text-xs text-gray-400">{new Date(flight.departure_date).toLocaleDateString()}</div>
            </div>
            
            <div className="flex flex-col items-center justify-center">
              <div className="text-sm text-gray-500 mb-2">{flight.journey_time || '2h 30m'}</div>
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
            
            <div className="text-center md:text-right">
              <div className="text-2xl font-bold text-gray-900">
                {flight.arrival_date ? new Date(flight.arrival_date).toLocaleTimeString('en-IN', {hour: '2-digit', minute: '2-digit'}) : '--:--'}
              </div>
              <div className="text-lg font-medium text-gray-700">{flight.arrival_airport_code}</div>
              <div className="text-sm text-gray-600">{flight.arrival_airport_name}</div>
              <div className="text-sm text-gray-500">{flight.arrival_city}</div>
              <div className="text-xs text-gray-400">{new Date(flight.arrival_date).toLocaleDateString()}</div>
            </div>
          </div>

          {/* Flight Information */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <div className="text-gray-500">Aircraft</div>
                <div className="font-medium text-gray-900">{flight.aircraft_model || 'Boeing 737'}</div>
              </div>
              <div>
                <div className="text-gray-500">Capacity</div>
                <div className="font-medium text-gray-900">{flight.total_seats || flight.aircraft_capacity || 180} seats</div>
              </div>
              <div>
                <div className="text-gray-500">Available</div>
                <div className="font-medium text-gray-900">{flight.available_seats} seats</div>
              </div>
              <div>
                <div className="text-gray-500">Status</div>
                <div className="font-medium text-green-600">{flight.status || 'Scheduled'}</div>
              </div>
            </div>
          </div>
        </div>

        {existingPassengers.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="text-center py-8">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Saved Passengers</h3>
              <p className="text-gray-600 mb-4">You need to add passengers to your profile before booking flights.</p>
              <button
                onClick={() => router.push('/profile')}
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Add Passengers in Profile
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Select Passengers</h2>
              {selectedPassengers.length < existingPassengers.length && (
                <button
                  onClick={addPassenger}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Add Another Passenger
                </button>
              )}
            </div>

            {selectedPassengers.map((selectedPassenger, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium">Passenger {index + 1}</h3>
                  {selectedPassengers.length > 1 && (
                    <button
                      onClick={() => removePassenger(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  )}
                </div>

                {!selectedPassenger ? (
                  <div className="space-y-3">
                    <p className="text-sm text-gray-600 mb-3">Select a passenger from your saved passengers:</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto">
                      {existingPassengers
                        .filter(p => !selectedPassengers.some(sp => sp && sp.passenger_id === p.passenger_id))
                        .map(p => (
                        <div
                          key={p.passenger_id}
                          onClick={() => selectPassenger(index, p)}
                          className="p-4 border border-gray-200 rounded-lg cursor-pointer transition-all hover:shadow-md hover:border-gray-300"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium text-gray-900">{p.name}</div>
                              <div className="text-sm text-gray-600">{p.gender}, Age: {new Date().getFullYear() - new Date(p.date_of_birth).getFullYear()}</div>
                              <div className="text-xs text-gray-500">Aadhar: {p.aadhar}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <div>
                          <div className="text-green-800 font-medium">{selectedPassenger.name}</div>
                          <div className="text-green-700 text-sm">{selectedPassenger.gender}, Age: {new Date().getFullYear() - new Date(selectedPassenger.date_of_birth).getFullYear()}</div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => selectPassenger(index, null)}
                        className="text-green-600 hover:text-green-800 text-sm underline"
                      >
                        Change
                      </button>
                    </div>
                  </div>
                )}

                <div className="mt-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Meal Preference</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {meals.map(meal => (
                        <label key={meal.id} className="flex items-center space-x-2 p-2 border rounded-lg cursor-pointer hover:bg-gray-50">
                          <input
                            type="radio"
                            name={`meal-${index}`}
                            value={meal.id}
                            checked={selectedMeals[index] === meal.id}
                            onChange={() => updateMeal(index, meal.id)}
                            className="text-indigo-600"
                          />
                          <div className="flex-1">
                            <div className="text-sm font-medium">{meal.name}</div>
                            <div className="text-xs text-gray-500">₹{meal.price}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Baggage Options</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {baggageOptions.map(baggage => (
                        <label key={baggage.id} className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                          selectedBaggage[index] === baggage.id ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'
                        }`}>
                          <input
                            type="radio"
                            name={`baggage-${index}`}
                            value={baggage.id}
                            checked={selectedBaggage[index] === baggage.id}
                            onChange={() => updateBaggage(index, baggage.id)}
                            className="text-indigo-600"
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <div className="text-sm font-medium">{baggage.name}</div>
                              <div className="text-sm font-bold text-indigo-600">₹{baggage.price}</div>
                            </div>
                            <div className="text-xs text-gray-500">{baggage.description}</div>
                            {baggage.weight > 0 && (
                              <div className="text-xs text-gray-600 mt-1">
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                  {baggage.weight}kg
                                </span>
                              </div>
                            )}
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Booking Summary</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Flight tickets ({selectedPassengers.length} × ₹{Number(flight.price).toLocaleString()})</span>
              <span>₹{(flight.price * selectedPassengers.length).toLocaleString()}</span>
            </div>
            {Object.entries(selectedMeals).map(([index, mealId]) => {
              const meal = meals.find(m => m.id === mealId);
              if (!meal || meal.price === 0) return null;
              return (
                <div key={`meal-${index}`} className="flex justify-between text-sm text-gray-600">
                  <span>Meal for Passenger {parseInt(index) + 1} ({meal.name})</span>
                  <span>₹{meal.price}</span>
                </div>
              );
            })}
            {Object.entries(selectedBaggage).map(([index, baggageId]) => {
              const baggage = baggageOptions.find(b => b.id === baggageId);
              if (!baggage || baggage.price === 0) return null;
              return (
                <div key={`baggage-${index}`} className="flex justify-between text-sm text-gray-600">
                  <span>Baggage for Passenger {parseInt(index) + 1} ({baggage.name})</span>
                  <span>₹{baggage.price}</span>
                </div>
              );
            })}
            <div className="border-t pt-2 flex justify-between font-semibold text-lg">
              <span>Total Amount</span>
              <span className="text-indigo-600">₹{calculateTotal().toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="flex space-x-4">
          <button
            onClick={() => router.back()}
            className="flex-1 bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600 transition-colors"
          >
            Back
          </button>
          <button
            onClick={handleBooking}
            disabled={bookingLoading}
            className="flex-1 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
{bookingLoading ? 'Processing...' : `Book Now - ₹${calculateTotal().toLocaleString()}`}
          </button>
        </div>
      </div>
    </div>
  );
}
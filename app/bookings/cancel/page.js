'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../../lib/auth';

export default function CancelBookingPage() {
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
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

    loadBooking(bookingId);
  }, [user, searchParams]);

  async function loadBooking(bookingId) {
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, { credentials: 'include' });
      const data = await res.json();
      
      if (res.ok) {
        setBooking(data.booking);
      } else {
        alert('Booking not found');
        router.push('/bookings');
      }
    } catch (e) {
      alert('Error loading booking');
      router.push('/bookings');
    } finally {
      setLoading(false);
    }
  }

  function calculateCancellationCharges() {
    if (!booking) return { charges: 0, refund: 0 };
    
    const departureDate = new Date(booking.departure_date);
    const now = new Date();
    const hoursUntilDeparture = (departureDate - now) / (1000 * 60 * 60);
    
    let chargePercentage = 0;
    
    if (hoursUntilDeparture > 24) {
      chargePercentage = 10; // 10% cancellation charge
    } else if (hoursUntilDeparture > 4) {
      chargePercentage = 25; // 25% cancellation charge
    } else {
      chargePercentage = 50; // 50% cancellation charge
    }
    
    const charges = (booking.total_amount * chargePercentage) / 100;
    const refund = booking.total_amount - charges;
    
    return { charges, refund, chargePercentage };
  }

  async function handleCancellation() {
    setCancelling(true);
    try {
      const res = await fetch(`/api/bookings/${booking.booking_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ booking_status: 'Cancelled' })
      });

      const data = await res.json();
      if (res.ok) {
        const { refund } = calculateCancellationCharges();
        alert(`Booking cancelled successfully! Refund amount: ₹${refund.toLocaleString()}`);
        router.push('/bookings');
      } else {
        alert(data.error || 'Failed to cancel booking');
      }
    } catch (e) {
      alert('Failed to cancel booking');
    } finally {
      setCancelling(false);
    }
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

  const { charges, refund, chargePercentage } = calculateCancellationCharges();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Cancel Booking</h1>

        {/* Booking Details */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Booking Details</h2>
          <div className="space-y-3">
            <div className="flex items-center space-x-4">
              <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
                PNR: {booking.pnr_number}
              </span>
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                {booking.booking_status}
              </span>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold">{booking.flight_name}</h3>
              <p className="text-gray-600">{booking.flight_number}</p>
            </div>
            
            <div className="flex items-center space-x-4 text-gray-600">
              <span className="font-medium">{booking.departure_code}</span>
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
              <span className="font-medium">{booking.arrival_code}</span>
            </div>
            
            {booking.departure_date && (
              <div className="text-gray-600">
                <span>Departure: {new Date(booking.departure_date).toLocaleString()}</span>
              </div>
            )}
            
            <div className="text-lg font-semibold text-indigo-600">
              Total Paid: ₹{Number(booking.total_amount).toLocaleString()}
            </div>
          </div>
        </div>

        {/* Cancellation Policy */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Cancellation Policy</h2>
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>More than 24 hours before departure:</span>
              <span className="font-medium">10% cancellation charge</span>
            </div>
            <div className="flex justify-between">
              <span>4-24 hours before departure:</span>
              <span className="font-medium">25% cancellation charge</span>
            </div>
            <div className="flex justify-between">
              <span>Less than 4 hours before departure:</span>
              <span className="font-medium">50% cancellation charge</span>
            </div>
          </div>
        </div>

        {/* Cancellation Summary */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Cancellation Summary</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Original Amount:</span>
              <span>₹{Number(booking.total_amount).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-red-600">
              <span>Cancellation Charges ({chargePercentage}%):</span>
              <span>-₹{charges.toLocaleString()}</span>
            </div>
            <div className="border-t pt-3 flex justify-between font-bold text-lg">
              <span>Refund Amount:</span>
              <span className="text-green-600">₹{refund.toLocaleString()}</span>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> Refund will be processed within 5-7 business days to your original payment method.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4">
          <button
            onClick={() => router.push('/bookings')}
            className="flex-1 bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600 transition-colors"
          >
            Keep Booking
          </button>
          <button
            onClick={handleCancellation}
            disabled={cancelling}
            className="flex-1 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
          >
            {cancelling ? 'Cancelling...' : `Cancel & Get ₹${refund.toLocaleString()} Refund`}
          </button>
        </div>
      </div>
    </div>
  );
}
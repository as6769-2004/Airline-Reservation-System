'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../lib/auth';

export default function PaymentPage() {
  const [bookingData, setBookingData] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });
  const [upiId, setUpiId] = useState('');
  const [processing, setProcessing] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    const data = searchParams.get('data');
    if (!data) {
      router.push('/');
      return;
    }

    try {
      const decoded = JSON.parse(decodeURIComponent(data));
      setBookingData(decoded);
    } catch (e) {
      router.push('/');
    } finally {
      setLoading(false);
    }
  }, [user, searchParams]);

  async function processPayment() {
    setProcessing(true);
    
    try {
      const paymentData = {
        ...bookingData,
        paymentMethod,
        paymentDetails: paymentMethod === 'card' ? cardDetails : { upiId }
      };

      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(paymentData)
      });

      const data = await res.json();
      
      if (res.ok) {
        router.push(`/payment/success?pnr=${data.pnr}`);
      } else {
        alert(data.error || 'Payment failed');
      }
    } catch (e) {
      alert('Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!bookingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Invalid payment session</h2>
          <button onClick={() => router.push('/')} className="bg-indigo-600 text-white px-6 py-2 rounded-lg">
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Complete Payment</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Booking Summary */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Booking Summary</h2>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-4 mb-4">
                <div className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
                  {bookingData.flight.flight_number}
                </div>
                <h3 className="text-lg font-semibold">{bookingData.flight.flight_name}</h3>
              </div>

              <div className="flex items-center space-x-4 text-gray-600">
                <span className="font-medium">{bookingData.flight.departure_airport_code}</span>
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
                <span className="font-medium">{bookingData.flight.arrival_airport_code}</span>
              </div>

              {bookingData.flight.departure_date && (
                <div className="text-gray-600">
                  <span>Departure: {new Date(bookingData.flight.departure_date).toLocaleString()}</span>
                </div>
              )}

              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Passengers ({bookingData.passengers.length})</h4>
                {bookingData.passengers.map((passenger, index) => (
                  <div key={index} className="text-sm text-gray-600 mb-1">
                    {passenger.name} ({passenger.gender}, {passenger.age} years)
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Flight tickets ({bookingData.passengers.length} × ₹{Number(bookingData.flight.price).toLocaleString()})</span>
                  <span>₹{(bookingData.flight.price * bookingData.passengers.length).toLocaleString()}</span>
                </div>
                
                {bookingData.passengers.some(p => p.meal && p.meal !== 'none') && (
                  <div className="text-sm text-gray-600">
                    <span>Meals included</span>
                  </div>
                )}

                <div className="border-t pt-2 flex justify-between font-bold text-lg">
                  <span>Total Amount</span>
                  <span className="text-indigo-600">₹{Number(bookingData.totalAmount).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Payment Method</h2>

            <div className="space-y-4">
              {/* Payment Method Selection */}
              <div className="grid grid-cols-3 gap-4">
                <button
                  onClick={() => setPaymentMethod('card')}
                  className={`p-4 border rounded-lg text-center transition-colors ${
                    paymentMethod === 'card' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'
                  }`}
                >
                  <div className="text-sm font-medium">Credit/Debit Card</div>
                </button>
                <button
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-4 border rounded-lg text-center transition-colors ${
                    paymentMethod === 'upi' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'
                  }`}
                >
                  <div className="text-sm font-medium">UPI</div>
                </button>
                <button
                  onClick={() => setPaymentMethod('netbanking')}
                  className={`p-4 border rounded-lg text-center transition-colors ${
                    paymentMethod === 'netbanking' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'
                  }`}
                >
                  <div className="text-sm font-medium">Net Banking</div>
                </button>
              </div>

              {/* Card Payment Form */}
              {paymentMethod === 'card' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                    <input
                      type="text"
                      className="w-full p-3 border border-gray-300 rounded-lg"
                      placeholder="1234 5678 9012 3456"
                      value={cardDetails.number}
                      onChange={(e) => setCardDetails({...cardDetails, number: e.target.value})}
                      maxLength="19"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                      <input
                        type="text"
                        className="w-full p-3 border border-gray-300 rounded-lg"
                        placeholder="MM/YY"
                        value={cardDetails.expiry}
                        onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})}
                        maxLength="5"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                      <input
                        type="text"
                        className="w-full p-3 border border-gray-300 rounded-lg"
                        placeholder="123"
                        value={cardDetails.cvv}
                        onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value})}
                        maxLength="3"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
                    <input
                      type="text"
                      className="w-full p-3 border border-gray-300 rounded-lg"
                      placeholder="John Doe"
                      value={cardDetails.name}
                      onChange={(e) => setCardDetails({...cardDetails, name: e.target.value})}
                    />
                  </div>
                </div>
              )}

              {/* UPI Payment Form */}
              {paymentMethod === 'upi' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">UPI ID</label>
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    placeholder="yourname@paytm"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                  />
                </div>
              )}

              {/* Net Banking */}
              {paymentMethod === 'netbanking' && (
                <div className="text-center py-8 text-gray-600">
                  <p>You will be redirected to your bank's website</p>
                </div>
              )}

              {/* Payment Button */}
              <button
                onClick={processPayment}
                disabled={processing}
                className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors font-medium"
              >
                {processing ? 'Processing Payment...' : `Pay ₹${Number(bookingData.totalAmount).toLocaleString()}`}
              </button>

              <div className="text-xs text-gray-500 text-center">
                Your payment is secured with 256-bit SSL encryption
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
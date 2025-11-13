'use client';
import { useAuth } from '../../lib/auth';
import { useRouter } from 'next/navigation';

export default function TestBooking() {
  const { user } = useAuth();
  const router = useRouter();

  const testBooking = async () => {
    if (!user) {
      alert('Please login first');
      router.push('/login');
      return;
    }

    try {
      const testData = {
        flightId: 1,
        passengers: [{
          name: 'Test User',
          age: '30',
          gender: 'Male',
          aadhar: '123456789012',
          phone: '9876543210',
          email: user.email,
          meal: 'none'
        }],
        totalAmount: 5000
      };

      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(testData)
      });

      const data = await res.json();
      
      if (res.ok) {
        alert(`Booking successful! PNR: ${data.pnr}`);
        router.push(`/payment/success?pnr=${data.pnr}`);
      } else {
        alert(`Booking failed: ${data.error}`);
      }
    } catch (e) {
      alert(`Error: ${e.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Test Booking</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">User Status</h2>
          {user ? (
            <div className="text-green-600">
              <p>✅ User logged in: {user.email}</p>
              <p>Role: {user.role}</p>
            </div>
          ) : (
            <div className="text-red-600">
              <p>❌ User not logged in</p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Test Booking Flow</h2>
          <button
            onClick={testBooking}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Test Book Flight
          </button>
        </div>
      </div>
    </div>
  );
}
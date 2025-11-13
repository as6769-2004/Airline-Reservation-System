'use client';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function PaymentSuccessPage() {
  const [pnr, setPnr] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const pnrParam = searchParams.get('pnr');
    if (pnrParam) {
      setPnr(pnrParam);
    } else {
      router.push('/');
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8">
      <div className="max-w-md mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          {/* Success Icon */}
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
            <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-4">Payment Successful!</h1>
          
          <p className="text-gray-600 mb-6">
            Your booking has been confirmed successfully.
          </p>

          {pnr && (
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-6">
              <div className="text-sm text-indigo-600 font-medium">Your PNR Number</div>
              <div className="text-2xl font-bold text-indigo-800">{pnr}</div>
            </div>
          )}

          <div className="space-y-3">
            <button
              onClick={() => router.push('/bookings')}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              View My Bookings
            </button>
            
            <button
              onClick={() => router.push('/')}
              className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Book Another Flight
            </button>
          </div>

          <div className="mt-6 text-xs text-gray-500">
            A confirmation email has been sent to your registered email address.
          </div>
        </div>
      </div>
    </div>
  );
}
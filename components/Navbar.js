'use client';
import Link from 'next/link';
import { useAuth } from '../lib/auth';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-2 rounded-lg">
            <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">SkyBook</h1>
            <p className="text-xs text-gray-500">Flight Booking Made Easy</p>
          </div>
        </Link>
        <nav className="flex items-center gap-6">
          <Link href="/" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">Home</Link>
          <Link href="/flights" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">Flights</Link>
          {user ? (
            <>
              <Link href="/bookings" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">Bookings</Link>
              {user.role === 'admin' && (
                <Link href="/dashboard" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">Admin</Link>
              )}
              <div className="relative">
                <button 
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 text-gray-700 hover:text-indigo-600 font-medium"
                >
                  {user.name || user.username}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Profile
                    </Link>
                    <button 
                      onClick={logout} 
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <Link href="/register" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">Register</Link>
              <Link href="/login" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">Sign In</Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}



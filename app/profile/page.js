'use client';
import { useAuth } from '../../lib/auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Profile() {
  const { user, loading, updateUser } = useAuth();
  const router = useRouter();
  const [userStats, setUserStats] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ username: '', name: '', email: '', phone: '' });
  const [updating, setUpdating] = useState(false);
  const [savedPassengers, setSavedPassengers] = useState([]);
  const [showAddPassenger, setShowAddPassenger] = useState(false);
  const [editingPassenger, setEditingPassenger] = useState(null);
  const [passengerForm, setPassengerForm] = useState({ name: '', aadhar: '', gender: 'Male', phone: '', email: '', date_of_birth: '' });

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
    if (user) {
      setFormData({ 
        username: user.username || '', 
        name: user.name || '', 
        email: user.email || '',
        phone: user.phone || ''
      });
      fetchUserStats();
      fetchSavedPassengers();
    }
  }, [user, loading, router]);

  const fetchUserStats = async () => {
    try {
      const res = await fetch('/api/user-stats', { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        console.log('User stats data:', data);
        setUserStats(data);
      } else {
        console.error('Failed to fetch user stats:', res.status);
      }
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

  const fetchSavedPassengers = async () => {
    try {
      const res = await fetch('/api/passengers', { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setSavedPassengers(data.passengers || []);
      }
    } catch (error) {
      console.error('Error fetching passengers:', error);
    }
  };

  const addPassenger = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/passengers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(passengerForm)
      });
      
      if (res.ok) {
        setShowAddPassenger(false);
        setPassengerForm({ name: '', aadhar: '', gender: 'Male', phone: '', email: '', date_of_birth: '' });
        fetchSavedPassengers();
        alert('Passenger added successfully!');
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to add passenger');
      }
    } catch (error) {
      alert('Error adding passenger');
    }
  };

  const editPassenger = (passenger) => {
    setEditingPassenger(passenger.passenger_id);
    setPassengerForm({
      name: passenger.name,
      aadhar: passenger.aadhar,
      gender: passenger.gender,
      phone: passenger.phone,
      email: passenger.email,
      date_of_birth: passenger.date_of_birth ? passenger.date_of_birth.split('T')[0] : ''
    });
  };

  const updatePassenger = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/passengers/${editingPassenger}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(passengerForm)
      });
      
      if (res.ok) {
        setEditingPassenger(null);
        setPassengerForm({ name: '', aadhar: '', gender: 'Male', phone: '', email: '', date_of_birth: '' });
        fetchSavedPassengers();
        alert('Passenger updated successfully!');
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to update passenger');
      }
    } catch (error) {
      alert('Error updating passenger');
    }
  };

  const cancelEdit = () => {
    setEditingPassenger(null);
    setPassengerForm({ name: '', aadhar: '', gender: 'Male', phone: '', email: '', date_of_birth: '' });
  };

  const deletePassenger = async (passengerId) => {
    if (!confirm('Are you sure you want to delete this passenger?')) return;
    
    try {
      const res = await fetch(`/api/passengers/${passengerId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      
      if (res.ok) {
        fetchSavedPassengers();
        alert('Passenger deleted successfully!');
      } else {
        alert('Failed to delete passenger');
      }
    } catch (error) {
      alert('Error deleting passenger');
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        const data = await res.json();
        updateUser(data.user);
        setEditMode(false);
        alert('Profile updated successfully!');
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to update profile');
      }
    } catch (error) {
      alert('Error updating profile');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>;
  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <div className="text-sm text-gray-600">
            Member since {new Date(user.created_at || Date.now()).toLocaleDateString()}
          </div>
        </div>
        
        {/* User Stats */}
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
                  <p className="text-2xl font-bold text-gray-900">{userStats?.stats?.total_bookings || 0}</p>
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
                  <p className="text-2xl font-bold text-gray-900">₹{Number(userStats?.stats?.total_spent || 0).toLocaleString()}</p>
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
                  <p className="text-2xl font-bold text-gray-900">{userStats?.stats?.total_trips || 0}</p>
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
                  <p className="text-2xl font-bold text-gray-900">{userStats?.stats?.confirmed_bookings || 0}</p>
                </div>
              </div>
            </div>
          </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
              <button
                onClick={() => setEditMode(!editMode)}
                className="text-indigo-600 hover:text-indigo-800 font-medium"
              >
                {editMode ? 'Cancel' : 'Edit'}
              </button>
            </div>
            
            {editMode ? (
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Username</label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={updating}
                  className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50"
                >
                  {updating ? 'Updating...' : 'Update Profile'}
                </button>
              </form>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Username</label>
                  <p className="mt-1 text-sm text-gray-900">{user.username}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Full Name</label>
                  <p className="mt-1 text-sm text-gray-900">{user.name || 'Not provided'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="mt-1 text-sm text-gray-900">{user.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <p className="mt-1 text-sm text-gray-900">{user.phone || 'Not provided'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Role</label>
                  <p className="mt-1 text-sm text-gray-900 capitalize">{user.role}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Account Status</label>
                  <span className="mt-1 inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                    Active
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Saved Passengers */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Saved Passengers</h2>
              <button 
                onClick={() => setShowAddPassenger(true)}
                className="text-indigo-600 hover:text-indigo-800 font-medium text-sm"
              >
                Add New
              </button>
            </div>
            
            {savedPassengers.length > 0 ? (
              <div className="space-y-3">
                {savedPassengers.map((passenger, index) => (
                  <div key={passenger.passenger_id} className="border border-gray-200 rounded-lg p-3">
                    {editingPassenger === passenger.passenger_id ? (
                      <form onSubmit={updatePassenger} className="space-y-3">
                        <input
                          type="text"
                          value={passengerForm.name}
                          onChange={(e) => setPassengerForm({...passengerForm, name: e.target.value})}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                          placeholder="Name"
                          required
                        />
                        <input
                          type="text"
                          value={passengerForm.aadhar}
                          onChange={(e) => setPassengerForm({...passengerForm, aadhar: e.target.value})}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                          placeholder="Aadhar"
                          maxLength="12"
                          required
                        />
                        <div className="flex space-x-2">
                          <select
                            value={passengerForm.gender}
                            onChange={(e) => setPassengerForm({...passengerForm, gender: e.target.value})}
                            className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded"
                          >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                          </select>
                          <input
                            type="tel"
                            value={passengerForm.phone}
                            onChange={(e) => setPassengerForm({...passengerForm, phone: e.target.value})}
                            className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded"
                            placeholder="Phone"
                            required
                          />
                        </div>
                        <input
                          type="email"
                          value={passengerForm.email}
                          onChange={(e) => setPassengerForm({...passengerForm, email: e.target.value})}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                          placeholder="Email"
                          required
                        />
                        <input
                          type="date"
                          value={passengerForm.date_of_birth}
                          onChange={(e) => setPassengerForm({...passengerForm, date_of_birth: e.target.value})}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                          required
                        />
                        <div className="flex space-x-2">
                          <button
                            type="submit"
                            className="flex-1 bg-green-600 text-white py-1 px-2 rounded text-sm hover:bg-green-700"
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={cancelEdit}
                            className="flex-1 bg-gray-500 text-white py-1 px-2 rounded text-sm hover:bg-gray-600"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-gray-900">{passenger.name}</p>
                          <p className="text-sm text-gray-600">{passenger.aadhar}</p>
                          <p className="text-xs text-gray-500">{passenger.gender}, {passenger.phone}</p>
                          <p className="text-xs text-gray-500">{passenger.email}</p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => editPassenger(passenger)}
                            className="text-indigo-600 hover:text-indigo-800 text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deletePassenger(passenger.passenger_id)}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
                <p className="mt-2">No saved passengers</p>
                <p className="text-sm">Add passengers for quick booking</p>
              </div>
            )}
          </div>

          {/* Recent Bookings */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Recent Bookings</h2>
              <button 
                onClick={() => router.push('/bookings')}
                className="text-indigo-600 hover:text-indigo-800 font-medium text-sm"
              >
                View All
              </button>
            </div>
            
            {userStats?.recentBookings && userStats.recentBookings.length > 0 ? (
              <div className="space-y-4">
                {userStats.recentBookings.map((booking, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-900">PNR: {booking.pnr_number}</p>
                        <p className="text-sm text-gray-600">{booking.flight_number} - {booking.flight_name}</p>
                        <p className="text-sm text-gray-500">
                          {booking.departure_city} → {booking.arrival_city}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(booking.booking_date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">₹{Number(booking.total_amount).toLocaleString()}</p>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          booking.booking_status === 'Confirmed' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {booking.booking_status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p className="mt-2">No bookings found</p>
                <p className="text-sm">Your flight bookings will appear here</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Add Passenger Modal */}
        {showAddPassenger && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Add New Passenger</h3>
                <button
                  onClick={() => setShowAddPassenger(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={editingPassenger ? updatePassenger : addPassenger} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Full Name</label>
                  <input
                    type="text"
                    value={passengerForm.name}
                    onChange={(e) => setPassengerForm({...passengerForm, name: e.target.value})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Aadhar Number</label>
                  <input
                    type="text"
                    value={passengerForm.aadhar}
                    onChange={(e) => setPassengerForm({...passengerForm, aadhar: e.target.value})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    maxLength="12"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Gender</label>
                  <select
                    value={passengerForm.gender}
                    onChange={(e) => setPassengerForm({...passengerForm, gender: e.target.value})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <input
                    type="tel"
                    value={passengerForm.phone}
                    onChange={(e) => setPassengerForm({...passengerForm, phone: e.target.value})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    value={passengerForm.email}
                    onChange={(e) => setPassengerForm({...passengerForm, email: e.target.value})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                  <input
                    type="date"
                    value={passengerForm.date_of_birth}
                    onChange={(e) => setPassengerForm({...passengerForm, date_of_birth: e.target.value})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddPassenger(false)}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors"
                  >
                    {editingPassenger ? 'Update Passenger' : 'Add Passenger'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
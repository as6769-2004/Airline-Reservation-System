import { query } from '../../lib/db';

async function getStats() {
  try {
    const [p, f, b, pay, fb] = await Promise.all([
      query('SELECT COUNT(*) c FROM passenger'),
      query('SELECT COUNT(*) c FROM flight'),
      query('SELECT COUNT(*) c FROM booking'),
      query('SELECT COALESCE(SUM(amount),0) sum FROM payment'),
      query('SELECT COUNT(*) c FROM customer_feedback'),
    ]);
    return {
      passengers: p[0]?.c || 0,
      flights: f[0]?.c || 0,
      bookings: b[0]?.c || 0,
      revenue: pay[0]?.sum || 0,
      feedback: fb[0]?.c || 0,
    };
  } catch {
    return { passengers: 0, flights: 0, bookings: 0, revenue: 0, feedback: 0 };
  }
}

export default async function DashboardPage() {
  const stats = await getStats();
  const items = [
    { label: 'Total Passengers', value: stats.passengers, icon: '👥', color: 'bg-blue-500' },
    { label: 'Total Flights', value: stats.flights, icon: '✈️', color: 'bg-indigo-500' },
    { label: 'Total Bookings', value: stats.bookings, icon: '🎫', color: 'bg-green-500' },
    { label: 'Total Revenue', value: `₹ ${Number(stats.revenue || 0).toFixed(2)}`, icon: '💰', color: 'bg-yellow-500' },
  ];
  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((i) => (
          <div key={i.label} className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`${i.color} text-white p-3 rounded-lg`}>
                <span className="text-2xl">{i.icon}</span>
              </div>
            </div>
            <p className="text-sm text-gray-500 mb-1">{i.label}</p>
            <p className="text-3xl font-bold text-gray-900">{i.value}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">System Overview</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Active Flights</span>
              <span className="font-semibold">{stats.flights}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Confirmed Bookings</span>
              <span className="font-semibold">{stats.bookings}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Customer Feedback</span>
              <span className="font-semibold">{stats.feedback}</span>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <a href="/flights" className="block w-full text-left p-3 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors">
              <span className="font-medium">Manage Flights</span>
              <span className="block text-sm text-indigo-600">Add, edit, or remove flights</span>
            </a>
            <a href="/bookings" className="block w-full text-left p-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors">
              <span className="font-medium">View Bookings</span>
              <span className="block text-sm text-green-600">See all customer bookings</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}



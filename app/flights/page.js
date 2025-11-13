import FlightManager from '../../components/flights/FlightManager';

export default function FlightsPage() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Flights Management</h1>
      <FlightManager />
    </div>
  );
}



import PassengerList from '../../components/passengers/PassengerList';
import PassengerForm from '../../components/passengers/PassengerForm';

export const dynamic = 'force-dynamic';

export default function PassengersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Passengers</h1>
      </div>
      <PassengerForm />
      <PassengerList />
    </div>
  );
}



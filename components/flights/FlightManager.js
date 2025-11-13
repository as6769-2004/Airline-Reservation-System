'use client';
import { useEffect, useState } from 'react';

export default function FlightManager() {
  const [airports, setAirports] = useState([]);
  const [flights, setFlights] = useState([]);
  const [form, setForm] = useState({ flight_number: '', flight_name: '', departure_airport_id: '', arrival_airport_id: '', travel_date: '', available_seats: 0, price: 0, journey_time: '' });

  function setField(k, v) { setForm({ ...form, [k]: v }); }

  async function load() {
    const [aRes, fRes] = await Promise.all([
      fetch('/api/airports'),
      fetch('/api/flights'),
    ]);
    const aData = await aRes.json();
    const fData = await fRes.json();
    setAirports(aData.airports || []);
    setFlights(fData.flights || []);
  }

  useEffect(() => { load(); }, []);

  async function add(e) {
    e.preventDefault();
    await fetch('/api/flights', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    setForm({ flight_number: '', flight_name: '', departure_airport_id: '', arrival_airport_id: '', travel_date: '', available_seats: 0, price: 0, journey_time: '' });
    load();
  }

  async function remove(id) {
    if (!confirm('Delete flight?')) return;
    await fetch(`/api/flights/${id}`, { method: 'DELETE' });
    load();
  }

  return (
    <div className="space-y-4">
      <form onSubmit={add} className="bg-white border rounded p-4 grid grid-cols-1 md:grid-cols-6 gap-3">
        <input className="border p-2 rounded" placeholder="Flight Number" value={form.flight_number} onChange={e=>setField('flight_number', e.target.value)} required />
        <input className="border p-2 rounded" placeholder="Flight Name" value={form.flight_name} onChange={e=>setField('flight_name', e.target.value)} required />
        <select className="border p-2 rounded" value={form.departure_airport_id} onChange={e=>setField('departure_airport_id', e.target.value)} required>
          <option value="">From Airport</option>
          {airports.map(a => <option key={a.airport_id} value={a.airport_id}>{a.airport_code}</option>)}
        </select>
        <select className="border p-2 rounded" value={form.arrival_airport_id} onChange={e=>setField('arrival_airport_id', e.target.value)} required>
          <option value="">To Airport</option>
          {airports.map(a => <option key={a.airport_id} value={a.airport_id}>{a.airport_code}</option>)}
        </select>
        <input type="date" className="border p-2 rounded" value={form.travel_date} onChange={e=>setField('travel_date', e.target.value)} required />
        <input type="number" min="0" className="border p-2 rounded" placeholder="Seats" value={form.available_seats} onChange={e=>setField('available_seats', Number(e.target.value))} required />
        <input type="number" min="0" step="0.01" className="border p-2 rounded" placeholder="Price (₹)" value={form.price} onChange={e=>setField('price', Number(e.target.value))} required />
        <input className="border p-2 rounded md:col-span-2" placeholder="Journey Time (e.g., 2h 30m)" value={form.journey_time} onChange={e=>setField('journey_time', e.target.value)} required />
        <div className="md:col-span-6"><button className="bg-blue-600 text-white rounded px-4 py-2">Add Flight</button></div>
      </form>
      <div className="bg-white border rounded divide-y">
        {flights.map(f => (
          <div key={f.flight_id} className="p-3 flex items-center justify-between">
            <div>
              <p className="font-medium">{f.flight_name} ({f.flight_number})</p>
              <p className="text-xs text-gray-500">{f.departure_airport_code} → {f.arrival_airport_code} • {f.journey_time} • ₹ {Number(f.price).toFixed(2)}</p>
            </div>
            <button onClick={()=>remove(f.flight_id)} className="text-red-600 text-sm">Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}



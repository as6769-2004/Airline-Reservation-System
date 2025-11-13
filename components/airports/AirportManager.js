'use client';
import { useEffect, useState } from 'react';

export default function AirportManager() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ airport_code: '', airport_name: '', city: '', country: 'India' });
  const [loading, setLoading] = useState(true);

  function setField(k, v) { setForm({ ...form, [k]: v }); }

  async function load() {
    setLoading(true);
    const res = await fetch('/api/airports');
    const data = await res.json();
    setItems(data.airports || []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function add(e) {
    e.preventDefault();
    await fetch('/api/airports', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    setForm({ airport_code: '', airport_name: '', city: '', country: 'India' });
    load();
  }

  async function remove(id) {
    if (!confirm('Delete airport?')) return;
    await fetch(`/api/airports/${id}`, { method: 'DELETE' });
    load();
  }

  return (
    <div className="space-y-4">
      <form onSubmit={add} className="bg-white border rounded p-4 grid grid-cols-1 md:grid-cols-4 gap-3">
        <input className="border p-2 rounded" placeholder="Code (e.g., DEL)" value={form.airport_code} onChange={e=>setField('airport_code', e.target.value.toUpperCase().slice(0,3))} required />
        <input className="border p-2 rounded" placeholder="Airport Name" value={form.airport_name} onChange={e=>setField('airport_name', e.target.value)} required />
        <input className="border p-2 rounded" placeholder="City" value={form.city} onChange={e=>setField('city', e.target.value)} />
        <input className="border p-2 rounded" placeholder="Country" value={form.country} onChange={e=>setField('country', e.target.value)} />
        <div className="md:col-span-4"><button className="bg-blue-600 text-white rounded px-4 py-2">Add Airport</button></div>
      </form>
      <div className="bg-white border rounded divide-y">
        {loading && <p className="p-3 text-sm">Loading...</p>}
        {!loading && items.length === 0 && <p className="p-3 text-sm text-gray-600">No airports.</p>}
        {items.map(a => (
          <div key={a.airport_id} className="p-3 flex items-center justify-between">
            <div>
              <p className="font-medium">{a.airport_code} — {a.airport_name}</p>
              <p className="text-xs text-gray-500">{a.city}, {a.country}</p>
            </div>
            <button onClick={()=>remove(a.airport_id)} className="text-red-600 text-sm">Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}



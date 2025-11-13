'use client';
import { useEffect, useState } from 'react';

export default function PassengerList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');

  async function load() {
    setLoading(true);
    const res = await fetch(`/api/passengers?q=${encodeURIComponent(q)}`);
    const data = await res.json();
    setItems(data.passengers || []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function remove(id) {
    if (!confirm('Delete passenger?')) return;
    await fetch(`/api/passengers/${id}`, { method: 'DELETE' });
    load();
  }

  return (
    <div className="bg-white border rounded">
      <div className="p-3 border-b flex items-center gap-2">
        <input className="border p-2 rounded w-full" placeholder="Search by name, Aadhar, phone" value={q} onChange={e=>setQ(e.target.value)} />
        <button onClick={load} className="px-3 py-2 rounded bg-gray-900 text-white">Search</button>
      </div>
      <div className="divide-y">
        {loading && <p className="p-3 text-sm text-gray-600">Loading...</p>}
        {!loading && items.length === 0 && <p className="p-3 text-sm text-gray-600">No passengers.</p>}
        {items.map(p => (
          <div key={p.passenger_id} className="p-3 flex items-center justify-between">
            <div>
              <p className="font-medium">{p.name}</p>
              <p className="text-xs text-gray-500">Aadhar: {p.aadhar} • {p.phone} • {p.email || '—'}</p>
            </div>
            <div className="flex gap-2">
              {/* Future: edit modal */}
              <button onClick={()=>remove(p.passenger_id)} className="text-red-600 text-sm">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}



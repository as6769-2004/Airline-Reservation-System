'use client';
import { useState } from 'react';

export default function PassengerForm() {
  const [form, setForm] = useState({ name: '', aadhar: '', phone: '', email: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  function setField(k, v) { setForm({ ...form, [k]: v }); }

  async function onSubmit(e) {
    e.preventDefault(); setMessage(''); setLoading(true);
    try {
      const res = await fetch('/api/passengers', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      setMessage('Passenger added');
      setForm({ name: '', aadhar: '', phone: '', email: '' });
    } catch (e) {
      setMessage(e.message);
    } finally { setLoading(false); }
  }

  return (
    <form onSubmit={onSubmit} className="bg-white border rounded p-4 grid grid-cols-1 md:grid-cols-4 gap-3">
      <input className="border p-2 rounded" placeholder="Full Name" value={form.name} onChange={e=>setField('name', e.target.value)} required />
      <input className="border p-2 rounded" placeholder="Aadhar (12-digit)" value={form.aadhar} onChange={e=>setField('aadhar', e.target.value.replace(/\D/g,'').slice(0,12))} required />
      <input className="border p-2 rounded" placeholder="Phone (+91XXXXXXXXXX)" value={form.phone} onChange={e=>setField('phone', e.target.value)} required />
      <input className="border p-2 rounded" placeholder="Email" value={form.email} onChange={e=>setField('email', e.target.value)} />
      <div className="md:col-span-4 flex items-center gap-3">
        <button className="bg-blue-600 text-white rounded px-4 py-2">{loading? 'Saving...' : 'Add Passenger'}</button>
        {message && <p className="text-sm text-gray-600">{message}</p>}
      </div>
    </form>
  );
}



import { useState } from 'react';

export default function CustomOrder() {
  const [form, setForm] = useState({
    description: '',
    material: '',
    color: '',
    email: ''
  });

  return (
    <section className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold">Request a Custom Print</h1>
      <p className="text-gray-600 mt-2">Describe what you need, preferred material and color. We'll review and send a quote via email.</p>
      <form className="bg-white border rounded-lg p-6 mt-6 space-y-4" onSubmit={e => e.preventDefault()}>
        <div>
          <label className="block text-sm text-gray-600">Description</label>
          <textarea className="w-full border rounded px-3 py-2" rows={5} value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Size, purpose, tolerances, etc." />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-600">Material</label>
            <input className="w-full border rounded px-3 py-2" value={form.material} onChange={e => setForm({...form, material: e.target.value})} placeholder="PLA, PETG, etc." />
          </div>
          <div>
            <label className="block text-sm text-gray-600">Color</label>
            <input className="w-full border rounded px-3 py-2" value={form.color} onChange={e => setForm({...form, color: e.target.value})} placeholder="e.g., Matte Black" />
          </div>
        </div>
        <div>
          <label className="block text-sm text-gray-600">Email</label>
          <input type="email" className="w-full border rounded px-3 py-2" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="you@example.com" />
        </div>
        <div className="text-sm text-gray-600">File uploads coming soon. For now, include links if needed.</div>
        <button className="btn-primary" type="submit">Submit Request</button>
      </form>
    </section>
  );
}

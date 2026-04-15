import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../utils/api';

const tabs = ['Overview', 'Users', 'Medicines', 'Hospitals', 'Diet Plans'];

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('Overview');
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [dietPlans, setDietPlans] = useState([]);
  const [showMedForm, setShowMedForm] = useState(false);
  const [showHospForm, setShowHospForm] = useState(false);
  const [medForm, setMedForm] = useState({ name: '', genericName: '', category: '', uses: '', dosage: { adult: '', child: '', frequency: '' }, sideEffects: '', prescription: false, manufacturer: '' });
  const [hospForm, setHospForm] = useState({ name: '', type: 'hospital', city: '', state: '', address: '', phone: '', email: '', specialties: '', emergencyServices: false, rating: '' });

  useEffect(() => {
    api.get('/admin/stats').then(r => setStats(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    if (activeTab === 'Users') api.get('/admin/users').then(r => setUsers(r.data)).catch(() => {});
    if (activeTab === 'Medicines') api.get('/medicines').then(r => setMedicines(r.data)).catch(() => {});
    if (activeTab === 'Hospitals') api.get('/hospitals').then(r => setHospitals(r.data)).catch(() => {});
    if (activeTab === 'Diet Plans') api.get('/diet').then(r => setDietPlans(r.data)).catch(() => {});
  }, [activeTab]);

  const deleteUser = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    await api.delete(`/admin/users/${id}`);
    setUsers(prev => prev.filter(u => u._id !== id));
    toast.success('User deleted');
  };

  const toggleRole = async (user) => {
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    await api.put(`/admin/users/${user._id}/role`, { role: newRole });
    setUsers(prev => prev.map(u => u._id === user._id ? { ...u, role: newRole } : u));
    toast.success(`Role updated to ${newRole}`);
  };

  const deleteMedicine = async (id) => {
    if (!window.confirm('Delete this medicine?')) return;
    await api.delete(`/medicines/${id}`);
    setMedicines(prev => prev.filter(m => m._id !== id));
    toast.success('Medicine deleted');
  };

  const deleteHospital = async (id) => {
    if (!window.confirm('Delete this hospital?')) return;
    await api.delete(`/hospitals/${id}`);
    setHospitals(prev => prev.filter(h => h._id !== id));
    toast.success('Hospital deleted');
  };

  const submitMedicine = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...medForm,
        uses: medForm.uses.split(',').map(s => s.trim()).filter(Boolean),
        sideEffects: medForm.sideEffects.split(',').map(s => s.trim()).filter(Boolean),
      };
      const res = await api.post('/medicines', payload);
      setMedicines(prev => [...prev, res.data]);
      setShowMedForm(false);
      setMedForm({ name: '', genericName: '', category: '', uses: '', dosage: { adult: '', child: '', frequency: '' }, sideEffects: '', prescription: false, manufacturer: '' });
      toast.success('Medicine added!');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to add medicine'); }
  };

  const submitHospital = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...hospForm,
        specialties: hospForm.specialties.split(',').map(s => s.trim()).filter(Boolean),
        rating: hospForm.rating ? parseFloat(hospForm.rating) : undefined,
      };
      const res = await api.post('/hospitals', payload);
      setHospitals(prev => [...prev, res.data]);
      setShowHospForm(false);
      toast.success('Hospital added!');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to add hospital'); }
  };

  const StatCard = ({ label, value, icon, color }) => (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
      <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center text-xl mb-3`}>{icon}</div>
      <p className="font-display font-bold text-2xl text-slate-800">{value}</p>
      <p className="text-slate-500 text-sm">{label}</p>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6 fade-up">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center text-xl">⚙️</div>
        <div>
          <h1 className="font-display font-bold text-2xl text-slate-800">Admin Panel</h1>
          <p className="text-slate-500 text-sm">Manage platform data and users</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl overflow-x-auto">
        {tabs.map(t => (
          <button key={t} onClick={() => setActiveTab(t)}
            className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
              activeTab === t ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}>
            {t}
          </button>
        ))}
      </div>

      {/* Overview */}
      {activeTab === 'Overview' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <StatCard label="Total Users" value={stats.users || 0} icon="👥" color="bg-blue-50" />
          <StatCard label="Medicines" value={stats.medicines || 0} icon="💊" color="bg-purple-50" />
          <StatCard label="Hospitals" value={stats.hospitals || 0} icon="🏥" color="bg-teal-50" />
          <StatCard label="Diet Plans" value={stats.dietPlans || 0} icon="🥗" color="bg-green-50" />
          <StatCard label="Health Records" value={stats.records || 0} icon="📊" color="bg-orange-50" />
        </div>
      )}

      {/* Users */}
      {activeTab === 'Users' && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100">
            <h2 className="font-display font-semibold text-slate-800">Users ({users.length})</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  {['Name', 'Email', 'Role', 'Joined', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map(u => (
                  <tr key={u._id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-800">{u.name}</td>
                    <td className="px-4 py-3 text-slate-600">{u.email}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-600'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => toggleRole(u)} className="text-xs text-purple-600 hover:underline">Toggle Role</button>
                        <button onClick={() => deleteUser(u._id)} className="text-xs text-red-500 hover:underline">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Medicines */}
      {activeTab === 'Medicines' && (
        <div className="space-y-4">
          <button onClick={() => setShowMedForm(!showMedForm)}
            className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:from-green-600 hover:to-teal-600 transition-all">
            {showMedForm ? '✕ Cancel' : '+ Add Medicine'}
          </button>
          {showMedForm && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <h3 className="font-display font-semibold text-slate-800 mb-4">Add New Medicine</h3>
              <form onSubmit={submitMedicine} className="grid sm:grid-cols-2 gap-4">
                {[
                  { key: 'name', label: 'Medicine Name *', required: true },
                  { key: 'genericName', label: 'Generic Name' },
                  { key: 'category', label: 'Category' },
                  { key: 'manufacturer', label: 'Manufacturer' },
                ].map(f => (
                  <div key={f.key}>
                    <label className="block text-xs font-medium text-slate-600 mb-1">{f.label}</label>
                    <input value={medForm[f.key]} onChange={e => setMedForm({ ...medForm, [f.key]: e.target.value })} required={f.required}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                  </div>
                ))}
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Uses (comma-separated)</label>
                  <input value={medForm.uses} onChange={e => setMedForm({ ...medForm, uses: e.target.value })}
                    placeholder="Fever, Headache, Pain relief"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Side Effects (comma-separated)</label>
                  <input value={medForm.sideEffects} onChange={e => setMedForm({ ...medForm, sideEffects: e.target.value })}
                    placeholder="Nausea, Dizziness"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Adult Dosage</label>
                  <input value={medForm.dosage.adult} onChange={e => setMedForm({ ...medForm, dosage: { ...medForm.dosage, adult: e.target.value } })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Frequency</label>
                  <input value={medForm.dosage.frequency} onChange={e => setMedForm({ ...medForm, dosage: { ...medForm.dosage, frequency: e.target.value } })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="rx" checked={medForm.prescription} onChange={e => setMedForm({ ...medForm, prescription: e.target.checked })}
                    className="w-4 h-4 accent-green-500" />
                  <label htmlFor="rx" className="text-sm text-slate-700">Prescription Required</label>
                </div>
                <div className="sm:col-span-2">
                  <button type="submit" className="bg-green-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-green-600 transition-colors">Add Medicine</button>
                </div>
              </form>
            </div>
          )}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr>{['Name', 'Category', 'Rx', 'Actions'].map(h => <th key={h} className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {medicines.map(m => (
                  <tr key={m._id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-800">{m.name}</td>
                    <td className="px-4 py-3 text-slate-600">{m.category}</td>
                    <td className="px-4 py-3">{m.prescription ? <span className="text-orange-600 text-xs font-medium">Yes</span> : <span className="text-green-600 text-xs">OTC</span>}</td>
                    <td className="px-4 py-3"><button onClick={() => deleteMedicine(m._id)} className="text-xs text-red-500 hover:underline">Delete</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Hospitals */}
      {activeTab === 'Hospitals' && (
        <div className="space-y-4">
          <button onClick={() => setShowHospForm(!showHospForm)}
            className="bg-gradient-to-r from-teal-500 to-green-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:from-teal-600 hover:to-green-600 transition-all">
            {showHospForm ? '✕ Cancel' : '+ Add Hospital'}
          </button>
          {showHospForm && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <h3 className="font-display font-semibold text-slate-800 mb-4">Add New Hospital</h3>
              <form onSubmit={submitHospital} className="grid sm:grid-cols-2 gap-4">
                {[
                  { key: 'name', label: 'Name *', required: true },
                  { key: 'city', label: 'City *', required: true },
                  { key: 'state', label: 'State' },
                  { key: 'address', label: 'Address' },
                  { key: 'phone', label: 'Phone' },
                  { key: 'email', label: 'Email' },
                ].map(f => (
                  <div key={f.key}>
                    <label className="block text-xs font-medium text-slate-600 mb-1">{f.label}</label>
                    <input value={hospForm[f.key]} onChange={e => setHospForm({ ...hospForm, [f.key]: e.target.value })} required={f.required}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                  </div>
                ))}
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Type</label>
                  <select value={hospForm.type} onChange={e => setHospForm({ ...hospForm, type: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white">
                    {['hospital', 'clinic', 'diagnostic', 'pharmacy'].map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Rating (1-5)</label>
                  <input type="number" min="1" max="5" step="0.1" value={hospForm.rating} onChange={e => setHospForm({ ...hospForm, rating: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Specialties (comma-separated)</label>
                  <input value={hospForm.specialties} onChange={e => setHospForm({ ...hospForm, specialties: e.target.value })}
                    placeholder="Cardiology, Neurology"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="emergency" checked={hospForm.emergencyServices} onChange={e => setHospForm({ ...hospForm, emergencyServices: e.target.checked })} className="w-4 h-4 accent-green-500" />
                  <label htmlFor="emergency" className="text-sm text-slate-700">24/7 Emergency Services</label>
                </div>
                <div className="sm:col-span-2">
                  <button type="submit" className="bg-teal-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-teal-600 transition-colors">Add Hospital</button>
                </div>
              </form>
            </div>
          )}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr>{['Name', 'City', 'Type', 'Emergency', 'Actions'].map(h => <th key={h} className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {hospitals.map(h => (
                  <tr key={h._id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-800">{h.name}</td>
                    <td className="px-4 py-3 text-slate-600">{h.city}</td>
                    <td className="px-4 py-3 capitalize text-slate-600">{h.type}</td>
                    <td className="px-4 py-3">{h.emergencyServices ? <span className="text-red-600 text-xs font-medium">24/7</span> : <span className="text-slate-400 text-xs">No</span>}</td>
                    <td className="px-4 py-3"><button onClick={() => deleteHospital(h._id)} className="text-xs text-red-500 hover:underline">Delete</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Diet Plans */}
      {activeTab === 'Diet Plans' && (
        <div className="grid sm:grid-cols-2 gap-4">
          {dietPlans.map(p => (
            <div key={p._id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <h3 className="font-display font-semibold text-slate-800 mb-1">{p.title}</h3>
              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full capitalize">{p.goal?.replace('_', ' ')}</span>
              <p className="text-sm text-slate-500 mt-2">{p.description}</p>
              <p className="text-sm text-slate-600 mt-2">~{p.totalCalories} kcal/day • {p.exercises?.length || 0} exercises</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

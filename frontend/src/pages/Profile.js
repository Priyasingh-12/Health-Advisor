import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

export default function Profile() {
  const { user, login } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    age: user?.age || '',
    gender: user?.gender || '',
    bloodGroup: user?.bloodGroup || '',
    allergies: user?.allergies?.join(', ') || '',
  });
  const [loading, setLoading] = useState(false);
  const [allergyInput, setAllergyInput] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...form,
        allergies: form.allergies ? form.allergies.split(',').map(s => s.trim()).filter(Boolean) : []
      };
      await api.put('/auth/profile', payload);
      toast.success('Profile updated! ✅');
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const InfoRow = ({ label, value, icon }) => (
    <div className="flex items-center gap-3 py-3 border-b border-slate-100 last:border-0">
      <span className="text-lg w-6 text-center">{icon}</span>
      <div>
        <p className="text-xs text-slate-400 font-medium">{label}</p>
        <p className="text-slate-700 font-medium">{value || 'Not set'}</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto space-y-6 fade-up">
      <div>
        <h1 className="font-display font-bold text-2xl text-slate-800">My Profile</h1>
        <p className="text-slate-500 mt-1">Manage your personal health information</p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-green-500 to-teal-500 p-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/30 rounded-2xl flex items-center justify-center text-3xl font-bold text-white backdrop-blur-sm">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div className="text-white">
              <h2 className="font-display font-bold text-xl">{user?.name}</h2>
              <p className="text-green-100 text-sm">{user?.email}</p>
              <span className={`text-xs mt-1 inline-block px-2.5 py-0.5 rounded-full font-medium ${user?.role === 'admin' ? 'bg-white/30 text-white' : 'bg-white/20 text-white'}`}>
                {user?.role === 'admin' ? '⚙️ Administrator' : '👤 User'}
              </span>
            </div>
          </div>
        </div>

        <div className="p-5">
          <InfoRow label="Age" value={user?.age ? `${user.age} years` : null} icon="🎂" />
          <InfoRow label="Gender" value={user?.gender ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1) : null} icon="👤" />
          <InfoRow label="Blood Group" value={user?.bloodGroup} icon="🩸" />
          <InfoRow label="Allergies" value={user?.allergies?.length ? user.allergies.join(', ') : 'None'} icon="⚠️" />
          <InfoRow label="Member Since" value={user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }) : null} icon="📅" />
        </div>
      </div>

      {/* Edit Form */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h2 className="font-display font-semibold text-slate-800 mb-5">Edit Information</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
            <input value={form.name} onChange={update('name')} required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm" />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Age</label>
              <input type="number" value={form.age} onChange={update('age')} min="1" max="120"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Gender</label>
              <select value={form.gender} onChange={update('gender')}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm bg-white">
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Blood Group</label>
              <select value={form.bloodGroup} onChange={update('bloodGroup')}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm bg-white">
                <option value="">Select</option>
                {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Allergies (comma-separated)</label>
            <input value={form.allergies} onChange={update('allergies')}
              placeholder="e.g., Penicillin, Peanuts, Shellfish"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm" />
            <p className="text-xs text-slate-400 mt-1">Enter known allergies separated by commas</p>
          </div>

          <button type="submit" disabled={loading}
            className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white py-3 rounded-xl font-semibold hover:from-green-600 hover:to-teal-600 disabled:opacity-50 transition-all shadow-md shadow-green-200">
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>

      {/* Health Tips */}
      <div className="bg-green-50 border border-green-100 rounded-2xl p-5">
        <h3 className="font-display font-semibold text-green-800 mb-3 flex items-center gap-2"><span>💡</span> Daily Health Tips</h3>
        <ul className="space-y-2 text-sm text-green-700">
          {[
            'Drink at least 8 glasses of water daily',
            'Aim for 7-9 hours of sleep every night',
            'Take a 10-minute walk after every meal',
            'Practice deep breathing or meditation for 5 minutes',
          ].map((tip, i) => (
            <li key={i} className="flex gap-2"><span className="text-green-400">→</span>{tip}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

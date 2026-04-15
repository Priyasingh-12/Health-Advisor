import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { toast } from 'react-toastify';
import api from '../utils/api';
import {
  Chart as ChartJS, CategoryScale, LinearScale,
  PointElement, LineElement, Title, Tooltip, Legend, Filler
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const defaultForm = { weight: '', bloodPressure: { systolic: '', diastolic: '' }, sugarLevel: '', steps: '', heartRate: '', sleep: '', notes: '' };

const chartOptions = (label, color) => ({
  responsive: true,
  plugins: { legend: { display: false }, tooltip: { mode: 'index', intersect: false } },
  scales: {
    x: { grid: { display: false }, ticks: { font: { size: 11 } } },
    y: { grid: { color: '#f1f5f9' }, ticks: { font: { size: 11 } } }
  },
  elements: { point: { radius: 4, hoverRadius: 6 }, line: { tension: 0.4 } }
});

export default function HealthTracker() {
  const [records, setRecords] = useState([]);
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [activeChart, setActiveChart] = useState('weight');

  useEffect(() => { fetchRecords(); }, []);

  const fetchRecords = async () => {
    try {
      const res = await api.get('/health?limit=30');
      setRecords(res.data);
    } catch { }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...form };
      if (!payload.bloodPressure.systolic) delete payload.bloodPressure;
      await api.post('/health', payload);
      toast.success('Health record saved! 📊');
      setForm(defaultForm);
      setShowForm(false);
      fetchRecords();
    } catch {
      toast.error('Failed to save record');
    } finally {
      setLoading(false);
    }
  };

  const deleteRecord = async (id) => {
    if (!window.confirm('Delete this record?')) return;
    await api.delete(`/health/${id}`);
    fetchRecords();
    toast.success('Record deleted');
  };

  const sorted = [...records].sort((a, b) => new Date(a.date) - new Date(b.date));
  const labels = sorted.map(r => new Date(r.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }));

  const chartData = {
    weight: { label: 'Weight (kg)', data: sorted.map(r => r.weight), color: '#3b82f6' },
    sugar: { label: 'Blood Sugar (mg/dL)', data: sorted.map(r => r.sugarLevel), color: '#f59e0b' },
    systolic: { label: 'Systolic BP (mmHg)', data: sorted.map(r => r.bloodPressure?.systolic), color: '#ef4444' },
    steps: { label: 'Daily Steps', data: sorted.map(r => r.steps), color: '#22c55e' },
    heartRate: { label: 'Heart Rate (bpm)', data: sorted.map(r => r.heartRate), color: '#ec4899' },
    sleep: { label: 'Sleep (hours)', data: sorted.map(r => r.sleep), color: '#8b5cf6' },
  };

  const current = chartData[activeChart];
  const chartDataset = {
    labels,
    datasets: [{
      label: current.label,
      data: current.data,
      borderColor: current.color,
      backgroundColor: current.color + '20',
      fill: true,
      borderWidth: 2,
    }]
  };

  const latest = records[0];

  return (
    <div className="max-w-4xl mx-auto space-y-6 fade-up">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display font-bold text-2xl text-slate-800">Health Tracker</h1>
          <p className="text-slate-500 mt-1">Monitor and visualize your health metrics over time</p>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:from-green-600 hover:to-teal-600 transition-all shadow-sm">
          {showForm ? '✕ Cancel' : '+ Log Today\'s Health'}
        </button>
      </div>

      {/* Log Form */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h2 className="font-display font-semibold text-slate-800 mb-5">Log Health Metrics</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
              {[
                { key: 'weight', label: 'Weight (kg)', placeholder: '70', type: 'number' },
                { key: 'sugarLevel', label: 'Blood Sugar (mg/dL)', placeholder: '90', type: 'number' },
                { key: 'steps', label: 'Daily Steps', placeholder: '8000', type: 'number' },
                { key: 'heartRate', label: 'Heart Rate (bpm)', placeholder: '72', type: 'number' },
                { key: 'sleep', label: 'Sleep (hours)', placeholder: '7', type: 'number' },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-xs font-medium text-slate-600 mb-1">{f.label}</label>
                  <input type={f.type} value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                    placeholder={f.placeholder} step="0.1"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
              ))}
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Blood Pressure</label>
                <div className="flex gap-1.5">
                  <input type="number" value={form.bloodPressure.systolic}
                    onChange={e => setForm({ ...form, bloodPressure: { ...form.bloodPressure, systolic: e.target.value } })}
                    placeholder="120" className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                  <span className="flex items-center text-slate-400">/</span>
                  <input type="number" value={form.bloodPressure.diastolic}
                    onChange={e => setForm({ ...form, bloodPressure: { ...form.bloodPressure, diastolic: e.target.value } })}
                    placeholder="80" className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-xs font-medium text-slate-600 mb-1">Notes (optional)</label>
              <input value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })}
                placeholder="How are you feeling today?"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <button type="submit" disabled={loading}
              className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:from-green-600 hover:to-teal-600 disabled:opacity-50 transition-all">
              {loading ? 'Saving...' : 'Save Record'}
            </button>
          </form>
        </div>
      )}

      {/* Latest Stats */}
      {latest && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { label: 'Weight', value: latest.weight ? `${latest.weight}kg` : '—', icon: '⚖️', color: 'bg-blue-50 text-blue-700' },
            { label: 'BP', value: latest.bloodPressure?.systolic ? `${latest.bloodPressure.systolic}/${latest.bloodPressure.diastolic}` : '—', icon: '❤️', color: 'bg-red-50 text-red-700' },
            { label: 'Sugar', value: latest.sugarLevel ? `${latest.sugarLevel}` : '—', icon: '🩸', color: 'bg-orange-50 text-orange-700' },
            { label: 'Steps', value: latest.steps ? latest.steps.toLocaleString() : '—', icon: '👟', color: 'bg-green-50 text-green-700' },
            { label: 'Heart Rate', value: latest.heartRate ? `${latest.heartRate}bpm` : '—', icon: '💓', color: 'bg-pink-50 text-pink-700' },
            { label: 'Sleep', value: latest.sleep ? `${latest.sleep}h` : '—', icon: '😴', color: 'bg-purple-50 text-purple-700' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 text-center">
              <div className="text-2xl mb-1">{s.icon}</div>
              <p className={`font-display font-bold text-lg ${s.color.split(' ')[1]}`}>{s.value}</p>
              <p className="text-xs text-slate-400">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Charts */}
      {records.length > 1 && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h2 className="font-display font-semibold text-slate-800 mb-4">Health Trends</h2>
          <div className="flex flex-wrap gap-2 mb-5">
            {Object.entries(chartData).map(([key, val]) => (
              <button key={key} onClick={() => setActiveChart(key)}
                className={`text-xs px-3 py-1.5 rounded-xl font-medium transition-all ${
                  activeChart === key ? 'text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
                style={activeChart === key ? { backgroundColor: val.color } : {}}>
                {val.label.split(' (')[0]}
              </button>
            ))}
          </div>
          <Line data={chartDataset} options={chartOptions()} height={80} />
        </div>
      )}

      {/* Records Table */}
      {records.length > 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100">
            <h2 className="font-display font-semibold text-slate-800">History ({records.length} records)</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  {['Date', 'Weight', 'BP', 'Sugar', 'Steps', 'HR', 'Sleep', ''].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {records.map(r => (
                  <tr key={r._id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-slate-700 font-medium">{new Date(r.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</td>
                    <td className="px-4 py-3 text-slate-600">{r.weight ? `${r.weight}kg` : '—'}</td>
                    <td className="px-4 py-3 text-slate-600">{r.bloodPressure?.systolic ? `${r.bloodPressure.systolic}/${r.bloodPressure.diastolic}` : '—'}</td>
                    <td className="px-4 py-3 text-slate-600">{r.sugarLevel || '—'}</td>
                    <td className="px-4 py-3 text-slate-600">{r.steps?.toLocaleString() || '—'}</td>
                    <td className="px-4 py-3 text-slate-600">{r.heartRate || '—'}</td>
                    <td className="px-4 py-3 text-slate-600">{r.sleep ? `${r.sleep}h` : '—'}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => deleteRecord(r._id)} className="text-red-400 hover:text-red-600 text-xs">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center">
          <div className="text-5xl mb-4">📊</div>
          <h3 className="font-display font-semibold text-slate-700 mb-2">No records yet</h3>
          <p className="text-slate-500 text-sm">Start logging your daily health metrics to see trends and insights.</p>
          <button onClick={() => setShowForm(true)} className="mt-4 bg-green-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-green-600 transition-colors">
            Log First Record
          </button>
        </div>
      )}
    </div>
  );
}

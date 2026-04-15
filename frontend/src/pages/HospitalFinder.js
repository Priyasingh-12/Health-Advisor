import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const types = [
  { id: '', label: 'All Types' },
  { id: 'hospital', label: '🏥 Hospital' },
  { id: 'clinic', label: '🏨 Clinic' },
  { id: 'diagnostic', label: '🔬 Diagnostic' },
  { id: 'pharmacy', label: '💊 Pharmacy' },
];

const stars = (n) => '★'.repeat(Math.round(n || 0)) + '☆'.repeat(5 - Math.round(n || 0));

export default function HospitalFinder() {
  const [city, setCity] = useState('');
  const [type, setType] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [allCities, setAllCities] = useState([]);

  useEffect(() => {
    api.get('/hospitals').then(r => {
      const cities = [...new Set(r.data.map(h => h.city))].sort();
      setAllCities(cities);
    }).catch(() => {});
  }, []);

  const search = async () => {
    setLoading(true);
    setSearched(true);
    try {
      const params = new URLSearchParams();
      if (city) params.append('city', city);
      if (type) params.append('type', type);
      const res = await api.get(`/hospitals/search?${params}`);
      setResults(res.data);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => { if (e.key === 'Enter') search(); };

  return (
    <div className="max-w-4xl mx-auto space-y-6 fade-up">
      <div>
        <h1 className="font-display font-bold text-2xl text-slate-800">Hospital Finder</h1>
        <p className="text-slate-500 mt-1">Find hospitals, clinics, and healthcare centers near you</p>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">📍</span>
            <input value={city} onChange={e => setCity(e.target.value)} onKeyDown={handleKey}
              placeholder="Enter city name (e.g., Mumbai, Delhi, Pune)..."
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm" />
          </div>
          <select value={type} onChange={e => setType(e.target.value)}
            className="px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm bg-white">
            {types.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
          </select>
          <button onClick={search} disabled={loading}
            className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-6 py-3 rounded-xl font-semibold text-sm hover:from-green-600 hover:to-teal-600 disabled:opacity-50 transition-all whitespace-nowrap">
            {loading ? 'Searching...' : '🔍 Search'}
          </button>
        </div>

        {/* Quick City Buttons */}
        {allCities.length > 0 && (
          <div className="mt-4">
            <p className="text-xs text-slate-400 mb-2">Quick search by city:</p>
            <div className="flex flex-wrap gap-2">
              {allCities.map(c => (
                <button key={c} onClick={() => { setCity(c); }}
                  className={`text-xs px-3 py-1.5 rounded-xl border transition-all ${
                    city === c ? 'bg-green-500 text-white border-green-500' : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-green-300 hover:bg-green-50 hover:text-green-700'
                  }`}>
                  {c}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      {loading && (
        <div className="text-center py-12">
          <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-500">Searching hospitals...</p>
        </div>
      )}

      {searched && !loading && results.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center">
          <div className="text-5xl mb-4">🏥</div>
          <h3 className="font-display font-semibold text-slate-700 mb-2">No results found</h3>
          <p className="text-slate-500 text-sm">Try a different city name or type</p>
        </div>
      )}

      {results.length > 0 && (
        <div className="space-y-4">
          <p className="text-sm text-slate-500 font-medium">{results.length} result{results.length > 1 ? 's' : ''} found{city ? ` in ${city}` : ''}</p>
          {results.map(h => (
            <div key={h._id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md hover:-translate-y-0.5 transition-all">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="font-display font-bold text-slate-800">{h.name}</h3>
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium capitalize ${
                      h.type === 'hospital' ? 'bg-blue-100 text-blue-700' :
                      h.type === 'clinic' ? 'bg-green-100 text-green-700' :
                      h.type === 'diagnostic' ? 'bg-purple-100 text-purple-700' :
                      'bg-orange-100 text-orange-700'
                    }`}>{h.type}</span>
                    {h.emergencyServices && (
                      <span className="text-xs bg-red-100 text-red-700 px-2.5 py-0.5 rounded-full font-medium">🚨 24/7 Emergency</span>
                    )}
                  </div>

                  {h.rating && (
                    <p className="text-sm text-amber-500 mb-2">
                      {stars(h.rating)} <span className="text-slate-500 ml-1">{h.rating}/5</span>
                    </p>
                  )}

                  <div className="space-y-1.5 text-sm text-slate-600">
                    {h.address && <p className="flex gap-2"><span>📍</span>{h.address}</p>}
                    {h.phone && <p className="flex gap-2"><span>📞</span><a href={`tel:${h.phone}`} className="hover:text-green-600">{h.phone}</a></p>}
                    {h.email && <p className="flex gap-2"><span>✉️</span><a href={`mailto:${h.email}`} className="hover:text-green-600">{h.email}</a></p>}
                    {h.website && <p className="flex gap-2"><span>🌐</span><a href={h.website} target="_blank" rel="noreferrer" className="text-green-600 hover:underline">{h.website}</a></p>}
                  </div>

                  {h.specialties?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {h.specialties.map((s, i) => (
                        <span key={i} className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg">{s}</span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2 items-end">
                  {h.phone && (
                    <a href={`tel:${h.phone}`}
                      className="bg-green-500 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-green-600 transition-colors whitespace-nowrap">
                      📞 Call Now
                    </a>
                  )}
                  <a href={`https://maps.google.com/?q=${encodeURIComponent(h.name + ' ' + h.city)}`}
                    target="_blank" rel="noreferrer"
                    className="border border-slate-200 text-slate-600 px-4 py-2 rounded-xl text-sm font-medium hover:border-green-300 hover:text-green-700 transition-colors whitespace-nowrap">
                    🗺️ Get Directions
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Emergency Banner */}
      <div className="bg-red-50 border border-red-200 rounded-2xl p-5">
        <div className="flex gap-3">
          <span className="text-red-500 text-2xl flex-shrink-0">🚨</span>
          <div>
            <h3 className="font-display font-semibold text-red-800 mb-1">Emergency Numbers (India)</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-2">
              {[
                { label: 'Ambulance', number: '108' },
                { label: 'Police', number: '100' },
                { label: 'Fire', number: '101' },
                { label: 'National Emergency', number: '112' },
              ].map(e => (
                <div key={e.label} className="bg-white rounded-xl p-3 text-center">
                  <p className="text-xs text-red-500 font-medium">{e.label}</p>
                  <a href={`tel:${e.number}`} className="font-display font-bold text-xl text-red-700 hover:text-red-900">{e.number}</a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

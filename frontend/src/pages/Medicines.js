import React, { useState, useEffect } from 'react';
import api from '../utils/api';

export default function Medicines() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [all, setAll] = useState([]);

  useEffect(() => {
    api.get('/medicines').then(r => setAll(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }
    const timeout = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await api.get(`/medicines/search?q=${query}`);
        setResults(res.data);
      } catch { setResults([]); }
      finally { setLoading(false); }
    }, 400);
    return () => clearTimeout(timeout);
  }, [query]);

  return (
    <div className="max-w-4xl mx-auto space-y-6 fade-up">
      <div>
        <h1 className="font-display font-bold text-2xl text-slate-800">Medicine Information</h1>
        <p className="text-slate-500 mt-1">Search for medicines to view uses, dosage, and side effects</p>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex gap-2 text-sm">
        <span className="text-amber-500 flex-shrink-0">⚠️</span>
        <p className="text-amber-800">Always consult a doctor or pharmacist before taking any medication. Do not self-medicate.</p>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg">🔍</span>
          <input value={query} onChange={e => { setQuery(e.target.value); setSelected(null); }}
            placeholder="Search medicine name (e.g., Paracetamol, Ibuprofen)..."
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm" />
          {loading && <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">Searching...</span>}
        </div>

        {/* Search Results */}
        {results.length > 0 && !selected && (
          <div className="mt-3 border border-slate-100 rounded-xl overflow-hidden">
            {results.map((m, i) => (
              <button key={m._id} onClick={() => { setSelected(m); setQuery(m.name); setResults([]); }}
                className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-green-50 transition-colors text-left ${i !== 0 ? 'border-t border-slate-100' : ''}`}>
                <span className="text-xl">💊</span>
                <div>
                  <p className="font-medium text-slate-800 text-sm">{m.name}</p>
                  <p className="text-xs text-slate-500">{m.genericName} • {m.category}</p>
                </div>
                {m.prescription && <span className="ml-auto text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full">Rx Required</span>}
              </button>
            ))}
          </div>
        )}
        {query && results.length === 0 && !loading && (
          <p className="mt-3 text-sm text-slate-400 text-center py-3">No medicines found for "{query}"</p>
        )}
      </div>

      {/* Medicine Detail */}
      {selected && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-teal-500 p-6 text-white">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xl">💊</span>
                  <h2 className="font-display font-bold text-2xl">{selected.name}</h2>
                </div>
                <p className="text-green-100">{selected.genericName} • {selected.category}</p>
              </div>
              {selected.prescription && (
                <span className="bg-white/20 text-white text-xs px-3 py-1.5 rounded-full font-medium flex-shrink-0">Rx Required</span>
              )}
            </div>
            {selected.manufacturer && <p className="text-green-100 text-sm mt-2">By {selected.manufacturer}</p>}
          </div>

          <div className="p-6 grid md:grid-cols-2 gap-6">
            {selected.uses?.length > 0 && (
              <div>
                <h3 className="font-display font-semibold text-slate-800 mb-3 flex items-center gap-2"><span>🎯</span> Uses</h3>
                <ul className="space-y-1.5">
                  {selected.uses.map((u, i) => (
                    <li key={i} className="flex gap-2 text-sm text-slate-600"><span className="text-green-500">✓</span>{u}</li>
                  ))}
                </ul>
              </div>
            )}

            {selected.dosage && (
              <div>
                <h3 className="font-display font-semibold text-slate-800 mb-3 flex items-center gap-2"><span>⚖️</span> Dosage</h3>
                <div className="space-y-2">
                  {selected.dosage.adult && (
                    <div className="bg-blue-50 rounded-xl p-3">
                      <p className="text-xs font-medium text-blue-600 mb-0.5">Adult</p>
                      <p className="text-sm text-blue-900">{selected.dosage.adult}</p>
                    </div>
                  )}
                  {selected.dosage.child && (
                    <div className="bg-purple-50 rounded-xl p-3">
                      <p className="text-xs font-medium text-purple-600 mb-0.5">Child</p>
                      <p className="text-sm text-purple-900">{selected.dosage.child}</p>
                    </div>
                  )}
                  {selected.dosage.frequency && (
                    <div className="bg-teal-50 rounded-xl p-3">
                      <p className="text-xs font-medium text-teal-600 mb-0.5">Frequency</p>
                      <p className="text-sm text-teal-900">{selected.dosage.frequency}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {selected.sideEffects?.length > 0 && (
              <div>
                <h3 className="font-display font-semibold text-slate-800 mb-3 flex items-center gap-2"><span>⚠️</span> Side Effects</h3>
                <ul className="space-y-1.5">
                  {selected.sideEffects.map((s, i) => (
                    <li key={i} className="flex gap-2 text-sm text-slate-600"><span className="text-orange-400">•</span>{s}</li>
                  ))}
                </ul>
              </div>
            )}

            {selected.contraindications?.length > 0 && (
              <div>
                <h3 className="font-display font-semibold text-slate-800 mb-3 flex items-center gap-2"><span>🚫</span> Contraindications</h3>
                <ul className="space-y-1.5">
                  {selected.contraindications.map((c, i) => (
                    <li key={i} className="flex gap-2 text-sm text-slate-600"><span className="text-red-400">✕</span>{c}</li>
                  ))}
                </ul>
              </div>
            )}

            {selected.interactions?.length > 0 && (
              <div className="md:col-span-2">
                <h3 className="font-display font-semibold text-slate-800 mb-3 flex items-center gap-2"><span>🔗</span> Drug Interactions</h3>
                <div className="flex flex-wrap gap-2">
                  {selected.interactions.map((i, idx) => (
                    <span key={idx} className="bg-red-50 text-red-700 border border-red-100 text-sm px-3 py-1 rounded-xl">{i}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Browse All */}
      {!query && all.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <h2 className="font-display font-semibold text-slate-800 mb-4">Browse All Medicines ({all.length})</h2>
          <div className="grid sm:grid-cols-2 gap-2">
            {all.map(m => (
              <button key={m._id} onClick={() => { setSelected(m); setQuery(m.name); }}
                className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:border-green-300 hover:bg-green-50 transition-all text-left">
                <span className="text-xl">💊</span>
                <div className="min-w-0">
                  <p className="font-medium text-slate-800 text-sm truncate">{m.name}</p>
                  <p className="text-xs text-slate-400 truncate">{m.category}</p>
                </div>
                {m.prescription && <span className="ml-auto text-xs text-orange-500 flex-shrink-0">Rx</span>}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState } from 'react';
import api from '../utils/api';

const commonSymptoms = [
  'Fever', 'Headache', 'Cough', 'Sore throat', 'Fatigue', 'Nausea',
  'Vomiting', 'Diarrhea', 'Chest pain', 'Shortness of breath',
  'Dizziness', 'Rash', 'Joint pain', 'Muscle aches', 'Runny nose',
  'Loss of appetite', 'Abdominal pain', 'Back pain', 'Chills', 'Sweating'
];

const severityConfig = {
  mild: { color: 'bg-green-50 border-green-200 text-green-800', badge: 'bg-green-100 text-green-700', icon: '🟢' },
  moderate: { color: 'bg-yellow-50 border-yellow-200 text-yellow-800', badge: 'bg-yellow-100 text-yellow-700', icon: '🟡' },
  severe: { color: 'bg-red-50 border-red-200 text-red-800', badge: 'bg-red-100 text-red-700', icon: '🔴' },
};

export default function SymptomChecker() {
  const [selected, setSelected] = useState([]);
  const [custom, setCustom] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const toggleSymptom = (s) => {
    setSelected(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  };

  const addCustom = () => {
    const trimmed = custom.trim();
    if (trimmed && !selected.includes(trimmed)) {
      setSelected(prev => [...prev, trimmed]);
    }
    setCustom('');
  };

  const analyze = async () => {
    if (selected.length === 0) return setError('Please select at least one symptom.');
    setError('');
    setLoading(true);
    setResult(null);
    try {
      const res = await api.post('/symptoms/check', { symptoms: selected });
      setResult(res.data);
    } catch {
      setError('Analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => { setSelected([]); setResult(null); setError(''); };

  const sev = result?.severity?.toLowerCase();
  const sevStyle = severityConfig[sev] || severityConfig.mild;

  return (
    <div className="max-w-4xl mx-auto space-y-6 fade-up">
      <div>
        <h1 className="font-display font-bold text-2xl text-slate-800">Symptom Checker</h1>
        <p className="text-slate-500 mt-1">Select your symptoms to get AI-powered health insights</p>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3 text-sm">
        <span className="text-amber-500 text-lg flex-shrink-0">⚠️</span>
        <p className="text-amber-800">This tool provides general health information only. For accurate diagnosis, please consult a qualified healthcare professional. If you experience severe symptoms, seek emergency care immediately.</p>
      </div>

      {!result ? (
        <div className="space-y-6">
          {/* Common Symptoms */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h2 className="font-display font-semibold text-slate-800 mb-4">Select Symptoms</h2>
            <div className="flex flex-wrap gap-2">
              {commonSymptoms.map(s => (
                <button key={s} onClick={() => toggleSymptom(s)}
                  className={`px-3 py-1.5 rounded-xl text-sm font-medium border transition-all ${
                    selected.includes(s)
                      ? 'bg-green-500 text-white border-green-500 shadow-sm'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-green-300 hover:text-green-700'
                  }`}>
                  {selected.includes(s) ? '✓ ' : ''}{s}
                </button>
              ))}
            </div>

            {/* Custom symptom */}
            <div className="mt-5 flex gap-2">
              <input value={custom} onChange={e => setCustom(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addCustom()}
                placeholder="Add a custom symptom..."
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" />
              <button onClick={addCustom}
                className="px-4 py-2.5 bg-slate-100 text-slate-600 rounded-xl text-sm font-medium hover:bg-green-50 hover:text-green-700 transition-colors">
                + Add
              </button>
            </div>
          </div>

          {/* Selected */}
          {selected.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <h3 className="font-display font-semibold text-slate-700 mb-3">Selected Symptoms ({selected.length})</h3>
              <div className="flex flex-wrap gap-2">
                {selected.map(s => (
                  <span key={s} className="flex items-center gap-1.5 bg-green-50 text-green-700 border border-green-200 px-3 py-1.5 rounded-xl text-sm">
                    {s}
                    <button onClick={() => toggleSymptom(s)} className="text-green-400 hover:text-red-500 transition-colors font-bold">×</button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button onClick={analyze} disabled={loading || selected.length === 0}
            className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white py-3.5 rounded-xl font-semibold text-lg hover:from-green-600 hover:to-teal-600 disabled:opacity-50 transition-all shadow-md shadow-green-200">
            {loading ? '🔍 Analyzing symptoms...' : '🔍 Analyze Symptoms'}
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          {/* Severity Banner */}
          <div className={`rounded-2xl border p-5 ${sevStyle.color}`}>
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{sevStyle.icon}</span>
                <div>
                  <h2 className="font-display font-bold text-lg">Analysis Complete</h2>
                  <p className="text-sm opacity-80">Based on: {selected.join(', ')}</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${sevStyle.badge}`}>
                {result.severity || 'Moderate'} Severity
              </span>
            </div>
          </div>

          {/* Possible Conditions */}
          {result.conditions && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <h3 className="font-display font-semibold text-slate-800 mb-4">🔬 Possible Conditions</h3>
              <div className="space-y-3">
                {Array.isArray(result.conditions)
                  ? result.conditions.map((c, i) => (
                    <div key={i} className="flex gap-3 p-3 bg-slate-50 rounded-xl">
                      <span className="text-slate-400 font-bold text-sm w-5 flex-shrink-0">{i + 1}.</span>
                      <div>
                        <p className="font-medium text-slate-800">{typeof c === 'object' ? c.name || c.condition : c}</p>
                        {typeof c === 'object' && c.description && (
                          <p className="text-sm text-slate-500 mt-0.5">{c.description}</p>
                        )}
                      </div>
                    </div>
                  ))
                  : <p className="text-slate-600 text-sm">{result.conditions}</p>
                }
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-5">
            {/* Precautions */}
            {result.precautions && (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                <h3 className="font-display font-semibold text-slate-800 mb-3">🛡️ Precautions</h3>
                <ul className="space-y-2">
                  {(Array.isArray(result.precautions) ? result.precautions : [result.precautions]).map((p, i) => (
                    <li key={i} className="flex gap-2 text-sm text-slate-600">
                      <span className="text-green-500 flex-shrink-0">✓</span>{p}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Home Care */}
            {result.homeCare && (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                <h3 className="font-display font-semibold text-slate-800 mb-3">🏠 Home Care</h3>
                <ul className="space-y-2">
                  {(Array.isArray(result.homeCare) ? result.homeCare : [result.homeCare]).map((h, i) => (
                    <li key={i} className="flex gap-2 text-sm text-slate-600">
                      <span className="text-blue-500 flex-shrink-0">•</span>{h}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Urgent Signs */}
          {result.urgentSigns && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-5">
              <h3 className="font-display font-semibold text-red-800 mb-3">🚨 Seek Immediate Care If You Have</h3>
              <ul className="space-y-2">
                {(Array.isArray(result.urgentSigns) ? result.urgentSigns : [result.urgentSigns]).map((u, i) => (
                  <li key={i} className="flex gap-2 text-sm text-red-700">
                    <span className="flex-shrink-0">⚠️</span>{u}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <button onClick={reset}
            className="w-full border-2 border-green-500 text-green-600 py-3 rounded-xl font-semibold hover:bg-green-50 transition-colors">
            ← Check Different Symptoms
          </button>
        </div>
      )}
    </div>
  );
}

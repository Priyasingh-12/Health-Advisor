import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const StatCard = ({ label, value, unit, icon, color }) => (
  <div className={`bg-white rounded-2xl p-5 border border-slate-100 shadow-sm`}>
    <div className="flex items-start justify-between mb-3">
      <span className="text-2xl">{icon}</span>
      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${color}`}>{unit}</span>
    </div>
    <p className="text-2xl font-display font-bold text-slate-800">{value || '—'}</p>
    <p className="text-sm text-slate-500 mt-0.5">{label}</p>
  </div>
);

const FeatureCard = ({ to, icon, title, desc, color }) => (
  <Link to={to} className={`group bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex gap-4 items-start`}>
    <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl ${color}`}>{icon}</div>
    <div>
      <h3 className="font-display font-semibold text-slate-800 group-hover:text-green-700 transition-colors">{title}</h3>
      <p className="text-sm text-slate-500 mt-0.5">{desc}</p>
    </div>
  </Link>
);

export default function Dashboard() {
  const { user } = useAuth();
  const [latest, setLatest] = useState(null);

  useEffect(() => {
    api.get('/health/latest').then(r => setLatest(r.data)).catch(() => {});
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="max-w-6xl mx-auto space-y-6 fade-up">
      {/* Hero */}
      <div className="bg-gradient-to-r from-green-500 to-teal-500 rounded-2xl p-6 text-white">
        <p className="text-green-100 text-sm font-medium mb-1">{greeting} 👋</p>
        <h1 className="font-display font-bold text-2xl sm:text-3xl mb-1">{user?.name}</h1>
        <p className="text-green-100">How are you feeling today? Let's check your health.</p>
        <div className="flex flex-wrap gap-3 mt-4">
          <Link to="/chat" className="bg-white text-green-700 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-green-50 transition-colors">
            🤖 Ask AI Health Question
          </Link>
          <Link to="/tracker" className="bg-white/20 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-white/30 transition-colors">
            📊 Log Health Data
          </Link>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
        <span className="text-amber-500 text-xl flex-shrink-0">⚠️</span>
        <p className="text-amber-800 text-sm">
          <strong>Medical Disclaimer:</strong> MedAssist is for informational purposes only. All AI-generated content is not a substitute for professional medical advice. Always consult a licensed healthcare provider for medical decisions.
        </p>
      </div>

      {/* Health Stats */}
      {latest && (
        <div>
          <h2 className="font-display font-semibold text-slate-700 mb-3 text-sm uppercase tracking-wide">Latest Health Metrics</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatCard label="Weight" value={latest.weight} unit="kg" icon="⚖️" color="bg-blue-50 text-blue-600" />
            <StatCard label="Blood Pressure" value={latest.bloodPressure?.systolic ? `${latest.bloodPressure.systolic}/${latest.bloodPressure.diastolic}` : null} unit="mmHg" icon="❤️" color="bg-red-50 text-red-600" />
            <StatCard label="Blood Sugar" value={latest.sugarLevel} unit="mg/dL" icon="🩸" color="bg-orange-50 text-orange-600" />
            <StatCard label="Daily Steps" value={latest.steps?.toLocaleString()} unit="steps" icon="👟" color="bg-green-50 text-green-600" />
          </div>
        </div>
      )}

      {/* Features */}
      <div>
        <h2 className="font-display font-semibold text-slate-700 mb-3 text-sm uppercase tracking-wide">Health Tools</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <FeatureCard to="/chat" icon="🤖" title="AI Health Chatbot" desc="Ask medical questions, get instant guidance" color="bg-blue-50" />
          <FeatureCard to="/symptoms" icon="🩺" title="Symptom Checker" desc="Identify possible conditions from symptoms" color="bg-red-50" />
          <FeatureCard to="/medicines" icon="💊" title="Medicine Info" desc="Dosage, uses, and side effects database" color="bg-purple-50" />
          <FeatureCard to="/diet" icon="🥗" title="Diet & Fitness" desc="Personalized meal plans and workouts" color="bg-green-50" />
          <FeatureCard to="/tracker" icon="📊" title="Health Tracker" desc="Log and visualize your health metrics" color="bg-orange-50" />
          <FeatureCard to="/hospitals" icon="🏥" title="Hospital Finder" desc="Locate hospitals and clinics near you" color="bg-teal-50" />
        </div>
      </div>

      {/* Profile Info */}
      {user && (
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
          <h2 className="font-display font-semibold text-slate-700 mb-4">Your Profile</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Age', value: user.age ? `${user.age} years` : 'Not set' },
              { label: 'Gender', value: user.gender ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1) : 'Not set' },
              { label: 'Blood Group', value: user.bloodGroup || 'Not set' },
              { label: 'Account Type', value: user.role === 'admin' ? 'Administrator' : 'User' },
            ].map(item => (
              <div key={item.label}>
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">{item.label}</p>
                <p className="text-slate-700 font-semibold mt-0.5">{item.value}</p>
              </div>
            ))}
          </div>
          <Link to="/profile" className="mt-4 inline-block text-sm text-green-600 font-medium hover:underline">Edit Profile →</Link>
        </div>
      )}
    </div>
  );
}

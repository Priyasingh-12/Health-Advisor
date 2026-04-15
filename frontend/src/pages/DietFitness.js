import React, { useState } from 'react';
import api from '../utils/api';

const goals = [
  { id: 'weight_loss', icon: '⚖️', label: 'Weight Loss', desc: 'Calorie-deficit diet to shed extra pounds', color: 'from-orange-400 to-red-400' },
  { id: 'weight_gain', icon: '💪', label: 'Weight Gain', desc: 'Calorie-surplus plan for healthy mass', color: 'from-blue-400 to-indigo-400' },
  { id: 'diabetes_control', icon: '🩸', label: 'Diabetes Control', desc: 'Low GI foods to manage blood sugar', color: 'from-purple-400 to-pink-400' },
  { id: 'heart_health', icon: '❤️', label: 'Heart Health', desc: 'Omega-3 rich, low sodium diet', color: 'from-red-400 to-rose-400' },
  { id: 'muscle_building', icon: '🏋️', label: 'Muscle Building', desc: 'High protein diet for strength gains', color: 'from-green-400 to-teal-400' },
  { id: 'general_wellness', icon: '🌿', label: 'General Wellness', desc: 'Balanced nutrition for everyday health', color: 'from-teal-400 to-cyan-400' },
];

const intensityColors = { low: 'bg-green-100 text-green-700', medium: 'bg-yellow-100 text-yellow-700', high: 'bg-red-100 text-red-700' };

export default function DietFitness() {
  const [selected, setSelected] = useState(null);
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('diet');

  const fetchPlan = async (goal) => {
    setSelected(goal);
    setLoading(true);
    setPlan(null);
    try {
      const res = await api.get(`/diet/${goal}`);
      setPlan(res.data);
    } catch {
      setPlan(null);
    } finally {
      setLoading(false);
    }
  };

  const MealSection = ({ title, icon, items }) => {
    if (!items?.length) return null;
    const totalCal = items.reduce((s, i) => s + (i.calories || 0), 0);
    return (
      <div className="bg-slate-50 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold text-slate-700 flex items-center gap-2"><span>{icon}</span>{title}</h4>
          <span className="text-xs bg-white text-slate-500 border border-slate-200 px-2 py-0.5 rounded-full">{totalCal} kcal</span>
        </div>
        <ul className="space-y-2">
          {items.map((item, i) => (
            <li key={i} className="flex items-center justify-between text-sm">
              <span className="text-slate-700">{item.item}</span>
              <div className="flex items-center gap-3 text-slate-400">
                <span>{item.portion}</span>
                <span className="text-green-600 font-medium">{item.calories} kcal</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 fade-up">
      <div>
        <h1 className="font-display font-bold text-2xl text-slate-800">Diet & Fitness Advisor</h1>
        <p className="text-slate-500 mt-1">Select your health goal to get a personalized diet and exercise plan</p>
      </div>

      {/* Goal Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {goals.map(g => (
          <button key={g.id} onClick={() => fetchPlan(g.id)}
            className={`p-4 rounded-2xl border-2 transition-all text-left ${
              selected === g.id
                ? 'border-green-500 bg-green-50 shadow-md'
                : 'border-slate-100 bg-white hover:border-green-300 hover:shadow-sm'
            }`}>
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${g.color} flex items-center justify-center text-xl mb-3`}>{g.icon}</div>
            <h3 className="font-display font-semibold text-slate-800 text-sm">{g.label}</h3>
            <p className="text-xs text-slate-500 mt-0.5">{g.desc}</p>
            {selected === g.id && <div className="mt-2 text-xs text-green-600 font-medium">✓ Selected</div>}
          </button>
        ))}
      </div>

      {loading && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center">
          <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-500">Loading your personalized plan...</p>
        </div>
      )}

      {plan && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          {/* Plan Header */}
          <div className={`bg-gradient-to-r ${goals.find(g => g.id === selected)?.color || 'from-green-500 to-teal-500'} p-6 text-white`}>
            <h2 className="font-display font-bold text-xl mb-1">{plan.title}</h2>
            <p className="text-white/80 text-sm">{plan.description}</p>
            {plan.totalCalories && (
              <div className="mt-3 bg-white/20 inline-block px-4 py-2 rounded-xl text-sm font-semibold">
                Daily Target: ~{plan.totalCalories} kcal
              </div>
            )}
          </div>

          {/* Tabs */}
          <div className="border-b border-slate-100 flex">
            {['diet', 'exercise', 'tips'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 text-sm font-medium capitalize transition-colors border-b-2 ${
                  activeTab === tab ? 'border-green-500 text-green-600' : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}>
                {tab === 'diet' ? '🥗 Diet Plan' : tab === 'exercise' ? '🏃 Exercises' : '💡 Tips'}
              </button>
            ))}
          </div>

          <div className="p-6">
            {activeTab === 'diet' && plan.meals && (
              <div className="space-y-4">
                <MealSection title="Breakfast" icon="🌅" items={plan.meals.breakfast} />
                <MealSection title="Lunch" icon="☀️" items={plan.meals.lunch} />
                <MealSection title="Dinner" icon="🌙" items={plan.meals.dinner} />
                <MealSection title="Snacks" icon="🍎" items={plan.meals.snacks} />
              </div>
            )}

            {activeTab === 'exercise' && plan.exercises?.length > 0 && (
              <div className="space-y-3">
                {plan.exercises.map((ex, i) => (
                  <div key={i} className="flex gap-4 p-4 bg-slate-50 rounded-xl">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-xl shadow-sm flex-shrink-0">🏃</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-semibold text-slate-800">{ex.name}</h4>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${intensityColors[ex.intensity] || intensityColors.medium}`}>
                          {ex.intensity}
                        </span>
                      </div>
                      <div className="flex gap-4 mt-1 text-sm text-slate-500">
                        <span>⏱ {ex.duration}</span>
                        <span>📅 {ex.frequency}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'tips' && plan.tips?.length > 0 && (
              <div className="space-y-3">
                {plan.tips.map((tip, i) => (
                  <div key={i} className="flex gap-3 p-4 bg-green-50 border border-green-100 rounded-xl">
                    <span className="text-green-500 text-lg flex-shrink-0">💡</span>
                    <p className="text-green-800 text-sm">{tip}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {selected && !loading && !plan && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
          <p className="text-yellow-800">No diet plan found for this goal yet. Please check back later.</p>
        </div>
      )}
    </div>
  );
}

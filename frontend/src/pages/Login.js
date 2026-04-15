import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/dashboard');
      toast.success('Welcome back! 👋');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-green-600 via-green-500 to-teal-500 items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full -translate-y-1/3 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-600/30 rounded-full translate-y-1/3 -translate-x-1/3" />
        <div className="relative z-10 text-center text-white">
          <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center text-4xl mx-auto mb-6 backdrop-blur-sm">🩺</div>
          <h2 className="font-display font-bold text-4xl mb-4">MedAssist</h2>
          <p className="text-green-100 text-lg max-w-xs mx-auto leading-relaxed">Your personal AI-powered health companion for smarter wellness decisions.</p>
          <div className="mt-10 grid grid-cols-2 gap-4 text-sm">
            {['AI Chatbot', 'Symptom Checker', 'Health Tracker', 'Diet Plans'].map(f => (
              <div key={f} className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2.5 text-green-50">✓ {f}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-6 bg-white">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-teal-500 rounded-lg flex items-center justify-center text-white font-bold">M</div>
            <span className="font-display font-bold text-xl text-slate-800">MedAssist</span>
          </div>
          <h1 className="font-display font-bold text-3xl text-slate-800 mb-2">Welcome back</h1>
          <p className="text-slate-500 mb-8">Sign in to your health dashboard</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email address</label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                placeholder="you@example.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
              <input
                type="password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                placeholder="••••••••"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white py-3 rounded-xl font-semibold hover:from-green-600 hover:to-teal-600 transition-all duration-200 disabled:opacity-60 shadow-md shadow-green-200"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 p-4 bg-slate-50 rounded-xl text-sm text-slate-500">
            <p className="font-medium text-slate-600 mb-1">Demo credentials:</p>
            <p>Admin: <span className="font-mono text-slate-700">admin@healthadvisor.com</span> / <span className="font-mono">admin123</span></p>
          </div>

          <p className="mt-6 text-center text-slate-500 text-sm">
            Don't have an account?{' '}
            <Link to="/register" className="text-green-600 font-semibold hover:underline">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useRef, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const suggestions = [
  'I have a headache and fever since yesterday',
  'What foods are good for high blood pressure?',
  'How much water should I drink daily?',
  'What are the symptoms of diabetes?',
  'I have chest pain when climbing stairs',
  'Best exercises for lower back pain?',
];

export default function Chatbot() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hello ${user?.name?.split(' ')[0] || 'there'}! 👋 I'm MedAssist, your AI health advisor. I can help you with:\n\n• Understanding symptoms\n• General health questions\n• Medication information\n• Diet and lifestyle advice\n\n⚠️ **Important:** I provide general health information only. Always consult a doctor for diagnosis and treatment.\n\nHow can I help you today?`
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async (text) => {
    const msg = text || input.trim();
    if (!msg || loading) return;
    setInput('');
    const userMsg = { role: 'user', content: msg };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const history = messages.slice(-10);
      const res = await api.post('/chat', { message: msg, history });
      setMessages(prev => [...prev, { role: 'assistant', content: res.data.message }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: '❌ Sorry, I\'m having trouble connecting. Please try again.' }]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const formatMessage = (content) => {
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br/>')
      .replace(/•/g, '•');
  };

  return (
    <div className="max-w-3xl mx-auto h-[calc(100vh-8rem)] flex flex-col fade-up">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-teal-400 rounded-xl flex items-center justify-center text-xl">🤖</div>
        <div>
          <h1 className="font-display font-bold text-slate-800">MedAssist AI Chatbot</h1>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs text-green-600 font-medium">Online</span>
          </div>
        </div>
        <div className="ml-auto bg-amber-50 text-amber-700 text-xs px-3 py-1.5 rounded-lg border border-amber-100 hidden sm:block">
          ⚠️ Not a substitute for medical advice
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 scrollbar-thin pr-1 mb-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0 ${
              msg.role === 'user'
                ? 'bg-gradient-to-br from-green-400 to-teal-400 text-white font-bold'
                : 'bg-gradient-to-br from-slate-100 to-slate-200 text-xl'
            }`}>
              {msg.role === 'user' ? user?.name?.[0]?.toUpperCase() : '🤖'}
            </div>
            <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
              msg.role === 'user'
                ? 'bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-tr-none'
                : 'bg-white text-slate-700 border border-slate-100 shadow-sm rounded-tl-none'
            }`}
              dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }}
            />
          </div>
        ))}

        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-xl flex-shrink-0">🤖</div>
            <div className="bg-white border border-slate-100 shadow-sm rounded-2xl rounded-tl-none px-4 py-3 flex gap-1.5 items-center">
              <div className="w-2 h-2 bg-green-400 rounded-full typing-dot" />
              <div className="w-2 h-2 bg-green-400 rounded-full typing-dot" />
              <div className="w-2 h-2 bg-green-400 rounded-full typing-dot" />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggestions */}
      {messages.length === 1 && (
        <div className="flex gap-2 flex-wrap mb-3">
          {suggestions.slice(0, 3).map(s => (
            <button key={s} onClick={() => send(s)}
              className="text-xs bg-white border border-slate-200 text-slate-600 px-3 py-2 rounded-xl hover:border-green-300 hover:text-green-700 hover:bg-green-50 transition-all">
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="bg-white border border-slate-200 rounded-2xl p-2 flex gap-2 shadow-sm">
        <input
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
          placeholder="Describe your symptoms or ask a health question..."
          className="flex-1 px-3 py-2 text-sm outline-none text-slate-700 placeholder-slate-400"
        />
        <button
          onClick={() => send()}
          disabled={!input.trim() || loading}
          className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:from-green-600 hover:to-teal-600 disabled:opacity-40 transition-all">
          Send
        </button>
      </div>
    </div>
  );
}

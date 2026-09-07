'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ShieldAlert, Users, Brain, Database, Activity, Search, Filter,
  ChevronLeft, ArrowUpRight, AlertCircle, CheckCircle, Lock, Server,
  BarChart, Zap, Eye, Edit3, Trash2, ShieldCheck, Key
} from 'lucide-react';

const MOCK_USERS = [
  { id: 'usr_1', name: 'Aditya Sharma', email: 'aditya@example.com', tier: 'Free', diseases: ['Diabetes Type 2'], plansToday: 2, plansLimit: 3, joined: '2026-08-01' },
  { id: 'usr_2', name: 'Priya Patel', email: 'priya@example.com', tier: 'Premium', diseases: ['PCOS', 'Hypertension'], plansToday: 8, plansLimit: 999, joined: '2026-07-28' },
  { id: 'usr_3', name: 'Rahul Verma', email: 'rahul@example.com', tier: 'Free', diseases: ['High Cholesterol'], plansToday: 3, plansLimit: 3, joined: '2026-08-02' },
  { id: 'usr_4', name: 'Ananya Gupta', email: 'ananya@example.com', tier: 'Premium', diseases: ['Anemia'], plansToday: 1, plansLimit: 999, joined: '2026-07-15' },
  { id: 'usr_5', name: 'Vikram Singh', email: 'vikram@example.com', tier: 'Free', diseases: ['CKD Stage 2'], plansToday: 0, plansLimit: 3, joined: '2026-08-03' },
];

const SYSTEM_LOGS = [
  { time: '05:42:10', type: 'AI Generation', user: 'aditya@example.com', detail: 'Generated 1,780 kcal plan (Qwen-2.5-72B via OpenRouter)', status: 'Success (1.2s)' },
  { time: '05:39:04', type: 'Conflict Flag', user: 'priya@example.com', detail: 'High sodium food flagged for Hypertension profile', status: 'Blocked' },
  { time: '05:15:22', type: 'User Auth', user: 'rahul@example.com', detail: 'Google OAuth sign-in successful', status: 'Success' },
  { time: '04:50:11', type: 'PDF Export', user: 'ananya@example.com', detail: 'Downloaded weekly meal plan PDF', status: 'Success' },
];

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<'users' | 'ai' | 'content' | 'logs'>('users');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredUsers = MOCK_USERS.filter(u =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ minHeight: '100vh', background: '#0a0f1e', color: '#e2e8f0', paddingBottom: '80px' }}>
      {/* Admin Navbar */}
      <header style={{
        padding: '18px 32px', borderBottom: '1px solid rgba(255,255,255,0.08)',
        background: 'rgba(15,23,42,0.9)', backdropFilter: 'blur(20px)',
        position: 'sticky', top: 0, zIndex: 50,
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Link href="/dashboard" className="btn btn-ghost btn-sm">
              <ChevronLeft size={16} /> Dashboard
            </Link>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={20} color="#10b981" />
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 800, color: 'white' }}>
                NutriAI Admin Control Panel
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span className="badge badge-emerald">System Healthy</span>
            <span className="badge badge-amber">Qwen-2.5 72B Active</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main style={{ maxWidth: '1280px', margin: '32px auto 0', padding: '0 24px' }}>
        {/* Metric Cards Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '32px' }}>
          {[
            { label: 'Total Registered Users', val: '1,428', change: '+12% this week', color: '#10b981', icon: <Users size={20} /> },
            { label: 'Plans Generated Today', val: '384', change: '84% success rate', color: '#6366f1', icon: <Brain size={20} /> },
            { label: 'Avg API Latency', val: '1.18s', change: 'OpenRouter Qwen', color: '#f59e0b', icon: <Zap size={20} /> },
            { label: 'Database Food Items', val: '1,000+', change: 'USDA + ICMR Verified', color: '#38bdf8', icon: <Database size={20} /> },
          ].map(m => (
            <div key={m.label} className="card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 500 }}>{m.label}</span>
                <span style={{ color: m.color }}>{m.icon}</span>
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '28px', fontWeight: 800, color: 'white', marginBottom: '4px' }}>
                {m.val}
              </div>
              <div style={{ fontSize: '11px', color: m.color, fontWeight: 600 }}>{m.change}</div>
            </div>
          ))}
        </div>

        {/* Tab Navigation */}
        <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid rgba(255,255,255,0.08)', marginBottom: '28px' }}>
          {[
            { id: 'users', label: 'User Management', icon: <Users size={16} /> },
            { id: 'ai', label: 'AI Usage & Token Monitor', icon: <Brain size={16} /> },
            { id: 'content', label: 'Content & CMS', icon: <Database size={16} /> },
            { id: 'logs', label: 'Security & Audit Logs', icon: <Activity size={16} /> },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '12px 20px', border: 'none', cursor: 'pointer', background: 'transparent',
                color: activeTab === tab.id ? '#10b981' : '#64748b', fontWeight: 600, fontSize: '14px',
                borderBottom: activeTab === tab.id ? '2px solid #10b981' : '2px solid transparent',
                transition: 'all 0.2s',
              }}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: User Management */}
        {activeTab === 'users' && (
          <div className="card" style={{ padding: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
              <div style={{ position: 'relative', width: '320px' }}>
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
                <input
                  className="input"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search user by name or email..."
                  style={{ paddingLeft: '38px', fontSize: '13px' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button className="btn btn-outline btn-sm">Export Users CSV</button>
                <button className="btn btn-primary btn-sm">+ Add User</button>
              </div>
            </div>

            {/* User Table */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', color: '#64748b', fontSize: '12px', textTransform: 'uppercase' }}>
                    <th style={{ padding: '12px' }}>User</th>
                    <th style={{ padding: '12px' }}>Tier</th>
                    <th style={{ padding: '12px' }}>Conditions</th>
                    <th style={{ padding: '12px' }}>Plans Today</th>
                    <th style={{ padding: '12px' }}>Joined</th>
                    <th style={{ padding: '12px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(user => (
                    <tr key={user.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <td style={{ padding: '16px 12px' }}>
                        <div style={{ fontWeight: 600, color: 'white' }}>{user.name}</div>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>{user.email}</div>
                      </td>
                      <td style={{ padding: '16px 12px' }}>
                        <span className={`badge ${user.tier === 'Premium' ? 'badge-emerald' : 'badge-slate'}`}>
                          {user.tier}
                        </span>
                      </td>
                      <td style={{ padding: '16px 12px' }}>
                        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                          {user.diseases.map(d => (
                            <span key={d} className="badge badge-amber" style={{ fontSize: '10px' }}>{d}</span>
                          ))}
                        </div>
                      </td>
                      <td style={{ padding: '16px 12px', fontFamily: 'var(--font-mono)', fontSize: '13px' }}>
                        {user.plansToday} / {user.plansLimit === 999 ? '∞' : user.plansLimit}
                      </td>
                      <td style={{ padding: '16px 12px', fontSize: '13px', color: '#64748b' }}>
                        {user.joined}
                      </td>
                      <td style={{ padding: '16px 12px', textAlign: 'right' }}>
                        <button className="btn btn-ghost btn-sm" style={{ padding: '4px 10px' }}>Edit</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: AI Usage & Token Monitor */}
        {activeTab === 'ai' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="card" style={{ padding: '28px' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 700, color: 'white', marginBottom: '16px' }}>
                OpenRouter AI Infrastructure Health
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
                <div style={{ padding: '20px', borderRadius: '16px', background: 'rgba(255,255,255,0.03)' }}>
                  <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Active LLM Model</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '18px', fontWeight: 700, color: '#10b981' }}>qwen/qwen-2.5-72b-instruct</div>
                </div>
                <div style={{ padding: '20px', borderRadius: '16px', background: 'rgba(255,255,255,0.03)' }}>
                  <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Fallback LLM</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '18px', fontWeight: 700, color: '#f59e0b' }}>meta-llama/llama-3.3-70b-instruct</div>
                </div>
                <div style={{ padding: '20px', borderRadius: '16px', background: 'rgba(255,255,255,0.03)' }}>
                  <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Token Usage Today</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '18px', fontWeight: 700, color: '#6366f1' }}>1,248,900 tokens</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Content CMS */}
        {activeTab === 'content' && (
          <div className="card" style={{ padding: '28px' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 700, color: 'white', marginBottom: '16px' }}>
              Database Seed & Medical Guidelines Management
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '24px' }}>
              Manage nutritional profiles, ICD-10 medical protocols, and food compatibility datasets.
            </p>
            <div style={{ display: 'flex', gap: '16px' }}>
              <button className="btn btn-primary">+ Seed New Food Item</button>
              <button className="btn btn-outline">+ Add Disease Protocol</button>
            </div>
          </div>
        )}

        {/* Tab 4: Security Logs */}
        {activeTab === 'logs' && (
          <div className="card" style={{ padding: '28px' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 700, color: 'white', marginBottom: '20px' }}>
              Real-Time Security & AI Audit Trail
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {SYSTEM_LOGS.map((log, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', fontSize: '13px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', color: '#64748b' }}>{log.time}</span>
                    <span className="badge badge-emerald">{log.type}</span>
                    <span style={{ color: 'white', fontWeight: 500 }}>{log.user}</span>
                    <span style={{ color: '#94a3b8' }}>— {log.detail}</span>
                  </div>
                  <span style={{ color: log.status.includes('Success') ? '#34d399' : '#f59e0b', fontWeight: 600 }}>{log.status}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

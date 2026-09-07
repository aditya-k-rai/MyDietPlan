'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ChevronLeft, Settings, Bell, Lock, Smartphone, ShieldCheck, Zap, Award
} from 'lucide-react';

export default function SettingsPage() {
  const [notifications, setNotifications] = useState({
    mealReminders: true,
    soakingAlarms: true,
    waterAlerts: true,
    weeklyReport: false,
  });
  const [dataMessage, setDataMessage] = useState<string | null>(null);

  const handleDownloadHealthData = () => {
    try {
      const savedProfile = localStorage.getItem('nutriai_user_profile');
      const healthData = savedProfile ? JSON.parse(savedProfile) : {
        name: 'Demo User',
        email: 'demo@nutriai.com',
        goal: 'Weight Loss',
        diseases: ['Type 2 Diabetes'],
        allergies: ['Peanuts'],
        tdee: 1800,
        targetCalories: 1300,
        macros: { protein: '120g', carbs: '140g', fat: '45g' },
      };

      const exportPayload = {
        app: 'NutriAI Health Platform',
        version: '1.0.0',
        exportedAt: new Date().toISOString(),
        profile: healthData,
        preferences: notifications,
      };

      const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `nutriai-health-data-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);

      setDataMessage('Health data downloaded successfully as JSON.');
      setTimeout(() => setDataMessage(null), 4000);
    } catch {
      setDataMessage('Failed to export health data.');
    }
  };

  const handleDeleteAccount = () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete your account and reset all saved health data? This cannot be undone.'
    );
    if (confirmed) {
      localStorage.removeItem('nutriai_user_profile');
      localStorage.removeItem('nutriai_auth_user');
      localStorage.removeItem('nutriai_progress');
      setDataMessage('Account data cleared successfully. Redirecting to home...');
      setTimeout(() => {
        window.location.href = '/';
      }, 1500);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0a0f1e', color: '#e2e8f0', paddingBottom: '80px' }}>
      {/* Header */}
      <header style={{
        padding: '20px 32px', borderBottom: '1px solid rgba(255,255,255,0.07)',
        background: 'rgba(15,23,42,0.8)', backdropFilter: 'blur(20px)',
        position: 'sticky', top: 0, zIndex: 50,
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link href="/dashboard" className="btn btn-ghost btn-sm">
            <ChevronLeft size={16} /> Dashboard
          </Link>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 800, color: 'white' }}>
            Account Settings & Preferences
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: '900px', margin: '32px auto 0', padding: '0 24px' }}>
        {dataMessage && (
          <div style={{
            padding: '12px 16px', borderRadius: '12px', marginBottom: '20px',
            background: 'rgba(16,185,129,0.15)', border: '1px solid #10b981',
            color: '#34d399', fontSize: '14px', fontWeight: 600,
          }}>
            {dataMessage}
          </div>
        )}

        {/* Subscription Plan Card */}
        <div className="card glass-emerald" style={{ padding: '28px', borderRadius: '20px', marginBottom: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div style={{ fontSize: '12px', color: '#10b981', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Current Subscription
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 800, color: 'white', marginTop: '4px' }}>
                Free Plan (3 AI Plans/Day)
              </div>
              <div style={{ fontSize: '13px', color: '#94a3b8', marginTop: '4px' }}>
                Upgrade to Premium for unlimited AI plan generation & 1-on-1 dietitian calls.
              </div>
            </div>
            <Link href="/#pricing" className="btn btn-accent">
              Upgrade ₹499/mo
            </Link>
          </div>
        </div>

        {/* Notifications Settings */}
        <div className="card" style={{ padding: '28px', marginBottom: '28px' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 700, color: 'white', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Bell size={20} color="#10b981" /> Notification Preferences
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { key: 'mealReminders', label: 'Meal Reminders', desc: 'Get push alerts 15 minutes before planned meal times' },
              { key: 'soakingAlarms', label: 'Soaking Alarms', desc: 'Alerts to soak pulses/legumes 8h before meal prep' },
              { key: 'waterAlerts', label: 'Water Hydration Reminders', desc: 'Periodic hourly hydration reminders' },
              { key: 'weeklyReport', label: 'Weekly Macro Compliance Report', desc: 'Receive weekly email summaries of your dietary progress' },
            ].map(item => (
              <div key={item.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <div>
                  <div style={{ fontWeight: 600, color: 'white', fontSize: '14px' }}>{item.label}</div>
                  <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>{item.desc}</div>
                </div>
                <input
                  type="checkbox"
                  checked={notifications[item.key as keyof typeof notifications]}
                  onChange={e => setNotifications(n => ({ ...n, [item.key]: e.target.checked }))}
                  style={{ width: '20px', height: '20px', accentColor: '#10b981', cursor: 'pointer' }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Security & Data Privacy */}
        <div className="card" style={{ padding: '28px' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 700, color: 'white', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Lock size={20} color="#f59e0b" /> Data Privacy & Security
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button
              onClick={handleDownloadHealthData}
              className="btn btn-outline btn-sm"
              style={{ width: 'fit-content' }}>
              Download My Health Data (JSON)
            </button>
            <button
              onClick={handleDeleteAccount}
              className="btn btn-danger btn-sm"
              style={{ width: 'fit-content' }}>
              Delete Account & All Data
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

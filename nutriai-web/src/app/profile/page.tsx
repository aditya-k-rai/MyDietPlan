'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ChevronLeft, User, Heart, Shield, Activity, Save, AlertCircle, Check
} from 'lucide-react';
import { DISEASES } from '@/lib/data/diseases';

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    name: 'Aditya Sharma',
    email: 'aditya@example.com',
    phone: '+91 9876543210',
    age: '32',
    gender: 'male',
    height: '172',
    heightUnit: 'cm',
    weight: '74',
    weightUnit: 'kg',
    goal: 'weight-loss',
    activityLevel: 'moderate',
    diseases: ['diabetes-type-2'],
    allergies: ['Peanuts'],
    dietPref: 'Vegetarian',
  });

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('nutriai_user_profile');
      if (stored) {
        setProfile(prev => ({ ...prev, ...JSON.parse(stored) }));
      }
    } catch {}
  }, []);

  const toggleDisease = (id: string) => {
    setProfile(p => ({
      ...p,
      diseases: p.diseases.includes(id) ? p.diseases.filter(d => d !== id) : [...p.diseases, id],
    }));
  };

  const handleSave = () => {
    try {
      localStorage.setItem('nutriai_user_profile', JSON.stringify(profile));
    } catch {}
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0a0f1e', color: '#e2e8f0', paddingBottom: '80px' }}>
      {/* Header */}
      <header style={{
        padding: '20px 32px', borderBottom: '1px solid rgba(255,255,255,0.07)',
        background: 'rgba(15,23,42,0.8)', backdropFilter: 'blur(20px)',
        position: 'sticky', top: 0, zIndex: 50,
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Link href="/dashboard" className="btn btn-ghost btn-sm">
              <ChevronLeft size={16} /> Dashboard
            </Link>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 800, color: 'white' }}>
              My Profile & Health Settings
            </h1>
          </div>
          <button className="btn btn-primary btn-sm" onClick={handleSave}>
            <Save size={14} /> {saved ? 'Saved!' : 'Save Changes'}
          </button>
        </div>
      </header>

      {/* Content */}
      <main style={{ maxWidth: '1000px', margin: '32px auto 0', padding: '0 24px' }}>
        {/* User Card */}
        <div className="card glass-emerald" style={{ padding: '32px', borderRadius: '24px', marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{
              width: '72px', height: '72px', borderRadius: '24px',
              background: 'linear-gradient(135deg, #065f46, #10b981)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 800, fontSize: '28px', color: 'white',
              boxShadow: '0 8px 24px rgba(16,185,129,0.4)',
            }}>
              {profile.name.charAt(0)}
            </div>
            <div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 800, color: 'white' }}>
                {profile.name}
              </h2>
              <div style={{ fontSize: '14px', color: '#94a3b8', marginTop: '2px' }}>{profile.email} · {profile.phone}</div>
              <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                <span className="badge badge-emerald">Free Plan</span>
                <span className="badge badge-amber">2 AI Plans Left Today</span>
              </div>
            </div>
          </div>
        </div>

        {/* Biometrics Editor */}
        <div className="card" style={{ padding: '28px', marginBottom: '28px' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 700, color: 'white', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={20} color="#10b981" /> Body Biometrics & Goal
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div>
              <label className="label">Age</label>
              <input className="input" type="number" value={profile.age} onChange={e => setProfile(p => ({ ...p, age: e.target.value }))} />
            </div>
            <div>
              <label className="label">Height (cm)</label>
              <input className="input" type="number" value={profile.height} onChange={e => setProfile(p => ({ ...p, height: e.target.value }))} />
            </div>
            <div>
              <label className="label">Weight (kg)</label>
              <input className="input" type="number" value={profile.weight} onChange={e => setProfile(p => ({ ...p, weight: e.target.value }))} />
            </div>
            <div>
              <label className="label">Primary Goal</label>
              <select className="input" value={profile.goal} onChange={e => setProfile(p => ({ ...p, goal: e.target.value }))}>
                <option value="weight-loss">Weight Loss (−500 kcal)</option>
                <option value="muscle-gain">Muscle Gain (+500 kcal)</option>
                <option value="maintenance">Maintenance</option>
                <option value="medical">Medical Management</option>
              </select>
            </div>
          </div>
        </div>

        {/* Medical Conditions Selector */}
        <div className="card" style={{ padding: '28px' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 700, color: 'white', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Shield size={20} color="#f59e0b" /> Active Medical Conditions
          </h3>
          <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '20px' }}>
            Select your health conditions to automatically enforce medical safety guidelines in your AI diet plans.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {DISEASES.map(d => {
              const isSelected = profile.diseases.includes(d.id);
              return (
                <button
                  key={d.id}
                  onClick={() => toggleDisease(d.id)}
                  style={{
                    padding: '8px 16px', borderRadius: '100px', cursor: 'pointer',
                    background: isSelected ? 'rgba(245,158,11,0.15)' : 'rgba(30,41,59,0.6)',
                    border: isSelected ? '1.5px solid #f59e0b' : '1.5px solid rgba(255,255,255,0.08)',
                    color: isSelected ? '#fbbf24' : '#94a3b8',
                    fontSize: '13px', fontWeight: 600, transition: 'all 0.2s',
                  }}
                >
                  {isSelected ? '✓ ' : '+ '}{d.name}
                </button>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Leaf, ChevronRight, Check, User, Heart, Target, AlertCircle, ChevronLeft } from 'lucide-react';

const ALLERGIES = [
  'Milk/Dairy', 'Eggs', 'Fish', 'Shellfish', 'Tree Nuts', 'Peanuts',
  'Wheat/Gluten', 'Soy', 'Sesame', 'Corn/Maize', 'Latex-Fruit',
  'Nightshades', 'FODMAPs', 'Histamine', 'Salicylates',
];

const DISEASES = [
  'Diabetes Type 2', 'Diabetes Type 1', 'Pre-Diabetes',
  'Hypertension', 'High Cholesterol', 'Heart Disease',
  'PCOS', 'Hypothyroidism', 'Hyperthyroidism',
  'CKD (Kidney Disease)', 'GERD / Acid Reflux', 'IBS',
  'Celiac Disease', 'Lactose Intolerance', 'Fatty Liver',
  'Gout', 'Anemia', 'Osteoporosis', 'Obesity', 'PCOS',
];

const GOALS = [
  { id: 'weight-loss', label: 'Weight Loss', icon: '⚡', desc: 'Caloric deficit, fat burning' },
  { id: 'weight-gain', label: 'Weight Gain', icon: '📈', desc: 'Caloric surplus, healthy mass' },
  { id: 'muscle-gain', label: 'Muscle Gain', icon: '💪', desc: 'High protein, training fuel' },
  { id: 'maintenance', label: 'Maintenance', icon: '⚖️', desc: 'Balanced, sustain weight' },
  { id: 'medical', label: 'Medical Management', icon: '⚕️', desc: 'Disease-specific nutrition' },
  { id: 'general-health', label: 'General Health', icon: '🌿', desc: 'Optimize overall wellness' },
];

const COUNTRIES = ['India', 'United States', 'United Kingdom', 'Canada', 'Australia', 'UAE', 'Singapore', 'Germany', 'France'];
const DIAL_CODES = [
  { code: '+91', flag: '🇮🇳', country: 'India' },
  { code: '+1', flag: '🇺🇸', country: 'USA' },
  { code: '+44', flag: '🇬🇧', country: 'UK' },
  { code: '+61', flag: '🇦🇺', country: 'AUS' },
  { code: '+971', flag: '🇦🇪', country: 'UAE' },
];

type OnboardingData = {
  name: string; phone: string; dialCode: string; city: string; pincode: string; country: string;
  age: string; height: string; heightUnit: 'cm' | 'ft'; weight: string; weightUnit: 'kg' | 'lbs';
  allergies: string[]; diseases: string[]; goal: string;
};

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<OnboardingData>({
    name: 'Demo User', phone: '', dialCode: '+91', city: '', pincode: '', country: 'India',
    age: '', height: '', heightUnit: 'cm', weight: '', weightUnit: 'kg',
    allergies: [], diseases: [], goal: '',
  });

  const totalSteps = 3;
  const progress = (step / totalSteps) * 100;

  function toggle<T>(arr: T[], item: T): T[] {
    return arr.includes(item) ? arr.filter(x => x !== item) : [...arr, item];
  }

  const handleSubmit = () => {
    router.push('/dashboard');
  };

  const steps = [
    { num: 1, title: 'Identity', icon: <User size={18} />, subtitle: 'Basic contact information' },
    { num: 2, title: 'Health Profile', icon: <Heart size={18} />, subtitle: 'Your body metrics' },
    { num: 3, title: 'Goals & Conditions', icon: <Target size={18} />, subtitle: 'Personalize your AI plan' },
  ];

  return (
    <div style={{
      minHeight: '100vh', background: 'linear-gradient(180deg, #0f172a 0%, #020617 100%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      padding: '40px 24px',
    }}>
      {/* Logo */}
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', marginBottom: '40px' }}>
        <div style={{
          width: '32px', height: '32px', borderRadius: '8px',
          background: 'linear-gradient(135deg, #065f46, #10b981)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Leaf size={18} color="white" />
        </div>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '20px', color: 'white' }}>
          Nutri<span className="text-gradient-emerald">AI</span>
        </span>
      </Link>

      {/* Progress Bar */}
      <div style={{ width: '100%', maxWidth: '560px', marginBottom: '40px' }}>
        {/* Step indicators */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
          {steps.map(s => (
            <div key={s.num} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: step >= s.num ? 'linear-gradient(135deg, #065f46, #10b981)' : 'rgba(30,41,59,0.8)',
                border: step >= s.num ? 'none' : '1.5px solid rgba(255,255,255,0.1)',
                color: step >= s.num ? 'white' : '#475569',
                fontSize: '13px', fontWeight: 700, transition: 'all 0.3s',
              }}>
                {step > s.num ? <Check size={16} /> : s.num}
              </div>
              <div style={{ display: 'none' }}>
                <div style={{ fontSize: '12px', fontWeight: 600, color: step >= s.num ? 'white' : '#475569' }}>{s.title}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="progress-bar-track">
          <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
          <span style={{ fontSize: '13px', color: '#64748b' }}>Step {step} of {totalSteps}</span>
          <span style={{ fontSize: '13px', color: '#64748b' }}>{steps[step - 1].subtitle}</span>
        </div>
      </div>

      {/* Form Card */}
      <div className="glass" style={{ width: '100%', maxWidth: '560px', borderRadius: '24px', padding: '40px' }}>
        {/* Step 1 — Identity */}
        {step === 1 && (
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 800, color: 'white', marginBottom: '8px' }}>
              Let's start with basics
            </h2>
            <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '32px' }}>
              Your name and contact info. Required to personalize your experience.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label className="label">Full Name *</label>
                <input className="input" value={data.name} placeholder="Your full name"
                  onChange={e => setData(d => ({ ...d, name: e.target.value }))} />
              </div>

              <div>
                <label className="label">Phone Number *</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <select className="input" style={{ flex: '0 0 auto', width: '120px' }}
                    value={data.dialCode} onChange={e => setData(d => ({ ...d, dialCode: e.target.value }))}>
                    {DIAL_CODES.map(d => (
                      <option key={d.code} value={d.code}>{d.flag} {d.code}</option>
                    ))}
                  </select>
                  <input className="input" value={data.phone} placeholder="Phone number"
                    onChange={e => setData(d => ({ ...d, phone: e.target.value }))} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label className="label">City / Area *</label>
                  <input className="input" value={data.city} placeholder="Mumbai, Delhi..."
                    onChange={e => setData(d => ({ ...d, city: e.target.value }))} />
                </div>
                <div>
                  <label className="label">Pincode / ZIP *</label>
                  <input className="input" value={data.pincode} placeholder="400001"
                    onChange={e => setData(d => ({ ...d, pincode: e.target.value }))} />
                </div>
              </div>

              <div>
                <label className="label">Country</label>
                <select className="input" value={data.country} onChange={e => setData(d => ({ ...d, country: e.target.value }))}>
                  {COUNTRIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Step 2 — Health Profile */}
        {step === 2 && (
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 800, color: 'white', marginBottom: '8px' }}>
              Your Health Profile
            </h2>
            <div style={{
              display: 'flex', gap: '10px', alignItems: 'flex-start',
              padding: '12px 16px', borderRadius: '12px', marginBottom: '24px',
              background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.15)',
            }}>
              <AlertCircle size={16} color="#10b981" style={{ marginTop: '2px', flexShrink: 0 }} />
              <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.6 }}>
                Adding these helps AI generate a more accurate plan. You can update anytime in your profile.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label className="label">Age</label>
                <input className="input" type="number" min={1} max={120} value={data.age} placeholder="Your age"
                  onChange={e => setData(d => ({ ...d, age: e.target.value }))} />
              </div>

              <div>
                <label className="label">Height</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input className="input" type="number" value={data.height}
                    placeholder={data.heightUnit === 'cm' ? 'cm (e.g. 170)' : 'ft (e.g. 5)'}
                    onChange={e => setData(d => ({ ...d, height: e.target.value }))} />
                  <div style={{ display: 'flex', borderRadius: '10px', overflow: 'hidden', border: '1.5px solid rgba(255,255,255,0.1)' }}>
                    {(['cm', 'ft'] as const).map(u => (
                      <button key={u} onClick={() => setData(d => ({ ...d, heightUnit: u }))}
                        style={{
                          padding: '11px 16px', border: 'none', cursor: 'pointer',
                          background: data.heightUnit === u ? '#059669' : 'rgba(15,23,42,0.6)',
                          color: data.heightUnit === u ? 'white' : '#64748b',
                          fontWeight: 600, fontSize: '13px', transition: 'all 0.2s',
                        }}>
                        {u}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="label">Weight</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input className="input" type="number" value={data.weight}
                    placeholder={data.weightUnit === 'kg' ? 'kg (e.g. 70)' : 'lbs (e.g. 154)'}
                    onChange={e => setData(d => ({ ...d, weight: e.target.value }))} />
                  <div style={{ display: 'flex', borderRadius: '10px', overflow: 'hidden', border: '1.5px solid rgba(255,255,255,0.1)' }}>
                    {(['kg', 'lbs'] as const).map(u => (
                      <button key={u} onClick={() => setData(d => ({ ...d, weightUnit: u }))}
                        style={{
                          padding: '11px 16px', border: 'none', cursor: 'pointer',
                          background: data.weightUnit === u ? '#059669' : 'rgba(15,23,42,0.6)',
                          color: data.weightUnit === u ? 'white' : '#64748b',
                          fontWeight: 600, fontSize: '13px', transition: 'all 0.2s',
                        }}>
                        {u}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3 — Goals & Conditions */}
        {step === 3 && (
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 800, color: 'white', marginBottom: '8px' }}>
              Goals & Health Conditions
            </h2>
            <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '24px' }}>
              Optional — but dramatically improves AI plan accuracy.
            </p>

            {/* Goal Selection */}
            <div style={{ marginBottom: '28px' }}>
              <label className="label" style={{ marginBottom: '12px' }}>Primary Goal</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {GOALS.map(g => (
                  <button key={g.id}
                    onClick={() => setData(d => ({ ...d, goal: g.id }))}
                    style={{
                      padding: '14px', borderRadius: '12px', cursor: 'pointer', textAlign: 'left',
                      background: data.goal === g.id ? 'rgba(16,185,129,0.12)' : 'rgba(30,41,59,0.5)',
                      border: data.goal === g.id ? '1.5px solid #10b981' : '1.5px solid rgba(255,255,255,0.08)',
                      transition: 'all 0.2s',
                    }}>
                    <div style={{ fontSize: '20px', marginBottom: '4px' }}>{g.icon}</div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: data.goal === g.id ? '#10b981' : 'white' }}>{g.label}</div>
                    <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>{g.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Allergies */}
            <div style={{ marginBottom: '28px' }}>
              <label className="label" style={{ marginBottom: '12px' }}>Known Allergies</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {ALLERGIES.map(a => (
                  <button key={a}
                    onClick={() => setData(d => ({ ...d, allergies: toggle(d.allergies, a) }))}
                    style={{
                      padding: '6px 14px', borderRadius: '100px', cursor: 'pointer',
                      background: data.allergies.includes(a) ? 'rgba(220,38,38,0.15)' : 'rgba(30,41,59,0.6)',
                      border: data.allergies.includes(a) ? '1.5px solid #dc2626' : '1.5px solid rgba(255,255,255,0.08)',
                      color: data.allergies.includes(a) ? '#f87171' : '#64748b',
                      fontSize: '12px', fontWeight: 500, transition: 'all 0.2s',
                    }}>
                    {a}
                  </button>
                ))}
              </div>
            </div>

            {/* Diseases */}
            <div>
              <label className="label" style={{ marginBottom: '12px' }}>Health Conditions</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {DISEASES.map(d => (
                  <button key={d}
                    onClick={() => setData(prev => ({ ...prev, diseases: toggle(prev.diseases, d) }))}
                    style={{
                      padding: '6px 14px', borderRadius: '100px', cursor: 'pointer',
                      background: data.diseases.includes(d) ? 'rgba(245,158,11,0.15)' : 'rgba(30,41,59,0.6)',
                      border: data.diseases.includes(d) ? '1.5px solid #f59e0b' : '1.5px solid rgba(255,255,255,0.08)',
                      color: data.diseases.includes(d) ? '#fbbf24' : '#64748b',
                      fontSize: '12px', fontWeight: 500, transition: 'all 0.2s',
                    }}>
                    {d}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div style={{ display: 'flex', gap: '12px', marginTop: '40px', justifyContent: 'space-between' }}>
          {step > 1 ? (
            <button className="btn btn-ghost" onClick={() => setStep(s => s - 1)}>
              <ChevronLeft size={16} /> Back
            </button>
          ) : (
            <div />
          )}

          <div style={{ display: 'flex', gap: '12px' }}>
            {step < totalSteps && step > 1 && (
              <button className="btn btn-ghost"
                onClick={() => step < totalSteps ? setStep(s => s + 1) : handleSubmit()}>
                Skip for now
              </button>
            )}
            {step < totalSteps ? (
              <button className="btn btn-primary"
                onClick={() => setStep(s => s + 1)}>
                Continue <ChevronRight size={16} />
              </button>
            ) : (
              <button className="btn btn-primary" onClick={handleSubmit}>
                <Check size={16} /> Complete Setup
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

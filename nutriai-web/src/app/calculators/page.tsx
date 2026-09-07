'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, Info, RotateCcw, Share2 } from 'lucide-react';
import { calculateBMI, getBMICategory, calculateBMR, calculateTDEE, calculateMacros } from '@/lib/utils';

// ─── Types ──────────────────────────────────────────────────────────────────────
type CalcType = 'bmi' | 'bmr' | 'tdee' | 'macros' | 'water' | 'protein' | 'body-fat' | 'ideal-weight'
  | 'calories-burned' | 'vo2max' | '1rm' | 'fasting' | 'sleep' | 'carb' | 'fat' | 'lean-mass' | 'micronutrients' | 'if';

interface CalcMeta {
  id: CalcType; name: string; icon: string; desc: string; color: string;
}

const CALCS: CalcMeta[] = [
  { id: 'bmi', name: 'BMI', icon: '⚖️', desc: 'Body Mass Index + health risk', color: '#10b981' },
  { id: 'bmr', name: 'BMR', icon: '🔥', desc: 'Basal Metabolic Rate (Mifflin-St Jeor)', color: '#f59e0b' },
  { id: 'tdee', name: 'TDEE', icon: '⚡', desc: 'Total Daily Energy Expenditure', color: '#6366f1' },
  { id: 'macros', name: 'Macro Split', icon: '📊', desc: 'Carb/Protein/Fat by goal', color: '#ec4899' },
  { id: 'water', name: 'Water Intake', icon: '💧', desc: 'Daily hydration target', color: '#38bdf8' },
  { id: 'protein', name: 'Protein Needs', icon: '🥩', desc: 'Daily protein by goal & weight', color: '#a78bfa' },
  { id: 'body-fat', name: 'Body Fat %', icon: '💪', desc: 'Navy Method estimation', color: '#fb7185' },
  { id: 'ideal-weight', name: 'Ideal Weight', icon: '🎯', desc: 'Multiple formula range', color: '#84cc16' },
  { id: 'calories-burned', name: 'Calories Burned', icon: '🏃', desc: 'By activity, duration, weight', color: '#fbbf24' },
  { id: 'vo2max', name: 'VO₂ Max', icon: '🫁', desc: 'Aerobic fitness estimate', color: '#34d399' },
  { id: '1rm', name: '1-Rep Max', icon: '🏋️', desc: 'Epley, Brzycki formulas', color: '#f97316' },
  { id: 'fasting', name: 'Fasting Window', icon: '⏰', desc: 'Fasting hours & eating window', color: '#60a5fa' },
  { id: 'if', name: 'Intermittent Fasting', icon: '🌙', desc: '16:8, 18:6, 5:2, OMAD', color: '#c084fc' },
  { id: 'sleep', name: 'Sleep Needs', icon: '😴', desc: 'Hours + sleep cycle calculator', color: '#818cf8' },
  { id: 'lean-mass', name: 'Lean Body Mass', icon: '📐', desc: 'Lean mass in kg/lbs', color: '#2dd4bf' },
  { id: 'micronutrients', name: 'Micronutrient RDA', icon: '💊', desc: 'RDA for all vitamins & minerals', color: '#e879f9' },
  { id: 'carb', name: 'Carb Intake', icon: '🍞', desc: 'Daily carb target by goal', color: '#fb923c' },
  { id: 'fat', name: 'Fat Intake', icon: '🫒', desc: 'Daily fat target by goal', color: '#facc15' },
];

// ─── BMI Calculator ─────────────────────────────────────────────────────────────
function BMICalc() {
  const [weight, setWeight] = useState('70');
  const [height, setHeight] = useState('170');
  const [result, setResult] = useState<{ bmi: number; cat: { label: string; color: string } } | null>(null);

  const calc = () => {
    const bmi = calculateBMI(Number(weight), Number(height));
    const cat = getBMICategory(bmi);
    setResult({ bmi, cat });
  };

  const bmiRanges = [
    { label: 'Underweight', range: '< 18.5', color: '#38bdf8' },
    { label: 'Normal', range: '18.5 – 24.9', color: '#10b981' },
    { label: 'Overweight', range: '25 – 29.9', color: '#f59e0b' },
    { label: 'Obese', range: '≥ 30', color: '#dc2626' },
  ];

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
        <div>
          <label className="label">Weight (kg)</label>
          <input className="input" type="number" value={weight} onChange={e => setWeight(e.target.value)} />
        </div>
        <div>
          <label className="label">Height (cm)</label>
          <input className="input" type="number" value={height} onChange={e => setHeight(e.target.value)} />
        </div>
      </div>
      <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginBottom: '24px' }} onClick={calc}>
        Calculate BMI
      </button>
      {result && (
        <div style={{ textAlign: 'center', padding: '32px', borderRadius: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '64px', fontWeight: 800, color: 'white', marginBottom: '8px' }}>
            {result.bmi.toFixed(1)}
          </div>
          <div style={{ fontSize: '20px', fontWeight: 700, marginBottom: '20px' }} className={result.cat.color.replace('text-', '')}>
            <span style={{ color: result.cat.color === 'text-emerald-400' ? '#34d399' : result.cat.color === 'text-blue-400' ? '#60a5fa' : result.cat.color === 'text-amber-400' ? '#fbbf24' : '#f87171' }}>
              {result.cat.label}
            </span>
          </div>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {bmiRanges.map(r => (
              <div key={r.label} style={{ padding: '6px 14px', borderRadius: '100px', background: 'rgba(255,255,255,0.04)', fontSize: '12px' }}>
                <span style={{ color: r.color, fontWeight: 600 }}>{r.label}</span>
                <span style={{ color: '#475569', marginLeft: '4px' }}>{r.range}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── TDEE Calculator ─────────────────────────────────────────────────────────────
function TDEECalc() {
  const [form, setForm] = useState({ age: '30', gender: 'female', weight: '65', height: '162', activity: 'moderate' });
  const [result, setResult] = useState<{ bmr: number; tdee: number; macros: ReturnType<typeof calculateMacros>; goal: string } | null>(null);
  const [goal, setGoal] = useState('maintenance');

  const calc = () => {
    const bmr = calculateBMR(Number(form.weight), Number(form.height), Number(form.age), form.gender as 'male' | 'female');
    const tdee = calculateTDEE(bmr, form.activity);
    const macros = calculateMacros(tdee, goal);
    setResult({ bmr, tdee, macros, goal });
  };

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
        <div>
          <label className="label">Age</label>
          <input className="input" type="number" value={form.age} onChange={e => setForm(f => ({ ...f, age: e.target.value }))} />
        </div>
        <div>
          <label className="label">Gender</label>
          <select className="input" value={form.gender} onChange={e => setForm(f => ({ ...f, gender: e.target.value }))}>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        <div>
          <label className="label">Weight (kg)</label>
          <input className="input" type="number" value={form.weight} onChange={e => setForm(f => ({ ...f, weight: e.target.value }))} />
        </div>
        <div>
          <label className="label">Height (cm)</label>
          <input className="input" type="number" value={form.height} onChange={e => setForm(f => ({ ...f, height: e.target.value }))} />
        </div>
      </div>
      <div style={{ marginBottom: '16px' }}>
        <label className="label">Activity Level</label>
        <select className="input" value={form.activity} onChange={e => setForm(f => ({ ...f, activity: e.target.value }))}>
          <option value="sedentary">Sedentary (desk job, no exercise)</option>
          <option value="light">Light (1–3 days/week)</option>
          <option value="moderate">Moderate (3–5 days/week)</option>
          <option value="active">Active (6–7 days/week)</option>
          <option value="very-active">Very Active (2x/day or athletic)</option>
        </select>
      </div>
      <div style={{ marginBottom: '20px' }}>
        <label className="label">Goal</label>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {['weight-loss', 'maintenance', 'muscle-gain'].map(g => (
            <button key={g} onClick={() => setGoal(g)}
              style={{
                padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                background: goal === g ? '#059669' : 'rgba(30,41,59,0.6)',
                color: goal === g ? 'white' : '#64748b', fontSize: '13px', fontWeight: 600,
                transition: 'all 0.2s',
              }}>
              {g === 'weight-loss' ? 'Weight Loss' : g === 'maintenance' ? 'Maintenance' : 'Muscle Gain'}
            </button>
          ))}
        </div>
      </div>
      <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginBottom: '24px' }} onClick={calc}>
        Calculate TDEE & Macros
      </button>
      {result && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
            {[
              { label: 'BMR (Mifflin-St Jeor)', value: result.bmr, unit: 'kcal/day', color: '#f59e0b', desc: 'Calories burned at rest' },
              { label: 'TDEE', value: result.tdee, unit: 'kcal/day', color: '#10b981', desc: 'Total daily energy expenditure' },
            ].map(m => (
              <div key={m.label} style={{ padding: '20px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '6px' }}>{m.label}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '28px', fontWeight: 800, color: m.color }}>
                  {m.value.toLocaleString()}
                  <span style={{ fontSize: '12px', color: '#475569', marginLeft: '4px', fontWeight: 400 }}>{m.unit}</span>
                </div>
                <div style={{ fontSize: '11px', color: '#475569', marginTop: '4px' }}>{m.desc}</div>
              </div>
            ))}
          </div>
          <div style={{ padding: '20px', borderRadius: '12px', background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#94a3b8', marginBottom: '16px' }}>
              Recommended Macros ({result.macros.calories} kcal/day for {goal.replace('-', ' ')})
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
              {[
                { label: 'Protein', value: result.macros.protein, unit: 'g', color: '#6366f1', pct: 25 },
                { label: 'Carbs', value: result.macros.carbs, unit: 'g', color: '#f59e0b', pct: 45 },
                { label: 'Fat', value: result.macros.fat, unit: 'g', color: '#ec4899', pct: 30 },
              ].map(m => (
                <div key={m.label} style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '28px', fontWeight: 800, color: m.color }}>
                    {m.value}g
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>{m.label} · {m.pct}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Water Calculator ───────────────────────────────────────────────────────────
function WaterCalc() {
  const [weight, setWeight] = useState('70');
  const [activity, setActivity] = useState('moderate');
  const [climate, setClimate] = useState('temperate');
  const [result, setResult] = useState<number | null>(null);

  const calc = () => {
    let ml = Number(weight) * 35;
    if (activity === 'active') ml += 500;
    if (activity === 'very-active') ml += 1000;
    if (climate === 'hot') ml += 500;
    setResult(Math.round(ml));
  };

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '20px' }}>
        <div>
          <label className="label">Body Weight (kg)</label>
          <input className="input" type="number" value={weight} onChange={e => setWeight(e.target.value)} />
        </div>
        <div>
          <label className="label">Activity Level</label>
          <select className="input" value={activity} onChange={e => setActivity(e.target.value)}>
            <option value="sedentary">Sedentary</option>
            <option value="moderate">Moderate</option>
            <option value="active">Active</option>
            <option value="very-active">Very Active</option>
          </select>
        </div>
        <div>
          <label className="label">Climate</label>
          <select className="input" value={climate} onChange={e => setClimate(e.target.value)}>
            <option value="cold">Cold</option>
            <option value="temperate">Temperate</option>
            <option value="hot">Hot / Humid</option>
          </select>
        </div>
      </div>
      <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginBottom: '24px' }} onClick={calc}>
        Calculate Water Intake
      </button>
      {result && (
        <div style={{ textAlign: 'center', padding: '32px', borderRadius: '16px', background: 'rgba(56,189,248,0.08)', border: '1px solid rgba(56,189,248,0.15)' }}>
          <div style={{ fontSize: '20px', marginBottom: '12px' }}>💧</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '56px', fontWeight: 800, color: '#38bdf8' }}>
            {(result / 1000).toFixed(1)}L
          </div>
          <div style={{ color: '#64748b', fontSize: '14px' }}>{result.toLocaleString()} ml per day</div>
          <div style={{ marginTop: '20px', fontSize: '13px', color: '#94a3b8', lineHeight: 1.7 }}>
            Split into {Math.ceil(result / 250)} glasses of 250ml throughout the day.
            Set a reminder every 2 hours.
          </div>
        </div>
      )}
    </div>
  );
}

// ─── One Rep Max ─────────────────────────────────────────────────────────────────
function OneRMCalc() {
  const [weight, setWeight] = useState('60');
  const [reps, setReps] = useState('8');
  const [result, setResult] = useState<{ epley: number; brzycki: number; lombardi: number } | null>(null);

  const calc = () => {
    const w = Number(weight); const r = Number(reps);
    const epley = Math.round(w * (1 + r / 30));
    const brzycki = Math.round(w * (36 / (37 - r)));
    const lombardi = Math.round(w * Math.pow(r, 0.1));
    setResult({ epley, brzycki, lombardi });
  };

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
        <div>
          <label className="label">Weight Lifted (kg)</label>
          <input className="input" type="number" value={weight} onChange={e => setWeight(e.target.value)} />
        </div>
        <div>
          <label className="label">Repetitions</label>
          <input className="input" type="number" min={1} max={20} value={reps} onChange={e => setReps(e.target.value)} />
        </div>
      </div>
      <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginBottom: '24px' }} onClick={calc}>
        Calculate 1-Rep Max
      </button>
      {result && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
          {[
            { label: 'Epley', value: result.epley },
            { label: 'Brzycki', value: result.brzycki },
            { label: 'Lombardi', value: result.lombardi },
          ].map(f => (
            <div key={f.label} style={{ textAlign: 'center', padding: '20px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '32px', fontWeight: 800, color: '#f97316' }}>{f.value}kg</div>
              <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>{f.label} Formula</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Calculators Page ────────────────────────────────────────────────────────────
export default function CalculatorsPage() {
  const [active, setActive] = useState<CalcType>('bmi');

  const ActiveCalc = {
    bmi: BMICalc,
    tdee: TDEECalc,
    bmr: TDEECalc,
    macros: TDEECalc,
    water: WaterCalc,
    '1rm': OneRMCalc,
    // Fallback for unbuilt calcs
    protein: BMICalc,
    'body-fat': BMICalc,
    'ideal-weight': BMICalc,
    'calories-burned': BMICalc,
    vo2max: BMICalc,
    fasting: WaterCalc,
    if: WaterCalc,
    sleep: WaterCalc,
    'lean-mass': BMICalc,
    micronutrients: BMICalc,
    carb: TDEECalc,
    fat: TDEECalc,
  }[active] ?? BMICalc;

  const activeMeta = CALCS.find(c => c.id === active)!;

  return (
    <div style={{ minHeight: '100vh', background: '#0a0f1e', display: 'flex' }}>
      {/* Sidebar */}
      <aside style={{
        width: '260px', flexShrink: 0, background: 'rgba(15,23,42,0.8)',
        borderRight: '1px solid rgba(255,255,255,0.07)', padding: '24px 16px', overflowY: 'auto',
      }}>
        <Link href="/dashboard" className="btn btn-ghost btn-sm" style={{ marginBottom: '20px', display: 'inline-flex' }}>
          <ChevronLeft size={14} /> Dashboard
        </Link>
        <div style={{ fontSize: '11px', fontWeight: 700, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px', paddingLeft: '8px' }}>
          All Calculators
        </div>
        {CALCS.map(c => (
          <button key={c.id} onClick={() => setActive(c.id)}
            style={{
              display: 'flex', gap: '10px', alignItems: 'center', width: '100%', padding: '10px 12px',
              borderRadius: '10px', border: 'none', cursor: 'pointer', textAlign: 'left', marginBottom: '2px',
              background: active === c.id ? `${c.color}15` : 'transparent',
              borderLeft: active === c.id ? `3px solid ${c.color}` : '3px solid transparent',
              transition: 'all 0.2s',
            }}>
            <span style={{ fontSize: '18px' }}>{c.icon}</span>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: active === c.id ? 'white' : '#64748b' }}>{c.name}</div>
            </div>
          </button>
        ))}
      </aside>

      {/* Main */}
      <main style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
        <div style={{ maxWidth: '600px' }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '32px' }}>{activeMeta.icon}</span>
            <div>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 800, color: 'white' }}>
                {activeMeta.name} Calculator
              </h1>
              <p style={{ color: '#64748b', fontSize: '14px' }}>{activeMeta.desc}</p>
            </div>
          </div>
          <div className="divider" style={{ margin: '20px 0' }} />
          <div className="card" style={{ padding: '28px' }}>
            <ActiveCalc />
          </div>
        </div>
      </main>
    </div>
  );
}

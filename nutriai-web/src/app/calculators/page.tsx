'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ChevronLeft, Info, RotateCcw, Share2, ArrowRight } from 'lucide-react';
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

// ─── 1. BMI Calculator ─────────────────────────────────────────────────────────────
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
          <div style={{ fontSize: '20px', fontWeight: 700, marginBottom: '20px' }}>
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

// ─── 2. BMR Calculator ─────────────────────────────────────────────────────────────
function BMRCalc() {
  const [form, setForm] = useState({ age: '30', gender: 'female', weight: '65', height: '162' });
  const [result, setResult] = useState<number | null>(null);

  const calc = () => {
    const bmr = calculateBMR(Number(form.weight), Number(form.height), Number(form.age), form.gender as 'male' | 'female');
    setResult(bmr);
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
      <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginBottom: '24px' }} onClick={calc}>
        Calculate Basal Metabolic Rate
      </button>
      {result !== null && (
        <div style={{ textAlign: 'center', padding: '32px', borderRadius: '16px', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}>
          <div style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '8px' }}>Your Basal Metabolic Rate (Mifflin-St Jeor)</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '56px', fontWeight: 800, color: '#f59e0b' }}>
            {result.toLocaleString()} <span style={{ fontSize: '18px', color: '#64748b' }}>kcal/day</span>
          </div>
          <div style={{ fontSize: '13px', color: '#cbd5e1', marginTop: '12px', maxWidth: '400px', margin: '12px auto 0' }}>
            Calories burned completely at rest to maintain heart, lung, and cellular functions.
          </div>
        </div>
      )}
    </div>
  );
}

// ─── 3. TDEE & Macros Calculator ───────────────────────────────────────────────────
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

// ─── 4. Water Calculator ───────────────────────────────────────────────────────────
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
          </div>
        </div>
      )}
    </div>
  );
}

// ─── 5. Protein Needs Calculator ───────────────────────────────────────────────────
function ProteinCalc() {
  const [weight, setWeight] = useState('70');
  const [goal, setGoal] = useState('muscle-gain');
  const [result, setResult] = useState<{ grams: number; perKg: number; perMeal: number } | null>(null);

  const calc = () => {
    const w = parseFloat(weight) || 70;
    const perKg = goal === 'muscle-gain' ? 2.0 : goal === 'weight-loss' ? 1.7 : 1.2;
    const grams = Math.round(w * perKg);
    const perMeal = Math.round(grams / 4);
    setResult({ grams, perKg, perMeal });
  };

  return (
    <div>
      <div style={{ marginBottom: '16px' }}>
        <label className="label">Weight (kg)</label>
        <input className="input" type="number" value={weight} onChange={e => setWeight(e.target.value)} />
      </div>
      <div style={{ marginBottom: '20px' }}>
        <label className="label">Fitness Goal</label>
        <select className="input" value={goal} onChange={e => setGoal(e.target.value)}>
          <option value="weight-loss">Weight Loss (Preserve muscle in deficit)</option>
          <option value="muscle-gain">Muscle Hypertrophy & Strength</option>
          <option value="maintenance">Health Maintenance & Longevity</option>
        </select>
      </div>
      <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginBottom: '24px' }} onClick={calc}>
        Calculate Protein Target
      </button>
      {result && (
        <div style={{ textAlign: 'center', padding: '32px', borderRadius: '16px', background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '56px', fontWeight: 800, color: '#6366f1' }}>
            {result.grams}g <span style={{ fontSize: '18px', color: '#64748b' }}>/ day</span>
          </div>
          <div style={{ fontSize: '14px', color: '#94a3b8', marginTop: '8px' }}>
            Based on {result.perKg}g per kg body weight ({result.perMeal}g across 4 meals)
          </div>
        </div>
      )}
    </div>
  );
}

// ─── 6. Body Fat % Calculator (Navy Method) ────────────────────────────────────────
function BodyFatCalc() {
  const [gender, setGender] = useState('male');
  const [height, setHeight] = useState('175');
  const [waist, setWaist] = useState('85');
  const [neck, setNeck] = useState('38');
  const [hip, setHip] = useState('95');
  const [bf, setBf] = useState<number | null>(null);

  const calc = () => {
    const h = parseFloat(height);
    const w = parseFloat(waist);
    const n = parseFloat(neck);
    const hp = parseFloat(hip);
    let val = 0;
    if (gender === 'male') {
      val = 495 / (1.0324 - 0.19077 * Math.log10(w - n) + 0.15456 * Math.log10(h)) - 450;
    } else {
      val = 495 / (1.29579 - 0.35004 * Math.log10(w + hp - n) + 0.22100 * Math.log10(h)) - 450;
    }
    setBf(Math.max(4, Math.min(50, parseFloat(val.toFixed(1)))));
  };

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
        <div>
          <label className="label">Gender</label>
          <select className="input" value={gender} onChange={e => setGender(e.target.value)}>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        <div>
          <label className="label">Height (cm)</label>
          <input className="input" type="number" value={height} onChange={e => setHeight(e.target.value)} />
        </div>
        <div>
          <label className="label">Waist at Navel (cm)</label>
          <input className="input" type="number" value={waist} onChange={e => setWaist(e.target.value)} />
        </div>
        <div>
          <label className="label">Neck Narrowest (cm)</label>
          <input className="input" type="number" value={neck} onChange={e => setNeck(e.target.value)} />
        </div>
        {gender === 'female' && (
          <div style={{ gridColumn: 'span 2' }}>
            <label className="label">Hips Widest (cm)</label>
            <input className="input" type="number" value={hip} onChange={e => setHip(e.target.value)} />
          </div>
        )}
      </div>
      <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginBottom: '24px' }} onClick={calc}>
        Calculate Body Fat %
      </button>
      {bf !== null && (
        <div style={{ textAlign: 'center', padding: '32px', borderRadius: '16px', background: 'rgba(251,113,133,0.08)', border: '1px solid rgba(251,113,133,0.2)' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '56px', fontWeight: 800, color: '#fb7185' }}>
            {bf}%
          </div>
          <div style={{ fontSize: '14px', color: '#94a3b8', marginTop: '4px' }}>
            Estimated Body Fat (U.S. Navy Formula)
          </div>
        </div>
      )}
    </div>
  );
}

// ─── 7. Ideal Weight Calculator ────────────────────────────────────────────────────
function IdealWeightCalc() {
  const [gender, setGender] = useState('male');
  const [height, setHeight] = useState('175');
  const [res, setRes] = useState<{ min: number; max: number; ideal: number } | null>(null);

  const calc = () => {
    const h = parseFloat(height);
    const meters = h / 100;
    const min = Math.round(18.5 * (meters * meters));
    const max = Math.round(24.9 * (meters * meters));
    const inches = h / 2.54;
    const diff = Math.max(0, inches - 60);
    const devine = gender === 'male' ? 50 + 2.3 * diff : 45.5 + 2.3 * diff;
    setRes({ min, max, ideal: Math.round(devine) });
  };

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
        <div>
          <label className="label">Gender</label>
          <select className="input" value={gender} onChange={e => setGender(e.target.value)}>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        <div>
          <label className="label">Height (cm)</label>
          <input className="input" type="number" value={height} onChange={e => setHeight(e.target.value)} />
        </div>
      </div>
      <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginBottom: '24px' }} onClick={calc}>
        Calculate Ideal Weight Range
      </button>
      {res && (
        <div style={{ textAlign: 'center', padding: '32px', borderRadius: '16px', background: 'rgba(132,204,22,0.08)', border: '1px solid rgba(132,204,22,0.2)' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '56px', fontWeight: 800, color: '#84cc16' }}>
            {res.ideal} kg
          </div>
          <div style={{ fontSize: '14px', color: '#94a3b8', marginTop: '4px' }}>
            Healthy BMI Range: {res.min} kg – {res.max} kg
          </div>
        </div>
      )}
    </div>
  );
}

// ─── 8. Calories Burned Calculator ─────────────────────────────────────────────────
function CaloriesBurnedCalc() {
  const [activity, setActivity] = useState('running');
  const [duration, setDuration] = useState('45');
  const [weight, setWeight] = useState('70');
  const [burned, setBurned] = useState<number | null>(null);

  const METS: Record<string, number> = {
    running: 8.5,
    cycling: 7.5,
    swimming: 6.0,
    weights: 5.0,
    walking: 3.5,
    hiit: 9.5,
    yoga: 3.0,
  };

  const calc = () => {
    const met = METS[activity] || 5;
    const mins = parseFloat(duration) || 30;
    const w = parseFloat(weight) || 70;
    const total = Math.round((met * 3.5 * w / 200) * mins);
    setBurned(total);
  };

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
        <div>
          <label className="label">Activity</label>
          <select className="input" value={activity} onChange={e => setActivity(e.target.value)}>
            <option value="running">Running (8.5 km/h)</option>
            <option value="cycling">Cycling (moderate)</option>
            <option value="swimming">Swimming</option>
            <option value="weights">Weight Lifting</option>
            <option value="hiit">HIIT Circuit</option>
            <option value="walking">Brisk Walking</option>
            <option value="yoga">Yoga</option>
          </select>
        </div>
        <div>
          <label className="label">Duration (Minutes)</label>
          <input className="input" type="number" value={duration} onChange={e => setDuration(e.target.value)} />
        </div>
        <div style={{ gridColumn: 'span 2' }}>
          <label className="label">Weight (kg)</label>
          <input className="input" type="number" value={weight} onChange={e => setWeight(e.target.value)} />
        </div>
      </div>
      <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginBottom: '24px' }} onClick={calc}>
        Calculate Calories Burned
      </button>
      {burned !== null && (
        <div style={{ textAlign: 'center', padding: '32px', borderRadius: '16px', background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.2)' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '56px', fontWeight: 800, color: '#fbbf24' }}>
            {burned} kcal
          </div>
          <div style={{ fontSize: '14px', color: '#94a3b8', marginTop: '4px' }}>
            Total Energy Expended
          </div>
        </div>
      )}
    </div>
  );
}

// ─── 9. One Rep Max Calculator ─────────────────────────────────────────────────────
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
          <label className="label">Repetitions (1–20)</label>
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

// ─── 10. VO2 Max Calculator ────────────────────────────────────────────────────────
function VO2MaxCalc() {
  const [age, setAge] = useState('30');
  const [rhr, setRhr] = useState('65');
  const [vo2, setVo2] = useState<number | null>(null);

  const calc = () => {
    const a = parseFloat(age) || 30;
    const r = parseFloat(rhr) || 65;
    const mhr = 208 - 0.7 * a;
    const score = parseFloat((15.3 * (mhr / r)).toFixed(1));
    setVo2(score);
  };

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
        <div>
          <label className="label">Age</label>
          <input className="input" type="number" value={age} onChange={e => setAge(e.target.value)} />
        </div>
        <div>
          <label className="label">Resting Heart Rate (bpm)</label>
          <input className="input" type="number" value={rhr} onChange={e => setRhr(e.target.value)} />
        </div>
      </div>
      <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginBottom: '24px' }} onClick={calc}>
        Estimate VO₂ Max
      </button>
      {vo2 !== null && (
        <div style={{ textAlign: 'center', padding: '32px', borderRadius: '16px', background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.2)' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '56px', fontWeight: 800, color: '#34d399' }}>
            {vo2}
          </div>
          <div style={{ fontSize: '14px', color: '#94a3b8', marginTop: '4px' }}>
            ml / kg / min (Cardiorespiratory Aerobic Fitness)
          </div>
        </div>
      )}
    </div>
  );
}

// ─── 11. Intermittent Fasting & Fasting Window Calculator ───────────────────────────
function FastingCalc() {
  const [protocol, setProtocol] = useState('16:8');
  const [startTime, setStartTime] = useState('20:00');
  const [schedule, setSchedule] = useState<{ fastHours: number; eatHours: number; endTime: string } | null>(null);

  const calc = () => {
    const fastHours = protocol === '16:8' ? 16 : protocol === '18:6' ? 18 : protocol === '20:4' ? 20 : 24;
    const [h, m] = startTime.split(':').map(Number);
    const endH = (h + fastHours) % 24;
    const endTimeStr = `${endH < 10 ? '0' : ''}${endH}:${m < 10 ? '0' : ''}${m}`;
    setSchedule({ fastHours, eatHours: 24 - fastHours, endTime: endTimeStr });
  };

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
        <div>
          <label className="label">Fasting Protocol</label>
          <select className="input" value={protocol} onChange={e => setProtocol(e.target.value)}>
            <option value="16:8">16:8 Protocol (Popular)</option>
            <option value="18:6">18:6 Protocol (Accelerated)</option>
            <option value="20:4">20:4 Warrior Diet</option>
            <option value="24:0">24h OMAD (One Meal A Day)</option>
          </select>
        </div>
        <div>
          <label className="label">Last Meal Finished At</label>
          <input className="input" type="time" value={startTime} onChange={e => setStartTime(e.target.value)} />
        </div>
      </div>
      <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginBottom: '24px' }} onClick={calc}>
        Calculate Fasting Schedule
      </button>
      {schedule && (
        <div style={{ padding: '24px', borderRadius: '16px', background: 'rgba(96,165,250,0.08)', border: '1px solid rgba(96,165,250,0.2)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', textAlign: 'center' }}>
            <div>
              <div style={{ fontSize: '12px', color: '#94a3b8' }}>Fasting Window</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '28px', fontWeight: 800, color: '#60a5fa' }}>{schedule.fastHours}h</div>
              <div style={{ fontSize: '11px', color: '#64748b' }}>Ends at {schedule.endTime}</div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#94a3b8' }}>Eating Window</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '28px', fontWeight: 800, color: '#34d399' }}>{schedule.eatHours}h</div>
              <div style={{ fontSize: '11px', color: '#64748b' }}>Consume your meal target</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── 12. Sleep Cycle Calculator ───────────────────────────────────────────────────
function SleepCalc() {
  const [wakeTime, setWakeTime] = useState('06:30');
  const [cycles, setCycles] = useState<string[]>([]);

  const calc = () => {
    const [h, m] = wakeTime.split(':').map(Number);
    const totalWakeMins = h * 60 + m;
    const list: string[] = [];
    [6, 5, 4].forEach(c => {
      const sleepMins = totalWakeMins - (c * 90) - 15; // 15 mins to fall asleep
      const normalized = (sleepMins + 1440) % 1440;
      const sh = Math.floor(normalized / 60);
      const sm = normalized % 60;
      list.push(`${sh < 10 ? '0' : ''}${sh}:${sm < 10 ? '0' : ''}${sm} (${c * 1.5}h, ${c} cycles)`);
    });
    setCycles(list);
  };

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <label className="label">Desired Wake-Up Time</label>
        <input className="input" type="time" value={wakeTime} onChange={e => setWakeTime(e.target.value)} />
      </div>
      <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginBottom: '24px' }} onClick={calc}>
        Calculate Bedtimes
      </button>
      {cycles.length > 0 && (
        <div style={{ padding: '24px', borderRadius: '16px', background: 'rgba(129,140,248,0.08)', border: '1px solid rgba(129,140,248,0.2)' }}>
          <div style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '12px', fontWeight: 600 }}>
            Optimal Bedtimes (to wake up at the end of a 90m sleep cycle):
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {cycles.map((item, idx) => (
              <div key={idx} style={{ padding: '10px 14px', borderRadius: '8px', background: 'rgba(255,255,255,0.04)', fontSize: '14px', fontWeight: 600, color: 'white' }}>
                🌙 Go to sleep at: <span style={{ color: '#818cf8' }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── 13. Lean Body Mass Calculator ─────────────────────────────────────────────────
function LeanMassCalc() {
  const [weight, setWeight] = useState('74');
  const [bf, setBf] = useState('18');
  const [res, setRes] = useState<{ lbm: number; fatMass: number } | null>(null);

  const calc = () => {
    const w = parseFloat(weight) || 74;
    const b = parseFloat(bf) || 18;
    const fatMass = parseFloat(((w * b) / 100).toFixed(1));
    const lbm = parseFloat((w - fatMass).toFixed(1));
    setRes({ lbm, fatMass });
  };

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
        <div>
          <label className="label">Total Weight (kg)</label>
          <input className="input" type="number" value={weight} onChange={e => setWeight(e.target.value)} />
        </div>
        <div>
          <label className="label">Body Fat %</label>
          <input className="input" type="number" value={bf} onChange={e => setBf(e.target.value)} />
        </div>
      </div>
      <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginBottom: '24px' }} onClick={calc}>
        Calculate Lean Mass
      </button>
      {res && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', textAlign: 'center' }}>
          <div style={{ padding: '24px', borderRadius: '16px', background: 'rgba(45,212,191,0.08)', border: '1px solid rgba(45,212,191,0.2)' }}>
            <div style={{ fontSize: '12px', color: '#94a3b8' }}>Lean Body Mass</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '36px', fontWeight: 800, color: '#2dd4bf' }}>{res.lbm}kg</div>
          </div>
          <div style={{ padding: '24px', borderRadius: '16px', background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.2)' }}>
            <div style={{ fontSize: '12px', color: '#94a3b8' }}>Fat Mass</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '36px', fontWeight: 800, color: '#f43f5e' }}>{res.fatMass}kg</div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── 14. Micronutrient RDA Calculator ──────────────────────────────────────────────
function MicronutrientCalc() {
  const [gender, setGender] = useState('female');

  const rda = gender === 'female' ? [
    { name: 'Vitamin C', amount: '75 mg' },
    { name: 'Vitamin D', amount: '600–800 IU' },
    { name: 'Calcium', amount: '1,000–1,200 mg' },
    { name: 'Iron', amount: '18 mg' },
    { name: 'Zinc', amount: '8 mg' },
    { name: 'Magnesium', amount: '310 mg' },
    { name: 'Potassium', amount: '2,600 mg' },
    { name: 'Vitamin B12', amount: '2.4 mcg' },
  ] : [
    { name: 'Vitamin C', amount: '90 mg' },
    { name: 'Vitamin D', amount: '600–800 IU' },
    { name: 'Calcium', amount: '1,000 mg' },
    { name: 'Iron', amount: '8 mg' },
    { name: 'Zinc', amount: '11 mg' },
    { name: 'Magnesium', amount: '400 mg' },
    { name: 'Potassium', amount: '3,400 mg' },
    { name: 'Vitamin B12', amount: '2.4 mcg' },
  ];

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <label className="label">Biological Sex</label>
        <select className="input" value={gender} onChange={e => setGender(e.target.value)}>
          <option value="male">Male (Adult 19–50)</option>
          <option value="female">Female (Adult 19–50)</option>
        </select>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        {rda.map(item => (
          <div key={item.name} style={{ padding: '14px', borderRadius: '10px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ fontSize: '12px', color: '#64748b' }}>{item.name}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '18px', fontWeight: 700, color: '#e879f9' }}>{item.amount}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Calculator Router Content ────────────────────────────────────────────────────
function CalculatorContent() {
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get('calc') || searchParams.get('tab') || 'bmi') as CalcType;
  const [active, setActive] = useState<CalcType>('bmi');

  useEffect(() => {
    if (initialTab && CALCS.some(c => c.id === initialTab)) {
      setActive(initialTab);
    }
  }, [initialTab]);

  const activeMeta = CALCS.find(c => c.id === active) || CALCS[0];

  const renderActiveCalc = () => {
    switch (active) {
      case 'bmi': return <BMICalc />;
      case 'bmr': return <BMRCalc />;
      case 'tdee': return <TDEECalc />;
      case 'macros': return <TDEECalc />;
      case 'water': return <WaterCalc />;
      case 'protein': return <ProteinCalc />;
      case 'body-fat': return <BodyFatCalc />;
      case 'ideal-weight': return <IdealWeightCalc />;
      case 'calories-burned': return <CaloriesBurnedCalc />;
      case 'vo2max': return <VO2MaxCalc />;
      case '1rm': return <OneRMCalc />;
      case 'fasting':
      case 'if': return <FastingCalc />;
      case 'sleep': return <SleepCalc />;
      case 'lean-mass': return <LeanMassCalc />;
      case 'micronutrients': return <MicronutrientCalc />;
      case 'carb':
      case 'fat': return <TDEECalc />;
      default: return <BMICalc />;
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0a0f1e', display: 'flex' }}>
      {/* Sidebar */}
      <aside style={{
        width: '260px', flexShrink: 0, background: 'rgba(15,23,42,0.8)',
        borderRight: '1px solid rgba(255,255,255,0.07)', padding: '24px 16px', overflowY: 'auto',
      }}>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
          <Link href="/dashboard" className="btn btn-ghost btn-sm" style={{ flex: 1, fontSize: '12px' }}>
            <ChevronLeft size={14} /> Dashboard
          </Link>
          <Link href="/" className="btn btn-ghost btn-sm" style={{ flex: 1, fontSize: '12px' }}>
            Home
          </Link>
        </div>

        <div style={{ fontSize: '11px', fontWeight: 700, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px', paddingLeft: '8px' }}>
          All 18 Calculators
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
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '36px' }}>{activeMeta.icon}</span>
            <div>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: 800, color: 'white' }}>
                {activeMeta.name} Calculator
              </h1>
              <p style={{ color: '#64748b', fontSize: '14px' }}>{activeMeta.desc}</p>
            </div>
          </div>
          <div className="divider" style={{ margin: '20px 0' }} />
          <div className="card" style={{ padding: '28px' }}>
            {renderActiveCalc()}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function CalculatorsPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: '#0a0f1e', color: 'white', padding: '40px', textAlign: 'center' }}>Loading Calculators...</div>}>
      <CalculatorContent />
    </Suspense>
  );
}

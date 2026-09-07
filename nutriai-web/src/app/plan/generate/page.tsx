'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Leaf, Brain, Zap, ChevronRight, ChevronLeft, Loader2,
  AlertCircle, Check, Download, Edit3, RotateCcw, Plus,
  Trash2, ArrowRight, Info, Activity, Flame, Apple
} from 'lucide-react';

// ─── Types ──────────────────────────────────────────────────────────────────────
type GoalType = 'weight-loss' | 'weight-gain' | 'muscle-gain' | 'maintenance' | 'medical' | 'general-health';
type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very-active';

const DISEASES = [
  'Diabetes Type 2', 'Diabetes Type 1', 'Pre-Diabetes', 'Hypertension',
  'High Cholesterol', 'Heart Disease', 'PCOS', 'CKD', 'GERD', 'IBS',
  'Celiac Disease', 'Lactose Intolerance', 'Fatty Liver', 'Gout',
  'Anemia', 'Osteoporosis', 'Hypothyroidism', 'Obesity',
];
const ALLERGIES = [
  'Milk/Dairy', 'Eggs', 'Fish', 'Shellfish', 'Tree Nuts',
  'Peanuts', 'Wheat/Gluten', 'Soy', 'Sesame', 'Corn',
];
const WORKOUT_TYPES = ['Gym', 'Yoga', 'Running', 'Cycling', 'Swimming', 'CrossFit', 'Powerlifting', 'Bodybuilding'];
const CUISINE_PREFS = ['Indian', 'Mediterranean', 'Asian', 'Continental', 'Middle Eastern', 'Mexican'];
const FOOD_PREFS = ['Vegetarian', 'Vegan', 'Non-Vegetarian', 'Jain', 'Halal', 'Kosher', 'Keto', 'Paleo'];

// ─── Mock AI Response ─────────────────────────────────────────────────────────
const MOCK_PLAN = {
  plan_title: 'Personalized Weight Loss Plan — Diabetic Safe',
  total_calories: 1780,
  total_protein_g: 118,
  total_carbs_g: 186,
  total_fat_g: 58,
  rationale: 'This plan is designed for gradual weight loss (−0.5kg/week) while managing blood sugar. All foods have a low-to-moderate glycemic index. Carbohydrates are distributed evenly across meals to prevent glucose spikes. High protein content preserves muscle mass during the deficit.',
  warnings: [
    'Banana has been limited to half-portion due to Diabetes Type 2.',
    'No refined grains or added sugars in this plan.',
  ],
  shopping_list: [
    'Rolled Oats (500g)', 'Greek Yogurt (500g)', 'Almonds (100g)', 'Banana (3 medium)',
    'Brown Rice (500g)', 'Paneer (200g)', 'Spinach (250g)', 'Moong Dal (400g)',
    'Chicken Breast (400g)', 'Sweet Potato (300g)',
  ],
  meals: [
    {
      meal_type: 'breakfast', time: '8:00 AM', meal_calories: 476,
      foods: [
        { food_name: 'Rolled Oats', quantity: 80, unit: 'g', calories: 311, protein_g: 13.5, carbs_g: 53, fat_g: 5.5, is_flagged: false, flag_reason: null, alternative: null },
        { food_name: 'Greek Yogurt (Full Fat)', quantity: 100, unit: 'g', calories: 97, protein_g: 9, carbs_g: 3.6, fat_g: 5, is_flagged: false, flag_reason: null, alternative: null },
        { food_name: 'Almonds', quantity: 15, unit: 'g', calories: 87, protein_g: 3.2, carbs_g: 3.2, fat_g: 7.5, is_flagged: false, flag_reason: null, alternative: null },
        { food_name: 'Banana', quantity: 60, unit: 'g', calories: 53, protein_g: 0.7, carbs_g: 14, fat_g: 0.2, is_flagged: true, flag_reason: 'Moderate GI — limited to half portion for Diabetes Type 2', alternative: 'Berries or Apple (lower GI)' },
      ],
    },
    {
      meal_type: 'lunch', time: '1:00 PM', meal_calories: 618,
      foods: [
        { food_name: 'Brown Rice (cooked)', quantity: 150, unit: 'g', calories: 195, protein_g: 4.5, carbs_g: 44.8, fat_g: 1.8, is_flagged: false, flag_reason: null, alternative: null },
        { food_name: 'Paneer', quantity: 100, unit: 'g', calories: 265, protein_g: 18.3, carbs_g: 1.2, fat_g: 20.8, is_flagged: false, flag_reason: null, alternative: null },
        { food_name: 'Spinach', quantity: 80, unit: 'g', calories: 18, protein_g: 2.3, carbs_g: 2.9, fat_g: 0.3, is_flagged: false, flag_reason: null, alternative: null },
        { food_name: 'Moong Dal (cooked)', quantity: 200, unit: 'g', calories: 148, protein_g: 10, carbs_g: 26, fat_g: 0.8, is_flagged: false, flag_reason: null, alternative: null },
      ],
    },
    {
      meal_type: 'snack', time: '4:30 PM', meal_calories: 198,
      foods: [
        { food_name: 'Roasted Peanuts', quantity: 30, unit: 'g', calories: 170, protein_g: 7.7, carbs_g: 4.8, fat_g: 14.8, is_flagged: false, flag_reason: null, alternative: null },
        { food_name: 'Cucumber', quantity: 100, unit: 'g', calories: 16, protein_g: 0.7, carbs_g: 3.6, fat_g: 0.1, is_flagged: false, flag_reason: null, alternative: null },
      ],
    },
    {
      meal_type: 'dinner', time: '8:00 PM', meal_calories: 488,
      foods: [
        { food_name: 'Chicken Breast', quantity: 120, unit: 'g', calories: 198, protein_g: 37.2, carbs_g: 0, fat_g: 4.3, is_flagged: false, flag_reason: null, alternative: null },
        { food_name: 'Sweet Potato', quantity: 150, unit: 'g', calories: 129, protein_g: 2.4, carbs_g: 30.2, fat_g: 0.2, is_flagged: false, flag_reason: null, alternative: null },
        { food_name: 'Mixed Vegetables', quantity: 200, unit: 'g', calories: 60, protein_g: 2.5, carbs_g: 12, fat_g: 0.5, is_flagged: false, flag_reason: null, alternative: null },
      ],
    },
  ],
};

// ─── Intake Form ──────────────────────────────────────────────────────────────
function PlanIntakeForm({ onGenerate }: { onGenerate: () => void }) {
  const [form, setForm] = useState({
    age: '32', gender: 'female', weight: '70', weightUnit: 'kg',
    height: '162', heightUnit: 'cm', diseases: ['Diabetes Type 2'],
    allergies: [] as string[], activityLevel: 'moderate' as ActivityLevel,
    workoutTypes: [] as string[], goal: 'weight-loss' as GoalType,
    foodPref: ['Vegetarian'] as string[], cuisinePref: ['Indian'] as string[],
    mealsPerDay: '4', medications: '',
  });

  function toggle<T>(arr: T[], item: T): T[] {
    return arr.includes(item) ? arr.filter(x => x !== item) : [...arr, item];
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Basic Info */}
      <section>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 700, color: 'white', marginBottom: '16px' }}>
          👤 Basic Information
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '16px' }}>
          <div>
            <label className="label">Age</label>
            <input className="input" type="number" value={form.age} onChange={e => setForm(f => ({ ...f, age: e.target.value }))} />
          </div>
          <div>
            <label className="label">Gender</label>
            <select className="input" value={form.gender} onChange={e => setForm(f => ({ ...f, gender: e.target.value }))}>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="label">Weight ({form.weightUnit})</label>
            <div style={{ display: 'flex', gap: '6px' }}>
              <input className="input" type="number" value={form.weight} onChange={e => setForm(f => ({ ...f, weight: e.target.value }))} />
              <button onClick={() => setForm(f => ({ ...f, weightUnit: f.weightUnit === 'kg' ? 'lbs' : 'kg' }))}
                style={{ padding: '0 10px', borderRadius: '8px', border: '1.5px solid rgba(255,255,255,0.1)', background: 'rgba(15,23,42,0.6)', color: '#64748b', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}>
                {form.weightUnit === 'kg' ? 'lbs' : 'kg'}
              </button>
            </div>
          </div>
          <div>
            <label className="label">Height ({form.heightUnit})</label>
            <div style={{ display: 'flex', gap: '6px' }}>
              <input className="input" type="number" value={form.height} onChange={e => setForm(f => ({ ...f, height: e.target.value }))} />
              <button onClick={() => setForm(f => ({ ...f, heightUnit: f.heightUnit === 'cm' ? 'ft' : 'cm' }))}
                style={{ padding: '0 10px', borderRadius: '8px', border: '1.5px solid rgba(255,255,255,0.1)', background: 'rgba(15,23,42,0.6)', color: '#64748b', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}>
                {form.heightUnit === 'cm' ? 'ft' : 'cm'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Goal */}
      <section>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 700, color: 'white', marginBottom: '16px' }}>
          🎯 Primary Goal
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '10px' }}>
          {[
            { id: 'weight-loss', label: 'Weight Loss', icon: '⚡' },
            { id: 'weight-gain', label: 'Weight Gain', icon: '📈' },
            { id: 'muscle-gain', label: 'Muscle Gain', icon: '💪' },
            { id: 'maintenance', label: 'Maintenance', icon: '⚖️' },
            { id: 'medical', label: 'Medical', icon: '⚕️' },
            { id: 'general-health', label: 'General Health', icon: '🌿' },
          ].map(g => (
            <button key={g.id} onClick={() => setForm(f => ({ ...f, goal: g.id as GoalType }))}
              style={{
                padding: '12px 16px', borderRadius: '10px', cursor: 'pointer', textAlign: 'left',
                background: form.goal === g.id ? 'rgba(16,185,129,0.12)' : 'rgba(30,41,59,0.5)',
                border: form.goal === g.id ? '1.5px solid #10b981' : '1.5px solid rgba(255,255,255,0.08)',
                color: form.goal === g.id ? '#10b981' : '#94a3b8', fontSize: '13px', fontWeight: 600,
                transition: 'all 0.2s',
              }}>
              <span style={{ fontSize: '18px', display: 'block', marginBottom: '4px' }}>{g.icon}</span>
              {g.label}
            </button>
          ))}
        </div>
      </section>

      {/* Activity */}
      <section>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 700, color: 'white', marginBottom: '16px' }}>
          🏃 Activity Level
        </h3>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {[
            { id: 'sedentary', label: 'Sedentary', desc: 'Desk job, no exercise' },
            { id: 'light', label: 'Light', desc: '1–3 days/week' },
            { id: 'moderate', label: 'Moderate', desc: '3–5 days/week' },
            { id: 'active', label: 'Active', desc: '6–7 days/week' },
            { id: 'very-active', label: 'Very Active', desc: '2x/day, athletic' },
          ].map(a => (
            <button key={a.id} onClick={() => setForm(f => ({ ...f, activityLevel: a.id as ActivityLevel }))}
              style={{
                padding: '10px 16px', borderRadius: '10px', cursor: 'pointer',
                background: form.activityLevel === a.id ? 'rgba(245,158,11,0.12)' : 'rgba(30,41,59,0.5)',
                border: form.activityLevel === a.id ? '1.5px solid #f59e0b' : '1.5px solid rgba(255,255,255,0.08)',
                color: form.activityLevel === a.id ? '#fbbf24' : '#64748b', fontSize: '13px',
                transition: 'all 0.2s', textAlign: 'left',
              }}>
              <div style={{ fontWeight: 600, marginBottom: '2px' }}>{a.label}</div>
              <div style={{ fontSize: '11px', opacity: 0.7 }}>{a.desc}</div>
            </button>
          ))}
        </div>
      </section>

      {/* Diseases */}
      <section>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 700, color: 'white', marginBottom: '16px' }}>
          ⚕️ Health Conditions
        </h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {DISEASES.map(d => (
            <button key={d} onClick={() => setForm(f => ({ ...f, diseases: toggle(f.diseases, d) }))}
              style={{
                padding: '6px 14px', borderRadius: '100px', cursor: 'pointer',
                background: form.diseases.includes(d) ? 'rgba(245,158,11,0.15)' : 'rgba(30,41,59,0.6)',
                border: form.diseases.includes(d) ? '1.5px solid #f59e0b' : '1.5px solid rgba(255,255,255,0.08)',
                color: form.diseases.includes(d) ? '#fbbf24' : '#64748b',
                fontSize: '12px', fontWeight: 500, transition: 'all 0.2s',
              }}>
              {d}
            </button>
          ))}
        </div>
      </section>

      {/* Allergies */}
      <section>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 700, color: 'white', marginBottom: '16px' }}>
          ⚠️ Allergies
        </h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {ALLERGIES.map(a => (
            <button key={a} onClick={() => setForm(f => ({ ...f, allergies: toggle(f.allergies, a) }))}
              style={{
                padding: '6px 14px', borderRadius: '100px', cursor: 'pointer',
                background: form.allergies.includes(a) ? 'rgba(220,38,38,0.15)' : 'rgba(30,41,59,0.6)',
                border: form.allergies.includes(a) ? '1.5px solid #dc2626' : '1.5px solid rgba(255,255,255,0.08)',
                color: form.allergies.includes(a) ? '#f87171' : '#64748b',
                fontSize: '12px', fontWeight: 500, transition: 'all 0.2s',
              }}>
              {a}
            </button>
          ))}
        </div>
      </section>

      {/* Food Preferences */}
      <section>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 700, color: 'white', marginBottom: '16px' }}>
              🥗 Food Preference
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {FOOD_PREFS.map(p => (
                <button key={p} onClick={() => setForm(f => ({ ...f, foodPref: toggle(f.foodPref, p) }))}
                  style={{
                    padding: '6px 14px', borderRadius: '100px', cursor: 'pointer',
                    background: form.foodPref.includes(p) ? 'rgba(16,185,129,0.15)' : 'rgba(30,41,59,0.6)',
                    border: form.foodPref.includes(p) ? '1.5px solid #10b981' : '1.5px solid rgba(255,255,255,0.08)',
                    color: form.foodPref.includes(p) ? '#34d399' : '#64748b',
                    fontSize: '12px', fontWeight: 500, transition: 'all 0.2s',
                  }}>
                  {p}
                </button>
              ))}
            </div>
          </div>
          <div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 700, color: 'white', marginBottom: '16px' }}>
              🍛 Cuisine Preference
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {CUISINE_PREFS.map(c => (
                <button key={c} onClick={() => setForm(f => ({ ...f, cuisinePref: toggle(f.cuisinePref, c) }))}
                  style={{
                    padding: '6px 14px', borderRadius: '100px', cursor: 'pointer',
                    background: form.cuisinePref.includes(c) ? 'rgba(99,102,241,0.15)' : 'rgba(30,41,59,0.6)',
                    border: form.cuisinePref.includes(c) ? '1.5px solid #6366f1' : '1.5px solid rgba(255,255,255,0.08)',
                    color: form.cuisinePref.includes(c) ? '#818cf8' : '#64748b',
                    fontSize: '12px', fontWeight: 500, transition: 'all 0.2s',
                  }}>
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Meals per day & Medications */}
      <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <div>
          <label className="label">Meals per Day</label>
          <select className="input" value={form.mealsPerDay} onChange={e => setForm(f => ({ ...f, mealsPerDay: e.target.value }))}>
            <option value="3">3 meals</option>
            <option value="4">4 meals (with snack)</option>
            <option value="5">5 meals</option>
            <option value="6">6 meals</option>
          </select>
        </div>
        <div>
          <label className="label">Current Medications (optional)</label>
          <input className="input" value={form.medications} placeholder="e.g., Metformin 500mg..."
            onChange={e => setForm(f => ({ ...f, medications: e.target.value }))} />
        </div>
      </section>

      {/* Generate Button */}
      <button className="btn btn-primary btn-lg" onClick={onGenerate}
        style={{ width: '100%', justifyContent: 'center', fontSize: '18px', padding: '18px' }}>
        <Brain size={22} />
        Generate My AI Diet Plan
      </button>
    </div>
  );
}

// ─── Plan Display ─────────────────────────────────────────────────────────────
function PlanDisplay({ plan }: { plan: typeof MOCK_PLAN }) {
  const mealIcons: Record<string, string> = {
    breakfast: '🌅', lunch: '☀️', snack: '🍎', dinner: '🌙'
  };

  return (
    <div>
      {/* Plan Header */}
      <div className="glass-emerald" style={{ padding: '28px', borderRadius: '16px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 800, color: 'white', marginBottom: '8px' }}>
              {plan.plan_title}
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: 1.7, maxWidth: '600px' }}>
              {plan.rationale}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px', flexShrink: 0 }}>
            <button className="btn btn-ghost btn-sm"><RotateCcw size={14} /> Reset</button>
            <button className="btn btn-outline btn-sm"><Download size={14} /> Export PDF</button>
          </div>
        </div>

        {/* Macro Summary */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginTop: '24px' }}>
          {[
            { label: 'Calories', value: plan.total_calories, unit: 'kcal', color: '#10b981' },
            { label: 'Protein', value: plan.total_protein_g, unit: 'g', color: '#6366f1' },
            { label: 'Carbs', value: plan.total_carbs_g, unit: 'g', color: '#f59e0b' },
            { label: 'Fat', value: plan.total_fat_g, unit: 'g', color: '#ec4899' },
          ].map(m => (
            <div key={m.label} style={{ textAlign: 'center', padding: '16px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '26px', fontWeight: 700, color: m.color }}>
                {m.value}
                <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 400 }}>{m.unit}</span>
              </div>
              <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>{m.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Warnings */}
      {plan.warnings.length > 0 && (
        <div style={{ padding: '16px 20px', borderRadius: '12px', marginBottom: '20px',
          background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#fbbf24', marginBottom: '8px' }}>
            ⚠️ Plan Adjustments
          </div>
          {plan.warnings.map((w, i) => (
            <div key={i} style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '4px' }}>• {w}</div>
          ))}
        </div>
      )}

      {/* Meals */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {plan.meals.map(meal => (
          <div key={meal.meal_type} className="card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <span style={{ fontSize: '24px' }}>{mealIcons[meal.meal_type]}</span>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '16px', color: 'white', textTransform: 'capitalize' }}>
                    {meal.meal_type}
                  </div>
                  <div style={{ fontSize: '12px', color: '#475569' }}>{meal.time}</div>
                </div>
              </div>
              <span className="badge badge-emerald">{meal.meal_calories} kcal</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {meal.foods.map(food => (
                <div key={food.food_name}
                  style={{
                    padding: '12px 16px', borderRadius: '10px',
                    background: food.is_flagged ? 'rgba(245,158,11,0.08)' : 'rgba(255,255,255,0.03)',
                    border: food.is_flagged ? '1px solid rgba(245,158,11,0.2)' : '1px solid rgba(255,255,255,0.06)',
                  }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      {food.is_flagged && <span style={{ fontSize: '14px' }}>⚠️</span>}
                      <span style={{ fontSize: '14px', fontWeight: 600, color: 'white' }}>{food.food_name}</span>
                      <span style={{ fontSize: '12px', color: '#475569' }}>{food.quantity}{food.unit}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '16px', fontFamily: 'var(--font-mono)', fontSize: '12px' }}>
                      <span style={{ color: '#10b981' }}>{food.calories} kcal</span>
                      <span style={{ color: '#6366f1' }}>P: {food.protein_g}g</span>
                      <span style={{ color: '#f59e0b' }}>C: {food.carbs_g}g</span>
                      <span style={{ color: '#ec4899' }}>F: {food.fat_g}g</span>
                    </div>
                  </div>
                  {food.is_flagged && (
                    <div style={{ marginTop: '8px', paddingLeft: '22px' }}>
                      <div style={{ fontSize: '12px', color: '#fbbf24' }}>⚠️ {food.flag_reason}</div>
                      {food.alternative && (
                        <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>
                          ✨ Alternative: {food.alternative}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Shopping List */}
      <div className="card" style={{ padding: '24px', marginTop: '24px' }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 700, color: 'white', marginBottom: '16px' }}>
          🛒 Shopping List
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '8px' }}>
          {plan.shopping_list.map(item => (
            <div key={item} style={{
              display: 'flex', gap: '8px', alignItems: 'center',
              padding: '8px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.03)',
              fontSize: '13px', color: '#94a3b8',
            }}>
              <Check size={14} color="#10b981" />
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Generate Page ─────────────────────────────────────────────────────────────
export default function GeneratePlanPage() {
  const [state, setState] = useState<'form' | 'generating' | 'plan'>('form');
  const [generationStep, setGenerationStep] = useState(0);

  const STEPS = [
    'Analyzing your health profile...',
    'Checking disease-food interactions...',
    'Optimizing macro targets...',
    'Selecting safe foods from database...',
    'Building your personalized plan...',
  ];

  const handleGenerate = () => {
    setState('generating');
    let step = 0;
    const interval = setInterval(() => {
      step++;
      setGenerationStep(step);
      if (step >= STEPS.length) {
        clearInterval(interval);
        setTimeout(() => setState('plan'), 500);
      }
    }, 700);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0a0f1e', padding: '40px 24px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '40px' }}>
          <Link href="/dashboard" className="btn btn-ghost btn-sm">
            <ChevronLeft size={16} /> Dashboard
          </Link>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 800, color: 'white' }}>
              AI Diet Plan Generator
            </h1>
            <p style={{ color: '#64748b', fontSize: '14px' }}>
              Powered by Qwen via OpenRouter · 2 plans remaining today
            </p>
          </div>
        </div>

        {/* Form State */}
        {state === 'form' && (
          <div className="card" style={{ padding: '32px' }}>
            <PlanIntakeForm onGenerate={handleGenerate} />
          </div>
        )}

        {/* Generating State */}
        {state === 'generating' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '100px 40px', textAlign: 'center' }}>
            <div style={{
              width: '80px', height: '80px', borderRadius: '24px', marginBottom: '32px',
              background: 'linear-gradient(135deg, #065f46, #10b981)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 40px rgba(16,185,129,0.4)',
              animation: 'pulse-glow 2s ease-in-out infinite',
            }}>
              <Brain size={40} color="white" />
            </div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 800, color: 'white', marginBottom: '12px' }}>
              Generating Your Plan...
            </h2>
            <p style={{ color: '#10b981', fontSize: '15px', marginBottom: '40px' }}>
              {STEPS[Math.min(generationStep, STEPS.length - 1)]}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', maxWidth: '400px' }}>
              {STEPS.map((step, i) => (
                <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <div style={{
                    width: '20px', height: '20px', borderRadius: '50%', flexShrink: 0,
                    background: i < generationStep ? '#10b981' : i === generationStep - 1 ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.08)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.3s',
                  }}>
                    {i < generationStep && <Check size={12} color="white" />}
                  </div>
                  <span style={{ fontSize: '13px', color: i < generationStep ? '#34d399' : i === generationStep - 1 ? '#10b981' : '#475569', transition: 'all 0.3s' }}>
                    {step}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Plan Display */}
        {state === 'plan' && (
          <div>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
              <button className="btn btn-ghost btn-sm" onClick={() => setState('form')}>
                <ChevronLeft size={14} /> Regenerate
              </button>
              <div style={{ padding: '6px 12px', borderRadius: '8px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}>
                <span style={{ fontSize: '12px', color: '#10b981' }}>✓ Plan generated successfully</span>
              </div>
            </div>
            <PlanDisplay plan={MOCK_PLAN} />
          </div>
        )}
      </div>
    </div>
  );
}

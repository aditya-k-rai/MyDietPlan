'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  TrendingUp, Award, Flame, Droplets, Activity, Check, Plus,
  ChevronLeft, Calendar, Shield, Sparkles, Scale, RefreshCw,
  Bell, User, Settings, Apple, BarChart2, Leaf
} from 'lucide-react';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid
} from 'recharts';

// ─── Design Sidebar ─────────────────────────────────────────────────────────────
function Sidebar({ active }: { active: string }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <Activity size={18} />, href: '/dashboard' },
    { id: 'plan', label: 'My Diet Plan', icon: <Leaf size={18} />, href: '/plan/generate' },
    { id: 'food', label: 'Food Database', icon: <Apple size={18} />, href: '/food' },
    { id: 'calculators', label: 'Calculators', icon: <BarChart2 size={18} />, href: '/calculators' },
    { id: 'calendar', label: 'Meal Calendar', icon: <Calendar size={18} />, href: '/calendar' },
    { id: 'progress', label: 'Progress', icon: <TrendingUp size={18} />, href: '/progress' },
  ];

  return (
    <aside style={{
      width: '240px', flexShrink: 0,
      background: 'rgba(15,23,42,0.8)', borderRight: '1px solid rgba(255,255,255,0.07)',
      display: 'flex', flexDirection: 'column',
      backdropFilter: 'blur(20px)',
      minHeight: '100vh', position: 'sticky', top: 0,
    }}>
      {/* Logo */}
      <div style={{ padding: '24px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '8px',
            background: 'linear-gradient(135deg, #065f46, #10b981)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Leaf size={16} color="white" />
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '18px', color: 'white' }}>
            Nutri<span className="text-gradient-emerald">AI</span>
          </span>
        </Link>
      </div>

      {/* Nav */}
      <nav style={{ padding: '16px 12px', flex: 1 }}>
        <div style={{ fontSize: '10px', fontWeight: 700, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.1em', padding: '0 8px 10px' }}>
          Main Menu
        </div>
        {navItems.map(item => (
          <Link key={item.id} href={item.href}
            style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '10px 12px', borderRadius: '10px', marginBottom: '2px',
              background: active === item.id ? 'rgba(16,185,129,0.12)' : 'transparent',
              border: active === item.id ? '1px solid rgba(16,185,129,0.2)' : '1px solid transparent',
              color: active === item.id ? '#10b981' : '#64748b',
              textDecoration: 'none', fontSize: '14px', fontWeight: 500,
              transition: 'all 0.2s',
            }}
          >
            {item.icon}
            {item.label}
          </Link>
        ))}

        <div className="divider" style={{ margin: '16px 0' }} />
        <div style={{ fontSize: '10px', fontWeight: 700, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.1em', padding: '0 8px 10px' }}>
          Account
        </div>
        {[
          { label: 'Profile', icon: <User size={16} />, href: '/profile' },
          { label: 'Settings', icon: <Settings size={16} />, href: '/settings' },
        ].map(item => (
          <Link key={item.label} href={item.href}
            style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '10px 12px', borderRadius: '10px', marginBottom: '2px',
              color: '#64748b', textDecoration: 'none', fontSize: '14px', fontWeight: 500,
              transition: 'all 0.2s',
            }}>
            {item.icon}
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}

// ─── Initial Meal Tracker Data ────────────────────────────────────────────────
const INITIAL_MEALS = [
  {
    meal: 'Breakfast', time: '8:00 AM',
    items: [
      { id: 'b1', name: 'Rolled Oats (80g)', cal: 311, p: 13.5, c: 53, f: 5.5, done: true },
      { id: 'b2', name: 'Greek Yogurt (100g)', cal: 97, p: 9.0, c: 3.6, f: 5.0, done: true },
      { id: 'b3', name: 'Almonds (15g)', cal: 87, p: 3.2, c: 3.2, f: 7.5, done: true },
    ]
  },
  {
    meal: 'Lunch', time: '1:00 PM',
    items: [
      { id: 'l1', name: 'Brown Rice (150g)', cal: 195, p: 4.5, c: 44.8, f: 1.8, done: true },
      { id: 'l2', name: 'Paneer Bhurji (100g)', cal: 265, p: 18.3, c: 1.2, f: 20.8, done: true },
      { id: 'l3', name: 'Spinach Dal (200g)', cal: 160, p: 10.0, c: 26.0, f: 0.8, done: false },
    ]
  },
  {
    meal: 'Snack', time: '4:30 PM',
    items: [
      { id: 's1', name: 'Roasted Chana (40g)', cal: 162, p: 8.0, c: 24.0, f: 2.5, done: false },
      { id: 's2', name: 'Green Tea (1 cup)', cal: 2, p: 0.1, c: 0.0, f: 0.0, done: false },
    ]
  },
  {
    meal: 'Dinner', time: '8:00 PM',
    items: [
      { id: 'd1', name: 'Moong Dal (200g)', cal: 148, p: 10.0, c: 26.0, f: 0.8, done: false },
      { id: 'd2', name: 'Roti - Wheat (2 pcs)', cal: 200, p: 6.8, c: 40.0, f: 2.4, done: false },
      { id: 'd3', name: 'Mixed Vegetables (150g)', cal: 75, p: 2.5, c: 15.0, f: 0.5, done: false },
    ]
  },
];

const INITIAL_CHART_DATA = [
  { day: 'Mon', calories: 1720, target: 1750, weight: 74.8 },
  { day: 'Tue', calories: 1680, target: 1750, weight: 74.6 },
  { day: 'Wed', calories: 1810, target: 1750, weight: 74.5 },
  { day: 'Thu', calories: 1740, target: 1750, weight: 74.3 },
  { day: 'Fri', calories: 1700, target: 1750, weight: 74.1 },
  { day: 'Sat', calories: 1650, target: 1750, weight: 73.9 },
  { day: 'Sun', calories: 1710, target: 1750, weight: 73.8 },
];

export default function ProgressPage() {
  const [meals, setMeals] = useState(INITIAL_MEALS);
  const [waterMl, setWaterMl] = useState(1500);
  const [newWeight, setNewWeight] = useState('73.8');
  const [weightLogged, setWeightLogged] = useState(false);
  const [chartData, setChartData] = useState(INITIAL_CHART_DATA);

  // Load any stored progress from localStorage
  useEffect(() => {
    try {
      const savedWater = localStorage.getItem('nutriai_water');
      if (savedWater) setWaterMl(parseInt(savedWater, 10));
      const savedMeals = localStorage.getItem('nutriai_progress_meals');
      if (savedMeals) setMeals(JSON.parse(savedMeals));
    } catch (e) {
      // safe fallback
    }
  }, []);

  const toggleItem = (mealIdx: number, itemIdx: number) => {
    setMeals(prev => {
      const copy = JSON.parse(JSON.stringify(prev));
      copy[mealIdx].items[itemIdx].done = !copy[mealIdx].items[itemIdx].done;
      try {
        localStorage.setItem('nutriai_progress_meals', JSON.stringify(copy));
      } catch (e) {}
      return copy;
    });
  };

  const addWater = (amount: number) => {
    setWaterMl(w => {
      const next = Math.max(0, w + amount);
      try {
        localStorage.setItem('nutriai_water', next.toString());
      } catch (e) {}
      return next;
    });
  };

  const logWeight = () => {
    const val = parseFloat(newWeight);
    if (!isNaN(val) && val > 30 && val < 300) {
      setChartData(prev => {
        const copy = [...prev];
        copy[copy.length - 1].weight = val;
        return copy;
      });
      setWeightLogged(true);
      setTimeout(() => setWeightLogged(false), 2500);
    }
  };

  // Calculate live statistics
  const allItems = meals.flatMap(m => m.items);
  const consumedItems = allItems.filter(i => i.done);
  const consumedCal = consumedItems.reduce((acc, i) => acc + i.cal, 0);
  const totalCal = allItems.reduce((acc, i) => acc + i.cal, 0);
  const consumedP = consumedItems.reduce((acc, i) => acc + i.p, 0);
  const consumedC = consumedItems.reduce((acc, i) => acc + i.c, 0);
  const consumedF = consumedItems.reduce((acc, i) => acc + i.f, 0);

  const compliancePct = Math.round((consumedItems.length / Math.max(1, allItems.length)) * 100);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0a0f1e', color: '#e2e8f0' }}>
      <Sidebar active="progress" />

      <main style={{ flex: 1, overflow: 'auto', paddingBottom: '80px' }}>
        {/* Top Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '20px 32px', borderBottom: '1px solid rgba(255,255,255,0.06)',
          background: 'rgba(15,23,42,0.5)', backdropFilter: 'blur(20px)',
          position: 'sticky', top: 0, zIndex: 10,
        }}>
          <div>
            <h1 style={{ fontSize: '24px', fontFamily: 'var(--font-display)', fontWeight: 800, color: 'white' }}>
              Daily Progress & Health Tracking 📈
            </h1>
            <p style={{ fontSize: '13px', color: '#64748b' }}>
              Tick off meals, track caloric compliance, and record body metrics
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div className="badge badge-emerald" style={{ padding: '6px 14px', fontSize: '13px' }}>
              🔥 5-Day Streak
            </div>
            <Link href="/plan/generate" className="btn btn-primary btn-sm">
              <Plus size={14} /> New Plan
            </Link>
          </div>
        </div>

        <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>
          {/* Top Metric Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '28px' }}>
            <div className="card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '12px', color: '#64748b' }}>Calories Logged</span>
                <Flame size={18} color="#10b981" />
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '28px', fontWeight: 800, color: '#10b981' }}>
                {consumedCal.toLocaleString()}
                <span style={{ fontSize: '13px', color: '#475569', marginLeft: '4px' }}>/ {totalCal} kcal</span>
              </div>
              <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>
                {totalCal - consumedCal} kcal remaining today
              </div>
            </div>

            <div className="card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '12px', color: '#64748b' }}>Diet Compliance</span>
                <Award size={18} color="#f59e0b" />
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '28px', fontWeight: 800, color: '#f59e0b' }}>
                {compliancePct}%
              </div>
              <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>
                {consumedItems.length} of {allItems.length} meal items ticked
              </div>
            </div>

            <div className="card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '12px', color: '#64748b' }}>Water Hydration</span>
                <Droplets size={18} color="#38bdf8" />
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '28px', fontWeight: 800, color: '#38bdf8' }}>
                {(waterMl / 1000).toFixed(1)}L
                <span style={{ fontSize: '13px', color: '#475569', marginLeft: '4px' }}>/ 2.5L</span>
              </div>
              <div style={{ display: 'flex', gap: '6px', marginTop: '8px' }}>
                <button onClick={() => addWater(250)} className="btn btn-outline btn-sm" style={{ padding: '2px 8px', fontSize: '11px' }}>
                  +250ml
                </button>
                <button onClick={() => addWater(-250)} className="btn btn-ghost btn-sm" style={{ padding: '2px 8px', fontSize: '11px' }}>
                  -250ml
                </button>
              </div>
            </div>

            <div className="card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '12px', color: '#64748b' }}>Current Weight</span>
                <Scale size={18} color="#a855f7" />
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '28px', fontWeight: 800, color: '#a855f7' }}>
                {chartData[chartData.length - 1].weight}kg
              </div>
              <div style={{ fontSize: '11px', color: '#10b981', marginTop: '4px' }}>
                📉 −1.0kg over 7 days
              </div>
            </div>
          </div>

          {/* Macro Breakdown Row */}
          <div className="card glass-emerald" style={{ padding: '20px 28px', borderRadius: '16px', marginBottom: '28px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', textAlign: 'center' }}>
              <div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>Protein Consumed</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '24px', fontWeight: 700, color: '#6366f1' }}>
                  {consumedP.toFixed(1)}g
                </div>
                <div className="progress-bar-track" style={{ marginTop: '8px' }}>
                  <div className="progress-bar-fill" style={{ width: `${Math.min(100, (consumedP / 118) * 100)}%`, background: '#6366f1' }} />
                </div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>Carbs Consumed</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '24px', fontWeight: 700, color: '#f59e0b' }}>
                  {consumedC.toFixed(1)}g
                </div>
                <div className="progress-bar-track" style={{ marginTop: '8px' }}>
                  <div className="progress-bar-fill" style={{ width: `${Math.min(100, (consumedC / 186) * 100)}%`, background: '#f59e0b' }} />
                </div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>Fat Consumed</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '24px', fontWeight: 700, color: '#ec4899' }}>
                  {consumedF.toFixed(1)}g
                </div>
                <div className="progress-bar-track" style={{ marginTop: '8px' }}>
                  <div className="progress-bar-fill" style={{ width: `${Math.min(100, (consumedF / 58) * 100)}%`, background: '#ec4899' }} />
                </div>
              </div>
            </div>
          </div>

          {/* 7-Day Chart & Weight Logging */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '32px' }}>
            <div className="card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 700, color: 'white' }}>
                  7-Day Caloric Compliance
                </h3>
                <span className="badge badge-emerald">Target: 1,750 kcal</span>
              </div>
              <div style={{ width: '100%', height: '220px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="calGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="day" stroke="#64748b" fontSize={12} />
                    <YAxis stroke="#64748b" fontSize={12} domain={[1400, 2000]} />
                    <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                    <Area type="monotone" dataKey="calories" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#calGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Weight Check-in Logger Card */}
            <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 700, color: 'white', marginBottom: '8px' }}>
                  ⚖️ Weight Check-In
                </h3>
                <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px' }}>
                  Log your morning fasted weight to track progressive body fat reduction.
                </p>
                <div style={{ marginBottom: '16px' }}>
                  <label className="label">Today's Weight (kg)</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="number"
                      step="0.1"
                      className="input"
                      value={newWeight}
                      onChange={e => setNewWeight(e.target.value)}
                    />
                    <button className="btn btn-primary" onClick={logWeight}>
                      Save
                    </button>
                  </div>
                </div>
                {weightLogged && (
                  <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(16,185,129,0.1)', color: '#10b981', fontSize: '12px', textAlign: 'center' }}>
                    ✓ Weight logged successfully!
                  </div>
                )}
              </div>
              <div style={{ padding: '14px', borderRadius: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ fontSize: '12px', color: '#94a3b8' }}>Weekly Delta</div>
                <div style={{ fontSize: '16px', fontWeight: 700, color: '#10b981', marginTop: '2px' }}>
                  −1.0 kg (Healthy deficit pace)
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Food Checklist for Today */}
          <div className="card" style={{ padding: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 800, color: 'white' }}>
                  Today's Meal Completion Checklist
                </h3>
                <p style={{ fontSize: '13px', color: '#64748b' }}>
                  Tap any item when consumed. Macros recalculate in real-time.
                </p>
              </div>
              <button
                onClick={() => {
                  setMeals(INITIAL_MEALS);
                  try { localStorage.removeItem('nutriai_progress_meals'); } catch (e) {}
                }}
                className="btn btn-ghost btn-sm"
              >
                <RefreshCw size={14} /> Reset Day
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {meals.map((meal, mIdx) => (
                <div key={meal.meal} style={{ padding: '16px', borderRadius: '14px', background: 'rgba(30,41,59,0.4)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '18px' }}>
                        {meal.meal === 'Breakfast' ? '🌅' : meal.meal === 'Lunch' ? '☀️' : meal.meal === 'Snack' ? '🍎' : '🌙'}
                      </span>
                      <span style={{ fontWeight: 700, fontSize: '16px', color: 'white' }}>{meal.meal}</span>
                      <span style={{ fontSize: '12px', color: '#64748b' }}>{meal.time}</span>
                    </div>
                    <span className="badge badge-emerald">
                      {meal.items.filter(i => i.done).length} / {meal.items.length} eaten
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {meal.items.map((item, iIdx) => (
                      <div
                        key={item.id}
                        onClick={() => toggleItem(mIdx, iIdx)}
                        style={{
                          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                          padding: '12px 16px', borderRadius: '10px', cursor: 'pointer',
                          background: item.done ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.03)',
                          border: item.done ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(255,255,255,0.05)',
                          transition: 'all 0.2s',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{
                            width: '22px', height: '22px', borderRadius: '6px',
                            background: item.done ? '#10b981' : 'rgba(255,255,255,0.08)',
                            border: item.done ? 'none' : '1px solid rgba(255,255,255,0.2)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: 'white', fontSize: '14px', flexShrink: 0,
                          }}>
                            {item.done && <Check size={14} />}
                          </div>
                          <div>
                            <span style={{
                              fontSize: '14px', fontWeight: 600,
                              color: item.done ? '#94a3b8' : 'white',
                              textDecoration: item.done ? 'line-through' : 'none',
                            }}>
                              {item.name}
                            </span>
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: '16px', fontSize: '12px', fontFamily: 'var(--font-mono)' }}>
                          <span style={{ color: '#10b981' }}>{item.cal} kcal</span>
                          <span style={{ color: '#6366f1' }}>P:{item.p}g</span>
                          <span style={{ color: '#f59e0b' }}>C:{item.c}g</span>
                          <span style={{ color: '#ec4899' }}>F:{item.f}g</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

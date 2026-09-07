'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  Leaf, Flame, Droplets, Activity, Brain, Calendar, BarChart2,
  ChevronRight, Bell, Settings, User, LogOut, Search, Plus,
  TrendingUp, Award, Zap, Apple, Clock, ArrowRight, AlertTriangle
} from 'lucide-react';

// ─── Mock User Profile ─────────────────────────────────────────────────────────
const MOCK_USER = {
  name: 'Demo User',
  goal: 'Weight Loss',
  diseases: ['Diabetes Type 2'],
  allergies: ['Peanuts'],
  tdee: 1800,
  targetCalories: 1300,
  protein: 120,
  carbs: 140,
  fat: 45,
  plansRemaining: 2,
  premiumExpiry: null,
};

const TODAY_PLAN = {
  totalCalories: 1780,
  consumed: 1260,
  protein: { target: 120, consumed: 87 },
  carbs: { target: 140, consumed: 98 },
  fat: { target: 45, consumed: 34 },
  water: { target: 2500, consumed: 1200 },
  meals: [
    {
      type: 'Breakfast', time: '8:00 AM', done: true, calories: 480,
      foods: [
        { name: 'Rolled Oats', qty: '80g', cal: 311 },
        { name: 'Greek Yogurt', qty: '100g', cal: 97 },
        { name: 'Almonds', qty: '15g', cal: 87 },
      ],
    },
    {
      type: 'Lunch', time: '1:00 PM', done: true, calories: 620,
      foods: [
        { name: 'Brown Rice', qty: '150g', cal: 195 },
        { name: 'Paneer Bhurji', qty: '100g', cal: 265 },
        { name: 'Spinach Dal', qty: '200g', cal: 160 },
      ],
    },
    {
      type: 'Snack', time: '4:30 PM', done: false, calories: 200,
      foods: [
        { name: 'Roasted Chana', qty: '40g', cal: 162 },
        { name: 'Green Tea', qty: '1 cup', cal: 2 },
      ],
    },
    {
      type: 'Dinner', time: '8:00 PM', done: false, calories: 480,
      foods: [
        { name: 'Moong Dal', qty: '200g', cal: 148 },
        { name: 'Roti (Wheat)', qty: '2 pcs', cal: 200 },
        { name: 'Mixed Vegetables', qty: '150g', cal: 75 },
      ],
    },
  ],
};

// ─── Circular Progress Ring ────────────────────────────────────────────────────
function CalorieRing({ consumed, target }: { consumed: number; target: number }) {
  const pct = Math.min((consumed / target) * 100, 100);
  const r = 70;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;

  return (
    <div style={{ position: 'relative', width: '180px', height: '180px', flexShrink: 0 }}>
      <svg width="180" height="180" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="90" cy="90" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="12" />
        <circle cx="90" cy="90" r={r} fill="none"
          stroke="url(#emerald-grad)" strokeWidth="12" strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={circ - dash}
          style={{ transition: 'stroke-dashoffset 1s ease' }}
        />
        <defs>
          <linearGradient id="emerald-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#065f46" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
        </defs>
      </svg>
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '28px', fontWeight: 700, color: 'white' }}>
          {consumed.toLocaleString()}
        </div>
        <div style={{ fontSize: '12px', color: '#64748b' }}>of {target.toLocaleString()} kcal</div>
        <div style={{ fontSize: '11px', color: '#10b981', fontWeight: 600, marginTop: '2px' }}>
          {Math.round(pct)}% done
        </div>
      </div>
    </div>
  );
}

// ─── Sidebar ───────────────────────────────────────────────────────────────────
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
            onMouseOver={e => { if (active !== item.id) (e.currentTarget as HTMLElement).style.color = '#94a3b8'; }}
            onMouseOut={e => { if (active !== item.id) (e.currentTarget as HTMLElement).style.color = '#64748b'; }}
          >
            {item.icon}
            {item.label}
          </Link>
        ))}

        {/* Divider */}
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

      {/* AI Limit Widget */}
      <div style={{ padding: '16px', margin: '0 12px 16px', borderRadius: '12px',
        background: 'rgba(6,95,70,0.12)', border: '1px solid rgba(16,185,129,0.15)' }}>
        <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '6px' }}>AI Plans Today</div>
        <div style={{ display: 'flex', gap: '4px', marginBottom: '8px' }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{
              flex: 1, height: '6px', borderRadius: '100px',
              background: i < (3 - MOCK_USER.plansRemaining) ? '#10b981' : 'rgba(255,255,255,0.1)',
            }} />
          ))}
        </div>
        <div style={{ fontSize: '11px', color: '#64748b' }}>
          {MOCK_USER.plansRemaining} of 3 remaining today
        </div>
      </div>
    </aside>
  );
}

// ─── Dashboard Layout ──────────────────────────────────────────────────────────
export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');

  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0a0f1e' }}>
      <Sidebar active="dashboard" />

      {/* Main Content */}
      <main style={{ flex: 1, overflow: 'auto' }}>
        {/* Top Bar */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '20px 32px', borderBottom: '1px solid rgba(255,255,255,0.06)',
          background: 'rgba(15,23,42,0.5)', backdropFilter: 'blur(20px)',
          position: 'sticky', top: 0, zIndex: 10,
        }}>
          <div>
            <div style={{ fontSize: '22px', fontFamily: 'var(--font-display)', fontWeight: 700, color: 'white' }}>
              {greeting}, {MOCK_USER.name.split(' ')[0]}! 👋
            </div>
            <div style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>
              {now.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <Link href="/plan/generate" className="btn btn-primary btn-sm">
              <Plus size={14} /> New Plan
            </Link>
            <button style={{
              width: '38px', height: '38px', borderRadius: '10px',
              background: 'rgba(30,41,59,0.6)', border: '1px solid rgba(255,255,255,0.08)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: '#64748b',
            }}>
              <Bell size={16} />
            </button>
            <div style={{
              width: '38px', height: '38px', borderRadius: '10px',
              background: 'linear-gradient(135deg, #065f46, #10b981)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', fontWeight: 700, color: 'white', fontSize: '14px',
            }}>
              D
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div style={{ padding: '32px' }}>
          {/* Disease Warning */}
          <div style={{
            display: 'flex', gap: '12px', alignItems: 'flex-start',
            padding: '14px 18px', borderRadius: '12px', marginBottom: '28px',
            background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)',
          }}>
            <AlertTriangle size={18} color="#f59e0b" style={{ flexShrink: 0, marginTop: '1px' }} />
            <div style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.6 }}>
              <strong style={{ color: '#fbbf24' }}>Condition active:</strong> Your plan is optimized for{' '}
              <strong style={{ color: '#fbbf24' }}>Diabetes Type 2</strong> — low GI foods, controlled carbs, high fiber.
              Foods are color-coded for your safety.
            </div>
          </div>

          {/* Top Stats Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px', marginBottom: '28px' }}>
            {[
              { label: 'Calories Left', value: `${TODAY_PLAN.totalCalories - TODAY_PLAN.consumed}`, unit: 'kcal', color: '#10b981', icon: <Flame size={18} /> },
              { label: 'Protein', value: `${TODAY_PLAN.protein.consumed}/${TODAY_PLAN.protein.target}`, unit: 'g', color: '#6366f1', icon: <Activity size={18} /> },
              { label: 'Carbs', value: `${TODAY_PLAN.carbs.consumed}/${TODAY_PLAN.carbs.target}`, unit: 'g', color: '#f59e0b', icon: <Zap size={18} /> },
              { label: 'Water', value: `${TODAY_PLAN.water.consumed}`, unit: 'ml', color: '#38bdf8', icon: <Droplets size={18} /> },
            ].map(stat => (
              <div key={stat.label} className="card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 500 }}>{stat.label}</span>
                  <span style={{ color: stat.color }}>{stat.icon}</span>
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '22px', fontWeight: 700, color: stat.color }}>
                  {stat.value}
                  <span style={{ fontSize: '13px', color: '#475569', marginLeft: '4px', fontWeight: 400 }}>{stat.unit}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Main Dashboard Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '24px', marginBottom: '28px' }}>
            {/* Calorie Ring Card */}
            <div className="card" style={{ padding: '28px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#94a3b8', marginBottom: '20px', textAlign: 'center' }}>
                Today's Calories
              </div>
              <CalorieRing consumed={TODAY_PLAN.consumed} target={TODAY_PLAN.totalCalories} />
              <div style={{ marginTop: '20px', width: '100%' }}>
                {[
                  { label: 'Protein', val: TODAY_PLAN.protein.consumed, max: TODAY_PLAN.protein.target, color: '#6366f1' },
                  { label: 'Carbs', val: TODAY_PLAN.carbs.consumed, max: TODAY_PLAN.carbs.target, color: '#f59e0b' },
                  { label: 'Fat', val: TODAY_PLAN.fat.consumed, max: TODAY_PLAN.fat.target, color: '#ec4899' },
                ].map(m => (
                  <div key={m.label} style={{ marginBottom: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontSize: '12px', color: '#64748b' }}>{m.label}</span>
                      <span style={{ fontSize: '12px', color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>{m.val}/{m.max}g</span>
                    </div>
                    <div className="progress-bar-track">
                      <div className="progress-bar-fill" style={{
                        width: `${Math.min((m.val / m.max) * 100, 100)}%`,
                        background: `linear-gradient(90deg, ${m.color}80, ${m.color})`,
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Today's Meals */}
            <div className="card" style={{ padding: '28px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 700, color: 'white' }}>
                  Today's Meal Plan
                </h3>
                <Link href="/plan/generate" className="btn btn-outline btn-sm">
                  <Brain size={14} /> Generate New
                </Link>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {TODAY_PLAN.meals.map(meal => (
                  <div key={meal.type}
                    style={{
                      padding: '16px', borderRadius: '12px',
                      background: meal.done ? 'rgba(16,185,129,0.06)' : 'rgba(30,41,59,0.4)',
                      border: meal.done ? '1px solid rgba(16,185,129,0.15)' : '1px solid rgba(255,255,255,0.06)',
                      opacity: meal.done ? 0.85 : 1,
                    }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <div style={{
                          width: '24px', height: '24px', borderRadius: '50%',
                          background: meal.done ? '#10b981' : 'rgba(255,255,255,0.1)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '12px',
                        }}>
                          {meal.done ? '✓' : ''}
                        </div>
                        <span style={{ fontWeight: 600, fontSize: '14px', color: 'white' }}>{meal.type}</span>
                        <span style={{ fontSize: '12px', color: '#475569' }}>{meal.time}</span>
                      </div>
                      <span className="badge badge-emerald">{meal.calories} kcal</span>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', paddingLeft: '34px' }}>
                      {meal.foods.map(f => (
                        <span key={f.name} style={{
                          fontSize: '12px', color: '#64748b', padding: '2px 10px',
                          borderRadius: '100px', background: 'rgba(255,255,255,0.05)',
                        }}>
                          {f.name} · {f.qty}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Links Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px' }}>
            {[
              { title: 'Generate AI Plan', desc: '2 plans left today', icon: '🤖', href: '/plan/generate', color: '#10b981' },
              { title: 'Food Database', desc: '1,000 foods + nutrients', icon: '🥦', href: '/food', color: '#6366f1' },
              { title: 'Calculators', desc: '18 nutrition tools', icon: '📊', href: '/calculators', color: '#f59e0b' },
              { title: 'Meal Calendar', desc: 'Weekly & monthly view', icon: '📅', href: '/calendar', color: '#ec4899' },
              { title: 'Progress', desc: 'Track your journey', icon: '📈', href: '/progress', color: '#84cc16' },
              { title: 'Upgrade Premium', desc: 'Unlimited AI + dietitian', icon: '⭐', href: '#pricing', color: '#a855f7' },
            ].map(item => (
              <Link key={item.title} href={item.href} style={{ textDecoration: 'none' }}>
                <div className="card" style={{ padding: '18px', cursor: 'pointer' }}>
                  <div style={{ fontSize: '24px', marginBottom: '8px' }}>{item.icon}</div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'white', marginBottom: '2px' }}>{item.title}</div>
                  <div style={{ fontSize: '11px', color: '#475569' }}>{item.desc}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

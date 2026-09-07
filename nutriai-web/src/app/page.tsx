'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import {
  Brain, Zap, Shield, BarChart2, Calendar, ChevronRight,
  Star, Users, Clock, Award, ArrowRight, Check, Activity,
  Leaf, Flame, Droplets, Apple, Heart, MessageCircle, Lock,
  TrendingUp, AlertTriangle, Download, Smartphone
} from 'lucide-react';

// ─── Animated Number Counter ───────────────────────────────────────────────
function AnimatedCounter({ end, suffix = '', duration = 2000 }: {
  end: number; suffix?: string; duration?: number;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          let start = 0;
          const step = end / (duration / 16);
          const timer = setInterval(() => {
            start += step;
            if (start >= end) { setCount(end); clearInterval(timer); }
            else setCount(Math.floor(start));
          }, 16);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration]);

  return <div ref={ref}>{count.toLocaleString()}{suffix}</div>;
}

// ─── Floating Orbs Background ────────────────────────────────────────────────
function FloatingOrbs() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden>
      <div style={{
        position: 'absolute', top: '-20%', right: '-10%', width: '600px', height: '600px',
        background: 'radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)',
        borderRadius: '50%', filter: 'blur(40px)',
        animation: 'float 8s ease-in-out infinite',
      }} />
      <div style={{
        position: 'absolute', bottom: '10%', left: '-15%', width: '500px', height: '500px',
        background: 'radial-gradient(circle, rgba(245,158,11,0.06) 0%, transparent 70%)',
        borderRadius: '50%', filter: 'blur(40px)',
        animation: 'float 10s ease-in-out infinite reverse',
      }} />
      <div style={{
        position: 'absolute', top: '40%', left: '50%', width: '300px', height: '300px',
        background: 'radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%)',
        borderRadius: '50%', filter: 'blur(40px)',
        animation: 'float 6s ease-in-out infinite 2s',
        transform: 'translateX(-50%)',
      }} />
    </div>
  );
}

// ─── Navbar ──────────────────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        padding: '16px 0',
        background: scrolled ? 'rgba(15,23,42,0.9)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.07)' : 'none',
        transition: 'all 0.3s ease',
      }}
    >
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '10px',
            background: 'linear-gradient(135deg, #065f46, #10b981)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(16,185,129,0.4)',
          }}>
            <Leaf size={20} color="white" />
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '22px', color: 'white' }}>
            Nutri<span className="text-gradient-emerald">AI</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}
          className="hidden-mobile">
          {['Features', 'Food Database', 'Calculators', 'Pricing'].map(item => (
            <a key={item} href={`#${item.toLowerCase().replace(' ', '-')}`}
              style={{ color: '#94a3b8', fontSize: '14px', fontWeight: 500, textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseOver={e => (e.currentTarget.style.color = '#e2e8f0')}
              onMouseOut={e => (e.currentTarget.style.color = '#94a3b8')}
            >{item}</a>
          ))}
        </div>

        {/* CTA Buttons */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <Link href="/auth/signin" className="btn btn-ghost btn-sm" style={{ display: 'none' }}>
            Sign In
          </Link>
          <Link href="/auth/signin" className="btn btn-primary btn-sm">
            Get Started Free
          </Link>
        </div>
      </div>
    </nav>
  );
}

// ─── Hero Section ─────────────────────────────────────────────────────────────
function HeroSection() {
  return (
    <section style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      background: 'radial-gradient(ellipse at 60% -20%, rgba(16,185,129,0.12) 0%, transparent 60%), linear-gradient(180deg, #0f172a 0%, #020617 100%)',
      paddingTop: '100px',
    }}>
      <div className="container" style={{ textAlign: 'center' }}>
        {/* Badge */}
        <div className="glass-emerald"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '6px 16px', borderRadius: '100px', marginBottom: '32px',
            background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)',
          }}>
          <Zap size={14} color="#10b981" />
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#34d399' }}>
            Powered by Qwen AI via OpenRouter
          </span>
        </div>

        {/* Headline */}
        <h1 style={{
          fontFamily: 'var(--font-display)', fontWeight: 800,
          fontSize: 'clamp(40px, 7vw, 84px)', lineHeight: 1.05,
          letterSpacing: '-0.03em', marginBottom: '24px', color: 'white',
        }}>
          Your Personal<br />
          <span className="text-gradient-emerald">AI Nutritionist</span><br />
          Available 24/7
        </h1>

        {/* Subheadline */}
        <p style={{
          fontSize: 'clamp(16px, 2vw, 20px)', color: '#94a3b8', maxWidth: '640px',
          margin: '0 auto 48px', lineHeight: 1.7,
        }}>
          Get clinically-aware, personalized diet plans for your exact diseases, allergies,
          and goals. Powered by advanced AI with real medical nutrition protocols.
        </p>

        {/* CTA Buttons */}
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '64px' }}>
          <Link href="/auth/signin" className="btn btn-primary btn-xl"
            style={{ fontSize: '18px', padding: '18px 40px' }}>
            <Zap size={20} />
            Generate My Diet Plan
          </Link>
          <a href="#features" className="btn btn-outline btn-xl"
            style={{ fontSize: '18px', padding: '18px 40px' }}>
            See How It Works
            <ArrowRight size={20} />
          </a>
        </div>

        {/* Trust Badges */}
        <div style={{ display: 'flex', gap: '24px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '80px' }}>
          {[
            { icon: <Shield size={16} />, text: 'Medically Aware AI' },
            { icon: <Lock size={16} />, text: 'Google Sign-In Only' },
            { icon: <Star size={16} />, text: 'Free to Start' },
            { icon: <Heart size={16} />, text: '100+ Diseases Covered' },
          ].map(({ icon, text }) => (
            <div key={text} style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              color: '#64748b', fontSize: '13px', fontWeight: 500,
            }}>
              <span style={{ color: '#10b981' }}>{icon}</span>
              {text}
            </div>
          ))}
        </div>

        {/* Stats */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '24px', maxWidth: '800px', margin: '0 auto',
        }}>
          {[
            { num: 1000, suffix: '+', label: 'Food Items' },
            { num: 100, suffix: '+', label: 'Diseases Covered' },
            { num: 18, suffix: '', label: 'Calculators' },
            { num: 50000, suffix: '+', label: 'Plans Generated' },
          ].map(({ num, suffix, label }) => (
            <div key={label} className="glass" style={{ padding: '24px', borderRadius: '16px', textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '32px', fontWeight: 800, marginBottom: '4px' }}
                className="text-gradient-emerald">
                <AnimatedCounter end={num} suffix={suffix} />
              </div>
              <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 500 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Features Section ─────────────────────────────────────────────────────────
function FeaturesSection() {
  const features = [
    {
      icon: <Brain size={28} />,
      title: 'AI Diet Plan Generator',
      description: 'Qwen AI generates fully personalized plans considering your diseases, allergies, medications, goals, and food preferences.',
      color: '#10b981',
      tag: 'Core Feature',
    },
    {
      icon: <Shield size={28} />,
      title: 'Medical Nutrition Intelligence',
      description: '100+ disease protocols, medication-food interactions, and real-time conflict detection with color-coded safety indicators.',
      color: '#f59e0b',
      tag: 'Clinically Aware',
    },
    {
      icon: <BarChart2 size={28} />,
      title: '18 Nutrition Calculators',
      description: 'BMI, TDEE, BMR, Body Fat %, Water Intake, Macro Split, VO₂ Max, 1RM, Intermittent Fasting — all in one place.',
      color: '#6366f1',
      tag: 'Science-Based',
    },
    {
      icon: <Calendar size={28} />,
      title: 'Weekly & Monthly Planner',
      description: 'Interactive drag-and-drop meal calendar. Plan your entire month, copy weeks, and get real-time macro summaries.',
      color: '#ec4899',
      tag: 'Organized',
    },
    {
      icon: <Download size={28} />,
      title: 'PDF & Excel Export',
      description: 'Export any diet plan as a beautifully formatted PDF or Excel sheet. Always free, unlimited exports.',
      color: '#14b8a6',
      tag: 'Always Free',
    },
    {
      icon: <Smartphone size={28} />,
      title: 'Mobile App',
      description: 'React Native app with progress tracking, food tick-off, soaking alarms, meal reminders, and offline support.',
      color: '#f97316',
      tag: 'Coming Soon',
    },
    {
      icon: <Activity size={28} />,
      title: 'Wearable Sync',
      description: 'Sync with Apple Health, Google Fit, and Samsung Health for accurate TDEE calculation based on actual activity.',
      color: '#84cc16',
      tag: 'Smart Tracking',
    },
    {
      icon: <MessageCircle size={28} />,
      title: 'Dietitian Consultations',
      description: 'Book 1-on-1 video or chat sessions with verified registered dietitians. Premium feature for personalized guidance.',
      color: '#a855f7',
      tag: 'Premium',
    },
    {
      icon: <Leaf size={28} />,
      title: '1,000 Food Database',
      description: 'Complete nutritional profiles: all macros, micros, amino acids, fatty acids, phytonutrients, glycemic scores per food.',
      color: '#10b981',
      tag: 'Comprehensive',
    },
  ];

  return (
    <section id="features" className="section-padding" style={{ background: 'rgba(0,0,0,0.2)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <span className="badge badge-emerald" style={{ marginBottom: '16px' }}>Everything You Need</span>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 800, color: 'white', marginBottom: '16px' }}>
            A Complete Nutrition{' '}
            <span className="text-gradient-emerald">Ecosystem</span>
          </h2>
          <p style={{ color: '#64748b', fontSize: '18px', maxWidth: '560px', margin: '0 auto' }}>
            From AI plan generation to detailed food analytics — everything a professional dietitian would offer, on-demand.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
          {features.map((f, i) => (
            <div key={f.title} className="card" style={{ padding: '28px', animationDelay: `${i * 60}ms` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div style={{
                  width: '52px', height: '52px', borderRadius: '14px',
                  background: `${f.color}18`, border: `1px solid ${f.color}30`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: f.color,
                }}>
                  {f.icon}
                </div>
                <span className="badge" style={{
                  background: `${f.color}15`, color: f.color,
                  border: `1px solid ${f.color}25`, fontSize: '10px',
                }}>{f.tag}</span>
              </div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '18px', color: 'white', marginBottom: '8px' }}>
                {f.title}
              </h3>
              <p style={{ color: '#64748b', fontSize: '14px', lineHeight: 1.7 }}>{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Food Interaction Demo ─────────────────────────────────────────────────────
function FoodInteractionDemo() {
  const [selected, setSelected] = useState<string | null>(null);
  const foods = [
    { id: 'spinach', name: 'Spinach 🌿', status: 'safe', text: 'Safe', note: 'High iron & potassium — excellent for your anemia' },
    { id: 'banana', name: 'Banana 🍌', status: 'moderate', text: 'Moderate', note: 'High potassium — limit to ½ banana with CKD' },
    { id: 'white-rice', name: 'White Rice 🍚', status: 'avoid', text: 'Avoid', note: 'GI: 72 (High) — rapidly spikes blood sugar in T2DM' },
    { id: 'oats', name: 'Oats 🌾', status: 'best', text: 'Best Choice', note: 'Beta-glucan lowers LDL. Low GI. Perfect for your goals.' },
    { id: 'salmon', name: 'Salmon 🐟', status: 'safe', text: 'Safe', note: 'Omega-3 EPA+DHA reduces inflammation & triglycerides' },
    { id: 'chips', name: 'Chips 🍟', status: 'avoid', text: 'Avoid', note: 'Trans fat + sodium — high CVD risk for your conditions' },
  ];

  const colorMap: Record<string, { bg: string; border: string; badge: string; dot: string }> = {
    safe:     { bg: 'rgba(22,163,74,0.08)', border: '#16a34a40', badge: 'badge-emerald', dot: '#16a34a' },
    moderate: { bg: 'rgba(217,119,6,0.08)', border: '#d9780640', badge: 'badge-amber', dot: '#d97706' },
    avoid:    { bg: 'rgba(220,38,38,0.08)', border: '#dc262640', badge: 'badge-red', dot: '#dc2626' },
    best:     { bg: 'rgba(59,130,246,0.08)', border: '#3b82f640', badge: 'badge-blue', dot: '#3b82f6' },
  };

  return (
    <section className="section-padding">
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px', alignItems: 'center' }}>
          <div>
            <span className="badge badge-amber" style={{ marginBottom: '16px' }}>Live Demo</span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, color: 'white', marginBottom: '16px' }}>
              Real-Time{' '}
              <span className="text-gradient-gold">Food Safety</span>{' '}
              Intelligence
            </h2>
            <p style={{ color: '#64748b', fontSize: '16px', lineHeight: 1.7, marginBottom: '32px' }}>
              Every food is instantly checked against your disease profile, allergies,
              and medications. Color-coded, real-time, zero extra clicks.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                '🟢 Green — Safe & recommended for your conditions',
                '🟡 Amber — Consume in moderation',
                '🔴 Red — Avoid — conflicts with your profile',
                '🔵 Blue — Excellent choice for your specific goal',
              ].map(item => (
                <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#94a3b8', fontSize: '14px' }}>
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {foods.map(f => {
              const c = colorMap[f.status];
              const isSelected = selected === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => setSelected(isSelected ? null : f.id)}
                  style={{
                    background: c.bg, border: `1.5px solid ${isSelected ? c.dot : c.border}`,
                    borderRadius: '12px', padding: '16px', cursor: 'pointer', textAlign: 'left',
                    transition: 'all 0.2s ease',
                    transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                    boxShadow: isSelected ? `0 8px 24px ${c.dot}25` : 'none',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '15px', fontWeight: 600, color: 'white' }}>{f.name}</span>
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: c.dot, display: 'block', marginTop: '3px' }} />
                  </div>
                  <div className={`badge ${c.badge}`} style={{ fontSize: '10px' }}>{f.text}</div>
                  {isSelected && (
                    <p style={{ marginTop: '10px', fontSize: '12px', color: '#94a3b8', lineHeight: 1.6 }}>
                      {f.note}
                    </p>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Plan Demo Section ─────────────────────────────────────────────────────────
function PlanDemoSection() {
  const meals = [
    {
      time: '8:00 AM', type: 'Breakfast', calories: 480,
      foods: [
        { name: 'Rolled Oats', qty: '80g', cal: 311, flag: null },
        { name: 'Greek Yogurt', qty: '100g', cal: 97, flag: null },
        { name: 'Almonds', qty: '15g', cal: 87, flag: null },
        { name: 'Banana', qty: '1 small', cal: 78, flag: '⚠️ Moderate for T2DM' },
      ],
    },
    {
      time: '1:00 PM', type: 'Lunch', calories: 620,
      foods: [
        { name: 'Brown Rice', qty: '150g', cal: 195, flag: null },
        { name: 'Paneer', qty: '100g', cal: 265, flag: null },
        { name: 'Spinach Dal', qty: '200g', cal: 160, flag: null },
      ],
    },
    {
      time: '4:30 PM', type: 'Snack', calories: 200,
      foods: [
        { name: 'Peanuts (roasted)', qty: '30g', cal: 170, flag: null },
        { name: 'Green Tea', qty: '250ml', cal: 2, flag: null },
      ],
    },
  ];

  return (
    <section className="section-padding" style={{ background: 'rgba(0,0,0,0.15)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span className="badge badge-emerald" style={{ marginBottom: '16px' }}>AI Generated</span>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 800, color: 'white', marginBottom: '16px' }}>
            What Your Plan Looks Like
          </h2>
          <p style={{ color: '#64748b', fontSize: '16px' }}>
            Personalized for: Type 2 Diabetes • Weight Loss • Vegetarian • Indian Cuisine
          </p>
        </div>

        {/* Macro Summary Bar */}
        <div className="glass" style={{
          padding: '24px', borderRadius: '16px', marginBottom: '24px',
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '20px',
        }}>
          {[
            { label: 'Total Calories', value: '1,780', unit: 'kcal', color: '#10b981', pct: 89 },
            { label: 'Protein', value: '98', unit: 'g', color: '#6366f1', pct: 74 },
            { label: 'Carbohydrates', value: '218', unit: 'g', color: '#f59e0b', pct: 78 },
            { label: 'Fat', value: '62', unit: 'g', color: '#ec4899', pct: 85 },
            { label: 'Fiber', value: '28', unit: 'g', color: '#84cc16', pct: 93 },
          ].map(m => (
            <div key={m.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                {m.label}
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '22px', fontWeight: 700, color: m.color, marginBottom: '8px' }}>
                {m.value}<span style={{ fontSize: '12px', color: '#64748b', marginLeft: '2px' }}>{m.unit}</span>
              </div>
              <div className="progress-bar-track">
                <div className="progress-bar-fill" style={{ width: `${m.pct}%`, background: `linear-gradient(90deg, ${m.color}80, ${m.color})` }} />
              </div>
            </div>
          ))}
        </div>

        {/* Meal Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {meals.map(meal => (
            <div key={meal.type} className="card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div>
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '16px', color: 'white' }}>
                    {meal.type}
                  </span>
                  <span style={{ color: '#475569', fontSize: '13px', marginLeft: '12px' }}>{meal.time}</span>
                </div>
                <span className="badge badge-emerald">{meal.calories} kcal</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '8px' }}>
                {meal.foods.map(food => (
                  <div key={food.name}
                    style={{
                      padding: '12px', borderRadius: '10px',
                      background: food.flag ? 'rgba(217,119,6,0.08)' : 'rgba(255,255,255,0.03)',
                      border: food.flag ? '1px solid rgba(217,119,6,0.2)' : '1px solid rgba(255,255,255,0.06)',
                    }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: 'white' }}>{food.name}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '12px', color: '#475569' }}>{food.qty}</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: '#10b981' }}>{food.cal} kcal</span>
                    </div>
                    {food.flag && (
                      <div style={{ marginTop: '6px', fontSize: '11px', color: '#fbbf24' }}>{food.flag}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '32px' }}>
          <Link href="/auth/signin" className="btn btn-primary btn-lg">
            <Zap size={18} />
            Generate My Personalized Plan
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─── Calculators Preview ────────────────────────────────────────────────────────
function CalculatorsSection() {
  const calcs = [
    { name: 'BMI Calculator', icon: '⚖️', desc: 'Body Mass Index + health risk' },
    { name: 'BMR Calculator', icon: '🔥', desc: 'Basal Metabolic Rate (Mifflin-St Jeor)' },
    { name: 'TDEE Calculator', icon: '⚡', desc: 'Total Daily Energy Expenditure' },
    { name: 'Body Fat %', icon: '💪', desc: 'Navy Method estimation' },
    { name: 'Protein Needs', icon: '🥩', desc: 'Daily protein by goal & weight' },
    { name: 'Water Intake', icon: '💧', desc: 'Daily hydration by activity' },
    { name: 'Macro Split', icon: '📊', desc: 'Carb/protein/fat ratio by goal' },
    { name: 'Intermittent Fasting', icon: '⏰', desc: '16:8, 18:6, 5:2, OMAD schedules' },
    { name: 'VO₂ Max', icon: '🫁', desc: 'Aerobic fitness estimation' },
    { name: '1-Rep Max', icon: '🏋️', desc: 'Epley, Brzycki, Lombardi formulas' },
    { name: 'Ideal Weight', icon: '🎯', desc: 'Multiple formula range' },
    { name: 'Calories Burned', icon: '🏃', desc: 'By activity, duration, weight' },
  ];

  return (
    <section id="calculators" className="section-padding">
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span className="badge badge-blue" style={{ marginBottom: '16px' }}>Science-Based</span>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 800, color: 'white', marginBottom: '16px' }}>
            18 Nutrition{' '}
            <span style={{ color: '#6366f1' }}>Calculators</span>
          </h2>
          <p style={{ color: '#64748b', fontSize: '16px' }}>
            All results are logged to your profile. Share as image cards. History tracked.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
          {calcs.map(c => (
            <Link key={c.name} href="/dashboard"
              style={{ textDecoration: 'none' }}
            >
              <div className="card" style={{ padding: '20px', cursor: 'pointer' }}>
                <div style={{ fontSize: '28px', marginBottom: '10px' }}>{c.icon}</div>
                <div style={{ fontWeight: 600, fontSize: '14px', color: 'white', marginBottom: '4px' }}>{c.name}</div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>{c.desc}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Pricing Section ────────────────────────────────────────────────────────────
function PricingSection() {
  return (
    <section id="pricing" className="section-padding" style={{ background: 'rgba(0,0,0,0.2)' }}>
      <div className="container" style={{ maxWidth: '960px' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span className="badge badge-amber" style={{ marginBottom: '16px' }}>Transparent Pricing</span>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 800, color: 'white', marginBottom: '16px' }}>
            Start Free. Upgrade Anytime.
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          {/* Free */}
          <div className="card" style={{ padding: '40px' }}>
            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontSize: '14px', fontWeight: 600, color: '#64748b', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Free</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '48px', fontWeight: 800, color: 'white' }}>₹0</div>
              <div style={{ color: '#64748b', fontSize: '14px' }}>Forever free, no credit card</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
              {[
                '3 AI diet plans per day',
                '5 AI diet plans per week',
                'Full food database (1,000 items)',
                'All 18 calculators',
                'Weekly + monthly planner',
                'PDF & Excel export (unlimited)',
                'Food interaction engine',
                'Allergy & disease warnings',
                'Google Sign-In',
              ].map(item => (
                <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#94a3b8', fontSize: '14px' }}>
                  <Check size={16} color="#10b981" />
                  {item}
                </div>
              ))}
            </div>
            <Link href="/auth/signin" className="btn btn-outline" style={{ width: '100%', justifyContent: 'center' }}>
              Get Started Free
            </Link>
          </div>

          {/* Premium */}
          <div className="card card-glow" style={{ padding: '40px', position: 'relative', overflow: 'hidden',
            background: 'rgba(6,95,70,0.15)', border: '1px solid rgba(16,185,129,0.25)' }}>
            <div style={{
              position: 'absolute', top: '20px', right: '20px',
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              color: 'white', fontSize: '11px', fontWeight: 700, padding: '4px 12px',
              borderRadius: '100px', textTransform: 'uppercase', letterSpacing: '0.06em',
            }}>
              POPULAR
            </div>
            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontSize: '14px', fontWeight: 600, color: '#10b981', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Premium</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '48px', fontWeight: 800, color: 'white' }}>
                ₹499<span style={{ fontSize: '18px', color: '#64748b', fontWeight: 400 }}>/mo</span>
              </div>
              <div style={{ color: '#64748b', fontSize: '14px' }}>or ₹3,999/year (save 33%)</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
              {[
                'Everything in Free',
                'Unlimited AI plan generation',
                'Priority AI response',
                'Dietitian consultation (video/chat)',
                'Advanced wearable analytics',
                'Disease-specific protocols',
                'Premium health trend dashboard',
                'Priority support',
                'Premium badge on profile',
              ].map(item => (
                <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#94a3b8', fontSize: '14px' }}>
                  <Check size={16} color="#10b981" />
                  {item}
                </div>
              ))}
            </div>
            <Link href="/auth/signin" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              <Zap size={16} />
              Start Premium Trial
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── CTA Section ────────────────────────────────────────────────────────────────
function CTASection() {
  return (
    <section className="section-padding">
      <div className="container" style={{ textAlign: 'center' }}>
        <div style={{
          padding: '80px 40px',
          background: 'radial-gradient(ellipse at 50% 0%, rgba(16,185,129,0.15) 0%, transparent 70%), rgba(30,41,59,0.5)',
          border: '1px solid rgba(16,185,129,0.15)',
          borderRadius: '32px',
          backdropFilter: 'blur(20px)',
        }}>
          <div className="badge badge-emerald" style={{ marginBottom: '24px', display: 'inline-flex' }}>
            <Zap size={14} /> Start Now
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 5vw, 56px)', fontWeight: 800, color: 'white', marginBottom: '20px' }}>
            Your AI Nutritionist Is<br />
            <span className="text-gradient-emerald">Ready Right Now</span>
          </h2>
          <p style={{ color: '#64748b', fontSize: '18px', maxWidth: '480px', margin: '0 auto 40px', lineHeight: 1.7 }}>
            Sign in with Google. Tell us your goals. Get your personalized plan in under 60 seconds.
          </p>
          <Link href="/auth/signin" className="btn btn-primary btn-xl">
            <Brain size={22} />
            Generate My Free Diet Plan
          </Link>
          <div style={{ marginTop: '20px', color: '#475569', fontSize: '13px' }}>
            No credit card • Google Sign-In only • Free forever
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ──────────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid rgba(255,255,255,0.06)',
      padding: '48px 0',
      background: '#020617',
    }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '48px', marginBottom: '48px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '8px',
                background: 'linear-gradient(135deg, #065f46, #10b981)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Leaf size={16} color="white" />
              </div>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: 'white', fontSize: '18px' }}>NutriAI</span>
            </div>
            <p style={{ color: '#475569', fontSize: '14px', lineHeight: 1.7, maxWidth: '260px' }}>
              AI-powered nutrition and diet planning. Medically aware. Free to start.
            </p>
          </div>
          {[
            { title: 'Product', links: ['Features', 'Calculators', 'Food Database', 'Pricing', 'Mobile App'] },
            { title: 'Conditions', links: ['Diabetes Diet', 'PCOS Diet', 'CKD Diet', 'Heart Disease', 'Weight Loss'] },
            { title: 'Company', links: ['About', 'Privacy Policy', 'Terms', 'Contact', 'Blog'] },
          ].map(col => (
            <div key={col.title}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '16px' }}>
                {col.title}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {col.links.map(link => (
                  <a key={link} href="#" style={{ color: '#475569', fontSize: '14px', textDecoration: 'none', transition: 'color 0.2s' }}
                    onMouseOver={e => (e.currentTarget.style.color = '#94a3b8')}
                    onMouseOut={e => (e.currentTarget.style.color = '#475569')}
                  >{link}</a>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="divider" style={{ marginBottom: '24px' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ color: '#334155', fontSize: '13px' }}>
            © 2026 NutriAI. All rights reserved.
          </div>
          <div style={{ color: '#334155', fontSize: '13px' }}>
            ⚕️ For informational purposes. Not a substitute for medical advice.
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function Home() {
  return (
    <>
      <FloatingOrbs />
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <FoodInteractionDemo />
        <PlanDemoSection />
        <CalculatorsSection />
        <PricingSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}

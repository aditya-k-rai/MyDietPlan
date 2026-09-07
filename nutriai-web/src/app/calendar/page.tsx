'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Calendar as CalendarIcon, ChevronLeft, ChevronRight, Download, Copy,
  Plus, Edit3, Trash2, Check, RefreshCw, Flame, Zap, Activity, Filter,
  Share2, ShoppingBag
} from 'lucide-react';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

interface MealSlot {
  name: string;
  qty: string;
  cal: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface DayPlan {
  breakfast: MealSlot[];
  lunch: MealSlot[];
  snack: MealSlot[];
  dinner: MealSlot[];
}

const INITIAL_WEEK_PLAN: Record<string, DayPlan> = {
  Mon: {
    breakfast: [{ name: 'Rolled Oats', qty: '80g', cal: 311, protein: 13.5, carbs: 53, fat: 5.5 }, { name: 'Greek Yogurt', qty: '100g', cal: 97, protein: 9, carbs: 3.6, fat: 5 }],
    lunch: [{ name: 'Brown Rice', qty: '150g', cal: 195, protein: 4.5, carbs: 44.8, fat: 1.8 }, { name: 'Paneer Bhurji', qty: '100g', cal: 265, protein: 18.3, carbs: 1.2, fat: 20.8 }],
    snack: [{ name: 'Roasted Chana', qty: '40g', cal: 162, protein: 8, carbs: 24, fat: 2.5 }],
    dinner: [{ name: 'Moong Dal', qty: '200g', cal: 148, protein: 10, carbs: 26, fat: 0.8 }, { name: 'Roti (Wheat)', qty: '2 pcs', cal: 200, protein: 6.8, carbs: 40, fat: 2.4 }],
  },
  Tue: {
    breakfast: [{ name: 'Besan Chilla', qty: '2 pcs', cal: 220, protein: 11, carbs: 32, fat: 5 }],
    lunch: [{ name: 'Rajma Curry', qty: '200g', cal: 240, protein: 14, carbs: 40, fat: 3 }, { name: 'Brown Rice', qty: '150g', cal: 195, protein: 4.5, carbs: 44.8, fat: 1.8 }],
    snack: [{ name: 'Apple', qty: '1 medium', cal: 95, protein: 0.5, carbs: 25, fat: 0.3 }],
    dinner: [{ name: 'Grilled Chicken Breast', qty: '150g', cal: 248, protein: 46.5, carbs: 0, fat: 5.4 }],
  },
  Wed: {
    breakfast: [{ name: 'Boiled Eggs', qty: '2 whole', cal: 156, protein: 12.6, carbs: 1.1, fat: 10.6 }],
    lunch: [{ name: 'Chole', qty: '200g', cal: 270, protein: 13, carbs: 42, fat: 5 }, { name: 'Quinoa', qty: '150g', cal: 180, protein: 6.5, carbs: 32, fat: 2.8 }],
    snack: [{ name: 'Mixed Nuts', qty: '30g', cal: 180, protein: 5, carbs: 6, fat: 15 }],
    dinner: [{ name: 'Palak Paneer', qty: '200g', cal: 290, protein: 16, carbs: 8, fat: 22 }],
  },
  Thu: {
    breakfast: [{ name: 'Oats Smoothie', qty: '350ml', cal: 320, protein: 15, carbs: 48, fat: 7 }],
    lunch: [{ name: 'Fish Curry (Rohu)', qty: '150g', cal: 210, protein: 28, carbs: 2, fat: 10 }],
    snack: [{ name: 'Green Tea', qty: '1 cup', cal: 2, protein: 0, carbs: 0, fat: 0 }],
    dinner: [{ name: 'Vegetable Soup + Tofu', qty: '300ml', cal: 210, protein: 16, carbs: 12, fat: 8 }],
  },
  Fri: {
    breakfast: [{ name: 'Poha', qty: '150g', cal: 250, protein: 5, carbs: 45, fat: 6 }],
    lunch: [{ name: 'Paneer Butter Masala (Fit)', qty: '150g', cal: 280, protein: 15, carbs: 10, fat: 20 }],
    snack: [{ name: 'Sprouts Salad', qty: '100g', cal: 120, protein: 9, carbs: 18, fat: 1 }],
    dinner: [{ name: 'Dal Tadka + Jeera Rice', qty: '350g', cal: 380, protein: 12, carbs: 68, fat: 7 }],
  },
  Sat: {
    breakfast: [{ name: 'Idli (3 pcs) + Sambhar', qty: '250g', cal: 280, protein: 9, carbs: 54, fat: 2 }],
    lunch: [{ name: 'Chicken Biryani (Light)', qty: '300g', cal: 420, protein: 32, carbs: 52, fat: 10 }],
    snack: [{ name: 'Fruit Salad', qty: '150g', cal: 110, protein: 1.5, carbs: 26, fat: 0.5 }],
    dinner: [{ name: 'Grilled Fish + Steamed Broccoli', qty: '250g', cal: 260, protein: 34, carbs: 8, fat: 8 }],
  },
  Sun: {
    breakfast: [{ name: 'Masala Dosa (1 small)', qty: '150g', cal: 310, protein: 6, carbs: 52, fat: 9 }],
    lunch: [{ name: 'Dal Makhani (low butter)', qty: '200g', cal: 260, protein: 12, carbs: 32, fat: 9 }],
    snack: [{ name: 'Buttermilk (Taas)', qty: '250ml', cal: 45, protein: 2.5, carbs: 3.5, fat: 2 }],
    dinner: [{ name: 'Khichdi + Curd', qty: '300g', cal: 310, protein: 11, carbs: 54, fat: 5 }],
  },
};

export default function CalendarPage() {
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week');
  const [selectedDay, setSelectedDay] = useState('Mon');
  const [weekPlan, setWeekPlan] = useState<Record<string, DayPlan>>(INITIAL_WEEK_PLAN);
  const [copiedSuccess, setCopiedSuccess] = useState(false);

  // Modal State
  const [activeModalSlot, setActiveModalSlot] = useState<'breakfast' | 'lunch' | 'snack' | 'dinner' | null>(null);
  const [newItemName, setNewItemName] = useState('');
  const [newItemQty, setNewItemQty] = useState('100g');
  const [newItemCal, setNewItemCal] = useState('150');
  const [newItemProtein, setNewItemProtein] = useState('8');
  const [newItemCarbs, setNewItemCarbs] = useState('20');
  const [newItemFat, setNewItemFat] = useState('4');

  const COMMON_SUGGESTIONS = [
    { name: 'Boiled Egg', qty: '1 whole', cal: 78, protein: 6.3, carbs: 0.6, fat: 5.3 },
    { name: 'Almonds (raw)', qty: '20g', cal: 116, protein: 4.2, carbs: 4.3, fat: 10 },
    { name: 'Greek Yogurt', qty: '100g', cal: 97, protein: 9, carbs: 3.6, fat: 5 },
    { name: 'Sprouts Salad', qty: '100g', cal: 120, protein: 9, carbs: 18, fat: 1 },
    { name: 'Moong Dal', qty: '150g', cal: 110, protein: 7.5, carbs: 19, fat: 0.6 },
    { name: 'Brown Rice', qty: '100g', cal: 130, protein: 3, carbs: 28, fat: 1.2 },
    { name: 'Paneer (low fat)', qty: '80g', cal: 160, protein: 14, carbs: 2, fat: 11 },
    { name: 'Apple', qty: '1 medium', cal: 95, protein: 0.5, carbs: 25, fat: 0.3 },
  ];

  const dayPlan = weekPlan[selectedDay] || { breakfast: [], lunch: [], snack: [], dinner: [] };

  const getDayTotal = (dp: DayPlan) => {
    const all = [...(dp.breakfast || []), ...(dp.lunch || []), ...(dp.snack || []), ...(dp.dinner || [])];
    return {
      cal: all.reduce((a, b) => a + b.cal, 0),
      protein: all.reduce((a, b) => a + b.protein, 0),
      carbs: all.reduce((a, b) => a + b.carbs, 0),
      fat: all.reduce((a, b) => a + b.fat, 0),
    };
  };

  const dayTotal = getDayTotal(dayPlan);

  const handleCopyWeek = () => {
    setCopiedSuccess(true);
    setTimeout(() => setCopiedSuccess(false), 3000);
  };

  const handleExportPlan = () => {
    window.print();
  };

  const handleExportGrocery = () => {
    window.print();
  };

  const handlePickSuggestion = (sug: typeof COMMON_SUGGESTIONS[0]) => {
    setNewItemName(sug.name);
    setNewItemQty(sug.qty);
    setNewItemCal(String(sug.cal));
    setNewItemProtein(String(sug.protein));
    setNewItemCarbs(String(sug.carbs));
    setNewItemFat(String(sug.fat));
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeModalSlot || !newItemName.trim()) return;

    const newSlotItem: MealSlot = {
      name: newItemName.trim(),
      qty: newItemQty.trim() || '1 serving',
      cal: Number(newItemCal) || 100,
      protein: Number(newItemProtein) || 0,
      carbs: Number(newItemCarbs) || 0,
      fat: Number(newItemFat) || 0,
    };

    setWeekPlan(prev => ({
      ...prev,
      [selectedDay]: {
        ...prev[selectedDay],
        [activeModalSlot]: [...(prev[selectedDay]?.[activeModalSlot] || []), newSlotItem],
      },
    }));

    // Reset & close
    setNewItemName('');
    setActiveModalSlot(null);
  };

  const handleRemoveItem = (slotKey: 'breakfast' | 'lunch' | 'snack' | 'dinner', index: number) => {
    setWeekPlan(prev => ({
      ...prev,
      [selectedDay]: {
        ...prev[selectedDay],
        [slotKey]: (prev[selectedDay]?.[slotKey] || []).filter((_, i) => i !== index),
      },
    }));
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0a0f1e', color: '#e2e8f0', paddingBottom: '80px' }}>
      {/* Header */}
      <header style={{
        padding: '20px 32px', borderBottom: '1px solid rgba(255,255,255,0.07)',
        background: 'rgba(15,23,42,0.8)', backdropFilter: 'blur(20px)',
        position: 'sticky', top: 0, zIndex: 50,
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Link href="/dashboard" className="btn btn-ghost btn-sm">
              <ChevronLeft size={16} /> Dashboard
            </Link>
            <div>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 800, color: 'white' }}>
                Meal Calendar & Planner
              </h1>
              <p style={{ fontSize: '13px', color: '#64748b' }}>
                Plan your meals, copy schedules, and generate grocery lists
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            {/* View Mode Toggle */}
            <div style={{ display: 'flex', borderRadius: '10px', background: 'rgba(30,41,59,0.8)', padding: '3px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <button
                onClick={() => setViewMode('week')}
                style={{
                  padding: '6px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                  background: viewMode === 'week' ? '#059669' : 'transparent',
                  color: viewMode === 'week' ? 'white' : '#64748b', fontSize: '13px', fontWeight: 600,
                  transition: 'all 0.2s',
                }}
              >
                Weekly
              </button>
              <button
                onClick={() => setViewMode('month')}
                style={{
                  padding: '6px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                  background: viewMode === 'month' ? '#059669' : 'transparent',
                  color: viewMode === 'month' ? 'white' : '#64748b', fontSize: '13px', fontWeight: 600,
                  transition: 'all 0.2s',
                }}
              >
                Monthly
              </button>
            </div>

            <button className="btn btn-outline btn-sm" onClick={handleCopyWeek}>
              <Copy size={14} /> {copiedSuccess ? '✓ Copied to Next Week' : 'Copy Week'}
            </button>
            <button className="btn btn-primary btn-sm" onClick={handleExportPlan}>
              <Download size={14} /> Export Plan
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main style={{ maxWidth: '1280px', margin: '32px auto 0', padding: '0 24px' }}>
        {/* Days Selector Ribbon */}
        <div className="card" style={{ padding: '16px', borderRadius: '20px', marginBottom: '24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '10px' }}>
            {DAYS.map(day => {
              const dt = getDayTotal(weekPlan[day] || { breakfast: [], lunch: [], snack: [], dinner: [] });
              const isSelected = selectedDay === day;
              return (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  style={{
                    padding: '16px 10px', borderRadius: '14px', cursor: 'pointer', textAlign: 'center',
                    background: isSelected ? 'rgba(16,185,129,0.15)' : 'rgba(15,23,42,0.6)',
                    border: isSelected ? '1.5px solid #10b981' : '1px solid rgba(255,255,255,0.06)',
                    transition: 'all 0.2s',
                  }}
                >
                  <div style={{ fontSize: '13px', fontWeight: 700, color: isSelected ? '#34d399' : '#94a3b8', textTransform: 'uppercase', marginBottom: '4px' }}>
                    {day}
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '16px', fontWeight: 800, color: isSelected ? 'white' : '#e2e8f0' }}>
                    {dt.cal}
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>kcal</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Day Stats & Macro Bar */}
        <div className="card glass-emerald" style={{ padding: '24px', borderRadius: '20px', marginBottom: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div style={{ fontSize: '12px', color: '#10b981', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Daily Macro Target Summary
              </div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 800, color: 'white' }}>
                {selectedDay}'s Planned Nutrition
              </h2>
            </div>

            <div style={{ display: 'flex', gap: '24px' }}>
              {[
                { label: 'Calories', val: `${dayTotal.cal} / 1,800 kcal`, color: '#10b981' },
                { label: 'Protein', val: `${dayTotal.protein.toFixed(0)}g / 120g`, color: '#6366f1' },
                { label: 'Carbs', val: `${dayTotal.carbs.toFixed(0)}g / 200g`, color: '#f59e0b' },
                { label: 'Fat', val: `${dayTotal.fat.toFixed(0)}g / 60g`, color: '#ec4899' },
              ].map(m => (
                <div key={m.label} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', marginBottom: '2px' }}>{m.label}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '16px', fontWeight: 700, color: m.color }}>{m.val}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Meal Slots Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '40px' }}>
          {[
            { key: 'breakfast' as const, title: '🌅 Breakfast', time: '8:00 AM', items: dayPlan.breakfast || [] },
            { key: 'lunch' as const, title: '☀️ Lunch', time: '1:00 PM', items: dayPlan.lunch || [] },
            { key: 'snack' as const, title: '🍎 Afternoon Snack', time: '4:30 PM', items: dayPlan.snack || [] },
            { key: 'dinner' as const, title: '🌙 Dinner', time: '8:00 PM', items: dayPlan.dinner || [] },
          ].map(slot => {
            const slotCal = slot.items.reduce((a, b) => a + b.cal, 0);
            return (
              <div key={slot.key} className="card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '12px' }}>
                  <div>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 700, color: 'white' }}>
                      {slot.title}
                    </h3>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>{slot.time}</div>
                  </div>
                  <span className="badge badge-emerald">{slotCal} kcal</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
                  {slot.items.length === 0 ? (
                    <div style={{ fontSize: '13px', color: '#475569', fontStyle: 'italic', textAlign: 'center', padding: '12px 0' }}>
                      No items planned yet
                    </div>
                  ) : (
                    slot.items.map((item, idx) => (
                      <div key={idx} style={{ padding: '12px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', position: 'relative' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                          <span style={{ fontSize: '14px', fontWeight: 600, color: 'white' }}>{item.name}</span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: '#10b981' }}>{item.cal} kcal</span>
                            <button
                              onClick={() => handleRemoveItem(slot.key, idx)}
                              title="Remove item"
                              style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '2px', display: 'flex' }}
                              onMouseOver={e => (e.currentTarget.style.color = '#ef4444')}
                              onMouseOut={e => (e.currentTarget.style.color = '#64748b')}
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#64748b' }}>
                          <span>{item.qty}</span>
                          <span style={{ fontFamily: 'var(--font-mono)' }}>P:{item.protein}g | C:{item.carbs}g | F:{item.fat}g</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => setActiveModalSlot(slot.key)}
                  style={{ width: '100%', justifyContent: 'center' }}>
                  <Plus size={14} /> Add Item to {slot.title.split(' ')[1]}
                </button>
              </div>
            );
          })}
        </div>

        {/* Shopping List Generator */}
        <div className="card" style={{ padding: '32px', borderRadius: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 800, color: 'white', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <ShoppingBag size={22} color="#10b981" /> Automated Weekly Grocery List
              </h3>
              <p style={{ fontSize: '14px', color: '#64748b', marginTop: '2px' }}>
                Calculated directly from your active 7-day meal plan
              </p>
            </div>
            <button className="btn btn-outline btn-sm" onClick={handleExportGrocery}>
              <Download size={14} /> Export Grocery PDF
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px' }}>
            {[
              'Rolled Oats (600g)', 'Greek Yogurt (700g)', 'Brown Rice (1kg)', 'Paneer (500g)',
              'Moong Dal (500g)', 'Rajma (400g)', 'Chicken Breast (600g)', 'Spinach (400g)',
              'Almonds & Nuts (250g)', 'Whole Wheat Roti Atta (2kg)', 'Fresh Broccoli (300g)', 'Eggs (12 pcs)'
            ].map(grocery => (
              <div key={grocery} style={{ padding: '12px 16px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Check size={14} color="#10b981" />
                <span>{grocery}</span>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Add Item Modal */}
      {activeModalSlot && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px',
        }}>
          <div className="card" style={{ maxWidth: '480px', width: '100%', padding: '28px', borderRadius: '24px', boxShadow: '0 20px 50px rgba(0,0,0,0.8)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 800, color: 'white' }}>
                Add Item to {activeModalSlot.toUpperCase()} ({selectedDay})
              </h3>
              <button
                onClick={() => setActiveModalSlot(null)}
                style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '20px' }}>
                ✕
              </button>
            </div>

            {/* Quick Suggestions */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, marginBottom: '8px' }}>
                Quick Suggestions
              </div>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {COMMON_SUGGESTIONS.map(sug => (
                  <button
                    key={sug.name}
                    type="button"
                    onClick={() => handlePickSuggestion(sug)}
                    style={{
                      padding: '4px 10px', borderRadius: '100px', fontSize: '11px', fontWeight: 600,
                      background: newItemName === sug.name ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.05)',
                      border: newItemName === sug.name ? '1px solid #10b981' : '1px solid rgba(255,255,255,0.08)',
                      color: newItemName === sug.name ? '#34d399' : '#94a3b8', cursor: 'pointer',
                    }}>
                    + {sug.name}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleAddItem}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
                <div>
                  <label className="label">Food Name</label>
                  <input
                    className="input"
                    placeholder="e.g. Scrambled Eggs or Moong Dal"
                    value={newItemName}
                    onChange={e => setNewItemName(e.target.value)}
                    required
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label className="label">Portion Quantity</label>
                    <input
                      className="input"
                      placeholder="e.g. 150g or 2 pcs"
                      value={newItemQty}
                      onChange={e => setNewItemQty(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="label">Calories (kcal)</label>
                    <input
                      className="input"
                      type="number"
                      value={newItemCal}
                      onChange={e => setNewItemCal(e.target.value)}
                    />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                  <div>
                    <label className="label">Protein (g)</label>
                    <input
                      className="input"
                      type="number"
                      value={newItemProtein}
                      onChange={e => setNewItemProtein(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="label">Carbs (g)</label>
                    <input
                      className="input"
                      type="number"
                      value={newItemCarbs}
                      onChange={e => setNewItemCarbs(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="label">Fat (g)</label>
                    <input
                      className="input"
                      type="number"
                      value={newItemFat}
                      onChange={e => setNewItemFat(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => setActiveModalSlot(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  Add Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

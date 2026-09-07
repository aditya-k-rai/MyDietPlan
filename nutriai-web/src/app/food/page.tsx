'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, ChevronLeft, Filter, Info, Star, AlertTriangle, ChevronRight, X } from 'lucide-react';
import { FOODS, type Food, type ServingOption, searchFoods, FOOD_CATEGORIES } from '@/lib/data/foods';

// ─── Color Dot ──────────────────────────────────────────────────────────────────
function SafetyDot({ status }: { status: string }) {
  const colors: Record<string, string> = {
    safe: '#16a34a', moderate: '#d97706', avoid: '#dc2626',
  };
  return (
    <div style={{
      width: '10px', height: '10px', borderRadius: '50%', flexShrink: 0,
      background: colors[status] ?? '#94a3b8',
      boxShadow: `0 0 6px ${colors[status] ?? '#94a3b8'}60`,
    }} />
  );
}

// ─── Nutrient Bar ───────────────────────────────────────────────────────────────
function NutrientBar({ label, value, unit, max, color }: {
  label: string; value: number; unit: string; max: number; color: string;
}) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div style={{ marginBottom: '12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
        <span style={{ fontSize: '12px', color: '#64748b' }}>{label}</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: '#94a3b8' }}>{value}{unit}</span>
      </div>
      <div className="progress-bar-track">
        <div style={{
          height: '100%', borderRadius: '100px', width: `${pct}%`,
          background: `linear-gradient(90deg, ${color}80, ${color})`,
          transition: 'width 0.5s ease',
        }} />
      </div>
    </div>
  );
}

// ─── Food Card ──────────────────────────────────────────────────────────────────
function FoodCard({ food, onClick }: { food: Food; onClick: () => void }) {
  const userDiseases = ['diabetes-type-2']; // mock
  const safetyEntries = userDiseases.map(d => food.diseaseCompatibility[d]).filter(Boolean);
  const worstSafety = safetyEntries.includes('avoid') ? 'avoid' : safetyEntries.includes('moderate') ? 'moderate' : 'safe';

  const badgeMap = {
    safe: { label: 'Safe', cls: 'badge-emerald' },
    moderate: { label: 'Moderate', cls: 'badge-amber' },
    avoid: { label: 'Avoid', cls: 'badge-red' },
  };
  const badge = badgeMap[worstSafety as keyof typeof badgeMap] ?? { label: 'Neutral', cls: 'badge-slate' };

  return (
    <button onClick={onClick}
      style={{
        background: 'rgba(30,41,59,0.5)', border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: '12px', padding: '16px', cursor: 'pointer', textAlign: 'left', width: '100%',
        transition: 'all 0.2s',
      }}
      onMouseOver={e => {
        (e.currentTarget as HTMLElement).style.borderColor = 'rgba(16,185,129,0.2)';
        (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)';
      }}
      onMouseOut={e => {
        (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.07)';
        (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
        <div>
          <div style={{ fontWeight: 600, fontSize: '14px', color: 'white', marginBottom: '2px' }}>{food.name}</div>
          <div style={{ fontSize: '11px', color: '#475569' }}>{food.category}</div>
        </div>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <SafetyDot status={worstSafety} />
          <span className={`badge ${badge.cls}`} style={{ fontSize: '9px' }}>{badge.label}</span>
        </div>
      </div>
      <div style={{ display: 'flex', gap: '16px', fontFamily: 'var(--font-mono)', fontSize: '11px' }}>
        <div style={{ color: '#10b981' }}><span style={{ color: '#475569' }}>Cal </span>{food.per100g.calories}</div>
        <div style={{ color: '#6366f1' }}><span style={{ color: '#475569' }}>P </span>{food.per100g.protein}g</div>
        <div style={{ color: '#f59e0b' }}><span style={{ color: '#475569' }}>C </span>{food.per100g.totalCarbs}g</div>
        <div style={{ color: '#ec4899' }}><span style={{ color: '#475569' }}>F </span>{food.per100g.totalFat}g</div>
        <div style={{ color: '#475569' }}>per 100{food.unit}</div>
      </div>
      {food.requiresSoaking && (
        <div style={{ marginTop: '6px', fontSize: '11px', color: '#fbbf24' }}>
          💧 Requires soaking {food.soakDurationHours}h before
        </div>
      )}
    </button>
  );
}

// ─── Food Detail Drawer ─────────────────────────────────────────────────────────
// ─── Meal Element Customizer Component ─────────────────────────────────────────
function MealElementCustomizer({ food }: { food: Food }) {
  const initialWeights: Record<string, number> = {};
  if (food.elements) {
    food.elements.forEach(el => {
      initialWeights[el.id] = el.defaultGramWeight;
    });
  }
  const [elementWeights, setElementWeights] = useState<Record<string, number>>(initialWeights);
  const [selectedServingId, setSelectedServingId] = useState<string>('custom');

  const handleSelectServing = (opt: ServingOption & { weights?: Record<string, number> }) => {
    setSelectedServingId(opt.id);
    const weightsMap = opt.elementWeights || opt.weights || {};
    setElementWeights(weightsMap);
  };

  const handleWeightChange = (elId: string, grams: number) => {
    setSelectedServingId('custom');
    setElementWeights(prev => ({ ...prev, [elId]: Math.max(0, grams) }));
  };

  let calcCalories = 0;
  let calcProtein = 0;
  let calcCarbs = 0;
  let calcFat = 0;
  let totalGrams = 0;

  if (food.elements && food.elements.length > 0) {
    food.elements.forEach(el => {
      const g = elementWeights[el.id] ?? el.defaultGramWeight;
      totalGrams += g;
      calcCalories += (el.caloriesPer100g * g) / 100;
      calcProtein += (el.proteinPer100g * g) / 100;
      calcCarbs += (el.carbsPer100g * g) / 100;
      calcFat += (el.fatPer100g * g) / 100;
    });
  }

  if (!food.elements || food.elements.length === 0) return null;

  return (
    <div style={{ padding: '20px', borderRadius: '16px', background: 'rgba(6,95,70,0.12)', border: '1px solid rgba(16,185,129,0.25)', marginBottom: '24px' }}>
      <div style={{ marginBottom: '16px' }}>
        <div style={{ fontSize: '13px', fontWeight: 700, color: '#34d399', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          🍽️ Portion Size & Element Customizer
        </div>
        <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>
          Select restaurant plate size or adjust exact element grams
        </div>
      </div>

      {/* Serving Option Buttons */}
      {food.servingOptions && food.servingOptions.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '8px', fontWeight: 600, textTransform: 'uppercase' }}>
            Portion Options
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {food.servingOptions.map(opt => (
              <button
                key={opt.id}
                onClick={() => handleSelectServing(opt)}
                style={{
                  padding: '8px 14px', borderRadius: '10px', cursor: 'pointer',
                  background: selectedServingId === opt.id ? '#059669' : 'rgba(30,41,59,0.8)',
                  border: selectedServingId === opt.id ? '1.5px solid #10b981' : '1px solid rgba(255,255,255,0.08)',
                  color: selectedServingId === opt.id ? 'white' : '#94a3b8',
                  fontSize: '12px', fontWeight: 600, transition: 'all 0.2s',
                }}
              >
                {opt.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Deconstructed Element Sliders / Inputs */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '10px', fontWeight: 600, textTransform: 'uppercase' }}>
          Ingredient Element Weights (Edit exact grams)
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {food.elements.map(el => {
            const currentWeight = elementWeights[el.id] ?? el.defaultGramWeight;
            const elCal = Math.round((el.caloriesPer100g * currentWeight) / 100);
            const elP = ((el.proteinPer100g * currentWeight) / 100).toFixed(1);
            const elC = ((el.carbsPer100g * currentWeight) / 100).toFixed(1);

            return (
              <div key={el.id} style={{ padding: '12px', borderRadius: '12px', background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: 'white' }}>{el.name}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: '#10b981' }}>
                    {elCal} kcal <span style={{ color: '#64748b' }}>(P: {elP}g | C: {elC}g)</span>
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <input
                    type="range" min="0" max="1000" step="5"
                    value={currentWeight}
                    onChange={e => handleWeightChange(el.id, Number(e.target.value))}
                    style={{ flex: 1, accentColor: '#10b981', cursor: 'pointer' }}
                  />
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', width: '85px' }}>
                    <input
                      type="number" min="0" max="2000"
                      value={currentWeight}
                      onChange={e => handleWeightChange(el.id, Number(e.target.value))}
                      className="input"
                      style={{ padding: '4px 6px', fontSize: '12px', textAlign: 'center' }}
                    />
                    <span style={{ fontSize: '12px', color: '#64748b' }}>g</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recalculated Live Total Card */}
      <div style={{ padding: '14px', borderRadius: '12px', background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(16,185,129,0.3)', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', textAlign: 'center' }}>
        <div>
          <div style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase' }}>Weight</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '16px', fontWeight: 800, color: 'white' }}>{totalGrams}g</div>
        </div>
        <div>
          <div style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase' }}>Calories</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '16px', fontWeight: 800, color: '#10b981' }}>{Math.round(calcCalories)}</div>
        </div>
        <div>
          <div style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase' }}>Protein</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '16px', fontWeight: 800, color: '#6366f1' }}>{calcProtein.toFixed(1)}g</div>
        </div>
        <div>
          <div style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase' }}>Carbs</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '16px', fontWeight: 800, color: '#f59e0b' }}>{calcCarbs.toFixed(1)}g</div>
        </div>
      </div>
    </div>
  );
}

// ─── Food Detail Drawer ─────────────────────────────────────────────────────────
function FoodDetailDrawer({ food, onClose }: { food: Food; onClose: () => void }) {
  const [tab, setTab] = useState('nutrition');
  const tabs = ['nutrition', 'scores', 'details', 'compatibility', 'references'];

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
      display: 'flex', justifyContent: 'flex-end',
    }} onClick={onClose}>
      <div
        style={{
          width: '480px', maxWidth: '100vw', height: '100vh',
          background: '#0f172a', borderLeft: '1px solid rgba(255,255,255,0.08)',
          overflow: 'auto', padding: '0',
          animation: 'slideInRight 0.3s ease',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ padding: '24px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 800, color: 'white', marginBottom: '4px' }}>
                {food.name}
              </h2>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <span className="badge badge-emerald">{food.category}</span>
                {food.cuisine && <span className="badge badge-amber">{food.cuisine} Cuisine</span>}
                <span className="badge badge-slate">Per 100{food.unit}</span>
                {food.isVerified && <span className="badge badge-blue">✓ Verified</span>}
              </div>
            </div>
            <button onClick={onClose}
              style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: '#64748b', cursor: 'pointer', borderRadius: '8px', padding: '8px' }}>
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.08)', overflowX: 'auto' }}>
          {tabs.map(t => (
            <button key={t} onClick={() => setTab(t)}
              style={{
                padding: '12px 16px', border: 'none', cursor: 'pointer', background: 'transparent',
                color: tab === t ? '#10b981' : '#64748b', fontWeight: 600, fontSize: '13px',
                borderBottom: tab === t ? '2px solid #10b981' : '2px solid transparent',
                transition: 'all 0.2s', textTransform: 'capitalize', whiteSpace: 'nowrap',
              }}>
              {t}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div style={{ padding: '24px' }}>
          {tab === 'nutrition' && (
            <div>
              {/* Element Customizer for Meals */}
              {food.isMealDish && <MealElementCustomizer food={food} />}

              {/* Big Calories */}
              <div style={{ textAlign: 'center', padding: '24px', marginBottom: '24px',
                background: 'rgba(16,185,129,0.08)', borderRadius: '16px', border: '1px solid rgba(16,185,129,0.15)' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '48px', fontWeight: 800, color: '#10b981' }}>
                  {food.per100g.calories}
                </div>
                <div style={{ color: '#64748b', fontSize: '14px' }}>kcal per 100{food.unit}</div>
              </div>
              {/* Macros */}
              <NutrientBar label="Protein" value={food.per100g.protein} unit="g" max={35} color="#6366f1" />
              <NutrientBar label="Carbohydrates" value={food.per100g.totalCarbs} unit="g" max={100} color="#f59e0b" />
              <NutrientBar label="— Sugar" value={food.per100g.sugar} unit="g" max={50} color="#fb923c" />
              <NutrientBar label="— Fiber" value={food.per100g.fiber} unit="g" max={20} color="#84cc16" />
              <NutrientBar label="Total Fat" value={food.per100g.totalFat} unit="g" max={70} color="#ec4899" />
              <NutrientBar label="— Saturated" value={food.per100g.saturatedFat} unit="g" max={30} color="#f43f5e" />
              <div className="divider" style={{ margin: '20px 0' }} />
              {/* Micros */}
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px' }}>
                Key Micronutrients
              </div>
              <NutrientBar label="Calcium" value={food.per100g.calcium} unit="mg" max={1000} color="#38bdf8" />
              <NutrientBar label="Iron" value={food.per100g.iron} unit="mg" max={18} color="#f87171" />
              <NutrientBar label="Magnesium" value={food.per100g.magnesium} unit="mg" max={400} color="#34d399" />
              <NutrientBar label="Vitamin C" value={food.per100g.vitaminC} unit="mg" max={90} color="#fbbf24" />
              <NutrientBar label="Potassium" value={food.per100g.potassium} unit="mg" max={4700} color="#a78bfa" />
            </div>
          )}

          {tab === 'scores' && (
            <div>
              {/* GI Dial */}
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '16px' }}>Glycemic Index</div>
                <div style={{
                  display: 'inline-flex', width: '120px', height: '120px', borderRadius: '50%', alignItems: 'center', justifyContent: 'center',
                  background: food.glycemicIndex < 55 ? 'rgba(22,163,74,0.15)' : food.glycemicIndex < 70 ? 'rgba(217,119,6,0.15)' : 'rgba(220,38,38,0.15)',
                  border: `4px solid ${food.glycemicIndex < 55 ? '#16a34a' : food.glycemicIndex < 70 ? '#d97706' : '#dc2626'}`,
                  flexDirection: 'column',
                }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '36px', fontWeight: 800, color: 'white' }}>
                    {food.glycemicIndex || '—'}
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>GI Score</div>
                </div>
                <div style={{ marginTop: '12px', fontSize: '14px', fontWeight: 600, color: food.glycemicIndex < 55 ? '#16a34a' : food.glycemicIndex < 70 ? '#d97706' : '#dc2626' }}>
                  {food.glycemicIndex === 0 ? 'No GI (protein/fat)' : food.glycemicIndex < 55 ? 'Low GI — Excellent' : food.glycemicIndex < 70 ? 'Moderate GI' : 'High GI — Caution'}
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {[
                  { label: 'Glycemic Load', value: food.glycemicLoad || '—', color: '#10b981' },
                  { label: 'Omega-3', value: `${food.per100g.omega3}g`, color: '#6366f1' },
                  { label: 'Omega-6', value: `${food.per100g.omega6}g`, color: '#f59e0b' },
                  { label: 'Sodium', value: `${food.per100g.sodium}mg`, color: '#94a3b8' },
                ].map(s => (
                  <div key={s.label} style={{ padding: '16px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', textAlign: 'center' }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '22px', fontWeight: 700, color: s.color }}>{s.value}</div>
                    <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'details' && (
            <div>
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#16a34a', marginBottom: '10px' }}>✅ Benefits</div>
                {food.benefits.map(b => (
                  <div key={b} style={{ fontSize: '13px', color: '#94a3b8', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    • {b}
                  </div>
                ))}
              </div>
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#dc2626', marginBottom: '10px' }}>⚠️ Risks / Cautions</div>
                {food.risks.map(r => (
                  <div key={r} style={{ fontSize: '13px', color: '#94a3b8', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    • {r}
                  </div>
                ))}
              </div>
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#10b981', marginBottom: '10px' }}>⏰ Best Time to Eat</div>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {food.bestTimeToEat.map(t => (
                    <span key={t} className="badge badge-emerald">{t}</span>
                  ))}
                </div>
              </div>
              {food.requiresSoaking && (
                <div style={{ padding: '14px', borderRadius: '12px', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#fbbf24', marginBottom: '4px' }}>💧 Soaking Required</div>
                  <div style={{ fontSize: '13px', color: '#94a3b8' }}>
                    Soak for <strong style={{ color: '#fbbf24' }}>{food.soakDurationHours} hours</strong> before cooking to reduce antinutrients and improve digestibility.
                  </div>
                </div>
              )}
            </div>
          )}

          {tab === 'compatibility' && (
            <div>
              <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '16px' }}>
                Based on your active conditions
              </div>
              {Object.entries(food.diseaseCompatibility).map(([disease, status]) => (
                <div key={disease} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.05)',
                }}>
                  <span style={{ fontSize: '14px', color: '#94a3b8', textTransform: 'capitalize' }}>
                    {disease.replace(/-/g, ' ')}
                  </span>
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    <SafetyDot status={status} />
                    <span style={{ fontSize: '12px', color: status === 'safe' ? '#16a34a' : status === 'moderate' ? '#d97706' : '#dc2626', fontWeight: 600 }}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </span>
                  </div>
                </div>
              ))}
              {food.allergens.length > 0 && (
                <div style={{ marginTop: '20px', padding: '14px', borderRadius: '12px', background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.15)' }}>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#f87171', marginBottom: '8px' }}>⚠️ Contains Allergens</div>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {food.allergens.map(a => <span key={a} className="badge badge-red">{a}</span>)}
                  </div>
                </div>
              )}
            </div>
          )}

          {tab === 'references' && (
            <div>
              <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '16px' }}>
                Data Sources & Scientific References
              </div>
              <div style={{ padding: '12px 16px', borderRadius: '10px', background: 'rgba(255,255,255,0.03)', marginBottom: '8px' }}>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#94a3b8', marginBottom: '4px' }}>Primary Data Source</div>
                <div style={{ fontSize: '14px', color: 'white' }}>{food.source === 'USDA' ? 'USDA FoodData Central' : food.source === 'ICMR' ? 'ICMR-NIN Indian Food Composition Tables' : 'Custom Verified Database'}</div>
              </div>
              <div style={{ fontSize: '13px', color: '#475569', marginTop: '16px', lineHeight: 1.6 }}>
                Nutritional data verified against clinical databases. Always consult a registered dietitian for medical nutrition therapy.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Food Database Page ─────────────────────────────────────────────────────────
export default function FoodDatabasePage() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [visibleCount, setVisibleCount] = useState(48);

  const categories = ['All', ...FOOD_CATEGORIES];
  const filtered = (query ? searchFoods(query, 500) : FOODS).filter(
    f => category === 'All' || f.category === category
  );

  const displayedFoods = filtered.slice(0, visibleCount);

  return (
    <div style={{ minHeight: '100vh', background: '#0a0f1e' }}>
      {/* Header */}
      <div style={{ padding: '32px', borderBottom: '1px solid rgba(255,255,255,0.07)', background: 'rgba(15,23,42,0.8)', backdropFilter: 'blur(20px)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '20px' }}>
            <Link href="/dashboard" className="btn btn-ghost btn-sm"><ChevronLeft size={16} /> Dashboard</Link>
            <div>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 800, color: 'white', marginBottom: '4px' }}>
                Food Database
              </h1>
              <p style={{ color: '#64748b', fontSize: '14px' }}>
                {FOODS.length.toLocaleString()} foods · Full nutrient profiles · Color-coded for your conditions
              </p>
            </div>
          </div>
          {/* Search */}
          <div style={{ position: 'relative', maxWidth: '480px' }}>
            <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
            <input className="input" value={query} onChange={e => { setQuery(e.target.value); setVisibleCount(48); }}
              placeholder="Search oats, paneer, salmon..." style={{ paddingLeft: '44px' }} />
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '24px 32px' }}>
        {/* Category Filter */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', overflowX: 'auto', paddingBottom: '4px' }}>
          {categories.map(c => (
            <button key={c} onClick={() => { setCategory(c); setVisibleCount(48); }}
              style={{
                padding: '6px 16px', borderRadius: '100px', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap',
                background: category === c ? '#059669' : 'rgba(30,41,59,0.6)',
                color: category === c ? 'white' : '#64748b',
                fontSize: '13px', fontWeight: 500, transition: 'all 0.2s',
              }}>
              {c}
            </button>
          ))}
        </div>

        {/* Count */}
        <div style={{ fontSize: '13px', color: '#475569', marginBottom: '16px' }}>
          Showing {displayedFoods.length.toLocaleString()} of {filtered.length.toLocaleString()} foods found
          {query && ` for "${query}"`}
        </div>

        {/* Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
          {displayedFoods.map(food => (
            <FoodCard key={food.id} food={food} onClick={() => setSelectedFood(food)} />
          ))}
        </div>

        {visibleCount < filtered.length && (
          <div style={{ textAlign: 'center', marginTop: '32px' }}>
            <button className="btn btn-outline btn-lg" onClick={() => setVisibleCount(v => v + 48)}>
              Load More Foods ({filtered.length - visibleCount} remaining)
            </button>
          </div>
        )}

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px', color: '#475569' }}>
            <Search size={48} style={{ marginBottom: '16px', opacity: 0.3 }} />
            <div style={{ fontSize: '16px', fontWeight: 600, color: '#64748b' }}>No foods found</div>
            <div style={{ fontSize: '14px', marginTop: '4px' }}>Try a different search term</div>
          </div>
        )}
      </div>

      {/* Food Detail Drawer */}
      {selectedFood && (
        <FoodDetailDrawer food={selectedFood} onClose={() => setSelectedFood(null)} />
      )}
    </div>
  );
}

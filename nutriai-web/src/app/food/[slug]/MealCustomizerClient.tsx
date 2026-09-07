'use client';

import { useState } from 'react';
import { Food, ServingOption } from '@/lib/data/foods';

export default function MealCustomizerClient({ food }: { food: Food }) {
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
    <div style={{ padding: '28px', borderRadius: '20px', background: 'rgba(6,95,70,0.12)', border: '1px solid rgba(16,185,129,0.3)', marginBottom: '28px' }}>
      <div style={{ marginBottom: '20px' }}>
        <div style={{ fontSize: '14px', fontWeight: 700, color: '#34d399', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          🍽️ Deconstructed Meal Portion & Element Customizer
        </div>
        <div style={{ fontSize: '13px', color: '#94a3b8', marginTop: '2px' }}>
          Select standard restaurant portion sizes (Quarter, Half, Full Plate) or edit exact element weights in grams.
        </div>
      </div>

      {/* Serving Option Buttons */}
      {food.servingOptions && food.servingOptions.length > 0 && (
        <div style={{ marginBottom: '24px' }}>
          <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '10px', fontWeight: 600, textTransform: 'uppercase' }}>
            Restaurant Serving Options
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {food.servingOptions.map(opt => (
              <button
                key={opt.id}
                onClick={() => handleSelectServing(opt)}
                style={{
                  padding: '10px 18px', borderRadius: '12px', cursor: 'pointer',
                  background: selectedServingId === opt.id ? '#059669' : 'rgba(30,41,59,0.8)',
                  border: selectedServingId === opt.id ? '1.5px solid #10b981' : '1px solid rgba(255,255,255,0.08)',
                  color: selectedServingId === opt.id ? 'white' : '#94a3b8',
                  fontSize: '13px', fontWeight: 600, transition: 'all 0.2s',
                }}
              >
                {opt.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Deconstructed Element Sliders / Inputs */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '12px', fontWeight: 600, textTransform: 'uppercase' }}>
          Deconstructed Ingredient Grams (Edit Any Element — e.g. 20g Chicken & 50g Rice)
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
          {food.elements.map(el => {
            const currentWeight = elementWeights[el.id] ?? el.defaultGramWeight;
            const elCal = Math.round((el.caloriesPer100g * currentWeight) / 100);
            const elP = ((el.proteinPer100g * currentWeight) / 100).toFixed(1);
            const elC = ((el.carbsPer100g * currentWeight) / 100).toFixed(1);

            return (
              <div key={el.id} style={{ padding: '16px', borderRadius: '14px', background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: 'white' }}>{el.name}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: '#10b981' }}>
                    {elCal} kcal
                  </span>
                </div>
                <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '10px' }}>
                  P: {elP}g | C: {elC}g
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <input
                    type="range" min="0" max="1000" step="5"
                    value={currentWeight}
                    onChange={e => handleWeightChange(el.id, Number(e.target.value))}
                    style={{ flex: 1, accentColor: '#10b981', cursor: 'pointer' }}
                  />
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', width: '90px' }}>
                    <input
                      type="number" min="0" max="2000"
                      value={currentWeight}
                      onChange={e => handleWeightChange(el.id, Number(e.target.value))}
                      className="input"
                      style={{ padding: '6px 8px', fontSize: '13px', textAlign: 'center' }}
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
      <div style={{ padding: '20px', borderRadius: '16px', background: 'rgba(15,23,42,0.95)', border: '1.5px solid rgba(16,185,129,0.4)', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', textAlign: 'center' }}>
        <div>
          <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase' }}>Selected Portion Weight</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '24px', fontWeight: 800, color: 'white' }}>{totalGrams}g</div>
        </div>
        <div>
          <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase' }}>Calculated Calories</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '24px', fontWeight: 800, color: '#10b981' }}>{Math.round(calcCalories)}</div>
        </div>
        <div>
          <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase' }}>Calculated Protein</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '24px', fontWeight: 800, color: '#6366f1' }}>{calcProtein.toFixed(1)}g</div>
        </div>
        <div>
          <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase' }}>Calculated Carbs</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '24px', fontWeight: 800, color: '#f59e0b' }}>{calcCarbs.toFixed(1)}g</div>
        </div>
      </div>
    </div>
  );
}

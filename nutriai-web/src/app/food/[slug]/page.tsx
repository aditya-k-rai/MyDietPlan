import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FOODS, getFoodById } from '@/lib/data/foods';
import { DISEASES } from '@/lib/data/diseases';
import {
  ChevronLeft, Leaf, Shield, AlertTriangle, Check, Info, Flame,
  Clock, Award, ExternalLink, Heart, Activity, Droplets, Zap
} from 'lucide-react';
import MealCustomizerClient from './MealCustomizerClient';

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = true;

export async function generateStaticParams() {
  const baseSlugs = [
    'white-rice', 'brown-rice', 'moong-dal', 'spinach', 'quinoa', 'milk-whole',
    'salmon', 'avocado', 'oats-rolled', 'chickpeas', 'eggs', 'chicken-breast',
    'walnuts', 'almonds', 'masoor-dal', 'sweet-potato', 'greek-yogurt', 'paneer', 'banana'
  ];
  const itemSlugs = FOODS.slice(0, 100).map(f => f.id);
  const allSlugs = Array.from(new Set([...baseSlugs, ...itemSlugs]));
  return allSlugs.map(slug => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const food = getFoodById(slug);
  if (!food) return { title: 'Food Not Found | NutriAI' };

  return {
    title: `${food.name} Nutrition, Calories & Health Benefits | NutriAI`,
    description: `Complete nutritional profile of ${food.name}. ${food.per100g.calories} kcal, ${food.per100g.protein}g protein, ${food.per100g.totalCarbs}g carbs per 100g. Glycemic index: ${food.glycemicIndex}. Disease safety & health benefits.`,
    keywords: [food.name, ...food.aliases, `${food.name} calories`, `${food.name} protein`, `${food.name} nutrition`, `${food.name} glycemic index`],
    openGraph: {
      title: `${food.name} Nutritional Profile & Safety Analysis`,
      description: `${food.per100g.calories} kcal | ${food.per100g.protein}g Protein | GI: ${food.glycemicIndex}. Verified by ${food.source}.`,
    },
  };
}

export default async function FoodDetailPage({ params }: Props) {
  const { slug } = await params;
  const food = getFoodById(slug);

  if (!food) {
    notFound();
  }

  const safeDiseases = Object.entries(food.diseaseCompatibility)
    .filter(([_, status]) => status === 'safe')
    .map(([id]) => id);

  const cautionDiseases = Object.entries(food.diseaseCompatibility)
    .filter(([_, status]) => status === 'moderate' || status === 'avoid')
    .map(([id, status]) => ({ id, status }));

  return (
    <div style={{ minHeight: '100vh', background: '#0a0f1e', color: '#e2e8f0', paddingBottom: '80px' }}>
      {/* Top Header Navigation */}
      <header style={{
        padding: '20px 32px', borderBottom: '1px solid rgba(255,255,255,0.07)',
        background: 'rgba(15,23,42,0.8)', backdropFilter: 'blur(20px)',
        position: 'sticky', top: 0, zIndex: 50,
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/food" className="btn btn-ghost btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <ChevronLeft size={16} /> Back to Food Database
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge badge-emerald">{food.category}</span>
            <span className="badge badge-slate">Verified by {food.source}</span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main style={{ maxWidth: '1200px', margin: '32px auto 0', padding: '0 24px' }}>
        <div className="card glass-emerald" style={{ padding: '36px', borderRadius: '24px', marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
            <div>
              <div style={{ fontSize: '13px', color: '#34d399', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
                {food.subcategory || food.category}
              </div>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 800, color: 'white', marginBottom: '8px' }}>
                {food.name}
              </h1>
              {food.aliases.length > 0 && (
                <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '16px' }}>
                  Also known as: {food.aliases.join(', ')}
                </div>
              )}
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <span className="badge badge-emerald">Per 100{food.unit} Serving</span>
                {food.requiresSoaking && (
                  <span className="badge badge-amber">💧 Requires Soaking ({food.soakDurationHours}h)</span>
                )}
                {food.allergens.length > 0 && (
                  <span className="badge badge-red">⚠️ Contains Allergens: {food.allergens.join(', ')}</span>
                )}
              </div>
            </div>

            {/* Calories Highlight Card */}
            <div style={{
              background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(16,185,129,0.3)',
              borderRadius: '20px', padding: '24px 36px', textAlign: 'center',
              boxShadow: '0 0 30px rgba(16,185,129,0.15)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: '#10b981', marginBottom: '4px' }}>
                <Flame size={20} />
                <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Energy</span>
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '56px', fontWeight: 800, color: 'white', lineHeight: 1 }}>
                {food.per100g.calories}
              </div>
              <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>kcal / 100{food.unit}</div>
            </div>
          </div>
        </div>

        {/* Grid Layout: Left Details, Right Compatibility */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '28px' }}>
          {/* Left Column: Macronutrients & Detailed Breakdown */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            {/* Meal Customizer for Prepared Dishes */}
            {food.isMealDish && <MealCustomizerClient food={food} />}

            {/* Macro Cards Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '14px' }}>
              {[
                { label: 'Protein', value: `${food.per100g.protein}g`, color: '#6366f1', icon: <Activity size={18} /> },
                { label: 'Total Carbs', value: `${food.per100g.totalCarbs}g`, color: '#f59e0b', icon: <Zap size={18} /> },
                { label: 'Dietary Fiber', value: `${food.per100g.fiber}g`, color: '#84cc16', icon: <Leaf size={18} /> },
                { label: 'Total Fat', value: `${food.per100g.totalFat}g`, color: '#ec4899', icon: <Droplets size={18} /> },
              ].map(m => (
                <div key={m.label} className="card" style={{ padding: '20px', textAlign: 'center' }}>
                  <div style={{ color: m.color, marginBottom: '6px', display: 'flex', justifyContent: 'center' }}>{m.icon}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '24px', fontWeight: 700, color: 'white', marginBottom: '2px' }}>
                    {m.value}
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>{m.label}</div>
                </div>
              ))}
            </div>

            {/* Glycemic Index & Load */}
            <div className="card" style={{ padding: '28px' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 700, color: 'white', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Activity size={20} color="#10b981" /> Glycemic Impact & Metabolic Scores
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div style={{ padding: '20px', borderRadius: '16px', background: 'rgba(255,255,255,0.03)', textAlign: 'center' }}>
                  <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '6px' }}>Glycemic Index (GI)</div>
                  <div style={{
                    fontFamily: 'var(--font-mono)', fontSize: '36px', fontWeight: 800,
                    color: food.glycemicIndex === 0 ? '#38bdf8' : food.glycemicIndex <= 55 ? '#10b981' : food.glycemicIndex <= 69 ? '#f59e0b' : '#f87171',
                  }}>
                    {food.glycemicIndex || '0*'}
                  </div>
                  <div style={{ fontSize: '12px', marginTop: '6px', fontWeight: 600, color: food.glycemicIndex <= 55 ? '#34d399' : '#fbbf24' }}>
                    {food.glycemicIndex === 0 ? 'Negligible (Pure Fat/Protein)' : food.glycemicIndex <= 55 ? 'Low GI (Safe for Diabetics)' : food.glycemicIndex <= 69 ? 'Moderate GI' : 'High GI (Spikes Blood Sugar)'}
                  </div>
                </div>

                <div style={{ padding: '20px', borderRadius: '16px', background: 'rgba(255,255,255,0.03)', textAlign: 'center' }}>
                  <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '6px' }}>Glycemic Load (GL) per serving</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '36px', fontWeight: 800, color: '#6366f1' }}>
                    {food.glycemicLoad || '0'}
                  </div>
                  <div style={{ fontSize: '12px', marginTop: '6px', fontWeight: 600, color: '#818cf8' }}>
                    {food.glycemicLoad <= 10 ? 'Low GL impact' : food.glycemicLoad <= 19 ? 'Moderate GL' : 'High GL'}
                  </div>
                </div>
              </div>
            </div>

            {/* Complete Nutrient Table */}
            <div className="card" style={{ padding: '28px' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 700, color: 'white', marginBottom: '20px' }}>
                🧪 Detailed Micronutrient Breakdown (per 100{food.unit})
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px' }}>
                    Vitamins
                  </div>
                  {[
                    { name: 'Vitamin A', val: `${food.per100g.vitaminA} mcg` },
                    { name: 'Vitamin C', val: `${food.per100g.vitaminC} mg` },
                    { name: 'Vitamin D', val: `${food.per100g.vitaminD} IU` },
                    { name: 'Vitamin E', val: `${food.per100g.vitaminE} mg` },
                    { name: 'Vitamin K', val: `${food.per100g.vitaminK} mcg` },
                    { name: 'Vitamin B6', val: `${food.per100g.vitaminB6} mg` },
                    { name: 'Vitamin B12', val: `${food.per100g.vitaminB12} mcg` },
                  ].map(item => (
                    <div key={item.name} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: '13px' }}>
                      <span style={{ color: '#94a3b8' }}>{item.name}</span>
                      <span style={{ fontFamily: 'var(--font-mono)', color: 'white', fontWeight: 600 }}>{item.val}</span>
                    </div>
                  ))}
                </div>

                <div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px' }}>
                    Minerals & Fatty Acids
                  </div>
                  {[
                    { name: 'Calcium', val: `${food.per100g.calcium} mg` },
                    { name: 'Iron', val: `${food.per100g.iron} mg` },
                    { name: 'Magnesium', val: `${food.per100g.magnesium} mg` },
                    { name: 'Potassium', val: `${food.per100g.potassium} mg` },
                    { name: 'Sodium', val: `${food.per100g.sodium} mg` },
                    { name: 'Zinc', val: `${food.per100g.zinc} mg` },
                    { name: 'Omega-3 Fatty Acids', val: `${food.per100g.omega3} g` },
                  ].map(item => (
                    <div key={item.name} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: '13px' }}>
                      <span style={{ color: '#94a3b8' }}>{item.name}</span>
                      <span style={{ fontFamily: 'var(--font-mono)', color: 'white', fontWeight: 600 }}>{item.val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Health Benefits & Risks */}
            <div className="card" style={{ padding: '28px' }}>
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 700, color: 'white', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Heart size={20} color="#34d399" /> Proven Health Benefits
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {food.benefits.map((benefit, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '14px', color: '#cbd5e1', lineHeight: 1.6 }}>
                      <Check size={18} color="#10b981" style={{ marginTop: '2px', flexShrink: 0 }} />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              {food.risks.length > 0 && (
                <div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 700, color: '#f87171', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <AlertTriangle size={20} color="#f87171" /> Potential Risks & Considerations
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {food.risks.map((risk, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '14px', color: '#cbd5e1', lineHeight: 1.6 }}>
                        <AlertTriangle size={18} color="#f59e0b" style={{ marginTop: '2px', flexShrink: 0 }} />
                        <span>{risk}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Disease Safety Matrix */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Safety Matrix */}
            <div className="card" style={{ padding: '24px' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 700, color: 'white', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Shield size={18} color="#10b981" /> Clinical Compatibility
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {Object.entries(food.diseaseCompatibility).map(([diseaseId, status]) => {
                  const diseaseObj = DISEASES.find(d => d.id === diseaseId);
                  const diseaseName = diseaseObj ? diseaseObj.name : diseaseId.replace(/-/g, ' ');

                  const badgeColor = status === 'safe'
                    ? { bg: 'rgba(22,163,74,0.15)', text: '#34d399', border: 'rgba(22,163,74,0.3)', label: 'Safe' }
                    : status === 'moderate'
                    ? { bg: 'rgba(217,119,6,0.15)', text: '#fbbf24', border: 'rgba(217,119,6,0.3)', label: 'Moderate' }
                    : { bg: 'rgba(220,38,38,0.15)', text: '#f87171', border: 'rgba(220,38,38,0.3)', label: 'Avoid' };

                  return (
                    <div key={diseaseId} style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '12px 14px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.05)',
                    }}>
                      <Link href={`/disease/${diseaseId}`} style={{ color: '#e2e8f0', fontSize: '13px', fontWeight: 500, textDecoration: 'none' }} className="hover:text-emerald-400">
                        {diseaseName}
                      </Link>
                      <span className="badge" style={{ background: badgeColor.bg, color: badgeColor.text, border: `1px solid ${badgeColor.border}`, fontSize: '10px' }}>
                        {badgeColor.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Timing Guidance */}
            <div className="card" style={{ padding: '24px' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 700, color: 'white', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock size={18} color="#f59e0b" /> Optimal Timing
              </h3>
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '6px' }}>Best Time to Eat</div>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {food.bestTimeToEat.map(t => (
                    <span key={t} className="badge badge-emerald">{t}</span>
                  ))}
                </div>
              </div>
              {food.worstTimeToEat.length > 0 && (
                <div>
                  <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '6px' }}>Worst Time to Eat</div>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {food.worstTimeToEat.map(t => (
                      <span key={t} className="badge badge-red">{t}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* CTA Widget */}
            <div className="card glass-emerald" style={{ padding: '24px', textAlign: 'center' }}>
              <Zap size={28} color="#10b981" style={{ margin: '0 auto 12px' }} />
              <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 700, color: 'white', marginBottom: '6px' }}>
                Add to Your Diet Plan
              </h4>
              <p style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '16px' }}>
                Let NutriAI fit {food.name} into your custom daily macro targets.
              </p>
              <Link href="/plan/generate" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                Generate My Plan
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

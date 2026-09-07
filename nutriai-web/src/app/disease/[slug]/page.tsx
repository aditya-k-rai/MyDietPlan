import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { DISEASES, getDiseaseById } from '@/lib/data/diseases';
import { FOODS } from '@/lib/data/foods';
import {
  ChevronLeft, Shield, AlertTriangle, Check, Info, Heart,
  Activity, Zap, Leaf, Stethoscope, FileText
} from 'lucide-react';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return DISEASES.map(d => ({ slug: d.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const disease = getDiseaseById(slug);
  if (!disease) return { title: 'Condition Not Found | NutriAI' };

  return {
    title: `${disease.name} Diet Plan, Foods to Eat & Avoid | NutriAI Medical Nutrition`,
    description: `Clinical nutrition guide for ${disease.name} (ICD-10: ${disease.icd10}). Recommended foods, foods to avoid, nutrient targets, and evidence-based dietary strategies.`,
    keywords: [disease.name, ...disease.aliases, `${disease.name} diet`, `${disease.name} foods to avoid`, `${disease.name} meal plan`],
  };
}

export default async function DiseaseDetailPage({ params }: Props) {
  const { slug } = await params;
  const disease = getDiseaseById(slug);

  if (!disease) {
    notFound();
  }

  // Find all foods that are explicitly safe or avoid for this disease
  const recommendedFoods = FOODS.filter(f => f.diseaseCompatibility[disease.id] === 'safe');
  const avoidFoods = FOODS.filter(f => f.diseaseCompatibility[disease.id] === 'avoid');

  return (
    <div style={{ minHeight: '100vh', background: '#0a0f1e', color: '#e2e8f0', paddingBottom: '80px' }}>
      {/* Header */}
      <header style={{
        padding: '20px 32px', borderBottom: '1px solid rgba(255,255,255,0.07)',
        background: 'rgba(15,23,42,0.8)', backdropFilter: 'blur(20px)',
        position: 'sticky', top: 0, zIndex: 50,
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/dashboard" className="btn btn-ghost btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <ChevronLeft size={16} /> Back to Dashboard
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge badge-amber">ICD-10 Code: {disease.icd10}</span>
            <span className="badge badge-emerald">Medical Protocol</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: '1200px', margin: '32px auto 0', padding: '0 24px' }}>
        {/* Banner */}
        <div className="card glass-emerald" style={{ padding: '36px', borderRadius: '24px', marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px' }}>
            <div style={{
              width: '64px', height: '64px', borderRadius: '20px',
              background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              color: '#f59e0b',
            }}>
              <Stethoscope size={32} />
            </div>
            <div>
              <div style={{ fontSize: '13px', color: '#fbbf24', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
                Clinical Nutrition Guidelines
              </div>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, color: 'white', marginBottom: '12px' }}>
                {disease.name}
              </h1>
              <p style={{ color: '#cbd5e1', fontSize: '16px', lineHeight: 1.7, maxWidth: '800px', marginBottom: '16px' }}>
                {disease.description}
              </p>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {disease.aliases.map(alias => (
                  <span key={alias} className="badge badge-slate">{alias}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Dietary Strategy Card */}
        <div className="card" style={{ padding: '28px', marginBottom: '32px', borderLeft: '4px solid #10b981' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 700, color: 'white', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={22} color="#10b981" /> Primary Medical Dietary Strategy
          </h2>
          <p style={{ color: '#cbd5e1', fontSize: '15px', lineHeight: 1.8 }}>
            {disease.dietaryStrategy}
          </p>
        </div>

        {/* Nutrients to Prioritize vs Limit */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
          {/* Prioritize */}
          <div className="card" style={{ padding: '24px', background: 'rgba(22,163,74,0.06)', border: '1px solid rgba(22,163,74,0.2)' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 700, color: '#34d399', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Check size={20} color="#34d399" /> Key Nutrients to Prioritize
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {disease.nutrientsToPrioritize.map(n => (
                <div key={n} style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#e2e8f0', fontSize: '14px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#34d399' }} />
                  <span style={{ fontWeight: 600 }}>{n}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Limit */}
          <div className="card" style={{ padding: '24px', background: 'rgba(220,38,38,0.06)', border: '1px solid rgba(220,38,38,0.2)' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 700, color: '#f87171', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertTriangle size={20} color="#f87171" /> Nutrients to Limit or Avoid
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {disease.nutrientsToLimit.map(n => (
                <div key={n} style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#e2e8f0', fontSize: '14px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f87171' }} />
                  <span style={{ fontWeight: 600 }}>{n}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recommended vs Avoid Foods Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '28px', marginBottom: '40px' }}>
          {/* Foods to Eat */}
          <div className="card" style={{ padding: '28px' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 700, color: 'white', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              🟢 Recommended Foods for {disease.name}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {disease.foodsToEat.map(item => (
                <div key={item.foodId} style={{ padding: '14px', borderRadius: '12px', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}>
                  <div style={{ fontWeight: 700, color: 'white', fontSize: '15px', marginBottom: '4px' }}>
                    <Link href={`/food/${item.foodId}`} style={{ color: '#34d399', textDecoration: 'none' }}>
                      {item.foodId.replace(/-/g, ' ').toUpperCase()} →
                    </Link>
                  </div>
                  <div style={{ fontSize: '13px', color: '#94a3b8' }}>{item.reason}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Foods to Avoid */}
          <div className="card" style={{ padding: '28px' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 700, color: 'white', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              🔴 Foods to Avoid or Limit Strictly
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {disease.foodsToAvoid.length > 0 ? (
                disease.foodsToAvoid.map(item => (
                  <div key={item.foodId} style={{ padding: '14px', borderRadius: '12px', background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.2)' }}>
                    <div style={{ fontWeight: 700, color: '#f87171', fontSize: '15px', marginBottom: '4px' }}>
                      <Link href={`/food/${item.foodId}`} style={{ color: '#f87171', textDecoration: 'none' }}>
                        {item.foodId.replace(/-/g, ' ').toUpperCase()} →
                      </Link>
                    </div>
                    <div style={{ fontSize: '13px', color: '#94a3b8' }}>{item.reason}</div>
                  </div>
                ))
              ) : (
                <div style={{ fontSize: '14px', color: '#64748b', padding: '16px', textAlign: 'center' }}>
                  No absolute food exclusions. Focus on overall macro balance and sodium control.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Generate Plan CTA */}
        <div className="card glass-emerald" style={{ padding: '40px', textAlign: 'center', borderRadius: '24px' }}>
          <Zap size={36} color="#10b981" style={{ margin: '0 auto 16px' }} />
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 800, color: 'white', marginBottom: '8px' }}>
            Get a Personalized AI Diet Plan for {disease.name}
          </h3>
          <p style={{ color: '#cbd5e1', fontSize: '15px', maxWidth: '560px', margin: '0 auto 24px' }}>
            NutriAI automatically respects all clinical protocols for {disease.name} and creates a 100% compliant meal plan.
          </p>
          <Link href="/plan/generate" className="btn btn-primary btn-lg">
            Generate {disease.name} Diet Plan
          </Link>
        </div>
      </main>
    </div>
  );
}

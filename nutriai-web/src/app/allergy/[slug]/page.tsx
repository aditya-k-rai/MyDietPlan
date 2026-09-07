import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FOODS } from '@/lib/data/foods';
import { ALLERGENS, getAllergenById } from '@/lib/data/allergens';
import {
  ChevronLeft, AlertTriangle, Shield, Check, Info, Zap, Flame, Leaf
} from 'lucide-react';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return ALLERGENS.map(a => ({ slug: a.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const allergy = getAllergenById(slug);
  if (!allergy) return { title: 'Allergy Guide | NutriAI' };

  return {
    title: `${allergy.name} Guide: Hidden Names, Symptoms & Safe Substitutes | NutriAI`,
    description: `Clinical allergy profile for ${allergy.name}. Learn hidden ingredient names, cross-reactivity risks, and safe nutritious food substitutes.`,
  };
}

export default async function AllergyDetailPage({ params }: Props) {
  const { slug } = await params;
  const allergy = getAllergenById(slug);

  if (!allergy) {
    // Render general fallback if slug not in static map
    return (
      <div style={{ minHeight: '100vh', background: '#0a0f1e', color: 'white', padding: '40px 24px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '16px' }}>Allergy Guide: {slug.toUpperCase()}</h1>
        <p style={{ color: '#94a3b8', marginBottom: '24px' }}>Detailed clinical profile loading. Use NutriAI plan generator to filter this allergen automatically.</p>
        <Link href="/plan/generate" className="btn btn-primary">Generate Safe Meal Plan</Link>
      </div>
    );
  }

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
          <span className="badge badge-red">Allergen Safety Protocol</span>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: '1200px', margin: '32px auto 0', padding: '0 24px' }}>
        {/* Banner */}
        <div className="card" style={{ padding: '36px', borderRadius: '24px', marginBottom: '32px', background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px' }}>
            <div style={{
              width: '64px', height: '64px', borderRadius: '20px',
              background: 'rgba(220,38,38,0.15)', border: '1px solid rgba(220,38,38,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              color: '#f87171',
            }}>
              <AlertTriangle size={32} />
            </div>
            <div>
              <div style={{ fontSize: '13px', color: '#f87171', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
                Allergen Elimination Protocol
              </div>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, color: 'white', marginBottom: '12px' }}>
                {allergy.name}
              </h1>
              <p style={{ color: '#cbd5e1', fontSize: '16px', lineHeight: 1.7, maxWidth: '800px' }}>
                {allergy.description}
              </p>
            </div>
          </div>
        </div>

        {/* 2x2 Info Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
          {/* Hidden Names */}
          <div className="card" style={{ padding: '28px' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 700, color: '#fbbf24', marginBottom: '16px' }}>
              🕵️ Hidden Ingredients on Food Labels
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {allergy.hiddenNames.map(name => (
                <div key={name} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#e2e8f0' }}>
                  <AlertTriangle size={16} color="#f59e0b" />
                  <span style={{ fontWeight: 600 }}>{name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Safe Substitutes */}
          <div className="card" style={{ padding: '28px' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 700, color: '#34d399', marginBottom: '16px' }}>
              🌿 Safe & Nutritious Substitutes
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {allergy.substitutes.map(sub => (
                <div key={sub} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#e2e8f0' }}>
                  <Check size={16} color="#10b981" />
                  <span style={{ fontWeight: 600 }}>{sub}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Symptoms & Cross Reactivity */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
          <div className="card" style={{ padding: '28px' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 700, color: 'white', marginBottom: '16px' }}>
              🩺 Common Allergic Reaction Symptoms
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {allergy.symptoms.map(s => (
                <div key={s} style={{ fontSize: '14px', color: '#94a3b8', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  • {s}
                </div>
              ))}
            </div>
          </div>

          <div className="card" style={{ padding: '28px' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 700, color: 'white', marginBottom: '16px' }}>
              ⚠️ Cross-Reactivity Risks
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {allergy.crossReactivity.map(cr => (
                <div key={cr} style={{ fontSize: '14px', color: '#94a3b8', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  • {cr}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="card glass-emerald" style={{ padding: '36px', textAlign: 'center', borderRadius: '24px' }}>
          <Zap size={32} color="#10b981" style={{ margin: '0 auto 12px' }} />
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 800, color: 'white', marginBottom: '8px' }}>
            Generate an Allergen-Free Diet Plan
          </h3>
          <p style={{ color: '#cbd5e1', fontSize: '14px', marginBottom: '20px' }}>
            NutriAI strictly excludes all sources of {allergy.name} and guarantees safe macro distribution.
          </p>
          <Link href="/plan/generate" className="btn btn-primary btn-lg">
            Create Safe Plan
          </Link>
        </div>
      </main>
    </div>
  );
}

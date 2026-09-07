'use client';

import Link from 'next/link';
import { Leaf, Zap, Shield, BarChart2, Calendar, Brain, Check } from 'lucide-react';

export default function SignInPage() {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      background: 'radial-gradient(ellipse at 30% 50%, rgba(16,185,129,0.08) 0%, transparent 50%), linear-gradient(180deg, #0f172a 0%, #020617 100%)',
    }}>
      {/* Left Panel */}
      <div style={{
        flex: '0 0 50%', padding: '48px',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        background: 'rgba(6,95,70,0.06)', borderRight: '1px solid rgba(255,255,255,0.06)',
      }} className="hidden-mobile">
        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', width: 'fit-content' }}>
          <div style={{
            width: '40px', height: '40px', borderRadius: '12px',
            background: 'linear-gradient(135deg, #065f46, #10b981)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Leaf size={22} color="white" />
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '24px', color: 'white' }}>
            Nutri<span className="text-gradient-emerald">AI</span>
          </span>
        </Link>

        {/* Features List */}
        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '36px', fontWeight: 800, color: 'white', marginBottom: '40px', lineHeight: 1.2 }}>
            Your AI Nutritionist,<br />
            <span className="text-gradient-emerald">Designed for India</span>
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {[
              { icon: <Brain size={20} />, title: 'AI-Powered Plans', desc: 'Personalized for your diseases, allergies, and goals' },
              { icon: <Shield size={20} />, title: 'Medically Aware', desc: '100+ disease protocols, medication-food safety checks' },
              { icon: <BarChart2 size={20} />, title: '18 Calculators', desc: 'BMI, TDEE, BMR, body fat, macros and more' },
              { icon: <Calendar size={20} />, title: 'Meal Calendar', desc: 'Plan your full week and month with drag-and-drop' },
            ].map(f => (
              <div key={f.title} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{
                  width: '44px', height: '44px', borderRadius: '12px', flexShrink: 0,
                  background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981',
                }}>
                  {f.icon}
                </div>
                <div>
                  <div style={{ fontWeight: 600, color: 'white', fontSize: '15px', marginBottom: '2px' }}>{f.title}</div>
                  <div style={{ color: '#64748b', fontSize: '13px', lineHeight: 1.5 }}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trust Footer */}
        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
          {['Free forever', 'No credit card', 'Google Sign-In', 'USDA + ICMR data'].map(item => (
            <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#475569', fontSize: '13px' }}>
              <Check size={14} color="#10b981" />
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel — Sign In Form */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 24px',
      }}>
        <div style={{ width: '100%', maxWidth: '400px' }}>
          {/* Mobile Logo */}
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <div style={{
              width: '56px', height: '56px', borderRadius: '16px',
              background: 'linear-gradient(135deg, #065f46, #10b981)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px', boxShadow: '0 8px 24px rgba(16,185,129,0.4)',
            }}>
              <Leaf size={28} color="white" />
            </div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 800, color: 'white', marginBottom: '8px' }}>
              Sign In to NutriAI
            </h1>
            <p style={{ color: '#64748b', fontSize: '15px' }}>
              One-click sign in. No passwords needed.
            </p>
          </div>

          {/* Google Sign-In Button */}
          <a
            href="/api/auth/signin/google"
            onClick={(e) => {
              // Store session in localStorage for immediate client-side persistence
              localStorage.setItem('nutriai_user', JSON.stringify({
                name: 'Aditya Sharma',
                email: 'aditya@example.com',
                isLoggedIn: true,
                tier: 'Free',
              }));
            }}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
              width: '100%', padding: '16px', borderRadius: '14px',
              background: 'white', border: 'none', cursor: 'pointer',
              fontWeight: 600, fontSize: '16px', color: '#1a1a1a',
              textDecoration: 'none',
              boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
              transition: 'all 0.2s ease',
              marginBottom: '16px',
            }}
            onMouseOver={e => {
              (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-2px)';
              (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 8px 32px rgba(0,0,0,0.4)';
            }}
            onMouseOut={e => {
              (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(0)';
              (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)';
            }}
          >
            {/* Google SVG Icon */}
            <svg width="22" height="22" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </a>

          {/* Quick Demo Access Button */}
          <Link
            href="/dashboard"
            onClick={() => {
              localStorage.setItem('nutriai_user', JSON.stringify({
                name: 'Demo User',
                email: 'demo@nutriai.health',
                isLoggedIn: true,
                tier: 'Free',
              }));
            }}
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', marginBottom: '20px', padding: '14px', fontSize: '15px' }}
          >
            <Zap size={18} /> Instant One-Click Sign In
          </Link>

          {/* Demo Link */}
          <div style={{
            background: 'rgba(30,41,59,0.6)', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '12px', padding: '16px', textAlign: 'center',
          }}>
            <div style={{ color: '#64748b', fontSize: '13px', marginBottom: '8px' }}>
              Want to start onboarding directly?
            </div>
            <Link href="/onboarding" className="btn btn-outline btn-sm" style={{ width: '100%', justifyContent: 'center' }}>
              Start New Onboarding →
            </Link>
          </div>

          {/* Legal */}
          <p style={{ color: '#334155', fontSize: '12px', textAlign: 'center', marginTop: '24px', lineHeight: 1.6 }}>
            By continuing, you agree to our{' '}
            <a href="#" style={{ color: '#10b981', textDecoration: 'none' }}>Terms of Service</a>
            {' '}and{' '}
            <a href="#" style={{ color: '#10b981', textDecoration: 'none' }}>Privacy Policy</a>.
            Your health data is encrypted and never shared.
          </p>
        </div>
      </div>
    </div>
  );
}

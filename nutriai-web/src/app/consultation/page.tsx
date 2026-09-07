'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Calendar, Clock, Video, MessageSquare, Star, Award,
  ShieldCheck, Check, ChevronRight, User, X, Sparkles, Filter
} from 'lucide-react';

interface Dietitian {
  id: string;
  name: string;
  title: string;
  credentials: string;
  avatar: string;
  specialties: string[];
  experienceYears: number;
  rating: number;
  reviewCount: number;
  fee: number;
  nextSlot: string;
  bio: string;
  languages: string[];
}

const DIETITIANS: Dietitian[] = [
  {
    id: 'dr-sneha-sharma',
    name: 'Dr. Sneha Sharma',
    title: 'Chief Clinical Dietitian & Metabolic Specialist',
    credentials: 'PhD, RD, CDE (Certified Diabetes Educator)',
    avatar: 'SS',
    specialties: ['Diabetes & Metabolic', 'Cardiovascular / DASH', 'Gut Health & Allergies'],
    experienceYears: 14,
    rating: 4.9,
    reviewCount: 1420,
    fee: 999,
    nextSlot: 'Today at 4:30 PM IST',
    bio: 'Specialized in reversing insulin resistance, glycemic load modulation, and diabetic nephropathy nutrition protocols.',
    languages: ['English', 'Hindi'],
  },
  {
    id: 'vikram-sethi',
    name: 'Vikram Sethi',
    title: 'Lead Sports Nutritionist & Athletic Performance Coach',
    credentials: 'MSc Clinical Nutrition, CSN, ISSN',
    avatar: 'VS',
    specialties: ['Sports & Muscle', 'Diabetes & Metabolic'],
    experienceYears: 9,
    rating: 4.9,
    reviewCount: 890,
    fee: 899,
    nextSlot: 'Tomorrow at 11:00 AM IST',
    bio: 'Works with competitive athletes, bodybuilders, and fitness enthusiasts optimizing nutrient timing and hypertrophy.',
    languages: ['English', 'Hindi', 'Punjabi'],
  },
  {
    id: 'ananya-roy',
    name: 'Ananya Roy',
    title: 'Women’s Health & Hormonal Nutrition Expert',
    credentials: 'RD, MSc Food & Nutrition',
    avatar: 'AR',
    specialties: ['PCOS & Hormonal', 'Gut Health & Allergies'],
    experienceYears: 11,
    rating: 4.8,
    reviewCount: 1150,
    fee: 799,
    nextSlot: 'Today at 6:00 PM IST',
    bio: 'Evidence-based protocols for PCOS, thyroid health, anti-inflammatory nutrition, and pregnancy wellness.',
    languages: ['English', 'Hindi', 'Bengali'],
  },
  {
    id: 'dr-rajesh-kulkarni',
    name: 'Dr. Rajesh Kulkarni',
    title: 'Senior Cardiac & Renal Nutrition Consultant',
    credentials: 'MD (Integrative Medicine), Dip. Diab',
    avatar: 'RK',
    specialties: ['Cardiovascular / DASH', 'Diabetes & Metabolic'],
    experienceYears: 18,
    rating: 5.0,
    reviewCount: 1680,
    fee: 1199,
    nextSlot: 'Tomorrow at 3:30 PM IST',
    bio: 'Pioneer in low-sodium DASH diets, lipid profile normalization, and Stage 2/3 CKD protein modulation.',
    languages: ['English', 'Hindi', 'Marathi'],
  },
  {
    id: 'priya-nair',
    name: 'Priya Nair',
    title: 'Pediatric & Clinical Food Allergy Specialist',
    credentials: 'RD, Pediatric Nutrition Certified (AIIMS)',
    avatar: 'PN',
    specialties: ['Gut Health & Allergies', 'PCOS & Hormonal'],
    experienceYears: 8,
    rating: 4.8,
    reviewCount: 640,
    fee: 749,
    nextSlot: 'Wednesday at 10:00 AM IST',
    bio: 'Specialized in elimination diets, celiac disease, IBS low-FODMAP protocols, and histamine intolerance management.',
    languages: ['English', 'Hindi', 'Malayalam'],
  },
];

const CATEGORIES = [
  'All Specialists',
  'Diabetes & Metabolic',
  'PCOS & Hormonal',
  'Sports & Muscle',
  'Cardiovascular / DASH',
  'Gut Health & Allergies',
];

export default function ConsultationPage() {
  const [selectedCategory, setSelectedCategory] = useState('All Specialists');
  const [activeDietitian, setActiveDietitian] = useState<Dietitian | null>(null);
  const [sessionType, setSessionType] = useState<'video' | 'chat'>('video');
  const [selectedDate, setSelectedDate] = useState('Today (Aug 4)');
  const [selectedTime, setSelectedTime] = useState('04:30 PM IST');
  const [patientNotes, setPatientNotes] = useState('Looking for customized diabetic-safe meal plan review and breakfast alternatives.');
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const filteredDietitians = selectedCategory === 'All Specialists'
    ? DIETITIANS
    : DIETITIANS.filter(d => d.specialties.includes(selectedCategory));

  const handleOpenBooking = (dietitian: Dietitian) => {
    setActiveDietitian(dietitian);
    setBookingSuccess(false);
  };

  const handleConfirmBooking = () => {
    setBookingSuccess(true);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)', color: 'var(--color-text)' }}>
      {/* Navigation */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 40,
        background: 'rgba(10, 15, 30, 0.85)', backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '16px 0',
      }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '10px',
              background: 'linear-gradient(135deg, #10b981, #065f46)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 800, color: 'white', fontSize: '18px',
            }}>N</div>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '20px', color: 'white' }}>
              Nutri<span style={{ color: '#10b981' }}>AI</span>
            </span>
          </Link>

          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <Link href="/dashboard" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '14px', fontWeight: 500 }}>
              Dashboard
            </Link>
            <Link href="/food" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '14px', fontWeight: 500 }}>
              Food Database
            </Link>
            <Link href="/calculators" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '14px', fontWeight: 500 }}>
              Calculators
            </Link>
            <Link href="/plan/generate" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '14px', fontWeight: 500 }}>
              Diet Plan
            </Link>
            <Link href="/dashboard" className="btn btn-primary btn-sm">
              My Account
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Header */}
      <div style={{ padding: '60px 0 40px', background: 'radial-gradient(ellipse at 50% 0%, rgba(16,185,129,0.12) 0%, transparent 60%)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '6px 14px', borderRadius: '100px',
            background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)',
            color: '#10b981', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase',
            letterSpacing: '0.06em', marginBottom: '16px',
          }}>
            <ShieldCheck size={16} /> Verified Clinical Nutritionists & Dietitians
          </div>
          <h1 style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(32px, 5vw, 48px)',
            fontWeight: 800, color: 'white', marginBottom: '16px', letterSpacing: '-0.02em',
          }}>
            1-on-1 Dietitian <span style={{ color: '#10b981' }}>Consultations</span>
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '16px', maxWidth: '640px', margin: '0 auto', lineHeight: 1.6 }}>
            Connect with board-certified clinical dietitians. Review your AI meal plan, manage medical health conditions, and get tailored clinical guidance.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container" style={{ paddingBottom: '80px' }}>
        {/* Category Filters */}
        <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '20px', marginBottom: '32px' }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '10px 18px', borderRadius: '12px',
                background: selectedCategory === cat ? '#065f46' : 'rgba(255,255,255,0.04)',
                border: selectedCategory === cat ? '1px solid #10b981' : '1px solid rgba(255,255,255,0.08)',
                color: selectedCategory === cat ? 'white' : '#94a3b8',
                fontWeight: 600, fontSize: '13px', cursor: 'pointer',
                whiteSpace: 'nowrap', transition: 'all 0.2s ease',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Dietitian Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px' }}>
          {filteredDietitians.map(d => (
            <div
              key={d.id}
              className="card card-glow"
              style={{
                padding: '24px', borderRadius: '20px',
                background: '#1e293b', border: '1px solid rgba(255,255,255,0.08)',
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
              }}
            >
              <div>
                {/* Header Row */}
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '16px' }}>
                  <div style={{
                    width: '60px', height: '60px', borderRadius: '18px',
                    background: 'linear-gradient(135deg, #065f46, #047857)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 800, color: 'white', fontSize: '20px', border: '2px solid rgba(16,185,129,0.3)',
                  }}>
                    {d.avatar}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <h3 style={{ color: 'white', fontWeight: 800, fontSize: '18px', margin: 0 }}>
                        {d.name}
                      </h3>
                      <Award size={16} color="#10b981" />
                    </div>
                    <div style={{ color: '#10b981', fontSize: '12px', fontWeight: 600, marginTop: '2px' }}>
                      {d.credentials}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                      <Star size={14} fill="#f59e0b" color="#f59e0b" />
                      <span style={{ color: 'white', fontWeight: 700, fontSize: '13px' }}>{d.rating}</span>
                      <span style={{ color: '#64748b', fontSize: '12px' }}>({d.reviewCount} sessions)</span>
                    </div>
                  </div>
                </div>

                <p style={{ color: '#94a3b8', fontSize: '13px', lineHeight: 1.5, marginBottom: '16px' }}>
                  {d.bio}
                </p>

                {/* Specialties Tags */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                  {d.specialties.map(s => (
                    <span
                      key={s}
                      style={{
                        padding: '4px 10px', borderRadius: '8px',
                        background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.18)',
                        color: '#a7f3d0', fontSize: '11px', fontWeight: 600,
                      }}
                    >
                      {s}
                    </span>
                  ))}
                </div>

                {/* Next Slot */}
                <div style={{
                  padding: '10px 14px', borderRadius: '10px',
                  background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)',
                  display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px',
                }}>
                  <Clock size={15} color="#10b981" />
                  <span style={{ color: '#94a3b8', fontSize: '12px' }}>Available:</span>
                  <span style={{ color: 'white', fontSize: '12px', fontWeight: 700 }}>{d.nextSlot}</span>
                </div>
              </div>

              {/* Bottom Action */}
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.06)',
              }}>
                <div>
                  <div style={{ color: '#64748b', fontSize: '11px', textTransform: 'uppercase', fontWeight: 700 }}>Session Fee</div>
                  <div style={{ color: 'white', fontWeight: 800, fontSize: '20px' }}>
                    ₹{d.fee} <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 400 }}>/ 45 min</span>
                  </div>
                </div>

                <button
                  onClick={() => handleOpenBooking(d)}
                  className="btn btn-primary btn-sm"
                  style={{ padding: '10px 20px', fontWeight: 700 }}
                >
                  <Video size={16} /> Book Session
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── BOOKING MODAL ──────────────────────────────────────────────── */}
      {activeDietitian && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 100,
          background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px',
        }}>
          <div style={{
            background: '#0f172a', borderRadius: '24px', width: '100%', maxWidth: '580px',
            border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
            overflow: 'hidden', maxHeight: '90vh', display: 'flex', flexDirection: 'column',
          }}>
            {/* Modal Header */}
            <div style={{
              padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.08)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '32px', height: '32px', borderRadius: '10px',
                  background: 'rgba(16,185,129,0.15)', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', color: '#10b981',
                }}>
                  <Calendar size={18} />
                </div>
                <h3 style={{ color: 'white', fontWeight: 800, fontSize: '18px', margin: 0 }}>
                  Schedule Consultation
                </h3>
              </div>
              <button
                onClick={() => setActiveDietitian(null)}
                style={{
                  background: 'transparent', border: 'none', color: '#94a3b8',
                  cursor: 'pointer', padding: '4px',
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '24px', overflowY: 'auto' }}>
              {bookingSuccess ? (
                <div style={{ textAlign: 'center', padding: '30px 10px' }}>
                  <div style={{
                    width: '64px', height: '64px', borderRadius: '50%',
                    background: 'rgba(16,185,129,0.15)', color: '#10b981',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 20px', border: '2px solid #10b981',
                  }}>
                    <Check size={32} />
                  </div>
                  <h3 style={{ color: 'white', fontSize: '22px', fontWeight: 800, marginBottom: '8px' }}>
                    Consultation Confirmed!
                  </h3>
                  <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: 1.6, maxWidth: '420px', margin: '0 auto 24px' }}>
                    Your session with <strong style={{ color: 'white' }}>{activeDietitian.name}</strong> has been scheduled for <strong style={{ color: '#10b981' }}>{selectedDate} at {selectedTime}</strong>.
                  </p>

                  <div style={{
                    background: 'rgba(255,255,255,0.03)', borderRadius: '14px', padding: '16px',
                    border: '1px solid rgba(255,255,255,0.07)', textAlign: 'left', marginBottom: '24px',
                  }}>
                    <div style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, marginBottom: '6px' }}>Meeting Details</div>
                    <div style={{ color: 'white', fontSize: '13px', fontWeight: 600 }}>📹 Google Meet: meet.google.com/nutriai-{activeDietitian.id.substring(0, 7)}</div>
                    <div style={{ color: '#94a3b8', fontSize: '12px', marginTop: '4px' }}>Calendar invite and preparation instructions sent to demo@example.com</div>
                  </div>

                  <button
                    onClick={() => setActiveDietitian(null)}
                    className="btn btn-primary"
                    style={{ width: '100%', justifyContent: 'center', padding: '12px' }}
                  >
                    Done & Return to Dietitians
                  </button>
                </div>
              ) : (
                <>
                  {/* Selected Specialist Info */}
                  <div style={{
                    display: 'flex', gap: '14px', alignItems: 'center',
                    background: 'rgba(255,255,255,0.03)', padding: '14px',
                    borderRadius: '14px', marginBottom: '20px', border: '1px solid rgba(255,255,255,0.06)',
                  }}>
                    <div style={{
                      width: '44px', height: '44px', borderRadius: '12px',
                      background: '#065f46', display: 'flex', alignItems: 'center',
                      justifyContent: 'center', color: 'white', fontWeight: 800,
                    }}>
                      {activeDietitian.avatar}
                    </div>
                    <div>
                      <div style={{ color: 'white', fontWeight: 700, fontSize: '15px' }}>{activeDietitian.name}</div>
                      <div style={{ color: '#10b981', fontSize: '12px' }}>{activeDietitian.title}</div>
                    </div>
                  </div>

                  {/* Session Type */}
                  <div style={{ marginBottom: '18px' }}>
                    <label style={{ display: 'block', color: '#94a3b8', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px' }}>
                      Session Format
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <button
                        onClick={() => setSessionType('video')}
                        style={{
                          padding: '12px', borderRadius: '12px', textAlign: 'left',
                          background: sessionType === 'video' ? 'rgba(16,185,129,0.12)' : 'rgba(255,255,255,0.03)',
                          border: sessionType === 'video' ? '1.5px solid #10b981' : '1px solid rgba(255,255,255,0.08)',
                          color: sessionType === 'video' ? 'white' : '#94a3b8', cursor: 'pointer',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '13px' }}>
                          <Video size={16} color="#10b981" /> 1-on-1 Video Call
                        </div>
                        <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>45 mins clinical review</div>
                      </button>

                      <button
                        onClick={() => setSessionType('chat')}
                        style={{
                          padding: '12px', borderRadius: '12px', textAlign: 'left',
                          background: sessionType === 'chat' ? 'rgba(16,185,129,0.12)' : 'rgba(255,255,255,0.03)',
                          border: sessionType === 'chat' ? '1.5px solid #10b981' : '1px solid rgba(255,255,255,0.08)',
                          color: sessionType === 'chat' ? 'white' : '#94a3b8', cursor: 'pointer',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '13px' }}>
                          <MessageSquare size={16} color="#10b981" /> 7-Day Chat Care
                        </div>
                        <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>Daily meal audits via app</div>
                      </button>
                    </div>
                  </div>

                  {/* Date Picker */}
                  <div style={{ marginBottom: '18px' }}>
                    <label style={{ display: 'block', color: '#94a3b8', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px' }}>
                      Select Date
                    </label>
                    <div style={{ display: 'flex', gap: '8px', overflowX: 'auto' }}>
                      {['Today (Aug 4)', 'Tomorrow (Aug 5)', 'Wed (Aug 6)', 'Thu (Aug 7)'].map(date => (
                        <button
                          key={date}
                          onClick={() => setSelectedDate(date)}
                          style={{
                            padding: '8px 14px', borderRadius: '10px',
                            background: selectedDate === date ? '#065f46' : 'rgba(255,255,255,0.04)',
                            border: selectedDate === date ? '1px solid #10b981' : '1px solid rgba(255,255,255,0.08)',
                            color: selectedDate === date ? 'white' : '#94a3b8',
                            fontSize: '12px', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap',
                          }}
                        >
                          {date}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Time Slot Picker */}
                  <div style={{ marginBottom: '18px' }}>
                    <label style={{ display: 'block', color: '#94a3b8', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px' }}>
                      Select Time Slot
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                      {['10:30 AM IST', '02:00 PM IST', '04:30 PM IST', '06:00 PM IST', '07:30 PM IST', '09:00 PM IST'].map(slot => (
                        <button
                          key={slot}
                          onClick={() => setSelectedTime(slot)}
                          style={{
                            padding: '8px', borderRadius: '10px',
                            background: selectedTime === slot ? '#065f46' : 'rgba(255,255,255,0.04)',
                            border: selectedTime === slot ? '1px solid #10b981' : '1px solid rgba(255,255,255,0.08)',
                            color: selectedTime === slot ? 'white' : '#94a3b8',
                            fontSize: '11px', fontWeight: 600, cursor: 'pointer', textAlign: 'center',
                          }}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Patient Health Notes */}
                  <div style={{ marginBottom: '24px' }}>
                    <label style={{ display: 'block', color: '#94a3b8', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px' }}>
                      Primary Discussion Goals & Notes
                    </label>
                    <textarea
                      value={patientNotes}
                      onChange={e => setPatientNotes(e.target.value)}
                      rows={3}
                      style={{
                        width: '100%', background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px',
                        padding: '12px', color: 'white', fontSize: '13px', resize: 'none',
                      }}
                    />
                    <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                      🔒 Automatically shared with your dietitian: Type 2 Diabetes protocol, Peanut allergy filter.
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    onClick={handleConfirmBooking}
                    className="btn btn-primary"
                    style={{
                      width: '100%', justifyContent: 'center', padding: '14px',
                      fontWeight: 700, fontSize: '15px',
                    }}
                  >
                    Confirm Booking (₹{activeDietitian.fee})
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

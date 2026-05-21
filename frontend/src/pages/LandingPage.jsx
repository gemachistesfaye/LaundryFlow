import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  Shirt, Activity, Truck, CreditCard, Shield, Zap, Star, ArrowRight,
  CheckCircle, Users, Package, TrendingUp, ChevronDown, Bot, Menu, X
} from 'lucide-react';

const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Stats', href: '#stats' },
];

const FEATURES = [
  { icon: Activity, label: 'Real-Time Tracking', desc: 'Track every item from submission to delivery with unique WASH codes and live status updates.', color: '#6366f1', glow: 'rgba(99,102,241,0.25)' },
  { icon: Bot, label: 'AI Assistant', desc: 'Smart chatbot predicts delivery times, answers queries, and provides admin insights.', color: '#8b5cf6', glow: 'rgba(139,92,246,0.25)' },
  { icon: Truck, label: 'Smart Delivery', desc: 'Integrated dispatch system gets clean clothes back to student dorms in record time.', color: '#06b6d4', glow: 'rgba(6,182,212,0.25)' },
  { icon: CreditCard, label: 'Digital Payments', desc: 'Pay securely via Telebirr or CBE. Wallet balance, payment history, all in one place.', color: '#10b981', glow: 'rgba(16,185,129,0.25)' },
  { icon: Shield, label: 'Zero Lost Items', desc: 'Every garment gets a unique QR tracking code. Losses are mathematically impossible.', color: '#f59e0b', glow: 'rgba(245,158,11,0.25)' },
  { icon: TrendingUp, label: 'Admin Analytics', desc: 'Revenue dashboards, workload heatmaps, and AI-powered operational insights.', color: '#ef4444', glow: 'rgba(239,68,68,0.25)' },
];

const STEPS = [
  { step: '01', title: 'Submit Your Laundry', desc: 'Choose your items, set quantity, add notes — create an order in under 60 seconds.', icon: Package },
  { step: '02', title: 'Workers Process It', desc: 'Your assigned worker washes, dries and packages your clothes with care.', icon: Shirt },
  { step: '03', title: 'Delivery to Your Door', desc: 'A dedicated deliverer brings your clean laundry directly to your dorm.', icon: Truck },
];

const STATS = [
  { value: '5,000+', label: 'Active Students', icon: Users },
  { value: '124K', label: 'Orders Completed', icon: CheckCircle },
  { value: '0%', label: 'Lost Items', icon: Shield },
  { value: '12', label: 'Partner Campuses', icon: Star },
];

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div style={{ background: '#0a0a0f', color: '#f1f5f9', minHeight: '100vh', fontFamily: 'Inter, sans-serif', overflowX: 'hidden' }}>

      {/* ── Navbar ── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        padding: '0 32px', height: 68,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: scrolled ? 'rgba(10,10,15,0.9)' : 'transparent',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        transition: 'all 0.3s',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Shirt size={20} color="white" />
          </div>
          <span style={{ fontWeight: 800, fontSize: 18, letterSpacing: '-0.5px' }}>LaundryFlow</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }} className="hidden-mobile">
          {NAV_LINKS.map(l => (
            <a key={l.label} href={l.href} style={{ color: 'rgba(241,245,249,0.6)', fontSize: 14, fontWeight: 500, textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={e => e.target.style.color = '#f1f5f9'}
              onMouseLeave={e => e.target.style.color = 'rgba(241,245,249,0.6)'}>
              {l.label}
            </a>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Link to="/login" style={{ padding: '9px 20px', borderRadius: 10, fontSize: 14, fontWeight: 600, color: 'rgba(241,245,249,0.7)', textDecoration: 'none', transition: 'color 0.2s' }}
            onMouseEnter={e => e.target.style.color = '#f1f5f9'}
            onMouseLeave={e => e.target.style.color = 'rgba(241,245,249,0.7)'}>
            Sign In
          </Link>
          <Link to="/register" style={{
            padding: '9px 22px', borderRadius: 12, fontSize: 14, fontWeight: 700,
            background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
            color: 'white', textDecoration: 'none',
            boxShadow: '0 4px 20px rgba(99,102,241,0.35)',
            transition: 'all 0.2s',
          }}
            onMouseEnter={e => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 8px 30px rgba(99,102,241,0.45)'; }}
            onMouseLeave={e => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 4px 20px rgba(99,102,241,0.35)'; }}>
            Get Started
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', paddingTop: 68 }}>
        {/* BG Orbs */}
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.04) 1px, transparent 0)', backgroundSize: '40px 40px' }} />

        <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', maxWidth: 860, margin: '0 auto', padding: '0 24px' }}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}>

            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 999, background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)', marginBottom: 32 }}>
              <Zap size={13} color="#818cf8" />
              <span style={{ fontSize: 12, fontWeight: 600, color: '#818cf8', letterSpacing: '0.5px' }}>UNIVERSITY LAUNDRY MANAGEMENT SYSTEM</span>
            </div>

            <h1 style={{ fontSize: 'clamp(40px, 7vw, 80px)', fontWeight: 900, lineHeight: 1.05, letterSpacing: '-2px', marginBottom: 24 }}>
              Campus Laundry,{' '}
              <span className="gradient-text">Reimagined</span>
              <br />for the Digital Age.
            </h1>

            <p style={{ fontSize: 'clamp(16px, 2vw, 20px)', color: 'rgba(241,245,249,0.55)', lineHeight: 1.7, maxWidth: 580, margin: '0 auto 40px', fontWeight: 400 }}>
              Real-time tracking, AI assistance, seamless payments, and zero lost items. LaundryFlow transforms how universities manage laundry.
            </p>

            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/register" style={{
                padding: '14px 32px', borderRadius: 14, fontSize: 15, fontWeight: 700,
                background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8,
                boxShadow: '0 8px 40px rgba(99,102,241,0.4)',
                transition: 'all 0.25s',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 16px 50px rgba(99,102,241,0.5)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 40px rgba(99,102,241,0.4)'; }}>
                Start for Free <ArrowRight size={16} />
              </Link>
              <Link to="/login" style={{
                padding: '14px 32px', borderRadius: 14, fontSize: 15, fontWeight: 600,
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                color: 'rgba(241,245,249,0.8)', textDecoration: 'none',
                backdropFilter: 'blur(10px)', transition: 'all 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.09)'; e.currentTarget.style.color = '#f1f5f9'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'rgba(241,245,249,0.8)'; }}>
                Track My Laundry
              </Link>
            </div>
          </motion.div>
        </div>

        <div style={{ position: 'absolute', bottom: 40, left: '50%', transform: 'translateX(-50%)', animation: 'bounce 2s infinite' }}>
          <ChevronDown size={24} color="rgba(241,245,249,0.3)" />
        </div>
      </section>

      {/* ── Stats ── */}
      <section id="stats" style={{ padding: '60px 24px', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 24 }}>
          {STATS.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 20, padding: '28px 24px', textAlign: 'center' }}>
              <s.icon size={24} color="#6366f1" style={{ margin: '0 auto 12px' }} />
              <div style={{ fontSize: 36, fontWeight: 900, letterSpacing: '-1px', background: 'linear-gradient(135deg,#818cf8,#6366f1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{s.value}</div>
              <div style={{ fontSize: 13, color: 'rgba(241,245,249,0.45)', fontWeight: 500, marginTop: 6 }}>{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: 60 }}>
            <div style={{ display: 'inline-block', padding: '5px 16px', borderRadius: 999, background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', fontSize: 12, fontWeight: 700, color: '#818cf8', letterSpacing: '1px', marginBottom: 20 }}>FEATURES</div>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 46px)', fontWeight: 800, letterSpacing: '-1px', marginBottom: 16 }}>Everything you need, nothing you don't</h2>
            <p style={{ fontSize: 16, color: 'rgba(241,245,249,0.5)', maxWidth: 520, margin: '0 auto' }}>Enterprise-grade laundry management built specifically for university campuses.</p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
            {FEATURES.map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 20, padding: '28px', cursor: 'default', transition: 'border-color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = `rgba(${f.color === '#6366f1' ? '99,102,241' : f.color === '#8b5cf6' ? '139,92,246' : '255,255,255'},0.2)`}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: `${f.color}18`, border: `1px solid ${f.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                  <f.icon size={22} color={f.color} />
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 10, letterSpacing: '-0.3px' }}>{f.label}</h3>
                <p style={{ fontSize: 14, color: 'rgba(241,245,249,0.5)', lineHeight: 1.7 }}>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="how-it-works" style={{ padding: '80px 24px', background: 'rgba(255,255,255,0.015)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: 60 }}>
            <div style={{ display: 'inline-block', padding: '5px 16px', borderRadius: 999, background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.2)', fontSize: 12, fontWeight: 700, color: '#22d3ee', letterSpacing: '1px', marginBottom: 20 }}>HOW IT WORKS</div>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 46px)', fontWeight: 800, letterSpacing: '-1px' }}>From dirty to delivered in 3 steps</h2>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 32, position: 'relative' }}>
            {STEPS.map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                style={{ textAlign: 'center', padding: '32px 24px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 24 }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: '#6366f1', letterSpacing: '2px', marginBottom: 20 }}>{s.step}</div>
                <div style={{ width: 56, height: 56, borderRadius: 16, background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                  <s.icon size={26} color="#818cf8" />
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12, letterSpacing: '-0.3px' }}>{s.title}</h3>
                <p style={{ fontSize: 14, color: 'rgba(241,245,249,0.5)', lineHeight: 1.7 }}>{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
            style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.1))', border: '1px solid rgba(99,102,241,0.25)', borderRadius: 28, padding: '56px 40px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: -60, right: -60, width: 200, height: 200, background: '#6366f1', borderRadius: '50%', filter: 'blur(80px)', opacity: 0.15 }} />
            <Shirt size={40} color="#818cf8" style={{ margin: '0 auto 20px' }} />
            <h2 style={{ fontSize: 'clamp(26px, 4vw, 40px)', fontWeight: 800, marginBottom: 16, letterSpacing: '-1px' }}>Ready to experience the future of campus laundry?</h2>
            <p style={{ fontSize: 16, color: 'rgba(241,245,249,0.55)', marginBottom: 36, lineHeight: 1.7 }}>Join thousands of students who never worry about lost or delayed laundry.</p>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/register" style={{ padding: '13px 28px', borderRadius: 12, fontSize: 15, fontWeight: 700, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: 'white', textDecoration: 'none', boxShadow: '0 8px 30px rgba(99,102,241,0.4)', display: 'flex', alignItems: 'center', gap: 8 }}>
                Get Started Free <ArrowRight size={16} />
              </Link>
              <Link to="/login" style={{ padding: '13px 28px', borderRadius: 12, fontSize: 15, fontWeight: 600, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(241,245,249,0.8)', textDecoration: 'none' }}>
                Sign In
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '32px 24px', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center', marginBottom: 12 }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Shirt size={16} color="white" />
          </div>
          <span style={{ fontWeight: 800, fontSize: 16 }}>LaundryFlow</span>
        </div>
        <p style={{ fontSize: 13, color: 'rgba(241,245,249,0.3)' }}>© 2026 LaundryFlow Systems · Built for INSA University</p>
      </footer>

      <style>{`
        @keyframes bounce { 0%,100%{transform:translateX(-50%) translateY(0)} 50%{transform:translateX(-50%) translateY(-10px)} }
        @media (max-width: 768px) { .hidden-mobile { display: none !important; } }
      `}</style>
    </div>
  );
}

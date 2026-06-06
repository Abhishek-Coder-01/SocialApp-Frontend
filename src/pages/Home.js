import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles, Zap, Shield, Heart, Share2, Compass, ArrowRight, Star,
  Users, TrendingUp, MessageCircle, Play, ChevronRight, Check, X,
  ArrowUpRight, Quote
} from 'lucide-react';

/* ─── Google Fonts injection ─────────────────────────────────────────── */
const FONTS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
`;

/* ─── Animated Number ────────────────────────────────────────────────── */
function AnimCount({ end, suffix = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let s = 0;
    const step = (end / 1600) * 16;
    const t = setInterval(() => {
      s += step;
      if (s >= end) { setVal(end); clearInterval(t); }
      else setVal(s);
    }, 16);
    return () => clearInterval(t);
  }, [inView, end]);
  const display = Number.isInteger(end) ? Math.floor(val) : val.toFixed(1);
  return <span ref={ref}>{display}{suffix}</span>;
}

/* ─── Feature Card ───────────────────────────────────────────────────── */
function FeatureCard({ icon: Icon, title, desc, accent, index }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.07 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      style={{
        padding: '32px',
        borderRadius: 20,
        background: hovered ? '#fff' : '#FAFAF8',
        border: `1.5px solid ${hovered ? accent + '44' : '#E8E4DC'}`,
        boxShadow: hovered ? `0 20px 60px ${accent}18, 0 4px 16px rgba(0,0,0,0.06)` : '0 2px 8px rgba(0,0,0,0.04)',
        transition: 'all 0.3s cubic-bezier(0.34,1.56,0.64,1)',
        cursor: 'default',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <motion.div animate={{ scale: hovered ? 1.08 : 1 }} transition={{ duration: 0.3 }}
        style={{
          width: 52, height: 52, borderRadius: 16,
          background: accent + '15',
          border: `1.5px solid ${accent}30`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 22,
        }}
      >
        <Icon size={22} color={accent} strokeWidth={1.8} />
      </motion.div>
      <h3 style={{ fontSize: 17, fontWeight: 700, color: '#1A1510', marginBottom: 10, fontFamily: 'Plus Jakarta Sans', letterSpacing: '-0.02em' }}>
        {title}
      </h3>
      <p style={{ fontSize: 14, color: '#8B8070', lineHeight: 1.7, fontFamily: 'Plus Jakarta Sans', fontWeight: 400 }}>{desc}</p>
      <motion.div
        animate={{ opacity: hovered ? 1 : 0, x: hovered ? 0 : -8 }}
        transition={{ duration: 0.2 }}
        style={{ position: 'absolute', bottom: 24, right: 24 }}
      >
        <ArrowUpRight size={18} color={accent} />
      </motion.div>
    </motion.div>
  );
}

/* ─── Main ───────────────────────────────────────────────────────────── */
export default function Home() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();
  const [videoOpen, setVideoOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  const heroY = useTransform(scrollYProgress, [0, 0.4], [0, -40]);

  useEffect(() => {
    if (isAuthenticated) navigate('/feed', { replace: true });
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const t = setInterval(() => setActiveStep(s => (s + 1) % 4), 2800);
    return () => clearInterval(t);
  }, []);

  const features = [
    { icon: Zap, title: 'Real-time Feed', desc: 'Lightning-fast updates with live engagement metrics and instant community feedback.', accent: '#F97316' },
    { icon: Compass, title: 'Explore Hub', desc: 'AI-curated trending topics and personalized creator recommendations.', accent: '#8B5CF6' },
    { icon: Heart, title: 'Deep Engagement', desc: 'Rich reactions, threaded conversations, and meaningful connection metrics.', accent: '#EC4899' },
    { icon: Share2, title: 'Fluid Sharing', desc: 'Drag-and-drop uploads with auto-optimization and global CDN delivery.', accent: '#0EA5E9' },
    { icon: Shield, title: 'Enterprise Security', desc: 'End-to-end encryption and compliance with global privacy standards.', accent: '#10B981' },
    { icon: Sparkles, title: 'Creator Pro', desc: 'Custom themes, priority support, and exclusive tools for power creators.', accent: '#6366F1' },
  ];

  const stats = [
    { icon: Users, end: 50, suffix: 'K+', label: 'Active Creators', color: '#6366F1' },
    { icon: MessageCircle, end: 2.4, suffix: 'M', label: 'Daily Interactions', color: '#EC4899' },
    { icon: TrendingUp, end: 99.9, suffix: '%', label: 'Uptime SLA', color: '#10B981' },
    { icon: Star, end: 4.9, suffix: '/5', label: 'User Rating', color: '#F97316' },
  ];

  const steps = [
    { num: '01', title: 'Create your profile', desc: 'Set up your space in under 60 seconds with smart defaults and beautiful templates.' },
    { num: '02', title: 'Publish rich content', desc: 'Post stories, articles, and media using our intuitive drag-and-drop composer.' },
    { num: '03', title: 'Grow your audience', desc: 'Our discovery engine connects your content to the right people organically.' },
    { num: '04', title: 'Monetize & scale', desc: 'Unlock revenue tools, analytics, and premium features as your community grows.' },
  ];

  const testimonials = [
    { name: 'Priya Sharma', role: 'Digital Artist, Mumbai', text: 'I went from 500 to 28,000 followers in four months. The discovery engine is unlike anything else.', initials: 'PS', color: '#8B5CF6' },
    { name: 'Rahul Menon', role: 'Tech Blogger, Bangalore', text: 'Finally a platform designed for creators, not just advertisers. The writing tools are incredible.', initials: 'RM', color: '#0EA5E9' },
    { name: 'Sara Khan', role: 'Photographer, Delhi', text: 'The image quality and delivery speed is leagues above every other platform I\'ve tried.', initials: 'SK', color: '#EC4899' },
  ];

  return (
    <div style={{ background: '#F7F4EE', minHeight: '100vh', overflowX: 'hidden', color: '#1A1510' }}>
      <style>{`
        ${FONTS}
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        ::selection { background: #6366F11A; color: #1A1510; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: #F7F4EE; }
        ::-webkit-scrollbar-thumb { background: #D4CEBC; border-radius: 99px; }
        html { scroll-behavior: smooth; }
        @keyframes float { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-12px); } }
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes shimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
        
        /* Mobile responsive styles */
        @media (max-width: 1024px) {
          .hero-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
          .hero-section { padding: 100px 1.5rem 60px !important; min-height: auto !important; }
          .steps-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
          .footer-grid { grid-template-columns: 1fr 1fr !important; gap: 40px !important; }
        }
        
        @media (max-width: 768px) {
          .hero-section { padding: 80px 1rem 40px !important; }
          .hero-heading { font-size: 3rem !important; }
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .features-grid { grid-template-columns: 1fr !important; }
          .cta-section { padding: 40px !important; grid-template-columns: 1fr !important; text-align: center; }
          .footer-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
          .footer-bottom { flex-direction: column !important; text-align: center; gap: 16px !important; }
          .hero-ctas { flex-direction: column !important; width: 100% !important; }
          .hero-ctas button, .hero-ctas a { width: 100% !important; }
        }
        
        @media (max-width: 480px) {
          .hero-heading { font-size: 3rem !important; }
          .hero-sub { font-size: 15px !important; }
          .stats-grid { grid-template-columns: 1fr !important; }
          .hero-visual { display: none !important; }
          .testimonials-grid { grid-template-columns: 1fr !important; }
          .social-proof { flex-direction: column !important; align-items: flex-start !important; }
        }
      `}</style>

      {/* ── Decorative Background Shapes ─────────────────────────── */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -180, right: -120, width: 700, height: 700, borderRadius: '50%', background: 'radial-gradient(circle, #E0D9F6 0%, transparent 70%)', opacity: 0.6 }} />
        <div style={{ position: 'absolute', bottom: -200, left: -150, width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, #FDE9D5 0%, transparent 70%)', opacity: 0.7 }} />
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(0,0,0,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.025) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
        }} />
        <div className="decorative-shapes" style={{ position: 'absolute', top: '15%', left: '8%', width: 280, height: 280, borderRadius: '50%', border: '1px dashed #D4CEBC', opacity: 0.5 }} />
        <div className="decorative-shapes" style={{ position: 'absolute', top: '18%', left: '11%', width: 180, height: 180, borderRadius: '50%', border: '1px dashed #D4CEBC', opacity: 0.4 }} />
        <div className="decorative-shapes" style={{ position: 'absolute', bottom: '25%', right: '6%', width: 200, height: 200, borderRadius: '50%', border: '1px dashed #D4CEBC', opacity: 0.5 }} />
      </div>

      {/* ══ HERO ════════════════════════════════════════════════════ */}
      <section id="home" className="hero-section" style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', padding: '120px 2rem 80px', zIndex: 1 }}>
        <div className="hero-grid" style={{ maxWidth: 1160, margin: '0 auto', width: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
          {/* Left content */}
          <motion.div style={{ y: heroY }}>
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '7px 16px', borderRadius: 99,
                background: '#EEF2FF', border: '1.5px solid #C7D2FE',
                fontFamily: 'Plus Jakarta Sans', fontSize: 12, fontWeight: 600,
                color: '#6366F1', marginBottom: 28, letterSpacing: '0.02em',
              }}
            >
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#6366F1', display: 'block' }} />
              Now in Public Beta
              <ChevronRight size={12} />
            </motion.div>

            {/* Heading */}
            <motion.h1
              className="hero-heading"
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
              style={{
                fontFamily: 'Playfair Display',
                fontSize: 'clamp(2.8rem, 5vw, 5rem)',
                fontWeight: 900,
                lineHeight: 1.06,
                letterSpacing: '-0.02em',
                color: '#1A1510',
                marginBottom: 24,
              }}
            >
              The future of<br />
              <em style={{ fontStyle: 'italic', color: '#6366F1' }}>social</em> is here.
            </motion.h1>

            {/* Sub */}
            <motion.p
              className="hero-sub"
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.22 }}
              style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 17, color: '#8B8070', lineHeight: 1.72, marginBottom: 36, fontWeight: 400, maxWidth: 460 }}
            >
              A beautifully crafted platform where creators thrive, communities flourish, and every interaction genuinely matters.
            </motion.p>

            {/* CTAs */}
            <motion.div
              className="hero-ctas"
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.32 }}
              style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 48 }}
            >
              <Link to="/signup" style={{ textDecoration: 'none' }}>
                <button style={{
                  fontFamily: 'Plus Jakarta Sans', fontSize: 15, fontWeight: 700,
                  padding: '15px 32px', borderRadius: 14,
                  background: '#1A1510', color: '#F7F4EE',
                  border: 'none', cursor: 'pointer',
                  boxShadow: '0 6px 24px rgba(26,21,16,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  transition: 'all 0.2s',
                  width: 'auto',
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(26,21,16,0.26)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 6px 24px rgba(26,21,16,0.2)'; }}
                >
                  Start creating free
                  <ArrowRight size={16} />
                </button>
              </Link>
              <button onClick={() => setVideoOpen(true)} style={{
                fontFamily: 'Plus Jakarta Sans', fontSize: 15, fontWeight: 600,
                padding: '15px 28px', borderRadius: 14,
                background: '#fff', color: '#1A1510',
                border: '1.5px solid #E8E4DC', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                transition: 'all 0.2s', boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                width: 'auto',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#C7C0B0'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#E8E4DC'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)'; }}
              >
                <div style={{ width: 30, height: 30, borderRadius: '50%', background: '#F0EDE6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Play size={12} fill="#1A1510" color="#1A1510" />
                </div>
                Watch demo
              </button>
            </motion.div>

            {/* Social proof */}
            <motion.div
              className="social-proof"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.5 }}
              style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}
            >
              <div style={{ display: 'flex' }}>
                {['#6366F1', '#EC4899', '#F97316', '#10B981', '#0EA5E9'].map((c, i) => (
                  <div key={i} style={{
                    width: 32, height: 32, borderRadius: '50%',
                    background: c, border: '2.5px solid #F7F4EE',
                    marginLeft: i > 0 ? -10 : 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, fontWeight: 700, color: '#fff',
                    fontFamily: 'Plus Jakarta Sans',
                  }}>
                    {['P', 'R', 'A', 'S', 'K'][i]}
                  </div>
                ))}
              </div>
              <div>
                <div style={{ display: 'flex', gap: 2, marginBottom: 2 }}>
                  {[...Array(5)].map((_, i) => <Star key={i} size={11} fill="#FBBF24" color="#FBBF24" />)}
                </div>
                <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 12, color: '#8B8070' }}>
                  <strong style={{ color: '#1A1510' }}>50,000+</strong> creators already joined
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right — Hero Visual */}
          <motion.div
            className="hero-visual"
            initial={{ opacity: 0, scale: 0.94, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
            style={{ position: 'relative' }}
          >
            {/* Main card */}
            <div style={{
              background: '#fff',
              borderRadius: 28,
              padding: '32px',
              boxShadow: '0 32px 80px rgba(0,0,0,0.1), 0 8px 24px rgba(0,0,0,0.06)',
              border: '1px solid #EDE9E0',
              position: 'relative',
            }}>
              {/* App header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#6366F1,#8B5CF6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Sparkles size={16} color="#fff" />
                  </div>
                  <div>
                    <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 13, fontWeight: 700, color: '#1A1510' }}>SocialApp</p>
                    <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 11, color: '#A09080' }}>Creator Dashboard</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center', padding: '6px 12px', borderRadius: 99, background: '#ECFDF5', border: '1px solid #A7F3D0' }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981', display: 'block' }} />
                  <span style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 11, fontWeight: 600, color: '#059669' }}>Live</span>
                </div>
              </div>

              {/* Stats row */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 24 }}>
                {[
                  { label: 'Followers', val: '24.8K', change: '+12%', color: '#6366F1' },
                  { label: 'Posts', val: '142', change: '+3', color: '#EC4899' },
                  { label: 'Reach', val: '1.2M', change: '+28%', color: '#10B981' },
                ].map((s, i) => (
                  <div key={i} style={{ padding: '14px', borderRadius: 14, background: '#F7F4EE', border: '1px solid #EDE9E0' }}>
                    <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 10, fontWeight: 500, color: '#A09080', marginBottom: 6, letterSpacing: '0.04em', textTransform: 'uppercase' }}>{s.label}</p>
                    <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 20, fontWeight: 800, color: '#1A1510', letterSpacing: '-0.03em', lineHeight: 1 }}>{s.val}</p>
                    <p style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: '#10B981', marginTop: 4, fontWeight: 500 }}>{s.change}</p>
                  </div>
                ))}
              </div>

              {/* Recent posts */}
              <div>
                <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 12, fontWeight: 600, color: '#A09080', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 12 }}>Recent Posts</p>
                {[
                  { title: 'Behind the design process', likes: '2.4K', time: '2h ago', color: '#6366F1' },
                  { title: 'My favorite tools for 2025', likes: '1.8K', time: '1d ago', color: '#F97316' },
                  { title: 'How I grew to 25K followers', likes: '5.1K', time: '3d ago', color: '#EC4899' },
                ].map((post, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '12px 0',
                    borderBottom: i < 2 ? '1px solid #F0ECE4' : 'none',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: post.color, flexShrink: 0 }} />
                      <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 13, fontWeight: 500, color: '#3A3028' }}>{post.title}</p>
                    </div>
                    <div style={{ display: 'flex', items: 'center', gap: 12 }}>
                      <span style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: '#A09080' }}>{post.likes}</span>
                      <span style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 11, color: '#C0B8A8' }}>{post.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Floating notification card */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                position: 'absolute', top: -24, right: -28,
                background: '#fff',
                borderRadius: 16,
                padding: '12px 16px',
                boxShadow: '0 12px 40px rgba(0,0,0,0.12)',
                border: '1px solid #EDE9E0',
                display: 'flex', alignItems: 'center', gap: 10,
                minWidth: 200,
              }}
            >
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#EC4899,#F97316)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#fff', fontFamily: 'Plus Jakarta Sans' }}>A</div>
              <div>
                <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 12, fontWeight: 700, color: '#1A1510' }}>New follower!</p>
                <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 11, color: '#A09080' }}>@aanya liked your post</p>
              </div>
              <Heart size={14} fill="#EC4899" color="#EC4899" />
            </motion.div>

            {/* Floating stat badge */}
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
              style={{
                position: 'absolute', bottom: -20, left: -28,
                background: '#fff',
                borderRadius: 16,
                padding: '12px 18px',
                boxShadow: '0 12px 40px rgba(0,0,0,0.1)',
                border: '1px solid #EDE9E0',
                display: 'flex', alignItems: 'center', gap: 10,
              }}
            >
              <div style={{ width: 32, height: 32, borderRadius: 10, background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <TrendingUp size={16} color="#6366F1" />
              </div>
              <div>
                <p style={{ fontFamily: 'JetBrains Mono', fontSize: 16, fontWeight: 700, color: '#1A1510', lineHeight: 1 }}>+28%</p>
                <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 11, color: '#A09080', marginTop: 2 }}>reach this week</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ══ STATS BAR ═══════════════════════════════════════════════ */}
      <section style={{ padding: '0 2rem 80px', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 1160, margin: '0 auto' }}>
          <motion.div
            className="stats-grid"
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            style={{
              display: 'grid', gridTemplateColumns: 'repeat(4,1fr)',
              background: '#fff',
              borderRadius: 20,
              border: '1.5px solid #EDE9E0',
              overflow: 'hidden',
              boxShadow: '0 4px 24px rgba(0,0,0,0.05)',
            }}
          >
            {stats.map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} style={{
                  padding: '28px 24px',
                  borderRight: i < 3 ? '1px solid #F0ECE4' : 'none',
                  textAlign: 'center',
                }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: s.color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                    <Icon size={18} color={s.color} strokeWidth={1.8} />
                  </div>
                  <div style={{ fontFamily: 'Playfair Display', fontSize: 32, fontWeight: 900, color: '#1A1510', letterSpacing: '-0.03em', lineHeight: 1 }}>
                    <AnimCount end={s.end} suffix={s.suffix} />
                  </div>
                  <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 12, color: '#A09080', marginTop: 6, fontWeight: 500 }}>{s.label}</div>
                </div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ══ FEATURES ════════════════════════════════════════════════ */}
      <section id="features" style={{ padding: '80px 2rem', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 1160, margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ marginBottom: 56 }}>
            <p style={{ fontFamily: 'JetBrains Mono', fontSize: 11, fontWeight: 500, color: '#6366F1', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 12 }}>
              // capabilities
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16 }}>
              <h2 style={{ fontFamily: 'Playfair Display', fontSize: 'clamp(2rem,3.5vw,3rem)', fontWeight: 900, color: '#1A1510', lineHeight: 1.1, letterSpacing: '-0.02em', maxWidth: 460 }}>
                Designed for<br /><em style={{ color: '#6366F1' }}>ambitious</em> creators
              </h2>
              <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 15, color: '#8B8070', maxWidth: 340, lineHeight: 1.7 }}>
                Every detail has been crafted to enhance your creative workflow and community engagement.
              </p>
            </div>
          </motion.div>
          <div className="features-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px,1fr))', gap: 18 }}>
            {features.map((f, i) => <FeatureCard key={i} {...f} index={i} />)}
          </div>
        </div>
      </section>

      {/* ══ HOW IT WORKS ════════════════════════════════════════════ */}
      <section id="how-it-works" style={{ padding: '80px 2rem', position: 'relative', zIndex: 1 }}>
        <div className="steps-grid" style={{ maxWidth: 1160, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'start' }}>
          {/* Left */}
          <motion.div initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <p style={{ fontFamily: 'JetBrains Mono', fontSize: 11, fontWeight: 500, color: '#6366F1', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 12 }}>
              // process
            </p>
            <h2 style={{ fontFamily: 'Playfair Display', fontSize: 'clamp(2rem,3vw,2.8rem)', fontWeight: 900, color: '#1A1510', lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: 20 }}>
              Launch in<br /><em style={{ color: '#6366F1' }}>four steps</em>
            </h2>
            <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 15, color: '#8B8070', lineHeight: 1.72, marginBottom: 40 }}>
              From zero to a thriving community — here's exactly how it works.
            </p>
            <Link to="/signup" style={{ textDecoration: 'none' }}>
              <button style={{
                fontFamily: 'Plus Jakarta Sans', fontSize: 14, fontWeight: 700,
                padding: '14px 28px', borderRadius: 12,
                background: '#1A1510', color: '#F7F4EE',
                border: 'none', cursor: 'pointer',
                display: 'inline-flex', alignItems: 'center', gap: 8,
                transition: 'all 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                Start now — it's free <ArrowRight size={14} />
              </button>
            </Link>
          </motion.div>

          {/* Right — steps */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                onClick={() => setActiveStep(i)}
                style={{
                  padding: '22px 24px',
                  borderRadius: 16,
                  background: activeStep === i ? '#fff' : '#FAFAF8',
                  border: `1.5px solid ${activeStep === i ? '#C7D2FE' : '#E8E4DC'}`,
                  boxShadow: activeStep === i ? '0 8px 32px rgba(99,102,241,0.12)' : 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  display: 'flex', gap: 18, alignItems: 'flex-start',
                }}
              >
                <div style={{
                  width: 40, height: 40, borderRadius: 12, flexShrink: 0,
                  background: activeStep === i ? '#EEF2FF' : '#F0ECE4',
                  border: `1.5px solid ${activeStep === i ? '#C7D2FE' : '#E8E4DC'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'JetBrains Mono', fontSize: 13, fontWeight: 700,
                  color: activeStep === i ? '#6366F1' : '#A09080',
                }}>
                  {step.num}
                </div>
                <div>
                  <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 15, fontWeight: 700, color: '#1A1510', marginBottom: 6 }}>{step.title}</p>
                  <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 13, color: '#8B8070', lineHeight: 1.65 }}>{step.desc}</p>
                </div>
                <div style={{ marginLeft: 'auto', flexShrink: 0 }}>
                  <Check size={16} color={activeStep === i ? '#6366F1' : '#D4CEBC'} strokeWidth={2.5} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ TESTIMONIALS ════════════════════════════════════════════ */}
      <section id="about" style={{ padding: '80px 2rem', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 1160, margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: 52 }}>
            <p style={{ fontFamily: 'JetBrains Mono', fontSize: 11, fontWeight: 500, color: '#6366F1', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 12 }}>// testimonials</p>
            <h2 style={{ fontFamily: 'Playfair Display', fontSize: 'clamp(1.8rem,3vw,2.6rem)', fontWeight: 900, color: '#1A1510', letterSpacing: '-0.02em' }}>
              Loved by <em style={{ color: '#6366F1' }}>real creators</em>
            </h2>
          </motion.div>
          <div className="testimonials-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px,1fr))', gap: 20 }}>
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                style={{
                  padding: '28px 28px 24px',
                  borderRadius: 20,
                  background: '#fff',
                  border: '1.5px solid #EDE9E0',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                }}
              >
                <Quote size={24} color={t.color} style={{ opacity: 0.5, marginBottom: 16 }} />
                <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 15, color: '#3A3028', lineHeight: 1.72, marginBottom: 24, fontWeight: 400 }}>
                  {t.text}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: t.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Plus Jakarta Sans', fontSize: 13, fontWeight: 800, color: '#fff' }}>
                    {t.initials}
                  </div>
                  <div>
                    <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 14, fontWeight: 700, color: '#1A1510' }}>{t.name}</p>
                    <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 12, color: '#A09080' }}>{t.role}</p>
                  </div>
                  <div style={{ marginLeft: 'auto', display: 'flex', gap: 1 }}>
                    {[...Array(5)].map((_, j) => <Star key={j} size={12} fill="#FBBF24" color="#FBBF24" />)}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CTA ═════════════════════════════════════════════════════ */}
      <section style={{ padding: '60px 2rem 120px', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 1160, margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="cta-section"
            style={{
              borderRadius: 28,
              padding: '80px 72px',
              background: '#1A1510',
              position: 'relative', overflow: 'hidden',
              display: 'grid', gridTemplateColumns: '1fr auto', gap: 60, alignItems: 'center',
            }}
          >
            {/* BG accents */}
            <div style={{ position: 'absolute', top: -80, right: 200, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 65%)' }} />
            <div style={{ position: 'absolute', bottom: -60, left: 100, width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(236,72,153,0.12) 0%, transparent 65%)' }} />
            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '48px 48px' }} />

            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px', borderRadius: 99, background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.3)', fontFamily: 'Plus Jakarta Sans', fontSize: 12, fontWeight: 600, color: '#A5B4FC', marginBottom: 24 }}>
                <Sparkles size={12} />
                Free forever — no credit card required
              </div>
              <h2 style={{ fontFamily: 'Playfair Display', fontSize: 'clamp(1.8rem,3vw,2.8rem)', fontWeight: 900, color: '#F7F4EE', lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: 16 }}>
                Ready to build your<br /><em style={{ color: '#A5B4FC' }}>community?</em>
              </h2>
              <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 16, color: 'rgba(247,244,238,0.5)', lineHeight: 1.7 }}>
                Join 50,000+ creators who are already growing on SocialApp.
              </p>
            </div>

            <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: 14, minWidth: 220 }}>
              <Link to="/signup" style={{ textDecoration: 'none', width: '100%' }}>
                <button style={{
                  width: '100%', fontFamily: 'Plus Jakarta Sans', fontSize: 15, fontWeight: 700,
                  padding: '15px 28px', borderRadius: 14,
                  background: '#F7F4EE', color: '#1A1510',
                  border: 'none', cursor: 'pointer',
                  boxShadow: '0 8px 28px rgba(247,244,238,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  transition: 'all 0.2s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  Get started free <ArrowRight size={15} />
                </button>
              </Link>
              <Link to="/login" style={{ textDecoration: 'none', width: '100%' }}>
                <button style={{
                  width: '100%', fontFamily: 'Plus Jakarta Sans', fontSize: 14, fontWeight: 500,
                  padding: '14px 24px', borderRadius: 14,
                  background: 'rgba(255,255,255,0.06)', color: 'rgba(247,244,238,0.7)',
                  border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer',
                  transition: 'background 0.2s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
                >
                  Sign in to account
                </button>
              </Link>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingTop: 4 }}>
                {['No credit card', 'Free forever', 'Cancel anytime'].map((text, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 16, height: 16, borderRadius: '50%', background: 'rgba(52,211,153,0.15)', border: '1px solid rgba(52,211,153,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Check size={9} color="#34D399" />
                    </div>
                    <span style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 12, color: 'rgba(247,244,238,0.45)' }}>{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══ FOOTER ══════════════════════════════════════════════════ */}
      <footer style={{ 
        background: '#080C10', 
        position: 'relative', 
        zIndex: 1,
        overflow: 'hidden'
      }}>
        {/* Animated Aurora Background */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at 20% 50%, rgba(99,102,241,0.08) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(139,92,246,0.06) 0%, transparent 50%), radial-gradient(ellipse at 50% 80%, rgba(236,72,153,0.05) 0%, transparent 50%)',
          pointerEvents: 'none'
        }} />

        {/* Grid Pattern Overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
          maskImage: 'radial-gradient(ellipse at 50% 50%, black 30%, transparent 70%)',
          WebkitMaskImage: 'radial-gradient(ellipse at 50% 50%, black 30%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        {/* Top Border Glow */}
        <div style={{
          height: '1px',
          background: 'linear-gradient(90deg, transparent 0%, rgba(99,102,241,0.3) 20%, rgba(139,92,246,0.4) 50%, rgba(236,72,153,0.3) 80%, transparent 100%)',
          position: 'relative'
        }} />

        <div style={{ 
          maxWidth: 1200, 
          margin: '0 auto', 
          padding: '80px 2rem 40px',
          position: 'relative',
          zIndex: 2
        }}>
          {/* Main Footer Grid */}
          <div className="footer-grid" style={{
            display: 'grid',
            gridTemplateColumns: '1.5fr 1fr 1fr 1fr 1fr',
            gap: '40px',
            marginBottom: '60px'
          }}>
            {/* Brand Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Logo */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #A78BFA 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 8px 32px rgba(99,102,241,0.25), 0 0 0 1px rgba(99,102,241,0.1)',
                  position: 'relative'
                }}>
                  <Sparkles size={18} color="#fff" />
                  {/* Pulse ring */}
                  <div style={{
                    position: 'absolute',
                    inset: '-4px',
                    borderRadius: '18px',
                    border: '1px solid rgba(99,102,241,0.2)',
                    animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                  }} />
                </div>
                <div>
                  <div style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontWeight: 800,
                    fontSize: '20px',
                    color: '#F7F4EE',
                    letterSpacing: '-0.5px',
                    lineHeight: '1.2'
                  }}>
                    Social<span style={{
                      background: 'linear-gradient(135deg, #818CF8 0%, #A78BFA 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text'
                    }}>App</span>
                  </div>
                  <div style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '9px',
                    color: 'rgba(247,244,238,0.25)',
                    letterSpacing: '2px',
                    textTransform: 'uppercase',
                    marginTop: '2px'
                  }}>
                    Professional v2.4.1
                  </div>
                </div>
              </div>

              {/* Description */}
              <p style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: '14px',
                lineHeight: '1.7',
                color: 'rgba(247,244,238,0.4)',
                maxWidth: '280px',
                margin: 0
              }}>
                The next-generation social platform where creators thrive and communities flourish.
              </p>

              {/* Social Icons */}
              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                {['Twitter', 'GitHub', 'Discord', 'YouTube'].map((platform, idx) => (
                  <a
                    key={platform}
                    href="#"
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '10px',
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.06)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'rgba(247,244,238,0.4)',
                      fontSize: '14px',
                      textDecoration: 'none',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={e => {
                      e.target.style.background = 'rgba(99,102,241,0.15)';
                      e.target.style.borderColor = 'rgba(99,102,241,0.3)';
                      e.target.style.color = '#818CF8';
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 8px 24px rgba(99,102,241,0.2)';
                    }}
                    onMouseLeave={e => {
                      e.target.style.background = 'rgba(255,255,255,0.03)';
                      e.target.style.borderColor = 'rgba(255,255,255,0.06)';
                      e.target.style.color = 'rgba(247,244,238,0.4)';
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    {platform[0]}
                  </a>
                ))}
              </div>
            </div>

            {/* Link Columns */}
            {[
              {
                title: 'Product',
                links: [
                  { label: 'Features', badge: 'New' },
                  { label: 'Pricing' },
                  { label: 'Enterprise' },
                  { label: 'Changelog', badge: 'v2.4' },
                  { label: 'Status', indicator: 'operational' }
                ]
              },
              {
                title: 'Resources',
                links: [
                  { label: 'Documentation' },
                  { label: 'API Reference' },
                  { label: 'Tutorials' },
                  { label: 'Blog' },
                  { label: 'Community' }
                ]
              },
              {
                title: 'Company',
                links: [
                  { label: 'About' },
                  { label: 'Careers', badge: 'Hiring' },
                  { label: 'Press Kit' },
                  { label: 'Contact' },
                  { label: 'Partners' }
                ]
              },
              {
                title: 'Legal',
                links: [
                  { label: 'Privacy Policy' },
                  { label: 'Terms of Service' },
                  { label: 'Cookie Policy' },
                  { label: 'GDPR' },
                  { label: 'Security' }
                ]
              }
            ].map((column) => (
              <div key={column.title} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <h3 style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 700,
                  fontSize: '13px',
                  color: '#F7F4EE',
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase',
                  margin: 0
                }}>
                  {column.title}
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {column.links.map((link) => (
                    <a
                      key={link.label}
                      href="#"
                      style={{
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontSize: '14px',
                        color: 'rgba(247,244,238,0.4)',
                        textDecoration: 'none',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        position: 'relative',
                        paddingLeft: '0',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={e => {
                        e.target.style.color = '#F7F4EE';
                        e.target.style.paddingLeft = '4px';
                      }}
                      onMouseLeave={e => {
                        e.target.style.color = 'rgba(247,244,238,0.4)';
                        e.target.style.paddingLeft = '0';
                      }}
                    >
                      {link.label}
                      {link.badge && (
                        <span style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: '10px',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          background: link.badge === 'Hiring' 
                            ? 'linear-gradient(135deg, rgba(16,185,129,0.2), rgba(5,150,105,0.2))'
                            : 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.2))',
                          color: link.badge === 'Hiring' ? '#6EE7B7' : '#A78BFA',
                          border: link.badge === 'Hiring'
                            ? '1px solid rgba(16,185,129,0.3)'
                            : '1px solid rgba(139,92,246,0.3)',
                          letterSpacing: '0.5px'
                        }}>
                          {link.badge}
                        </span>
                      )}
                      {link.indicator && (
                        <span style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          background: '#10B981',
                          boxShadow: '0 0 8px rgba(16,185,129,0.5)',
                          animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                        }} />
                      )}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Bar */}
          <div className="footer-bottom" style={{
            paddingTop: '32px',
            borderTop: '1px solid rgba(255,255,255,0.04)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px'
          }}>
            {/* Copyright */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <p style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '12px',
                color: 'rgba(247,244,238,0.2)',
                margin: 0,
                letterSpacing: '0.3px'
              }}>
                © {new Date().getFullYear()} SocialApp
              </p>
              <span style={{
                width: '3px',
                height: '3px',
                borderRadius: '50%',
                background: 'rgba(247,244,238,0.1)'
              }} />
              <p style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '12px',
                color: 'rgba(247,244,238,0.15)',
                margin: 0
              }}>
                All rights reserved
              </p>
            </div>

            {/* Region / Language */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 12px',
                borderRadius: '8px',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.04)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={e => e.target.style.background = 'rgba(255,255,255,0.04)'}
              onMouseLeave={e => e.target.style.background = 'rgba(255,255,255,0.02)'}
              >
                <span style={{ fontSize: '16px' }}>🌍</span>
                <span style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: '13px',
                  color: 'rgba(247,244,238,0.5)'
                }}>
                  English (US)
                </span>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M3 4.5L6 7.5L9 4.5" stroke="rgba(247,244,238,0.3)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 12px',
                borderRadius: '8px',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.04)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={e => e.target.style.background = 'rgba(255,255,255,0.04)'}
              onMouseLeave={e => e.target.style.background = 'rgba(255,255,255,0.02)'}
              >
                <div style={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '4px',
                  background: 'linear-gradient(135deg, #6366F1 50%, #8B5CF6 50%)'
                }} />
                <span style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: '13px',
                  color: 'rgba(247,244,238,0.5)'
                }}>
                  Dark Mode
                </span>
              </div>
            </div>

            {/* Made with love */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <span style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: '12px',
                color: 'rgba(247,244,238,0.2)'
              }}>
                Made with
              </span>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ animation: 'pulse 1.5s ease-in-out infinite' }}>
                <path d="M7 12.5L1.5 7.5C0.5 6.5 0.5 4.5 1.5 3.5C2.5 2.5 4.5 2.5 5.5 3.5L7 5L8.5 3.5C9.5 2.5 11.5 2.5 12.5 3.5C13.5 4.5 13.5 6.5 12.5 7.5L7 12.5Z" 
                  fill="url(#heart-gradient)" />
                <defs>
                  <linearGradient id="heart-gradient" x1="1" y1="3" x2="13" y2="12.5" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#6366F1" />
                    <stop offset="1" stopColor="#EC4899" />
                  </linearGradient>
                </defs>
              </svg>
              <span style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: '12px',
                color: 'rgba(247,244,238,0.2)'
              }}>
                by creators, for creators
              </span>
            </div>
          </div>
        </div>

        {/* Inject keyframe animations */}
        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
        `}</style>
      </footer>

      {/* ══ VIDEO MODAL ═════════════════════════════════════════════ */}
      <AnimatePresence>
        {videoOpen && (
          <motion.div
            key="modal"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setVideoOpen(false)}
            style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(26,21,16,0.75)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 280, damping: 22 }}
              onClick={e => e.stopPropagation()}
              style={{ width: '100%', maxWidth: 760, aspectRatio: '16/9', borderRadius: 24, background: '#fff', border: '2px solid #EDE9E0', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', boxShadow: '0 40px 100px rgba(0,0,0,0.25)' }}
            >
              <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 14, color: '#A09080' }}>Demo video coming soon</p>
              <button onClick={() => setVideoOpen(false)}
                style={{ position: 'absolute', top: 16, right: 16, width: 32, height: 32, borderRadius: '50%', background: '#F0ECE4', border: '1px solid #E8E4DC', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              ><X size={14} color="#7A6E60" /></button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
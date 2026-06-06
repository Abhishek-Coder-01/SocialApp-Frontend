import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Sparkles, ArrowRight, Star, Zap, Heart, Eye, EyeOff, Check, ArrowLeft, Home } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

/* ─── Google Fonts ───────────────────────────────────────────────────── */
const FONTS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
`;

/* ─── Custom Input ───────────────────────────────────────────────────── */
function FormInput({ label, name, type = 'text', placeholder, value, onChange, error, icon: Icon, autoComplete, extra }) {
  const [focused, setFocused] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPass ? 'text' : 'password') : type;

  return (
    <div>
      <label style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 13, fontWeight: 600, color: '#3A3028', display: 'block', marginBottom: 7 }}>
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        {Icon && (
          <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
            <Icon size={16} color={focused ? '#6366F1' : '#B0A898'} strokeWidth={1.8} style={{ transition: 'color 0.2s' }} />
          </div>
        )}
        <input
          name={name}
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: '100%',
            padding: `13px 14px 13px ${Icon ? '42px' : '14px'}`,
            paddingRight: isPassword ? 44 : 14,
            fontFamily: 'Plus Jakarta Sans',
            fontSize: 14,
            fontWeight: 400,
            color: '#1A1510',
            background: focused ? '#fff' : '#FAFAF8',
            border: `1.5px solid ${error ? '#F87171' : focused ? '#6366F1' : '#E8E4DC'}`,
            borderRadius: 12,
            outline: 'none',
            transition: 'all 0.2s',
            boxShadow: focused ? '0 0 0 4px rgba(99,102,241,0.08)' : error ? '0 0 0 4px rgba(248,113,113,0.08)' : 'none',
          }}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPass(s => !s)}
            style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: '#B0A898', display: 'flex' }}
          >
            {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
      {error && (
        <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
          style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 12, color: '#EF4444', marginTop: 6 }}>
          {error}
        </motion.p>
      )}
      {extra}
    </div>
  );
}

/* ─── Main ───────────────────────────────────────────────────────────── */
export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const errorTimerRef = useRef(null);

  useEffect(() => {
    if (!errors.general) return undefined;

    if (errorTimerRef.current) {
      clearTimeout(errorTimerRef.current);
    }

    errorTimerRef.current = setTimeout(() => {
      setErrors((prev) => ({ ...prev, general: '' }));
    }, 2000);

    return () => {
      if (errorTimerRef.current) {
        clearTimeout(errorTimerRef.current);
      }
    };
  }, [errors.general]);

  const handleChange = (e) => {
    setFormData(p => ({ ...p, [e.target.name]: e.target.value }));
    setErrors(p => ({ ...p, [e.target.name]: '', general: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (Object.keys(newErrors).length) { setErrors(newErrors); return; }
    setLoading(true);
    try {
      await login(formData.email, formData.password);
      toast.success('Welcome back! 👋');
      navigate('/feed');
    } catch (err) {
      setErrors({ general: err.response?.data?.message || 'Login failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const canSubmit = formData.email && formData.password && !loading;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: 'Plus Jakarta Sans', position: 'relative' }}>
      <style>{`
        ${FONTS}
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        ::selection { background: #EEF2FF; color: #1A1510; }
        input::placeholder { color: #C0B8A8; }
        @keyframes float-a { 0%,100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-14px) rotate(2deg); } }
        @keyframes float-b { 0%,100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(10px) rotate(-2deg); } }
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        
        /* Responsive styles */
        @media (max-width: 1024px) {
          .left-panel { display: none !important; }
          .right-panel { width: 100% !important; }
        }
        
        @media (max-width: 640px) {
          .right-panel { padding: 28px 16px !important; }
          .form-container { padding: 22px 18px !important; max-width: 100% !important; }
          .social-buttons { grid-template-columns: 1fr !important; }
          .back-link { top: 16px !important; left: 16px !important; padding: 8px 14px !important; font-size: 12px !important; }
          .mobile-logo { margin-bottom: 24px !important; }
          .mobile-logo span { font-size: 16px !important; }
          .heading { font-size: 1.55rem !important; line-height: 1.12 !important; }
          .login-subtitle { font-size: 14px !important; }
        }
      `}</style>

      {/* ══ BACK BUTTON ═══════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        style={{
          position: 'absolute',
          top: '24px',
          left: '24px',
          zIndex: 50,
        }}
        className="back-link"
      >
        <Link
          to="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            borderRadius: '12px',
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
            textDecoration: 'none',
            color: '#3A3028',
            fontFamily: 'Plus Jakarta Sans',
            fontSize: '13px',
            fontWeight: 600,
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'translateX(-3px)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.12)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'translateX(0)';
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.08)';
          }}
        >
          <ArrowLeft size={16} strokeWidth={2} />
          <Home size={16} strokeWidth={2} className="sm:hidden" />
          <span className="hidden sm:inline">Back to Home</span>
        </Link>
      </motion.div>

      {/* ══ LEFT BRAND PANEL ═══════════════════════════════════════════ */}
      <div className="left-panel" style={{
        width: '52%',
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '44px 52px',
        background: 'linear-gradient(145deg, #1A1510 0%, #1E1347 45%, #2D1B69 75%, #1A1510 100%)',
      }}>
        {/* Background texture */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)', backgroundSize: '64px 64px', pointerEvents: 'none' }} />

        {/* Ambient orbs */}
        <div style={{ position: 'absolute', top: -120, left: -80, width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.22) 0%, transparent 65%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -100, right: -60, width: 420, height: 420, borderRadius: '50%', background: 'radial-gradient(circle, rgba(236,72,153,0.16) 0%, transparent 65%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '40%', right: '10%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(168,85,247,0.12) 0%, transparent 65%)', pointerEvents: 'none' }} />

        {/* Decorative rings */}
        <div style={{ position: 'absolute', top: '35%', left: '50%', transform: 'translate(-50%,-50%)', width: 440, height: 440, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.05)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '35%', left: '50%', transform: 'translate(-50%,-50%)', width: 320, height: 320, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.06)', pointerEvents: 'none' }} />


        {/* ── Center hero ── */}
        <div  style={{ position: 'relative', zIndex: 10 }} className="pt-19 lg:pt-32">
          <motion.div initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}>
            <p style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: 'rgba(165,180,252,0.7)', letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 18 }}>
              {'// welcome back'}
            </p>
            <h2 style={{ fontFamily: 'Playfair Display', fontSize: '3rem', fontWeight: 900, color: '#F7F4EE', lineHeight: 1.08, letterSpacing: '-0.02em', marginBottom: 20 }}>
              Share moments.<br />
              <em style={{ color: '#A5B4FC' }}>Build connections.</em>
            </h2>
            <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 16, color: 'rgba(247,244,238,0.5)', lineHeight: 1.72, maxWidth: 380, fontWeight: 300 }}>
              Thousands of creators share their stories, grow their audience, and build meaningful communities here every day.
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45, duration: 0.6 }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14, marginTop: 40 }}
          >
            {[
              { icon: Star, label: 'Posts', value: '50K+', color: '#FCD34D' },
              { icon: Heart, label: 'Likes', value: '200K+', color: '#F472B6' },
              { icon: Zap, label: 'Creators', value: '10K+', color: '#A5B4FC' },
            ].map(({ icon: Icon, label, value, color }) => (
              <div key={label} style={{
                padding: '18px 16px',
                borderRadius: 18,
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                backdropFilter: 'blur(12px)',
                textAlign: 'center',
              }}>
                <Icon size={18} color={color} strokeWidth={1.8} style={{ margin: '0 auto 8px', display: 'block' }} />
                <div style={{ fontFamily: 'Playfair Display', fontSize: 22, fontWeight: 900, color: '#F7F4EE', letterSpacing: '-0.03em', lineHeight: 1 }}>{value}</div>
                <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 11, color: 'rgba(247,244,238,0.4)', marginTop: 5, fontWeight: 500 }}>{label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* ── Bottom quote ── */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
          style={{ position: 'relative', zIndex: 10, borderLeft: '2px solid rgba(165,180,252,0.3)', paddingLeft: 16 }}
        >
          <p style={{ fontFamily: 'Playfair Display', fontSize: 14, fontStyle: 'italic', color: 'rgba(247,244,238,0.45)', lineHeight: 1.65 }}>
            "The best way to find yourself is to lose yourself in the service of others."
          </p>
          <p style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: 'rgba(247,244,238,0.25)', marginTop: 8 }}>— Mahatma Gandhi</p>
        </motion.div>
      </div>

      {/* ══ RIGHT FORM PANEL ════════════════════════════════════════════ */}
      <div className="right-panel" style={{
        flex: 1,
        background: '#F7F4EE',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 32px',
        position: 'relative',
        overflow: 'hidden',
        minHeight: '100vh',
      }}>
        {/* Subtle background details */}
        <div style={{ position: 'absolute', top: -100, right: -80, width: 340, height: 340, borderRadius: '50%', background: 'radial-gradient(circle, #E0D9F6 0%, transparent 70%)', opacity: 0.7, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -80, left: -60, width: 280, height: 280, borderRadius: '50%', background: 'radial-gradient(circle, #FDE9D5 0%, transparent 70%)', opacity: 0.7, pointerEvents: 'none' }} />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="form-container"
          style={{ width: '100%', maxWidth: 400, position: 'relative', zIndex: 1 }}
        >
          {/* Mobile logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 36 }} className="lg:hidden mobile-logo">
            <div style={{ width: 34, height: 34, borderRadius: 11, background: 'linear-gradient(135deg,#6366F1,#8B5CF6)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(99,102,241,0.3)' }}>
              <Sparkles size={15} color="#fff" />
            </div>
            <span style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: 18, color: '#1A1510', letterSpacing: '-0.025em' }}>
              Social<span style={{ color: '#6366F1' }}>App</span>
            </span>
          </div>

          {/* Header */}
          <div style={{ marginBottom: 36 }}>
            <p style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: '#6366F1', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 12 }}>
              {'// sign in'}
            </p>
            <h1 className="heading" style={{ fontFamily: 'Playfair Display', fontSize: '2.2rem', fontWeight: 900, color: '#1A1510', letterSpacing: '-0.025em', lineHeight: 1.1, marginBottom: 10 }}>
              Welcome back
            </h1>
            <p className="login-subtitle" style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 15, color: '#8B8070', fontWeight: 400 }}>
              Sign in to continue your journey
            </p>
          </div>

          {/* Error banner */}
          <AnimatePresence>
            {errors.general && (
              <motion.div
                key="err"
                initial={{ opacity: 0, y: -8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.98 }}
                style={{
                  marginBottom: 24,
                  padding: '14px 16px',
                  borderRadius: 14,
                  background: '#FEF2F2',
                  border: '1.5px solid #FECACA',
                  display: 'flex', alignItems: 'flex-start', gap: 10,
                }}
              >
                <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#FEE2E2', border: '1.5px solid #FECACA', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                  <span style={{ fontSize: 10, color: '#EF4444', fontWeight: 700 }}>!</span>
                </div>
                <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 13, color: '#DC2626', lineHeight: 1.5 }}>{errors.general}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <FormInput
              label="Email address"
              name="email"
              type="email"
              icon={Mail}
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              autoComplete="email"
            />

            <FormInput
              label="Password"
              name="password"
              type="password"
              icon={Lock}
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              autoComplete="current-password"
            />

            {/* Remember + Forgot */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setRememberMe(s => !s)}
                style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              >
                <div style={{
                  width: 18, height: 18, borderRadius: 6,
                  background: rememberMe ? '#6366F1' : '#fff',
                  border: `1.5px solid ${rememberMe ? '#6366F1' : '#E8E4DC'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.18s',
                  flexShrink: 0,
                }}>
                  {rememberMe && <Check size={11} color="#fff" strokeWidth={3} />}
                </div>
                <span style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 13, color: '#7A6E60', fontWeight: 500 }}>Remember me</span>
              </button>
              <button
                type="button"
                style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 13, fontWeight: 600, color: '#6366F1', background: 'none', border: 'none', cursor: 'pointer', padding: 0, transition: 'opacity 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.opacity = 0.7}
                onMouseLeave={e => e.currentTarget.style.opacity = 1}
              >
                Forgot password?
              </button>
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={!canSubmit}
              whileTap={canSubmit ? { scale: 0.98 } : {}}
              style={{
                width: '100%',
                padding: '15px 24px',
                borderRadius: 14,
                background: canSubmit ? '#1A1510' : '#D4CEBC',
                border: 'none',
                color: canSubmit ? '#F7F4EE' : '#A09080',
                fontFamily: 'Plus Jakarta Sans',
                fontSize: 15,
                fontWeight: 700,
                cursor: canSubmit ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 9,
                transition: 'all 0.25s',
                boxShadow: canSubmit ? '0 6px 24px rgba(26,21,16,0.2)' : 'none',
                letterSpacing: '-0.01em',
                marginTop: 4,
              }}
              onMouseEnter={e => { if (canSubmit) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(26,21,16,0.26)'; } }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = canSubmit ? '0 6px 24px rgba(26,21,16,0.2)' : 'none'; }}
            >
              {loading ? (
                <div style={{ width: 20, height: 20, borderRadius: '50%', border: '2.5px solid rgba(247,244,238,0.3)', borderTopColor: '#F7F4EE', animation: 'spin-slow 0.7s linear infinite' }} />
              ) : (
                <>
                  Sign In
                  <ArrowRight size={17} />
                </>
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, margin: '28px 0' }}>
            <div style={{ flex: 1, height: 1, background: '#E8E4DC' }} />
            <span style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 12, color: '#C0B8A8', fontWeight: 500 }}>or continue with</span>
            <div style={{ flex: 1, height: 1, background: '#E8E4DC' }} />
          </div>

          {/* Social login buttons */}
          <div className="social-buttons" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 32 }}>
            {[
              {
                label: 'Google',
                icon: (
                  <svg width="17" height="17" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                ),
              },
              {
                label: 'Apple',
                icon: (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98l-.09.06c-.22.14-2.18 1.27-2.16 3.8.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.37 2.73zM13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                  </svg>
                ),
              },
            ].map(({ label, icon }) => (
              <button
                key={label}
                type="button"
                onClick={() => alert("This feature will be available in a future update.")}
                style={{
                  padding: '12px 16px',
                  borderRadius: 12,
                  background: '#fff',
                  border: '1.5px solid #E8E4DC',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  fontFamily: 'Plus Jakarta Sans',
                  fontSize: 13,
                  fontWeight: 600,
                  color: '#3A3028',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = '#C7C0B0';
                  e.currentTarget.style.boxShadow = '0 4px 14px rgba(0,0,0,0.07)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = '#E8E4DC';
                  e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)';
                }}
              >
                {icon}
                {label}
              </button>
            ))}
          </div>

          {/* Sign up link */}
          <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 14, color: '#8B8070', textAlign: 'center' }}>
            Don't have an account?{' '}
            <Link to="/signup" style={{ color: '#6366F1', fontWeight: 700, textDecoration: 'none', transition: 'opacity 0.2s' }}
              onMouseEnter={e => e.target.style.opacity = 0.75}
              onMouseLeave={e => e.target.style.opacity = 1}
            >
              Create one free →
            </Link>
          </p>

          {/* Trust line */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18, marginTop: 28, paddingTop: 24, borderTop: '1px solid #EDE9E0', flexWrap: 'wrap' }}>
            {['SSL Secured', 'GDPR Ready', 'No spam'].map((t, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <Check size={11} color="#10B981" strokeWidth={2.5} />
                <span style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 11, color: '#B0A898', fontWeight: 500 }}>{t}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

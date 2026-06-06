import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, Sparkles, ArrowRight, Eye, EyeOff, Check, CheckCircle, ArrowLeft, Home } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';


/* ─── Google Fonts ───────────────────────────────────────────────────── */
const FONTS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
`;

/* ─── Password Strength Calculator ──────────────────────────────────── */
const getStrength = (password) => {
  if (!password) return { score: 0, label: '', color: '#E8E4DC' };
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  const map = [
    { score: 0, label: '', color: '#E8E4DC' },
    { score: 1, label: 'Weak', color: '#F87171' },
    { score: 2, label: 'Fair', color: '#FBBF24' },
    { score: 3, label: 'Good', color: '#60A5FA' },
    { score: 4, label: 'Strong', color: '#34D399' },
  ];
  return map[score];
};

const REQUIREMENTS = [
  { test: (p) => p.length >= 8, label: 'At least 8 characters' },
  { test: (p) => /[A-Z]/.test(p), label: 'One uppercase letter' },
  { test: (p) => /[0-9]/.test(p), label: 'One number' },
  { test: (p) => /[^A-Za-z0-9]/.test(p), label: 'One special character' },
];

/* ─── Custom Input ───────────────────────────────────────────────────── */
function FormInput({ label, name, type = 'text', placeholder, value, onChange, error, icon: Icon, autoComplete, extra, onFocus, onBlur }) {
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
          onFocus={(e) => { setFocused(true); if (onFocus) onFocus(e); }}
          onBlur={(e) => { setFocused(false); if (onBlur) onBlur(e); }}
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
export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showReqs, setShowReqs] = useState(false);

  const strength = getStrength(formData.password);

  const handleChange = (e) => {
    setFormData(p => ({ ...p, [e.target.name]: e.target.value }));
    setErrors(p => ({ ...p, [e.target.name]: '', general: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!formData.username || formData.username.length < 3)
      errs.username = 'Username must be at least 3 characters';
    if (!formData.email) errs.email = 'Email is required';
    if (!formData.password || formData.password.length < 6)
      errs.password = 'Password must be at least 6 characters';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      await signup(formData.username, formData.email, formData.password);
      toast.success('Account created! Welcome to SocialApp 🎉');
      navigate('/feed');
    } catch (err) {
      setErrors({ general: err.response?.data?.message || 'Signup failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const canSubmit = formData.username && formData.email && formData.password && !loading;

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
          .form-container { padding: 24px 20px !important; max-width: 100% !important; }
          .heading { font-size: 1.8rem !important; }
        }
      `}</style>

      {/* ══ BACK BUTTON ═══════════════════════════════════════════ */}

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        style={{
          position: 'absolute',
          top: 'clamp(12px, 3vw, 24px)',
          left: 'clamp(12px, 3vw, 24px)',
          zIndex: 50,
        }}
      ><Link
        to="/"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '10px 16px',
          borderRadius: '12px',
          background: 'rgba(255,255,255,0.9)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.3)',
          boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
          textDecoration: 'none',
          color: '#3A3028',
          fontFamily: 'Plus Jakarta Sans, sans-serif',
          fontSize: '14px',
          fontWeight: 600,
          whiteSpace: 'nowrap',
        }}
      >
          <ArrowLeft size={16} strokeWidth={2.2} />
          <Home size={16} strokeWidth={2.2} className="sm:hidden" />

          <span className="hidden sm:inline">
            Back to Home
          </span>
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
        <div style={{ position: 'relative', zIndex: 10 }} className="pt-19 lg:pt-32">
          <motion.div initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}>
            <p style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: 'rgba(165,180,252,0.7)', letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 18 }}>
              {'// join us'}
            </p>
            <h2 style={{ fontFamily: 'Playfair Display', fontSize: '3rem', fontWeight: 900, color: '#F7F4EE', lineHeight: 1.08, letterSpacing: '-0.02em', marginBottom: 20 }}>
              Start your<br />
              <em style={{ color: '#A5B4FC' }}>creative journey.</em>
            </h2>
            <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 16, color: 'rgba(247,244,238,0.5)', lineHeight: 1.72, maxWidth: 380, fontWeight: 300 }}>
              Join thousands of creators who share their stories, grow their audience, and build meaningful communities here every day.
            </p>
          </motion.div>

          {/* Steps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45, duration: 0.6 }}
            style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 40 }}
          >
            {[
              'Create your account in seconds',
              'Complete your profile',
              'Start sharing & connecting',
            ].map((step, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 700, color: '#fff', fontFamily: 'JetBrains Mono',
                  flexShrink: 0,
                  boxShadow: '0 4px 12px rgba(99,102,241,0.3)'
                }}>
                  {i + 1}
                </div>
                <span style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 14, color: 'rgba(247,244,238,0.6)', fontWeight: 500 }}>{step}</span>
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
            "Creativity takes courage. Share yours with the world."
          </p>
          <p style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: 'rgba(247,244,238,0.25)', marginTop: 8 }}>— Henri Matisse</p>
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
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 36 }} className="lg:hidden">
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
              {'// get started'}
            </p>
            <h1 className="heading" style={{ fontFamily: 'Playfair Display', fontSize: '2.2rem', fontWeight: 900, color: '#1A1510', letterSpacing: '-0.025em', lineHeight: 1.1, marginBottom: 10 }}>
              Create account
            </h1>
            <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 15, color: '#8B8070', fontWeight: 400 }}>
              Join SocialApp and start sharing today
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
              label="Username"
              name="username"
              icon={User}
              placeholder="cooluser123"
              value={formData.username}
              onChange={handleChange}
              error={errors.username}
              autoComplete="username"
              extra={
                !errors.username && formData.username && (
                  <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 11, color: '#B0A898', marginTop: 6 }}>
                    3-30 characters, letters, numbers, underscores
                  </p>
                )
              }
            />

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

            <div>
              <FormInput
                label="Password"
                name="password"
                type="password"
                icon={Lock}
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                autoComplete="new-password"
                onFocus={() => setShowReqs(true)}
              />

              {/* Strength bar */}
              {formData.password && (
                <div style={{ marginTop: 10 }}>
                  <div style={{ display: 'flex', gap: 4, marginBottom: 6 }}>
                    {[1, 2, 3, 4].map((seg) => (
                      <div
                        key={seg}
                        style={{
                          height: 4,
                          flex: 1,
                          borderRadius: 2,
                          background: strength.score >= seg ? strength.color : '#EDE9E0',
                          transition: 'all 0.3s',
                        }}
                      />
                    ))}
                  </div>
                  {strength.label && (
                    <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 12, color: '#8B8070' }}>
                      Strength: <span style={{ fontWeight: 600, color: strength.color }}>{strength.label}</span>
                    </p>
                  )}
                </div>
              )}

              {/* Password requirements */}
              {showReqs && formData.password && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  style={{ marginTop: 10, overflow: 'hidden' }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {REQUIREMENTS.map(({ test, label }) => {
                      const met = test(formData.password);
                      return (
                        <div key={label} style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                          fontFamily: 'Plus Jakarta Sans',
                          fontSize: 12,
                          color: met ? '#059669' : '#B0A898',
                          transition: 'color 0.2s',
                        }}>
                          <CheckCircle size={12} style={{ opacity: met ? 1 : 0.3, transition: 'opacity 0.2s' }} />
                          {label}
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
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
                  Create Account
                  <ArrowRight size={17} />
                </>
              )}
            </motion.button>
          </form>

          {/* Sign in link */}
          <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 14, color: '#8B8070', textAlign: 'center', marginTop: 28 }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#6366F1', fontWeight: 700, textDecoration: 'none', transition: 'opacity 0.2s' }}
              onMouseEnter={e => e.target.style.opacity = 0.75}
              onMouseLeave={e => e.target.style.opacity = 1}
            >
              Sign in →
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

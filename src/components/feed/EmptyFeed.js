import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, MessageSquare, RefreshCw, Zap, Heart,
  Share2, Send, Image, Users, ArrowRight, Star,
  Compass, TrendingUp, Clock, ChevronRight
} from 'lucide-react';

/* ─── Google Fonts ───────────────────────────────────────────────────── */
const FONTS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');
`;

// Floating element animation variants
const floatAnimation = (delay = 0, duration = 6) => ({
  animate: {
    y: [0, -15, 0],
    rotate: [0, 5, -5, 0],
    transition: {
      duration,
      repeat: Infinity,
      ease: "easeInOut",
      delay,
    }
  }
});

// Pulse animation
const pulseAnimation = (delay = 0) => ({
  animate: {
    scale: [1, 1.08, 1],
    opacity: [0.6, 1, 0.6],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
      delay,
    }
  }
});

// Floating icon card
function FloatingIcon({ icon: Icon, top, left, delay, color, size = 40, rotation = 0 }) {
  return (
    <motion.div
      {...floatAnimation(delay)}
      style={{
        position: 'absolute',
        top,
        left,
        width: size,
        height: size,
        borderRadius: '14px',
        background: 'rgba(255,255,255,0.08)',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(255,255,255,0.12)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
        transform: `rotate(${rotation}deg)`,
      }}
    >
      <Icon size={size * 0.45} color={color} strokeWidth={1.8} />
    </motion.div>
  );
}

export default function EmptyFeed({ onRefresh }) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    onRefresh?.();
    setTimeout(() => setIsRefreshing(false), 1500);
  };

  return (
    <div style={{ position: 'relative', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
      <style>{FONTS}</style>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: 'relative',
          borderRadius: '28px',
          padding: '60px 32px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          background: 'linear-gradient(145deg, rgba(255,255,255,0.4) 0%, rgba(247,244,238,0.6) 50%, rgba(255,255,255,0.4) 100%)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(232,228,220,0.6)',
          boxShadow: '0 4px 24px rgba(26,21,16,0.03), 0 1px 2px rgba(26,21,16,0.02)',
          overflow: 'hidden',
          isolation: 'isolate',
        }}
      >
        {/* Background decorative elements */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: `
            radial-gradient(ellipse at 30% 20%, rgba(99,102,241,0.04) 0%, transparent 50%),
            radial-gradient(ellipse at 70% 80%, rgba(236,72,153,0.03) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 50%, rgba(139,92,246,0.02) 0%, transparent 50%)
          `,
          pointerEvents: 'none',
        }} />

        {/* Grid pattern overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'linear-gradient(rgba(26,21,16,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(26,21,16,0.015) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(ellipse at center, black 20%, transparent 70%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 20%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        {/* Floating icons */}
        <FloatingIcon icon={Heart} top="15%" left="8%" delay={0} color="#F472B6" size={44} rotation={-12} />
        <FloatingIcon icon={Share2} top="20%" right="10%" delay={1.5} color="#60A5FA" size={38} rotation={8} />
        <FloatingIcon icon={Star} top="60%" left="5%" delay={2} color="#FBBF24" size={36} rotation={-6} />
        <FloatingIcon icon={Zap} top="65%" right="8%" delay={0.8} color="#A78BFA" size={42} rotation={15} />
        <FloatingIcon icon={Image} bottom="15%" left="15%" delay={2.5} color="#34D399" size={40} rotation={-10} />
        <FloatingIcon icon={Send} bottom="20%" right="15%" delay={1.2} color="#F472B6" size={36} rotation={5} />

        {/* Main content */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          {/* Icon container */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 20,
              delay: 0.2
            }}
            style={{ position: 'relative', display: 'inline-block', marginBottom: '28px' }}
          >
            {/* Outer ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              style={{
                position: 'absolute',
                inset: '-20px',
                borderRadius: '50%',
                border: '1.5px dashed rgba(99,102,241,0.15)',
              }}
            />

            {/* Middle glow */}
            <motion.div
              {...pulseAnimation(0)}
              style={{
                position: 'absolute',
                inset: '-12px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)',
              }}
            />

            {/* Main icon box */}
            <motion.div
              {...floatAnimation(0, 4)}
              style={{
                width: '88px',
                height: '88px',
                borderRadius: '24px',
                background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #A78BFA 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 32px rgba(99,102,241,0.25), 0 0 0 4px rgba(99,102,241,0.08)',
                position: 'relative',
              }}
            >
              <MessageSquare size={36} color="#fff" strokeWidth={2} />

              {/* Sparkle accent */}
              <motion.div
                {...pulseAnimation(0.5)}
                style={{
                  position: 'absolute',
                  top: '-8px',
                  right: '-8px',
                  width: '26px',
                  height: '26px',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #FBBF24, #F59E0B)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(251,191,36,0.3)',
                }}
              >
                <Sparkles size={13} color="#fff" />
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Text content */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            style={{ maxWidth: '480px', margin: '0 auto' }}
          >
            {/* Label */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 12px',
              borderRadius: '20px',
              background: 'rgba(99,102,241,0.06)',
              border: '1px solid rgba(99,102,241,0.12)',
              marginBottom: '20px',
            }}>
              <Clock size={11} color="#6366F1" />
              <span style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '10px',
                fontWeight: 600,
                color: '#6366F1',
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
              }}>
                Just getting started
              </span>
            </div>

            {/* Heading */}
            <h3 style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: '2rem',
              fontWeight: 900,
              color: '#1A1510',
              letterSpacing: '-0.03em',
              lineHeight: 1.2,
              margin: '0 0 14px',
            }}>
              Your feed awaits its{' '}
              <span style={{
                background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                first story
              </span>
            </h3>

            {/* Description */}
            <p style={{
              fontFamily: 'Plus Jakarta Sans, sans-serif',
              fontSize: '15px',
              lineHeight: 1.7,
              color: 'rgba(26,21,16,0.5)',
              margin: '0 0 32px',
              fontWeight: 400,
            }}>
              Be the pioneer who sparks the conversation. Share your thoughts,
              upload stunning visuals, or explore trending topics to get inspired.
            </p>
          </motion.div>

          {/* Action buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              flexWrap: 'wrap',
            }}
          >
            {/* Create Post Button */}
            <motion.button
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                borderRadius: '14px',
                border: 'none',
                background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                color: '#fff',
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                fontSize: '14px',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(99,102,241,0.3)',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.boxShadow = '0 8px 28px rgba(99,102,241,0.4)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(99,102,241,0.3)';
              }}
            >
              <Send size={16} />
              Create First Post
              <ArrowRight size={15} />
            </motion.button>

            {/* Refresh Button */}
            {onRefresh && (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleRefresh}
                disabled={isRefreshing}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 20px',
                  borderRadius: '14px',
                  border: '1.5px solid rgba(232,228,220,0.8)',
                  background: 'rgba(255,255,255,0.6)',
                  backdropFilter: 'blur(8px)',
                  color: '#1A1510',
                  fontFamily: 'Plus Jakarta Sans, sans-serif',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: isRefreshing ? 'not-allowed' : 'pointer',
                  opacity: isRefreshing ? 0.6 : 1,
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={e => {
                  if (!isRefreshing) {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.9)';
                    e.currentTarget.style.borderColor = 'rgba(99,102,241,0.3)';
                  }
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.6)';
                  e.currentTarget.style.borderColor = 'rgba(232,228,220,0.8)';
                }}
              >
                <motion.div
                  animate={isRefreshing ? { rotate: 360 } : {}}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <RefreshCw size={15} />
                </motion.div>
                {isRefreshing ? 'Refreshing...' : 'Refresh Feed'}
              </motion.button>
            )}
          </motion.div>

          {/* Quick suggestions */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '16px',
              marginTop: '32px',
              flexWrap: 'wrap',
            }}
          >
            {[
              { icon: Compass, label: 'Explore trending', color: '#60A5FA' },
              { icon: Users, label: 'Find creators', color: '#34D399' },
              { icon: TrendingUp, label: 'Popular topics', color: '#F472B6' },
            ].map(({ icon: Icon, label, color }) => (
              <motion.button
                key={label}
                whileHover={{ scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 14px',
                  borderRadius: '10px',
                  border: 'none',
                  background: 'rgba(26,21,16,0.02)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(26,21,16,0.05)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(26,21,16,0.02)';
                }}
              >
                <Icon size={14} color={color} strokeWidth={2} />
                <span style={{
                  fontFamily: 'Plus Jakarta Sans, sans-serif',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: 'rgba(26,21,16,0.5)',
                }}>
                  {label}
                </span>
                <ChevronRight size={12} color="rgba(26,21,16,0.25)" />
              </motion.button>
            ))}
          </motion.div>
        </div>

        {/* Bottom decorative line */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '60%',
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.15), rgba(139,92,246,0.15), rgba(236,72,153,0.1), transparent)',
        }} />
      </motion.div>
    </div>
  );
}
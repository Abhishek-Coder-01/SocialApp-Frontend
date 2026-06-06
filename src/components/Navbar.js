import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home, Zap, HelpCircle,
  LogOut, LogIn, UserPlus, Menu, X, Sparkles,
  ChevronDown, Star, Users
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { getInitials } from '../lib/utils';

const FONTS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');
`;

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname, hash } = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const profileRef = useRef(null);
  const isLandingPage = !isAuthenticated;
  const isDark = false;

  // Scroll handling
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll spy for landing page sections
  useEffect(() => {
    if (!isLandingPage || pathname !== '/') return;

    const handleScroll = () => {
      const sections = ['features', 'how-it-works', 'about'];
      const scrollPos = window.scrollY + 120;

      let current = 'home';
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el && el.offsetTop <= scrollPos) {
          current = section;
        }
      }
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname, isAuthenticated, isLandingPage]);

  // Close menus on route change
  useEffect(() => {
    setMobileOpen(false);
    setProfileOpen(false);
  }, [pathname, hash]);

  // Smooth scroll for hash links
  useEffect(() => {
    if (pathname !== '/' || !hash) return;
    const targetId = hash.slice(1);
    const timer = setTimeout(() => {
      const target = document.getElementById(targetId);
      if (target) {
        window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
      }
    }, 50);
    return () => clearTimeout(timer);
  }, [pathname, hash]);

  // Close profile on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setProfileOpen(false);
    logout();
    toast.success('Logged out. See you soon! 👋');
    navigate('/');
  };

  // Landing page links
  const centerLinks = [
    { to: '/#home', label: 'Home', icon: Home, section: 'home' },
    { to: '/#features', label: 'Features', icon: Star, section: 'features' },
    { to: '/#how-it-works', label: 'How it Works', icon: HelpCircle, section: 'how-it-works' },
    { to: '/#about', label: 'About', icon: Users, section: 'about' },
  ];

  const authLinks = [
    { to: '/feed', label: 'Feed', icon: Zap },

  ];


  const displayLinks = isLandingPage ? centerLinks : authLinks;

  // FIXED: Proper active state detection
  const isActive = (link) => {
    if (!isLandingPage) {
      // For authenticated pages, just check exact path match
      return pathname === link.to;
    }

    // For landing page
    if (link.to === '/') {
      // Home is active only when on "/" and no hash and no active section (or activeSection is 'home')
      return pathname === '/' && !hash && (activeSection === 'home' || activeSection === '');
    }

    if (link.to.startsWith('/#')) {
      const sectionId = link.to.slice(2);
      // Active if hash matches OR scroll spy matches (only when on "/")
      if (pathname !== '/') return false;
      if (hash) return hash === `#${sectionId}`;
      return activeSection === sectionId;
    }

    return pathname === link.to;
  };

  // Theme colors
  const colors = {
    text: isDark ? '#F8FAFC' : '#1A1510',
    textMuted: isDark ? 'rgba(248,250,252,0.55)' : 'rgba(26,21,16,0.45)',
    hoverBg: isDark ? 'rgba(248,250,252,0.06)' : 'rgba(26,21,16,0.03)',
    activeBg: isDark ? 'rgba(99,102,241,0.14)' : 'rgba(99,102,241,0.07)',
    activeText: '#6366F1',
    border: isDark ? 'rgba(51,65,85,0.4)' : 'rgba(226,232,240,0.7)',
    btnBg: isDark ? 'rgba(248,250,252,0.06)' : 'rgba(26,21,16,0.02)',
    btnBorder: isDark ? 'rgba(51,65,85,0.3)' : 'rgba(232,228,220,0.4)',
    dropdownBg: isDark ? '#1E293B' : '#FFFFFF',
    dropdownBorder: isDark ? 'rgba(51,65,85,0.6)' : 'rgba(232,228,220,0.8)',
  };

  const navBg = scrolled
    ? (isDark ? 'rgba(15,23,42,0.94)' : 'rgba(247,244,238,0.85)')
    : (isDark ? 'rgba(15,23,42,0.78)' : 'rgba(255,255,255,0.7)');

  return (
    <>
      <style>{FONTS}</style>

      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          fontFamily: 'Plus Jakarta Sans, sans-serif',
        }}
      >
        <div style={{
          margin: scrolled ? '0' : '12px 16px 0',
          borderRadius: scrolled ? '0' : '20px',
          background: navBg,
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: scrolled
            ? `1px solid ${isDark ? 'rgba(51,65,85,0.3)' : 'rgba(232,228,220,0.6)'}`
            : `1px solid ${isDark ? 'rgba(51,65,85,0.2)' : 'rgba(232,228,220,0.6)'}`,
          borderBottom: scrolled ? `1px solid ${isDark ? 'rgba(51,65,85,0.3)' : 'rgba(232,228,220,0.6)'}` : undefined,
          boxShadow: isDark
            ? '0 8px 32px rgba(0,0,0,0.2)'
            : (scrolled
              ? '0 1px 3px rgba(26,21,16,0.04), 0 4px 12px rgba(26,21,16,0.03)'
              : '0 4px 24px rgba(26,21,16,0.04)'),
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}>
          <div style={{
            maxWidth: 1200,
            margin: '0 auto',
            padding: '0 20px',
            height: scrolled ? '62px' : '58px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            position: 'relative',
            transition: 'height 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          }}>

            {/* ═══ LOGO ═══ */}
            <Link to="/" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              textDecoration: 'none',
              flexShrink: 0,
              zIndex: 2,
            }}>
              <div style={{
                width: '34px',
                height: '34px',
                borderRadius: '9px',
                background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 3px 10px rgba(99,102,241,0.3)',
              }}>
                <Sparkles size={15} color="#fff" />
              </div>
              <span className="hidden sm:inline" style={{
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                fontWeight: 800,
                fontSize: '20px',
                color: colors.text,
                letterSpacing: '-0.5px',
              }}>
                Social<span style={{
                  background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>App</span>
              </span>
            </Link>

            {/* ═══ CENTER NAV (Desktop Only) ═══ */}
            <nav style={{
              display: 'none',
              alignItems: 'center',
              gap: '1px',
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 1,
            }}
              className="nav-desktop"
            >
              <style>{`
                @media (min-width: 1024px) {
                  .nav-desktop { display: flex !important; }
                }
              `}</style>

              {displayLinks.map((link, i) => (
                <Link
                  key={link.to}
                  to={link.to}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '7px 14px',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: isActive(link) ? 600 : 500,
                    color: isActive(link) ? colors.activeText : colors.textMuted,
                    background: isActive(link) ? colors.activeBg : 'transparent',
                    textDecoration: 'none',
                    transition: 'all 0.2s ease',
                    whiteSpace: 'nowrap',
                    borderRight: i < displayLinks.length - 1 ? `1px solid ${colors.border}` : 'none',
                    marginRight: i < displayLinks.length - 1 ? '1px' : 0,
                  }}
                  onMouseEnter={e => {
                    if (!isActive(link)) {
                      e.currentTarget.style.background = colors.hoverBg;
                      e.currentTarget.style.color = colors.text;
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isActive(link)) {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = colors.textMuted;
                    }
                  }}
                >
                  {React.createElement(link.icon, {
                    size: 14,
                    strokeWidth: isActive(link) ? 2.5 : 1.8
                  })}
                  {link.label}
                  {link.badge && (
                    <span style={{
                      fontSize: '9px',
                      fontWeight: 600,
                      padding: '1px 5px',
                      borderRadius: '4px',
                      background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                      color: '#fff',
                      fontFamily: 'JetBrains Mono, monospace',
                    }}>
                      {link.badge}
                    </span>
                  )}
                </Link>
              ))}

            </nav>

            {/* ═══ RIGHT ACTIONS ═══ */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              flexShrink: 0,
              zIndex: 2,
            }}>
              {isAuthenticated ? (
                <>

                  {/* Profile */}
                  <div ref={profileRef} style={{ position: 'relative' }}>
                    <button
                      onClick={() => setProfileOpen(v => !v)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '2px 8px 2px 2px',
                        borderRadius: '8px',
                        background: profileOpen ? colors.activeBg : colors.btnBg,
                        border: `1px solid ${profileOpen ? 'rgba(99,102,241,0.3)' : colors.btnBorder}`,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                    >
                      <div style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '7px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#000',
                        background: '#fff',
                        border: '1px solid #d1d5db',
                        fontSize: '11px',
                        fontWeight: 700,
                        lineHeight: 1,
                      }}>
                        {getInitials(user?.username || '').slice(0, 1)}
                      </div>
                      <span className="hidden md:inline" style={{
                        fontSize: '13px',
                        fontWeight: 600,
                        color: colors.text,
                        maxWidth: '80px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}>
                        {user?.username}
                      </span>
                      <ChevronDown size={12} style={{
                        color: colors.textMuted,
                        transform: profileOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s',
                      }} />
                    </button>

                    {/* Profile Dropdown */}
                    <AnimatePresence>
                      {profileOpen && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: -4 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: -4 }}
                          transition={{ duration: 0.15 }}
                          style={{
                            position: 'absolute',
                            right: 0,
                            top: 'calc(100% + 6px)',
                            width: '240px',
                            borderRadius: '12px',
                            background: colors.dropdownBg,
                            border: `1px solid ${colors.dropdownBorder}`,
                            boxShadow: isDark
                              ? '0 16px 48px rgba(0,0,0,0.3)'
                              : '0 16px 48px rgba(26,21,16,0.1)',
                            padding: '6px',
                            zIndex: 50,
                          }}
                        >
                          <div style={{ padding: '8px 10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{
                              width: '36px',
                              height: '36px',
                              borderRadius: '8px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#000',
                              background: '#fff',
                              border: '1px solid #d1d5db',
                              fontSize: '13px',
                              fontWeight: 700,
                              lineHeight: 1,
                            }}>
                              {getInitials(user?.username || '').slice(0, 1)}
                            </div>
                            <div style={{ minWidth: 0 }}>
                              <p style={{ fontSize: '13px', fontWeight: 700, color: colors.text, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {user?.username}
                              </p>
                              <p style={{ fontSize: '11px', color: colors.textMuted, margin: '1px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {user?.email}
                              </p>
                            </div>
                          </div>

                          <div style={{ height: '1px', background: isDark ? 'rgba(51,65,85,0.4)' : 'rgba(226,232,240,0.5)', margin: '4px 8px' }} />

                        
                          <div style={{ height: '1px', background: isDark ? 'rgba(51,65,85,0.4)' : 'rgba(226,232,240,0.5)', margin: '4px 8px' }} />

                          <button
                            onClick={handleLogout}
                            style={{
                              width: '100%',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              padding: '8px 10px',
                              borderRadius: '7px',
                              border: 'none',
                              background: 'transparent',
                              cursor: 'pointer',
                              fontSize: '13px',
                              fontWeight: 500,
                              color: '#EF4444',
                              transition: 'all 0.15s',
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                          >
                            <LogOut size={14} strokeWidth={1.8} />
                            Sign out
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              ) : (
                /* Login / Sign Up */
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Link
                    to="/login"
                    className="hidden sm:inline-flex"
                    style={{
                      display: 'none',
                      alignItems: 'center',
                      gap: '5px',
                      padding: '7px 13px',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: 600,
                      color: colors.textMuted,
                      textDecoration: 'none',
                      transition: 'all 0.2s',
                      whiteSpace: 'nowrap',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = colors.hoverBg;
                      e.currentTarget.style.color = colors.text;
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = colors.textMuted;
                    }}
                  >
                    <style>{`@media (min-width: 640px) { a.hidden.sm\\:inline-flex { display: inline-flex !important; } a.sm\\:hidden { display: none !important; } }`}</style>
                    <LogIn size={13} />
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="hidden sm:inline-flex"
                    style={{
                      display: 'none',
                      alignItems: 'center',
                      gap: '5px',
                      padding: '7px 14px',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: 700,
                      background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                      color: '#fff',
                      textDecoration: 'none',
                      boxShadow: '0 2px 8px rgba(99,102,241,0.25)',
                      transition: 'all 0.2s',
                      whiteSpace: 'nowrap',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = 'translateY(-1px)';
                      e.currentTarget.style.boxShadow = '0 4px 14px rgba(99,102,241,0.35)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(99,102,241,0.25)';
                    }}
                  >
                    <UserPlus size={13} />
                    Sign Up
                  </Link>
                </div>
              )}

              {/* Mobile Menu Toggle (visible only below lg) */}
              <button
                onClick={() => setMobileOpen(v => !v)}
                className="mobile-toggle"
                style={{
                  display: 'none',
                  width: '40px',
                  height: '40px',
                  borderRadius: '12px',

                  background: mobileOpen
                    ? 'rgba(99,102,241,0.12)'
                    : 'rgba(255,255,255,0.9)',

                  backdropFilter: 'blur(12px)',

                  border: mobileOpen
                    ? '1.5px solid rgba(99,102,241,0.35)'
                    : '1px solid rgba(148,163,184,0.25)',

                  boxShadow: mobileOpen
                    ? '0 8px 20px rgba(99,102,241,0.15)'
                    : '0 4px 12px rgba(0,0,0,0.06)',

                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',

                  color: mobileOpen
                    ? '#6366F1'
                    : '#64748B',

                  transition: 'all 0.25s ease',
                }}
              >
                <style>{`
    @media (max-width: 1023px) {
      .mobile-toggle {
        display: flex !important;
      }
    }

    .mobile-toggle:hover {
      transform: translateY(-1px);
      box-shadow: 0 10px 24px rgba(99,102,241,0.15);
    }
  `}</style>

                {mobileOpen ? (
                  <X size={18} strokeWidth={2.5} />
                ) : (
                  <Menu size={18} strokeWidth={2.5} />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              style={{
                overflow: 'hidden',
                background: isDark ? 'rgba(15,23,42,0.98)' : 'rgba(247,244,238,0.98)',
                backdropFilter: 'blur(16px)',
                borderBottom: `1px solid ${isDark ? 'rgba(51,65,85,0.3)' : 'rgba(232,228,220,0.6)'}`,
                boxShadow: isDark ? '0 16px 32px rgba(0,0,0,0.2)' : '0 8px 24px rgba(0,0,0,0.04)',
              }}
            >
              <div style={{ padding: '8px 20px 12px', display: 'flex', flexDirection: 'column', gap: '1px' }}>


                <div style={{ height: '1px', background: isDark ? 'rgba(51,65,85,0.3)' : 'rgba(226,232,240,0.5)', margin: '4px 0' }} />

                {!isAuthenticated ? (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setMobileOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: 600,
                        color: colors.text,
                        textDecoration: 'none',
                      }}
                    >
                      <LogIn size={16} />
                      Login
                    </Link>
                    <Link
                      to="/signup"
                      onClick={() => setMobileOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: 700,
                        background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                        color: '#fff',
                        textDecoration: 'none',
                      }}
                    >
                      <UserPlus size={16} />
                      Sign Up
                    </Link>
                  </>
                ) : (
                  <button
                    onClick={handleLogout}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: 'none',
                      background: 'transparent',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: 600,
                      color: '#EF4444',
                      width: '100%',
                    }}
                  >
                    <LogOut size={16} />
                    Sign out
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      <div style={{ height: scrolled ? '62px' : '70px' }} />
    </>
  );
}

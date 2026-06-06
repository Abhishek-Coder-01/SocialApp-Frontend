import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  RefreshCw, AlertTriangle, Sparkles, 
  ChevronDown, Clock, Zap, TrendingUp, SlidersHorizontal,
  ArrowUp, CheckCircle2
} from 'lucide-react';
import CreatePost from '../components/CreatePost';
import PostCard from '../components/PostCard';
import EmptyFeed from '../components/feed/EmptyFeed';
import { PostSkeleton } from '../components/ui/Skeleton';
import api from '../utils/api';

/* ─── Google Fonts ───────────────────────────────────────────────────── */
const FONTS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');
`;

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('latest');
  const feedRef = useRef(null);
  const loadMoreRef = useRef(null);
  const [spinOnClick, setSpinOnClick] = useState(false);
  const spinTimeoutRef = useRef(null);

  // Scroll to top detection
  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 600);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch posts for a given page
  const fetchPosts = useCallback(async (pageNum = 1, append = false) => {
    try {
      const { data } = await api.get(`/posts?page=${pageNum}&limit=10&sort=${activeFilter}`);

      if (append) {
        setPosts((prev) => [...prev, ...data.posts]);
      } else {
        setPosts(data.posts);
      }
      setHasMore(data.hasMore);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load posts. Please try again.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [activeFilter]);

  // Initial load
  useEffect(() => {
    fetchPosts(1, false);
  }, [fetchPosts]);

  // Load more posts (pagination)
  const handleLoadMore = () => {
    if (loadingMore) return;
    setLoadingMore(true);
    const nextPage = page + 1;
    setPage(nextPage);
    fetchPosts(nextPage, true);
  };

  // Refresh feed
  const handleRefresh = () => {
    setLoading(true);
    setPage(1);
    // start a temporary 1s spin on click for user feedback
    setSpinOnClick(true);
    if (spinTimeoutRef.current) clearTimeout(spinTimeoutRef.current);
    spinTimeoutRef.current = setTimeout(() => setSpinOnClick(false), 1000);
    fetchPosts(1, false);
  };

  // cleanup any pending spin timeout on unmount
  useEffect(() => {
    return () => {
      if (spinTimeoutRef.current) clearTimeout(spinTimeoutRef.current);
    };
  }, []);

  // Prepend new post to feed instantly
  const handlePostCreated = (newPost) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  // Remove deleted post from feed
  const handlePostDeleted = (postId) => {
    setPosts((prev) => prev.filter((p) => p._id !== postId));
  };

  // Handle post update
  const handlePostUpdate = (updated) => {
    setPosts((prev) => prev.map((p) => (p._id === updated._id ? updated : p)));
  };

  // Scroll to top
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Filter options
  const filterOptions = [
    { value: 'latest', label: 'Latest', icon: Clock },
    { value: 'trending', label: 'Trending', icon: TrendingUp },
    { value: 'popular', label: 'Most Popular', icon: Zap },
  ];

  const activeFilterLabel = filterOptions.find(f => f.value === activeFilter)?.label || 'Latest';

  return (
    <>
      <style>{FONTS}</style>
      
      <div style={{ 
        display: 'flex', 
        gap: '28px', 
        alignItems: 'flex-start',
        fontFamily: 'Plus Jakarta Sans, sans-serif',
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '0 24px',
      }}>
        
        {/* ═══ MAIN FEED CONTAINER ═══ */}
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '24px' }} ref={feedRef}>
          
          {/* ═══ FEED HEADER ═══ */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '20px 24px',
              borderRadius: '20px',
              background: 'rgba(255,255,255,0.5)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: '1px solid rgba(232,228,220,0.6)',
              boxShadow: '0 2px 12px rgba(26,21,16,0.03)',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            {/* Left side */}
         <div style={{
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '20px 0',
  borderBottom: '1px solid rgba(26,21,16,0.06)',
  marginBottom: '8px',
}}>
  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
    {/* Premium Icon Container */}
    <div style={{
      width: '44px',
      height: '44px',
      borderRadius: '14px',
      background: 'linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 4px 12px rgba(99,102,241,0.12), inset 0 1px 0 rgba(255,255,255,0.8)',
      border: '1px solid rgba(99,102,241,0.1)',
    }}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    </div>

    {/* Text Content */}
    <div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
        <h1 style={{
          fontFamily: 'Playfair Display, serif',
          fontSize: '28px',
          fontWeight: 900,
          color: '#1A1510',
          letterSpacing: '-0.04em',
          margin: 0,
          lineHeight: 1.1,
          position: 'relative',
        }}>
          Social Feed
        </h1>
    
      </div>
      <p style={{
        fontFamily: 'Inter, -apple-system, sans-serif',
        fontSize: '11px',
        fontWeight: 500,
        color: 'rgba(26,21,16,0.4)',
        margin: '4px 0 0',
        letterSpacing: '0.2px',
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
      }}>
        {posts.length > 0 ? (
          <>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '3px',
              background: 'rgba(16,185,129,0.1)',
              padding: '2px 8px',
              borderRadius: '20px',
              fontSize: '10px',
              fontWeight: 600,
              color: '#059669',
            }}>
              <span style={{ fontSize: '11px' }}>✦</span>
              {posts.length} {posts.length === 1 ? 'post' : 'posts'}
            </span>
          </>
        ) : (
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '3px',
            background: 'rgba(99,102,241,0.06)',
            padding: '2px 8px',
            borderRadius: '20px',
            fontSize: '10px',
            fontWeight: 600,
            color: '#6366F1',
          }}>
            Your timeline
          </span>
        )}
      </p>
    </div>
  </div>

  {/* Optional: Premium Action Button */}
  <div style={{
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  }}>
  
  </div>
</div>

{/* Add this CSS animation in your stylesheet or style tag */}
<style>{`
  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.6; transform: scale(1.3); }
  }
`}</style>

            {/* Right side - Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {/* Filter Dropdown */}
              <div style={{ position: 'relative' }}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setFilterOpen(v => !v)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 14px',
                    borderRadius: '10px',
                    border: `1.5px solid ${filterOpen ? 'rgba(99,102,241,0.3)' : 'rgba(232,228,220,0.6)'}`,
                    background: filterOpen ? 'rgba(99,102,241,0.04)' : 'rgba(255,255,255,0.6)',
                    cursor: 'pointer',
                    fontFamily: 'Plus Jakarta Sans, sans-serif',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#1A1510',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <SlidersHorizontal size={14} color="#6366F1" />
                  {activeFilterLabel}
                  <ChevronDown 
                    size={13} 
                    style={{
                      transform: filterOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s',
                      color: 'rgba(26,21,16,0.35)',
                    }}
                  />
                </motion.button>

                {/* Filter Dropdown */}
                <AnimatePresence>
                  {filterOpen && (
                    <>
                      <div 
                        style={{ position: 'fixed', inset: 0, zIndex: 40 }} 
                        onClick={() => setFilterOpen(false)} 
                      />
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -4 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -4 }}
                        transition={{ duration: 0.15 }}
                        style={{
                          position: 'absolute',
                          right: 0,
                          top: 'calc(100% + 6px)',
                          width: '200px',
                          borderRadius: '14px',
                          background: '#fff',
                          border: '1px solid rgba(232,228,220,0.8)',
                          boxShadow: '0 16px 48px rgba(26,21,16,0.1)',
                          padding: '6px',
                          zIndex: 50,
                        }}
                      >
                        {filterOptions.map(({ value, label, icon: Icon }) => (
                          <button
                            key={value}
                            onClick={() => {
                              setActiveFilter(value);
                              setFilterOpen(false);
                              handleRefresh();
                            }}
                            style={{
                              width: '100%',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '9px',
                              padding: '9px 12px',
                              borderRadius: '10px',
                              border: 'none',
                              background: activeFilter === value ? 'rgba(99,102,241,0.06)' : 'transparent',
                              cursor: 'pointer',
                              fontFamily: 'Plus Jakarta Sans, sans-serif',
                              fontSize: '13px',
                              fontWeight: activeFilter === value ? 700 : 500,
                              color: activeFilter === value ? '#6366F1' : 'rgba(26,21,16,0.6)',
                              transition: 'all 0.15s',
                            }}
                            onMouseEnter={e => {
                              if (activeFilter !== value) {
                                e.currentTarget.style.background = 'rgba(26,21,16,0.03)';
                              }
                            }}
                            onMouseLeave={e => {
                              if (activeFilter !== value) {
                                e.currentTarget.style.background = 'transparent';
                              }
                            }}
                          >
                            <Icon size={14} strokeWidth={2} />
                            {label}
                            {activeFilter === value && (
                              <CheckCircle2 size={13} color="#6366F1" style={{ marginLeft: 'auto' }} />
                            )}
                          </button>
                        ))}
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              {/* Refresh Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleRefresh}
                disabled={loading}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 14px',
                  borderRadius: '10px',
                  border: '1.5px solid rgba(232,228,220,0.6)',
                  background: 'rgba(255,255,255,0.6)',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontFamily: 'Plus Jakarta Sans, sans-serif',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#1A1510',
                  opacity: loading ? 0.5 : 1,
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={e => {
                  if (!loading) {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.9)';
                    e.currentTarget.style.borderColor = 'rgba(99,102,241,0.3)';
                  }
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.6)';
                  e.currentTarget.style.borderColor = 'rgba(232,228,220,0.6)';
                }}
              >
                <motion.div
                  animate={loading ? { rotate: 360 } : spinOnClick ? { rotate: [0, 360] } : {}}
                  transition={loading ? { duration: 1, repeat: Infinity, ease: "linear" } : spinOnClick ? { duration: 1, repeat: 0, ease: "linear" } : {}}
                >
                  <RefreshCw size={14} />
                </motion.div>
                Refresh
              </motion.button>
            </div>
          </motion.div>

          {/* ═══ CREATE POST ═══ */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <CreatePost onPostCreated={handlePostCreated} />
          </motion.div>

          {/* ═══ ERROR STATE ═══ */}
          <AnimatePresence>
            {error && !loading && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.98 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px 20px',
                  borderRadius: '16px',
                  background: 'rgba(239,68,68,0.06)',
                  border: '1.5px solid rgba(239,68,68,0.2)',
                  gap: '12px',
                  flexWrap: 'wrap',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '9px',
                    background: 'rgba(239,68,68,0.12)',
                    border: '1px solid rgba(239,68,68,0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <AlertTriangle size={15} color="#EF4444" />
                  </div>
                  <p style={{
                    fontFamily: 'Plus Jakarta Sans, sans-serif',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#DC2626',
                    margin: 0,
                  }}>
                    {error}
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleRefresh}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '9px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #EF4444, #DC2626)',
                    color: '#fff',
                    fontFamily: 'Plus Jakarta Sans, sans-serif',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(239,68,68,0.2)',
                    flexShrink: 0,
                  }}
                >
                  Retry
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ═══ LOADING STATE ═══ */}
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
            >
              {[1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <PostSkeleton />
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* ═══ EMPTY STATE ═══ */}
          {!loading && !error && posts.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <EmptyFeed onRefresh={handleRefresh} />
            </motion.div>
          )}

          {/* ═══ POSTS LIST ═══ */}
          {!loading && posts.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
            >
              <AnimatePresence mode="popLayout">
                {posts.map((post, index) => (
                  <motion.div
                    key={post._id}
                    layout
                    initial={{ opacity: 0, y: 20, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ 
                      duration: 0.35, 
                      delay: Math.min(index * 0.03, 0.2),
                      ease: [0.22, 1, 0.36, 1]
                    }}
                  >
                    <PostCard
                      post={post}
                      onDelete={handlePostDeleted}
                      onUpdate={handlePostUpdate}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}

          {/* ═══ LOAD MORE ═══ */}
          {!loading && hasMore && posts.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              style={{ textAlign: 'center', padding: '16px 0 32px' }}
              ref={loadMoreRef}
            >
              <motion.button
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleLoadMore}
                disabled={loadingMore}
                style={{
                  padding: '12px 32px',
                  borderRadius: '14px',
                  border: '1.5px solid rgba(232,228,220,0.6)',
                  background: loadingMore ? 'rgba(26,21,16,0.02)' : 'rgba(255,255,255,0.6)',
                  backdropFilter: 'blur(8px)',
                  cursor: loadingMore ? 'not-allowed' : 'pointer',
                  fontFamily: 'Plus Jakarta Sans, sans-serif',
                  fontSize: '14px',
                  fontWeight: 700,
                  color: loadingMore ? 'rgba(26,21,16,0.4)' : '#6366F1',
                  transition: 'all 0.2s ease',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  opacity: loadingMore ? 0.7 : 1,
                }}
                onMouseEnter={e => {
                  if (!loadingMore) {
                    e.currentTarget.style.background = 'rgba(99,102,241,0.04)';
                    e.currentTarget.style.borderColor = 'rgba(99,102,241,0.25)';
                  }
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.6)';
                  e.currentTarget.style.borderColor = 'rgba(232,228,220,0.6)';
                }}
              >
                {loadingMore ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <RefreshCw size={15} />
                    </motion.div>
                    Loading Posts...
                  </>
                ) : (
                  <>
                    <Sparkles size={15} />
                    Load More Posts
                  </>
                )}
              </motion.button>
            </motion.div>
          )}

        </div>

        {/* ═══ SCROLL TO TOP BUTTON ═══ */}
        <AnimatePresence>
          {showScrollTop && (
            <motion.button
              initial={{ opacity: 0, scale: 0.5, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.5, y: 20 }}
              onClick={scrollToTop}
              style={{
                position: 'fixed',
                bottom: '32px',
                right: '32px',
                width: '44px',
                height: '44px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                border: 'none',
                color: '#fff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 24px rgba(99,102,241,0.3)',
                zIndex: 50,
                transition: 'all 0.2s ease',
              }}
              whileHover={{ 
                scale: 1.05,
                boxShadow: '0 12px 32px rgba(99,102,241,0.4)',
              }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowUp size={18} />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

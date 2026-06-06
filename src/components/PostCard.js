import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart, MessageCircle, Share2, Bookmark, MoreHorizontal,
  Trash2, X, Send, ChevronDown,
  Eye, Clock, Check, BadgeCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import api from '../utils/api';
import Avatar from './ui/Avatar';
import { cn, formatCount, formatRelativeTime } from '../lib/utils';

function CommentItem({ comment }) {
  const [liked, setLiked] = useState(false);
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex gap-2.5 group/comment"
    >
      <Avatar username={comment.username} size="xs" className="mt-0.5 flex-shrink-0 ring-2 ring-white dark:ring-slate-800" />
      <div className="flex-1 min-w-0">
        <div className="bg-slate-50 dark:bg-slate-800/40 rounded-xl px-3.5 py-2.5">
          <span className="font-semibold text-xs text-slate-800 dark:text-slate-200 mr-1.5">
            {comment.username}
          </span>
          <span className="text-[13px] text-slate-600 dark:text-slate-300 break-words leading-relaxed">
            {comment.text}
          </span>
        </div>
        <div className="flex items-center gap-3 mt-1 ml-1.5">
          {comment.createdAt && (
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
              {formatRelativeTime(comment.createdAt)}
            </span>
          )}
          <button
            onClick={() => setLiked(!liked)}
            className={cn(
              "text-[10px] font-semibold transition-colors duration-200",
              liked ? "text-rose-500" : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-400"
            )}
          >
            {liked ? 'Liked' : 'Like'}
          </button>
          <button className="text-[10px] text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-400 font-semibold transition-colors duration-200">
            Reply
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function PostCard({ post, onDelete, onUpdate }) {
  const { user, isAuthenticated } = useAuth();

  const getCount = (value) => {
    if (Array.isArray(value)) return value.length;
    const numericValue = Number(value);
    return Number.isFinite(numericValue) ? numericValue : 0;
  };

  const [likes, setLikes] = useState(post.likes || []);
  const [comments, setComments] = useState(post.comments || []);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [loadingLike, setLoadingLike] = useState(false);
  const [loadingComment, setLoadingComment] = useState(false);
  const [imgExpanded, setImgExpanded] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [lightbox, setLightbox] = useState(false);
  const [copied, setCopied] = useState(false);
  const [likeAnimation, setLikeAnimation] = useState(false);

  const isLiked = user
    ? likes.some((l) => (l._id || l) === user._id || (l._id || l).toString() === user._id)
    : false;
  const isOwner = user && post.author?._id === user._id;
  const viewCount = getCount(post.views ?? post.viewCount ?? post.viewsCount);

  const handleLike = async () => {
    if (!isAuthenticated) return toast.info('Please login to like posts');
    setLoadingLike(true);
    const wasLiked = isLiked;
    
    if (!wasLiked) {
      setLikeAnimation(true);
      setTimeout(() => setLikeAnimation(false), 600);
    }
    
    setLikes((prev) =>
      wasLiked ? prev.filter((l) => (l._id || l).toString() !== user._id) : [...prev, user._id]
    );
    
    try {
      const { data } = await api.put(`/posts/${post._id}/like`);
      setLikes(data.likesList);
    } catch (err) {
      setLikes(post.likes || []);
      toast.error('Failed to like post');
    } finally {
      setLoadingLike(false);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    if (!isAuthenticated) return toast.info('Please login to comment');
    setLoadingComment(true);
    try {
      const { data } = await api.post(`/posts/${post._id}/comment`, { text: commentText });
      setComments((prev) => [...prev, data.comment]);
      setCommentText('');
      toast.success('Comment added!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add comment');
    } finally {
      setLoadingComment(false);
    }
  };

  const handleDelete = async () => {
    setShowMenu(false);
    if (!window.confirm('Delete this post?')) return;
    try {
      await api.delete(`/posts/${post._id}`);
      toast.success('Post deleted');
      onDelete(post._id);
    } catch (err) {
      toast.error('Failed to delete post');
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      toast.success('Link copied!');
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <>
      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && post.image && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(false)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4"
          >
            <motion.img
              src={post.image}
              alt="Post"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="max-w-full max-h-[90vh] rounded-2xl object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={() => setLightbox(false)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm 
                       flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            >
              <X size={20} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Post Card */}
      <motion.article
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="mb-4"
      >
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 
                      shadow-sm overflow-hidden">
          
          {/* Header */}
          <div className="flex items-start justify-between p-4 pb-2">
            <div className="flex items-center gap-3">
              <Avatar username={post.author?.username} size="md" className="ring-1 ring-gray-300 dark:ring-slate-800" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm !text-black">
                    {post.author?.username || 'Unknown'}
                  </span>
                  <span className="w-4 h-4 rounded-full flex items-center justify-center">
                    <BadgeCheck size={14} className="text-[#0095f6]" />
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Clock size={11} className="text-slate-600 dark:text-slate-400" />
                  <span className="text-[11px] text-slate-700 dark:text-slate-300 font-medium">
                    {formatRelativeTime(post.createdAt)}
                  </span>
                </div>
              </div>
            </div>

            {/* Menu Button */}
            <div className="relative">
              <button
                onClick={() => setShowMenu((v) => !v)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 
                         hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <MoreHorizontal size={16} />
              </button>
              
              <AnimatePresence>
                {showMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-1 w-40 rounded-xl bg-white dark:bg-slate-800 
                               shadow-lg border border-slate-200 dark:border-slate-700 p-1.5 z-50"
                    >
                      {isOwner && (
                        <button
                          onClick={handleDelete}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-500
                                   hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors font-medium"
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                      )}
                      <button
                        onClick={() => { handleShare(); setShowMenu(false); }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-sm
                                 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 
                                 rounded-lg transition-colors font-medium"
                      >
                        {copied ? <Check size={14} className="text-emerald-500" /> : <Share2 size={14} />}
                        {copied ? 'Copied!' : 'Copy link'}
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Post Text */}
          {post.text && (
            <div className="px-4 pb-3">
              <p className="text-[15px] leading-relaxed text-slate-700 dark:text-slate-200 whitespace-pre-wrap">
                {post.text}
              </p>
            </div>
          )}

          {/* Post Image */}
          {post.image && (
            <div
              className="mx-4 mb-3 overflow-hidden rounded-xl cursor-pointer bg-slate-50 dark:bg-slate-900"
              onClick={() => setLightbox(true)}
            >
              <div className="flex items-center justify-center">
                <img
                  src={post.image}
                  alt="Post"
                  className={cn(
                    'w-full object-contain transition-all duration-500',
                    imgExpanded ? 'max-h-[70vh]' : 'max-h-96'
                  )}
                />
              </div>
              {!imgExpanded && (
                <button
                  onClick={(e) => { e.stopPropagation(); setImgExpanded(true); }}
                  className="w-full flex items-center justify-center gap-1.5 py-2 text-xs font-medium
                           text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50
                           hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                >
                  <ChevronDown size={14} />
                  Show full image
                </button>
              )}
            </div>
          )}

          {/* Stats */}
          <div className="px-4 pb-2 flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
              <Heart size={12} className={isLiked ? 'text-rose-500 fill-rose-500' : ''} />
              <span className="font-medium">{formatCount(likes.length)}</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
              <MessageCircle size={12} />
              <span className="font-medium">{formatCount(comments.length)}</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
              <Eye size={12} />
              <span className="font-medium">{formatCount(viewCount)}</span>
            </div>
          </div>

          {/* Action Bar */}
          <div className="px-3 pb-3 flex items-center border-t border-slate-100 dark:border-slate-800 pt-2.5">
            <button
              onClick={handleLike}
              disabled={loadingLike}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-semibold transition-colors duration-200',
                isLiked
                  ? 'text-rose-500 bg-rose-50 dark:bg-rose-500/10'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
              )}
            >
              <motion.div
                animate={likeAnimation ? { scale: [1, 1.3, 1] } : {}}
                transition={{ duration: 0.3 }}
              >
                <Heart size={18} className={isLiked ? 'fill-current' : ''} strokeWidth={isLiked ? 0 : 2} />
              </motion.div>
              <span>Like</span>
            </button>

            <button
              onClick={() => setShowComments((v) => !v)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-semibold transition-colors duration-200',
                showComments
                  ? 'text-primary bg-primary/5 dark:bg-primary/10'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
              )}
            >
              <MessageCircle size={18} />
              <span>Comment</span>
            </button>

            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-semibold
                       text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 
                       transition-colors duration-200"
            >
              {copied ? <Check size={18} className="text-emerald-500" /> : <Share2 size={18} />}
              <span>{copied ? 'Copied!' : 'Share'}</span>
            </button>

            <div className="flex-1" />

            <button
              onClick={() => { 
                setSaved((v) => !v); 
                toast.success(saved ? 'Removed' : 'Saved!');
              }}
              className={cn(
                'p-2 rounded-xl transition-colors duration-200',
                saved
                  ? 'text-amber-500 bg-amber-50 dark:bg-amber-500/10'
                  : 'text-slate-400 hover:text-amber-500 hover:bg-slate-50 dark:hover:bg-slate-800/50'
              )}
            >
              <Bookmark size={18} className={saved ? 'fill-current' : ''} />
            </button>
          </div>

          {/* Comments Section */}
          <AnimatePresence>
            {showComments && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
                  <div className="p-4 space-y-3">
                    {comments.length > 0 ? (
                      <div className="space-y-3 max-h-64 overflow-y-auto pr-1 custom-scrollbar">
                        {comments.map((comment, i) => (
                          <CommentItem key={comment._id || i} comment={comment} />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <MessageCircle size={24} className="mx-auto text-slate-300 dark:text-slate-600 mb-2" />
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                          No comments yet
                        </p>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                          Be the first to share your thoughts
                        </p>
                      </div>
                    )}

                    {isAuthenticated && (
                      <form onSubmit={handleComment} className="flex gap-2.5 items-center pt-1">
                        <Avatar username={user?.username} size="xs" className="flex-shrink-0" />
                        <div className="flex-1 flex items-center gap-2 bg-slate-100 dark:bg-slate-800/50 
                                     rounded-xl px-3.5 py-2 border border-transparent focus-within:bg-white 
                                     dark:focus-within:bg-slate-800 focus-within:border-primary/30 transition-all duration-200">
                          <input
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            placeholder="Write a comment..."
                            maxLength={300}
                            disabled={loadingComment}
                            className="flex-1 bg-transparent text-sm text-slate-700 dark:text-slate-200
                                     placeholder-slate-400 dark:placeholder-slate-500 outline-none"
                          />
                          <button
                            type="submit"
                            disabled={!commentText.trim() || loadingComment}
                            className="flex-shrink-0 text-primary disabled:text-slate-300 dark:disabled:text-slate-600 
                                     transition-colors p-1"
                          >
                            {loadingComment ? (
                              <div className="w-4 h-4 border-2 border-primary/40 border-t-primary rounded-full animate-spin" />
                            ) : (
                              <Send size={15} />
                            )}
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.article>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 999px;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #334155;
        }
      `}</style>
    </>
  );
}

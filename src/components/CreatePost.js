import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image as ImageIcon, X, Send, Smile } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import api from '../utils/api';
import Avatar from './ui/Avatar';
import { cn } from '../lib/utils';

export default function CreatePost({ onPostCreated }) {
  const { user } = useAuth();
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  const EMOJIS = ['😀', '😁', '😂', '🥰', '😍', '😎', '🤗', '😇', '🔥', '✨', '💯', '🎉', '❤️', '👍', '🙏', '😢'];

  const MAX_CHARS = 1000;
  const charWarning = text.length > 800;

  const processFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) { toast.error('Please select an image file'); return; }
    if (file.size > 10 * 1024 * 1024) { toast.error('Image must be smaller than 10MB'); return; }
    setImage(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleImageChange = (e) => processFile(e.target.files[0]);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    processFile(e.dataTransfer.files[0]);
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview(null);
    setShowEmojiPicker(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const insertEmoji = (emoji) => {
    const textarea = textareaRef.current;
    const start = textarea?.selectionStart ?? text.length;
    const end = textarea?.selectionEnd ?? text.length;
    const nextText = `${text.slice(0, start)}${emoji}${text.slice(end)}`;

    setText(nextText);
    setShowEmojiPicker(false);

    window.requestAnimationFrame(() => {
      if (!textarea) return;
      textarea.focus();
      const cursor = start + emoji.length;
      textarea.setSelectionRange(cursor, cursor);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim() && !image) { toast.warning('Add some text or an image'); return; }

    setLoading(true);
    try {
      const formData = new FormData();
      if (text.trim()) formData.append('text', text.trim());
      if (image) formData.append('image', image);

      const { data } = await api.post('/posts', formData);
      toast.success('Post shared! ✨');
      setText('');
      setImage(null);
      setImagePreview(null);
      setFocused(false);
      setShowEmojiPicker(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
      onPostCreated(data.post);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setText('');
    setImage(null);
    setImagePreview(null);
    setFocused(false);
    setShowEmojiPicker(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div
      className={cn(
        'card mb-5 transition-all duration-300',
        focused && 'ring-2 ring-primary/40 shadow-glow-primary/20'
      )}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
    >
      <div className="p-4 relative">
        {showEmojiPicker && (
          <button
            type="button"
            aria-label="Close emoji picker"
            className="fixed inset-0 z-20 cursor-default"
            onClick={() => setShowEmojiPicker(false)}
          />
        )}
        <div className="flex gap-3">
          <Avatar username={user?.username} size="md" />

          <div className="flex-1 min-w-0">
            {/* Textarea */}
            <textarea
              ref={textareaRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onFocus={() => setFocused(true)}
              placeholder={`What's on your mind, ${user?.username}?`}
              disabled={loading}
              maxLength={MAX_CHARS}
              rows={focused ? 3 : 1}
              className={cn(
                'w-full bg-transparent text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500',
                'text-sm leading-relaxed resize-none outline-none transition-all duration-200',
                focused ? 'min-h-[72px]' : 'min-h-[36px]'
              )}
            />

            {/* Image Preview */}
            <AnimatePresence>
              {imagePreview && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="relative mt-2 overflow-hidden rounded-xl border border-light-border dark:border-dark-border bg-slate-50 dark:bg-slate-900"
                >
                  <div className="flex items-center justify-center">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="max-h-[24rem] w-full object-contain"
                    />
                  </div>
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
                  <button
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 text-white
                               flex items-center justify-center hover:bg-black/80 transition-colors"
                  >
                    <X size={14} />
                  </button>
                  <span className="absolute bottom-2 left-2 text-xs text-white/80 bg-black/40 px-2 py-0.5 rounded-full truncate max-w-[60%]">
                    {image?.name}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Drag overlay */}
            {dragging && (
              <div className="mt-2 border-2 border-dashed border-primary/50 rounded-xl p-6 text-center">
                <ImageIcon size={24} className="text-primary/60 mx-auto mb-1" />
                <p className="text-sm text-primary/70">Drop your image here</p>
              </div>
            )}

            {/* Action Row */}
            <AnimatePresence>
              {(focused || imagePreview) && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center justify-between mt-3 pt-3 border-t border-light-border dark:border-dark-border"
                >
                  {/* Left actions */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={loading}
                      className={cn(
                        'w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200',
                        imagePreview
                          ? 'text-primary bg-primary/10'
                          : 'text-slate-400 hover:text-primary hover:bg-primary/10'
                      )}
                      title="Add image"
                    >
                      <ImageIcon size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowEmojiPicker((value) => !value)}
                      disabled={loading}
                      className={cn(
                        'w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200',
                        showEmojiPicker
                          ? 'text-primary bg-primary/10'
                          : 'text-slate-400 hover:text-primary hover:bg-primary/10'
                      )}
                      title="Add emoji"
                    >
                      <Smile size={16} />
                    </button>

                    {/* Character counter */}
                    {text.length > 0 && (
                      <span className={cn(
                        'text-xs ml-1 font-medium tabular-nums',
                        charWarning ? 'text-amber-500' : 'text-slate-400 dark:text-slate-500'
                      )}>
                        {MAX_CHARS - text.length}
                      </span>
                    )}
                  </div>

                  {/* Right actions */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleCancel}
                      disabled={loading}
                      className="px-3 py-1.5 rounded-lg text-sm font-medium text-slate-500 dark:text-slate-400
                                 hover:bg-light-elevated dark:hover:bg-dark-elevated transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={loading || (!text.trim() && !image)}
                      className="btn-primary px-4 py-1.5 text-sm gap-1.5"
                    >
                      {loading ? (
                        <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <Send size={14} />
                          Post
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {showEmojiPicker && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.16 }}
                  className="absolute left-16 bottom-16 z-30 w-[18rem] rounded-2xl border border-light-border dark:border-dark-border bg-white dark:bg-dark-surface shadow-xl p-3"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Choose emoji</span>
                    <button
                      type="button"
                      onClick={() => setShowEmojiPicker(false)}
                      className="w-7 h-7 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
                    >
                      <X size={14} className="mx-auto" />
                    </button>
                  </div>
                  <div className="grid grid-cols-8 gap-1.5">
                    {EMOJIS.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => insertEmoji(emoji)}
                        className="h-9 w-9 rounded-lg text-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        aria-label={`Insert ${emoji}`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Collapsed hint */}
        {!focused && !imagePreview && (
          <div className="flex gap-2 mt-2 ml-11">
            <button
              onClick={() => { setFocused(true); fileInputRef.current?.click(); }}
              className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500
                         hover:text-primary transition-colors px-2 py-1 rounded-lg hover:bg-primary/10"
            >
              <ImageIcon size={13} />
              Photo
            </button>
          </div>
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageChange}
        accept="image/*"
        style={{ display: 'none' }}
      />
    </div>
  );
}

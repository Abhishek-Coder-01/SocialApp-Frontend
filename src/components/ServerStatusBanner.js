import React, { useSyncExternalStore } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, X } from 'lucide-react';
import { getApiStatusSnapshot, hideApiNotice, subscribeApiStatus } from '../utils/apiStatus';

export default function ServerStatusBanner() {
  const status = useSyncExternalStore(subscribeApiStatus, getApiStatusSnapshot, getApiStatusSnapshot);

  if (!status.isRenderHost) return null;

  return (
    <AnimatePresence>
      {status.showNotice && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.18 }}
          className="fixed top-4 left-1/2 z-[60] w-[calc(100%-2rem)] max-w-xl -translate-x-1/2"
        >
          <div className="rounded-2xl border border-amber-200/70 dark:border-amber-500/30 bg-amber-50/95 dark:bg-amber-500/10 backdrop-blur-md px-4 py-3 shadow-lg flex items-start gap-3">
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-300">
              <AlertCircle size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-amber-900 dark:text-amber-100">
                Render server is waking up
              </p>
              <p className="text-xs leading-relaxed text-amber-800/90 dark:text-amber-100/80">
                {status.message || 'Please wait a moment.'}
              </p>
            </div>
            <button
              type="button"
              onClick={hideApiNotice}
              className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-amber-700 hover:bg-amber-100 dark:text-amber-200 dark:hover:bg-amber-500/20 transition-colors"
              aria-label="Dismiss server notice"
            >
              <X size={14} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

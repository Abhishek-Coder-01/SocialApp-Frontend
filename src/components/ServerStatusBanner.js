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
          initial={{ opacity: 0, y: -8, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: -8, x: '-50%' }}
          transition={{ duration: 0.18 }}
          className="fixed top-[78px] left-1/2 z-[90] w-[calc(100vw-1rem)] max-w-none sm:top-[88px] sm:w-auto sm:max-w-xl"
        >
          <div className="relative flex items-start gap-2.5 rounded-2xl border border-amber-200/70 bg-amber-50/95 px-3 py-2.5 pr-8 text-left shadow-lg backdrop-blur-md dark:border-amber-500/30 dark:bg-amber-500/10 sm:gap-3 sm:px-4 sm:py-3 sm:pr-10">
            {/* Icon */}
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-300 sm:h-8 sm:w-8">
              <AlertCircle size={14} className="sm:hidden" />
              <AlertCircle size={16} className="hidden sm:block" />
            </div>
            
            {/* Text Content - ab poori width milegi */}
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-semibold leading-snug text-amber-900 break-words dark:text-amber-100 sm:text-sm">
                Render server is waking up
              </p>
              <p className="mt-0.5 text-[11px] leading-snug text-amber-800/90 break-words dark:text-amber-100/80 sm:text-xs sm:leading-relaxed">
                {status.message || 'Please wait a moment.'}
              </p>
            </div>
            
            {/* Close Button - absolute top-right */}
            <button
              type="button"
              onClick={hideApiNotice}
              className="absolute top-2 right-2 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-amber-700 transition-colors hover:bg-amber-100 dark:text-amber-200 dark:hover:bg-amber-500/20 sm:top-2.5 sm:right-2.5 sm:h-6 sm:w-6"
              aria-label="Dismiss server notice"
            >
              <X size={12} className="sm:hidden" />
              <X size={14} className="hidden sm:block" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, AlertCircle, ArrowLeft } from 'lucide-react';
import Button from '../components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center px-4 py-16 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="space-y-6 max-w-md"
      >
        <div className="relative inline-block">
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="text-8xl md:text-9xl font-black font-display gradient-text tracking-tighter"
          >
            404
          </motion.div>
          <div className="absolute -bottom-2 right-4 bg-amber-500 text-white rounded-full p-2 shadow-lg animate-bounce-gentle">
            <AlertCircle size={20} />
          </div>
        </div>

        <div className="space-y-3">
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-slate-100 font-display">
            Lost in Space?
          </h1>
          <p className="text-sm md:text-base text-slate-500 dark:text-slate-400">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <Link to="/" className="w-full sm:w-auto">
            <Button className="w-full flex items-center justify-center gap-2" variant="primary">
              <Home size={16} />
              Back to Home
            </Button>
          </Link>
          <button
            onClick={() => window.history.back()}
            className="w-full sm:w-auto btn flex items-center justify-center gap-2 px-5 py-2.5 border border-light-border dark:border-dark-border text-slate-600 dark:text-slate-300 hover:bg-light-elevated dark:hover:bg-dark-elevated rounded-xl font-semibold transition-all duration-200"
          >
            <ArrowLeft size={16} />
            Go Back
          </button>
        </div>
      </motion.div>
    </div>
  );
}

import React from 'react';
import { cn } from '../../lib/utils';

export default function Badge({ children, variant = 'primary', className }) {
  const variants = {
    primary: 'bg-primary/10 text-primary border-primary/20 dark:bg-primary/20 dark:text-primary-400 dark:border-primary/30',
    secondary: 'bg-secondary/10 text-secondary border-secondary/20 dark:bg-secondary/20 dark:text-secondary-400 dark:border-secondary/30',
    accent: 'bg-accent/10 text-accent border-accent/20 dark:bg-accent/20 dark:text-accent-400 dark:border-accent/30',
    success: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/30',
    danger: 'bg-rose-500/10 text-rose-500 border-rose-500/20 dark:bg-rose-500/20 dark:text-rose-400 dark:border-rose-500/30',
    warning: 'bg-amber-500/10 text-amber-500 border-amber-500/20 dark:bg-amber-500/20 dark:text-amber-400 dark:border-amber-500/30',
    neutral: 'bg-slate-500/10 text-slate-500 border-slate-500/20 dark:bg-slate-500/20 dark:text-slate-400 dark:border-slate-500/30',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border transition-colors duration-200',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

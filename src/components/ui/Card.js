import React from 'react';
import { cn } from '../../lib/utils';

export default function Card({ children, className, hover = false, glass = false, ...props }) {
  return (
    <div
      className={cn(
        glass ? 'glass' : 'bg-white dark:bg-dark-surface rounded-2xl border border-light-border dark:border-dark-border shadow-sm',
        'transition-all duration-300',
        hover && 'hover:shadow-md hover:-translate-y-px dark:hover:shadow-black/40',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

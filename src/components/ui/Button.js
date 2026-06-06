import React from 'react';
import { cn } from '../../lib/utils';

const variants = {
  primary: 'btn-primary text-sm',
  secondary: 'btn px-4 py-2 text-sm bg-secondary text-white hover:bg-secondary-600 hover:-translate-y-px transition-all duration-200',
  ghost: 'btn-ghost text-sm',
  outline: 'btn-outline text-sm',
  danger: 'btn px-4 py-2 text-sm text-red-500 border border-red-400/40 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all duration-200',
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs gap-1.5',
  md: '',
  lg: 'px-6 py-3 text-base gap-2.5',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className,
  loading = false,
  icon: Icon,
  ...props
}) {
  return (
    <button
      className={cn(variants[variant], sizes[size], className)}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : Icon ? (
        <Icon size={15} />
      ) : null}
      {children}
    </button>
  );
}

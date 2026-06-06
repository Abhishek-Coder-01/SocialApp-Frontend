import React from 'react';
import { cn } from '../../lib/utils';

export default function Spinner({ size = 'md', className }) {
  const sizes = {
    xs: 'w-3.5 h-3.5 border',
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-[3px]',
    lg: 'w-12 h-12 border-4',
    xl: 'w-16 h-16 border-[5px]',
  };

  return (
    <div
      className={cn(
        'animate-spin rounded-full border-solid border-current border-t-transparent text-primary',
        sizes[size],
        className
      )}
      role="status"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}

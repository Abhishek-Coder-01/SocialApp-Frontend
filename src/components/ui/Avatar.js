import React from 'react';
import { cn, avatarGradient, avatarGradientIndex, getInitials } from '../../lib/utils';

const sizeMap = {
  xs: 'w-6 h-6 text-[10px]',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg',
  '2xl': 'w-20 h-20 text-xl',
};

const gradientBackgrounds = [
  'linear-gradient(135deg, #6366F1, #8B5CF6)',
  'linear-gradient(135deg, #EC4899, #F43F5E)',
  'linear-gradient(135deg, #06B6D4, #3B82F6)',
  'linear-gradient(135deg, #10B981, #06B6D4)',
  'linear-gradient(135deg, #F59E0B, #EF4444)',
  'linear-gradient(135deg, #8B5CF6, #EC4899)',
];

export default function Avatar({ username = '', src, size = 'md', className, ring = false }) {
  if (src) {
    return (
      <img
        src={src}
        alt={username}
        className={cn(
          'rounded-full object-cover flex-shrink-0',
          sizeMap[size],
          ring && 'ring-2 ring-primary ring-offset-2 dark:ring-offset-dark-bg',
          className
        )}
      />
    );
  }

  return (
    <div
      style={{ backgroundImage: gradientBackgrounds[avatarGradientIndex(username)] }}
      className={cn(
        'rounded-full flex items-center justify-center text-white font-extrabold leading-none tracking-tight flex-shrink-0',
        sizeMap[size],
        avatarGradient(username),
        ring && 'ring-2 ring-primary ring-offset-2 dark:ring-offset-dark-bg',
        className
      )}
    >
      {getInitials(username)}
    </div>
  );
}

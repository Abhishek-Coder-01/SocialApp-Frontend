import React from 'react';
import { cn } from '../../lib/utils';

/* Post skeleton */
export function PostSkeleton() {
  return (
    <div className="card p-5 mb-4 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-light-elevated dark:bg-dark-elevated shimmer" />
        <div className="flex-1 space-y-2">
          <div className="h-3 w-32 rounded-full bg-light-elevated dark:bg-dark-elevated shimmer" />
          <div className="h-2.5 w-20 rounded-full bg-light-elevated dark:bg-dark-elevated shimmer" />
        </div>
      </div>
      {/* Text lines */}
      <div className="space-y-2">
        <div className="h-3 w-full rounded-full bg-light-elevated dark:bg-dark-elevated shimmer" />
        <div className="h-3 w-5/6 rounded-full bg-light-elevated dark:bg-dark-elevated shimmer" />
        <div className="h-3 w-3/4 rounded-full bg-light-elevated dark:bg-dark-elevated shimmer" />
      </div>
      {/* Image placeholder */}
      <div className="h-40 w-full rounded-xl bg-light-elevated dark:bg-dark-elevated shimmer" />
      {/* Actions */}
      <div className="flex gap-4">
        <div className="h-8 w-16 rounded-lg bg-light-elevated dark:bg-dark-elevated shimmer" />
        <div className="h-8 w-16 rounded-lg bg-light-elevated dark:bg-dark-elevated shimmer" />
        <div className="h-8 w-16 rounded-lg bg-light-elevated dark:bg-dark-elevated shimmer" />
      </div>
    </div>
  );
}

/* Generic line skeleton */
export function LineSkeleton({ lines = 3, className }) {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-3 rounded-full bg-light-elevated dark:bg-dark-elevated shimmer"
          style={{ width: `${100 - i * 10}%` }}
        />
      ))}
    </div>
  );
}

/* Circle skeleton */
export function CircleSkeleton({ size = 40, className }) {
  return (
    <div
      className={cn('rounded-full bg-light-elevated dark:bg-dark-elevated shimmer flex-shrink-0', className)}
      style={{ width: size, height: size }}
    />
  );
}

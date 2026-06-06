import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Merge Tailwind classes safely */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/** Generate a consistent gradient class index from a username */
export function avatarGradientIndex(username = '') {
  let hash = 0;
  for (let c of username) hash = c.charCodeAt(0) + ((hash << 5) - hash);
  return Math.abs(hash) % 6;
}

/** Get avatar gradient class */
export function avatarGradient(username = '') {
  return `avatar-gradient-${avatarGradientIndex(username)}`;
}

/** Get initials from name or username */
export function getInitials(name = '') {
  return name.trim().charAt(0).toUpperCase();
}

/** Truncate text */
export function truncate(text, maxLength = 100) {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + '…';
}

/** Format large numbers */
export function formatCount(n) {
  if (!n && n !== 0) return '0';
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K';
  return String(n);
}

/** Format relative time like "3m ago" */
export function formatRelativeTime(dateInput) {
  if (!dateInput) return '';

  const date = new Date(dateInput);
  if (Number.isNaN(date.getTime())) return '';

  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return 'just now';

  const intervals = [
    { limit: 60, label: 'm', value: 60 },
    { limit: 60 * 60, label: 'h', value: 60 * 60 },
    { limit: 60 * 60 * 24, label: 'd', value: 60 * 60 * 24 },
    { limit: 60 * 60 * 24 * 30, label: 'mo', value: 60 * 60 * 24 * 30 },
    { limit: Infinity, label: 'y', value: 60 * 60 * 24 * 365 },
  ];

  for (const interval of intervals) {
    if (seconds < interval.limit) {
      const amount = Math.floor(seconds / interval.value);
      return `${amount}${interval.label} ago`;
    }
  }

  return 'just now';
}

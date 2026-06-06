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

import React from 'react';
import type { Badge as BadgeType } from '../../types';

const STYLE_MAP: Record<BadgeType, string> = {
  NEW: 'bg-champagne-light text-secondary border-champagne-gold/30',
  BESTSELLER: 'bg-deep-obsidian text-white border-transparent',
  TRENDING: 'bg-champagne-light text-secondary border-champagne-gold/30',
  LIMITED: 'bg-error/10 text-error border-error/30',
  SALE: 'bg-error text-on-error border-transparent',
};

export function Badge({ label }: { label: BadgeType }) {
  return (
    <span className={`px-2 py-0.5 rounded-sm font-label-caps text-[9px] uppercase tracking-wider border ${STYLE_MAP[label]}`}>
      {label}
    </span>
  );
}

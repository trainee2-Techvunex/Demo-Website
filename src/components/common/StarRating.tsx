import React from 'react';
import { Star } from 'lucide-react';

export function StarRating({ rating, size = 14 }: { rating: number; size?: number }) {
  const full = Math.round(rating);
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={size}
          className="text-champagne-gold"
          fill={i < full ? 'currentColor' : 'none'}
          strokeWidth={1.5}
        />
      ))}
    </div>
  );
}

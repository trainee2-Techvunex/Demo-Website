
import React from 'react';

/**
 * Colorful text-based "VIRAT" logo — no image asset needed.
 * Gradient-filled brand name with a small accent dot.
 */
export function LumenLogo({ height = 32, className = '' }: { height?: number; className?: string }) {
  return (
    <span
      className={`inline-flex items-center font-title-editorial font-bold tracking-wide select-none ${className}`}
      style={{ fontSize: height * 0.7, lineHeight: 1 }}
    >
      <span
        style={{
          backgroundImage: 'linear-gradient(90deg, #f97316, #ec4899, #8b5cf6, #06b6d4)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: 'transparent',
        }}
      >
        VIRAT
      </span>
      <span
        className="ml-1 rounded-full"
        style={{
          width: height * 0.16,
          height: height * 0.16,
          background: 'linear-gradient(135deg, #f97316, #ec4899)',
        }}
      />
    </span>
  );
}
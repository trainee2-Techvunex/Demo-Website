import React from 'react';
import { Link } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  message: string;
  ctaLabel?: string;
  ctaPath?: string;
}

export function EmptyState({ icon: Icon, title, message, ctaLabel, ctaPath }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center gap-3 py-space-3xl px-6">
      <Icon size={48} className="text-outline" strokeWidth={1.5} />
      <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">{title}</h3>
      <p className="font-body-md text-body-md text-on-surface-variant max-w-sm">{message}</p>
      {ctaLabel && ctaPath && (
        <Link
          to={ctaPath}
          className="mt-2 px-6 py-3 bg-deep-obsidian text-on-primary font-label-md text-label-md rounded-full hover:bg-charcoal-surface transition-colors"
        >
          {ctaLabel}
        </Link>
      )}
    </div>
  );
}

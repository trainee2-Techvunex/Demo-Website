import React from 'react';
import { Link } from 'react-router-dom';

export interface BreadcrumbItem {
  label: string;
  path?: string;
}

export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav className="flex items-center gap-1.5 font-body-sm text-body-sm text-outline flex-wrap">
      {items.map((item, i) => (
        <React.Fragment key={i}>
          {i > 0 && <span className="text-outline/50">/</span>}
          {item.path ? (
            <Link to={item.path} className="hover:text-on-surface transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-on-surface font-medium">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}

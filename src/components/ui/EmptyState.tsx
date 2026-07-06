import React from 'react';
import { Card } from './Card';

interface EmptyStateProps {
  title: string;
  description: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  action,
  icon,
  className = '',
}) => {
  return (
    <Card
      variant="default"
      className={`flex flex-col items-center justify-center p-8 text-center bg-transparent border-dashed border-2 border-warm-slate/20 shadow-none ${className}`}
    >
      {icon && (
        <div className="mb-4 text-warm-slate/60 dark:text-frosted-pearl/40">
          {icon}
        </div>
      )}
      <h3 className="text-base font-semibold text-deep-charcoal font-display mb-1 dark:text-frosted-pearl">
        {title}
      </h3>
      <p className="text-sm text-warm-slate max-w-sm mb-6 dark:text-frosted-pearl/70">
        {description}
      </p>
      {action && <div className="w-full flex justify-center">{action}</div>}
    </Card>
  );
};

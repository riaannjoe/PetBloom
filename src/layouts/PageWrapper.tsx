import React from 'react';
import { ResponsiveContainer } from './ResponsiveContainer';

interface PageWrapperProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const PageWrapper: React.FC<PageWrapperProps> = ({
  title,
  subtitle,
  action,
  children,
  className = '',
}) => {
  return (
    <div className={`py-6 pb-24 lg:pb-12 animate-spring-bounce ${className}`}>
      <ResponsiveContainer>
        {/* PAGE HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 border-b border-deep-charcoal/5 pb-6 dark:border-white/5">
          <div>
            <h1 className="text-2xl font-bold text-deep-charcoal font-display dark:text-frosted-pearl">
              {title}
            </h1>
            {subtitle && (
              <p className="text-sm text-warm-slate mt-1 dark:text-frosted-pearl/60">
                {subtitle}
              </p>
            )}
          </div>
          {action && <div className="flex-shrink-0">{action}</div>}
        </div>

        {/* PAGE CONTENT */}
        <div>{children}</div>
      </ResponsiveContainer>
    </div>
  );
};

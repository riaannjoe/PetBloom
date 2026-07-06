import React from 'react';

export interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'rect' | 'circle';
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'rect',
}) => {
  const baseStyles = 'bg-deep-charcoal/5 dark:bg-white/5 animate-shimmer bg-[length:200%_100%] bg-gradient-to-r from-transparent via-deep-charcoal/5 to-transparent dark:via-white/5';
  
  const shapes = {
    text: 'h-4 w-full rounded',
    rect: 'h-24 w-full rounded-2xl',
    circle: 'h-12 w-12 rounded-full',
  };

  return (
    <div
      className={`${baseStyles} ${shapes[variant]} ${className}`}
      style={{
        backgroundImage: 'linear-gradient(90deg, transparent 25%, rgba(0,0,0,0.03) 50%, transparent 75%)',
      }}
    />
  );
};

export const SkeletonText: React.FC<{ className?: string }> = ({ className = '' }) => (
  <Skeleton variant="text" className={className} />
);

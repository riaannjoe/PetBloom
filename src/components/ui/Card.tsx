import React, { type HTMLAttributes } from 'react';

export type CardVariant = 'default' | 'outline' | 'glass' | 'elevated';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  hoverEffect = false,
  className = '',
  ...props
}) => {
  const baseStyles = 'rounded-2xl p-6 transition-all duration-300';
  
  const variants = {
    default: 'bg-pure-linen border border-deep-charcoal/5 shadow-[0_8px_30px_rgb(255,112,150,0.03)] dark:bg-slate-velvet dark:border-white/5',
    outline: 'border border-warm-slate/20 bg-transparent',
    glass: 'glass-panel',
    elevated: 'bg-pure-linen border border-deep-charcoal/5 shadow-md dark:bg-slate-velvet dark:border-white/5',
  };

  const hoverStyle = hoverEffect
    ? 'hover:-translate-y-1 hover:shadow-lg dark:hover:shadow-[0_20px_40px_rgba(255,255,255,0.015)] cursor-pointer'
    : '';

  return (
    <div
      className={`${baseStyles} ${variants[variant]} ${hoverStyle} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<HTMLAttributes<HTMLDivElement>> = ({ children, className = '', ...props }) => (
  <div className={`flex flex-col gap-1.5 p-0 mb-4 ${className}`} {...props}>
    {children}
  </div>
);

export const CardTitle: React.FC<HTMLAttributes<HTMLHeadingElement>> = ({ children, className = '', ...props }) => (
  <h3 className={`text-lg font-bold text-deep-charcoal font-display dark:text-frosted-pearl ${className}`} {...props}>
    {children}
  </h3>
);

export const CardDescription: React.FC<HTMLAttributes<HTMLParagraphElement>> = ({ children, className = '', ...props }) => (
  <p className={`text-sm text-warm-slate dark:text-frosted-pearl/60 ${className}`} {...props}>
    {children}
  </p>
);

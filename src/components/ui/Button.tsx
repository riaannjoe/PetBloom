import React, { type ButtonHTMLAttributes } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-full transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-95 active:translate-y-px disabled:opacity-50 disabled:pointer-events-none cursor-pointer';
  
  const variants = {
    primary: 'bg-bloom-rose text-white hover:bg-bloom-rose/90 shadow-sm focus:ring-bloom-rose',
    secondary: 'bg-mint-wellness text-deep-charcoal hover:bg-mint-wellness/90 shadow-sm focus:ring-mint-wellness',
    outline: 'border border-warm-slate/30 text-deep-charcoal hover:bg-warm-slate/5 focus:ring-warm-slate dark:text-frosted-pearl dark:border-white/10',
    danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500',
    ghost: 'text-deep-charcoal hover:bg-warm-slate/5 focus:ring-warm-slate dark:text-frosted-pearl',
  };

  const sizes = {
    sm: 'px-4 py-1.5 text-sm',
    md: 'px-6 py-2.5 text-base',
    lg: 'px-8 py-3.5 text-lg',
    icon: 'h-9 w-9 p-2 rounded-full',
  };

  const widthStyle = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthStyle} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

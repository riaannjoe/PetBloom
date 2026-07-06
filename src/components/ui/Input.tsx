import React, { type InputHTMLAttributes } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  fullWidth = true,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  const containerStyle = fullWidth ? 'w-full' : '';
  
  return (
    <div className={`flex flex-col gap-1.5 ${containerStyle}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-warm-slate dark:text-frosted-pearl/80"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`px-4 py-2.5 rounded-xl border bg-pure-linen text-deep-charcoal transition-all duration-200 outline-none
          ${error 
            ? 'border-red-500 focus:ring-1 focus:ring-red-500 focus:border-red-500' 
            : 'border-warm-slate/25 focus:ring-1 focus:ring-bloom-rose focus:border-bloom-rose dark:border-white/10 dark:bg-slate-velvet/50 dark:text-frosted-pearl'
          }
          ${className}
        `}
        {...props}
      />
      {error && (
        <span className="text-xs text-red-500 font-medium">
          {error}
        </span>
      )}
    </div>
  );
};

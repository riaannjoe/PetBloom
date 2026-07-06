import React from 'react';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  fullPage?: boolean;
  label?: string;
  className?: string;
}

export const Loading: React.FC<LoadingProps> = ({
  size = 'md',
  fullPage = false,
  label = 'Loading PetBloom...',
  className = '',
}) => {
  const containerStyles = fullPage
    ? 'fixed inset-0 z-50 flex flex-col items-center justify-center bg-warm-cream dark:bg-midnight-forest'
    : 'flex flex-col items-center justify-center p-8';

  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
  };

  return (
    <div className={`${containerStyles} ${className}`} role="status" aria-live="polite">
      
      {/* Premium Paw Print SVG Loading Animation */}
      <svg
        className={`${sizeClasses[size]} text-bloom-rose fill-current`}
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Main Central Pad */}
        <path
          d="M 50 40 C 35 40, 25 55, 30 75 C 32 80, 68 80, 70 75 C 75 55, 65 40, 50 40 Z"
          className="animate-pulse [animation-delay:800ms]"
        />
        {/* Top-Left Toe */}
        <circle cx="25" cy="30" r="10" className="animate-pulse [animation-delay:0ms]" />
        {/* Mid-Left Toe */}
        <circle cx="42" cy="18" r="10" className="animate-pulse [animation-delay:200ms]" />
        {/* Mid-Right Toe */}
        <circle cx="58" cy="18" r="10" className="animate-pulse [animation-delay:400ms]" />
        {/* Top-Right Toe */}
        <circle cx="75" cy="30" r="10" className="animate-pulse [animation-delay:600ms]" />
      </svg>
      
      {label && (
        <span className="mt-4 text-xs font-semibold text-warm-slate uppercase tracking-widest animate-pulse dark:text-frosted-pearl/80 font-display">
          {label}
        </span>
      )}
    </div>
  );
};
export default Loading;

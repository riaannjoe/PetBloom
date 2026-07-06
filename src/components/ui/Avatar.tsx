import React from 'react';

interface AvatarProps {
  src?: string;
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  name,
  size = 'md',
  className = '',
}) => {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-lg',
    xl: 'w-24 h-24 text-2xl',
  };

  const getInitials = (n: string) => {
    return n.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();
  };

  return (
    <div
      className={`relative flex-shrink-0 flex items-center justify-center rounded-full overflow-hidden border border-deep-charcoal/5 dark:border-white/10 select-none bg-bloom-rose-light/20 text-bloom-rose font-semibold font-display ${sizes[size]} ${className}`}
    >
      {src ? (
        <img
          src={src}
          alt={name}
          className="w-full h-full object-cover"
          onError={(e) => {
            // Remove src if loading fails to fallback to initials
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      ) : (
        <span>{getInitials(name)}</span>
      )}
    </div>
  );
};

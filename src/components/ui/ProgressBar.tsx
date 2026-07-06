import React from 'react';

interface ProgressBarProps {
  value: number; // 0 to 100
  max?: number;  // defaults to 100
  color?: 'primary' | 'secondary' | 'neutral';
  height?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  color = 'primary',
  height = 'md',
  showLabel = false,
  className = '',
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  const colors = {
    primary: 'bg-bloom-rose',
    secondary: 'bg-mint-wellness',
    neutral: 'bg-warm-slate/40',
  };

  const heights = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  return (
    <div className={`w-full flex flex-col gap-1.5 ${className}`}>
      {showLabel && (
        <div className="flex justify-between text-xs font-semibold text-warm-slate dark:text-frosted-pearl/80">
          <span>Progress</span>
          <span>{Math.round(percentage)}%</span>
        </div>
      )}
      <div className={`w-full bg-deep-charcoal/5 dark:bg-white/5 rounded-full overflow-hidden ${heights[height]}`}>
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${colors[color]}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

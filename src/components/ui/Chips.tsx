import React from 'react';

interface ChipsProps {
  label: string;
  selected?: boolean;
  onClick?: () => void;
  icon?: React.ReactNode;
  className?: string;
}

export const Chips: React.FC<ChipsProps> = ({
  label,
  selected = false,
  onClick,
  icon,
  className = '',
}) => {
  const baseStyles = 'inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer border select-none active:scale-95';
  
  const styles = selected
    ? 'bg-bloom-rose border-bloom-rose text-white shadow-sm hover:bg-bloom-rose/95'
    : 'bg-pure-linen border-warm-slate/20 text-deep-charcoal hover:bg-warm-cream dark:bg-slate-velvet dark:border-white/10 dark:text-frosted-pearl dark:hover:bg-white/5';

  return (
    <div
      onClick={onClick}
      className={`${baseStyles} ${styles} ${className}`}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{label}</span>
    </div>
  );
};

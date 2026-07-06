import React from 'react';

interface TabOption {
  id: string;
  label: string;
}

interface TabsProps {
  options: TabOption[];
  activeId: string;
  onChange: (id: string) => void;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  options,
  activeId,
  onChange,
  className = '',
}) => {
  return (
    <div className={`flex border-b border-deep-charcoal/5 dark:border-white/5 overflow-x-auto ${className}`}>
      {options.map((opt) => {
        const isActive = opt.id === activeId;
        return (
          <button
            key={opt.id}
            onClick={() => onChange(opt.id)}
            className={`px-4 py-2.5 text-sm font-medium transition-all duration-200 border-b-2 -mb-[2px] whitespace-nowrap cursor-pointer
              ${isActive 
                ? 'border-bloom-rose text-bloom-rose' 
                : 'border-transparent text-warm-slate hover:text-deep-charcoal dark:hover:text-frosted-pearl'
              }
            `}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
};

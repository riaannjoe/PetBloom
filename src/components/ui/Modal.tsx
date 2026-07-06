import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { Card } from './Card';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-deep-charcoal/40 backdrop-blur-sm animate-fade-in">
      <div 
        className="fixed inset-0" 
        onClick={onClose} 
      />
      <Card
        variant="default"
        className="relative w-full max-w-lg shadow-2xl animate-spring-bounce overflow-hidden dark:bg-slate-velvet"
      >
        <div className="flex items-center justify-between border-b border-deep-charcoal/5 pb-4 mb-4 dark:border-white/5">
          {title && (
            <h3 className="text-lg font-semibold text-deep-charcoal font-display dark:text-frosted-pearl">
              {title}
            </h3>
          )}
          <button
            onClick={onClose}
            className="p-1 rounded-full text-warm-slate hover:bg-warm-slate/10 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto">
          {children}
        </div>
      </Card>
    </div>
  );
};

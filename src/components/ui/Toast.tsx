import React from 'react';
import { useNotificationStore, type ToastMessage } from '@/store/notificationStore';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useNotificationStore();

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-3 w-full max-w-sm pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  );
};

interface ToastItemProps {
  toast: ToastMessage;
  onClose: () => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onClose }) => {
  const icons = {
    success: <CheckCircle2 className="text-emerald-500" size={20} />,
    error: <AlertCircle className="text-red-500" size={20} />,
    warning: <AlertTriangle className="text-amber-500" size={20} />,
    info: <Info className="text-blue-500" size={20} />,
  };

  const bgColors = {
    success: 'bg-emerald-50 border-emerald-100 dark:bg-emerald-950/20 dark:border-emerald-900/30',
    error: 'bg-red-50 border-red-100 dark:bg-red-950/20 dark:border-red-900/30',
    warning: 'bg-amber-50 border-amber-100 dark:bg-amber-950/20 dark:border-amber-900/30',
    info: 'bg-blue-50 border-blue-100 dark:bg-blue-950/20 dark:border-blue-900/30',
  };

  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-xl border shadow-lg pointer-events-auto animate-spring-bounce ${bgColors[toast.type]}`}
    >
      <div className="flex-shrink-0 mt-0.5">{icons[toast.type]}</div>
      <div className="flex-grow">
        <h4 className="text-sm font-semibold text-deep-charcoal dark:text-frosted-pearl">
          {toast.title}
        </h4>
        {toast.message && (
          <p className="text-xs text-warm-slate mt-0.5 dark:text-frosted-pearl/70">
            {toast.message}
          </p>
        )}
      </div>
      <button
        onClick={onClose}
        className="flex-shrink-0 p-0.5 rounded-full hover:bg-black/5 dark:hover:bg-white/5 text-warm-slate cursor-pointer"
      >
        <X size={14} />
      </button>
    </div>
  );
};

import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, MessageSquareCode, TrendingUp } from 'lucide-react';

export const MobileNav: React.FC = () => {
  const items = [
    { to: '/dashboard', label: 'Home', icon: <Home size={20} /> },
    { to: '/chat', label: 'Concierge', icon: <MessageSquareCode size={20} /> },
    { to: '/reports', label: 'Weekly', icon: <TrendingUp size={20} /> },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-pure-linen/95 backdrop-blur-md border-t border-deep-charcoal/5 flex items-center justify-around z-40 pb-safe dark:bg-slate-velvet/95 dark:border-white/5 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) => `
            flex flex-col items-center justify-center gap-1 w-20 h-full text-xxs font-semibold cursor-pointer
            ${isActive
              ? 'text-bloom-rose scale-105'
              : 'text-warm-slate hover:text-deep-charcoal dark:hover:text-frosted-pearl'
            }
          `}
        >
          {item.icon}
          <span>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
};

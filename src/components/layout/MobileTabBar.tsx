import { NavLink } from 'react-router-dom';
import { BarChart3, Home, MessageCircle, PenLine } from 'lucide-react';
import { cn } from '@/lib/utils';

const tabs = [
  { to: '/app/dashboard', label: 'Home', icon: Home },
  { to: '/app/logs', label: 'Log', icon: PenLine },
  { to: '/app/chat', label: 'AI Chat', icon: MessageCircle },
  { to: '/app/reports', label: 'Reports', icon: BarChart3 },
] as const;

export function MobileTabBar() {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-warm-slate/10 bg-pure-linen/95 backdrop-blur-md md:hidden dark:border-white/5 dark:bg-slate-velvet/95"
      aria-label="Mobile navigation"
    >
      <div className="flex items-center justify-around px-2 py-2">
        {tabs.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex min-h-11 min-w-11 flex-col items-center justify-center gap-0.5 rounded-xl px-3 py-1 text-[10px] font-medium transition-colors',
                isActive
                  ? 'text-bloom-rose'
                  : 'text-warm-slate hover:text-deep-charcoal dark:hover:text-frosted-pearl',
              )
            }
          >
            <Icon className="h-5 w-5" />
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

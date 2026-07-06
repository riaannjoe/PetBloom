import { NavLink } from 'react-router-dom';
import {
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Home,
  MessageCircle,
  Settings,
} from 'lucide-react';
import { usePetStore } from '@/stores/petStore';
import { useUiStore } from '@/stores/uiStore';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/app/dashboard', label: 'Home', icon: Home, end: false },
  { to: '/app/reports', label: 'Reports', icon: BarChart3, end: false },
  { to: '/app/chat', label: 'Chat', icon: MessageCircle, end: false },
  { to: '/app/settings', label: 'Setup', icon: Settings, end: false },
] as const;

export function Sidebar() {
  const sidebarExpanded = useUiStore((s) => s.sidebarExpanded);
  const toggleSidebar = useUiStore((s) => s.toggleSidebar);
  const pets = usePetStore((s) => s.pets);
  const activePetId = usePetStore((s) => s.activePetId);
  const setActivePetId = usePetStore((s) => s.setActivePetId);

  return (
    <aside
      className={cn(
        'hidden h-full shrink-0 flex-col border-r border-warm-slate/10 bg-pure-linen transition-all duration-300',
        'dark:border-white/5 dark:bg-slate-velvet md:flex',
        sidebarExpanded ? 'w-60' : 'w-[72px]',
      )}
    >
      <div className="flex h-16 items-center justify-between border-b border-warm-slate/10 px-4 dark:border-white/5">
        {sidebarExpanded && (
          <div className="flex items-center gap-2">
            <span className="text-xl" aria-hidden>
              🌸
            </span>
            <span className="font-display text-lg font-semibold text-bloom-rose">
              PetBloom
            </span>
          </div>
        )}
        <button
          type="button"
          onClick={toggleSidebar}
          className="rounded-lg p-2 text-warm-slate hover:bg-warm-slate/10 dark:hover:bg-white/10"
          aria-label={sidebarExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          {sidebarExpanded ? (
            <ChevronLeft className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </button>
      </div>

      {sidebarExpanded && pets.length > 0 && (
        <div className="border-b border-warm-slate/10 p-3 dark:border-white/5">
          <p className="mb-2 px-1 text-xs font-medium uppercase tracking-wide text-warm-slate">
            Active Pet
          </p>
          <div className="flex flex-col gap-1">
            {pets.map((pet) => (
              <button
                key={pet.id}
                type="button"
                onClick={() => setActivePetId(pet.id)}
                className={cn(
                  'flex items-center gap-2 rounded-xl px-2 py-2 text-left text-sm transition-colors',
                  activePetId === pet.id
                    ? 'bg-bloom-rose/10 text-bloom-rose'
                    : 'text-deep-charcoal hover:bg-warm-slate/5 dark:text-frosted-pearl dark:hover:bg-white/5',
                )}
              >
                {pet.photoUrl ? (
                  <img
                    src={pet.photoUrl}
                    alt=""
                    className="h-7 w-7 rounded-full object-cover"
                  />
                ) : (
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-mint-wellness/30 text-xs">
                    {pet.name[0]}
                  </span>
                )}
                <span className="truncate font-medium">{pet.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <nav className="flex flex-1 flex-col gap-1 p-3">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-bloom-rose/10 text-bloom-rose'
                  : 'text-warm-slate hover:bg-warm-slate/5 hover:text-deep-charcoal dark:hover:bg-white/5 dark:hover:text-frosted-pearl',
                !sidebarExpanded && 'justify-center px-2',
              )
            }
          >
            <Icon className="h-5 w-5 shrink-0" />
            {sidebarExpanded && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

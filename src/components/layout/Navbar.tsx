import { Link } from 'react-router-dom';
import { Menu, Moon, Search, Sun } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { usePetStore } from '@/stores/petStore';
import { useThemeStore } from '@/stores/themeStore';
import { useUiStore } from '@/stores/uiStore';
import { cn } from '@/lib/utils';

export function Navbar() {
  const user = usePetStore((s) => s.user);
  const activePet = usePetStore((s) => s.getActivePet());
  const pets = usePetStore((s) => s.pets);
  const activePetId = usePetStore((s) => s.activePetId);
  const setActivePetId = usePetStore((s) => s.setActivePetId);
  const theme = useThemeStore((s) => s.theme);
  const toggleTheme = useThemeStore((s) => s.toggleTheme);
  const setMobileMenuOpen = useUiStore((s) => s.setMobileMenuOpen);

  return (
    <header className="sticky top-0 z-40 border-b border-warm-slate/10 bg-warm-cream/80 backdrop-blur-md dark:border-white/5 dark:bg-midnight-forest/80">
      <div className="flex h-16 items-center gap-4 px-4 md:px-6">
        <button
          type="button"
          className="rounded-lg p-2 text-warm-slate hover:bg-warm-slate/10 md:hidden dark:hover:bg-white/10"
          onClick={() => setMobileMenuOpen(true)}
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <Link
          to="/app/dashboard"
          className="flex items-center gap-2 md:hidden"
        >
          <span aria-hidden>🌸</span>
          <span className="font-display font-semibold text-bloom-rose">PetBloom</span>
        </Link>

        <div className="hidden flex-1 md:block md:max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-warm-slate" />
            <Input
              placeholder="Search logs, symptoms..."
              className="pl-9"
              aria-label="Search logs and symptoms"
            />
          </div>
        </div>

        <div className="ml-auto flex items-center gap-2">
          {pets.length > 0 && (
            <div className="hidden items-center gap-2 sm:flex">
              <span className="text-xs text-warm-slate">Pet</span>
              <select
                value={activePetId ?? ''}
                onChange={(e) => setActivePetId(e.target.value)}
                className={cn(
                  'h-9 rounded-xl border border-warm-slate/20 bg-pure-linen px-3 text-sm',
                  'focus:border-bloom-rose/50 focus:outline-none focus:ring-2 focus:ring-bloom-rose/20',
                  'dark:border-white/10 dark:bg-slate-velvet dark:text-frosted-pearl',
                )}
                aria-label="Select active pet"
              >
                {pets.map((pet) => (
                  <option key={pet.id} value={pet.id}>
                    {pet.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? (
              <Moon className="h-4 w-4" />
            ) : (
              <Sun className="h-4 w-4" />
            )}
          </Button>

          {user && (
            <div className="flex items-center gap-2 rounded-xl bg-pure-linen px-2 py-1 dark:bg-slate-velvet">
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt=""
                  className="h-8 w-8 rounded-full"
                />
              ) : (
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-bloom-rose/20 text-sm font-medium text-bloom-rose">
                  {user.name[0]}
                </span>
              )}
              <div className="hidden lg:block">
                <p className="text-sm font-medium text-deep-charcoal dark:text-frosted-pearl">
                  {user.name}
                </p>
                {activePet && (
                  <p className="text-xs text-warm-slate">Caring for {activePet.name}</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

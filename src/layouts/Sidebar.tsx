import React from 'react';
import { NavLink } from 'react-router-dom';
import { usePetStore } from '@/store/petStore';
import { useAuthStore } from '@/store/authStore';
import { useThemeStore } from '@/store/themeStore';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import {
  Home,
  User as UserIcon,
  Utensils,
  Heart,
  Footprints,
  Sparkles,
  MessageSquareCode,
  TrendingUp,
  Settings,
  LogOut,
  Sun,
  Moon,
  ChevronDown
} from 'lucide-react';

interface SidebarProps {
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onCloseMobile }) => {
  const { pets, activePetId, setActivePetId } = usePetStore();
  const { user, logout } = useAuthStore();
  const { theme, setTheme } = useThemeStore();

  const activePet = pets.find((p) => p.id === activePetId) || pets[0];

  const links = [
    { to: '/dashboard', label: 'Dashboard', icon: <Home size={20} /> },
    { to: '/profile', label: 'Pet Profile', icon: <UserIcon size={20} /> },
    { to: '/nutrition', label: 'Nutrition', icon: <Utensils size={20} /> },
    { to: '/health', label: 'Health & Stool', icon: <Heart size={20} /> },
    { to: '/exercise', label: 'Exercise', icon: <Footprints size={20} /> },
    { to: '/hygiene', label: 'Hygiene', icon: <Sparkles size={20} /> },
    { to: '/chat', label: 'AI Concierge', icon: <MessageSquareCode size={20} /> },
    { to: '/reports', label: 'Weekly Bloom', icon: <TrendingUp size={20} /> },
    { to: '/settings', label: 'Settings', icon: <Settings size={20} /> },
  ];

  const handlePetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setActivePetId(e.target.value);
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <aside className="w-64 h-full bg-pure-linen border-r border-deep-charcoal/5 flex flex-col justify-between py-6 px-4 dark:bg-slate-velvet dark:border-white/5">
      <div className="flex flex-col gap-6">
        {/* LOGO */}
        <div className="flex items-center gap-2 px-2">
          <div className="w-8 h-8 rounded-full bg-bloom-rose flex items-center justify-center text-white font-bold text-lg font-display">
            P
          </div>
          <div>
            <h1 className="text-lg font-bold text-deep-charcoal font-display leading-tight dark:text-frosted-pearl">
              PetBloom
            </h1>
            <p className="text-xxs text-warm-slate dark:text-frosted-pearl/60">
              Helping Every Pet Bloom
            </p>
          </div>
        </div>

        {/* PET SELECTOR */}
        {pets.length > 0 && (
          <div className="relative flex items-center gap-2 bg-warm-cream/50 p-2.5 rounded-2xl dark:bg-white/5">
            <Avatar src={activePet?.photoUrl} name={activePet?.name || 'Pet'} size="sm" />
            <div className="flex-grow min-w-0">
              <p className="text-xxs text-warm-slate dark:text-frosted-pearl/60 uppercase font-semibold tracking-wider">
                Active Pet
              </p>
              <select
                value={activePetId}
                onChange={handlePetChange}
                className="w-full bg-transparent text-sm font-semibold text-deep-charcoal outline-none cursor-pointer pr-4 appearance-none font-display dark:text-frosted-pearl"
              >
                {pets.map((p) => (
                  <option key={p.id} value={p.id} className="dark:bg-slate-velvet">
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
            <ChevronDown size={14} className="absolute right-3 pointer-events-none text-warm-slate" />
          </div>
        )}

        {/* NAVIGATION LINKS */}
        <nav className="flex flex-col gap-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={onCloseMobile}
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer
                ${isActive
                  ? 'bg-bloom-rose/10 text-bloom-rose font-semibold'
                  : 'text-warm-slate hover:bg-warm-cream/60 hover:text-deep-charcoal dark:hover:bg-white/5 dark:hover:text-frosted-pearl'
                }
              `}
            >
              {link.icon}
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* FOOTER CONTROLS */}
      <div className="flex flex-col gap-4 border-t border-deep-charcoal/5 pt-4 dark:border-white/5">
        {/* THEME TOGGLE */}
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleTheme}
          className="flex justify-between items-center w-full px-3 py-2 cursor-pointer"
        >
          <span className="text-sm font-medium text-warm-slate dark:text-frosted-pearl/80">
            {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
          </span>
          {theme === 'dark' ? (
            <Moon size={18} className="text-bloom-rose" />
          ) : (
            <Sun size={18} className="text-amber-500" />
          )}
        </Button>

        {/* USER PROFILE */}
        {user && (
          <div className="flex items-center gap-3 px-2">
            <Avatar src={user.avatarUrl} name={user.name} size="sm" />
            <div className="flex-grow min-w-0">
              <h4 className="text-sm font-semibold text-deep-charcoal truncate dark:text-frosted-pearl font-display">
                {user.name}
              </h4>
              <p className="text-xs text-warm-slate truncate dark:text-frosted-pearl/60">
                {user.email}
              </p>
            </div>
            <button
              onClick={logout}
              className="p-1 rounded-full text-warm-slate hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
              title="Logout"
            >
              <LogOut size={16} />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};

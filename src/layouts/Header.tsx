import React, { useEffect, useState } from 'react';
import { usePetStore } from '@/store/petStore';
import { Menu, Bell, SunDim } from 'lucide-react';
import { weatherService, type WeatherData } from '@/services/weatherService';

interface HeaderProps {
  onOpenMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobileMenu }) => {
  const { pets, activePetId } = usePetStore();
  const [weather, setWeather] = useState<WeatherData | null>(null);

  const activePet = pets.find((p) => p.id === activePetId) || pets[0];

  useEffect(() => {
    // Load mock weather on header initialization
    weatherService.getCurrentWeather().then(setWeather);
  }, []);

  const calculateAge = (birthdayStr: string) => {
    const birthday = new Date(birthdayStr);
    const today = new Date();
    let months = (today.getFullYear() - birthday.getFullYear()) * 12 + today.getMonth() - birthday.getMonth();
    
    if (months <= 0) return 'Newborn';
    if (months < 12) return `${months} mo old`;
    
    const years = Math.floor(months / 12);
    const remMonths = months % 12;
    return remMonths > 0 ? `${years} yr ${remMonths} mo old` : `${years} yr old`;
  };

  return (
    <header className="h-16 bg-pure-linen border-b border-deep-charcoal/5 px-6 flex items-center justify-between dark:bg-slate-velvet dark:border-white/5">
      {/* MOBILE TRIGGER & PET DETAILS */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-1.5 rounded-lg text-warm-slate hover:bg-warm-cream cursor-pointer dark:hover:bg-white/5"
        >
          <Menu size={20} />
        </button>
        {activePet && (
          <div>
            <h2 className="text-base font-bold text-deep-charcoal leading-tight dark:text-frosted-pearl font-display">
              {activePet.name}
            </h2>
            <p className="text-xs text-warm-slate dark:text-frosted-pearl/60">
              {activePet.breed} • {calculateAge(activePet.birthday)}
            </p>
          </div>
        )}
      </div>

      {/* WEATHER & QUICK ALERTS */}
      <div className="flex items-center gap-4">
        {weather && (
          <div className="hidden sm:flex items-center gap-2 bg-warm-cream/50 px-3 py-1.5 rounded-full dark:bg-white/5">
            <SunDim size={16} className="text-amber-500" />
            <span className="text-xs font-semibold text-deep-charcoal dark:text-frosted-pearl">
              {weather.tempF}°F • {weather.condition}
            </span>
          </div>
        )}

        <button className="relative p-2 rounded-full text-warm-slate hover:bg-warm-cream/60 cursor-pointer dark:hover:bg-white/5">
          <Bell size={18} />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-bloom-rose animate-pulse" />
        </button>
      </div>
    </header>
  );
};

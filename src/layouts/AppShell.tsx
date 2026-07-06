import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { MobileNav } from './MobileNav';
import { ToastContainer } from '@/components/ui/Toast';

export const AppShell: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-warm-cream dark:bg-midnight-forest text-deep-charcoal dark:text-frosted-pearl">
      {/* Toast Alert Overlays */}
      <ToastContainer />

      {/* DESKTOP SIDEBAR */}
      <div className="hidden lg:block h-full">
        <Sidebar />
      </div>

      {/* MOBILE SIDEBAR DRAWERS */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-deep-charcoal/40 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setMobileMenuOpen(false)}
          />
          {/* Drawer container */}
          <div className="relative z-50 flex flex-col h-full bg-pure-linen dark:bg-slate-velvet animate-slide-in">
            <Sidebar onCloseMobile={() => setMobileMenuOpen(false)} />
          </div>
        </div>
      )}

      {/* MAIN VIEW CONTENT CONTAINER */}
      <div className="flex-grow flex flex-col min-w-0">
        <Header onOpenMobileMenu={() => setMobileMenuOpen(true)} />
        <main className="flex-grow overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* MOBILE BOTTOM NAVIGATION */}
      <MobileNav />
    </div>
  );
};

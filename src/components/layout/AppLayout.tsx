import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { MobileTabBar } from './MobileTabBar';

export function AppLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-warm-cream dark:bg-midnight-forest">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar />
        <main className="flex-1 overflow-y-auto pb-20 md:pb-6">
          <Outlet />
        </main>
        <MobileTabBar />
      </div>
    </div>
  );
}

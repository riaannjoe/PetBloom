import { ThemeProvider } from './ThemeProvider';
import { AppInitializer } from './AppInitializer';
import { ToastContainer } from '@/components/ui';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AppInitializer>
        {children}
        <ToastContainer />
      </AppInitializer>
    </ThemeProvider>
  );
}

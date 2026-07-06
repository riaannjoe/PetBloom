import { useEffect } from 'react';
import { api } from '@/services';
import { usePetStore } from '@/stores/petStore';
import { validateEnv } from '@/config/env';

export function AppInitializer({ children }: { children: React.ReactNode }) {
  const setUser = usePetStore((s) => s.setUser);
  const setPets = usePetStore((s) => s.setPets);
  const setLoading = usePetStore((s) => s.setLoading);

  useEffect(() => {
    validateEnv();

    let cancelled = false;

    async function bootstrap() {
      setLoading(true);
      try {
        const [user, pets] = await Promise.all([
          api.getCurrentUser(),
          api.getPets(),
        ]);
        if (!cancelled) {
          setUser(user);
          setPets(pets);
        }
      } catch (error) {
        console.error('[PetBloom] Failed to bootstrap app data:', error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    bootstrap();

    return () => {
      cancelled = true;
    };
  }, [setUser, setPets, setLoading]);

  return <>{children}</>;
}

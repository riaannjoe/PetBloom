import { create } from 'zustand';
import type { Pet, User } from '@/types/domain';

interface PetState {
  user: User | null;
  pets: Pet[];
  activePetId: string | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setPets: (pets: Pet[]) => void;
  setActivePetId: (petId: string) => void;
  setLoading: (loading: boolean) => void;
  getActivePet: () => Pet | undefined;
}

export const usePetStore = create<PetState>()((set, get) => ({
  user: null,
  pets: [],
  activePetId: null,
  isLoading: false,
  setUser: (user) => set({ user }),
  setPets: (pets) =>
    set((state) => ({
      pets,
      activePetId:
        state.activePetId && pets.some((p) => p.id === state.activePetId)
          ? state.activePetId
          : (pets[0]?.id ?? null),
    })),
  setActivePetId: (petId) => set({ activePetId: petId }),
  setLoading: (isLoading) => set({ isLoading }),
  getActivePet: () => {
    const { pets, activePetId } = get();
    return pets.find((p) => p.id === activePetId);
  },
}));

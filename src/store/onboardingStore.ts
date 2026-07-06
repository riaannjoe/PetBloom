import { create } from 'zustand';

export interface OnboardingState {
  currentStep: number;
  ownerData: {
    name: string;
  };
  petData: {
    name: string;
    species: 'Dog' | 'Cat' | 'Other';
    breed: string;
    birthday: string;
    weight: number;
    gender: 'Male' | 'Female' | 'Neutered' | 'Spayed';
    photoUrl: string;
  };
  healthData: {
    allergies: string;
    conditions: string;
    medications: string;
    vaccinationStatus: string;
    vetDetails: string;
  };
  lifestyleData: {
    feedingSchedule: string;
    walkSchedule: string;
    activityLevel: 'Low' | 'Moderate' | 'High' | 'Very High';
    favoriteTreats: string;
    waterGoal: number; // in ml
  };
  
  // Actions
  setStep: (step: number) => void;
  updateOwnerData: (data: Partial<OnboardingState['ownerData']>) => void;
  updatePetData: (data: Partial<OnboardingState['petData']>) => void;
  updateHealthData: (data: Partial<OnboardingState['healthData']>) => void;
  updateLifestyleData: (data: Partial<OnboardingState['lifestyleData']>) => void;
  resetOnboarding: () => void;
}

const initialOnboardingState = {
  currentStep: 1,
  ownerData: {
    name: '',
  },
  petData: {
    name: '',
    species: 'Dog' as const,
    breed: '',
    birthday: '',
    weight: 0,
    gender: 'Male' as const,
    photoUrl: '',
  },
  healthData: {
    allergies: '',
    conditions: '',
    medications: '',
    vaccinationStatus: 'Up to Date',
    vetDetails: '',
  },
  lifestyleData: {
    feedingSchedule: 'Twice daily',
    walkSchedule: 'Twice daily',
    activityLevel: 'Moderate' as const,
    favoriteTreats: '',
    waterGoal: 1000,
  },
};

export const useOnboardingStore = create<OnboardingState>((set) => ({
  ...initialOnboardingState,
  
  setStep: (currentStep) => {
    set({ currentStep });
    localStorage.setItem('petbloom-onboarding-step', String(currentStep));
  },
  
  updateOwnerData: (data) => set((state) => {
    const updated = { ownerData: { ...state.ownerData, ...data } };
    localStorage.setItem('petbloom-onboarding-owner', JSON.stringify(updated.ownerData));
    return updated;
  }),
  
  updatePetData: (data) => set((state) => {
    const updated = { petData: { ...state.petData, ...data } };
    localStorage.setItem('petbloom-onboarding-pet', JSON.stringify(updated.petData));
    return updated;
  }),
  
  updateHealthData: (data) => set((state) => {
    const updated = { healthData: { ...state.healthData, ...data } };
    localStorage.setItem('petbloom-onboarding-health', JSON.stringify(updated.healthData));
    return updated;
  }),
  
  updateLifestyleData: (data) => set((state) => {
    const updated = { lifestyleData: { ...state.lifestyleData, ...data } };
    localStorage.setItem('petbloom-onboarding-lifestyle', JSON.stringify(updated.lifestyleData));
    return updated;
  }),
  
  resetOnboarding: () => {
    localStorage.removeItem('petbloom-onboarding-step');
    localStorage.removeItem('petbloom-onboarding-owner');
    localStorage.removeItem('petbloom-onboarding-pet');
    localStorage.removeItem('petbloom-onboarding-health');
    localStorage.removeItem('petbloom-onboarding-lifestyle');
    set(initialOnboardingState);
  },
}));

// Auto-resume state loading from local storage
if (typeof window !== 'undefined') {
  const savedStep = localStorage.getItem('petbloom-onboarding-step');
  const savedOwner = localStorage.getItem('petbloom-onboarding-owner');
  const savedPet = localStorage.getItem('petbloom-onboarding-pet');
  const savedHealth = localStorage.getItem('petbloom-onboarding-health');
  const savedLifestyle = localStorage.getItem('petbloom-onboarding-lifestyle');

  const updates: Partial<OnboardingState> = {};
  if (savedStep) updates.currentStep = Number(savedStep);
  if (savedOwner) updates.ownerData = JSON.parse(savedOwner);
  if (savedPet) updates.petData = JSON.parse(savedPet);
  if (savedHealth) updates.healthData = JSON.parse(savedHealth);
  if (savedLifestyle) updates.lifestyleData = JSON.parse(savedLifestyle);

  if (Object.keys(updates).length > 0) {
    useOnboardingStore.setState(updates);
  }
}

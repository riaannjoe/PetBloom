import { create } from 'zustand';
import { type MemoryLog, mockMemoryLogs } from '@/utils/mockData';

export interface StructuredPetMemory {
  meals: string;
  water: string;
  exercise: string;
  health: string;
  vaccinations: string;
  weight: string;
  userPreferences: string;
}

interface MemoryState {
  structuredMemories: Record<string, StructuredPetMemory>;
  timelineLogs: MemoryLog[];
  
  // Actions
  addTimelineMemory: (petId: string, event: string, severity: 'INFO' | 'WARNING' | 'CRITICAL') => void;
  updateStructuredMemory: (petId: string, key: keyof StructuredPetMemory, value: string) => void;
  getRelevantContext: (petId: string, query: string) => string;
}

const defaultStructuredMemories: Record<string, StructuredPetMemory> = {
  'pet-max': {
    meals: 'Target: 440g Royal Canin Puppy Large kibble daily split into 2 feeds (08:00 AM & 06:00 PM). Fast eater.',
    water: 'Target: 1,000ml daily. Prefers water bowl refreshed daily; water intake flags warning drops if stale.',
    exercise: 'Target: 45 mins. Walk route: Pine Ridge trail standard. Likes fetching tennis balls.',
    health: 'Allergies: Beef and Pollen. Diagnosis: Seasonal Atopic Dermatitis. Active meds: Apoquel daily tablet.',
    vaccinations: 'DHPP Booster due in 8 days. Dr. Martinez, Westside Animal Hospital.',
    weight: 'Golden Retriever Growth curve target: Weight increased from 14.1kg to 14.8kg over last 6 months.',
    userPreferences: 'Owner Sarah prefers walking before 9:00 AM to beat summer asphalt paw heat levels.',
  },
};

export const useMemoryStore = create<MemoryState>((set, get) => ({
  structuredMemories: defaultStructuredMemories,
  timelineLogs: mockMemoryLogs,

  addTimelineMemory: (petId, event, severity) => {
    const newLog: MemoryLog = {
      id: `mem-${Date.now()}`,
      petId,
      event,
      severity,
      timestamp: new Date().toISOString(),
    };
    set((state) => ({
      timelineLogs: [newLog, ...state.timelineLogs],
    }));
  },

  updateStructuredMemory: (petId, key, value) => {
    set((state) => {
      const petMemory = state.structuredMemories[petId] || {
        meals: '',
        water: '',
        exercise: '',
        health: '',
        vaccinations: '',
        weight: '',
        userPreferences: '',
      };
      return {
        structuredMemories: {
          ...state.structuredMemories,
          [petId]: {
            ...petMemory,
            [key]: value,
          },
        },
      };
    });
  },

  getRelevantContext: (petId, query) => {
    const { structuredMemories } = get();
    const petMem = structuredMemories[petId] || {
      meals: 'No meal preferences recorded.',
      water: 'No hydration preferences recorded.',
      exercise: 'No exercise targets recorded.',
      health: 'No allergy warning logs.',
      vaccinations: 'No vaccination records.',
      weight: 'No growth logs.',
      userPreferences: 'No user preferences logged.',
    };

    const lower = query.toLowerCase();
    const contexts: string[] = [];

    // Always inject user preferences
    contexts.push(`User Preferences: ${petMem.userPreferences}`);

    if (lower.includes('feed') || lower.includes('eat') || lower.includes('food') || lower.includes('nutrition') || lower.includes('meal') || lower.includes('calorie') || lower.includes('kibble')) {
      contexts.push(`Meals & Diet: ${petMem.meals}`);
    }
    if (lower.includes('water') || lower.includes('drink') || lower.includes('hydration') || lower.includes('ml')) {
      contexts.push(`Hydration: ${petMem.water}`);
    }
    if (lower.includes('walk') || lower.includes('exercise') || lower.includes('play') || lower.includes('active') || lower.includes('duration') || lower.includes('km')) {
      contexts.push(`Exercise Habits: ${petMem.exercise}`);
    }
    if (lower.includes('scratch') || lower.includes('itch') || lower.includes('symptom') || lower.includes('vomit') || lower.includes('poop') || lower.includes('stool') || lower.includes('urine') || lower.includes('health') || lower.includes('clinical') || lower.includes('med')) {
      contexts.push(`Health Profile: ${petMem.health}`);
      contexts.push(`Vaccination Targets: ${petMem.vaccinations}`);
    }
    if (lower.includes('weight') || lower.includes('grow') || lower.includes('scale') || lower.includes('heavy') || lower.includes('kg')) {
      contexts.push(`Weight Curve: ${petMem.weight}`);
    }

    return contexts.join('\n');
  },
}));
export default useMemoryStore;

import { usePetStore } from '@/store/petStore';

export interface ToolDefinition {
  name: string;
  description: string;
  execute: (petId: string) => any;
}

export const toolRegistry: Record<string, ToolDefinition> = {
  getPetProfile: {
    name: 'getPetProfile',
    description: 'Retrieves the basic details of the active pet (breed, age, weight, medical tags).',
    execute: (petId) => {
      const { pets } = usePetStore.getState();
      return pets.find((p) => p.id === petId) || null;
    },
  },
  getNutritionHistory: {
    name: 'getNutritionHistory',
    description: 'Retrieves recent meal logs for the pet.',
    execute: (petId) => {
      const { logs } = usePetStore.getState();
      return logs.filter((l) => l.petId === petId && l.type === 'NUTRITION');
    },
  },
  getWaterHistory: {
    name: 'getWaterHistory',
    description: 'Retrieves recent water intake logs for the pet.',
    execute: (petId) => {
      const { logs } = usePetStore.getState();
      return logs.filter((l) => l.petId === petId && l.type === 'WATER');
    },
  },
  getExerciseHistory: {
    name: 'getExerciseHistory',
    description: 'Retrieves recent walk and exercise logs for the pet.',
    execute: (petId) => {
      const { logs } = usePetStore.getState();
      return logs.filter((l) => l.petId === petId && l.type === 'EXERCISE');
    },
  },
  getHealthHistory: {
    name: 'getHealthHistory',
    description: 'Retrieves recent symptom updates and clinical alerts.',
    execute: (petId) => {
      const { logs } = usePetStore.getState();
      return logs.filter((l) => l.petId === petId && (l.type === 'HEALTH' || l.type === 'STOOL_URINE'));
    },
  },
  getReports: {
    name: 'getReports',
    description: 'Retrieves weekly bloom wellness reports.',
    execute: (petId) => {
      const { weeklyReports } = usePetStore.getState();
      return weeklyReports.filter((r) => r.petId === petId);
    },
  },
  getUpcomingTasks: {
    name: 'getUpcomingTasks',
    description: 'Retrieves remaining scheduled tasks for the current pet today.',
    execute: (petId) => {
      const { scheduleTasks } = usePetStore.getState();
      return scheduleTasks.filter((t) => t.petId === petId && !t.isCompleted);
    },
  },
};

export const executeTool = (name: string, petId: string): any => {
  const tool = toolRegistry[name];
  if (!tool) {
    throw new Error(`Tool ${name} is not registered.`);
  }
  return tool.execute(petId);
};

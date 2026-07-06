import {
  type Pet,
  type PetLog,
  type Reminder,
  type ScheduleTask,
  type WeeklyReport,
  mockPets,
  mockLogs,
  mockReminders,
  mockScheduleTasks,
  mockWeeklyReport,
} from '@/utils/mockData';

export const petService = {
  async getPets(): Promise<Pet[]> {
    await new Promise((resolve) => setTimeout(resolve, 600));
    return mockPets;
  },

  async createPet(petData: Omit<Pet, 'id'>): Promise<Pet> {
    await new Promise((resolve) => setTimeout(resolve, 800));
    return {
      ...petData,
      id: `pet-${Math.random().toString(36).substr(2, 9)}`,
    };
  },

  async updatePet(id: string, updates: Partial<Pet>): Promise<Pet> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const pet = mockPets.find((p) => p.id === id);
    if (!pet) throw new Error('Pet not found');
    return { ...pet, ...updates };
  },

  async getLogs(petId: string): Promise<PetLog[]> {
    await new Promise((resolve) => setTimeout(resolve, 600));
    return mockLogs.filter((log) => log.petId === petId);
  },

  async createLog(petId: string, type: PetLog['type'], payload: Record<string, any>): Promise<PetLog> {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return {
      id: `log-${Date.now()}`,
      petId,
      type,
      timestamp: new Date().toISOString(),
      payload,
    };
  },

  async getSchedule(petId: string, date: string): Promise<ScheduleTask[]> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return mockScheduleTasks.filter((t) => t.petId === petId && t.targetDate === date);
  },

  async getReminders(petId: string): Promise<Reminder[]> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return mockReminders.filter((r) => r.petId === petId);
  },

  async getWeeklyReports(petId: string): Promise<WeeklyReport[]> {
    await new Promise((resolve) => setTimeout(resolve, 800));
    return [mockWeeklyReport].filter((r) => r.petId === petId);
  },
};

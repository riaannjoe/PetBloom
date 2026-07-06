import { delay } from '@/lib/utils';
import {
  mockChatMessages,
  mockFoodInventory,
  mockLogs,
  mockMemoryLogs,
  mockPets,
  mockReminders,
  mockScheduleTasks,
  mockUser,
  mockWeeklyReport,
} from '@/data/mock';
import type {
  ChatMessage,
  FoodInventory,
  LogType,
  MemoryLog,
  Pet,
  PetLog,
  Reminder,
  ScheduleTask,
  User,
  WeeklyReport,
} from '@/types/domain';

const MOCK_LATENCY_MS = 280;

async function simulateNetwork<T>(data: T): Promise<T> {
  await delay(MOCK_LATENCY_MS);
  return structuredClone(data);
}

export const mockApi = {
  async getCurrentUser(): Promise<User> {
    return simulateNetwork(mockUser);
  },

  async getPets(): Promise<Pet[]> {
    return simulateNetwork(mockPets);
  },

  async getPetById(petId: string): Promise<Pet | undefined> {
    const pet = mockPets.find((p) => p.id === petId);
    return simulateNetwork(pet);
  },

  async getLogs(petId: string, type?: LogType): Promise<PetLog[]> {
    const logs = mockLogs.filter(
      (log) => log.petId === petId && (type ? log.type === type : true),
    );
    return simulateNetwork(logs);
  },

  async getFoodInventory(petId: string): Promise<FoodInventory[]> {
    const inventory = mockFoodInventory.filter((item) => item.petId === petId);
    return simulateNetwork(inventory);
  },

  async getReminders(petId: string): Promise<Reminder[]> {
    const reminders = mockReminders.filter((r) => r.petId === petId);
    return simulateNetwork(reminders);
  },

  async getScheduleTasks(petId: string, date: string): Promise<ScheduleTask[]> {
    const tasks = mockScheduleTasks.filter(
      (task) => task.petId === petId && task.targetDate === date,
    );
    return simulateNetwork(tasks);
  },

  async getMemoryLogs(petId: string): Promise<MemoryLog[]> {
    const logs = mockMemoryLogs.filter((log) => log.petId === petId);
    return simulateNetwork(logs);
  },

  async getWeeklyReport(petId: string): Promise<WeeklyReport | undefined> {
    const report =
      mockWeeklyReport.petId === petId ? mockWeeklyReport : undefined;
    return simulateNetwork(report);
  },

  async getChatMessages(petId: string): Promise<ChatMessage[]> {
    const messages = mockChatMessages.filter((msg) => msg.petId === petId);
    return simulateNetwork(messages);
  },
};

export type MockApi = typeof mockApi;

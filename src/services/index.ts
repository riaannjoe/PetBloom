import { env } from '@/config/env';
import { apiClient } from '@/services/api/client';
import { API_ENDPOINTS } from '@/services/api/endpoints';
import { mockApi } from '@/services/mock/mockApi';
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

/**
 * Unified API facade.
 * Routes to the mock layer during development; switches to Express backend when ready.
 */
export const api = {
  getCurrentUser(): Promise<User> {
    if (env.useMockApi) return mockApi.getCurrentUser();
    return apiClient<User>(API_ENDPOINTS.auth.login);
  },

  getPets(): Promise<Pet[]> {
    if (env.useMockApi) return mockApi.getPets();
    return apiClient<Pet[]>(API_ENDPOINTS.pets);
  },

  getPetById(petId: string): Promise<Pet | undefined> {
    if (env.useMockApi) return mockApi.getPetById(petId);
    return apiClient<Pet>(`${API_ENDPOINTS.pets}/${petId}`);
  },

  getLogs(petId: string, type?: LogType): Promise<PetLog[]> {
    if (env.useMockApi) return mockApi.getLogs(petId, type);
    return apiClient<PetLog[]>(API_ENDPOINTS.logs, { params: { petId, type } });
  },

  getFoodInventory(petId: string): Promise<FoodInventory[]> {
    if (env.useMockApi) return mockApi.getFoodInventory(petId);
    return apiClient<FoodInventory[]>(API_ENDPOINTS.inventory, {
      params: { petId },
    });
  },

  getReminders(petId: string): Promise<Reminder[]> {
    if (env.useMockApi) return mockApi.getReminders(petId);
    return apiClient<Reminder[]>(API_ENDPOINTS.reminders, { params: { petId } });
  },

  getScheduleTasks(petId: string, date: string): Promise<ScheduleTask[]> {
    if (env.useMockApi) return mockApi.getScheduleTasks(petId, date);
    return apiClient<ScheduleTask[]>(API_ENDPOINTS.schedule, {
      params: { petId, date },
    });
  },

  getMemoryLogs(petId: string): Promise<MemoryLog[]> {
    if (env.useMockApi) return mockApi.getMemoryLogs(petId);
    return apiClient<MemoryLog[]>(`/memory-logs`, { params: { petId } });
  },

  getWeeklyReport(petId: string): Promise<WeeklyReport | undefined> {
    if (env.useMockApi) return mockApi.getWeeklyReport(petId);
    return apiClient<WeeklyReport>(API_ENDPOINTS.reports.weekly, {
      params: { petId },
    });
  },

  getChatMessages(petId: string): Promise<ChatMessage[]> {
    if (env.useMockApi) return mockApi.getChatMessages(petId);
    return apiClient<ChatMessage[]>(API_ENDPOINTS.chat, { params: { petId } });
  },
};

export { mockApi } from '@/services/mock/mockApi';
export { apiClient, ApiError } from '@/services/api/client';
export { API_ENDPOINTS } from '@/services/api/endpoints';

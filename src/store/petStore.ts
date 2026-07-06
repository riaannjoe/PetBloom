import { create } from 'zustand';
import {
  type Pet,
  type PetLog,
  type FoodInventory,
  type Reminder,
  type ScheduleTask,
  type MemoryLog,
  type WeeklyReport,
  type ChatMessage,
  mockPets,
  mockLogs,
  mockFoodInventory,
  mockReminders,
  mockScheduleTasks,
  mockMemoryLogs,
  mockWeeklyReport,
  mockChatMessages
} from '@/utils/mockData';
import { agentService } from '@/services/agent/agentService';

interface PetState {
  pets: Pet[];
  activePetId: string;
  logs: PetLog[];
  inventory: FoodInventory[];
  reminders: Reminder[];
  scheduleTasks: ScheduleTask[];
  memoryLogs: MemoryLog[];
  weeklyReports: WeeklyReport[];
  chatHistory: ChatMessage[];
  
  // Actions
  setActivePetId: (id: string) => void;
  addPet: (pet: Omit<Pet, 'id'>) => void;
  updatePet: (id: string, updates: Partial<Pet>) => void;
  deletePet: (id: string) => void;
  addPetLog: (type: PetLog['type'], payload: Record<string, any>) => void;
  updatePetLog: (id: string, payload: Record<string, any>) => void;
  deletePetLog: (id: string) => void;
  toggleScheduleTask: (id: string) => void;
  reorderFood: (inventoryId: string) => void;
  completeReminder: (id: string) => void;
  addChatMessage: (content: string) => Promise<void>;
  clearChatHistory: () => void;
}

export const usePetStore = create<PetState>((set, get) => ({
  pets: mockPets,
  activePetId: mockPets[0]?.id || '',
  logs: mockLogs,
  inventory: mockFoodInventory,
  reminders: mockReminders,
  scheduleTasks: mockScheduleTasks,
  memoryLogs: mockMemoryLogs,
  weeklyReports: [mockWeeklyReport],
  chatHistory: mockChatMessages,

  setActivePetId: (activePetId) => set({ activePetId }),
  
  addPet: (petData) => {
    const newPet: Pet = {
      ...petData,
      id: `pet-${Math.random().toString(36).substr(2, 9)}`,
    };
    set((state) => ({
      pets: [...state.pets, newPet],
      activePetId: state.pets.length === 0 ? newPet.id : state.activePetId,
    }));
  },

  updatePet: (id, updates) => {
    set((state) => ({
      pets: state.pets.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    }));
  },

  deletePet: (id) => {
    set((state) => {
      const updatedPets = state.pets.filter((p) => p.id !== id);
      let nextActiveId = state.activePetId;
      if (state.activePetId === id) {
        nextActiveId = updatedPets[0]?.id || '';
      }
      return {
        pets: updatedPets,
        activePetId: nextActiveId,
      };
    });
  },

  addPetLog: (type, payload) => {
    const { activePetId, logs, inventory } = get();
    const newLog: PetLog = {
      id: `log-${Date.now()}`,
      petId: activePetId,
      type,
      timestamp: new Date().toISOString(),
      payload,
    };

    let updatedInventory = [...inventory];

    // Auto-deplete food inventory logic if nutrition log is added
    if (type === 'NUTRITION' && payload.foodName && payload.qtyGrams) {
      updatedInventory = inventory.map((inv) => {
        if (inv.petId === activePetId && inv.foodName === payload.foodName) {
          const qtyKg = payload.qtyGrams / 1000;
          return {
            ...inv,
            currentQty: Math.max(0, parseFloat((inv.currentQty - qtyKg).toFixed(2))),
          };
        }
        return inv;
      });
    }

    set({
      logs: [newLog, ...logs],
      inventory: updatedInventory,
    });
  },

  updatePetLog: (id, payload) => {
    set((state) => ({
      logs: state.logs.map((log) => (log.id === id ? { ...log, payload } : log)),
    }));
  },

  deletePetLog: (id) => {
    set((state) => ({
      logs: state.logs.filter((log) => log.id !== id),
    }));
  },

  toggleScheduleTask: (id) => {
    set((state) => ({
      scheduleTasks: state.scheduleTasks.map((t) =>
        t.id === id ? { ...t, isCompleted: !t.isCompleted } : t
      ),
    }));
  },

  reorderFood: (inventoryId) => {
    set((state) => ({
      inventory: state.inventory.map((inv) =>
        inv.id === inventoryId ? { ...inv, currentQty: 10.0 } : inv // Reorder fills up to 10kg
      ),
    }));
  },

  completeReminder: (id) => {
    set((state) => ({
      reminders: state.reminders.map((r) =>
        r.id === id ? { ...r, status: 'COMPLETED' } : r
      ),
    }));
  },

  addChatMessage: async (content) => {
    const { activePetId, chatHistory } = get();
    if (!activePetId) return;

    const userMessage: ChatMessage = {
      id: `msg-user-${Date.now()}`,
      petId: activePetId,
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
    };

    set({ chatHistory: [...chatHistory, userMessage] });

    // Call the dynamic Agent service layer
    const aiReply = await agentService.runAgent(activePetId, content);

    const assistantMessage: ChatMessage = {
      id: `msg-ai-${Date.now()}`,
      petId: activePetId,
      role: 'assistant',
      content: aiReply,
      timestamp: new Date().toISOString(),
    };

    set((state) => ({
      chatHistory: [...state.chatHistory, assistantMessage],
    }));
  },

  clearChatHistory: () => {
    const { activePetId } = get();
    set((state) => ({
      chatHistory: state.chatHistory.filter((c) => c.petId !== activePetId),
    }));
  },
}));

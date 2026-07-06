import { usePetStore } from '@/store/petStore';
import { useMemoryStore } from '@/store/memoryStore';

export const memoryManager = {
  addHealthObservation(petId: string, observation: string, severity: 'INFO' | 'WARNING' | 'CRITICAL') {
    const { addTimelineMemory } = useMemoryStore.getState();
    addTimelineMemory(petId, observation, severity);
  },

  getConversationHistory(petId: string) {
    const { chatHistory } = usePetStore.getState();
    return chatHistory.filter((c) => c.petId === petId);
  }
};
export default memoryManager;

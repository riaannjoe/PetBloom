import type { ChatMessage } from '@/utils/mockData';

export const aiService = {
  async sendMessage(_petId: string, message: string, _history: ChatMessage[]): Promise<string> {
    // Simulate LLM roundtrip latency
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('scratch') || lowerMessage.includes('ear') || lowerMessage.includes('itch')) {
      return `Based on my analysis of the logs, scratching in the left ear was reported today. Since Max has seasonal dermatitis and takes Apoquel, this could be a mild flare-up. Keep the ear clean and dry. I've logged an observation to check if it persists.`;
    }
    
    if (lowerMessage.includes('food') || lowerMessage.includes('hungry') || lowerMessage.includes('feed')) {
      return `I've checked the schedule. Max has had his morning feeding. The next feeding of 220g of Royal Canin Puppy Large is scheduled for 06:00 PM. Would you like me to adjust this or schedule a treat?`;
    }

    if (lowerMessage.includes('weather') || lowerMessage.includes('walk') || lowerMessage.includes('hot')) {
      return `The local temperature is warm today. I recommend walking him before 9:00 AM or after 6:00 PM to avoid the asphalt heat. Make sure to bring clean drinking water!`;
    }

    return `I am analyzing your query regarding the pet with ID: ${_petId}. I will cross-reference this with the historical water log and vaccination statuses. What specific details would you like to focus on?`;
  },

  async analyzeSymptomTrend(_petId: string, symptom: string): Promise<{ risk: 'LOW' | 'MEDIUM' | 'HIGH'; message: string }> {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return {
      risk: 'LOW',
      message: `No repetitive clusters of ${symptom} detected in the past 7 days. Behavior trends remain within standard boundaries for this breed.`,
    };
  },
};

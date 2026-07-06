import { agentExecutor } from './agentExecutor';

export const agentService = {
  async runAgent(petId: string, userQuery: string, onChunk?: (chunk: string) => void): Promise<string> {
    console.log(`[Agent Service] Processing query for pet ${petId}: "${userQuery}"`);
    return agentExecutor.execute(petId, userQuery, onChunk);
  },
};
export default agentService;

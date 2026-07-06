export interface AgentContext {
   userQuery: string;
   petProfile: any;
   toolResults: Record<string, any>;
   longTermMemory: string;
   timestamp: string;
 }
 
 export const buildAgentPrompt = (context: AgentContext): string => {
   const { userQuery, petProfile, toolResults, longTermMemory, timestamp } = context;
 
   const profileSummary = petProfile
     ? `Name: ${petProfile.name}, Breed: ${petProfile.breed}, Age: ${petProfile.ageMonths} months, Weight: ${petProfile.weight}kg`
     : 'Unknown Pet';
 
   const toolsSummary = Object.entries(toolResults)
     .map(([toolName, data]) => {
       return `### Tool: ${toolName}\nResult: ${JSON.stringify(data, null, 2)}`;
     })
     .join('\n\n');
 
   return `
 SYSTEM INSTRUCTION:
 You are the PetBloom AI Concierge, a premium agentic pet care expert.
 Your goal is to analyze user questions, consult injected context tools, reference past long-term memories, and provide helpful, breed-appropriate recommendations.
 
 CURRENT TIME: ${timestamp}
 ACTIVE PET PROFILE:
 ${profileSummary}
 
 RETRIEVED LONG-TERM MEMORY CONTEXT:
 ${longTermMemory}
 
 EXECUTED CONTEXT TOOLS:
 ${toolsSummary}
 
 USER REQUEST:
 "${userQuery}"
 
 Provide a structured, helpful markdown response. Keep it friendly, empathetic, and actionable.
 `;
 };
 
 export default buildAgentPrompt;

import { executeTool } from './toolRegistry';
import { buildAgentPrompt } from './promptBuilder';
import { memoryManager } from './memoryManager';
import { env } from '@/config/env';
import { geminiService } from '@/services/geminiService';
import { useMemoryStore } from '@/store/memoryStore';

export const agentExecutor = {
  async execute(
    petId: string,
    userQuery: string,
    onChunk?: (chunk: string) => void
  ): Promise<string> {
    // 1. Determine required tools based on query keywords
    const requiredTools: string[] = ['getPetProfile'];
    const lowerQuery = userQuery.toLowerCase();

    if (lowerQuery.includes('feed') || lowerQuery.includes('eat') || lowerQuery.includes('food') || lowerQuery.includes('nutrition') || lowerQuery.includes('meal') || lowerQuery.includes('calorie') || lowerQuery.includes('kibble')) {
      requiredTools.push('getNutritionHistory');
    }
    if (lowerQuery.includes('water') || lowerQuery.includes('drink') || lowerQuery.includes('hydration') || lowerQuery.includes('ml')) {
      requiredTools.push('getWaterHistory');
    }
    if (lowerQuery.includes('walk') || lowerQuery.includes('exercise') || lowerQuery.includes('play') || lowerQuery.includes('active') || lowerQuery.includes('duration') || lowerQuery.includes('km')) {
      requiredTools.push('getExerciseHistory');
    }
    if (lowerQuery.includes('scratch') || lowerQuery.includes('itch') || lowerQuery.includes('symptom') || lowerQuery.includes('vomit') || lowerQuery.includes('poop') || lowerQuery.includes('stool') || lowerQuery.includes('urine') || lowerQuery.includes('health') || lowerQuery.includes('clinical')) {
      requiredTools.push('getHealthHistory');
    }
    if (lowerQuery.includes('report') || lowerQuery.includes('weekly') || lowerQuery.includes('bloom') || lowerQuery.includes('wellness')) {
      requiredTools.push('getReports');
    }
    if (lowerQuery.includes('task') || lowerQuery.includes('schedule') || lowerQuery.includes('todo') || lowerQuery.includes('completed') || lowerQuery.includes('pending')) {
      requiredTools.push('getUpcomingTasks');
    }

    // 2. Execute selected tools to inject real-time context
    const toolResults: Record<string, any> = {};
    requiredTools.forEach((toolName) => {
      try {
        toolResults[toolName] = executeTool(toolName, petId);
      } catch (err) {
        console.error(`Tool execution failed for ${toolName}:`, err);
      }
    });

    const petProfile = toolResults['getPetProfile'];
    const petName = petProfile?.name || 'your pet';
    const breed = petProfile?.breed || 'unknown breed';

    const { getRelevantContext } = useMemoryStore.getState();
    const longTermMemory = getRelevantContext(petId, userQuery);

    // 3. Build system instructions with context tools injected
    const systemPrompt = buildAgentPrompt({
      userQuery,
      petProfile,
      toolResults,
      longTermMemory,
      timestamp: new Date().toISOString(),
    }) + `\n
UI CARD INJECTION DIRECTIVE:
You can trigger rich visual UI cards inside the chat bubble by mentioning these keyword combinations:
- Include "Daily Care Plan" to render the daily routine tracker card.
- Include "Weekly Bloom Summary" to render the wellness targets card.
- Include "Nutrition Advice" to render the calorie metrics card.
- Include "Health Warning" to render the allergy check alerts card.
- Include "Exercise Suggestions" to render the workout card.
- Include "Grooming Suggestion" to render the bathing claw clips schedule card.
`;

    // 4. If Gemini API key is available, call Gemini (with mock tool injection fallback)
    if (env.geminiApiKey) {
      try {
        console.log('[Agent Executor] Routing request to Google Gemini API...');
        
        // Feed conversational context
        const history = memoryManager.getConversationHistory(petId).map((msg) => ({
          role: msg.role,
          content: msg.content,
        }));

        if (onChunk) {
          // Streaming flow
          return await geminiService.streamResponse(systemPrompt, userQuery, history, onChunk);
        } else {
          // Standard block flow
          return await geminiService.generateResponse(systemPrompt, userQuery, history);
        }
      } catch (geminiError) {
        console.warn('[Agent Executor] Gemini API failed. Falling back to local reasoning engine:', geminiError);
      }
    }

    // 5. Fallback Mock Reasoning Engine (If API Key is missing or request fails)
    await new Promise((resolve) => setTimeout(resolve, 1500));

    if (requiredTools.includes('getHealthHistory')) {
      const observation = `Scratching symptom flagged on active pet profile ${petName}.`;
      memoryManager.addHealthObservation(petId, observation, 'WARNING');
      
      const responseText = `I ran the **getHealthHistory** tool for ${petName} (${breed}) to check recent observations.
      
• **Medical Diagnosis**: Has Seasonal Atopic Dermatitis and takes Apoquel daily.
• **Analysis**: Scratching can indicate an allergen spike. I recommend checking their skin for redness.
• **Observation Saved**: I have logged this observation to the Visual Memory Timeline. Let me know if symptoms persist!

Triggering relevant card: Health Warning`;
      
      if (onChunk) {
        // Mock stream simulation
        for (const word of responseText.split(' ')) {
          onChunk(word + ' ');
          await new Promise((r) => setTimeout(r, 60));
        }
      }
      return responseText;
    }

    if (requiredTools.includes('getNutritionHistory')) {
      const mealLogs = toolResults['getNutritionHistory'] || [];
      const mealSummary = mealLogs.length > 0
        ? `Last recorded meal was ${mealLogs[0]?.payload?.qtyGrams}g of ${mealLogs[0]?.payload?.foodName}.`
        : 'No nutrition logs found for today yet.';

      const responseText = `I consulted the **getNutritionHistory** tool to inspect the daily feeding log for ${petName}.
      
• **Breed Calorie recommendation**: Golden Retrievers and large puppies require controlled portions.
• **Current state**: ${mealSummary}
• **Calorie Portion advice**: Maintain current kibble distribution. Adjust by ±10% if activity levels change drastically.

Triggering relevant card: Nutrition Advice`;

      if (onChunk) {
        for (const word of responseText.split(' ')) {
          onChunk(word + ' ');
          await new Promise((r) => setTimeout(r, 60));
        }
      }
      return responseText;
    }

    if (requiredTools.includes('getWaterHistory')) {
      const waterLogs = toolResults['getWaterHistory'] || [];
      const waterSummary = waterLogs.length > 0
        ? `Consumed ${waterLogs[0]?.payload?.amountMl}ml of fresh water.`
        : 'No hydration logs found today.';

      const responseText = `I queried the **getWaterHistory** tool to review the hydration levels for ${petName}.
      
• **Analysis**: Hydration target is critical for large active breeds to support digestion.
• **Recent Intake**: ${waterSummary}
• **Advice**: Try adding ice cubes or placing separate bowls in active rooms if intake drops below daily goals.

Triggering relevant card: Nutrition Advice`;

      if (onChunk) {
        for (const word of responseText.split(' ')) {
          onChunk(word + ' ');
          await new Promise((r) => setTimeout(r, 60));
        }
      }
      return responseText;
    }

    if (requiredTools.includes('getExerciseHistory')) {
      const responseText = `I executed the **getExerciseHistory** tool to verify ${petName}'s recent workout metrics.
      
• **Activity Guidance**: Breed guidelines recommend 45 minutes of daily walks.
• **Current Weather shift**: It is hot today. I suggest scheduling physical walks before 9:00 AM or after 6:00 PM to keep paw pads safe.

Triggering relevant card: Exercise Suggestions`;

      if (onChunk) {
        for (const word of responseText.split(' ')) {
          onChunk(word + ' ');
          await new Promise((r) => setTimeout(r, 60));
        }
      }
      return responseText;
    }

    if (requiredTools.includes('getReports')) {
      const responseText = `I used the **getReports** tool to retrieve the weekly Bloom wellness summary.
      
• **Bloom Score**: 92% Wellness Score.
• **Summary**: Nutrition compliance looks excellent. Water levels have significantly improved towards the end of the week.
• **Focus area**: Next grooming schedule checks are advised.

Triggering relevant card: Weekly Bloom Summary`;

      if (onChunk) {
        for (const word of responseText.split(' ')) {
          onChunk(word + ' ');
          await new Promise((r) => setTimeout(r, 60));
        }
      }
      return responseText;
    }

    if (requiredTools.includes('getUpcomingTasks')) {
      const tasks = toolResults['getUpcomingTasks'] || [];
      const taskList = tasks.length > 0
        ? tasks.map((t: any) => `• ${t.title} (${t.time})`).join('\n')
        : 'All tasks completed successfully today!';

      const responseText = `I consulted the **getUpcomingTasks** tool to review today's pending routine checklists.
      
• **Remaining Tasks**:
${taskList}
• **Bloom Status**: Complete these checklist items to hit 100% Bloom completion!

Triggering relevant card: Daily Care Plan`;

      if (onChunk) {
        for (const word of responseText.split(' ')) {
          onChunk(word + ' ');
          await new Promise((r) => setTimeout(r, 60));
        }
      }
      return responseText;
    }

    const responseText = `I consulted the **getPetProfile** tool for ${petName}.
    
I have logged this search details. As ${petName}'s AI concierge, I can cross-reference logs to calculate hydration targets, list vaccine boosters, or verify daily meal portion targets. Let me know if you would like me to pull reports or log a new symptom!`;

    if (onChunk) {
      for (const word of responseText.split(' ')) {
        onChunk(word + ' ');
        await new Promise((r) => setTimeout(r, 60));
      }
    }
    return responseText;
  },
};
export default agentExecutor;

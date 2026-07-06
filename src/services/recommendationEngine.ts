import { usePetStore } from '@/store/petStore';
import { CARE_TARGETS } from '@/config/constants';

export interface Recommendation {
  category: 'DAILY_CARE_PLAN' | 'WEEKLY_SUMMARY' | 'HEALTH_WARNING' | 'NUTRITION_SUGGESTION' | 'EXERCISE_SUGGESTION' | 'HYDRATION_SUGGESTION' | 'UPCOMING_TASK';
  title: string;
  reason: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  suggestedAction: string;
}

export const recommendationEngine = {
  generateRecommendations(petId: string): Recommendation[] {
    const { pets, logs, inventory, reminders, scheduleTasks, weeklyReports } = usePetStore.getState();

    const pet = pets.find((p) => p.id === petId);
    if (!pet) return [];

    const recommendations: Recommendation[] = [];

    // Filter today's logs
    const todayStr = new Date().toISOString().split('T')[0];
    const todaysLogs = logs.filter((log) => {
      return log.petId === petId && log.timestamp.startsWith(todayStr);
    });

    const isGolden = pet.breed.toLowerCase().includes('golden') || pet.breed.toLowerCase().includes('retriever');
    const waterTarget = isGolden ? CARE_TARGETS.GOLDEN_RETRIEVER.WATER_ML : CARE_TARGETS.DEFAULT.WATER_ML;
    const exerciseTarget = isGolden ? CARE_TARGETS.GOLDEN_RETRIEVER.EXERCISE_MINS : CARE_TARGETS.DEFAULT.EXERCISE_MINS;

    // 1. HEALTH WARNINGS
    const healthLogs = todaysLogs.filter((l) => l.type === 'HEALTH');
    if (healthLogs.length > 0) {
      const highestSeverity = healthLogs.some((l) => (l.payload.severity as string)?.toLowerCase() === 'high') ? 'HIGH' : 'MEDIUM';
      const symptomNames = healthLogs.map((l) => l.payload.symptom || 'unspecified symptom').join(', ');
      
      recommendations.push({
        category: 'HEALTH_WARNING',
        title: `Monitor Symptoms: ${symptomNames}`,
        reason: `Health telemetry recorded active symptoms (${symptomNames}) today.`,
        priority: highestSeverity as 'HIGH' | 'MEDIUM',
        suggestedAction: 'Isolate trigger allergens, inspect skin for inflammation, and consult clinical vet if symptoms persist.',
      });
    }

    if (pet.allergies) {
      recommendations.push({
        category: 'HEALTH_WARNING',
        title: 'Allergen Exposure Warning',
        reason: `Pet profile lists active allergies: ${pet.allergies}.`,
        priority: 'MEDIUM',
        suggestedAction: 'Ensure all kibble recipes, training treats, and grooming shampoos avoid allergen ingredients.',
      });
    }

    // 2. HYDRATION SUGGESTIONS
    const waterLogs = todaysLogs.filter((l) => l.type === 'WATER');
    const totalWater = waterLogs.reduce((sum, l) => sum + (l.payload.amountMl as number || 0), 0);

    if (totalWater < waterTarget) {
      const deficit = waterTarget - totalWater;
      recommendations.push({
        category: 'HYDRATION_SUGGESTION',
        title: 'Hydration Target Shortfall',
        reason: `Logged water consumption today is ${totalWater}ml. Deficit: ${deficit}ml.`,
        priority: totalWater < waterTarget * 0.5 ? 'HIGH' : 'MEDIUM',
        suggestedAction: 'Provide fresh filtered water bowl. Try adding ice cubes or clean fountains to encourage drinking.',
      });
    }

    // 3. NUTRITION SUGGESTIONS
    const foodInv = inventory.find((i) => i.petId === petId);
    if (foodInv) {
      const daysLeft = foodInv.currentQty / foodInv.dailyConsumption;
      if (daysLeft < 3) {
        recommendations.push({
          category: 'NUTRITION_SUGGESTION',
          title: 'Food Stock Depleted',
          reason: `Kibble storage inventory is critically low (approx. ${daysLeft.toFixed(1)} days remaining).`,
          priority: 'HIGH',
          suggestedAction: 'Initiate manual reorder of Royal Canin Puppy Kibble using the Stock Widget.',
        });
      }
    }

    const nutritionLogs = todaysLogs.filter((l) => l.type === 'NUTRITION');
    if (nutritionLogs.length === 0) {
      recommendations.push({
        category: 'NUTRITION_SUGGESTION',
        title: 'Daily Meal Not Logged',
        reason: 'No nutrition feeding records entered for today yet.',
        priority: 'MEDIUM',
        suggestedAction: 'Log morning or evening portion size details inside the Nutrition telemetry card.',
      });
    }

    // 4. EXERCISE SUGGESTIONS
    const exerciseLogs = todaysLogs.filter((l) => l.type === 'EXERCISE');
    const totalExercise = exerciseLogs.reduce((sum, l) => sum + (l.payload.durationMinutes as number || 0), 0);

    if (totalExercise < exerciseTarget) {
      const durationDeficit = exerciseTarget - totalExercise;
      recommendations.push({
        category: 'EXERCISE_SUGGESTION',
        title: 'Exercise Quota Deficit',
        reason: `Logged active minutes today is ${totalExercise} mins. Shortfall: ${durationDeficit} mins.`,
        priority: 'MEDIUM',
        suggestedAction: `Schedule a quick ${durationDeficit}-minute outdoor run, fetch play, or agility training session.`,
      });
    }

    // Weather warning (Simulated summer heat check)
    recommendations.push({
      category: 'EXERCISE_SUGGESTION',
      title: 'Summer Heat Safety Warning',
      reason: 'Midday solar temperatures exceed safe indexes for paw pads.',
      priority: 'MEDIUM',
      suggestedAction: 'Perform primary walks before 9:00 AM or after 6:00 PM. Prefer shaded trails.',
    });

    // 5. UPCOMING TASKS (VACCINATION & REMINDERS)
    const activeReminders = reminders.filter((r) => r.petId === petId && r.status === 'PENDING');
    activeReminders.forEach((rem) => {
      const dueDate = new Date(rem.dueTime);
      const diffTime = dueDate.getTime() - new Date().getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays >= 0 && diffDays <= 10) {
        recommendations.push({
          category: 'UPCOMING_TASK',
          title: `Upcoming ${rem.type}: ${rem.title}`,
          reason: `Task "${rem.title}" is due in ${diffDays} days (${dueDate.toLocaleDateString()}).`,
          priority: diffDays <= 2 ? 'HIGH' : 'MEDIUM',
          suggestedAction: rem.type === 'VACCINATION'
            ? 'Confirm clinic slot with Westside Animal Hospital and prep medical vaccination booklet.'
            : 'Pre-schedule task slots on the daily planner calendar.',
        });
      }
    });

    // 6. DAILY CARE PLAN
    const activeTasks = scheduleTasks.filter((t) => t.petId === petId && !t.isCompleted);
    if (activeTasks.length > 0) {
      const medTask = activeTasks.find((t) => t.category === 'MEDICINE');
      recommendations.push({
        category: 'DAILY_CARE_PLAN',
        title: medTask ? `Pending Medication: ${medTask.title}` : `Complete checklist: ${activeTasks[0].title}`,
        reason: `You have ${activeTasks.length} pending tasks remaining on today's Care Timeline checklist.`,
        priority: medTask ? 'HIGH' : 'MEDIUM',
        suggestedAction: 'Open the Daily Care Timeline checklist on your dashboard and tick task bubbles once completed.',
      });
    }

    // 7. WEEKLY SUMMARY
    const petReport = weeklyReports.find((r) => r.petId === petId);
    if (petReport) {
      recommendations.push({
        category: 'WEEKLY_SUMMARY',
        title: `Weekly Bloom Score: ${petReport.healthScore}%`,
        reason: `Report summary: ${petReport.summary}`,
        priority: 'LOW',
        suggestedAction: 'Review overall wellness analytics trends charts inside the Bloom Reports panel.',
      });
    }

    return recommendations;
  },
};
export default recommendationEngine;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePetStore } from '@/store/petStore';
import { useAuthStore } from '@/store/authStore';
import { useNotificationStore } from '@/store/notificationStore';
import { recommendationEngine } from '@/services/recommendationEngine';
import { PageWrapper } from '@/layouts/PageWrapper';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Badge } from '@/components/ui/Badge';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  Calendar,
  Utensils,
  Droplet,
  Footprints,
  HeartPulse,
  Sparkle,
  Bath,
  Sun
} from 'lucide-react';

type LogCategory = 'NUTRITION' | 'WATER' | 'EXERCISE' | 'HEALTH' | 'STOOL_URINE' | 'HYGIENE' | null;

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const addToast = useNotificationStore((s) => s.addToast);
  const { user } = useAuthStore();
  const {
    pets,
    activePetId,
    scheduleTasks,
    toggleScheduleTask,
    logs,
    addPetLog,
    updatePetLog,
    deletePetLog,
    inventory,
    reorderFood,
    reminders,
    completeReminder
  } = usePetStore();

  const activePet = pets.find((p) => p.id === activePetId) || pets[0];

  // Active quick log modal category
  const [activeModal, setActiveModal] = useState<LogCategory>(null);
  const [editingLogId, setEditingLogId] = useState<string | null>(null);

  // Form states for Quick Log modals
  const [foodName, setFoodName] = useState('Royal Canin Puppy Large');
  const [foodQty, setFoodQty] = useState('220');
  const [waterMl, setWaterMl] = useState('250');
  const [exerciseActivity, setExerciseActivity] = useState('Walk');
  const [exerciseDuration, setExerciseDuration] = useState('30');
  const [symptomText, setSymptomText] = useState('');
  const [symptomSeverity, setSymptomSeverity] = useState('Low');
  const [stoolConsistency, setStoolConsistency] = useState('Firm');
  const [stoolColor, setStoolColor] = useState('Brown');
  const [hygieneRoutine, setHygieneRoutine] = useState('Teeth Brushing');

  // Generate recommendations dynamically from engine
  const activeRecs = recommendationEngine.generateRecommendations(activePetId || '');
  const topPriorities = activeRecs
    .filter((r) => r.category !== 'WEEKLY_SUMMARY')
    .sort((a, b) => {
      const priorityOrder = { HIGH: 0, MEDIUM: 1, LOW: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    })
    .slice(0, 3);

  const mockInsights = activeRecs.map((rec) => ({
    title: rec.title,
    desc: `${rec.reason} Suggested Action: ${rec.suggestedAction}`,
    type: rec.priority === 'HIGH' ? ('warning' as const) : ('info' as const),
  }));

  // Rotate AI Insights mock state
  const [insightIndex, setInsightIndex] = useState(0);

  useEffect(() => {
    if (mockInsights.length === 0) return;
    const timer = setInterval(() => {
      setInsightIndex((prev) => (prev + 1) % mockInsights.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [mockInsights.length]);

  // Calculations for Schedule Completion %
  const activeTasks = scheduleTasks.filter((t) => t.petId === activePetId);
  const completedTasksCount = activeTasks.filter((t) => t.isCompleted).length;
  const totalTasksCount = activeTasks.length;
  const completionPercentage = totalTasksCount > 0 ? Math.round((completedTasksCount / totalTasksCount) * 100) : 0;

  // Trigger Confetti explosion when 100% tasks completed
  const [hasExploded, setHasExploded] = useState(false);
  useEffect(() => {
    if (completionPercentage === 100 && totalTasksCount > 0 && !hasExploded) {
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 }
      });
      setHasExploded(true);
      addToast({
        type: 'success',
        title: 'Bloom Milestone!',
        message: `${activePet?.name || 'Max'} is fully blooming today! 🌸`
      });
    } else if (completionPercentage < 100) {
      setHasExploded(false);
    }
  }, [completionPercentage, totalTasksCount, hasExploded, activePet?.name, addToast]);

  const activeInventory = inventory.find((inv) => inv.petId === activePetId) || inventory[0];
  const petReminders = reminders.filter((r) => r.petId === activePetId && r.status === 'PENDING');
  const petLogs = logs.filter((l) => l.petId === activePetId).slice(0, 5);

  // Form saving handlers
  const handleSaveLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePet) return;

    let payload: Record<string, any> = {};

    switch (activeModal) {
      case 'NUTRITION':
        payload = { foodName, qtyGrams: parseFloat(foodQty) || 0 };
        break;
      case 'WATER':
        payload = { amountMl: parseFloat(waterMl) || 0 };
        break;
      case 'EXERCISE':
        payload = { activity: exerciseActivity, durationMinutes: parseInt(exerciseDuration) || 0 };
        break;
      case 'HEALTH':
        if (!symptomText.trim()) return;
        payload = { symptom: symptomText, severity: symptomSeverity };
        setSymptomText('');
        break;
      case 'STOOL_URINE':
        payload = { consistency: stoolConsistency, color: stoolColor };
        break;
      case 'HYGIENE':
        payload = { routine: hygieneRoutine };
        break;
    }

    if (editingLogId) {
      updatePetLog(editingLogId, payload);
      addToast({ type: 'success', title: 'Log Updated', message: 'Activity log modified successfully.' });
      setEditingLogId(null);
    } else if (activeModal) {
      addPetLog(activeModal, payload);
      addToast({ type: 'success', title: 'Log Created', message: 'Activity log saved successfully.' });
    }

    setActiveModal(null);
  };

  const startEditLog = (log: any) => {
    setEditingLogId(log.id);
    setActiveModal(log.type);
    
    if (log.type === 'NUTRITION') {
      setFoodName(log.payload.foodName || '');
      setFoodQty(String(log.payload.qtyGrams || ''));
    } else if (log.type === 'WATER') {
      setWaterMl(String(log.payload.amountMl || ''));
    } else if (log.type === 'EXERCISE') {
      setExerciseActivity(log.payload.activity || 'Walk');
      setExerciseDuration(String(log.payload.durationMinutes || ''));
    } else if (log.type === 'HEALTH') {
      setSymptomText(log.payload.symptom || '');
      setSymptomSeverity(log.payload.severity || 'Low');
    } else if (log.type === 'STOOL_URINE') {
      setStoolConsistency(log.payload.consistency || 'Firm');
      setStoolColor(log.payload.color || 'Brown');
    } else if (log.type === 'HYGIENE') {
      setHygieneRoutine(log.payload.routine || 'Teeth Brushing');
    }
  };

  const handleReorder = () => {
    if (activeInventory) {
      reorderFood(activeInventory.id);
      addToast({
        type: 'success',
        title: 'Inventory Replenished',
        message: `Successfully reordered ${activeInventory.foodName}. Standard delivery in progress.`
      });
    }
  };

  const handleCompleteReminder = (id: string, title: string) => {
    completeReminder(id);
    addToast({
      type: 'success',
      title: 'Reminder Met',
      message: `Completed task: ${title}`
    });
  };

  const quickLogCards = [
    { id: 'NUTRITION' as const, label: 'Meal Prep', icon: <Utensils size={18} />, color: 'bg-pastel-nutrition/10 text-orange-500 border-orange-100' },
    { id: 'WATER' as const, label: 'Water Bowl', icon: <Droplet size={18} />, color: 'bg-blue-500/10 text-blue-500 border-blue-100' },
    { id: 'EXERCISE' as const, label: 'Log Walk', icon: <Footprints size={18} />, color: 'bg-pastel-exercise/10 text-emerald-600 border-emerald-100' },
    { id: 'HEALTH' as const, label: 'Flag Symptom', icon: <HeartPulse size={18} />, color: 'bg-red-500/10 text-red-500 border-red-100' },
    { id: 'STOOL_URINE' as const, label: 'Potty Check', icon: <Sparkle size={18} />, color: 'bg-amber-500/10 text-amber-600 border-amber-100' },
    { id: 'HYGIENE' as const, label: 'Groom routine', icon: <Bath size={18} />, color: 'bg-pastel-hygiene/10 text-purple-500 border-purple-100' },
  ];

  return (
    <PageWrapper
      title="Dashboard"
      subtitle={`Daily care telemetry, schedules, and active observations for ${activePet?.name || 'Max'}`}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* COLUMN 1 & 2 (MAIN WORKSPACE DETAILS) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* 1. AI CONCIERGE HERO */}
          <Card variant="glass" className="relative overflow-hidden border-bloom-rose/15 bg-gradient-to-br from-bloom-rose/5 to-transparent dark:from-bloom-rose/10">
            <div className="flex gap-4 items-start">
              <div className="p-3 bg-bloom-rose/15 text-bloom-rose rounded-2xl">
                <Sparkles size={24} className="animate-pulse" />
              </div>
              <div className="flex-grow">
                <h3 className="text-lg font-bold font-display text-deep-charcoal dark:text-frosted-pearl">
                  🌸 Good Morning, {user?.name.split(' ')[0] ?? 'Sarah'}!
                </h3>
                
                {/* Priorities Bullet List */}
                <div className="mt-4 flex flex-col gap-2 border-l-2 border-bloom-rose/30 pl-3">
                  {topPriorities.length > 0 ? (
                    topPriorities.map((rec, idx) => (
                      <div key={idx} className="text-xs text-warm-slate dark:text-frosted-pearl/80 flex items-center gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full ${rec.priority === 'HIGH' ? 'bg-red-500 animate-pulse' : 'bg-bloom-rose'}`} />
                        <span><strong>{rec.title}</strong>: {rec.suggestedAction}</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-warm-slate dark:text-frosted-pearl/80 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span>All priorities met! {activePet?.name || 'Max'} is blooming beautifully today.</span>
                    </div>
                  )}
                </div>

                {/* Primary Action Buttons */}
                <div className="flex gap-3 mt-5 flex-wrap">
                  <Button variant="primary" size="sm" onClick={() => addToast({ type: 'info', title: 'Schedule Triggered', message: 'Starting routine checklist timeline.' })} className="cursor-pointer">
                    Start Today's Routine
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => addToast({ type: 'info', title: 'Planning Engine', message: 'AI is generating breed meal targets.' })}>
                    Generate Meal Plan
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => navigate('/reports')} className="text-bloom-rose font-semibold">
                    Health Summary
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => navigate('/chat')} className="flex items-center gap-1.5">
                    Ask AI
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* 2. DAILY TIMELINE CHECKLIST */}
          <Card variant="default">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold font-display text-deep-charcoal dark:text-frosted-pearl flex items-center gap-2">
                <Calendar size={18} className="text-warm-slate" />
                <span>Today's Care Timeline</span>
              </h3>
              <Badge variant={completionPercentage === 100 ? 'success' : 'info'}>
                {completionPercentage}% Done
              </Badge>
            </div>
            
            {activeTasks.length > 0 ? (
              <div className="flex flex-col gap-4 border-l border-deep-charcoal/5 pl-4 ml-2 dark:border-white/5 py-1">
                {activeTasks.map((task) => (
                  <div key={task.id} className="relative flex items-center justify-between">
                    {/* Stepper Dot */}
                    <div
                      onClick={() => toggleScheduleTask(task.id)}
                      className={`absolute -left-[22px] top-1.5 w-3 h-3 rounded-full border-2 cursor-pointer transition-all duration-200
                        ${task.isCompleted 
                          ? 'bg-emerald-500 border-emerald-500 scale-110 shadow-sm' 
                          : 'bg-pure-linen border-warm-slate/40 dark:bg-slate-velvet'
                        }
                      `}
                    />
                    
                    <div>
                      <h4
                        onClick={() => toggleScheduleTask(task.id)}
                        className={`text-sm font-semibold cursor-pointer transition-all
                          ${task.isCompleted 
                            ? 'text-warm-slate line-through opacity-50' 
                            : 'text-deep-charcoal dark:text-frosted-pearl hover:text-bloom-rose'
                          }
                        `}
                      >
                        {task.title}
                      </h4>
                      <p className="text-xxs text-warm-slate dark:text-frosted-pearl/60 mt-0.5">
                        {task.timeSlot} • {task.category}
                      </p>
                    </div>

                    <button
                      onClick={() => toggleScheduleTask(task.id)}
                      className="text-xxs text-warm-slate hover:text-bloom-rose font-bold cursor-pointer"
                    >
                      {task.isCompleted ? 'Undo' : 'Mark Done'}
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-warm-slate text-center py-4 dark:text-frosted-pearl/60">
                No scheduled tasks logged for this pet today.
              </p>
            )}
          </Card>

          {/* 3. QUICK LOG ACTION TILES */}
          <div>
            <h3 className="text-sm font-bold font-display text-warm-slate uppercase tracking-wider mb-3 dark:text-frosted-pearl/80">
              Quick Telemetry Log
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {quickLogCards.map((tile) => (
                <div
                  key={tile.id}
                  onClick={() => setActiveModal(tile.id)}
                  className={`flex flex-col items-center justify-center p-4 border rounded-2xl cursor-pointer hover:-translate-y-1 transition-all select-none bg-pure-linen dark:bg-slate-velvet/50 dark:border-white/5 shadow-xs`}
                >
                  <div className={`p-2.5 rounded-xl border mb-2.5 ${tile.color}`}>
                    {tile.icon}
                  </div>
                  <span className="text-xs font-semibold text-deep-charcoal dark:text-frosted-pearl">
                    {tile.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 9. RECENT ACTIVITY LIST */}
          <Card variant="default">
            <h3 className="text-base font-bold font-display text-deep-charcoal dark:text-frosted-pearl mb-4">
              Daily Timeline logs
            </h3>
            {petLogs.length > 0 ? (
              <div className="flex flex-col gap-4">
                {petLogs.map((log) => {
                  let logIcon = <Sparkles size={16} />;
                  let logColor = 'bg-pastel-nutrition/10 text-orange-500 border-orange-100';
                  let logTitle = `${log.type.toLowerCase().replace('_', ' ')} logged`;
                  let logDesc = '';

                  if (log.type === 'NUTRITION') {
                    logIcon = <Utensils size={16} />;
                    logColor = 'bg-pastel-nutrition/10 text-orange-500 border-orange-100';
                    logTitle = `Meal: ${log.payload.foodName as string}`;
                    logDesc = `${log.payload.qtyGrams as number}g served`;
                  } else if (log.type === 'WATER') {
                    logIcon = <Droplet size={16} />;
                    logColor = 'bg-blue-500/10 text-blue-500 border-blue-100';
                    logTitle = 'Water Bowl';
                    logDesc = `${log.payload.amountMl as number}ml consumed`;
                  } else if (log.type === 'EXERCISE') {
                    logIcon = <Footprints size={16} />;
                    logColor = 'bg-pastel-exercise/10 text-emerald-600 border-emerald-100';
                    logTitle = `${log.payload.activity as string} session`;
                    logDesc = `${log.payload.durationMinutes as number} mins active`;
                  } else if (log.type === 'HEALTH') {
                    logIcon = <HeartPulse size={16} />;
                    logColor = 'bg-red-500/10 text-red-500 border-red-100';
                    logTitle = log.payload.symptom ? `Symptom: ${log.payload.symptom as string}` : 'Health update';
                    logDesc = log.payload.severity ? `Severity: ${log.payload.severity as string}` : '';
                  } else if (log.type === 'STOOL_URINE') {
                    logIcon = <Sparkle size={16} />;
                    logColor = 'bg-amber-500/10 text-amber-600 border-amber-100';
                    logTitle = 'Potty Check';
                    logDesc = `Stool: ${log.payload.consistency as string}`;
                  } else if (log.type === 'HYGIENE') {
                    logIcon = <Bath size={16} />;
                    logColor = 'bg-pastel-hygiene/10 text-purple-500 border-purple-100';
                    logTitle = log.payload.routine as string;
                    logDesc = 'Grooming routine';
                  }

                  return (
                    <div key={log.id} className="flex justify-between items-center text-xs border-b border-deep-charcoal/5 pb-3 last:border-none last:pb-0 dark:border-white/5">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl border ${logColor}`}>
                          {logIcon}
                        </div>
                        <div>
                          <span className="font-semibold text-deep-charcoal dark:text-frosted-pearl">
                            {logTitle}
                          </span>
                          <p className="text-xxs text-warm-slate dark:text-frosted-pearl/60 mt-0.5">
                            {logDesc} • {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>

                      {/* Timeline Shortcuts */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEditLog(log)}
                          className="text-xxs text-warm-slate hover:text-bloom-rose font-bold cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            deletePetLog(log.id);
                            addToast({ type: 'warning', title: 'Log Deleted', message: 'Log has been removed.' });
                          }}
                          className="text-xxs text-warm-slate hover:text-red-500 font-bold cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-warm-slate text-center py-4 dark:text-frosted-pearl/60">
                No activity logs recorded today yet.
              </p>
            )}
          </Card>

        </div>

        {/* COLUMN 3 (SIDEBAR ANALYTICS / STATUS TELEMETRIES) */}
        <div className="flex flex-col gap-6">

          {/* 7. BLOOM PROGRESS WIDGET */}
          <Card variant="default" className="text-center flex flex-col items-center justify-center p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-mint-wellness/10 rounded-full blur-2xl" />
            
            <h4 className="text-sm font-bold font-display text-deep-charcoal dark:text-frosted-pearl mb-4">
              Bloom Progress
            </h4>
            
            {/* Styled Radial Progress Ring */}
            <div className="relative w-28 h-28 flex items-center justify-center rounded-full border-4 border-bloom-rose shadow-sm mb-4">
              <span className="text-3xl font-extrabold text-deep-charcoal dark:text-frosted-pearl font-display">
                {completionPercentage}%
              </span>
            </div>

            {completionPercentage === 100 ? (
              <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-xs font-semibold text-emerald-800 animate-spring-bounce dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30">
                🌸 {activePet?.name || 'Max'} is blooming today! <br />
                All routine care met. 🎉
              </div>
            ) : (
              <p className="text-xs text-warm-slate dark:text-frosted-pearl/70 leading-relaxed max-w-[200px]">
                Complete remaining scheduled tasks to help {activePet?.name || 'your pet'} bloom.
              </p>
            )}
          </Card>

          {/* 4. ROTATING AI INSIGHT CARD */}
          {mockInsights.length > 0 && mockInsights[insightIndex] && (
            <Card variant="glass" className={`border-l-4 ${mockInsights[insightIndex].type === 'warning' ? 'border-l-red-500' : 'border-l-bloom-rose'}`}>
              <div className="flex gap-3 items-start">
                <Sparkles size={16} className={`${mockInsights[insightIndex].type === 'warning' ? 'text-red-500 animate-pulse' : 'text-bloom-rose'} mt-0.5 flex-shrink-0`} />
                <div>
                  <h4 className="text-xs font-bold font-display text-deep-charcoal dark:text-frosted-pearl">
                    {mockInsights[insightIndex].title}
                  </h4>
                  <p className="text-xs text-warm-slate dark:text-frosted-pearl/70 mt-1 leading-relaxed">
                    {mockInsights[insightIndex].desc}
                  </p>
                </div>
              </div>
            </Card>
          )}

          {/* 5. FOOD INVENTORY STATUS */}
          {activeInventory && (
            <Card variant="default">
              <h4 className="text-sm font-bold font-display mb-1 text-deep-charcoal dark:text-frosted-pearl">
                Food Stock
              </h4>
              <p className="text-xxs text-warm-slate dark:text-frosted-pearl/60 mb-3">
                {activeInventory.foodName}
              </p>

              <ProgressBar value={activeInventory.currentQty} max={10.0} color="primary" height="sm" />

              <div className="flex justify-between items-center text-xs mt-3">
                <div className="flex flex-col">
                  <span className="font-semibold text-deep-charcoal dark:text-frosted-pearl">
                    {activeInventory.currentQty} kg remaining
                  </span>
                  <span className="text-xxs text-warm-slate dark:text-frosted-pearl/60">
                    Est. {Math.round(activeInventory.currentQty / activeInventory.dailyConsumption)} days left
                  </span>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleReorder}
                  className="text-bloom-rose font-bold p-0 min-h-0 cursor-pointer"
                >
                  Reorder
                </Button>
              </div>
            </Card>
          )}

          {/* 6. MOCK WEATHER CARD */}
          <Card variant="default">
            <h4 className="text-sm font-bold font-display mb-3 text-deep-charcoal dark:text-frosted-pearl">
              Weather Widget
            </h4>
            <div className="flex items-center gap-3">
              <Sun className="text-amber-500" size={32} />
              <div>
                <span className="text-sm font-bold text-deep-charcoal dark:text-frosted-pearl">
                  74°F • Sunny
                </span>
                <p className="text-xxs text-warm-slate dark:text-frosted-pearl/60 mt-0.5">
                  UV Index: 4 (Moderate)
                </p>
              </div>
            </div>
            <div className="mt-3 p-3 bg-warm-cream/50 rounded-xl text-xxs text-warm-slate dark:bg-white/5 dark:text-frosted-pearl/70 leading-relaxed">
              <strong>Walk guide:</strong> Walk conditions are comfortable. UV index is safe, standard activity lengths apply.
            </div>
          </Card>

          {/* 8. UPCOMING REMINDERS */}
          <Card variant="default">
            <h4 className="text-sm font-bold font-display mb-3 text-deep-charcoal dark:text-frosted-pearl">
              Upcoming Reminders
            </h4>
            {petReminders.length > 0 ? (
              <div className="flex flex-col gap-3">
                {petReminders.map((rem) => (
                  <div key={rem.id} className="flex items-start justify-between bg-warm-cream/30 p-2.5 rounded-xl border border-deep-charcoal/5 dark:bg-white/5 dark:border-white/5">
                    <div>
                      <span className="text-xs font-semibold text-deep-charcoal dark:text-frosted-pearl">
                        {rem.title}
                      </span>
                      <p className="text-xxs text-warm-slate dark:text-frosted-pearl/60 mt-0.5">
                        Due: {new Date(rem.dueTime).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={() => handleCompleteReminder(rem.id, rem.title)}
                      className="p-1 text-xxs text-bloom-rose font-bold hover:underline cursor-pointer"
                    >
                      Meds Done
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-warm-slate text-center py-2 dark:text-frosted-pearl/60">
                No upcoming pending reminders.
              </p>
            )}
          </Card>

        </div>

      </div>

      {/* QUICK LOG ACCORDION MODAL OVERLAYS */}
      <Modal
        isOpen={activeModal !== null}
        onClose={() => setActiveModal(null)}
        title={`Log ${activeModal?.replace('_', ' ')}`}
      >
        <form onSubmit={handleSaveLog} className="flex flex-col gap-4">
          
          {activeModal === 'NUTRITION' && (
            <>
              <Input
                label="Food Name"
                value={foodName}
                onChange={(e) => setFoodName(e.target.value)}
                required
              />
              <Input
                label="Quantity (grams)"
                type="number"
                value={foodQty}
                onChange={(e) => setFoodQty(e.target.value)}
                required
              />
            </>
          )}

          {activeModal === 'WATER' && (
            <Input
              label="Water Amount (ml)"
              type="number"
              value={waterMl}
              onChange={(e) => setWaterMl(e.target.value)}
              required
            />
          )}

          {activeModal === 'EXERCISE' && (
            <>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-warm-slate dark:text-frosted-pearl/80">
                  Activity Type
                </label>
                <select
                  value={exerciseActivity}
                  onChange={(e) => setExerciseActivity(e.target.value)}
                  className="px-4 py-2 rounded-xl border border-warm-slate/25 bg-pure-linen text-deep-charcoal focus:ring-1 focus:ring-bloom-rose dark:bg-slate-velvet/50 dark:text-frosted-pearl dark:border-white/10 outline-none"
                >
                  <option>Walk</option>
                  <option>Running</option>
                  <option>Playtime</option>
                </select>
              </div>
              <Input
                label="Duration (minutes)"
                type="number"
                value={exerciseDuration}
                onChange={(e) => setExerciseDuration(e.target.value)}
                required
              />
            </>
          )}

          {activeModal === 'HEALTH' && (
            <>
              <Input
                label="Observed Symptom"
                value={symptomText}
                onChange={(e) => setSymptomText(e.target.value)}
                required
                placeholder="e.g. Mild scratching, left ear itching"
              />
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-warm-slate dark:text-frosted-pearl/80">
                  Severity Level
                </label>
                <select
                  value={symptomSeverity}
                  onChange={(e) => setSymptomSeverity(e.target.value)}
                  className="px-4 py-2 rounded-xl border border-warm-slate/25 bg-pure-linen text-deep-charcoal focus:ring-1 focus:ring-bloom-rose dark:bg-slate-velvet/50 dark:text-frosted-pearl dark:border-white/10 outline-none"
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>Critical</option>
                </select>
              </div>
            </>
          )}

          {activeModal === 'STOOL_URINE' && (
            <>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-warm-slate dark:text-frosted-pearl/80">
                  Stool Consistency
                </label>
                <select
                  value={stoolConsistency}
                  onChange={(e) => setStoolConsistency(e.target.value)}
                  className="px-4 py-2 rounded-xl border border-warm-slate/25 bg-pure-linen text-deep-charcoal focus:ring-1 focus:ring-bloom-rose dark:bg-slate-velvet/50 dark:text-frosted-pearl dark:border-white/10 outline-none"
                >
                  <option>Firm</option>
                  <option>Soft</option>
                  <option>Liquid</option>
                </select>
              </div>
              <Input
                label="Color description"
                value={stoolColor}
                onChange={(e) => setStoolColor(e.target.value)}
                required
              />
            </>
          )}

          {activeModal === 'HYGIENE' && (
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-warm-slate dark:text-frosted-pearl/80">
                Routine Category
              </label>
              <select
                value={hygieneRoutine}
                onChange={(e) => setHygieneRoutine(e.target.value)}
                className="px-4 py-2 rounded-xl border border-warm-slate/25 bg-pure-linen text-deep-charcoal focus:ring-1 focus:ring-bloom-rose dark:bg-slate-velvet/50 dark:text-frosted-pearl dark:border-white/10 outline-none"
              >
                <option>Teeth Brushing</option>
                <option>Coat Bath</option>
                <option>Claw Trimming</option>
                <option>Paw Cleaning</option>
              </select>
            </div>
          )}

          <div className="flex justify-end gap-3 mt-4">
            <Button variant="ghost" type="button" onClick={() => setActiveModal(null)} className="cursor-pointer">
              Cancel
            </Button>
            <Button variant="primary" type="submit" className="cursor-pointer">
              Save Log
            </Button>
          </div>
        </form>
      </Modal>

    </PageWrapper>
  );
};
export default DashboardPage;

import React, { useState } from 'react';
import { usePetStore } from '@/store/petStore';
import { useNotificationStore } from '@/store/notificationStore';
import { PageWrapper } from '@/layouts/PageWrapper';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { EmptyState } from '@/components/ui/EmptyState';
import { Badge } from '@/components/ui/Badge';
import { Footprints, Plus, Trash2, Edit2, Search } from 'lucide-react';
import type { PetLog } from '@/utils/mockData';

export const ExercisePage: React.FC = () => {
  const addToast = useNotificationStore((s) => s.addToast);
  const {
    activePetId,
    pets,
    logs,
    addPetLog,
    updatePetLog,
    deletePetLog
  } = usePetStore();

  const activePet = pets.find((p) => p.id === activePetId) || pets[0];

  // Search and Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  // Modals state
  const [modalMode, setModalMode] = useState<'ADD' | 'EDIT' | 'DELETE' | null>(null);
  const [selectedLog, setSelectedLog] = useState<PetLog | null>(null);

  // Form states
  const [activity, setActivity] = useState('Walk');
  const [duration, setDuration] = useState('30');
  const [distance, setDistance] = useState('1.5');
  const [intensity, setIntensity] = useState('Medium');
  const [logTime, setLogTime] = useState(new Date().toTimeString().slice(0, 5));
  const [notes, setNotes] = useState('');

  // Filtered Logs
  const activeLogs = logs.filter((log) => {
    if (log.petId !== activePetId) return false;
    if (log.type !== 'EXERCISE') return false;

    // Filter by date
    if (dateFilter && log.timestamp.split('T')[0] !== dateFilter) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const noteMatch = (log.payload.notes as string || '').toLowerCase().includes(q);
      const activityMatch = (log.payload.activity as string || '').toLowerCase().includes(q);
      const intensityMatch = (log.payload.intensity as string || '').toLowerCase().includes(q);
      return noteMatch || activityMatch || intensityMatch;
    }

    return true;
  });

  // Calculate total minutes today
  const todayStr = new Date().toISOString().split('T')[0];
  const exerciseLogsToday = logs.filter(
    (l) => l.petId === activePetId && l.type === 'EXERCISE' && l.timestamp.startsWith(todayStr)
  );
  const totalMinsToday = exerciseLogsToday.reduce((sum, l) => sum + ((l.payload.durationMinutes as number) || 0), 0);
  const exerciseGoalMins = 45;

  const openAddModal = () => {
    setSelectedLog(null);
    setActivity('Walk');
    setDuration('30');
    setDistance('1.5');
    setIntensity('Medium');
    setLogTime(new Date().toTimeString().slice(0, 5));
    setNotes('');
    setModalMode('ADD');
  };

  const openEditModal = (log: PetLog) => {
    setSelectedLog(log);
    setLogTime(new Date(log.timestamp).toTimeString().slice(0, 5));
    setNotes((log.payload.notes as string) || '');
    setActivity((log.payload.activity as string) || 'Walk');
    setDuration(String(log.payload.durationMinutes || ''));
    setDistance(String(log.payload.distanceKm || ''));
    setIntensity((log.payload.intensity as string) || 'Medium');
    setModalMode('EDIT');
  };

  const handleSaveLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!duration) return;

    const payload = {
      activity,
      durationMinutes: parseInt(duration) || 0,
      distanceKm: parseFloat(distance) || 0,
      intensity,
      notes
    };

    if (modalMode === 'ADD') {
      addPetLog('EXERCISE', payload);
      addToast({
        type: 'success',
        title: 'Activity Logged',
        message: `Successfully logged ${duration}m of ${activity}.`
      });
    } else if (modalMode === 'EDIT' && selectedLog) {
      updatePetLog(selectedLog.id, payload);
      addToast({
        type: 'success',
        title: 'Activity Log Updated',
        message: 'Your modifications have been saved.'
      });
    }

    setModalMode(null);
  };

  const handleDeleteConfirm = () => {
    if (selectedLog) {
      deletePetLog(selectedLog.id);
      addToast({
        type: 'warning',
        title: 'Log Deleted',
        message: 'The selected exercise entry has been removed.'
      });
      setModalMode(null);
    }
  };

  return (
    <PageWrapper
      title="Exercise & Workouts"
      subtitle={`Track walks, runs, duration lengths, intensity metrics, and weather-aware suggestions for ${activePet?.name || 'Max'}`}
      action={
        <Button variant="primary" onClick={openAddModal} className="flex items-center gap-1.5 cursor-pointer">
          <Plus size={16} />
          <span>Log Activity</span>
        </Button>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: ACTIVITY TIMELINE HISTORY */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* SEARCH & FILTERS PANEL */}
          <Card variant="default" className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative w-full sm:max-w-xs">
              <Input
                placeholder="Search activity, intensity or notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 py-2"
              />
              <Search size={14} className="absolute left-3 top-3 text-warm-slate" />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs text-warm-slate hidden sm:inline whitespace-nowrap">Filter Date:</span>
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-3 py-2 text-xs rounded-xl border border-warm-slate/25 bg-pure-linen text-deep-charcoal dark:bg-slate-velvet/50 dark:text-frosted-pearl dark:border-white/10 outline-none w-full sm:w-auto"
              />
              {dateFilter && (
                <button
                  onClick={() => setDateFilter('')}
                  className="text-xs text-bloom-rose hover:underline"
                >
                  Clear
                </button>
              )}
            </div>
          </Card>

          {/* HISTORICAL LOGS TIMELINE LIST */}
          <div className="flex flex-col gap-4">
            {activeLogs.length > 0 ? (
              activeLogs.map((log) => (
                <Card key={log.id} variant="default" className="flex justify-between items-center">
                  <div className="flex gap-4 items-start">
                    <div className="p-3.5 bg-pastel-exercise/10 text-emerald-600 border border-emerald-100 rounded-2xl">
                      <Footprints size={18} />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-deep-charcoal dark:text-frosted-pearl font-display leading-tight">
                        {log.payload.activity as string} • {log.payload.durationMinutes as number} minutes
                      </h4>
                      <p className="text-xxs text-warm-slate dark:text-frosted-pearl/60 mt-0.5">
                        Logged at {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        {log.payload.distanceKm ? ` • Distance: ${log.payload.distanceKm as number} km` : ''}
                        {log.payload.intensity ? ` • Intensity: ${log.payload.intensity as string}` : ''}
                      </p>
                      {log.payload.notes ? (
                        <p className="text-xs text-warm-slate dark:text-frosted-pearl/80 italic mt-2">
                          "{log.payload.notes as string}"
                        </p>
                      ) : null}
                    </div>
                  </div>

                  {/* Actions Shortcuts */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => openEditModal(log)}
                      title="Edit Log"
                      className="cursor-pointer"
                    >
                      <Edit2 size={13} />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => { setSelectedLog(log); setModalMode('DELETE'); }}
                      title="Delete Log"
                      className="hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/30 cursor-pointer"
                    >
                      <Trash2 size={13} />
                    </Button>
                  </div>
                </Card>
              ))
            ) : (
              <EmptyState
                icon={<Footprints size={40} />}
                title="No Exercise Logged Today"
                description="Keep your pet active! Log walk, run, and outdoor games milestones."
                action={<Button variant="primary" onClick={openAddModal}>Log Walk</Button>}
              />
            )}
          </div>

        </div>

        {/* RIGHT COLUMN: WORKOUT STATS & PROGRESS */}
        <div className="flex flex-col gap-6">
          
          {/* DAILY TARGET PROGRESS */}
          <Card variant="default">
            <h3 className="text-sm font-bold font-display text-deep-charcoal dark:text-frosted-pearl mb-1">
              Workout Progress
            </h3>
            <p className="text-xxs text-warm-slate dark:text-frosted-pearl/60 mb-4">
              Daily active target: {exerciseGoalMins} mins
            </p>

            <ProgressBar value={totalMinsToday} max={exerciseGoalMins} color="primary" height="sm" />

            <div className="flex justify-between items-center text-xs mt-3">
              <span className="font-semibold text-deep-charcoal dark:text-frosted-pearl">
                {totalMinsToday} mins active today
              </span>
              <Badge variant={totalMinsToday >= exerciseGoalMins ? 'success' : 'info'}>
                {Math.round((totalMinsToday / exerciseGoalMins) * 100)}% Met
              </Badge>
            </div>
          </Card>

          <Card variant="glass" className="border-l-4 border-l-bloom-rose">
            <h4 className="text-xs font-bold font-display mb-1">Weather Walk Alert</h4>
            <p className="text-xs text-warm-slate dark:text-frosted-pearl/70 leading-relaxed">
              Standard temperatures. Standard walking conditions apply. Feel free to extend outdoor playtime.
            </p>
          </Card>
        </div>

      </div>

      {/* CREATE & EDIT EXERCISE MODAL */}
      <Modal
        isOpen={modalMode === 'ADD' || modalMode === 'EDIT'}
        onClose={() => setModalMode(null)}
        title={modalMode === 'ADD' ? 'Log Daily Workout' : 'Modify Activity Log'}
      >
        <form onSubmit={handleSaveLog} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-warm-slate dark:text-frosted-pearl/80">
              Activity Type
            </label>
            <select
              value={activity}
              onChange={(e) => setActivity(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-warm-slate/25 bg-pure-linen text-deep-charcoal dark:bg-slate-velvet/50 dark:text-frosted-pearl dark:border-white/10 outline-none"
            >
              <option>Walk</option>
              <option>Running</option>
              <option>Playtime</option>
              <option>Training Session</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Duration (minutes)"
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              required
              placeholder="30"
            />
            <Input
              label="Distance (km)"
              type="number"
              step="0.1"
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
              placeholder="1.5"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-warm-slate dark:text-frosted-pearl/80">
              Intensity level
            </label>
            <select
              value={intensity}
              onChange={(e) => setIntensity(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-warm-slate/25 bg-pure-linen text-deep-charcoal dark:bg-slate-velvet/50 dark:text-frosted-pearl dark:border-white/10 outline-none"
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Time"
              type="time"
              value={logTime}
              onChange={(e) => setLogTime(e.target.value)}
              required
            />
          </div>

          <Input
            label="Activity Notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add general symptoms, weather notes, etc..."
          />

          <div className="flex justify-end gap-3 mt-4">
            <Button variant="ghost" type="button" onClick={() => setModalMode(null)} className="cursor-pointer">
              Cancel
            </Button>
            <Button variant="primary" type="submit" className="cursor-pointer">
              Save Log
            </Button>
          </div>
        </form>
      </Modal>

      {/* DELETE WARNING CONFIRMATION MODAL */}
      <Modal
        isOpen={modalMode === 'DELETE'}
        onClose={() => setModalMode(null)}
        title="Confirm Log Removal"
      >
        <div className="flex flex-col gap-4">
          <p className="text-xs text-warm-slate leading-relaxed dark:text-frosted-pearl/70">
            Are you sure you want to delete this activity log? This cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setModalMode(null)} className="cursor-pointer">
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDeleteConfirm} className="cursor-pointer">
              Delete Log
            </Button>
          </div>
        </div>
      </Modal>

    </PageWrapper>
  );
};
export default ExercisePage;

import React, { useState } from 'react';
import { usePetStore } from '@/store/petStore';
import { useNotificationStore } from '@/store/notificationStore';
import { PageWrapper } from '@/layouts/PageWrapper';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { EmptyState } from '@/components/ui/EmptyState';
import { Bath, Plus, Trash2, Edit2, Search } from 'lucide-react';
import type { PetLog } from '@/utils/mockData';

export const HygienePage: React.FC = () => {
  const addToast = useNotificationStore((s) => s.addToast);
  const {
    activePetId,
    pets,
    logs,
    addPetLog,
    updatePetLog,
    deletePetLog,
    reminders
  } = usePetStore();

  const activePet = pets.find((p) => p.id === activePetId) || pets[0];

  // Search and Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  // Modals state
  const [modalMode, setModalMode] = useState<'ADD' | 'EDIT' | 'DELETE' | null>(null);
  const [selectedLog, setSelectedLog] = useState<PetLog | null>(null);

  // Form states
  const [routine, setRoutine] = useState('Teeth Brushing');
  const [logTime, setLogTime] = useState(new Date().toTimeString().slice(0, 5));
  const [notes, setNotes] = useState('');

  // Filtered Logs
  const activeLogs = logs.filter((log) => {
    if (log.petId !== activePetId) return false;
    if (log.type !== 'HYGIENE') return false;

    // Filter by date
    if (dateFilter && log.timestamp.split('T')[0] !== dateFilter) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const noteMatch = (log.payload.notes as string || '').toLowerCase().includes(q);
      const routineMatch = (log.payload.routine as string || '').toLowerCase().includes(q);
      return noteMatch || routineMatch;
    }

    return true;
  });

  const openAddModal = () => {
    setSelectedLog(null);
    setRoutine('Teeth Brushing');
    setLogTime(new Date().toTimeString().slice(0, 5));
    setNotes('');
    setModalMode('ADD');
  };

  const openEditModal = (log: PetLog) => {
    setSelectedLog(log);
    setLogTime(new Date(log.timestamp).toTimeString().slice(0, 5));
    setNotes((log.payload.notes as string) || '');
    setRoutine((log.payload.routine as string) || 'Teeth Brushing');
    setModalMode('EDIT');
  };

  const handleSaveLog = (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      routine,
      notes
    };

    if (modalMode === 'ADD') {
      addPetLog('HYGIENE', payload);
      addToast({
        type: 'success',
        title: 'Hygiene Event Logged',
        message: `Successfully completed: ${routine}.`
      });
    } else if (modalMode === 'EDIT' && selectedLog) {
      updatePetLog(selectedLog.id, payload);
      addToast({
        type: 'success',
        title: 'Log Updated',
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
        message: 'The selected hygiene record has been removed.'
      });
      setModalMode(null);
    }
  };

  const hygieneReminders = reminders.filter(
    (r) => r.petId === activePetId && r.type === 'HYGIENE' && r.status === 'PENDING'
  );

  return (
    <PageWrapper
      title="Grooming & Hygiene"
      subtitle={`Log claw clipping sessions, weekly baths, dental brushings, and hygiene schedules for ${activePet?.name || 'Max'}`}
      action={
        <Button variant="primary" onClick={openAddModal} className="flex items-center gap-1.5 cursor-pointer">
          <Plus size={16} />
          <span>Log Hygiene</span>
        </Button>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: ACTIVITY HISTORY */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* SEARCH & FILTERS PANEL */}
          <Card variant="default" className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative w-full sm:max-w-xs">
              <Input
                placeholder="Search hygiene routines or notes..."
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
                    <div className="p-3.5 bg-pastel-hygiene/10 text-purple-500 border border-purple-100 rounded-2xl">
                      <Bath size={18} />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-deep-charcoal dark:text-frosted-pearl font-display leading-tight">
                        {log.payload.routine as string}
                      </h4>
                      <p className="text-xxs text-warm-slate dark:text-frosted-pearl/60 mt-0.5">
                        Logged at {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
                icon={<Bath size={40} />}
                title="Fresh & Clean!"
                description="Keep track of regular hygiene! Log brushing, bathing, or claw trim tasks now."
                action={<Button variant="primary" onClick={openAddModal}>Log Hygiene</Button>}
              />
            )}
          </div>

        </div>

        {/* RIGHT COLUMN: RECOMMENDED SCHEDULES */}
        <div className="flex flex-col gap-6">
          <Card variant="default">
            <h3 className="text-sm font-bold font-display text-deep-charcoal dark:text-frosted-pearl mb-4">
              Grooming Reminders
            </h3>
            {hygieneReminders.length > 0 ? (
              <div className="flex flex-col gap-3">
                {hygieneReminders.map((rem) => (
                  <div key={rem.id} className="text-xs p-3 bg-warm-cream/50 rounded-xl dark:bg-white/5 border border-deep-charcoal/5 dark:border-white/5">
                    <span className="font-semibold text-deep-charcoal dark:text-frosted-pearl">
                      {rem.title}
                    </span>
                    <p className="text-xxs text-warm-slate dark:text-frosted-pearl/60 mt-0.5">
                      Due date: {new Date(rem.dueTime).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-3 text-xs text-warm-slate dark:text-frosted-pearl/60">
                <div className="p-3 bg-warm-cream/30 rounded-xl dark:bg-white/5">
                  <span className="font-semibold">Nail Trimming</span>
                  <p className="text-xxs mt-0.5">Recommended: Every 3 weeks</p>
                </div>
                <div className="p-3 bg-warm-cream/30 rounded-xl dark:bg-white/5">
                  <span className="font-semibold">Teeth Brushing</span>
                  <p className="text-xxs mt-0.5">Recommended: Daily / 3 times a week</p>
                </div>
              </div>
            )}
          </Card>
        </div>

      </div>

      {/* CREATE & EDIT HYGIENE MODAL */}
      <Modal
        isOpen={modalMode === 'ADD' || modalMode === 'EDIT'}
        onClose={() => setModalMode(null)}
        title={modalMode === 'ADD' ? 'Log Daily Hygiene' : 'Modify Activity Log'}
      >
        <form onSubmit={handleSaveLog} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-warm-slate dark:text-frosted-pearl/80">
              Routine Task
            </label>
            <select
              value={routine}
              onChange={(e) => setRoutine(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-warm-slate/25 bg-pure-linen text-deep-charcoal dark:bg-slate-velvet/50 dark:text-frosted-pearl dark:border-white/10 outline-none"
            >
              <option>Teeth Brushing</option>
              <option>Coat Bath</option>
              <option>Claw Trimming</option>
              <option>Paw Cleaning</option>
              <option>Ear Cleaning</option>
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
            placeholder="Add general notes on symptoms or reactions..."
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
export default HygienePage;

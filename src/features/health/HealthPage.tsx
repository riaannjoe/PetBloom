import React, { useState } from 'react';
import { usePetStore } from '@/store/petStore';
import { useNotificationStore } from '@/store/notificationStore';
import { PageWrapper } from '@/layouts/PageWrapper';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { EmptyState } from '@/components/ui/EmptyState';
import { HeartPulse, ShieldAlert, Plus, Trash2, Edit2, Search } from 'lucide-react';
import type { PetLog } from '@/utils/mockData';

type LogType = 'HEALTH' | 'STOOL_URINE';

export const HealthPage: React.FC = () => {
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

  // Active view tab: HEALTH or STOOL_URINE
  const [activeTab, setActiveTab] = useState<LogType>('HEALTH');

  // Search and Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  // Modals state
  const [modalMode, setModalMode] = useState<'ADD' | 'EDIT' | 'DELETE' | null>(null);
  const [selectedLog, setSelectedLog] = useState<PetLog | null>(null);

  // Form states
  const [symptom, setSymptom] = useState('');
  const [severity, setSeverity] = useState('Low');
  const [medicationName, setMedicationName] = useState('');
  const [medicationDosage, setMedicationDosage] = useState('');
  const [temperature, setTemperature] = useState('');
  const [stoolConsistency, setStoolConsistency] = useState('Firm');
  const [urineFrequency, setUrineFrequency] = useState('Normal');
  const [color, setColor] = useState('Brown');
  const [logTime, setLogTime] = useState(new Date().toTimeString().slice(0, 5));
  const [notes, setNotes] = useState('');

  // Filtered Logs
  const activeLogs = logs.filter((log) => {
    if (log.petId !== activePetId) return false;
    if (log.type !== activeTab) return false;

    // Filter by date
    if (dateFilter && log.timestamp.split('T')[0] !== dateFilter) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const noteMatch = (log.payload.notes as string || '').toLowerCase().includes(q);
      const symptomMatch = (log.payload.symptom as string || '').toLowerCase().includes(q);
      const medMatch = (log.payload.medicationName as string || '').toLowerCase().includes(q);
      const consistencyMatch = (log.payload.consistency as string || '').toLowerCase().includes(q);
      return noteMatch || symptomMatch || medMatch || consistencyMatch;
    }

    return true;
  });

  const openAddModal = () => {
    setSelectedLog(null);
    setSymptom('');
    setSeverity('Low');
    setMedicationName('');
    setMedicationDosage('');
    setTemperature('');
    setStoolConsistency('Firm');
    setUrineFrequency('Normal');
    setColor(activeTab === 'HEALTH' ? 'Low' : 'Brown');
    setLogTime(new Date().toTimeString().slice(0, 5));
    setNotes('');
    setModalMode('ADD');
  };

  const openEditModal = (log: PetLog) => {
    setSelectedLog(log);
    setLogTime(new Date(log.timestamp).toTimeString().slice(0, 5));
    setNotes((log.payload.notes as string) || '');

    if (log.type === 'HEALTH') {
      setSymptom((log.payload.symptom as string) || '');
      setSeverity((log.payload.severity as string) || 'Low');
      setMedicationName((log.payload.medicationName as string) || '');
      setMedicationDosage((log.payload.medicationDosage as string) || '');
      setTemperature(String(log.payload.temperature || ''));
    } else {
      setStoolConsistency((log.payload.consistency as string) || 'Firm');
      setUrineFrequency((log.payload.urineFrequency as string) || 'Normal');
      setColor((log.payload.color as string) || 'Brown');
    }

    setModalMode('EDIT');
  };

  const handleSaveLog = (e: React.FormEvent) => {
    e.preventDefault();

    if (activeTab === 'HEALTH') {
      if (!symptom && !medicationName) return;
      const payload = {
        symptom,
        severity,
        medicationName,
        medicationDosage,
        temperature: parseFloat(temperature) || undefined,
        notes
      };

      if (modalMode === 'ADD') {
        addPetLog('HEALTH', payload);
        addToast({
          type: 'success',
          title: 'Health Log Created',
          message: symptom ? `Logged symptom: ${symptom}` : 'Daily medication dosage logged.'
        });
      } else if (modalMode === 'EDIT' && selectedLog) {
        updatePetLog(selectedLog.id, payload);
        addToast({
          type: 'success',
          title: 'Health Log Updated',
          message: 'Changes saved successfully.'
        });
      }
    } else {
      const payload = {
        consistency: stoolConsistency,
        urineFrequency,
        color,
        notes
      };

      if (modalMode === 'ADD') {
        addPetLog('STOOL_URINE', payload);
        addToast({
          type: 'success',
          title: 'Potty Check Logged',
          message: `Stool consistency: ${stoolConsistency}.`
        });
      } else if (modalMode === 'EDIT' && selectedLog) {
        updatePetLog(selectedLog.id, payload);
        addToast({
          type: 'success',
          title: 'Potty Log Updated',
          message: 'Changes saved successfully.'
        });
      }
    }

    setModalMode(null);
  };

  const handleDeleteConfirm = () => {
    if (selectedLog) {
      deletePetLog(selectedLog.id);
      addToast({
        type: 'warning',
        title: 'Activity Log Deleted',
        message: 'The selected health file has been removed.'
      });
      setModalMode(null);
    }
  };

  const vaccineReminders = reminders.filter(
    (r) => r.petId === activePetId && r.type === 'VACCINATION' && r.status === 'PENDING'
  );

  return (
    <PageWrapper
      title="Health & Diagnostic logs"
      subtitle={`Track medical symptoms, medications, clinical vet indicators, and digestive patterns for ${activePet?.name || 'Max'}`}
      action={
        <Button variant="primary" onClick={openAddModal} className="flex items-center gap-1.5 cursor-pointer">
          <Plus size={16} />
          <span>Log {activeTab === 'HEALTH' ? 'Symptom' : 'Potty Check'}</span>
        </Button>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: TIMELINE HISTORY & FILTERS */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* TABS SELECTOR */}
          <div className="flex gap-2 p-1 bg-deep-charcoal/5 dark:bg-white/5 rounded-2xl w-fit">
            <button
              onClick={() => { setActiveTab('HEALTH'); setSearchQuery(''); }}
              className={`px-4 py-2 text-xs font-semibold rounded-xl flex items-center gap-2 cursor-pointer transition-all
                ${activeTab === 'HEALTH'
                  ? 'bg-pure-linen text-deep-charcoal shadow-sm dark:bg-slate-velvet dark:text-frosted-pearl'
                  : 'text-warm-slate hover:text-deep-charcoal dark:hover:text-frosted-pearl'
                }
              `}
            >
              <HeartPulse size={14} /> Symptoms & Meds
            </button>
            <button
              onClick={() => { setActiveTab('STOOL_URINE'); setSearchQuery(''); }}
              className={`px-4 py-2 text-xs font-semibold rounded-xl flex items-center gap-2 cursor-pointer transition-all
                ${activeTab === 'STOOL_URINE'
                  ? 'bg-pure-linen text-deep-charcoal shadow-sm dark:bg-slate-velvet dark:text-frosted-pearl'
                  : 'text-warm-slate hover:text-deep-charcoal dark:hover:text-frosted-pearl'
                }
              `}
            >
              <ShieldAlert size={14} /> Potty Check
            </button>
          </div>

          {/* SEARCH & FILTERS PANEL */}
          <Card variant="default" className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative w-full sm:max-w-xs">
              <Input
                placeholder={`Search ${activeTab === 'HEALTH' ? 'symptom/medication' : 'consistency/notes'}...`}
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

          {/* HISTORICAL LOGS TIMELINE */}
          <div className="flex flex-col gap-4">
            {activeLogs.length > 0 ? (
              activeLogs.map((log) => (
                <Card key={log.id} variant="default" className="flex justify-between items-center">
                  <div className="flex gap-4 items-start">
                    <div className={`p-3.5 rounded-2xl border
                      ${log.type === 'HEALTH'
                        ? 'bg-red-500/10 text-red-500 border-red-100'
                        : 'bg-amber-500/10 text-amber-600 border-amber-100'
                      }
                    `}>
                      {log.type === 'HEALTH' ? <HeartPulse size={18} /> : <ShieldAlert size={18} />}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-deep-charcoal dark:text-frosted-pearl font-display leading-tight">
                        {log.type === 'HEALTH'
                          ? (log.payload.symptom 
                              ? `Symptom: ${log.payload.symptom as string}` 
                              : `Medication: ${log.payload.medicationName as string}`)
                          : `Stool: ${log.payload.consistency as string} • Urine: ${log.payload.urineFrequency as string}`
                        }
                      </h4>
                      <p className="text-xxs text-warm-slate dark:text-frosted-pearl/60 mt-0.5">
                        Logged at {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        {log.payload.severity ? ` • Severity: ${log.payload.severity as string}` : ''}
                        {log.payload.temperature ? ` • Temp: ${log.payload.temperature as number}°F` : ''}
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
                icon={activeTab === 'HEALTH' ? <HeartPulse size={40} /> : <ShieldAlert size={40} />}
                title={`No ${activeTab === 'HEALTH' ? 'Symptom Logs' : 'Potty Checks'} Found`}
                description="Keep track of clinical records to feed the AI reasoning modules."
                action={<Button variant="primary" onClick={openAddModal}>Log First Event</Button>}
              />
            )}
          </div>

        </div>

        {/* RIGHT COLUMN: VACCINATION SUMMARY */}
        <div className="flex flex-col gap-6">
          <Card variant="default">
            <h3 className="text-sm font-bold font-display text-deep-charcoal dark:text-frosted-pearl mb-4">
              Vaccination Calendar
            </h3>
            {vaccineReminders.length > 0 ? (
              <div className="flex flex-col gap-3">
                {vaccineReminders.map((rem) => (
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
              <p className="text-xs text-warm-slate dark:text-frosted-pearl/60 text-center py-2">
                No upcoming booster reminders.
              </p>
            )}
          </Card>

          <Card variant="glass" className="border-l-4 border-l-bloom-rose">
            <h4 className="text-xs font-bold font-display mb-1">AI Diagnostic Insight</h4>
            <p className="text-xs text-warm-slate dark:text-frosted-pearl/70 leading-relaxed">
              If stool consistency shifts to soft/liquid for more than 48 hours, the concierge will automatically flag a vet advisory ticket.
            </p>
          </Card>
        </div>

      </div>

      {/* CREATE & EDIT HEALTH / POTTY MODAL */}
      <Modal
        isOpen={modalMode === 'ADD' || modalMode === 'EDIT'}
        onClose={() => setModalMode(null)}
        title={
          modalMode === 'ADD'
            ? `Log Daily ${activeTab === 'HEALTH' ? 'Health Detail' : 'Potty Check'}`
            : `Modify ${activeTab === 'HEALTH' ? 'Health Details' : 'Potty Log'}`
        }
      >
        <form onSubmit={handleSaveLog} className="flex flex-col gap-4">
          
          {activeTab === 'HEALTH' && (
            <>
              <Input
                label="Observed Symptom"
                value={symptom}
                onChange={(e) => setSymptom(e.target.value)}
                placeholder="e.g. Mild scratching, red ears"
              />
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-warm-slate dark:text-frosted-pearl/80">
                  Severity Level
                </label>
                <select
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value)}
                  className="px-4 py-2.5 rounded-xl border border-warm-slate/25 bg-pure-linen text-deep-charcoal dark:bg-slate-velvet/50 dark:text-frosted-pearl dark:border-white/10 outline-none"
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>Critical</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Medication Name"
                  value={medicationName}
                  onChange={(e) => setMedicationName(e.target.value)}
                  placeholder="e.g. Apoquel"
                />
                <Input
                  label="Dosage"
                  value={medicationDosage}
                  onChange={(e) => setMedicationDosage(e.target.value)}
                  placeholder="e.g. 16mg"
                />
              </div>
              <Input
                label="Temperature (°F)"
                type="number"
                step="0.1"
                value={temperature}
                onChange={(e) => setTemperature(e.target.value)}
                placeholder="101.5"
              />
            </>
          )}

          {activeTab === 'STOOL_URINE' && (
            <>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-warm-slate dark:text-frosted-pearl/80">
                  Stool Consistency
                </label>
                <select
                  value={stoolConsistency}
                  onChange={(e) => setStoolConsistency(e.target.value)}
                  className="px-4 py-2.5 rounded-xl border border-warm-slate/25 bg-pure-linen text-deep-charcoal dark:bg-slate-velvet/50 dark:text-frosted-pearl dark:border-white/10 outline-none"
                >
                  <option>Firm</option>
                  <option>Soft</option>
                  <option>Liquid</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-warm-slate dark:text-frosted-pearl/80">
                  Urine Frequency
                </label>
                <select
                  value={urineFrequency}
                  onChange={(e) => setUrineFrequency(e.target.value)}
                  className="px-4 py-2.5 rounded-xl border border-warm-slate/25 bg-pure-linen text-deep-charcoal dark:bg-slate-velvet/50 dark:text-frosted-pearl dark:border-white/10 outline-none"
                >
                  <option>Normal</option>
                  <option>High</option>
                  <option>Low</option>
                </select>
              </div>
              <Input
                label="Color description"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                required
                placeholder="Brown / Yellow"
              />
            </>
          )}

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
            label="Additional Notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Log general mood observations or changes..."
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
export default HealthPage;

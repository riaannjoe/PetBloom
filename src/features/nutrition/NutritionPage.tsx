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
import { Apple, Droplet, Plus, Trash2, Edit2, Search } from 'lucide-react';
import type { PetLog } from '@/utils/mockData';

type LogType = 'NUTRITION' | 'WATER';

export const NutritionPage: React.FC = () => {
  const addToast = useNotificationStore((s) => s.addToast);
  const {
    activePetId,
    pets,
    logs,
    addPetLog,
    updatePetLog,
    deletePetLog,
    inventory,
    reorderFood
  } = usePetStore();

  const activePet = pets.find((p) => p.id === activePetId) || pets[0];
  const activeInventory = inventory.find((inv) => inv.petId === activePetId);

  // Active view tab: NUTRITION or WATER
  const [activeTab, setActiveTab] = useState<LogType>('NUTRITION');

  // Search and Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  // Modals state
  const [modalMode, setModalMode] = useState<'ADD' | 'EDIT' | 'DELETE' | null>(null);
  const [selectedLog, setSelectedLog] = useState<PetLog | null>(null);

  // Form states
  const [mealType, setMealType] = useState('Breakfast');
  const [foodName, setFoodName] = useState(activeInventory?.foodName || 'Royal Canin Puppy Large');
  const [quantity, setQuantity] = useState('220');
  const [waterAmount, setWaterAmount] = useState('250');
  const [logTime, setLogTime] = useState(new Date().toTimeString().slice(0, 5));
  const [notes, setNotes] = useState('');

  // Filtered Logs
  const activeLogs = logs.filter((log) => {
    if (log.petId !== activePetId) return false;
    if (log.type !== activeTab) return false;

    // Filter by date
    if (dateFilter && log.timestamp.split('T')[0] !== dateFilter) return false;

    // Search query in notes/payload fields
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const noteMatch = (log.payload.notes as string || '').toLowerCase().includes(q);
      const foodMatch = (log.payload.foodName as string || '').toLowerCase().includes(q);
      const mealMatch = (log.payload.mealType as string || '').toLowerCase().includes(q);
      return noteMatch || foodMatch || mealMatch;
    }

    return true;
  });

  // Calculate hydration progress for today
  const todayStr = new Date().toISOString().split('T')[0];
  const waterLogsToday = logs.filter(
    (l) => l.petId === activePetId && l.type === 'WATER' && l.timestamp.startsWith(todayStr)
  );
  const totalWaterToday = waterLogsToday.reduce((sum, l) => sum + ((l.payload.amountMl as number) || 0), 0);
  const waterGoal = 1000; // standard goal

  const openAddModal = () => {
    setSelectedLog(null);
    setMealType('Breakfast');
    setFoodName(activeInventory?.foodName || 'Royal Canin Puppy Large');
    setQuantity('220');
    setWaterAmount('250');
    setLogTime(new Date().toTimeString().slice(0, 5));
    setNotes('');
    setModalMode('ADD');
  };

  const openEditModal = (log: PetLog) => {
    setSelectedLog(log);
    setLogTime(new Date(log.timestamp).toTimeString().slice(0, 5));
    setNotes((log.payload.notes as string) || '');
    
    if (log.type === 'NUTRITION') {
      setMealType((log.payload.mealType as string) || 'Breakfast');
      setFoodName((log.payload.foodName as string) || '');
      setQuantity(String(log.payload.qtyGrams || ''));
    } else {
      setWaterAmount(String(log.payload.amountMl || ''));
    }
    
    setModalMode('EDIT');
  };

  const handleSaveLog = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (activeTab === 'NUTRITION') {
      if (!foodName || !quantity) return;
      const payload = {
        mealType,
        foodName,
        qtyGrams: parseFloat(quantity) || 0,
        notes
      };

      if (modalMode === 'ADD') {
        addPetLog('NUTRITION', payload);
        addToast({
          type: 'success',
          title: 'Meal Logged',
          message: `Successfully logged ${quantity}g of ${foodName}.`
        });
      } else if (modalMode === 'EDIT' && selectedLog) {
        updatePetLog(selectedLog.id, payload);
        addToast({
          type: 'success',
          title: 'Meal Log Updated',
          message: 'Your modifications have been saved.'
        });
      }
    } else {
      if (!waterAmount) return;
      const payload = {
        amountMl: parseFloat(waterAmount) || 0,
        notes
      };

      if (modalMode === 'ADD') {
        addPetLog('WATER', payload);
        addToast({
          type: 'success',
          title: 'Water Intake Logged',
          message: `Logged ${waterAmount}ml of fresh water.`
        });
      } else if (modalMode === 'EDIT' && selectedLog) {
        updatePetLog(selectedLog.id, payload);
        addToast({
          type: 'success',
          title: 'Water Log Updated',
          message: 'Your modifications have been saved.'
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
        title: 'Log Deleted',
        message: 'The selected activity log has been removed.'
      });
      setModalMode(null);
    }
  };

  return (
    <PageWrapper
      title="Nutrition & Fluids"
      subtitle={`Log daily meals, monitor hydration stats, and oversee food bag storage limits for ${activePet?.name || 'Max'}`}
      action={
        <Button variant="primary" onClick={openAddModal} className="flex items-center gap-1.5 cursor-pointer">
          <Plus size={16} />
          <span>Log {activeTab === 'NUTRITION' ? 'Meal' : 'Water'}</span>
        </Button>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: TIMELINE HISTORY & FILTERS */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* TABS SELECTOR */}
          <div className="flex gap-2 p-1 bg-deep-charcoal/5 dark:bg-white/5 rounded-2xl w-fit">
            <button
              onClick={() => { setActiveTab('NUTRITION'); setSearchQuery(''); }}
              className={`px-4 py-2 text-xs font-semibold rounded-xl flex items-center gap-2 cursor-pointer transition-all
                ${activeTab === 'NUTRITION'
                  ? 'bg-pure-linen text-deep-charcoal shadow-sm dark:bg-slate-velvet dark:text-frosted-pearl'
                  : 'text-warm-slate hover:text-deep-charcoal dark:hover:text-frosted-pearl'
                }
              `}
            >
              <Apple size={14} /> Nutrition
            </button>
            <button
              onClick={() => { setActiveTab('WATER'); setSearchQuery(''); }}
              className={`px-4 py-2 text-xs font-semibold rounded-xl flex items-center gap-2 cursor-pointer transition-all
                ${activeTab === 'WATER'
                  ? 'bg-pure-linen text-deep-charcoal shadow-sm dark:bg-slate-velvet dark:text-frosted-pearl'
                  : 'text-warm-slate hover:text-deep-charcoal dark:hover:text-frosted-pearl'
                }
              `}
            >
              <Droplet size={14} /> Hydration
            </button>
          </div>

          {/* SEARCH & FILTERS PANEL */}
          <Card variant="default" className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative w-full sm:max-w-xs">
              <Input
                placeholder={`Search ${activeTab === 'NUTRITION' ? 'meal/food' : 'notes'}...`}
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
                    <div className={`p-3.5 rounded-2xl border
                      ${log.type === 'NUTRITION'
                        ? 'bg-pastel-nutrition/10 text-orange-500 border-orange-100'
                        : 'bg-blue-500/10 text-blue-500 border-blue-100'
                      }
                    `}>
                      {log.type === 'NUTRITION' ? <Apple size={18} /> : <Droplet size={18} />}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-deep-charcoal dark:text-frosted-pearl font-display leading-tight">
                        {log.type === 'NUTRITION'
                          ? `${log.payload.mealType} • ${log.payload.foodName}`
                          : `${log.payload.amountMl} ml Fluid`
                        }
                      </h4>
                      <p className="text-xxs text-warm-slate dark:text-frosted-pearl/60 mt-0.5">
                        Logged at {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        {log.payload.qtyGrams ? ` • Amount: ${log.payload.qtyGrams as number}g` : ''}
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
                icon={activeTab === 'NUTRITION' ? <Apple size={40} /> : <Droplet size={40} />}
                title={`No ${activeTab === 'NUTRITION' ? 'Meals' : 'Hydration Logs'} Found`}
                description="Use the action button above to log metrics and check details."
                action={<Button variant="primary" onClick={openAddModal}>Log Now</Button>}
              />
            )}
          </div>

        </div>

        {/* RIGHT COLUMN: ANALYTICS & INVENTORY CARDS */}
        <div className="flex flex-col gap-6">
          
          {/* HYDRATION PROGRESS WIDGET */}
          <Card variant="default">
            <h3 className="text-sm font-bold font-display text-deep-charcoal dark:text-frosted-pearl mb-1">
              Hydration Dashboard
            </h3>
            <p className="text-xxs text-warm-slate dark:text-frosted-pearl/60 mb-4">
              Daily target: {waterGoal} ml
            </p>

            <ProgressBar value={totalWaterToday} max={waterGoal} color="primary" height="sm" />
            
            <div className="flex justify-between items-center text-xs mt-3">
              <span className="font-semibold text-deep-charcoal dark:text-frosted-pearl">
                {totalWaterToday} ml drank today
              </span>
              <Badge variant={totalWaterToday >= waterGoal ? 'success' : 'info'}>
                {Math.round((totalWaterToday / waterGoal) * 100)}% Met
              </Badge>
            </div>
          </Card>

          {/* FOOD BAG STORAGE */}
          {activeInventory && (
            <Card variant="default">
              <h3 className="text-sm font-bold font-display mb-1 text-deep-charcoal dark:text-frosted-pearl">
                Food Bag stock
              </h3>
              <p className="text-xxs text-warm-slate dark:text-frosted-pearl/60 mb-4">
                {activeInventory.foodName}
              </p>

              <ProgressBar value={activeInventory.currentQty} max={10.0} color="primary" height="sm" />

              <div className="flex justify-between items-center text-xs mt-3">
                <div className="flex flex-col">
                  <span className="font-semibold text-deep-charcoal dark:text-frosted-pearl">
                    {activeInventory.currentQty} kg left
                  </span>
                  <span className="text-xxs text-warm-slate dark:text-frosted-pearl/60">
                    Est. {Math.round(activeInventory.currentQty / activeInventory.dailyConsumption)} days left
                  </span>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    reorderFood(activeInventory.id);
                    addToast({
                      type: 'success',
                      title: 'Inventory Replenished',
                      message: `Successfully reordered ${activeInventory.foodName}.`
                    });
                  }}
                  className="text-bloom-rose font-bold p-0 min-h-0 cursor-pointer"
                >
                  Reorder bag
                </Button>
              </div>
            </Card>
          )}

        </div>

      </div>

      {/* CREATE & EDIT MEAL / WATER MODAL */}
      <Modal
        isOpen={modalMode === 'ADD' || modalMode === 'EDIT'}
        onClose={() => setModalMode(null)}
        title={
          modalMode === 'ADD'
            ? `Log Daily ${activeTab === 'NUTRITION' ? 'Meal' : 'Water'}`
            : `Modify ${activeTab === 'NUTRITION' ? 'Meal' : 'Water'} Log`
        }
      >
        <form onSubmit={handleSaveLog} className="flex flex-col gap-4">
          
          {activeTab === 'NUTRITION' && (
            <>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-warm-slate dark:text-frosted-pearl/80">
                  Meal Category
                </label>
                <select
                  value={mealType}
                  onChange={(e) => setMealType(e.target.value)}
                  className="px-4 py-2.5 rounded-xl border border-warm-slate/25 bg-pure-linen text-deep-charcoal dark:bg-slate-velvet/50 dark:text-frosted-pearl dark:border-white/10 outline-none"
                >
                  <option>Breakfast</option>
                  <option>Lunch</option>
                  <option>Dinner</option>
                  <option>Treat</option>
                </select>
              </div>
              <Input
                label="Food Product Name"
                value={foodName}
                onChange={(e) => setFoodName(e.target.value)}
                required
                placeholder="Royal Canin Large Breed"
              />
              <Input
                label="Amount (grams)"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
                placeholder="220"
              />
            </>
          )}

          {activeTab === 'WATER' && (
            <Input
              label="Water Volume (ml)"
              type="number"
              value={waterAmount}
              onChange={(e) => setWaterAmount(e.target.value)}
              required
              placeholder="250"
            />
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
            label="Activity Notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add symptoms or behaviour observations..."
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
            Are you sure you want to delete this activity log? This will update inventory depletion ratios and cannot be undone.
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
export default NutritionPage;

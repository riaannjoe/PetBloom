import React, { useState } from 'react';
import { usePetStore } from '@/store/petStore';
import { useNotificationStore } from '@/store/notificationStore';
import { PageWrapper } from '@/layouts/PageWrapper';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import {
  Heart,
  Shield,
  Plus,
  Trash2,
  Edit2,
  Utensils,
  Footprints,
  Sparkles,
  PhoneCall
} from 'lucide-react';
import type { Pet } from '@/utils/mockData';

type ModalMode = 'ADD' | 'EDIT' | 'DELETE' | null;

export const ProfilePage: React.FC = () => {
  const addToast = useNotificationStore((s) => s.addToast);
  const {
    pets,
    activePetId,
    setActivePetId,
    addPet,
    updatePet,
    deletePet,
    reminders
  } = usePetStore();

  const activePet = pets.find((p) => p.id === activePetId) || pets[0];

  // Modal control states
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  
  // Pet Form inputs state
  const [name, setName] = useState('');
  const [species, setSpecies] = useState<'Dog' | 'Cat' | 'Other'>('Dog');
  const [breed, setBreed] = useState('');
  const [birthday, setBirthday] = useState('');
  const [weight, setWeight] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Neutered' | 'Spayed'>('Male');
  const [photoUrl, setPhotoUrl] = useState('');
  const [allergies, setAllergies] = useState('');
  const [conditions, setConditions] = useState('');
  const [medications, setMedications] = useState('');
  const [vetDetails, setVetDetails] = useState('');

  // Open modals helper
  const openAddModal = () => {
    setName('');
    setSpecies('Dog');
    setBreed('');
    setBirthday('');
    setWeight('');
    setGender('Male');
    setPhotoUrl('');
    setAllergies('');
    setConditions('');
    setMedications('');
    setVetDetails('');
    setModalMode('ADD');
  };

  const openEditModal = (pet: Pet) => {
    setName(pet.name);
    setSpecies(pet.breed.toLowerCase().includes('cat') || pet.name.toLowerCase() === 'bella' ? 'Cat' : 'Dog');
    setBreed(pet.breed);
    setBirthday(pet.birthday);
    setWeight(String(pet.weight));
    setGender((pet.gender as any) || 'Male');
    setPhotoUrl(pet.photoUrl || '');
    setAllergies(pet.allergies || '');
    setConditions(pet.medicalConditions || '');
    setMedications(pet.medications || '');
    setVetDetails(pet.vetDetails || '');
    setModalMode('EDIT');
  };

  const handleSavePet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !breed || !birthday || !weight) return;

    const petPayload = {
      name,
      breed,
      birthday,
      weight: parseFloat(weight) || 0,
      gender,
      photoUrl: photoUrl || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=256',
      allergies,
      medicalConditions: conditions,
      medications,
      vetDetails,
    };

    if (modalMode === 'ADD') {
      addPet(petPayload);
      addToast({
        type: 'success',
        title: 'Pet Added',
        message: `${name} has been successfully added to PetBloom.`
      });
    } else if (modalMode === 'EDIT' && activePet) {
      updatePet(activePet.id, petPayload);
      addToast({
        type: 'success',
        title: 'Profile Updated',
        message: `${name}'s profile has been updated.`
      });
    }

    setModalMode(null);
  };

  const handleDeleteConfirm = () => {
    if (activePet) {
      const deletedName = activePet.name;
      deletePet(activePet.id);
      addToast({
        type: 'warning',
        title: 'Pet Profile Deleted',
        message: `${deletedName} has been removed from PetBloom.`
      });
      setModalMode(null);
    }
  };

  const calculateAge = (birthdayStr: string) => {
    if (!birthdayStr) return '';
    const birthday = new Date(birthdayStr);
    const today = new Date();
    let months = (today.getFullYear() - birthday.getFullYear()) * 12 + today.getMonth() - birthday.getMonth();
    if (months <= 0) return 'Newborn';
    if (months < 12) return `${months} mo`;
    const years = Math.floor(months / 12);
    const remMonths = months % 12;
    return remMonths > 0 ? `${years} yr ${remMonths} mo` : `${years} yr`;
  };

  const activeVaccines = reminders.filter(
    (r) => r.petId === activePetId && r.type === 'VACCINATION' && r.status === 'PENDING'
  );

  return (
    <PageWrapper
      title="Pet Profiles"
      subtitle="Manage your household pets, edit physical parameters, and review active medical logs"
      action={
        <Button variant="primary" onClick={openAddModal} className="flex items-center gap-1.5 cursor-pointer">
          <Plus size={16} />
          <span>Add Pet</span>
        </Button>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: PET LIST & ACTIVE SELECTOR */}
        <div className="flex flex-col gap-6">
          <h3 className="text-sm font-bold font-display text-warm-slate uppercase tracking-wider dark:text-frosted-pearl/80">
            Your Household Pets
          </h3>
          <div className="flex flex-col gap-4">
            {pets.map((pet) => {
              const isActive = pet.id === activePetId;
              return (
                <Card
                  key={pet.id}
                  variant={isActive ? 'glass' : 'default'}
                  className={`p-4 border cursor-pointer hover:border-bloom-rose/40 select-none transition-all flex justify-between items-center
                    ${isActive 
                      ? 'border-bloom-rose/40 shadow-sm' 
                      : 'border-deep-charcoal/5 dark:border-white/5'
                    }
                  `}
                  onClick={() => setActivePetId(pet.id)}
                >
                  <div className="flex items-center gap-3">
                    <Avatar src={pet.photoUrl} name={pet.name} size="sm" />
                    <div>
                      <h4 className="text-sm font-semibold text-deep-charcoal dark:text-frosted-pearl font-display leading-tight">
                        {pet.name}
                      </h4>
                      <p className="text-xxs text-warm-slate dark:text-frosted-pearl/60 mt-0.5">
                        {pet.breed} • {calculateAge(pet.birthday)}
                      </p>
                    </div>
                  </div>
                  {isActive && (
                    <Badge variant="success" className="text-xxs">
                      Active
                    </Badge>
                  )}
                </Card>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: ACTIVE PET DETAILED VIEW */}
        {activePet ? (
          <div className="lg:col-span-2 flex flex-col gap-6">
            
            {/* BIO BRIEF CARD */}
            <Card variant="default" className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                <Avatar src={activePet.photoUrl} name={activePet.name} size="xl" className="shadow" />
                <div className="text-center sm:text-left">
                  <h2 className="text-2xl font-bold font-display text-deep-charcoal dark:text-frosted-pearl">
                    {activePet.name}
                  </h2>
                  <p className="text-sm text-warm-slate dark:text-frosted-pearl/70 mt-1">
                    {activePet.breed} • {calculateAge(activePet.birthday)} old
                  </p>
                  
                  <div className="flex flex-wrap gap-2.5 justify-center sm:justify-start mt-4">
                    <Badge variant="neutral">Weight: {activePet.weight} kg</Badge>
                    <Badge variant="neutral">Gender: {activePet.gender || 'Male'}</Badge>
                  </div>
                </div>
              </div>

              {/* Edit / Delete Buttons */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => openEditModal(activePet)}
                  title="Edit Pet Profile"
                  className="cursor-pointer"
                >
                  <Edit2 size={15} />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setModalMode('DELETE')}
                  title="Delete Pet"
                  className="hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/30 cursor-pointer"
                >
                  <Trash2 size={15} />
                </Button>
              </div>
            </Card>

            {/* MEDICAL FILE DETAILS */}
            <Card variant="default">
              <h3 className="text-base font-bold font-display text-deep-charcoal dark:text-frosted-pearl mb-4 flex items-center gap-2 border-b border-deep-charcoal/5 pb-3 dark:border-white/5">
                <Heart size={18} className="text-red-500" />
                <span>Medical Profile</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-xxs text-warm-slate uppercase font-semibold tracking-wider dark:text-frosted-pearl/60">
                    Food & Pollen Allergies
                  </h4>
                  <p className="text-sm text-deep-charcoal dark:text-frosted-pearl mt-1.5">
                    {activePet.allergies || 'No allergies logged.'}
                  </p>
                </div>
                <div>
                  <h4 className="text-xxs text-warm-slate uppercase font-semibold tracking-wider dark:text-frosted-pearl/60">
                    Existing Conditions
                  </h4>
                  <p className="text-sm text-deep-charcoal dark:text-frosted-pearl mt-1.5">
                    {activePet.medicalConditions || 'No conditions logged.'}
                  </p>
                </div>
                <div className="sm:col-span-2 border-t border-deep-charcoal/5 pt-4 dark:border-white/5">
                  <h4 className="text-xxs text-warm-slate uppercase font-semibold tracking-wider dark:text-frosted-pearl/60">
                    Current Medications
                  </h4>
                  <p className="text-sm text-deep-charcoal dark:text-frosted-pearl mt-1.5 font-medium">
                    {activePet.medications || 'No daily medications.'}
                  </p>
                </div>
              </div>
            </Card>

            {/* LIFESTYLE ROUTINE */}
            <Card variant="default">
              <h3 className="text-base font-bold font-display text-deep-charcoal dark:text-frosted-pearl mb-4 flex items-center gap-2 border-b border-deep-charcoal/5 pb-3 dark:border-white/5">
                <Sparkles size={18} className="text-bloom-rose animate-pulse" />
                <span>Lifestyle & Target Targets</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center sm:text-left">
                <div className="flex flex-col gap-1.5">
                  <Utensils size={18} className="text-orange-500 mx-auto sm:mx-0" />
                  <span className="text-xxs text-warm-slate uppercase font-semibold tracking-wider dark:text-frosted-pearl/60">
                    Feeding Schedule
                  </span>
                  <span className="text-xs font-semibold text-deep-charcoal dark:text-frosted-pearl">
                    Twice daily (440g total)
                  </span>
                </div>
                <div className="flex flex-col gap-1.5 border-y sm:border-y-0 sm:border-x border-deep-charcoal/5 py-4 sm:py-0 sm:px-6 dark:border-white/5">
                  <Footprints size={18} className="text-emerald-500 mx-auto sm:mx-0" />
                  <span className="text-xxs text-warm-slate uppercase font-semibold tracking-wider dark:text-frosted-pearl/60">
                    Walk Target
                  </span>
                  <span className="text-xs font-semibold text-deep-charcoal dark:text-frosted-pearl">
                    45 minutes daily
                  </span>
                </div>
                <div className="flex flex-col gap-1.5">
                  <Heart size={18} className="text-blue-500 mx-auto sm:mx-0" />
                  <span className="text-xxs text-warm-slate uppercase font-semibold tracking-wider dark:text-frosted-pearl/60">
                    Daily Water Goal
                  </span>
                  <span className="text-xs font-semibold text-deep-charcoal dark:text-frosted-pearl">
                    1,000 ml
                  </span>
                </div>
              </div>
            </Card>

            {/* VET DETAILS & VACCINES */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card variant="default">
                <h3 className="text-base font-bold font-display text-deep-charcoal dark:text-frosted-pearl mb-4 flex items-center gap-2">
                  <PhoneCall size={18} className="text-blue-500" />
                  <span>Emergency Clinic Vet</span>
                </h3>
                <p className="text-xs text-deep-charcoal dark:text-frosted-pearl leading-relaxed">
                  {activePet.vetDetails || 'No clinical vet details logged.'}
                </p>
              </Card>

              <Card variant="default">
                <h3 className="text-base font-bold font-display text-deep-charcoal dark:text-frosted-pearl mb-4 flex items-center gap-2">
                  <Shield size={18} className="text-emerald-500" />
                  <span>Pending Vaccines</span>
                </h3>
                {activeVaccines.length > 0 ? (
                  <div className="flex flex-col gap-2">
                    {activeVaccines.map((v) => (
                      <div key={v.id} className="text-xxs p-2.5 bg-warm-cream/50 rounded-xl dark:bg-white/5">
                        <span className="font-semibold text-deep-charcoal dark:text-frosted-pearl">
                          {v.title}
                        </span>
                        <p className="text-warm-slate mt-0.5">Due: {new Date(v.dueTime).toLocaleDateString()}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-warm-slate dark:text-frosted-pearl/60">
                    No pending vaccinations due.
                  </p>
                )}
              </Card>
            </div>

          </div>
        ) : (
          <div className="lg:col-span-2 text-center py-12">
            <p className="text-sm text-warm-slate dark:text-frosted-pearl/70">
              No pets found. Click "Add Pet" to create one.
            </p>
          </div>
        )}

      </div>

      {/* ADD / EDIT PET MODAL */}
      <Modal
        isOpen={modalMode === 'ADD' || modalMode === 'EDIT'}
        onClose={() => setModalMode(null)}
        title={modalMode === 'ADD' ? 'Add New Pet' : 'Edit Pet Profile'}
      >
        <form onSubmit={handleSavePet} className="flex flex-col gap-4 max-h-[60vh] overflow-y-auto pr-1">
          <Input
            label="Pet Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Max"
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-warm-slate dark:text-frosted-pearl/80">
              Species
            </label>
            <select
              value={species}
              onChange={(e) => setSpecies(e.target.value as any)}
              className="px-4 py-2.5 rounded-xl border border-warm-slate/25 bg-pure-linen text-deep-charcoal dark:bg-slate-velvet/50 dark:text-frosted-pearl dark:border-white/10 outline-none"
            >
              <option>Dog</option>
              <option>Cat</option>
              <option>Other</option>
            </select>
          </div>
          <Input
            label="Breed"
            value={breed}
            onChange={(e) => setBreed(e.target.value)}
            required
            placeholder="Golden Retriever"
          />
          <Input
            label="Birthday"
            type="date"
            value={birthday}
            onChange={(e) => setBirthday(e.target.value)}
            required
          />
          <Input
            label="Weight (kg)"
            type="number"
            step="0.1"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            required
            placeholder="14.5"
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-warm-slate dark:text-frosted-pearl/80">
              Gender
            </label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value as any)}
              className="px-4 py-2.5 rounded-xl border border-warm-slate/25 bg-pure-linen text-deep-charcoal dark:bg-slate-velvet/50 dark:text-frosted-pearl dark:border-white/10 outline-none"
            >
              <option>Male</option>
              <option>Female</option>
              <option>Neutered</option>
              <option>Spayed</option>
            </select>
          </div>
          <Input
            label="Photo URL (Optional mockup link)"
            value={photoUrl}
            onChange={(e) => setPhotoUrl(e.target.value)}
            placeholder="https://images.unsplash.com/..."
          />
          
          <div className="border-t border-deep-charcoal/5 my-2 pt-2 dark:border-white/5" />
          <h4 className="text-sm font-bold font-display text-deep-charcoal dark:text-frosted-pearl">
            Medical & Vet Configurations
          </h4>
          
          <Input
            label="Food / Pollen Allergies"
            value={allergies}
            onChange={(e) => setAllergies(e.target.value)}
            placeholder="e.g. Beef, Pollen"
          />
          <Input
            label="Existing Conditions"
            value={conditions}
            onChange={(e) => setConditions(e.target.value)}
            placeholder="e.g. Atopic dermatitis"
          />
          <Input
            label="Medications"
            value={medications}
            onChange={(e) => setMedications(e.target.value)}
            placeholder="e.g. Apoquel 16mg daily"
          />
          <Input
            label="Vet Clinic details"
            value={vetDetails}
            onChange={(e) => setVetDetails(e.target.value)}
            placeholder="Dr. Julia Martinez, Green Valley Vet, (555) 123-4567"
          />

          <div className="flex justify-end gap-3 mt-4">
            <Button variant="ghost" type="button" onClick={() => setModalMode(null)} className="cursor-pointer">
              Cancel
            </Button>
            <Button variant="primary" type="submit" className="cursor-pointer">
              {modalMode === 'ADD' ? 'Add Pet' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* DELETE CONFIRMATION DIALOG MODAL */}
      <Modal
        isOpen={modalMode === 'DELETE'}
        onClose={() => setModalMode(null)}
        title="Confirm Profile Removal"
      >
        <div className="flex flex-col gap-4">
          <p className="text-xs text-warm-slate leading-relaxed dark:text-frosted-pearl/70">
            Are you sure you want to delete <strong>{activePet?.name}</strong>? This action is permanent, will remove all log data history, and cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setModalMode(null)} className="cursor-pointer">
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDeleteConfirm} className="cursor-pointer">
              Delete Profile
            </Button>
          </div>
        </div>
      </Modal>

    </PageWrapper>
  );
};
export default ProfilePage;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOnboardingStore } from '@/store/onboardingStore';
import { useAuthStore } from '@/store/authStore';
import { usePetStore } from '@/store/petStore';
import { useNotificationStore } from '@/store/notificationStore';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import {
  Sparkles,
  ChevronRight,
  CheckCircle
} from 'lucide-react';

export const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const addToast = useNotificationStore((s) => s.addToast);
  const setOnboarded = useAuthStore((s) => s.setOnboarded);
  const addPet = usePetStore((s) => s.addPet);

  const {
    currentStep,
    ownerData,
    petData,
    healthData,
    lifestyleData,
    setStep,
    updateOwnerData,
    updatePetData,
    updateHealthData,
    updateLifestyleData,
    resetOnboarding
  } = useOnboardingStore();

  // Local validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Loading animation state for Step 6
  const [aiLoadProgress, setAiLoadProgress] = useState(0);
  const [aiLoadText, setAiLoadText] = useState('Initializing care metrics...');
  const [aiReady, setAiReady] = useState(false);

  useEffect(() => {
    if (currentStep === 6 && !aiReady) {
      const interval = setInterval(() => {
        setAiLoadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setAiReady(true);
            return 100;
          }
          const next = prev + 5;
          if (next === 20) setAiLoadText('Analyzing breed specifications...');
          if (next === 50) setAiLoadText('Calculating calorie targets...');
          if (next === 80) setAiLoadText('Compiling adaptive care timeline...');
          return next;
        });
      }, 15000 / 100); // 1.5 seconds loading time total
      return () => clearInterval(interval);
    }
  }, [currentStep, aiReady]);

  // Stepper helper
  const stepTitles = ['Welcome', 'Owner Info', 'Pet Profile', 'Medical Files', 'Lifestyle', 'Bloom AI'];

  // Form Validation per step
  const validateStep = (): boolean => {
    const errs: Record<string, string> = {};
    if (currentStep === 2) {
      if (!ownerData.name.trim()) errs.name = 'Owner name is required.';
    }
    if (currentStep === 3) {
      if (!petData.name.trim()) errs.petName = 'Pet name is required.';
      if (!petData.breed.trim()) errs.breed = 'Breed is required.';
      if (!petData.birthday) errs.birthday = 'Birthday is required.';
      if (petData.weight <= 0) errs.weight = 'Weight must be greater than 0.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep(currentStep + 1);
    } else {
      addToast({
        type: 'error',
        title: 'Validation Failed',
        message: 'Please complete all required fields correctly.'
      });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    // Add pet details to general pet store
    addPet({
      name: petData.name,
      breed: petData.breed,
      birthday: petData.birthday,
      weight: petData.weight,
      photoUrl: petData.photoUrl || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=256',
      allergies: healthData.allergies,
      medicalConditions: healthData.conditions,
      medications: healthData.medications,
      vetDetails: healthData.vetDetails,
    });

    // Mark as onboarded in auth
    setOnboarded(true);

    // Toast
    addToast({
      type: 'success',
      title: 'Setup Completed',
      message: `${petData.name}'s personalized timeline is ready!`
    });

    // Reset onboarding temp storage
    resetOnboarding();

    // Navigate to dashboard
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-warm-cream dark:bg-midnight-forest text-deep-charcoal dark:text-frosted-pearl py-12 px-4 transition-colors duration-300 flex items-center justify-center">
      <Card variant="default" className="max-w-2xl w-full p-8 shadow-2xl relative overflow-hidden">
        
        {/* STEPPER PROGRESS INDICATOR */}
        {currentStep <= 5 && (
          <div className="mb-8 select-none">
            <div className="flex justify-between items-center text-xxs font-semibold text-warm-slate uppercase tracking-wider mb-3">
              <span>Step {currentStep} of 5</span>
              <span>{stepTitles[currentStep - 1]}</span>
            </div>
            <div className="flex gap-2 h-1.5 w-full bg-deep-charcoal/5 dark:bg-white/5 rounded-full overflow-hidden">
              {stepTitles.slice(0, 5).map((_, idx) => (
                <div
                  key={idx}
                  className={`h-full flex-grow rounded-full transition-all duration-300
                    ${idx + 1 <= currentStep ? 'bg-bloom-rose' : 'bg-warm-slate/20'}
                  `}
                />
              ))}
            </div>
          </div>
        )}

        {/* STEP 1: WELCOME SCREEN */}
        {currentStep === 1 && (
          <div className="text-center py-6 flex flex-col items-center gap-5">
            <div className="p-4 bg-bloom-rose/15 text-bloom-rose rounded-full">
              <Sparkles size={36} />
            </div>
            <div>
              <h1 className="text-2xl font-bold font-display text-deep-charcoal dark:text-frosted-pearl">
                Welcome to PetBloom!
              </h1>
              <p className="text-sm text-warm-slate mt-2 max-w-sm mx-auto dark:text-frosted-pearl/70 leading-relaxed">
                As your AI pet concierge, I'm here to help you coordinate nutrition, tracking schedules, and weekly reports. Let's configure your profile.
              </p>
            </div>
            <Button variant="primary" onClick={handleNext} className="mt-4 cursor-pointer">
              Get Started <ChevronRight size={18} className="ml-1" />
            </Button>
          </div>
        )}

        {/* STEP 2: OWNER INFORMATION */}
        {currentStep === 2 && (
          <div className="flex flex-col gap-5">
            <div>
              <h2 className="text-lg font-bold font-display">Tell Us About Yourself</h2>
              <p className="text-xs text-warm-slate mt-1 dark:text-frosted-pearl/60">
                This helps customize owner dashboard greeting summaries.
              </p>
            </div>
            
            <div className="flex flex-col gap-4">
              <Input
                label="Your Name (Owner Name)"
                value={ownerData.name}
                onChange={(e) => updateOwnerData({ name: e.target.value })}
                required
                error={errors.name}
                placeholder="Sarah Jenkins"
              />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <Button variant="ghost" onClick={handleBack}>
                Back
              </Button>
              <Button variant="primary" onClick={handleNext}>
                Continue <ChevronRight size={18} />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 3: PET PROFILE INFORMATION */}
        {currentStep === 3 && (
          <div className="flex flex-col gap-5">
            <div>
              <h2 className="text-lg font-bold font-display">Create Pet Profile</h2>
              <p className="text-xs text-warm-slate mt-1 dark:text-frosted-pearl/60">
                Collects metrics needed to calculate breed development ratios.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Pet Name"
                value={petData.name}
                onChange={(e) => updatePetData({ name: e.target.value })}
                required
                error={errors.petName}
                placeholder="Max"
              />
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-warm-slate dark:text-frosted-pearl/80">
                  Species
                </label>
                <select
                  value={petData.species}
                  onChange={(e) => updatePetData({ species: e.target.value as any })}
                  className="px-4 py-2.5 rounded-xl border border-warm-slate/25 bg-pure-linen text-deep-charcoal focus:ring-1 focus:ring-bloom-rose focus:border-bloom-rose dark:bg-slate-velvet/50 dark:text-frosted-pearl dark:border-white/10 outline-none"
                >
                  <option>Dog</option>
                  <option>Cat</option>
                  <option>Other</option>
                </select>
              </div>
              <Input
                label="Breed"
                value={petData.breed}
                onChange={(e) => updatePetData({ breed: e.target.value })}
                required
                error={errors.breed}
                placeholder="Golden Retriever"
              />
              <Input
                label="Birthday"
                type="date"
                value={petData.birthday}
                onChange={(e) => updatePetData({ birthday: e.target.value })}
                required
                error={errors.birthday}
              />
              <Input
                label="Weight (kg)"
                type="number"
                step="0.1"
                value={petData.weight || ''}
                onChange={(e) => updatePetData({ weight: parseFloat(e.target.value) || 0 })}
                required
                error={errors.weight}
                placeholder="12.5"
              />
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-warm-slate dark:text-frosted-pearl/80">
                  Gender
                </label>
                <select
                  value={petData.gender}
                  onChange={(e) => updatePetData({ gender: e.target.value as any })}
                  className="px-4 py-2.5 rounded-xl border border-warm-slate/25 bg-pure-linen text-deep-charcoal focus:ring-1 focus:ring-bloom-rose focus:border-bloom-rose dark:bg-slate-velvet/50 dark:text-frosted-pearl dark:border-white/10 outline-none"
                >
                  <option>Male</option>
                  <option>Female</option>
                  <option>Neutered</option>
                  <option>Spayed</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <Input
                  label="Photo URL (Optional mockup link)"
                  value={petData.photoUrl}
                  onChange={(e) => updatePetData({ photoUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                />
              </div>
            </div>

            <div className="flex justify-between gap-3 mt-6">
              <Button variant="ghost" onClick={handleBack}>
                Back
              </Button>
              <Button variant="primary" onClick={handleNext}>
                Continue <ChevronRight size={18} />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 4: HEALTH INFORMATION */}
        {currentStep === 4 && (
          <div className="flex flex-col gap-5">
            <div>
              <h2 className="text-lg font-bold font-display">Medical & Health Details</h2>
              <p className="text-xs text-warm-slate mt-1 dark:text-frosted-pearl/60">
                Log existing medical records to inform symptom diagnostic reasoning rules.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <Input
                label="Food or Pollen Allergies"
                value={healthData.allergies}
                onChange={(e) => updateHealthData({ allergies: e.target.value })}
                placeholder="e.g. Beef, chicken protein, tall grass"
              />
              <Input
                label="Existing Conditions"
                value={healthData.conditions}
                onChange={(e) => updateHealthData({ conditions: e.target.value })}
                placeholder="e.g. Atopic dermatitis, joint sensitivity"
              />
              <Input
                label="Current Medications"
                value={healthData.medications}
                onChange={(e) => updateHealthData({ medications: e.target.value })}
                placeholder="e.g. Apoquel 16mg daily, Ear drops"
              />
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-warm-slate dark:text-frosted-pearl/80">
                  Vaccinations Status
                </label>
                <select
                  value={healthData.vaccinationStatus}
                  onChange={(e) => updateHealthData({ vaccinationStatus: e.target.value })}
                  className="px-4 py-2.5 rounded-xl border border-warm-slate/25 bg-pure-linen text-deep-charcoal focus:ring-1 focus:ring-bloom-rose focus:border-bloom-rose dark:bg-slate-velvet/50 dark:text-frosted-pearl dark:border-white/10 outline-none"
                >
                  <option>Up to Date</option>
                  <option>Needs Boosters Soon</option>
                  <option>Overdue</option>
                </select>
              </div>
              <Input
                label="Veterinary Contact Info"
                value={healthData.vetDetails}
                onChange={(e) => updateHealthData({ vetDetails: e.target.value })}
                placeholder="e.g. Dr. Martinez, Green Valley Vet, (555) 123-4567"
              />
            </div>

            <div className="flex justify-between gap-3 mt-6">
              <Button variant="ghost" onClick={handleBack}>
                Back
              </Button>
              <Button variant="primary" onClick={handleNext}>
                Continue <ChevronRight size={18} />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 5: LIFESTYLE */}
        {currentStep === 5 && (
          <div className="flex flex-col gap-5">
            <div>
              <h2 className="text-lg font-bold font-display">Lifestyle & Routine</h2>
              <p className="text-xs text-warm-slate mt-1 dark:text-frosted-pearl/60">
                Setup targets for meal, walking, and water logs.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Feeding Schedule description"
                value={lifestyleData.feedingSchedule}
                onChange={(e) => updateLifestyleData({ feedingSchedule: e.target.value })}
                placeholder="e.g. Twice daily at 8am and 6pm"
              />
              <Input
                label="Walking / Exercise Schedule"
                value={lifestyleData.walkSchedule}
                onChange={(e) => updateLifestyleData({ walkSchedule: e.target.value })}
                placeholder="e.g. Morning 30 mins, Evening 20 mins"
              />
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-warm-slate dark:text-frosted-pearl/80">
                  Daily Activity Level
                </label>
                <select
                  value={lifestyleData.activityLevel}
                  onChange={(e) => updateLifestyleData({ activityLevel: e.target.value as any })}
                  className="px-4 py-2.5 rounded-xl border border-warm-slate/25 bg-pure-linen text-deep-charcoal focus:ring-1 focus:ring-bloom-rose focus:border-bloom-rose dark:bg-slate-velvet/50 dark:text-frosted-pearl dark:border-white/10 outline-none"
                >
                  <option>Low</option>
                  <option>Moderate</option>
                  <option>High</option>
                  <option>Very High</option>
                </select>
              </div>
              <Input
                label="Daily Water Intake Goal (ml)"
                type="number"
                value={lifestyleData.waterGoal || ''}
                onChange={(e) => updateLifestyleData({ waterGoal: parseInt(e.target.value) || 0 })}
                placeholder="1000"
              />
              <div className="sm:col-span-2">
                <Input
                  label="Favorite Treats"
                  value={lifestyleData.favoriteTreats}
                  onChange={(e) => updateLifestyleData({ favoriteTreats: e.target.value })}
                  placeholder="e.g. Salmon skin, Freeze-dried liver bites"
                />
              </div>
            </div>

            <div className="flex justify-between gap-3 mt-6">
              <Button variant="ghost" onClick={handleBack}>
                Back
              </Button>
              <Button variant="primary" onClick={handleNext}>
                Build Timeline <ChevronRight size={18} />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 6: AI INITIALIZATION LOADING & WELCOME */}
        {currentStep === 6 && (
          <div className="text-center py-8 flex flex-col items-center gap-5">
            {!aiReady ? (
              <>
                <div className="relative w-20 h-20 flex items-center justify-center">
                  <div className="absolute inset-0 border-4 border-bloom-rose/10 rounded-full" />
                  <div className="absolute inset-0 border-4 border-bloom-rose border-t-transparent rounded-full animate-spin" />
                  <Sparkles size={24} className="text-bloom-rose" />
                </div>
                <div>
                  <h3 className="text-lg font-bold font-display text-deep-charcoal dark:text-frosted-pearl animate-pulse">
                    Training PetBloom Concierge...
                  </h3>
                  <p className="text-xs text-warm-slate mt-2 dark:text-frosted-pearl/65">
                    {aiLoadText} ({aiLoadProgress}%)
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="p-4 bg-emerald-50 text-emerald-500 rounded-full dark:bg-emerald-950/20">
                  <CheckCircle size={36} />
                </div>
                <div className="max-w-md">
                  <h3 className="text-xl font-bold font-display text-deep-charcoal dark:text-frosted-pearl">
                    AI Concierge Initialized!
                  </h3>
                  <div className="p-4 bg-bloom-rose/5 border border-bloom-rose/25 rounded-2xl text-sm leading-relaxed mt-4 italic text-deep-charcoal dark:bg-white/5 dark:text-frosted-pearl">
                    🌸 Welcome! I've prepared today's routine for {petData.name} based on {petData.gender === 'Female' || petData.gender === 'Spayed' ? 'her' : 'his'} {petData.breed} breed, age, and health profile. Let's help {petData.name} bloom.
                  </div>
                </div>
                <Button variant="primary" onClick={handleComplete} className="mt-4 cursor-pointer shadow-md">
                  Enter Dashboard <ChevronRight size={18} className="ml-1" />
                </Button>
              </>
            )}
          </div>
        )}

      </Card>
    </div>
  );
};
export default OnboardingPage;

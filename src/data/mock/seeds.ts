import type {
  ChatMessage,
  FoodInventory,
  MemoryLog,
  Pet,
  PetLog,
  Reminder,
  ScheduleTask,
  User,
  WeeklyReport,
} from '@/types/domain';

export const mockUser: User = {
  id: 'user-sarah',
  name: 'Sarah Jenkins',
  email: 'sarah@petbloom.com',
  avatarUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Sarah',
};

export const mockPets: Pet[] = [
  {
    id: 'pet-max',
    name: 'Max',
    breed: 'Golden Retriever',
    birthday: '2025-12-15',
    weight: 14.8,
    photoUrl:
      'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=256',
    allergies: 'Beef, Chicken Protein, Outdoor Pollen',
    medicalConditions: 'Atopic Dermatitis (Seasonal)',
    medications: 'Apoquel 16mg (Once daily in morning)',
    vetDetails: 'Dr. Julia Martinez, Green Valley Animal Hospital, (555) 123-4567',
  },
  {
    id: 'pet-bella',
    name: 'Bella',
    breed: 'Ragdoll Cat',
    birthday: '2024-04-10',
    weight: 4.8,
    photoUrl:
      'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=256',
    allergies: 'None',
    medicalConditions: 'None',
    medications: 'None',
    vetDetails: 'Dr. Julia Martinez, Green Valley Animal Hospital, (555) 123-4567',
  },
];

export const mockLogs: PetLog[] = [
  {
    id: 'log-1',
    petId: 'pet-max',
    type: 'NUTRITION',
    timestamp: '2026-07-06T08:15:00Z',
    payload: {
      foodName: 'Royal Canin Puppy Large',
      qtyGrams: 220,
      note: 'Ate everything eagerly',
    },
  },
  {
    id: 'log-2',
    petId: 'pet-max',
    type: 'WATER',
    timestamp: '2026-07-06T09:30:00Z',
    payload: { amountMl: 250, note: 'After morning walk' },
  },
  {
    id: 'log-3',
    petId: 'pet-max',
    type: 'WATER',
    timestamp: '2026-07-06T13:00:00Z',
    payload: { amountMl: 150 },
  },
  {
    id: 'log-4',
    petId: 'pet-max',
    type: 'STOOL_URINE',
    timestamp: '2026-07-06T08:45:00Z',
    payload: { consistency: 'Firm', color: 'Brown', difficulty: 'None' },
  },
  {
    id: 'log-5',
    petId: 'pet-max',
    type: 'EXERCISE',
    timestamp: '2026-07-06T08:30:00Z',
    payload: {
      activity: 'Walk',
      durationMinutes: 30,
      distanceKm: 1.8,
      note: 'Energetic, did standard potty loop',
    },
  },
  {
    id: 'log-6',
    petId: 'pet-max',
    type: 'HYGIENE',
    timestamp: '2026-07-05T16:00:00Z',
    payload: { routine: 'Paw cleaning', note: 'Wiped clean after muddy play session' },
  },
  {
    id: 'log-7',
    petId: 'pet-max',
    type: 'HEALTH',
    timestamp: '2026-07-06T08:20:00Z',
    payload: { symptom: 'Mild scratching', severity: 'Low', location: 'Left ear' },
  },
];

export const mockFoodInventory: FoodInventory[] = [
  {
    id: 'inv-1',
    petId: 'pet-max',
    foodName: 'Royal Canin Puppy Large',
    currentQty: 4.2,
    thresholdQty: 3.0,
    dailyConsumption: 0.44,
  },
];

export const mockReminders: Reminder[] = [
  {
    id: 'rem-1',
    petId: 'pet-max',
    title: 'Apoquel Dose',
    description: 'Allergy relief medication - 16mg tablet',
    dueTime: '2026-07-07T08:00:00Z',
    type: 'MEDICINE',
    status: 'PENDING',
  },
  {
    id: 'rem-2',
    petId: 'pet-max',
    title: 'DHPP Booster Vaccine',
    description: 'Annual booster vaccination due at Green Valley Vet',
    dueTime: '2026-07-15T10:00:00Z',
    type: 'VACCINATION',
    status: 'PENDING',
  },
  {
    id: 'rem-3',
    petId: 'pet-max',
    title: 'Monthly Grooming & Nail Trim',
    description: 'De-shedding bath and claw trim appointment',
    dueTime: '2026-07-12T14:30:00Z',
    type: 'HYGIENE',
    status: 'PENDING',
  },
];

export const mockScheduleTasks: ScheduleTask[] = [
  {
    id: 'task-1',
    petId: 'pet-max',
    title: 'Morning Feeding (220g)',
    timeSlot: '08:00 AM',
    isCompleted: true,
    category: 'FEEDING',
    targetDate: '2026-07-06',
  },
  {
    id: 'task-2',
    petId: 'pet-max',
    title: 'Apoquel Allergy Pill',
    timeSlot: '08:15 AM',
    isCompleted: true,
    category: 'MEDICINE',
    targetDate: '2026-07-06',
  },
  {
    id: 'task-3',
    petId: 'pet-max',
    title: 'Morning Walk (30 mins)',
    timeSlot: '08:30 AM',
    isCompleted: true,
    category: 'WALKING',
    targetDate: '2026-07-06',
  },
  {
    id: 'task-4',
    petId: 'pet-max',
    title: 'Evening Feeding (220g)',
    timeSlot: '06:00 PM',
    isCompleted: false,
    category: 'FEEDING',
    targetDate: '2026-07-06',
  },
  {
    id: 'task-5',
    petId: 'pet-max',
    title: 'Brush Teeth & Coat',
    timeSlot: '08:00 PM',
    isCompleted: false,
    category: 'GROOMING',
    targetDate: '2026-07-06',
  },
];

export const mockMemoryLogs: MemoryLog[] = [
  {
    id: 'mem-1',
    petId: 'pet-max',
    event: 'Exhibited moderate scratching of ears on hot afternoons.',
    severity: 'INFO',
    timestamp: '2026-07-04T12:00:00Z',
  },
  {
    id: 'mem-2',
    petId: 'pet-max',
    event:
      'Water consumption drops below target whenever water bowl is not cleaned daily.',
    severity: 'WARNING',
    timestamp: '2026-07-05T18:00:00Z',
  },
];

export const mockWeeklyReport: WeeklyReport = {
  id: 'rep-1',
  petId: 'pet-max',
  startDate: '2026-06-29',
  endDate: '2026-07-05',
  summary:
    'Max is blooming beautifully. His physical growth is completely on track for a 6-month-old Golden Retriever. Hydration levels were slightly unstable midweek but recovered once fresh water reminders triggered. Mild ear scratching was observed; monitor for potential yeast flare-ups due to warm summer weather.',
  healthScore: 92,
  insights: {
    nutritionTargetMet: 100,
    hydrationTargetMet: 82,
    exerciseMinutes: 280,
    medicationAdherence: 100,
    stoolConsistencyOk: true,
  },
};

export const mockChatMessages: ChatMessage[] = [
  {
    id: 'msg-1',
    petId: 'pet-max',
    role: 'assistant',
    content:
      "Hi Sarah! I am Max's care concierge. I have reviewed his Golden Retriever growth curve and daily logging stats. How can I help you care for him today?",
    timestamp: '2026-07-06T08:00:00Z',
  },
];

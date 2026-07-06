export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

export interface Pet {
  id: string;
  name: string;
  breed: string;
  birthday: string;
  weight: number;
  photoUrl?: string;
  allergies?: string;
  medicalConditions?: string;
  medications?: string;
  vetDetails?: string;
  gender?: string;
}

export type LogType =
  | 'NUTRITION'
  | 'WATER'
  | 'STOOL_URINE'
  | 'HEALTH'
  | 'HYGIENE'
  | 'EXERCISE'
  | 'TRAINING';

export interface PetLog {
  id: string;
  petId: string;
  type: LogType;
  timestamp: string;
  payload: Record<string, unknown>;
}

export interface FoodInventory {
  id: string;
  petId: string;
  foodName: string;
  currentQty: number;
  thresholdQty: number;
  dailyConsumption: number;
}

export type ReminderType = 'FOOD' | 'MEDICINE' | 'VACCINATION' | 'HYGIENE' | 'TRAVEL';
export type ReminderStatus = 'PENDING' | 'COMPLETED' | 'MISSED';

export interface Reminder {
  id: string;
  petId: string;
  title: string;
  description?: string;
  dueTime: string;
  type: ReminderType;
  status: ReminderStatus;
}

export type ScheduleCategory =
  | 'FEEDING'
  | 'WALKING'
  | 'GROOMING'
  | 'MEDICINE'
  | 'TRAINING';

export interface ScheduleTask {
  id: string;
  petId: string;
  title: string;
  timeSlot: string;
  isCompleted: boolean;
  category: ScheduleCategory;
  targetDate: string;
}

export type MemorySeverity = 'INFO' | 'WARNING' | 'CRITICAL';

export interface MemoryLog {
  id: string;
  petId: string;
  event: string;
  severity: MemorySeverity;
  timestamp: string;
}

export interface WeeklyReportInsights {
  nutritionTargetMet: number;
  hydrationTargetMet: number;
  exerciseMinutes: number;
  medicationAdherence: number;
  stoolConsistencyOk: boolean;
}

export interface WeeklyReport {
  id: string;
  petId: string;
  startDate: string;
  endDate: string;
  summary: string;
  healthScore: number;
  insights: WeeklyReportInsights;
}

export interface ChatMessage {
  id: string;
  petId: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  isStreaming?: boolean;
}

export type ThemeMode = 'light' | 'dark';

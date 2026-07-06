/**
 * Centralized constant definitions for PetBloom.
 */
export const CARE_TARGETS = {
  GOLDEN_RETRIEVER: {
    WATER_ML: 1000,
    EXERCISE_MINS: 45,
  },
  DEFAULT: {
    WATER_ML: 250,
    EXERCISE_MINS: 15,
  },
} as const;

export const INVENTORY_THRESHOLDS = {
  CRITICAL_DAYS: 3,
  MAX_REORDER_WEIGHT_KG: 10,
} as const;

export const SEVERITY_LEVELS = {
  INFO: 'INFO',
  WARNING: 'WARNING',
  CRITICAL: 'CRITICAL',
} as const;

export const QUICK_LOG_FORM_DEFAULTS = {
  MEAL_NAME: 'Royal Canin Puppy Large',
  MEAL_QTY_GRAMS: '220',
  WATER_VOLUME_ML: '250',
  EXERCISE_TYPE: 'Walk',
  EXERCISE_DURATION_MINS: '30',
  SYMPTOM_SEVERITY: 'Low',
  STOOL_CONSISTENCY: 'Firm',
  STOOL_COLOR: 'Brown',
  HYGIENE_ROUTINE: 'Teeth Brushing',
} as const;

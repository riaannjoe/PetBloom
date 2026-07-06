export const API_ENDPOINTS = {
  auth: {
    register: '/auth/register',
    login: '/auth/login',
  },
  pets: '/pets',
  logs: '/logs',
  inventory: '/inventory',
  schedule: '/schedule',
  reminders: '/reminders',
  chat: '/chat',
  reports: {
    weekly: '/reports/weekly',
    generate: '/reports/generate',
  },
} as const;

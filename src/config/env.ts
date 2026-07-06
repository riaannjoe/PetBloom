/**
 * Centralized environment configuration.
 * All Vite env vars must be prefixed with VITE_.
 */
export const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3001/api',
  useMockApi: import.meta.env.VITE_USE_MOCK_API !== 'false',
  geminiApiKey: import.meta.env.VITE_GEMINI_API_KEY ?? '',
  appName: import.meta.env.VITE_APP_NAME ?? 'PetBloom',
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
} as const;

export function validateEnv(): void {
  if (!env.useMockApi && !env.apiBaseUrl) {
    console.warn('[PetBloom] VITE_API_BASE_URL is not set.');
  }
}

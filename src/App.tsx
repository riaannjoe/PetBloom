import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useThemeStore } from '@/store/themeStore';
import { useAuthStore } from '@/store/authStore';

// Error Boundary & Fallbacks
import { ErrorBoundary } from '@/components/layout/ErrorBoundary';
import { Loading } from '@/components/ui/Loading';

// Layouts
import { AppShell } from '@/layouts/AppShell';

// Lazy Loaded Pages for performance optimizations & code-splitting
const LandingPage = React.lazy(() => import('@/features/landing/LandingPage').then(m => ({ default: m.LandingPage })));
const AuthPage = React.lazy(() => import('@/features/auth/AuthPage').then(m => ({ default: m.AuthPage })));
const OnboardingPage = React.lazy(() => import('@/features/onboarding/OnboardingPage').then(m => ({ default: m.OnboardingPage })));
const DashboardPage = React.lazy(() => import('@/features/dashboard/DashboardPage').then(m => ({ default: m.DashboardPage })));
const ProfilePage = React.lazy(() => import('@/features/profile/ProfilePage').then(m => ({ default: m.ProfilePage })));
const NutritionPage = React.lazy(() => import('@/features/nutrition/NutritionPage').then(m => ({ default: m.NutritionPage })));
const HealthPage = React.lazy(() => import('@/features/health/HealthPage').then(m => ({ default: m.HealthPage })));
const ExercisePage = React.lazy(() => import('@/features/exercise/ExercisePage').then(m => ({ default: m.ExercisePage })));
const HygienePage = React.lazy(() => import('@/features/hygiene/HygienePage').then(m => ({ default: m.HygienePage })));
const ChatPage = React.lazy(() => import('@/features/chat/ChatPage').then(m => ({ default: m.ChatPage })));
const ReportsPage = React.lazy(() => import('@/features/reports/ReportsPage').then(m => ({ default: m.ReportsPage })));
const SettingsPage = React.lazy(() => import('@/features/settings/SettingsPage').then(m => ({ default: m.SettingsPage })));
const NotFoundPage = React.lazy(() => import('@/features/error/NotFoundPage').then(m => ({ default: m.NotFoundPage })));

// Route Protection Components
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isOnboarded } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isOnboarded) {
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
};

const OnboardingRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isOnboarded } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (isOnboarded) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isOnboarded } = useAuthStore();

  if (isAuthenticated) {
    if (!isOnboarded) {
      return <Navigate to="/onboarding" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export const App: React.FC = () => {
  const initializeTheme = useThemeStore((s) => s.initializeTheme);

  useEffect(() => {
    // Initialize light/dark/system theme settings on load
    initializeTheme();
  }, [initializeTheme]);

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <React.Suspense fallback={<Loading fullPage size="lg" label="Initializing PetBloom..." />}>
          <Routes>
            {/* Public Marketing Route */}
            <Route path="/" element={<LandingPage />} />
            
            {/* Authenticated/Sign up Gateways */}
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <AuthPage />
                </PublicRoute>
              }
            />

            {/* First Time Onboarding Stepper */}
            <Route
              path="/onboarding"
              element={
                <OnboardingRoute>
                  <OnboardingPage />
                </OnboardingRoute>
              }
            />

            {/* Application Workspace Shell (Protected) */}
            <Route
              element={
                <ProtectedRoute>
                  <AppShell />
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/nutrition" element={<NutritionPage />} />
              <Route path="/health" element={<HealthPage />} />
              <Route path="/exercise" element={<ExercisePage />} />
              <Route path="/hygiene" element={<HygienePage />} />
              <Route path="/chat" element={<ChatPage />} />
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>

            {/* Redirects & Fallbacks */}
            <Route path="/404" element={<NotFoundPage />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </React.Suspense>
      </BrowserRouter>
    </ErrorBoundary>
  );
};

export default App;

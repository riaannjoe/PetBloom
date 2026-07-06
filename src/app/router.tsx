import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout';
import { LandingPage } from '@/pages/LandingPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { PlaceholderPage } from '@/pages/PlaceholderPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/app',
    element: <AppLayout />,
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      { path: 'dashboard', element: <DashboardPage /> },
      {
        path: 'reports',
        element: <PlaceholderPage title="Reports" module="Reports & Analytics" />,
      },
      {
        path: 'chat',
        element: <PlaceholderPage title="AI Concierge" module="AI Chat" />,
      },
      {
        path: 'logs',
        element: <PlaceholderPage title="Health Logs" module="Logging" />,
      },
      {
        path: 'profile',
        element: <PlaceholderPage title="Pet Profile" module="Pet Profile" />,
      },
      {
        path: 'settings',
        element: <PlaceholderPage title="Setup" module="Settings" />,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);

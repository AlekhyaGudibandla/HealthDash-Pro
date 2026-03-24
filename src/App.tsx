import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { ProtectedRoute } from '@/components/ProtectedRoute';

// Lazy load pages for performance
const LoginPage = lazy(() => import('@/pages/login'));
const DashboardLayout = lazy(() => import('@/features/dashboard/DashboardLayout'));
const DashboardHome = lazy(() => import('@/pages/dashboard/index'));
const AnalyticsPage = lazy(() => import('@/pages/dashboard/analytics'));
const PatientsPage = lazy(() => import('@/pages/dashboard/patients'));
const SettingsPage = lazy(() => import('@/pages/dashboard/settings'));

function App() {
  return (
    <ErrorBoundary>
      <Toaster position="top-right" richColors />
      <BrowserRouter>
        <Suspense fallback={<div className="h-screen w-full flex items-center justify-center">Loading...</div>}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<DashboardLayout />}>
                <Route index element={<DashboardHome />} />
                <Route path="analytics" element={<AnalyticsPage />} />
                <Route path="patients" element={<PatientsPage />} />
                <Route path="settings" element={<SettingsPage />} />
              </Route>
            </Route>

            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;

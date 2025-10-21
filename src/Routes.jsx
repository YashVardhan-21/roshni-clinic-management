import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import { useAuth } from "contexts/AuthContext";
// Add your imports here
import LoginRegistration from "pages/login-registration";
import TherapyExercisesHub from "pages/therapy-exercises-hub";
import PatientDashboard from "pages/patient-dashboard";
import AppointmentBooking from "pages/appointment-booking";
import PatientProgressTracking from "pages/patient-progress-tracking";
import TherapistDashboard from "pages/therapist-dashboard";
import PaymentCallback from "pages/PaymentCallback";
import NotFound from "pages/NotFound";

// Loading component
const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      <p className="mt-4 text-gray-600">Loading Roshni Clinic...</p>
    </div>
  </div>
);

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <LoginRegistration />;
  }

  return children;
};

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <RouterRoutes>
          {/* Public routes */}
          <Route path="/login-registration" element={<LoginRegistration />} />
          <Route path="/payment-callback" element={<PaymentCallback />} />
          
          {/* Protected routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <PatientDashboard />
            </ProtectedRoute>
          } />
          <Route path="/patient-dashboard" element={
            <ProtectedRoute>
              <PatientDashboard />
            </ProtectedRoute>
          } />
          <Route path="/therapy-exercises-hub" element={
            <ProtectedRoute>
              <TherapyExercisesHub />
            </ProtectedRoute>
          } />
          <Route path="/appointment-booking" element={
            <ProtectedRoute>
              <AppointmentBooking />
            </ProtectedRoute>
          } />
          <Route path="/patient-progress-tracking" element={
            <ProtectedRoute>
              <PatientProgressTracking />
            </ProtectedRoute>
          } />
          <Route path="/therapist-dashboard" element={
            <ProtectedRoute>
              <TherapistDashboard />
            </ProtectedRoute>
          } />
          
          {/* 404 route */}
          <Route path="*" element={<NotFound />} />
        </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
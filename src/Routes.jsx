import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
// Add your imports here
import LoginRegistration from "pages/login-registration";
import TherapyExercisesHub from "pages/therapy-exercises-hub";
import PatientDashboard from "pages/patient-dashboard";
import AppointmentBooking from "pages/appointment-booking";
import PatientProgressTracking from "pages/patient-progress-tracking";
import TherapistDashboard from "pages/therapist-dashboard";
import PaymentCallback from "pages/PaymentCallback";
import NotFound from "pages/NotFound";

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your routes here */}
        <Route path="/" element={<PatientDashboard />} />
        <Route path="/login-registration" element={<LoginRegistration />} />
        <Route path="/therapy-exercises-hub" element={<TherapyExercisesHub />} />
        <Route path="/patient-dashboard" element={<PatientDashboard />} />
        <Route path="/appointment-booking" element={<AppointmentBooking />} />
        <Route path="/patient-progress-tracking" element={<PatientProgressTracking />} />
        <Route path="/therapist-dashboard" element={<TherapistDashboard />} />
        <Route path="/payment-callback" element={<PaymentCallback />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
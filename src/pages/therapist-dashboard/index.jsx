import React from 'react';
import Header from '../../components/ui/Header';
import TodaySchedule from './components/TodaySchedule';
import PatientManagement from './components/PatientManagement';
import SessionDocumentation from './components/SessionDocumentation';
import ExercisePrescription from './components/ExercisePrescription';
import CommunicationHub from './components/CommunicationHub';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import QuickActions from './components/QuickActions';

const TherapistDashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6 space-y-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-therapeutic p-6 border border-border">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-heading font-bold text-2xl lg:text-3xl text-foreground mb-2">
                Welcome back, Dr. Patel
              </h1>
              <p className="font-body text-muted-foreground">
                You have 5 appointments scheduled for today. Let's make a difference in your patients' lives.
              </p>
            </div>
            <div className="hidden lg:block">
              <div className="text-right">
                <p className="font-heading font-semibold text-lg text-foreground">
                  {new Date().toLocaleDateString('en-IN', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
                <p className="font-caption text-sm text-muted-foreground">
                  {new Date().toLocaleTimeString('en-IN', { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    hour12: true 
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Left Column - Primary Content */}
          <div className="xl:col-span-2 space-y-8">
            <TodaySchedule />
            <PatientManagement />
            <SessionDocumentation />
          </div>

          {/* Right Column - Secondary Content */}
          <div className="xl:col-span-1 space-y-8">
            <QuickActions />
            <CommunicationHub />
          </div>
        </div>

        {/* Full Width Sections */}
        <div className="space-y-8">
          <ExercisePrescription />
          <AnalyticsDashboard />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <p className="font-caption text-sm text-muted-foreground">
                © {new Date().getFullYear()} Roshni Clinic Management System. All rights reserved.
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <p className="font-caption text-sm text-muted-foreground">
                Version 2.1.0 | Last updated: July 2025
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TherapistDashboard;
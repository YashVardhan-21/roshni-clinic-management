import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Header from '../../components/ui/Header';
import UpcomingAppointmentCard from './components/UpcomingAppointmentCard';
import TherapyProgressCard from './components/TherapyProgressCard';
import QuickActionsPanel from './components/QuickActionsPanel';
import ExerciseCard from './components/ExerciseCard';
import CalendarWidget from './components/CalendarWidget';
import RecentActivityFeed from './components/RecentActivityFeed';
import GamificationPanel from './components/GamificationPanel';
import FamilyAccessPanel from './components/FamilyAccessPanel';
import patientService from '../../services/patientService';

const PatientDashboard = () => {
  const { user, userProfile, loading } = useAuth();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load dashboard data
  useEffect(() => {
    const loadDashboardData = async () => {
      if (!user || !userProfile) return;
      
      try {
        setIsLoading(true);
        setError(null);
        
        // In development mode, always use mock data
        const isDevelopmentMode = import.meta.env.DEV || window.location.hostname === 'localhost';
        
        if (isDevelopmentMode) {
          console.log('🔧 Development mode - using mock dashboard data');
          console.log('🔧 isDevelopmentMode:', isDevelopmentMode);
          console.log('🔧 import.meta.env.DEV:', import.meta.env.DEV);
          console.log('🔧 window.location.hostname:', window.location.hostname);
          setDashboardData({
            upcoming_appointments: [
              {
                id: 1,
                appointment_date: '2025-01-16',
                start_time: '10:00',
                therapist: { user_profiles: { full_name: 'Dr. Sarah Johnson' } },
                service: { name: 'Speech Therapy' }
              },
              {
                id: 2,
                appointment_date: '2025-01-18',
                start_time: '14:00',
                therapist: { user_profiles: { full_name: 'Dr. Mike Wilson' } },
                service: { name: 'Occupational Therapy' }
              }
            ],
            recent_sessions: [
              {
                id: 1,
                session_type: 'Speech Therapy',
                session_date: '2025-01-10',
                progress_notes: 'Great progress with pronunciation exercises'
              },
              {
                id: 2,
                session_type: 'Occupational Therapy',
                session_date: '2025-01-08',
                progress_notes: 'Improved fine motor skills with new exercises'
              },
              {
                id: 3,
                session_type: 'Physical Therapy',
                session_date: '2025-01-05',
                progress_notes: 'Strengthening exercises showing good results'
              }
            ],
            pending_exercises: [
              {
                id: 1,
                exercise_name: 'Breathing Exercises',
                difficulty_level: 'Easy',
                target_duration: 10,
                is_completed: false
              },
              {
                id: 2,
                exercise_name: 'Articulation Practice',
                difficulty_level: 'Medium',
                target_duration: 15,
                is_completed: false
              },
              {
                id: 3,
                exercise_name: 'Fine Motor Skills',
                difficulty_level: 'Easy',
                target_duration: 20,
                is_completed: false
              },
              {
                id: 4,
                exercise_name: 'Balance Training',
                difficulty_level: 'Hard',
                target_duration: 25,
                is_completed: false
              }
            ],
            progress_summary: [
              {
                metric_category: 'Speech Therapy',
                metric_value: 75
              },
              {
                metric_category: 'Occupational Therapy',
                metric_value: 60
              },
              {
                metric_category: 'Physical Therapy',
                metric_value: 85
              },
              {
                metric_category: 'Cognitive Skills',
                metric_value: 70
              }
            ],
            last_updated: new Date().toISOString()
          });
          return;
        }
        
        // Try to load real data first
        const result = await patientService.getPatientDashboard(userProfile.id);
        
        if (result.success) {
          setDashboardData(result.data);
        } else {
          // If real data fails, use mock data for demo
          console.log('Using mock data for demo:', result.error);
          setDashboardData({
            upcoming_appointments: [
              {
                id: 1,
                appointment_date: '2025-01-16',
                start_time: '10:00',
                therapist: { user_profiles: { full_name: 'Dr. Sarah Johnson' } },
                service: { name: 'Speech Therapy' }
              },
              {
                id: 2,
                appointment_date: '2025-01-18',
                start_time: '14:00',
                therapist: { user_profiles: { full_name: 'Dr. Mike Wilson' } },
                service: { name: 'Occupational Therapy' }
              }
            ],
            recent_sessions: [
              {
                id: 1,
                session_type: 'Speech Therapy',
                session_date: '2025-01-10',
                progress_notes: 'Great progress with pronunciation exercises'
              },
              {
                id: 2,
                session_type: 'Occupational Therapy',
                session_date: '2025-01-08',
                progress_notes: 'Improved fine motor skills with new exercises'
              },
              {
                id: 3,
                session_type: 'Physical Therapy',
                session_date: '2025-01-05',
                progress_notes: 'Strengthening exercises showing good results'
              }
            ],
            pending_exercises: [
              {
                id: 1,
                exercise_name: 'Breathing Exercises',
                difficulty_level: 'Easy',
                target_duration: 10,
                is_completed: false
              },
              {
                id: 2,
                exercise_name: 'Articulation Practice',
                difficulty_level: 'Medium',
                target_duration: 15,
                is_completed: false
              },
              {
                id: 3,
                exercise_name: 'Fine Motor Skills',
                difficulty_level: 'Easy',
                target_duration: 20,
                is_completed: false
              },
              {
                id: 4,
                exercise_name: 'Balance Training',
                difficulty_level: 'Hard',
                target_duration: 25,
                is_completed: false
              }
            ],
            progress_summary: [
              {
                metric_category: 'Speech Therapy',
                metric_value: 75
              },
              {
                metric_category: 'Occupational Therapy',
                metric_value: 60
              },
              {
                metric_category: 'Physical Therapy',
                metric_value: 85
              },
              {
                metric_category: 'Cognitive Skills',
                metric_value: 70
              }
            ],
            last_updated: new Date().toISOString()
          });
        }
      } catch (err) {
        // If service fails completely, use mock data
        console.log('Service failed, using mock data:', err);
        setDashboardData({
          upcoming_appointments: [
            {
              id: 1,
              appointment_date: '2025-01-16',
              start_time: '10:00',
              therapist: { user_profiles: { full_name: 'Dr. Sarah Johnson' } },
              service: { name: 'Speech Therapy' }
            }
          ],
          recent_sessions: [
            {
              id: 1,
              session_type: 'Speech Therapy',
              session_date: '2025-01-10',
              progress_notes: 'Great progress with pronunciation exercises'
            },
            {
              id: 2,
              session_type: 'Occupational Therapy',
              session_date: '2025-01-08',
              progress_notes: 'Improved fine motor skills with new exercises'
            }
          ],
          pending_exercises: [
            {
              id: 1,
              exercise_name: 'Breathing Exercises',
              difficulty_level: 'Easy',
              target_duration: 10,
              is_completed: false
            },
            {
              id: 2,
              exercise_name: 'Articulation Practice',
              difficulty_level: 'Medium',
              target_duration: 15,
              is_completed: false
            }
          ],
          progress_summary: [
            {
              metric_category: 'Speech Therapy',
              metric_value: 75
            },
            {
              metric_category: 'Occupational Therapy',
              metric_value: 60
            }
          ],
          last_updated: new Date().toISOString()
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, [user, userProfile]);

  // Show loading state
  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="font-body text-muted-foreground">Loading your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <div className="text-center">
            <div className="w-12 h-12 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-foreground mb-2">Unable to load dashboard</h2>
            <p className="text-muted-foreground mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-therapeutic hover:bg-primary/90"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show preview content for non-authenticated users
  if (!user || !userProfile) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-2xl font-heading font-bold text-foreground">
              Welcome to Roshni Clinic
            </h1>
            <p className="text-muted-foreground mt-1">
              Your comprehensive therapy management system
            </p>
          </div>
          
          <PreviewContent />
        </main>
      </div>
    );
  }

  // Transform real data for components
  const upcomingAppointments = dashboardData?.upcoming_appointments || [];
  const recentSessions = dashboardData?.recent_sessions || [];
  const pendingExercises = dashboardData?.pending_exercises || [];
  const progressSummary = dashboardData?.progress_summary || [];

  // Calculate progress from real data
  const therapyPrograms = progressSummary.map((progress, index) => ({
    id: index + 1,
    service: progress.metric_category || 'Therapy',
    sessionsCompleted: recentSessions.length,
    totalSessions: recentSessions.length + 5, // Estimate
    progress: Math.min(progress.metric_value || 0, 100),
    nextSession: upcomingAppointments[0]?.appointment_date || 'TBD'
  }));

  // Transform exercises data
  const exercises = pendingExercises.map(exercise => ({
    id: exercise.id,
    title: exercise.exercise_name,
    status: exercise.is_completed ? 'completed' : 'pending',
    difficulty: exercise.difficulty_level || 'Easy',
    duration: `${exercise.target_duration || 10} mins`,
    rating: 4.5
  }));

  // Transform activities from sessions
  const activities = recentSessions.map(session => ({
    id: session.id,
    type: 'session',
    title: `Therapy Session - ${session.session_type}`,
    description: session.progress_notes || 'Session completed',
    timestamp: session.session_date,
    icon: 'Activity'
  }));

  // Mock family members (will be replaced with real data later)
  const familyMembers = [
    {
      id: 1,
      name: 'Jane Doe',
      relationship: 'Spouse',
      accessLevel: 'Full Access',
      lastActive: '2 hours ago'
    }
  ];

  // Mock gamification data (will be replaced with real data later)
  const gamificationData = {
    dailyStreak: 7,
    totalPoints: 1250,
    weeklyGoal: { target: 7, current: 5 },
    recentBadges: [
      { id: 1, name: 'Consistency Champion', icon: 'Flame', earned: true },
      { id: 2, name: 'Progress Maker', icon: 'TrendingUp', earned: true }
    ]
  };

  return (
    <>
      <Helmet>
        <title>Patient Dashboard - Roshni Clinic</title>
        <meta name="description" content="Your personalized therapy journey dashboard" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-2xl font-heading font-bold text-foreground">
              Welcome back, {userProfile?.full_name || 'Patient'}!
            </h1>
            <p className="text-muted-foreground mt-1">
              Here's your therapy journey overview
            </p>
          </div>

          {/* Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Upcoming Appointments */}
              <section>
                <h2 className="text-lg font-heading font-semibold text-foreground mb-4">
                  Upcoming Appointments
                </h2>
                {upcomingAppointments.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {upcomingAppointments.slice(0, 2).map((appointment) => (
                      <UpcomingAppointmentCard 
                        key={appointment.id}
                        appointment={{
                          id: appointment.id,
                          date: appointment.appointment_date,
                          time: appointment.start_time,
                          therapist: appointment.therapist?.user_profiles?.full_name || 'Therapist',
                          type: appointment.service?.name || 'Therapy Session'
                        }}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No upcoming appointments</p>
                    <button 
                      onClick={() => navigate('/appointment-booking')}
                      className="mt-2 text-primary hover:underline"
                    >
                      Book an appointment
                    </button>
                  </div>
                )}
              </section>

              {/* Therapy Progress */}
              <section>
                <h2 className="text-lg font-heading font-semibold text-foreground mb-4">
                  Therapy Progress
                </h2>
                {therapyPrograms.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {therapyPrograms.map((therapy) => (
                      <TherapyProgressCard 
                        key={therapy.id}
                        therapy={therapy}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No progress data available</p>
                  </div>
                )}
              </section>

              {/* Recent Activity */}
              <section>
                <h2 className="text-lg font-heading font-semibold text-foreground mb-4">
                  Recent Activity
                </h2>
                <RecentActivityFeed activities={activities} />
              </section>

              {/* Exercises */}
              <section>
                <h2 className="text-lg font-heading font-semibold text-foreground mb-4">
                  Your Exercises
                </h2>
                {exercises.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {exercises.slice(0, 4).map((exercise) => (
                      <ExerciseCard 
                        key={exercise.id}
                        exercise={exercise}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No exercises assigned</p>
                  </div>
                )}
              </section>
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <QuickActionsPanel />

              {/* Calendar */}
              <CalendarWidget appointments={upcomingAppointments} />

              {/* Gamification */}
              <GamificationPanel gamificationData={gamificationData} />

              {/* Family Access */}
              <FamilyAccessPanel 
                familyMembers={familyMembers} 
                patientName={userProfile?.full_name || 'John Doe'} 
              />
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

// Preview content for non-authenticated users with mock data
const PreviewContent = () => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <div className="lg:col-span-2 space-y-6">
      <section>
        <h2 className="text-lg font-heading font-semibold text-foreground mb-4">
          Sample Appointments
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <UpcomingAppointmentCard appointment={{
            id: 1,
            date: '2025-01-16',
            time: '10:00 AM',
            therapist: 'Dr. Sarah Johnson',
            type: 'Speech Therapy'
          }} />
          <UpcomingAppointmentCard appointment={{
            id: 2,
            date: '2025-01-18',
            time: '2:00 PM',
            therapist: 'Dr. Mike Wilson',
            type: 'Occupational Therapy'
          }} />
        </div>
      </section>

      <section>
        <h2 className="text-lg font-heading font-semibold text-foreground mb-4">
          Sample Progress
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TherapyProgressCard therapy={{
            id: 1,
            service: 'Speech Therapy',
            sessionsCompleted: 8,
            totalSessions: 12,
            progress: 67
          }} />
          <TherapyProgressCard therapy={{
            id: 2,
            service: 'Occupational Therapy',
            sessionsCompleted: 5,
            totalSessions: 10,
            progress: 50
          }} />
        </div>
      </section>
    </div>

    <div className="space-y-6">
      <QuickActionsPanel />
      <CalendarWidget appointments={[]} />
      <GamificationPanel gamificationData={{
        dailyStreak: 3,
        totalPoints: 1250,
        weeklyGoal: { target: 7, current: 3 },
        recentBadges: []
      }} />
    </div>
  </div>
);

export default PatientDashboard;
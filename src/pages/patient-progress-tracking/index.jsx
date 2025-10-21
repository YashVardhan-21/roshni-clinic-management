import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import ProgressOverview from './components/ProgressOverview';
import ProgressCharts from './components/ProgressCharts';
import GoalsSection from './components/GoalsSection';
import SessionHistory from './components/SessionHistory';
import DetailedReports from './components/DetailedReports';

const PatientProgressTracking = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [isLoading, setIsLoading] = useState(true);

  // Check for saved language preference
  useEffect(() => {
    const savedLanguage = localStorage.getItem('selectedLanguage') || 'en';
    setCurrentLanguage(savedLanguage);
    
    // Simulate loading
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'BarChart3' },
    { id: 'charts', label: 'Progress Charts', icon: 'TrendingUp' },
    { id: 'goals', label: 'Goals & Milestones', icon: 'Target' },
    { id: 'sessions', label: 'Session History', icon: 'Calendar' },
    { id: 'reports', label: 'Detailed Reports', icon: 'FileText' }
  ];

  // Mock data for overview
  const overviewData = {
    metrics: [
      {
        id: 1,
        type: 'attendance',
        icon: 'Calendar',
        title: 'Session Attendance',
        description: 'Regular therapy sessions completed',
        value: 92,
        current: 23,
        total: 25,
        unit: 'sessions',
        trend: 'up',
        change: 8
      },
      {
        id: 2,
        type: 'completion',
        icon: 'CheckCircle',
        title: 'Exercise Completion',
        description: 'Home exercises completed on time',
        value: 78,
        current: 156,
        total: 200,
        unit: 'exercises',
        trend: 'up',
        change: 12
      },
      {
        id: 3,
        type: 'progress',
        icon: 'TrendingUp',
        title: 'Overall Progress',
        description: 'Combined therapy progress score',
        value: 85,
        current: 85,
        total: 100,
        unit: 'points',
        trend: 'up',
        change: 15
      }
    ],
    recentAchievements: [
      {
        id: 1,
        type: 'milestone',
        icon: 'Award',
        title: 'Speech Clarity Milestone',
        description: 'Achieved 90% clarity in pronunciation exercises',
        date: '2 days ago'
      },
      {
        id: 2,
        type: 'streak',
        icon: 'Flame',
        title: '30-Day Exercise Streak',
        description: 'Completed daily exercises for 30 consecutive days',
        date: '1 week ago'
      },
      {
        id: 3,
        type: 'improvement',
        icon: 'TrendingUp',
        title: 'Motor Skills Improvement',
        description: 'Fine motor coordination improved by 25%',
        date: '2 weeks ago'
      }
    ],
    quickStats: [
      { id: 1, value: '156', label: 'Total Sessions', period: 'This year' },
      { id: 2, value: '23', label: 'Goals Achieved', period: 'This quarter' },
      { id: 3, value: '4.8', label: 'Avg Rating', period: 'Session feedback' },
      { id: 4, value: '92%', label: 'Improvement', period: 'Since start' }
    ]
  };

  // Mock data for charts
  const chartData = {
    progressTrends: [
      { date: 'Jan 2024', overallScore: 45, speechScore: 40, motorScore: 50 },
      { date: 'Feb 2024', overallScore: 52, speechScore: 48, motorScore: 56 },
      { date: 'Mar 2024', overallScore: 58, speechScore: 55, motorScore: 61 },
      { date: 'Apr 2024', overallScore: 65, speechScore: 62, motorScore: 68 },
      { date: 'May 2024', overallScore: 72, speechScore: 70, motorScore: 74 },
      { date: 'Jun 2024', overallScore: 78, speechScore: 76, motorScore: 80 },
      { date: 'Jul 2024', overallScore: 85, speechScore: 83, motorScore: 87 }
    ],
    sessionActivity: [
      { week: 'Week 1', completed: 4, scheduled: 4 },
      { week: 'Week 2', completed: 3, scheduled: 4 },
      { week: 'Week 3', completed: 4, scheduled: 4 },
      { week: 'Week 4', completed: 4, scheduled: 4 },
      { week: 'Week 5', completed: 3, scheduled: 3 },
      { week: 'Week 6', completed: 4, scheduled: 4 }
    ],
    exercisePerformance: [
      { date: 'Week 1', accuracy: 65, completionTime: 85 },
      { date: 'Week 2', accuracy: 70, completionTime: 80 },
      { date: 'Week 3', accuracy: 75, completionTime: 75 },
      { date: 'Week 4', accuracy: 80, completionTime: 70 },
      { date: 'Week 5', accuracy: 85, completionTime: 65 },
      { date: 'Week 6', accuracy: 88, completionTime: 60 }
    ],
    goalAchievement: [
      { name: 'Speech Therapy', value: 85 },
      { name: 'Occupational Therapy', value: 78 },
      { name: 'Physical Therapy', value: 92 },
      { name: 'Home Exercises', value: 70 }
    ]
  };

  // Mock data for goals
  const goalsData = {
    summary: [
      { id: 1, type: 'completed', count: 23, label: 'Completed', percentage: 65 },
      { id: 2, type: 'active', count: 8, label: 'Active', percentage: 23 },
      { id: 3, type: 'pending', count: 4, label: 'Pending', percentage: 12 },
      { id: 4, type: 'overdue', count: 0, label: 'Overdue', percentage: 0 }
    ],
    goals: [
      {
        id: 1,
        category: 'speech',
        title: 'Improve Articulation Clarity',
        description: 'Focus on clear pronunciation of consonant sounds',
        status: 'in-progress',
        priority: 'high',
        progress: 85,
        targetDate: '2024-08-15',
        therapist: 'Dr. Sarah Johnson',
        completedSessions: 12,
        totalSessions: 15,
        milestones: [
          { id: 1, title: 'Master /r/ sound production', completed: true, completedDate: '2024-06-20' },
          { id: 2, title: 'Achieve 80% clarity in conversation', completed: true, completedDate: '2024-07-05' },
          { id: 3, title: 'Maintain clarity in rapid speech', completed: false }
        ],
        recentActivity: [
          { id: 1, date: '2024-07-12', description: 'Completed articulation drills with 90% accuracy' },
          { id: 2, date: '2024-07-10', description: 'Practiced conversation exercises for 30 minutes' }
        ]
      },
      {
        id: 2,
        category: 'occupational',
        title: 'Fine Motor Skill Development',
        description: 'Enhance hand-eye coordination and dexterity',
        status: 'in-progress',
        priority: 'medium',
        progress: 72,
        targetDate: '2024-09-01',
        therapist: 'Dr. Michael Chen',
        completedSessions: 8,
        totalSessions: 12,
        milestones: [
          { id: 1, title: 'Improve grip strength by 25%', completed: true, completedDate: '2024-06-15' },
          { id: 2, title: 'Complete threading exercises', completed: false },
          { id: 3, title: 'Master writing coordination', completed: false }
        ],
        recentActivity: [
          { id: 1, date: '2024-07-11', description: 'Completed fine motor exercises with improved precision' }
        ]
      },
      {
        id: 3,
        category: 'physical',
        title: 'Balance and Coordination',
        description: 'Improve overall balance and body coordination',
        status: 'completed',
        priority: 'low',
        progress: 100,
        targetDate: '2024-07-01',
        therapist: 'Dr. Lisa Rodriguez',
        completedSessions: 10,
        totalSessions: 10,
        milestones: [
          { id: 1, title: 'Stand on one foot for 30 seconds', completed: true, completedDate: '2024-06-10' },
          { id: 2, title: 'Walk in straight line without support', completed: true, completedDate: '2024-06-25' },
          { id: 3, title: 'Complete balance beam exercise', completed: true, completedDate: '2024-07-01' }
        ],
        recentActivity: [
          { id: 1, date: '2024-07-01', description: 'Successfully completed all balance objectives' }
        ]
      }
    ]
  };

  // Mock data for session history
  const sessionData = {
    statistics: [
      { id: 1, value: '156', label: 'Total Sessions', period: 'All time' },
      { id: 2, value: '23', label: 'This Month', period: 'July 2024' },
      { id: 3, value: '4.8', label: 'Avg Rating', period: 'Patient feedback' },
      { id: 4, value: '92%', label: 'Attendance', period: 'Last 3 months' }
    ],
    sessions: [
      {
        id: 1,
        title: 'Speech Therapy - Articulation Focus',
        therapyType: 'speech',
        date: '2024-07-12',
        duration: '45 minutes',
        therapist: 'Sarah Johnson',
        status: 'completed',
        rating: 5,
        notes: `Excellent progress in today's session. Patient demonstrated significant improvement in /r/ sound production with 90% accuracy in structured exercises. Conversation practice showed marked improvement in overall clarity.\n\nPatient was highly engaged and motivated throughout the session. Completed all assigned exercises with enthusiasm and showed good retention of previous techniques.`,
        exercises: [
          { id: 1, name: 'Articulation Drills', duration: '15 min', performance: 90 },
          { id: 2, name: 'Conversation Practice', duration: '20 min', performance: 85 },
          { id: 3, name: 'Reading Aloud', duration: '10 min', performance: 88 }
        ],
        progressIndicators: [
          { id: 1, skill: 'Sound Production', score: 9 },
          { id: 2, skill: 'Fluency', score: 8 },
          { id: 3, skill: 'Clarity', score: 9 },
          { id: 4, skill: 'Confidence', score: 8 }
        ],
        recommendations: [
          'Continue daily articulation practice at home','Focus on maintaining clarity during rapid speech','Practice conversation with family members','Record speech samples for self-assessment'
        ],
        homeExercises: [
          'Practice /r/ sound production 10 minutes daily','Read aloud for 15 minutes each evening','Complete tongue twisters focusing on problem sounds'
        ]
      },
      {
        id: 2,
        title: 'Occupational Therapy - Fine Motor Skills',therapyType: 'occupational',date: '2024-07-11',duration: '60 minutes',therapist: 'Michael Chen',status: 'completed',
        rating: 4,
        notes: `Good session focusing on fine motor coordination. Patient showed improvement in grip strength and precision tasks. Threading exercises were challenging but patient persevered and showed gradual improvement.\n\nRecommend continuing current exercise regimen with slight increase in difficulty level for next session.`,
        exercises: [
          { id: 1, name: 'Threading Beads', duration: '20 min', performance: 75 },
          { id: 2, name: 'Grip Strengthening', duration: '15 min', performance: 80 },
          { id: 3, name: 'Writing Exercises', duration: '25 min', performance: 70 }
        ],
        progressIndicators: [
          { id: 1, skill: 'Grip Strength', score: 8 },
          { id: 2, skill: 'Precision', score: 7 },
          { id: 3, skill: 'Coordination', score: 7 },
          { id: 4, skill: 'Endurance', score: 6 }
        ],
        recommendations: [
          'Increase threading exercise difficulty','Add more writing practice sessions','Focus on bilateral coordination tasks','Monitor fatigue levels during exercises'
        ],
        homeExercises: [
          'Practice buttoning and unbuttoning clothes','Use tweezers to pick up small objects','Complete daily writing exercises for 10 minutes'
        ]
      },
      {
        id: 3,
        title: 'Physical Therapy - Balance Training',therapyType: 'physical',date: '2024-07-10',duration: '45 minutes',therapist: 'Lisa Rodriguez',status: 'completed',
        rating: 5,
        notes: `Outstanding session with excellent balance improvements. Patient successfully completed all balance challenges including single-leg stands and dynamic balance exercises.\n\nPatient demonstrated increased confidence and stability. Ready to progress to more advanced balance training in upcoming sessions.`,
        exercises: [
          { id: 1, name: 'Single Leg Stand', duration: '10 min', performance: 95 },
          { id: 2, name: 'Balance Beam Walk', duration: '15 min', performance: 90 },
          { id: 3, name: 'Dynamic Balance', duration: '20 min', performance: 88 }
        ],
        progressIndicators: [
          { id: 1, skill: 'Static Balance', score: 9 },
          { id: 2, skill: 'Dynamic Balance', score: 9 },
          { id: 3, skill: 'Confidence', score: 8 },
          { id: 4, skill: 'Stability', score: 9 }
        ],
        recommendations: [
          'Progress to advanced balance challenges','Incorporate balance training into daily activities','Continue strength building exercises','Maintain current exercise frequency'
        ],
        homeExercises: [
          'Practice single-leg stands while brushing teeth','Walk heel-to-toe in hallway daily','Complete balance exercises on uneven surfaces'
        ]
      }
    ]
  };

  // Mock data for detailed reports
  const reportsData = {
    assessmentReports: [
      {
        id: 1,
        title: 'Comprehensive Speech Assessment',
        therapist: 'Sarah Johnson',
        date: '2024-07-01',
        scores: [
          { category: 'Articulation', current: 85, maximum: 100, trend: 'up', change: 15 },
          { category: 'Fluency', current: 78, maximum: 100, trend: 'up', change: 12 },
          { category: 'Voice Quality', current: 92, maximum: 100, trend: 'up', change: 8 },
          { category: 'Language Comprehension', current: 88, maximum: 100, trend: 'up', change: 10 }
        ],
        keyFindings: `Patient demonstrates significant improvement across all speech parameters. Articulation clarity has improved by 15% since the last assessment, with particular strength in consonant production. Fluency shows steady progress with reduced hesitations and improved rhythm. Voice quality remains excellent with good breath support and projection.`,
        strengths: [
          'Excellent motivation and engagement in therapy',
          'Strong retention of learned techniques',
          'Good self-awareness of speech patterns',
          'Consistent practice of home exercises'
        ],
        improvements: [
          'Continue focus on rapid speech clarity',
          'Work on maintaining fluency under stress',
          'Practice in varied social situations',
          'Develop self-monitoring skills'
        ]
      }
    ],
    progressSummary: {
      overallProgress: 85,
      categories: [
        {
          name: 'Speech Therapy',
          skills: [
            { name: 'Articulation', progress: 85 },
            { name: 'Fluency', progress: 78 },
            { name: 'Voice Quality', progress: 92 }
          ]
        },
        {
          name: 'Occupational Therapy',
          skills: [
            { name: 'Fine Motor Skills', progress: 72 },
            { name: 'Hand-Eye Coordination', progress: 80 },
            { name: 'Daily Living Skills', progress: 88 }
          ]
        }
      ]
    },
    comparisonData: [
      {
        skill: 'Speech Articulation',
        beforeDate: '2024-01-15',
        afterDate: '2024-07-15',
        beforeMetrics: [
          { name: 'Clarity Score', value: '45/100' },
          { name: 'Accuracy Rate', value: '60%' },
          { name: 'Confidence Level', value: '3/10' }
        ],
        afterMetrics: [
          { name: 'Clarity Score', value: '85/100' },
          { name: 'Accuracy Rate', value: '90%' },
          { name: 'Confidence Level', value: '8/10' }
        ],
        improvementSummary: 'Remarkable improvement in speech clarity with 40-point increase in overall score. Patient now demonstrates 90% accuracy in articulation exercises and shows significantly increased confidence in communication.'
      }
    ],
    recommendations: [
      {
        category: 'Speech Therapy',
        icon: 'Mic',
        items: [
          {
            id: 1,
            title: 'Advanced Articulation Training',
            description: 'Progress to complex sound combinations and rapid speech exercises',
            priority: 'high',
            actionItems: [
              'Practice tongue twisters daily',
              'Record and analyze speech samples',
              'Engage in challenging conversation topics'
            ]
          }
        ]
      },
      {
        category: 'Home Practice',
        icon: 'Home',
        items: [
          {
            id: 1,
            title: 'Daily Exercise Routine',
            description: 'Maintain consistent practice schedule for optimal progress',
            priority: 'medium',
            actionItems: [
              'Set daily practice reminders',
              'Track progress in exercise log',
              'Involve family members in practice sessions'
            ]
          }
        ]
      }
    ]
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <ProgressOverview overviewData={overviewData} />;
      case 'charts':
        return <ProgressCharts chartData={chartData} />;
      case 'goals':
        return <GoalsSection goalsData={goalsData} />;
      case 'sessions':
        return <SessionHistory sessionData={sessionData} />;
      case 'reports':
        return <DetailedReports reportsData={reportsData} />;
      default:
        return <ProgressOverview overviewData={overviewData} />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="font-body text-muted-foreground">Loading progress data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-6 lg:py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-primary/10 rounded-therapeutic flex items-center justify-center">
              <Icon name="TrendingUp" size={24} className="text-primary" />
            </div>
            <div>
              <h1 className="font-heading font-bold text-2xl lg:text-3xl text-foreground">
                Progress Tracking
              </h1>
              <p className="font-body text-muted-foreground">
                Monitor your therapy progress and achievements
              </p>
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" size="sm" iconName="Download" iconPosition="left">
              Export Report
            </Button>
            <Button variant="outline" size="sm" iconName="Share" iconPosition="left">
              Share Progress
            </Button>
            <Button variant="outline" size="sm" iconName="Calendar" iconPosition="left">
              Schedule Review
            </Button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="border-b border-border">
            <div className="flex space-x-1 overflow-x-auto pb-px">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-3 font-body text-sm whitespace-nowrap transition-colors duration-200 border-b-2 ${
                    activeTab === tab.id
                      ? 'border-primary text-primary bg-primary/5' :'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
                >
                  <Icon name={tab.icon} size={16} />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="animate-gentle-fade">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default PatientProgressTracking;
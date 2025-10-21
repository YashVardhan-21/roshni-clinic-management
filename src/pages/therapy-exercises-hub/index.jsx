import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import DailyChallengeCard from './components/DailyChallengeCard';
import TherapyTabs from './components/TherapyTabs';
import FilterControls from './components/FilterControls';
import ExerciseCard from './components/ExerciseCard';
import AchievementBadges from './components/AchievementBadges';
import ProgressStats from './components/ProgressStats';
import ExerciseModal from './components/ExerciseModal';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const TherapyExercisesHub = () => {
  const [activeTab, setActiveTab] = useState('speech');
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    difficulty: 'all',
    duration: 'all',
    sort: 'recommended'
  });

  // Mock data for daily challenge
  const dailyChallenge = {
    id: 'daily-001',
    title: 'Pronunciation Perfect',
    description: 'Practice 10 common words with voice recognition feedback',
    duration: 8,
    points: 50,
    streak: 7,
    completedToday: 1
  };

  // Mock data for therapy tabs
  const therapyTabs = [
    {
      id: 'speech',
      label: 'Speech Therapy',
      shortLabel: 'Speech',
      icon: 'Mic',
      count: 24
    },
    {
      id: 'occupational',
      label: 'Occupational Therapy',
      shortLabel: 'OT',
      icon: 'Hand',
      count: 18
    },
    {
      id: 'physiotherapy',
      label: 'Physiotherapy',
      shortLabel: 'PT',
      icon: 'Activity',
      count: 22
    }
  ];

  // Mock data for exercises
  const allExercises = {
    speech: [
      {
        id: 'sp-001',
        title: 'Voice Recognition Training',
        description: 'Practice clear pronunciation with real-time feedback and scoring system',
        thumbnail: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop',
        difficulty: 'Beginner',
        duration: 5,
        points: 25,
        progress: 85,
        completedBy: 1247,
        bestScore: '92%',
        isCompleted: true,
        isLocked: false,
        instructions: [
          'Put on your headphones for better audio quality',
          'Click the microphone button to start recording',
          'Speak clearly and at normal pace',
          'Review your pronunciation score and try again if needed'
        ],
        benefits: [
          'Improves speech clarity',
          'Builds pronunciation confidence',
          'Tracks speaking progress',
          'Provides instant feedback'
        ]
      },
      {
        id: 'sp-002',
        title: 'Articulation Drills',
        description: 'Targeted exercises for specific sound production and articulation improvement',
        thumbnail: 'https://images.pexels.com/photos/5428836/pexels-photo-5428836.jpeg?w=400&h=300&fit=crop',
        difficulty: 'Intermediate',
        duration: 10,
        points: 40,
        progress: 60,
        completedBy: 892,
        bestScore: '78%',
        isCompleted: false,
        isLocked: false,
        instructions: [
          'Focus on the target sound highlighted in red',
          'Practice each word 3 times slowly',
          'Record yourself and compare with the model',
          'Complete all 15 words in the set'
        ],
        benefits: [
          'Targets specific speech sounds',
          'Improves articulation accuracy',
          'Builds muscle memory',
          'Enhances speech intelligibility'
        ]
      },
      {
        id: 'sp-003',
        title: 'Vocabulary Builder Pro',
        description: 'Interactive word games and exercises to expand vocabulary and language skills',
        thumbnail: 'https://images.pixabay.com/photo/2016/12/27/21/03/books-1934406_1280.jpg?w=400&h=300&fit=crop',
        difficulty: 'Advanced',
        duration: 15,
        points: 60,
        progress: 0,
        completedBy: 543,
        bestScore: null,
        isCompleted: false,
        isLocked: true,
        instructions: [
          'Complete beginner and intermediate levels first',
          'Match words with their definitions',
          'Use new words in sentence construction',
          'Complete the vocabulary quiz at the end'
        ],
        benefits: [
          'Expands vocabulary range',
          'Improves word comprehension',
          'Enhances language expression',
          'Builds communication confidence'
        ]
      }
    ],
    occupational: [
      {
        id: 'ot-001',
        title: 'Fine Motor Skills Challenge',
        description: 'Hand coordination exercises using touch-based interactions and precision tasks',
        thumbnail: 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&h=300&fit=crop',
        difficulty: 'Beginner',
        duration: 8,
        points: 30,
        progress: 70,
        completedBy: 1156,
        bestScore: '88%',
        isCompleted: false,
        isLocked: false,
        instructions: [
          'Use precise finger movements for each task',
          'Complete the pattern matching exercise',
          'Practice the virtual button pressing sequence',
          'Maintain steady hand position throughout'
        ],
        benefits: [
          'Improves hand-eye coordination',
          'Enhances fine motor control',
          'Builds dexterity skills',
          'Increases precision accuracy'
        ]
      },
      {
        id: 'ot-002',
        title: 'Daily Living Simulator',
        description: 'Virtual practice of everyday activities like cooking, cleaning, and self-care tasks',
        thumbnail: 'https://images.pexels.com/photos/4226140/pexels-photo-4226140.jpeg?w=400&h=300&fit=crop',
        difficulty: 'Intermediate',
        duration: 12,
        points: 45,
        progress: 45,
        completedBy: 789,
        bestScore: '76%',
        isCompleted: false,
        isLocked: false,
        instructions: [
          'Choose a daily activity to practice',
          'Follow the step-by-step visual guide',
          'Complete each action in the correct sequence',
          'Review your performance and timing'
        ],
        benefits: [
          'Practices real-world skills',
          'Builds independence confidence',
          'Improves task sequencing',
          'Enhances daily functioning'
        ]
      },
      {
        id: 'ot-003',
        title: 'Cognitive Puzzle Master',
        description: 'Brain training exercises combining memory, attention, and problem-solving challenges',
        thumbnail: 'https://images.pixabay.com/photo/2017/10/24/00/39/puzzle-2880214_1280.jpg?w=400&h=300&fit=crop',
        difficulty: 'Advanced',
        duration: 20,
        points: 75,
        progress: 25,
        completedBy: 432,
        bestScore: '65%',
        isCompleted: false,
        isLocked: false,
        instructions: [
          'Start with the memory pattern exercise',
          'Progress through increasing difficulty levels',
          'Use logical reasoning for puzzle solutions',
          'Complete all 5 cognitive challenges'
        ],
        benefits: [
          'Enhances cognitive flexibility',
          'Improves problem-solving skills',
          'Strengthens memory function',
          'Builds mental processing speed'
        ]
      }
    ],
    physiotherapy: [
      {
        id: 'pt-001',
        title: 'Movement Tracking Basics',
        description: 'Camera-based exercise tracking for basic movements and posture correction',
        thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
        difficulty: 'Beginner',
        duration: 6,
        points: 20,
        progress: 90,
        completedBy: 1523,
        bestScore: '95%',
        isCompleted: true,
        isLocked: false,
        instructions: [
          'Position yourself in front of the camera',
          'Follow the on-screen movement guide',
          'Maintain proper form throughout',
          'Complete 3 sets of each exercise'
        ],
        benefits: [
          'Improves movement awareness',
          'Corrects posture alignment',
          'Builds movement confidence',
          'Tracks exercise accuracy'
        ]
      },
      {
        id: 'pt-002',
        title: 'Strength Building Routine',
        description: 'Progressive resistance exercises designed to build muscle strength and endurance',
        thumbnail: 'https://images.pexels.com/photos/416778/pexels-photo-416778.jpeg?w=400&h=300&fit=crop',
        difficulty: 'Intermediate',
        duration: 18,
        points: 55,
        progress: 35,
        completedBy: 967,
        bestScore: '82%',
        isCompleted: false,
        isLocked: false,
        instructions: [
          'Warm up with 5 minutes of light movement',
          'Follow the strength exercise sequence',
          'Rest 30 seconds between each set',
          'Cool down with stretching exercises'
        ],
        benefits: [
          'Builds muscle strength',
          'Improves endurance capacity',
          'Enhances functional movement',
          'Prevents muscle weakness'
        ]
      },
      {
        id: 'pt-003',
        title: 'Balance & Coordination Pro',
        description: 'Advanced balance challenges using motion sensors and stability exercises',
        thumbnail: 'https://images.pixabay.com/photo/2017/08/07/14/02/man-2604149_1280.jpg?w=400&h=300&fit=crop',
        difficulty: 'Advanced',
        duration: 25,
        points: 80,
        progress: 15,
        completedBy: 298,
        bestScore: '71%',
        isCompleted: false,
        isLocked: false,
        instructions: [
          'Stand on the balance platform if available',
          'Follow the stability challenge sequence',
          'Maintain balance for the required duration',
          'Progress through increasing difficulty levels'
        ],
        benefits: [
          'Improves balance control',
          'Enhances coordination skills',
          'Reduces fall risk',
          'Builds core stability'
        ]
      }
    ]
  };

  // Mock data for achievements
  const achievements = [
    {
      id: 'ach-001',
      title: 'Speech Streak',
      description: '7 days of consistent practice',
      icon: 'Flame',
      type: 'gold',
      points: 100
    },
    {
      id: 'ach-002',
      title: 'Perfect Score',
      description: 'Scored 100% on an exercise',
      icon: 'Star',
      type: 'silver',
      points: 75
    },
    {
      id: 'ach-003',
      title: 'First Steps',
      description: 'Completed first exercise',
      icon: 'Award',
      type: 'bronze',
      points: 25
    }
  ];

  // Mock data for progress stats
  const progressStats = {
    totalPoints: 1247,
    daysActive: 23,
    completedExercises: 18,
    timeSpent: 12.5
  };

  // Filter exercises based on current filters
  const getFilteredExercises = () => {
    let exercises = allExercises[activeTab] || [];

    // Apply difficulty filter
    if (filters.difficulty !== 'all') {
      exercises = exercises.filter(ex => ex.difficulty === filters.difficulty);
    }

    // Apply duration filter
    if (filters.duration !== 'all') {
      const [min, max] = filters.duration.split('-').map(Number);
      if (filters.duration === '15+') {
        exercises = exercises.filter(ex => ex.duration >= 15);
      } else {
        exercises = exercises.filter(ex => ex.duration >= min && ex.duration <= max);
      }
    }

    // Apply sorting
    switch (filters.sort) {
      case 'difficulty':
        exercises.sort((a, b) => {
          const order = { 'Beginner': 1, 'Intermediate': 2, 'Advanced': 3 };
          return order[a.difficulty] - order[b.difficulty];
        });
        break;
      case 'duration':
        exercises.sort((a, b) => a.duration - b.duration);
        break;
      case 'progress':
        exercises.sort((a, b) => b.progress - a.progress);
        break;
      case 'popular':
        exercises.sort((a, b) => b.completedBy - a.completedBy);
        break;
      default:
        // Keep recommended order (default array order)
        break;
    }

    return exercises;
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleResetFilters = () => {
    setFilters({
      difficulty: 'all',
      duration: 'all',
      sort: 'recommended'
    });
  };

  const handleStartChallenge = (challenge) => {
    console.log('Starting daily challenge:', challenge);
    // Implement challenge start logic
  };

  const handleStartExercise = (exercise) => {
    console.log('Starting exercise:', exercise);
    // Implement exercise start logic
  };

  const handleExerciseClick = (exercise) => {
    setSelectedExercise(exercise);
    setIsModalOpen(true);
  };

  const handleViewAllAchievements = () => {
    console.log('Viewing all achievements');
    // Implement navigation to achievements page
  };

  const filteredExercises = getFilteredExercises();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="font-heading font-bold text-3xl text-foreground mb-2">
                Therapy Exercises Hub
              </h1>
              <p className="text-muted-foreground">
                Interactive exercises tailored to your treatment plan and progress level
              </p>
            </div>
            <div className="hidden md:flex items-center space-x-3">
              <Button
                variant="outline"
                iconName="BarChart3"
                iconPosition="left"
                onClick={() => window.location.href = '/patient-progress-tracking'}
              >
                View Progress
              </Button>
              <Button
                variant="default"
                iconName="Calendar"
                iconPosition="left"
                onClick={() => window.location.href = '/appointment-booking'}
              >
                Book Session
              </Button>
            </div>
          </div>
        </div>

        {/* Progress Stats */}
        <ProgressStats stats={progressStats} />

        {/* Daily Challenge */}
        <DailyChallengeCard
          challenge={dailyChallenge}
          onStartChallenge={handleStartChallenge}
        />

        {/* Achievement Badges */}
        <AchievementBadges
          achievements={achievements}
          onViewAll={handleViewAllAchievements}
        />

        {/* Therapy Type Tabs */}
        <TherapyTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          tabs={therapyTabs}
        />

        {/* Filter Controls */}
        <FilterControls
          filters={filters}
          onFilterChange={handleFilterChange}
          onResetFilters={handleResetFilters}
        />

        {/* Exercise Grid */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-heading font-semibold text-xl text-foreground">
              {therapyTabs.find(tab => tab.id === activeTab)?.label} Exercises
            </h2>
            <span className="text-sm text-muted-foreground">
              {filteredExercises.length} exercise{filteredExercises.length !== 1 ? 's' : ''} available
            </span>
          </div>

          {filteredExercises.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredExercises.map((exercise) => (
                <ExerciseCard
                  key={exercise.id}
                  exercise={exercise}
                  onStartExercise={handleExerciseClick}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Icon name="Search" size={48} className="text-muted-foreground mx-auto mb-4" />
              <h3 className="font-heading font-medium text-lg text-foreground mb-2">
                No exercises found
              </h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your filters or explore different therapy types
              </p>
              <Button
                variant="outline"
                onClick={handleResetFilters}
                iconName="RotateCcw"
                iconPosition="left"
              >
                Reset Filters
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Action Buttons */}
        <div className="md:hidden fixed bottom-4 left-4 right-4 flex space-x-3">
          <Button
            variant="outline"
            fullWidth
            iconName="BarChart3"
            iconPosition="left"
            onClick={() => window.location.href = '/patient-progress-tracking'}
          >
            Progress
          </Button>
          <Button
            variant="default"
            fullWidth
            iconName="Calendar"
            iconPosition="left"
            onClick={() => window.location.href = '/appointment-booking'}
          >
            Book Session
          </Button>
        </div>
      </main>

      {/* Exercise Detail Modal */}
      <ExerciseModal
        exercise={selectedExercise}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onStartExercise={handleStartExercise}
      />
    </div>
  );
};

export default TherapyExercisesHub;
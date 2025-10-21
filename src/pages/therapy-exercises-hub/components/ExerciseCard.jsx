import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const ExerciseCard = ({ exercise, onStartExercise }) => {
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return 'text-success bg-success/10';
      case 'Intermediate': return 'text-warning bg-warning/10';
      case 'Advanced': return 'text-error bg-error/10';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'bg-success';
    if (progress >= 50) return 'bg-warning';
    return 'bg-primary';
  };

  return (
    <div className="bg-card border border-border rounded-therapeutic shadow-therapeutic hover:shadow-therapeutic-lg transition-all duration-200 overflow-hidden">
      {/* Exercise Image/Thumbnail */}
      <div className="relative h-40 overflow-hidden">
        <Image
          src={exercise.thumbnail}
          alt={exercise.title}
          className="w-full h-full object-cover"
        />
        {exercise.isLocked && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="text-center text-white">
              <Icon name="Lock" size={32} className="mx-auto mb-2" />
              <p className="text-sm font-medium">Locked</p>
            </div>
          </div>
        )}
        {exercise.isCompleted && (
          <div className="absolute top-2 right-2 w-8 h-8 bg-success rounded-full flex items-center justify-center">
            <Icon name="Check" size={16} className="text-white" />
          </div>
        )}
        <div className="absolute top-2 left-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(exercise.difficulty)}`}>
            {exercise.difficulty}
          </span>
        </div>
      </div>

      {/* Exercise Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-heading font-medium text-base text-foreground line-clamp-2">
            {exercise.title}
          </h3>
          {exercise.bestScore && (
            <div className="flex items-center space-x-1 text-accent">
              <Icon name="Trophy" size={14} />
              <span className="text-xs font-mono">{exercise.bestScore}</span>
            </div>
          )}
        </div>

        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
          {exercise.description}
        </p>

        {/* Exercise Stats */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1">
              <Icon name="Clock" size={14} className="text-muted-foreground" />
              <span className="text-xs text-muted-foreground">{exercise.duration} min</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="Star" size={14} className="text-accent" />
              <span className="text-xs text-muted-foreground">{exercise.points} pts</span>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <Icon name="Users" size={14} className="text-muted-foreground" />
            <span className="text-xs text-muted-foreground">{exercise.completedBy} completed</span>
          </div>
        </div>

        {/* Progress Bar */}
        {exercise.progress > 0 && (
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-muted-foreground">Progress</span>
              <span className="text-xs font-mono text-foreground">{exercise.progress}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(exercise.progress)}`}
                style={{ width: `${exercise.progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Action Button */}
        <Button
          variant={exercise.isLocked ? "outline" : "default"}
          size="sm"
          fullWidth
          disabled={exercise.isLocked}
          onClick={() => onStartExercise(exercise)}
          iconName={exercise.isLocked ? "Lock" : exercise.isCompleted ? "RotateCcw" : "Play"}
          iconPosition="left"
        >
          {exercise.isLocked ? "Locked" : exercise.isCompleted ? "Practice Again" : "Start Exercise"}
        </Button>
      </div>
    </div>
  );
};

export default ExerciseCard;
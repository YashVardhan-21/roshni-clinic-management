import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ExerciseCard = ({ exercise = {}, onContinue = () => {} }) => {
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-success text-success-foreground';
      case 'in progress':
        return 'bg-warning text-warning-foreground';
      case 'not started':
        return 'bg-muted text-muted-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'CheckCircle';
      case 'in progress':
        return 'Clock';
      case 'not started':
        return 'Circle';
      default:
        return 'Circle';
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'text-success';
      case 'medium':
        return 'text-warning';
      case 'hard':
        return 'text-error';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <div className="bg-card border border-border rounded-therapeutic p-4 shadow-therapeutic hover:shadow-therapeutic-lg transition-all duration-200 min-w-[280px] flex-shrink-0">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className={`px-2 py-1 rounded-gentle text-xs font-medium ${getStatusColor(exercise.status || 'pending')}`}>
            <Icon name={getStatusIcon(exercise.status || 'pending')} size={12} className="inline mr-1" />
            {exercise.status || 'pending'}
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <Icon name="Star" size={14} className="text-warning fill-current" />
          <span className="font-mono text-sm text-foreground">{exercise.rating}</span>
        </div>
      </div>

      <div className="mb-3">
        <h4 className="font-heading font-medium text-base text-foreground mb-1">{exercise.title}</h4>
        <p className="font-body text-sm text-muted-foreground line-clamp-2">{exercise.description}</p>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <Icon name="Clock" size={14} className="text-muted-foreground" />
            <span className="font-caption text-xs text-muted-foreground">{exercise.duration}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Icon name="BarChart3" size={14} className={getDifficultyColor(exercise.difficulty)} />
            <span className={`font-caption text-xs ${getDifficultyColor(exercise.difficulty)}`}>
              {exercise.difficulty}
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <Icon name="Coins" size={14} className="text-primary" />
          <span className="font-mono text-sm font-medium text-primary">{exercise.points}</span>
        </div>
      </div>

      {exercise.progress && (
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1">
            <span className="font-caption text-xs text-muted-foreground">Progress</span>
            <span className="font-mono text-xs text-muted-foreground">{exercise.progress}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-1.5">
            <div 
              className="h-1.5 bg-primary rounded-full transition-all duration-300"
              style={{ width: `${exercise.progress}%` }}
            ></div>
          </div>
        </div>
      )}

      <Button
        variant={exercise.status === 'completed' ? 'outline' : 'default'}
        size="sm"
        fullWidth
        iconName={exercise.status === 'completed' ? 'RotateCcw' : 'Play'}
        iconPosition="left"
        onClick={() => onContinue(exercise.id)}
      >
        {exercise.status === 'completed' ? 'Retry' : 'Continue'}
      </Button>
    </div>
  );
};

export default ExerciseCard;
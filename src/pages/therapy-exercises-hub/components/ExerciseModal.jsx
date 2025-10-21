import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const ExerciseModal = ({ exercise, isOpen, onClose, onStartExercise }) => {
  if (!isOpen || !exercise) return null;

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return 'text-success bg-success/10';
      case 'Intermediate': return 'text-warning bg-warning/10';
      case 'Advanced': return 'text-error bg-error/10';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-therapeutic shadow-therapeutic-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="font-heading font-semibold text-xl text-foreground">
            Exercise Details
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Exercise Image */}
          <div className="relative h-48 rounded-therapeutic overflow-hidden mb-6">
            <Image
              src={exercise.thumbnail}
              alt={exercise.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(exercise.difficulty)}`}>
                {exercise.difficulty}
              </span>
            </div>
          </div>

          {/* Exercise Info */}
          <div className="mb-6">
            <h3 className="font-heading font-semibold text-lg text-foreground mb-2">
              {exercise.title}
            </h3>
            <p className="text-muted-foreground mb-4">
              {exercise.description}
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-3 bg-muted rounded-gentle">
                <Icon name="Clock" size={20} className="text-primary mx-auto mb-1" />
                <p className="text-sm font-mono text-foreground">{exercise.duration} min</p>
                <p className="text-xs text-muted-foreground">Duration</p>
              </div>
              <div className="text-center p-3 bg-muted rounded-gentle">
                <Icon name="Star" size={20} className="text-accent mx-auto mb-1" />
                <p className="text-sm font-mono text-foreground">{exercise.points} pts</p>
                <p className="text-xs text-muted-foreground">Points</p>
              </div>
              <div className="text-center p-3 bg-muted rounded-gentle">
                <Icon name="Users" size={20} className="text-secondary mx-auto mb-1" />
                <p className="text-sm font-mono text-foreground">{exercise.completedBy}</p>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
              <div className="text-center p-3 bg-muted rounded-gentle">
                <Icon name="Trophy" size={20} className="text-warning mx-auto mb-1" />
                <p className="text-sm font-mono text-foreground">{exercise.bestScore || 'N/A'}</p>
                <p className="text-xs text-muted-foreground">Best Score</p>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="mb-6">
            <h4 className="font-heading font-medium text-foreground mb-3 flex items-center space-x-2">
              <Icon name="BookOpen" size={18} />
              <span>Instructions</span>
            </h4>
            <div className="bg-muted rounded-gentle p-4">
              <ol className="space-y-2 text-sm text-foreground">
                {exercise.instructions?.map((instruction, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="flex-shrink-0 w-5 h-5 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-mono">
                      {index + 1}
                    </span>
                    <span>{instruction}</span>
                  </li>
                )) || (
                  <li className="flex items-start space-x-2">
                    <span className="flex-shrink-0 w-5 h-5 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-mono">1</span>
                    <span>Follow the on-screen prompts and complete the exercise</span>
                  </li>
                )}
              </ol>
            </div>
          </div>

          {/* Benefits */}
          <div className="mb-6">
            <h4 className="font-heading font-medium text-foreground mb-3 flex items-center space-x-2">
              <Icon name="Heart" size={18} />
              <span>Benefits</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {(exercise.benefits || [
                'Improves motor skills',
                'Enhances coordination',
                'Builds confidence',
                'Tracks progress'
              ]).map((benefit, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Icon name="Check" size={16} className="text-success" />
                  <span className="text-sm text-foreground">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-border">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            variant="default"
            onClick={() => {
              onStartExercise(exercise);
              onClose();
            }}
            iconName="Play"
            iconPosition="left"
            disabled={exercise.isLocked}
          >
            {exercise.isLocked ? 'Locked' : 'Start Exercise'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ExerciseModal;
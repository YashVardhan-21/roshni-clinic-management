import React from 'react';
import Icon from '../../../components/AppIcon';

const TherapyProgressCard = ({ therapy = {} }) => {
  const getServiceIcon = (service) => {
    switch (service.toLowerCase()) {
      case 'speech therapy':
        return 'MessageCircle';
      case 'occupational therapy':
        return 'Hand';
      case 'physiotherapy':
        return 'Activity';
      default:
        return 'Stethoscope';
    }
  };

  const getServiceColor = (service) => {
    switch (service.toLowerCase()) {
      case 'speech therapy':
        return 'bg-primary text-primary-foreground';
      case 'occupational therapy':
        return 'bg-secondary text-secondary-foreground';
      case 'physiotherapy':
        return 'bg-accent text-accent-foreground';
      default:
        return 'bg-primary text-primary-foreground';
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'bg-success';
    if (progress >= 60) return 'bg-warning';
    return 'bg-primary';
  };

  return (
    <div className="bg-card border border-border rounded-therapeutic p-6 shadow-therapeutic hover:shadow-therapeutic-lg transition-shadow duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-gentle ${getServiceColor(therapy.service || 'Speech Therapy')}`}>
            <Icon name={getServiceIcon(therapy.service || 'Speech Therapy')} size={20} />
          </div>
          <div>
            <h3 className="font-heading font-medium text-base text-foreground">{therapy.service || 'Speech Therapy'}</h3>
            <p className="font-caption text-xs text-muted-foreground">{therapy.sessionsCompleted || 8} of {therapy.totalSessions || 12} sessions</p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-mono font-medium text-lg text-foreground">{therapy.progress || 67}%</p>
          <p className="font-caption text-xs text-muted-foreground">Progress</p>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="font-body text-sm text-foreground">Overall Progress</span>
          <span className="font-mono text-sm text-muted-foreground">{therapy.progress}%</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(therapy.progress)}`}
            style={{ width: `${therapy.progress}%` }}
          ></div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon name="Target" size={14} className="text-muted-foreground" />
            <span className="font-body text-sm text-foreground">Current Goal</span>
          </div>
          <span className="font-body text-sm text-muted-foreground">{therapy.currentGoal}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon name="Calendar" size={14} className="text-muted-foreground" />
            <span className="font-body text-sm text-foreground">Next Session</span>
          </div>
          <span className="font-body text-sm text-muted-foreground">{therapy.nextSession}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon name="Award" size={14} className="text-muted-foreground" />
            <span className="font-body text-sm text-foreground">Points Earned</span>
          </div>
          <span className="font-mono text-sm font-medium text-primary">{therapy.pointsEarned}</span>
        </div>
      </div>
    </div>
  );
};

export default TherapyProgressCard;
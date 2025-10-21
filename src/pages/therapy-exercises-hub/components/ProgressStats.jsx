import React from 'react';
import Icon from '../../../components/AppIcon';

const ProgressStats = ({ stats }) => {
  const statItems = [
    {
      icon: 'Target',
      label: 'Total Points',
      value: stats.totalPoints,
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      icon: 'Calendar',
      label: 'Days Active',
      value: stats.daysActive,
      color: 'text-secondary',
      bgColor: 'bg-secondary/10'
    },
    {
      icon: 'CheckCircle',
      label: 'Completed',
      value: stats.completedExercises,
      color: 'text-success',
      bgColor: 'bg-success/10'
    },
    {
      icon: 'Clock',
      label: 'Time Spent',
      value: `${stats.timeSpent}h`,
      color: 'text-accent',
      bgColor: 'bg-accent/10'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {statItems.map((item, index) => (
        <div
          key={index}
          className="bg-card border border-border rounded-therapeutic p-4 hover:shadow-therapeutic transition-shadow duration-200"
        >
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-gentle flex items-center justify-center ${item.bgColor}`}>
              <Icon name={item.icon} size={20} className={item.color} />
            </div>
            <div>
              <p className="text-2xl font-mono font-semibold text-foreground">
                {item.value}
              </p>
              <p className="text-xs text-muted-foreground">
                {item.label}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProgressStats;
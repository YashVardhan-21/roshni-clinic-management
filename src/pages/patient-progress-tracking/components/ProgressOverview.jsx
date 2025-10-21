import React from 'react';
import Icon from '../../../components/AppIcon';

const ProgressOverview = ({ overviewData }) => {
  const getProgressColor = (percentage) => {
    if (percentage >= 80) return 'text-success';
    if (percentage >= 60) return 'text-warning';
    return 'text-error';
  };

  const getProgressBgColor = (percentage) => {
    if (percentage >= 80) return 'bg-success';
    if (percentage >= 60) return 'bg-warning';
    return 'bg-error';
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {overviewData.metrics.map((metric) => (
          <div key={metric.id} className="bg-card border border-border rounded-therapeutic p-6 shadow-therapeutic">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-therapeutic flex items-center justify-center ${
                metric.type === 'attendance' ? 'bg-primary/10' :
                metric.type === 'completion' ? 'bg-secondary/10' : 'bg-accent/10'
              }`}>
                <Icon 
                  name={metric.icon} 
                  size={24} 
                  className={
                    metric.type === 'attendance' ? 'text-primary' :
                    metric.type === 'completion' ? 'text-secondary' : 'text-accent'
                  }
                />
              </div>
              <span className={`text-2xl font-heading font-semibold ${getProgressColor(metric.value)}`}>
                {metric.value}%
              </span>
            </div>
            <h3 className="font-heading font-medium text-foreground mb-2">{metric.title}</h3>
            <p className="font-body text-sm text-muted-foreground mb-3">{metric.description}</p>
            
            {/* Progress Bar */}
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${getProgressBgColor(metric.value)}`}
                style={{ width: `${metric.value}%` }}
              />
            </div>
            
            <div className="flex items-center justify-between mt-3">
              <span className="font-caption text-xs text-muted-foreground">
                {metric.current}/{metric.total} {metric.unit}
              </span>
              <div className="flex items-center space-x-1">
                <Icon 
                  name={metric.trend === 'up' ? 'TrendingUp' : metric.trend === 'down' ? 'TrendingDown' : 'Minus'} 
                  size={12} 
                  className={
                    metric.trend === 'up' ? 'text-success' :
                    metric.trend === 'down' ? 'text-error' : 'text-muted-foreground'
                  }
                />
                <span className={`font-caption text-xs ${
                  metric.trend === 'up' ? 'text-success' :
                  metric.trend === 'down' ? 'text-error' : 'text-muted-foreground'
                }`}>
                  {metric.change}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Achievements */}
      <div className="bg-card border border-border rounded-therapeutic p-6 shadow-therapeutic">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading font-semibold text-lg text-foreground">Recent Achievements</h3>
          <Icon name="Award" size={20} className="text-accent" />
        </div>
        
        <div className="space-y-3">
          {overviewData.recentAchievements.map((achievement) => (
            <div key={achievement.id} className="flex items-center space-x-4 p-3 bg-muted/50 rounded-therapeutic">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                achievement.type === 'milestone' ? 'bg-success/20' :
                achievement.type === 'streak' ? 'bg-primary/20' : 'bg-accent/20'
              }`}>
                <Icon 
                  name={achievement.icon} 
                  size={16} 
                  className={
                    achievement.type === 'milestone' ? 'text-success' :
                    achievement.type === 'streak' ? 'text-primary' : 'text-accent'
                  }
                />
              </div>
              <div className="flex-1">
                <h4 className="font-body font-medium text-sm text-foreground">{achievement.title}</h4>
                <p className="font-caption text-xs text-muted-foreground">{achievement.description}</p>
              </div>
              <span className="font-caption text-xs text-muted-foreground">{achievement.date}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {overviewData.quickStats.map((stat) => (
          <div key={stat.id} className="bg-card border border-border rounded-therapeutic p-4 text-center shadow-therapeutic">
            <div className="text-2xl font-heading font-bold text-primary mb-1">{stat.value}</div>
            <div className="font-body text-sm text-foreground mb-1">{stat.label}</div>
            <div className="font-caption text-xs text-muted-foreground">{stat.period}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressOverview;
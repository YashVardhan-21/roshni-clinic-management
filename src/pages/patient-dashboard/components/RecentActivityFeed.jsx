import React from 'react';
import Icon from '../../../components/AppIcon';

const RecentActivityFeed = ({ activities = [] }) => {
  const getActivityIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'appointment':
        return 'Calendar';
      case 'exercise':
        return 'Activity';
      case 'achievement':
        return 'Award';
      case 'message':
        return 'MessageCircle';
      case 'report':
        return 'FileText';
      default:
        return 'Bell';
    }
  };

  const getActivityColor = (type) => {
    switch (type.toLowerCase()) {
      case 'appointment':
        return 'bg-primary/10 text-primary';
      case 'exercise':
        return 'bg-secondary/10 text-secondary';
      case 'achievement':
        return 'bg-warning/10 text-warning';
      case 'message':
        return 'bg-accent/10 text-accent';
      case 'report':
        return 'bg-success/10 text-success';
      default:
        return 'bg-muted/10 text-muted-foreground';
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const activityTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - activityTime) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <div className="bg-card border border-border rounded-therapeutic p-6 shadow-therapeutic">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-heading font-medium text-lg text-foreground">Recent Activity</h3>
        <Icon name="Activity" size={20} className="text-primary" />
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-gentle hover:bg-muted/50 transition-colors duration-150">
            <div className={`p-2 rounded-gentle flex-shrink-0 ${getActivityColor(activity.type)}`}>
              <Icon name={getActivityIcon(activity.type)} size={16} />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="font-body text-sm text-foreground">{activity.title}</p>
                  <p className="font-body text-xs text-muted-foreground mt-1">{activity.description}</p>
                </div>
                <span className="font-caption text-xs text-muted-foreground flex-shrink-0 ml-2">
                  {formatTimeAgo(activity.timestamp)}
                </span>
              </div>
              
              {activity.points && (
                <div className="flex items-center space-x-1 mt-2">
                  <Icon name="Coins" size={12} className="text-primary" />
                  <span className="font-mono text-xs font-medium text-primary">+{activity.points} points</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-border">
        <button className="w-full text-center font-body text-sm text-primary hover:text-primary/80 transition-colors duration-150">
          View All Activities
        </button>
      </div>
    </div>
  );
};

export default RecentActivityFeed;
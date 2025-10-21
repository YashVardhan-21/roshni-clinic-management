import React from 'react';
import Icon from '../../../components/AppIcon';

const AchievementBadges = ({ achievements, onViewAll }) => {
  const recentAchievements = achievements.slice(0, 3);

  const getBadgeColor = (type) => {
    switch (type) {
      case 'gold': return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white';
      case 'silver': return 'bg-gradient-to-r from-gray-300 to-gray-500 text-white';
      case 'bronze': return 'bg-gradient-to-r from-amber-600 to-amber-800 text-white';
      default: return 'bg-primary text-primary-foreground';
    }
  };

  return (
    <div className="bg-card border border-border rounded-therapeutic p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-heading font-medium text-foreground flex items-center space-x-2">
          <Icon name="Award" size={18} />
          <span>Recent Achievements</span>
        </h3>
        <button
          onClick={onViewAll}
          className="text-primary hover:text-primary/80 text-sm font-medium transition-colors duration-150"
        >
          View All
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {recentAchievements.map((achievement) => (
          <div
            key={achievement.id}
            className="flex items-center space-x-3 p-3 bg-muted rounded-gentle hover:bg-muted/80 transition-colors duration-150"
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getBadgeColor(achievement.type)}`}>
              <Icon name={achievement.icon} size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-body font-medium text-sm text-foreground truncate">
                {achievement.title}
              </h4>
              <p className="text-xs text-muted-foreground truncate">
                {achievement.description}
              </p>
              <p className="text-xs text-accent font-mono mt-1">
                +{achievement.points} points
              </p>
            </div>
          </div>
        ))}
      </div>

      {achievements.length === 0 && (
        <div className="text-center py-8">
          <Icon name="Award" size={48} className="text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground text-sm">
            Complete exercises to earn achievements!
          </p>
        </div>
      )}
    </div>
  );
};

export default AchievementBadges;
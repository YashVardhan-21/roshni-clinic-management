import React from 'react';
import Icon from '../../../components/AppIcon';

const GamificationPanel = ({ gamificationData = {} }) => {
  const { 
    dailyStreak = 3, 
    totalPoints = 1250, 
    recentBadges = [], 
    weeklyGoal = { target: 7, current: 3 } 
  } = gamificationData;

  const weeklyProgress = (dailyStreak / 7) * 100;

  return (
    <div className="bg-card border border-border rounded-therapeutic p-6 shadow-therapeutic">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-heading font-medium text-lg text-foreground">Your Progress</h3>
        <Icon name="Trophy" size={20} className="text-warning" />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Daily Streak */}
        <div className="text-center p-4 bg-primary/5 rounded-therapeutic">
          <div className="flex items-center justify-center mb-2">
            <Icon name="Flame" size={24} className="text-primary" />
          </div>
          <p className="font-mono text-2xl font-bold text-primary">{dailyStreak}</p>
          <p className="font-caption text-xs text-muted-foreground">Day Streak</p>
        </div>

        {/* Total Points */}
        <div className="text-center p-4 bg-warning/5 rounded-therapeutic">
          <div className="flex items-center justify-center mb-2">
            <Icon name="Coins" size={24} className="text-warning" />
          </div>
          <p className="font-mono text-2xl font-bold text-warning">{totalPoints.toLocaleString()}</p>
          <p className="font-caption text-xs text-muted-foreground">Total Points</p>
        </div>
      </div>

      {/* Weekly Goal Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="font-body text-sm text-foreground">Weekly Goal</span>
          <span className="font-mono text-sm text-muted-foreground">{dailyStreak}/{weeklyGoal.target} days</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className="h-2 bg-success rounded-full transition-all duration-300"
            style={{ width: `${Math.min(weeklyProgress, 100)}%` }}
          ></div>
        </div>
        <p className="font-caption text-xs text-muted-foreground mt-1">{weeklyGoal.description}</p>
      </div>

      {/* Recent Badges */}
      <div>
        <h4 className="font-heading font-medium text-sm text-foreground mb-3">Recent Achievements</h4>
        <div className="flex flex-wrap gap-2">
          {recentBadges.map((badge, index) => (
                          <div
                key={badge.name || index}
                className="flex items-center space-x-2 bg-muted/50 px-3 py-2 rounded-therapeutic"
                title={`Earned on ${badge.earned || 'Recently'}`}
              >
                <Icon name={badge.icon || 'Award'} size={16} className="text-warning" />
                <span className="font-body text-xs text-foreground">{badge.name}</span>
              </div>
          ))}
        </div>
        
        {recentBadges.length === 0 && (
          <div className="text-center py-4">
            <Icon name="Award" size={32} className="text-muted-foreground mx-auto mb-2" />
            <p className="font-body text-sm text-muted-foreground">Complete exercises to earn badges!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GamificationPanel;
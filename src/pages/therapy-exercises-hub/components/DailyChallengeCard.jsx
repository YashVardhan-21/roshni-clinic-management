import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const DailyChallengeCard = ({ challenge, onStartChallenge }) => {
  return (
    <div className="bg-gradient-to-r from-primary to-secondary p-6 rounded-therapeutic shadow-therapeutic text-white mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            <Icon name="Target" size={24} className="text-white" />
          </div>
          <div>
            <h2 className="font-heading font-semibold text-lg">Daily Challenge</h2>
            <p className="text-white/80 text-sm">Keep your streak alive!</p>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center space-x-2 mb-1">
            <Icon name="Flame" size={16} className="text-accent" />
            <span className="font-mono font-semibold">{challenge.streak} days</span>
          </div>
          <p className="text-white/80 text-xs">Current streak</p>
        </div>
      </div>

      <div className="bg-white/10 rounded-gentle p-4 mb-4">
        <h3 className="font-heading font-medium mb-2">{challenge.title}</h3>
        <p className="text-white/90 text-sm mb-3">{challenge.description}</p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Icon name="Clock" size={14} />
              <span className="text-xs">{challenge.duration} min</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="Star" size={14} className="text-accent" />
              <span className="text-xs">{challenge.points} points</span>
            </div>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onStartChallenge(challenge)}
            iconName="Play"
            iconPosition="left"
            className="bg-white text-primary hover:bg-white/90"
          >
            Start Challenge
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className="text-white/80">Today's Progress</span>
        <span className="font-mono">{challenge.completedToday}/3 exercises</span>
      </div>
      <div className="w-full bg-white/20 rounded-full h-2 mt-2">
        <div 
          className="bg-accent h-2 rounded-full transition-all duration-300"
          style={{ width: `${(challenge.completedToday / 3) * 100}%` }}
        />
      </div>
    </div>
  );
};

export default DailyChallengeCard;
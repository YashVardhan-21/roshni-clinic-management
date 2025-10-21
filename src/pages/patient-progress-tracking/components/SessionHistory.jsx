import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SessionHistory = ({ sessionData }) => {
  const [selectedTherapy, setSelectedTherapy] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const [expandedSession, setExpandedSession] = useState(null);

  const therapyTypes = [
    { id: 'all', label: 'All Therapies', icon: 'Activity' },
    { id: 'speech', label: 'Speech Therapy', icon: 'Mic' },
    { id: 'occupational', label: 'Occupational', icon: 'Hand' },
    { id: 'physical', label: 'Physical Therapy', icon: 'Zap' }
  ];

  const timePeriods = [
    { id: 'all', label: 'All Time' },
    { id: 'week', label: 'This Week' },
    { id: 'month', label: 'This Month' },
    { id: 'quarter', label: 'Last 3 Months' }
  ];

  const getTherapyColor = (type) => {
    switch (type) {
      case 'speech': return 'text-primary';
      case 'occupational': return 'text-secondary';
      case 'physical': return 'text-accent';
      default: return 'text-foreground';
    }
  };

  const getTherapyBgColor = (type) => {
    switch (type) {
      case 'speech': return 'bg-primary/10';
      case 'occupational': return 'bg-secondary/10';
      case 'physical': return 'bg-accent/10';
      default: return 'bg-muted';
    }
  };

  const getRatingColor = (rating) => {
    if (rating >= 4) return 'text-success';
    if (rating >= 3) return 'text-warning';
    return 'text-error';
  };

  const filteredSessions = sessionData.sessions.filter(session => {
    const therapyMatch = selectedTherapy === 'all' || session.therapyType === selectedTherapy;
    const periodMatch = selectedPeriod === 'all' || session.period === selectedPeriod;
    return therapyMatch && periodMatch;
  });

  const toggleSessionExpansion = (sessionId) => {
    setExpandedSession(expandedSession === sessionId ? null : sessionId);
  };

  return (
    <div className="space-y-6">
      {/* Session Statistics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {sessionData.statistics.map((stat) => (
          <div key={stat.id} className="bg-card border border-border rounded-therapeutic p-4 text-center shadow-therapeutic">
            <div className="text-2xl font-heading font-bold text-primary mb-1">{stat.value}</div>
            <div className="font-body text-sm text-foreground mb-1">{stat.label}</div>
            <div className="font-caption text-xs text-muted-foreground">{stat.period}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between space-y-4 lg:space-y-0">
        <div className="flex flex-wrap gap-2">
          {therapyTypes.map((therapy) => (
            <Button
              key={therapy.id}
              variant={selectedTherapy === therapy.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedTherapy(therapy.id)}
              iconName={therapy.icon}
              iconPosition="left"
              iconSize={16}
            >
              {therapy.label}
            </Button>
          ))}
        </div>
        
        <div className="flex items-center space-x-2">
          <Icon name="Calendar" size={16} className="text-muted-foreground" />
          <div className="flex rounded-therapeutic border border-border overflow-hidden">
            {timePeriods.map((period) => (
              <button
                key={period.id}
                onClick={() => setSelectedPeriod(period.id)}
                className={`px-3 py-1 text-xs font-body transition-colors duration-150 ${
                  selectedPeriod === period.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card text-foreground hover:bg-muted'
                }`}
              >
                {period.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sessions List */}
      <div className="space-y-4">
        {filteredSessions.map((session) => (
          <div key={session.id} className="bg-card border border-border rounded-therapeutic shadow-therapeutic overflow-hidden">
            {/* Session Header */}
            <div 
              className="p-6 cursor-pointer hover:bg-muted/50 transition-colors duration-150"
              onClick={() => toggleSessionExpansion(session.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-therapeutic flex items-center justify-center ${getTherapyBgColor(session.therapyType)}`}>
                    <Icon 
                      name={
                        session.therapyType === 'speech' ? 'Mic' :
                        session.therapyType === 'occupational' ? 'Hand' : 'Zap'
                      } 
                      size={20} 
                      className={getTherapyColor(session.therapyType)}
                    />
                  </div>
                  
                  <div>
                    <h3 className="font-heading font-semibold text-foreground">{session.title}</h3>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="font-body text-sm text-muted-foreground">
                        {session.date} • {session.duration}
                      </span>
                      <span className="font-body text-sm text-foreground">
                        Dr. {session.therapist}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  {/* Rating */}
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Icon
                        key={star}
                        name="Star"
                        size={16}
                        className={star <= session.rating ? getRatingColor(session.rating) : 'text-muted-foreground'}
                        style={{ fill: star <= session.rating ? 'currentColor' : 'none' }}
                      />
                    ))}
                    <span className="font-mono text-sm text-foreground ml-2">{session.rating}/5</span>
                  </div>
                  
                  {/* Status */}
                  <span className={`font-caption text-xs px-2 py-1 rounded-full ${
                    session.status === 'completed' ? 'bg-success/10 text-success' :
                    session.status === 'cancelled' ? 'bg-error/10 text-error' : 'bg-warning/10 text-warning'
                  }`}>
                    {session.status.toUpperCase()}
                  </span>
                  
                  {/* Expand Icon */}
                  <Icon 
                    name={expandedSession === session.id ? 'ChevronUp' : 'ChevronDown'} 
                    size={20} 
                    className="text-muted-foreground"
                  />
                </div>
              </div>
            </div>

            {/* Expanded Session Details */}
            {expandedSession === session.id && (
              <div className="border-t border-border p-6 bg-muted/20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Session Notes */}
                  <div>
                    <h4 className="font-heading font-medium text-foreground mb-3">Session Notes</h4>
                    <div className="bg-card rounded-therapeutic p-4 border border-border">
                      <p className="font-body text-sm text-foreground leading-relaxed">
                        {session.notes}
                      </p>
                    </div>
                    
                    {/* Exercises Completed */}
                    <div className="mt-4">
                      <h5 className="font-heading font-medium text-sm text-foreground mb-2">Exercises Completed</h5>
                      <div className="space-y-2">
                        {session.exercises.map((exercise) => (
                          <div key={exercise.id} className="flex items-center justify-between p-2 bg-card rounded-gentle border border-border">
                            <span className="font-body text-sm text-foreground">{exercise.name}</span>
                            <div className="flex items-center space-x-2">
                              <span className="font-mono text-xs text-muted-foreground">{exercise.duration}</span>
                              <span className={`font-mono text-xs px-2 py-1 rounded-full ${
                                exercise.performance >= 80 ? 'bg-success/10 text-success' :
                                exercise.performance >= 60 ? 'bg-warning/10 text-warning' : 'bg-error/10 text-error'
                              }`}>
                                {exercise.performance}%
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Progress & Recommendations */}
                  <div>
                    <h4 className="font-heading font-medium text-foreground mb-3">Progress & Recommendations</h4>
                    
                    {/* Progress Indicators */}
                    <div className="space-y-3 mb-4">
                      {session.progressIndicators.map((indicator) => (
                        <div key={indicator.id}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-body text-sm text-foreground">{indicator.skill}</span>
                            <span className="font-mono text-sm text-foreground">{indicator.score}/10</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full transition-all duration-300 ${
                                indicator.score >= 8 ? 'bg-success' :
                                indicator.score >= 6 ? 'bg-warning' : 'bg-error'
                              }`}
                              style={{ width: `${(indicator.score / 10) * 100}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Recommendations */}
                    <div className="bg-card rounded-therapeutic p-4 border border-border">
                      <h5 className="font-heading font-medium text-sm text-foreground mb-2">Therapist Recommendations</h5>
                      <ul className="space-y-1">
                        {session.recommendations.map((rec, index) => (
                          <li key={index} className="font-body text-sm text-foreground flex items-start space-x-2">
                            <Icon name="ArrowRight" size={12} className="text-primary mt-1 flex-shrink-0" />
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Home Exercises */}
                    {session.homeExercises && session.homeExercises.length > 0 && (
                      <div className="mt-4 bg-accent/10 rounded-therapeutic p-4 border border-accent/20">
                        <h5 className="font-heading font-medium text-sm text-foreground mb-2">Home Exercises</h5>
                        <ul className="space-y-1">
                          {session.homeExercises.map((exercise, index) => (
                            <li key={index} className="font-body text-sm text-foreground flex items-start space-x-2">
                              <Icon name="Home" size={12} className="text-accent mt-1 flex-shrink-0" />
                              <span>{exercise}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredSessions.length === 0 && (
        <div className="text-center py-12">
          <Icon name="Calendar" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="font-heading font-medium text-lg text-foreground mb-2">No sessions found</h3>
          <p className="font-body text-muted-foreground">
            No sessions match your current filters. Try adjusting the therapy type or time period.
          </p>
        </div>
      )}
    </div>
  );
};

export default SessionHistory;
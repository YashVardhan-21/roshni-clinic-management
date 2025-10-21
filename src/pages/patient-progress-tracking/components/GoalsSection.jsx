import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const GoalsSection = ({ goalsData }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showCompleted, setShowCompleted] = useState(true);

  const categories = [
    { id: 'all', label: 'All Goals', icon: 'Target' },
    { id: 'speech', label: 'Speech Therapy', icon: 'Mic' },
    { id: 'occupational', label: 'Occupational', icon: 'Hand' },
    { id: 'physical', label: 'Physical Therapy', icon: 'Activity' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-success';
      case 'in-progress': return 'text-primary';
      case 'pending': return 'text-warning';
      case 'overdue': return 'text-error';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusBgColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-success/10';
      case 'in-progress': return 'bg-primary/10';
      case 'pending': return 'bg-warning/10';
      case 'overdue': return 'bg-error/10';
      default: return 'bg-muted';
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'bg-success';
    if (progress >= 60) return 'bg-primary';
    if (progress >= 40) return 'bg-warning';
    return 'bg-error';
  };

  const filteredGoals = goalsData.goals.filter(goal => {
    const categoryMatch = selectedCategory === 'all' || goal.category === selectedCategory;
    const statusMatch = showCompleted || goal.status !== 'completed';
    return categoryMatch && statusMatch;
  });

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return 'AlertCircle';
      case 'medium': return 'Clock';
      case 'low': return 'Minus';
      default: return 'Minus';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-error';
      case 'medium': return 'text-warning';
      case 'low': return 'text-muted-foreground';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      {/* Goals Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {goalsData.summary.map((item) => (
          <div key={item.id} className="bg-card border border-border rounded-therapeutic p-4 text-center shadow-therapeutic">
            <div className={`text-2xl font-heading font-bold mb-1 ${
              item.type === 'completed' ? 'text-success' :
              item.type === 'active' ? 'text-primary' :
              item.type === 'pending' ? 'text-warning' : 'text-error'
            }`}>
              {item.count}
            </div>
            <div className="font-body text-sm text-foreground mb-1">{item.label}</div>
            <div className="font-caption text-xs text-muted-foreground">{item.percentage}%</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              iconName={category.icon}
              iconPosition="left"
              iconSize={16}
            >
              {category.label}
            </Button>
          ))}
        </div>
        
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="showCompleted"
            checked={showCompleted}
            onChange={(e) => setShowCompleted(e.target.checked)}
            className="w-4 h-4 text-primary bg-card border-border rounded focus:ring-primary focus:ring-2"
          />
          <label htmlFor="showCompleted" className="font-body text-sm text-foreground">
            Show completed goals
          </label>
        </div>
      </div>

      {/* Goals List */}
      <div className="space-y-4">
        {filteredGoals.map((goal) => (
          <div key={goal.id} className="bg-card border border-border rounded-therapeutic p-6 shadow-therapeutic">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between space-y-4 lg:space-y-0">
              {/* Goal Info */}
              <div className="flex-1 lg:pr-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-therapeutic flex items-center justify-center ${
                      goal.category === 'speech' ? 'bg-primary/10' :
                      goal.category === 'occupational' ? 'bg-secondary/10' : 'bg-accent/10'
                    }`}>
                      <Icon 
                        name={
                          goal.category === 'speech' ? 'Mic' :
                          goal.category === 'occupational' ? 'Hand' : 'Activity'
                        } 
                        size={20} 
                        className={
                          goal.category === 'speech' ? 'text-primary' :
                          goal.category === 'occupational' ? 'text-secondary' : 'text-accent'
                        }
                      />
                    </div>
                    <div>
                      <h3 className="font-heading font-semibold text-foreground">{goal.title}</h3>
                      <p className="font-body text-sm text-muted-foreground">{goal.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Icon 
                      name={getPriorityIcon(goal.priority)} 
                      size={16} 
                      className={getPriorityColor(goal.priority)}
                    />
                    <span className={`font-caption text-xs px-2 py-1 rounded-full ${getStatusBgColor(goal.status)} ${getStatusColor(goal.status)}`}>
                      {goal.status.replace('-', ' ').toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-body text-sm text-foreground">Progress</span>
                    <span className="font-mono text-sm font-medium text-foreground">{goal.progress}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(goal.progress)}`}
                      style={{ width: `${goal.progress}%` }}
                    />
                  </div>
                </div>

                {/* Goal Details */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-body text-muted-foreground">Target Date:</span>
                    <div className="font-mono text-foreground">{goal.targetDate}</div>
                  </div>
                  <div>
                    <span className="font-body text-muted-foreground">Therapist:</span>
                    <div className="font-body text-foreground">{goal.therapist}</div>
                  </div>
                  <div>
                    <span className="font-body text-muted-foreground">Sessions:</span>
                    <div className="font-mono text-foreground">{goal.completedSessions}/{goal.totalSessions}</div>
                  </div>
                </div>
              </div>

              {/* Milestones */}
              <div className="lg:w-80">
                <h4 className="font-heading font-medium text-sm text-foreground mb-3">Milestones</h4>
                <div className="space-y-2">
                  {goal.milestones.map((milestone) => (
                    <div key={milestone.id} className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                        milestone.completed ? 'bg-success' : 'bg-muted'
                      }`}>
                        {milestone.completed && (
                          <Icon name="Check" size={10} className="text-success-foreground" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className={`font-body text-sm ${
                          milestone.completed ? 'text-foreground line-through' : 'text-foreground'
                        }`}>
                          {milestone.title}
                        </div>
                        {milestone.completedDate && (
                          <div className="font-caption text-xs text-success">
                            Completed: {milestone.completedDate}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            {goal.recentActivity && goal.recentActivity.length > 0 && (
              <div className="mt-4 pt-4 border-t border-border">
                <h4 className="font-heading font-medium text-sm text-foreground mb-2">Recent Activity</h4>
                <div className="space-y-2">
                  {goal.recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center space-x-3 text-sm">
                      <Icon name="Clock" size={12} className="text-muted-foreground" />
                      <span className="font-body text-muted-foreground">{activity.date}</span>
                      <span className="font-body text-foreground">{activity.description}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredGoals.length === 0 && (
        <div className="text-center py-12">
          <Icon name="Target" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="font-heading font-medium text-lg text-foreground mb-2">No goals found</h3>
          <p className="font-body text-muted-foreground">
            {selectedCategory === 'all' ?'No goals match your current filters.' 
              : `No ${categories.find(c => c.id === selectedCategory)?.label.toLowerCase()} goals found.`
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default GoalsSection;
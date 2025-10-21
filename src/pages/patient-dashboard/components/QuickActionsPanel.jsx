import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuickActionsPanel = () => {
  const quickActions = [
    {
      id: 1,
      title: 'Book Appointment',
      description: 'Schedule your next therapy session',
      icon: 'Calendar',
      color: 'bg-primary text-primary-foreground',
      link: '/appointment-booking'
    },
    {
      id: 2,
      title: 'Message Therapist',
      description: 'Chat with your healthcare provider',
      icon: 'MessageCircle',
      color: 'bg-secondary text-secondary-foreground',
      link: '/messages'
    },
    {
      id: 3,
      title: 'View Reports',
      description: 'Check your progress reports',
      icon: 'FileText',
      color: 'bg-accent text-accent-foreground',
      link: '/patient-progress-tracking'
    }
  ];

  return (
    <div className="bg-card border border-border rounded-therapeutic p-6 shadow-therapeutic">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-heading font-medium text-lg text-foreground">Quick Actions</h3>
        <Icon name="Zap" size={20} className="text-primary" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {quickActions.map((action) => (
          <Link
            key={action.id}
            to={action.link}
            className="group block"
          >
            <div className="bg-muted hover:bg-muted/80 rounded-therapeutic p-4 transition-all duration-200 group-hover:shadow-therapeutic touch-target">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className={`p-3 rounded-gentle ${action.color} group-hover:scale-105 transition-transform duration-200`}>
                  <Icon name={action.icon} size={24} />
                </div>
                <div>
                  <h4 className="font-heading font-medium text-sm text-foreground mb-1">
                    {action.title}
                  </h4>
                  <p className="font-body text-xs text-muted-foreground">
                    {action.description}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon name="Phone" size={16} className="text-muted-foreground" />
            <span className="font-body text-sm text-foreground">Emergency Contact</span>
          </div>
          <Button variant="outline" size="sm" iconName="Phone" iconPosition="left">
            Call Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuickActionsPanel;
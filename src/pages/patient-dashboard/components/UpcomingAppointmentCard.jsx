import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const UpcomingAppointmentCard = ({ 
  appointment = {
    id: 1,
    date: '2025-01-16',
    time: '10:00 AM',
    therapist: 'Dr. Sample',
    type: 'Speech Therapy',
    service: 'Speech Therapy'
  }, 
  onReschedule = () => {}, 
  onCancel = () => {} 
}) => {
  if (!appointment) {
    return (
      <div className="bg-card border border-border rounded-therapeutic p-6 shadow-therapeutic">
        <div className="text-center py-8">
          <Icon name="Calendar" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="font-heading font-medium text-lg text-foreground mb-2">No Upcoming Appointments</h3>
          <p className="font-body text-sm text-muted-foreground mb-4">Schedule your next therapy session</p>
          <Button variant="primary" iconName="Plus" iconPosition="left">
            Book Appointment
          </Button>
        </div>
      </div>
    );
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatTime = (time) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-IN', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getServiceIcon = (service) => {
    if (!service) return 'Calendar';
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
    if (!service) return 'text-primary';
    switch (service.toLowerCase()) {
      case 'speech therapy':
        return 'text-primary';
      case 'occupational therapy':
        return 'text-secondary';
      case 'physiotherapy':
        return 'text-accent';
      default:
        return 'text-primary';
    }
  };

  return (
    <div className="bg-card border border-border rounded-therapeutic p-6 shadow-therapeutic">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-gentle bg-primary/10`}>
            <Icon name={getServiceIcon(appointment.service)} size={24} className={getServiceColor(appointment.service)} />
          </div>
          <div>
            <h3 className="font-heading font-medium text-lg text-foreground">Upcoming Appointment</h3>
            <p className="font-body text-sm text-muted-foreground">{appointment.service}</p>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-success rounded-full"></div>
          <span className="font-caption text-xs text-success">Confirmed</span>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <Icon name="Calendar" size={16} className="text-muted-foreground" />
          <span className="font-body text-sm text-foreground">{formatDate(appointment.date)}</span>
        </div>

        <div className="flex items-center space-x-3">
          <Icon name="Clock" size={16} className="text-muted-foreground" />
          <span className="font-body text-sm text-foreground">{formatTime(appointment.time)}</span>
        </div>

        <div className="flex items-center space-x-3">
          <Icon name="User" size={16} className="text-muted-foreground" />
          <span className="font-body text-sm text-foreground">Dr. {appointment.therapist}</span>
        </div>

        <div className="flex items-center space-x-3">
          <Icon name="MapPin" size={16} className="text-muted-foreground" />
          <span className="font-body text-sm text-foreground">{appointment.location}</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mt-6">
        <Button 
          variant="outline" 
          iconName="Calendar" 
          iconPosition="left"
          onClick={() => onReschedule(appointment.id)}
          className="flex-1"
        >
          Reschedule
        </Button>
        <Button 
          variant="destructive" 
          iconName="X" 
          iconPosition="left"
          onClick={() => onCancel(appointment.id)}
          className="flex-1"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default UpcomingAppointmentCard;
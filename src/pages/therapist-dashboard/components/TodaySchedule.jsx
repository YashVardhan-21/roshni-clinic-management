import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TodaySchedule = () => {
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const todayAppointments = [
    {
      id: 1,
      time: "4:30 PM",
      duration: "45 min",
      patient: "Arjun Sharma",
      age: 8,
      type: "Speech Therapy",
      status: "confirmed",
      notes: "Articulation practice - focus on \'R\' sounds",
      sessionType: "Individual",
      room: "Room A1",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
    },
    {
      id: 2,
      time: "5:15 PM",
      duration: "45 min",
      patient: "Priya Patel",
      age: 12,
      type: "Occupational Therapy",
      status: "in-progress",
      notes: "Fine motor skills - handwriting exercises",
      sessionType: "Individual",
      room: "Room B2",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616c9c0b8d5?w=100&h=100&fit=crop&crop=face"
    },
    {
      id: 3,
      time: "6:00 PM",
      duration: "45 min",
      patient: "Rajesh Kumar",
      age: 45,
      type: "Physiotherapy",
      status: "upcoming",
      notes: "Post-surgery rehabilitation - shoulder mobility",
      sessionType: "Individual",
      room: "Room C1",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
    },
    {
      id: 4,
      time: "6:45 PM",
      duration: "45 min",
      patient: "Meera Singh",
      age: 6,
      type: "Speech Therapy",
      status: "upcoming",
      notes: "Language development - vocabulary building",
      sessionType: "Group",
      room: "Room A2",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face"
    },
    {
      id: 5,
      time: "7:30 PM",
      duration: "45 min",
      patient: "Vikram Gupta",
      age: 35,
      type: "Occupational Therapy",
      status: "upcoming",
      notes: "Cognitive rehabilitation - memory exercises",
      sessionType: "Individual",
      room: "Room B1",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face"
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-primary text-primary-foreground';
      case 'in-progress': return 'bg-warning text-warning-foreground';
      case 'upcoming': return 'bg-secondary text-secondary-foreground';
      case 'completed': return 'bg-success text-success-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getTherapyIcon = (type) => {
    switch (type) {
      case 'Speech Therapy': return 'MessageCircle';
      case 'Occupational Therapy': return 'Hand';
      case 'Physiotherapy': return 'Activity';
      default: return 'User';
    }
  };

  return (
    <div className="bg-card rounded-therapeutic border border-border shadow-therapeutic">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-therapeutic flex items-center justify-center">
              <Icon name="Calendar" size={20} className="text-primary" />
            </div>
            <div>
              <h2 className="font-heading font-semibold text-lg text-foreground">Today's Schedule</h2>
              <p className="font-caption text-sm text-muted-foreground">
                {new Date().toLocaleDateString('en-IN', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" iconName="Filter">
              Filter
            </Button>
            <Button variant="outline" size="sm" iconName="Download">
              Export
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          {todayAppointments.map((appointment, index) => (
            <div
              key={appointment.id}
              className={`relative p-4 rounded-therapeutic border transition-all duration-200 hover:shadow-therapeutic cursor-pointer ${
                selectedAppointment === appointment.id 
                  ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50'
              }`}
              onClick={() => setSelectedAppointment(
                selectedAppointment === appointment.id ? null : appointment.id
              )}
            >
              {/* Timeline connector */}
              {index < todayAppointments.length - 1 && (
                <div className="absolute left-12 top-16 w-0.5 h-8 bg-border" />
              )}

              <div className="flex items-start space-x-4">
                {/* Time indicator */}
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono font-medium ${
                    appointment.status === 'in-progress' ?'bg-warning text-warning-foreground animate-pulse' :'bg-muted text-muted-foreground'
                  }`}>
                    <Icon name="Clock" size={14} />
                  </div>
                  <span className="font-mono text-xs text-muted-foreground mt-1">
                    {appointment.time}
                  </span>
                </div>

                {/* Patient info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <img
                        src={appointment.avatar}
                        alt={appointment.patient}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <h3 className="font-body font-medium text-foreground">
                          {appointment.patient}
                        </h3>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <span>Age: {appointment.age}</span>
                          <span>•</span>
                          <span>{appointment.duration}</span>
                          <span>•</span>
                          <span>{appointment.room}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                        {appointment.status.replace('-', ' ')}
                      </span>
                      <Icon 
                        name={selectedAppointment === appointment.id ? "ChevronUp" : "ChevronDown"} 
                        size={16} 
                        className="text-muted-foreground"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 mt-2">
                    <div className="flex items-center space-x-2">
                      <Icon name={getTherapyIcon(appointment.type)} size={16} className="text-primary" />
                      <span className="font-caption text-sm text-foreground">{appointment.type}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Icon name="Users" size={16} className="text-secondary" />
                      <span className="font-caption text-sm text-foreground">{appointment.sessionType}</span>
                    </div>
                  </div>

                  {/* Expanded details */}
                  {selectedAppointment === appointment.id && (
                    <div className="mt-4 p-4 bg-muted/50 rounded-gentle animate-gentle-fade">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-body font-medium text-sm text-foreground mb-2">Session Notes</h4>
                          <p className="font-caption text-sm text-muted-foreground">{appointment.notes}</p>
                        </div>
                        <div className="flex flex-col space-y-2">
                          <Button variant="outline" size="sm" iconName="FileText" className="justify-start">
                            View Patient History
                          </Button>
                          <Button variant="outline" size="sm" iconName="MessageSquare" className="justify-start">
                            Send Message
                          </Button>
                          {appointment.status === 'upcoming' && (
                            <Button variant="default" size="sm" iconName="Play" className="justify-start">
                              Start Session
                            </Button>
                          )}
                          {appointment.status === 'in-progress' && (
                            <Button variant="success" size="sm" iconName="CheckCircle" className="justify-start">
                              Complete Session
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {todayAppointments.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="Calendar" size={24} className="text-muted-foreground" />
            </div>
            <h3 className="font-heading font-medium text-foreground mb-2">No appointments today</h3>
            <p className="font-caption text-sm text-muted-foreground">
              You have a free day! Use this time for planning or documentation.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TodaySchedule;
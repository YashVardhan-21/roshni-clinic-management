import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TimeSlotGrid = ({ timeSlots, selectedSlot, onSlotSelect, selectedDate }) => {
  const formatDate = (date) => {
    return date.toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-card rounded-therapeutic border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-heading font-semibold text-lg text-foreground">
          Available Time Slots
        </h3>
        <div className="flex items-center space-x-2 text-muted-foreground">
          <Icon name="Calendar" size={16} />
          <span className="font-body text-sm">{formatDate(selectedDate)}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {timeSlots.map((slot) => (
          <Button
            key={slot.id}
            variant={selectedSlot?.id === slot.id ? "default" : "outline"}
            onClick={() => onSlotSelect(slot)}
            disabled={!slot.isAvailable}
            className={`h-auto p-4 flex flex-col items-center space-y-2 ${
              !slot.isAvailable ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <div className="flex items-center space-x-2">
              <Icon name="Clock" size={16} />
              <span className="font-mono text-sm font-medium">{slot.time}</span>
            </div>
            
            <div className="flex items-center space-x-4 text-xs">
              <span className={`px-2 py-1 rounded-gentle ${
                slot.isAvailable 
                  ? 'bg-success/10 text-success' :'bg-error/10 text-error'
              }`}>
                {slot.isAvailable ? 'Available' : 'Booked'}
              </span>
              
              {slot.waitlistCount > 0 && (
                <span className="text-warning">
                  {slot.waitlistCount} waiting
                </span>
              )}
            </div>
          </Button>
        ))}
      </div>
      
      <div className="mt-6 p-4 bg-muted rounded-therapeutic">
        <div className="flex items-start space-x-3">
          <Icon name="Info" size={16} className="text-primary mt-0.5" />
          <div>
            <p className="font-body text-sm text-foreground mb-1">
              Booking Information
            </p>
            <ul className="font-caption text-xs text-muted-foreground space-y-1">
              <li>• Sessions are 45 minutes long</li>
              <li>• Please arrive 10 minutes early</li>
              <li>• Cancellation allowed up to 2 hours before appointment</li>
              <li>• Waitlist notifications sent via WhatsApp</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeSlotGrid;
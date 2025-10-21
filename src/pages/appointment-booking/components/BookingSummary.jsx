import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const BookingSummary = ({ bookingData, onEdit, onConfirm }) => {
  const { service, doctor, date, timeSlot, totalCost } = bookingData;

  const formatDate = (date) => {
    return date.toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-card rounded-therapeutic border border-border p-6 sticky top-24">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-heading font-semibold text-lg text-foreground">
          Booking Summary
        </h3>
        <Button variant="ghost" size="sm" onClick={onEdit}>
          <Icon name="Edit2" size={14} />
          Edit
        </Button>
      </div>
      
      {/* Service Details */}
      <div className="space-y-4 mb-6">
        <div className="flex items-start space-x-3 p-3 bg-muted rounded-therapeutic">
          <div className="p-2 bg-primary text-primary-foreground rounded-gentle">
            <Icon name={service?.icon} size={16} />
          </div>
          <div className="flex-1">
            <h4 className="font-body font-medium text-sm text-foreground">
              {service?.name}
            </h4>
            <p className="font-caption text-xs text-muted-foreground">
              {service?.duration} session
            </p>
          </div>
          <span className="font-mono text-sm font-semibold text-primary">
            ₹{service?.price}
          </span>
        </div>
        
        {/* Doctor Details */}
        {doctor && (
          <div className="flex items-start space-x-3 p-3 bg-muted rounded-therapeutic">
            <Image
              src={doctor.photo}
              alt={doctor.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="flex-1">
              <h4 className="font-body font-medium text-sm text-foreground">
                Dr. {doctor.name}
              </h4>
              <p className="font-caption text-xs text-muted-foreground">
                {doctor.specialization}
              </p>
              <div className="flex items-center space-x-1 mt-1">
                <Icon name="Star" size={12} className="text-warning fill-current" />
                <span className="font-mono text-xs text-muted-foreground">
                  {doctor.rating} ({doctor.reviews} reviews)
                </span>
              </div>
            </div>
          </div>
        )}
        
        {/* Date & Time */}
        {date && timeSlot && (
          <div className="p-3 bg-muted rounded-therapeutic">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="Calendar" size={16} className="text-primary" />
              <span className="font-body text-sm font-medium text-foreground">
                {formatDate(date)}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="Clock" size={16} className="text-primary" />
              <span className="font-mono text-sm text-foreground">
                {timeSlot.time}
              </span>
              <span className="px-2 py-1 bg-success/10 text-success rounded-gentle font-caption text-xs">
                Available
              </span>
            </div>
          </div>
        )}
      </div>
      
      {/* Cost Breakdown */}
      <div className="border-t border-border pt-4 mb-6">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="font-body text-sm text-muted-foreground">
              Session Fee
            </span>
            <span className="font-mono text-sm text-foreground">
              ₹{service?.price}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-body text-sm text-muted-foreground">
              Platform Fee
            </span>
            <span className="font-mono text-sm text-foreground">₹0</span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-border">
            <span className="font-body font-semibold text-base text-foreground">
              Total Amount
            </span>
            <span className="font-mono font-bold text-lg text-primary">
              ₹{totalCost}
            </span>
          </div>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="space-y-3">
        <Button 
          variant="default" 
          fullWidth 
          onClick={onConfirm}
          disabled={!service || !doctor || !timeSlot}
        >
          <Icon name="Calendar" size={16} />
          Book Appointment
        </Button>
        
        <div className="flex items-center justify-center space-x-2 text-muted-foreground">
          <Icon name="Shield" size={14} />
          <span className="font-caption text-xs">
            Secure booking with 256-bit encryption
          </span>
        </div>
      </div>
    </div>
  );
};

export default BookingSummary;
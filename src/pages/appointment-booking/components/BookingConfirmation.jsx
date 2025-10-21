import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const BookingConfirmation = ({ bookingDetails, onNewBooking, onDashboard }) => {
  const [notificationPreferences, setNotificationPreferences] = useState({
    whatsapp: true,
    sms: true,
    email: true
  });

  const { service, doctor, date, timeSlot, patientInfo, paymentMethod, bookingId, totalAmount } = bookingDetails;

  const formatDate = (date) => {
    return date.toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleNotificationChange = (type, checked) => {
    setNotificationPreferences(prev => ({
      ...prev,
      [type]: checked
    }));
  };

  const getPaymentMethodDisplay = () => {
    switch (paymentMethod.method) {
      case 'card':
        return `Card ending in ${paymentMethod.cardDetails?.cardNumber?.slice(-4)}`;
      case 'upi':
        return `UPI: ${paymentMethod.upiId}`;
      case 'pay-at-clinic':
        return 'Pay at Clinic';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Success Header */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-success text-success-foreground rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="Check" size={32} />
        </div>
        <h1 className="font-heading font-bold text-2xl text-foreground mb-2">
          Booking Confirmed!
        </h1>
        <p className="font-body text-base text-muted-foreground">
          Your appointment has been successfully booked
        </p>
      </div>

      {/* Booking Details Card */}
      <div className="bg-card rounded-therapeutic border border-border p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-heading font-semibold text-lg text-foreground">
            Appointment Details
          </h2>
          <div className="flex items-center space-x-2 text-success">
            <Icon name="CheckCircle" size={16} />
            <span className="font-body text-sm">Confirmed</span>
          </div>
        </div>

        {/* Booking ID */}
        <div className="p-3 bg-muted rounded-therapeutic mb-6">
          <div className="flex items-center justify-between">
            <span className="font-body text-sm text-muted-foreground">
              Booking ID
            </span>
            <span className="font-mono text-sm font-semibold text-foreground">
              {bookingId}
            </span>
          </div>
        </div>

        {/* Service & Doctor */}
        <div className="space-y-4 mb-6">
          <div className="flex items-start space-x-4 p-4 bg-muted rounded-therapeutic">
            <div className="p-3 bg-primary text-primary-foreground rounded-gentle">
              <Icon name={service.icon} size={20} />
            </div>
            <div className="flex-1">
              <h3 className="font-body font-semibold text-base text-foreground">
                {service.name}
              </h3>
              <p className="font-caption text-sm text-muted-foreground">
                {service.duration} session • ₹{service.price}
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4 p-4 bg-muted rounded-therapeutic">
            <Image
              src={doctor.photo}
              alt={doctor.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className="flex-1">
              <h3 className="font-body font-semibold text-base text-foreground">
                Dr. {doctor.name}
              </h3>
              <p className="font-caption text-sm text-muted-foreground">
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
        </div>

        {/* Date & Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="p-4 bg-muted rounded-therapeutic">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="Calendar" size={16} className="text-primary" />
              <span className="font-body text-sm font-medium text-foreground">
                Date
              </span>
            </div>
            <p className="font-body text-base text-foreground">
              {formatDate(date)}
            </p>
          </div>

          <div className="p-4 bg-muted rounded-therapeutic">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="Clock" size={16} className="text-primary" />
              <span className="font-body text-sm font-medium text-foreground">
                Time
              </span>
            </div>
            <p className="font-mono text-base text-foreground">
              {timeSlot.time}
            </p>
          </div>
        </div>

        {/* Patient Information */}
        <div className="p-4 bg-muted rounded-therapeutic mb-6">
          <h4 className="font-body font-medium text-base text-foreground mb-3">
            Patient Information
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="font-caption text-xs text-muted-foreground">Name</span>
              <p className="font-body text-sm text-foreground">{patientInfo.patientName}</p>
            </div>
            <div>
              <span className="font-caption text-xs text-muted-foreground">Age</span>
              <p className="font-body text-sm text-foreground">{patientInfo.age} years</p>
            </div>
            <div>
              <span className="font-caption text-xs text-muted-foreground">Phone</span>
              <p className="font-mono text-sm text-foreground">{patientInfo.phone}</p>
            </div>
            <div>
              <span className="font-caption text-xs text-muted-foreground">Email</span>
              <p className="font-body text-sm text-foreground">{patientInfo.email}</p>
            </div>
          </div>
        </div>

        {/* Payment Information */}
        <div className="p-4 bg-muted rounded-therapeutic">
          <h4 className="font-body font-medium text-base text-foreground mb-3">
            Payment Information
          </h4>
          <div className="flex justify-between items-center">
            <div>
              <span className="font-caption text-xs text-muted-foreground">Payment Method</span>
              <p className="font-body text-sm text-foreground">{getPaymentMethodDisplay()}</p>
            </div>
            <div className="text-right">
              <span className="font-caption text-xs text-muted-foreground">Amount Paid</span>
              <p className="font-mono text-lg font-semibold text-primary">₹{totalAmount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="bg-card rounded-therapeutic border border-border p-6 mb-6">
        <h3 className="font-heading font-semibold text-lg text-foreground mb-4">
          Notification Preferences
        </h3>
        <p className="font-body text-sm text-muted-foreground mb-4">
          Choose how you'd like to receive appointment reminders and updates
        </p>
        
        <div className="space-y-3">
          <Checkbox
            label="WhatsApp notifications"
            description="Receive booking confirmations and reminders via WhatsApp"
            checked={notificationPreferences.whatsapp}
            onChange={(e) => handleNotificationChange('whatsapp', e.target.checked)}
          />
          
          <Checkbox
            label="SMS notifications"
            description="Get text message reminders 24 hours before appointment"
            checked={notificationPreferences.sms}
            onChange={(e) => handleNotificationChange('sms', e.target.checked)}
          />
          
          <Checkbox
            label="Email notifications"
            description="Receive detailed appointment information via email"
            checked={notificationPreferences.email}
            onChange={(e) => handleNotificationChange('email', e.target.checked)}
          />
        </div>
      </div>

      {/* Important Information */}
      <div className="bg-warning/5 border border-warning/20 rounded-therapeutic p-4 mb-6">
        <div className="flex items-start space-x-3">
          <Icon name="AlertTriangle" size={16} className="text-warning mt-0.5" />
          <div>
            <h4 className="font-body font-medium text-sm text-warning mb-2">
              Important Reminders
            </h4>
            <ul className="font-caption text-xs text-muted-foreground space-y-1">
              <li>• Please arrive 10 minutes before your appointment time</li>
              <li>• Bring a valid ID and any relevant medical documents</li>
              <li>• Cancellation allowed up to 2 hours before appointment</li>
              <li>• Contact clinic at +91 98765 43210 for any queries</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          variant="outline"
          onClick={onNewBooking}
          className="sm:flex-1"
        >
          <Icon name="Plus" size={16} />
          Book Another Appointment
        </Button>
        
        <Button
          variant="default"
          onClick={onDashboard}
          className="sm:flex-1"
        >
          <Icon name="Home" size={16} />
          Go to Dashboard
        </Button>
      </div>

      {/* Contact Information */}
      <div className="text-center mt-8 p-4 bg-muted rounded-therapeutic">
        <p className="font-body text-sm text-muted-foreground mb-2">
          Need help with your appointment?
        </p>
        <div className="flex items-center justify-center space-x-4">
          <a 
            href="tel:+919876543210" 
            className="flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors"
          >
            <Icon name="Phone" size={14} />
            <span className="font-mono text-sm">+91 98765 43210</span>
          </a>
          <a 
            href="mailto:support@roshnilinic.com" 
            className="flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors"
          >
            <Icon name="Mail" size={14} />
            <span className="font-body text-sm">support@roshnilinic.com</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;
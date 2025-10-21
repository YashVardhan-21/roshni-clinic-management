import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import ServiceCard from './components/ServiceCard';
import DoctorCard from './components/DoctorCard';
import TimeSlotGrid from './components/TimeSlotGrid';
import BookingSummary from './components/BookingSummary';
import PatientInfoForm from './components/PatientInfoForm';
import PaymentMethodSelector from './components/PaymentMethodSelector';
import BookingConfirmation from './components/BookingConfirmation';
import ProgressIndicator from './components/ProgressIndicator';

const AppointmentBooking = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date(Date.now() + 24 * 60 * 60 * 1000)); // Tomorrow
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [patientInfo, setPatientInfo] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  // Mock data for services
  const services = [
    {
      id: 'speech-therapy',
      name: 'Speech Language Pathology',
      icon: 'MessageCircle',
      description: 'Comprehensive speech and language therapy for communication disorders, articulation issues, and language development.',
      price: 1200,
      duration: '45 minutes'
    },
    {
      id: 'occupational-therapy',
      name: 'Occupational Therapy',
      icon: 'Hand',
      description: 'Specialized therapy to improve daily living skills, fine motor abilities, and cognitive functions.',
      price: 1000,
      duration: '45 minutes'
    },
    {
      id: 'physiotherapy',
      name: 'Physiotherapy',
      icon: 'Activity',
      description: 'Physical rehabilitation therapy for movement disorders, pain management, and strength building.',
      price: 800,
      duration: '45 minutes'
    }
  ];

  // Mock data for doctors
  const doctors = [
    {
      id: 'dr-priya-sharma',
      name: 'Priya Sharma',
      specialization: 'Speech Language Pathologist',
      experience: 8,
      rating: 4.8,
      reviews: 156,
      patients: 500,
      languages: ['English', 'Hindi', 'Marathi'],
      photo: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face',
      isAvailable: true,
      services: ['speech-therapy']
    },
    {
      id: 'dr-rajesh-kumar',
      name: 'Rajesh Kumar',
      specialization: 'Senior Speech Therapist',
      experience: 12,
      rating: 4.9,
      reviews: 203,
      patients: 750,
      languages: ['English', 'Hindi', 'Tamil'],
      photo: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face',
      isAvailable: true,
      services: ['speech-therapy']
    },
    {
      id: 'dr-meera-patel',
      name: 'Meera Patel',
      specialization: 'Occupational Therapist',
      experience: 6,
      rating: 4.7,
      reviews: 89,
      patients: 300,
      languages: ['English', 'Hindi', 'Gujarati'],
      photo: 'https://images.unsplash.com/photo-1594824475317-1ad8b8e8e8b8?w=400&h=400&fit=crop&crop=face',
      isAvailable: true,
      services: ['occupational-therapy']
    },
    {
      id: 'dr-amit-singh',
      name: 'Amit Singh',
      specialization: 'Senior Occupational Therapist',
      experience: 10,
      rating: 4.8,
      reviews: 134,
      patients: 450,
      languages: ['English', 'Hindi', 'Punjabi'],
      photo: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop&crop=face',
      isAvailable: false,
      services: ['occupational-therapy']
    },
    {
      id: 'dr-kavya-reddy',
      name: 'Kavya Reddy',
      specialization: 'Physiotherapist',
      experience: 7,
      rating: 4.6,
      reviews: 112,
      patients: 400,
      languages: ['English', 'Hindi', 'Telugu'],
      photo: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face',
      isAvailable: true,
      services: ['physiotherapy']
    },
    {
      id: 'dr-suresh-nair',
      name: 'Suresh Nair',
      specialization: 'Senior Physiotherapist',
      experience: 15,
      rating: 4.9,
      reviews: 245,
      patients: 800,
      languages: ['English', 'Hindi', 'Malayalam'],
      photo: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face',
      isAvailable: true,
      services: ['physiotherapy']
    }
  ];

  // Mock time slots
  const timeSlots = [
    { id: 'slot-1', time: '4:30 PM', isAvailable: true, waitlistCount: 0 },
    { id: 'slot-2', time: '5:15 PM', isAvailable: false, waitlistCount: 2 },
    { id: 'slot-3', time: '6:00 PM', isAvailable: true, waitlistCount: 0 },
    { id: 'slot-4', time: '6:45 PM', isAvailable: true, waitlistCount: 0 },
    { id: 'slot-5', time: '7:30 PM', isAvailable: false, waitlistCount: 1 },
    { id: 'slot-6', time: '8:15 PM', isAvailable: true, waitlistCount: 0 },
    { id: 'slot-7', time: '9:00 PM', isAvailable: true, waitlistCount: 0 }
  ];

  const steps = [
    { id: 'service', title: 'Select Service', description: 'Choose therapy type' },
    { id: 'doctor', title: 'Choose Doctor', description: 'Select therapist' },
    { id: 'datetime', title: 'Date & Time', description: 'Pick appointment slot' },
    { id: 'patient-info', title: 'Patient Info', description: 'Enter details' },
    { id: 'payment', title: 'Payment', description: 'Complete booking' },
    { id: 'confirmation', title: 'Confirmation', description: 'Booking confirmed' }
  ];

  // Filter doctors based on selected service
  const availableDoctors = selectedService 
    ? doctors.filter(doctor => doctor.services.includes(selectedService.id))
    : [];

  const handleServiceSelect = (service) => {
    setSelectedService(service);
    setSelectedDoctor(null);
    setCurrentStep(1);
  };

  const handleDoctorSelect = (doctor) => {
    setSelectedDoctor(doctor);
    setCurrentStep(2);
  };

  const handleTimeSlotSelect = (slot) => {
    setSelectedTimeSlot(slot);
  };

  const handlePatientInfoSubmit = (info) => {
    setPatientInfo(info);
    setCurrentStep(4);
  };

  const handlePaymentSelect = (payment) => {
    setPaymentMethod(payment);
    // Simulate payment processing
    setTimeout(() => {
      setBookingConfirmed(true);
      setCurrentStep(5);
    }, 1500);
  };

  const handleBookingEdit = () => {
    setCurrentStep(0);
    setSelectedService(null);
    setSelectedDoctor(null);
    setSelectedTimeSlot(null);
    setPatientInfo(null);
    setPaymentMethod(null);
    setBookingConfirmed(false);
  };

  const handleBookingConfirm = () => {
    if (selectedService && selectedDoctor && selectedTimeSlot) {
      setCurrentStep(3);
    }
  };

  const handleNewBooking = () => {
    setCurrentStep(0);
    setSelectedService(null);
    setSelectedDoctor(null);
    setSelectedTimeSlot(null);
    setPatientInfo(null);
    setPaymentMethod(null);
    setBookingConfirmed(false);
  };

  const handleGoToDashboard = () => {
    navigate('/patient-dashboard');
  };

  const getTotalCost = () => {
    return selectedService ? selectedService.price : 0;
  };

  const getBookingData = () => ({
    service: selectedService,
    doctor: selectedDoctor,
    date: selectedDate,
    timeSlot: selectedTimeSlot,
    totalCost: getTotalCost()
  });

  const getBookingDetails = () => ({
    service: selectedService,
    doctor: selectedDoctor,
    date: selectedDate,
    timeSlot: selectedTimeSlot,
    patientInfo,
    paymentMethod,
    bookingId: 'RCL' + Date.now().toString().slice(-6),
    totalAmount: getTotalCost()
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="font-heading font-bold text-3xl text-foreground mb-2">
            Book Your Appointment
          </h1>
          <p className="font-body text-base text-muted-foreground max-w-2xl mx-auto">
            Schedule your therapy session with our experienced professionals. 
            Choose from Speech Language Pathology, Occupational Therapy, or Physiotherapy services.
          </p>
        </div>

        {/* Progress Indicator */}
        <ProgressIndicator currentStep={currentStep} steps={steps} />

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 0: Service Selection */}
            {currentStep === 0 && (
              <div>
                <h2 className="font-heading font-semibold text-xl text-foreground mb-6">
                  Select Therapy Service
                </h2>
                <div className="space-y-4">
                  {services.map((service) => (
                    <ServiceCard
                      key={service.id}
                      service={service}
                      isSelected={selectedService?.id === service.id}
                      onSelect={handleServiceSelect}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Step 1: Doctor Selection */}
            {currentStep === 1 && selectedService && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-heading font-semibold text-xl text-foreground">
                    Choose Your Therapist
                  </h2>
                  <Button variant="ghost" size="sm" onClick={() => setCurrentStep(0)}>
                    <Icon name="ArrowLeft" size={16} />
                    Change Service
                  </Button>
                </div>
                <div className="space-y-4">
                  {availableDoctors.map((doctor) => (
                    <DoctorCard
                      key={doctor.id}
                      doctor={doctor}
                      isSelected={selectedDoctor?.id === doctor.id}
                      onSelect={handleDoctorSelect}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Date & Time Selection */}
            {currentStep === 2 && selectedDoctor && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-heading font-semibold text-xl text-foreground">
                    Select Date & Time
                  </h2>
                  <Button variant="ghost" size="sm" onClick={() => setCurrentStep(1)}>
                    <Icon name="ArrowLeft" size={16} />
                    Change Doctor
                  </Button>
                </div>
                <TimeSlotGrid
                  timeSlots={timeSlots}
                  selectedSlot={selectedTimeSlot}
                  onSlotSelect={handleTimeSlotSelect}
                  selectedDate={selectedDate}
                />
              </div>
            )}

            {/* Step 3: Patient Information */}
            {currentStep === 3 && (
              <PatientInfoForm
                onSubmit={handlePatientInfoSubmit}
                onBack={() => setCurrentStep(2)}
              />
            )}

            {/* Step 4: Payment Method */}
            {currentStep === 4 && (
              <PaymentMethodSelector
                totalAmount={getTotalCost()}
                onPaymentSelect={handlePaymentSelect}
                onBack={() => setCurrentStep(3)}
              />
            )}

            {/* Step 5: Booking Confirmation */}
            {currentStep === 5 && bookingConfirmed && (
              <BookingConfirmation
                bookingDetails={getBookingDetails()}
                onNewBooking={handleNewBooking}
                onDashboard={handleGoToDashboard}
              />
            )}
          </div>

          {/* Right Column - Booking Summary */}
          {currentStep < 5 && (
            <div className="lg:col-span-1">
              <BookingSummary
                bookingData={getBookingData()}
                onEdit={handleBookingEdit}
                onConfirm={handleBookingConfirm}
              />
            </div>
          )}
        </div>

        {/* Quick Actions */}
        {currentStep < 3 && (
          <div className="mt-12 p-6 bg-muted rounded-therapeutic">
            <div className="flex items-start space-x-4">
              <Icon name="HelpCircle" size={20} className="text-primary mt-1" />
              <div>
                <h3 className="font-heading font-medium text-base text-foreground mb-2">
                  Need Help Booking?
                </h3>
                <p className="font-body text-sm text-muted-foreground mb-4">
                  Our support team is available to assist you with appointment booking and answer any questions.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button variant="outline" size="sm">
                    <Icon name="Phone" size={14} />
                    Call +91 98765 43210
                  </Button>
                  <Button variant="outline" size="sm">
                    <Icon name="MessageCircle" size={14} />
                    WhatsApp Support
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentBooking;
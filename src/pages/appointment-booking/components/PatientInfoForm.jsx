import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import Button from '../../../components/ui/Button';

const PatientInfoForm = ({ onSubmit, onBack }) => {
  const [formData, setFormData] = useState({
    patientName: '',
    age: '',
    gender: '',
    phone: '',
    email: '',
    emergencyContact: '',
    emergencyPhone: '',
    medicalHistory: '',
    currentMedications: '',
    allergies: '',
    specificConcerns: '',
    previousTherapy: false,
    insuranceProvider: '',
    policyNumber: '',
    consentTreatment: false,
    consentDataSharing: false
  });

  const [errors, setErrors] = useState({});

  const genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' },
    { value: 'prefer-not-to-say', label: 'Prefer not to say' }
  ];

  const insuranceOptions = [
    { value: 'none', label: 'No Insurance' },
    { value: 'star-health', label: 'Star Health Insurance' },
    { value: 'hdfc-ergo', label: 'HDFC ERGO' },
    { value: 'icici-lombard', label: 'ICICI Lombard' },
    { value: 'bajaj-allianz', label: 'Bajaj Allianz' },
    { value: 'new-india', label: 'New India Assurance' },
    { value: 'other', label: 'Other' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.patientName.trim()) {
      newErrors.patientName = 'Patient name is required';
    }
    
    if (!formData.age || formData.age < 1 || formData.age > 120) {
      newErrors.age = 'Please enter a valid age';
    }
    
    if (!formData.gender) {
      newErrors.gender = 'Please select gender';
    }
    
    if (!formData.phone.trim() || !/^[6-9]\d{9}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid 10-digit mobile number';
    }
    
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.emergencyContact.trim()) {
      newErrors.emergencyContact = 'Emergency contact name is required';
    }
    
    if (!formData.emergencyPhone.trim() || !/^[6-9]\d{9}$/.test(formData.emergencyPhone)) {
      newErrors.emergencyPhone = 'Please enter a valid emergency contact number';
    }
    
    if (!formData.consentTreatment) {
      newErrors.consentTreatment = 'Treatment consent is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="bg-card rounded-therapeutic border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-heading font-semibold text-lg text-foreground">
          Patient Information
        </h3>
        <div className="flex items-center space-x-2 text-muted-foreground">
          <Icon name="User" size={16} />
          <span className="font-body text-sm">Required Details</span>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Patient Name"
            type="text"
            placeholder="Enter full name"
            value={formData.patientName}
            onChange={(e) => handleInputChange('patientName', e.target.value)}
            error={errors.patientName}
            required
          />
          
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Age"
              type="number"
              placeholder="Age"
              min="1"
              max="120"
              value={formData.age}
              onChange={(e) => handleInputChange('age', e.target.value)}
              error={errors.age}
              required
            />
            
            <Select
              label="Gender"
              options={genderOptions}
              value={formData.gender}
              onChange={(value) => handleInputChange('gender', value)}
              error={errors.gender}
              required
            />
          </div>
        </div>
        
        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Mobile Number"
            type="tel"
            placeholder="10-digit mobile number"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            error={errors.phone}
            required
          />
          
          <Input
            label="Email Address"
            type="email"
            placeholder="your.email@example.com"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            error={errors.email}
            required
          />
        </div>
        
        {/* Emergency Contact */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Emergency Contact Name"
            type="text"
            placeholder="Contact person name"
            value={formData.emergencyContact}
            onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
            error={errors.emergencyContact}
            required
          />
          
          <Input
            label="Emergency Contact Number"
            type="tel"
            placeholder="10-digit mobile number"
            value={formData.emergencyPhone}
            onChange={(e) => handleInputChange('emergencyPhone', e.target.value)}
            error={errors.emergencyPhone}
            required
          />
        </div>
        
        {/* Medical Information */}
        <div className="space-y-4">
          <h4 className="font-heading font-medium text-base text-foreground border-b border-border pb-2">
            Medical Information
          </h4>
          
          <Input
            label="Medical History"
            type="text"
            placeholder="Any relevant medical conditions or history"
            value={formData.medicalHistory}
            onChange={(e) => handleInputChange('medicalHistory', e.target.value)}
            description="Include any chronic conditions, surgeries, or relevant medical history"
          />
          
          <Input
            label="Current Medications"
            type="text"
            placeholder="List current medications and dosages"
            value={formData.currentMedications}
            onChange={(e) => handleInputChange('currentMedications', e.target.value)}
          />
          
          <Input
            label="Allergies"
            type="text"
            placeholder="Food, drug, or environmental allergies"
            value={formData.allergies}
            onChange={(e) => handleInputChange('allergies', e.target.value)}
          />
          
          <Input
            label="Specific Concerns"
            type="text"
            placeholder="Describe your specific concerns or symptoms"
            value={formData.specificConcerns}
            onChange={(e) => handleInputChange('specificConcerns', e.target.value)}
            description="Help us understand what you'd like to address in this session"
          />
        </div>
        
        {/* Insurance Information */}
        <div className="space-y-4">
          <h4 className="font-heading font-medium text-base text-foreground border-b border-border pb-2">
            Insurance Information
          </h4>
          
          <Select
            label="Insurance Provider"
            options={insuranceOptions}
            value={formData.insuranceProvider}
            onChange={(value) => handleInputChange('insuranceProvider', value)}
            placeholder="Select your insurance provider"
          />
          
          {formData.insuranceProvider && formData.insuranceProvider !== 'none' && (
            <Input
              label="Policy Number"
              type="text"
              placeholder="Enter your policy number"
              value={formData.policyNumber}
              onChange={(e) => handleInputChange('policyNumber', e.target.value)}
            />
          )}
        </div>
        
        {/* Previous Therapy */}
        <div className="space-y-4">
          <Checkbox
            label="I have received therapy services before"
            checked={formData.previousTherapy}
            onChange={(e) => handleInputChange('previousTherapy', e.target.checked)}
            description="This helps us understand your therapy experience"
          />
        </div>
        
        {/* Consent Checkboxes */}
        <div className="space-y-4 p-4 bg-muted rounded-therapeutic">
          <h4 className="font-heading font-medium text-base text-foreground">
            Consent & Agreements
          </h4>
          
          <Checkbox
            label="I consent to receive treatment and therapy services"
            checked={formData.consentTreatment}
            onChange={(e) => handleInputChange('consentTreatment', e.target.checked)}
            error={errors.consentTreatment}
            required
          />
          
          <Checkbox
            label="I agree to share my progress data with my healthcare team"
            checked={formData.consentDataSharing}
            onChange={(e) => handleInputChange('consentDataSharing', e.target.checked)}
            description="This helps coordinate your care across different therapists"
          />
        </div>
        
        {/* Form Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-border">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="sm:w-auto"
          >
            <Icon name="ArrowLeft" size={16} />
            Back to Time Selection
          </Button>
          
          <Button
            type="submit"
            variant="default"
            className="sm:flex-1"
          >
            <Icon name="ArrowRight" size={16} />
            Continue to Payment
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PatientInfoForm;
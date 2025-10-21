import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';


const DoctorCard = ({ doctor, isSelected, onSelect }) => {
  return (
    <div 
      className={`p-6 rounded-therapeutic border-2 transition-all duration-200 cursor-pointer ${
        isSelected 
          ? 'border-primary bg-primary/5 shadow-therapeutic-lg' 
          : 'border-border bg-card hover:border-primary/50 hover:shadow-therapeutic'
      }`}
      onClick={() => onSelect(doctor)}
    >
      <div className="flex items-start space-x-4">
        <div className="relative">
          <Image
            src={doctor.photo}
            alt={doctor.name}
            className="w-16 h-16 rounded-full object-cover"
          />
          {doctor.isAvailable && (
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-success rounded-full border-2 border-card flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
          )}
        </div>
        
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-heading font-semibold text-lg text-foreground">
                Dr. {doctor.name}
              </h3>
              <p className="font-body text-sm text-muted-foreground">
                {doctor.specialization}
              </p>
            </div>
            
            <div className="flex items-center space-x-1">
              <Icon name="Star" size={14} className="text-warning fill-current" />
              <span className="font-mono text-sm font-medium text-foreground">
                {doctor.rating}
              </span>
              <span className="font-caption text-xs text-muted-foreground">
                ({doctor.reviews})
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 mb-3">
            <div className="flex items-center space-x-1 text-muted-foreground">
              <Icon name="Award" size={14} />
              <span className="font-caption text-xs">{doctor.experience} years</span>
            </div>
            
            <div className="flex items-center space-x-1 text-muted-foreground">
              <Icon name="Users" size={14} />
              <span className="font-caption text-xs">{doctor.patients}+ patients</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-3">
            {doctor.languages.map((language, index) => (
              <span 
                key={index}
                className="px-2 py-1 bg-muted text-muted-foreground rounded-gentle font-caption text-xs"
              >
                {language}
              </span>
            ))}
          </div>
          
          <div className="flex items-center justify-between">
            <div className={`flex items-center space-x-2 ${
              doctor.isAvailable ? 'text-success' : 'text-warning'
            }`}>
              <div className={`w-2 h-2 rounded-full ${
                doctor.isAvailable ? 'bg-success' : 'bg-warning'
              }`}></div>
              <span className="font-body text-sm">
                {doctor.isAvailable ? 'Available Today' : 'Next Available: Tomorrow'}
              </span>
            </div>
            
            {isSelected && (
              <div className="flex items-center space-x-2 text-primary">
                <Icon name="Check" size={16} />
                <span className="font-body text-sm">Selected</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;
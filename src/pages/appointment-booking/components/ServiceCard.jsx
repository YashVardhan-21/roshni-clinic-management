import React from 'react';
import Icon from '../../../components/AppIcon';


const ServiceCard = ({ service, isSelected, onSelect }) => {
  return (
    <div 
      className={`p-6 rounded-therapeutic border-2 transition-all duration-200 cursor-pointer ${
        isSelected 
          ? 'border-primary bg-primary/5 shadow-therapeutic-lg' 
          : 'border-border bg-card hover:border-primary/50 hover:shadow-therapeutic'
      }`}
      onClick={() => onSelect(service)}
    >
      <div className="flex items-start space-x-4">
        <div className={`p-3 rounded-therapeutic ${
          isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
        }`}>
          <Icon name={service.icon} size={24} />
        </div>
        
        <div className="flex-1">
          <h3 className="font-heading font-semibold text-lg text-foreground mb-2">
            {service.name}
          </h3>
          <p className="font-body text-sm text-muted-foreground mb-3 leading-relaxed">
            {service.description}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="font-mono text-lg font-semibold text-primary">
                ₹{service.price}
              </span>
              <span className="font-caption text-xs text-muted-foreground">
                per session
              </span>
            </div>
            
            <div className="flex items-center space-x-1 text-muted-foreground">
              <Icon name="Clock" size={14} />
              <span className="font-caption text-xs">{service.duration}</span>
            </div>
          </div>
          
          {isSelected && (
            <div className="mt-4 pt-4 border-t border-border">
              <div className="flex items-center space-x-2 text-success">
                <Icon name="Check" size={16} />
                <span className="font-body text-sm">Service Selected</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
import React from 'react';
import Icon from '../../../components/AppIcon';

const ProgressIndicator = ({ currentStep, steps }) => {
  return (
    <div className="bg-card rounded-therapeutic border border-border p-4 mb-6">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div className="flex items-center space-x-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
                index < currentStep 
                  ? 'bg-success text-success-foreground' 
                  : index === currentStep 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground'
              }`}>
                {index < currentStep ? (
                  <Icon name="Check" size={16} />
                ) : (
                  <span className="font-mono text-sm font-medium">{index + 1}</span>
                )}
              </div>
              
              <div className="hidden sm:block">
                <p className={`font-body text-sm font-medium ${
                  index <= currentStep ? 'text-foreground' : 'text-muted-foreground'
                }`}>
                  {step.title}
                </p>
                <p className="font-caption text-xs text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </div>
            
            {index < steps.length - 1 && (
              <div className={`flex-1 h-0.5 mx-4 transition-all duration-200 ${
                index < currentStep ? 'bg-success' : 'bg-border'
              }`} />
            )}
          </React.Fragment>
        ))}
      </div>
      
      {/* Mobile step indicator */}
      <div className="sm:hidden mt-4 text-center">
        <p className="font-body text-sm font-medium text-foreground">
          {steps[currentStep]?.title}
        </p>
        <p className="font-caption text-xs text-muted-foreground">
          Step {currentStep + 1} of {steps.length}
        </p>
      </div>
    </div>
  );
};

export default ProgressIndicator;
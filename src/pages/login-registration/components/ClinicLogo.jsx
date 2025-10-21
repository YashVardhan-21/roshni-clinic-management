import React from 'react';

const ClinicLogo = ({ selectedLanguage }) => {
  return (
    <div className="text-center space-y-4 mb-8">
      {/* Logo Icon */}
      <div className="flex items-center justify-center w-20 h-20 bg-primary rounded-therapeutic mx-auto shadow-therapeutic">
        <svg viewBox="0 0 24 24" className="w-10 h-10 text-primary-foreground" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>
      </div>

      {/* Clinic Name */}
      <div>
        <h1 className="text-3xl font-heading font-bold text-foreground">
          {selectedLanguage === 'hindi' ? 'रोशनी क्लिनिक' : 'Roshni Clinic'}
        </h1>
        <p className="text-muted-foreground font-body">
          {selectedLanguage === 'hindi' ?'व्यापक चिकित्सा प्रबंधन प्रणाली' :'Comprehensive Therapy Management System'
          }
        </p>
      </div>

      {/* Tagline */}
      <div className="px-4 py-2 bg-primary/10 rounded-therapeutic inline-block">
        <p className="text-sm text-primary font-medium">
          {selectedLanguage === 'hindi' ?'आपके स्वास्थ्य की देखभाल में आपका साथी' :'Your Partner in Health & Wellness'
          }
        </p>
      </div>
    </div>
  );
};

export default ClinicLogo;
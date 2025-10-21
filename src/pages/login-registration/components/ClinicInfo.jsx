import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const ClinicInfo = ({ selectedLanguage }) => {
  const services = [
    {
      id: 1,
      name: "Speech Language Pathology",
      description: "Comprehensive speech and language therapy for all ages",
      icon: "MessageCircle",
      features: ["Articulation Therapy", "Language Development", "Voice Therapy", "Fluency Treatment"]
    },
    {
      id: 2,
      name: "Occupational Therapy",
      description: "Helping patients develop daily living skills and independence",
      icon: "Activity",
      features: ["Fine Motor Skills", "Sensory Integration", "Cognitive Training", "Daily Living Skills"]
    },
    {
      id: 3,
      name: "Physiotherapy",
      description: "Physical rehabilitation and movement therapy",
      icon: "Heart",
      features: ["Movement Therapy", "Strength Training", "Balance Training", "Pain Management"]
    }
  ];

  const testimonials = [
    {
      id: 1,
      name: "Priya Sharma",
      role: "Parent",
      content: "The speech therapy program has transformed my daughter\'s communication skills. The therapists are incredibly patient and skilled.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b9e2b8b4?w=100&h=100&fit=crop&crop=face"
    },
    {
      id: 2,
      name: "Rajesh Kumar",
      role: "Patient",
      content: "After my stroke, the physiotherapy team helped me regain my mobility. I'm grateful for their dedication and expertise.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
    },
    {
      id: 3,
      name: "Anita Patel",
      role: "Family Member",
      content: "The occupational therapy sessions have greatly improved my son\'s daily living skills. Highly recommended!",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face"
    },
    {
      id: 4,
      name: "Sunita Mehta",
      role: "Patient",
      content: "Excellent care and support throughout my recovery journey. The team's expertise and compassion made all the difference.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face"
    },
    {
      id: 5,
      name: "Vikram Singh",
      role: "Parent",
      content: "The comprehensive approach to my child's therapy has shown remarkable results. Professional, caring, and effective treatment.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
    }
  ];

  const clinicStats = [
    { label: "Years of Experience", value: "15+", icon: "Calendar" },
    { label: "Patients Treated", value: "5000+", icon: "Users" },
    { label: "Success Rate", value: "95%", icon: "TrendingUp" },
    { label: "Therapists", value: "25+", icon: "UserCheck" }
  ];

  return (
    <div className="space-y-8">
      {/* Clinic Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center w-16 h-16 bg-primary rounded-therapeutic mx-auto">
          <svg viewBox="0 0 24 24" className="w-8 h-8 text-primary-foreground" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        </div>
        <div>
          <h2 className="text-2xl font-heading font-semibold text-foreground">Welcome to Roshni Clinic</h2>
          <p className="text-muted-foreground">
            {selectedLanguage === 'hindi' 
              ? "आपके स्वास्थ्य की देखभाल में आपका साथी" :"Your partner in comprehensive healthcare and therapy"
            }
          </p>
        </div>
      </div>

      {/* Clinic Stats */}
      <div className="grid grid-cols-2 gap-4">
        {clinicStats.map((stat) => (
          <div key={stat.label} className="text-center p-4 bg-muted/50 rounded-therapeutic">
            <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-full mx-auto mb-2">
              <Icon name={stat.icon} size={16} className="text-primary" />
            </div>
            <div className="text-lg font-heading font-semibold text-foreground">{stat.value}</div>
            <div className="text-xs text-muted-foreground">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Services Overview - Hidden on landing page, visible on scroll */}
      <div className="space-y-4 mt-8 lg:mt-16">
        <h3 className="text-lg font-heading font-medium text-foreground">Our Services</h3>
        <div className="space-y-3">
          {services.map((service) => (
            <div key={service.id} className="p-4 bg-card border border-border rounded-therapeutic">
              <div className="flex items-start space-x-3">
                <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-therapeutic">
                  <Icon name={service.icon} size={20} className="text-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="font-body font-medium text-sm text-foreground">{service.name}</h4>
                  <p className="text-xs text-muted-foreground mt-1">{service.description}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {service.features.slice(0, 2).map((feature, index) => (
                      <span key={index} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClinicInfo;
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import AuthForm from './components/AuthForm';
import ClinicInfo from './components/ClinicInfo';
import LanguageToggle from './components/LanguageToggle';
import ClinicLogo from './components/ClinicLogo';
import Icon from '../../components/AppIcon';
import Image from '../../components/AppImage';

const LoginRegistration = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState('english');

  // Load saved language preference
  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferredLanguage');
    if (savedLanguage) {
      setSelectedLanguage(savedLanguage);
    }
  }, []);

  // Save language preference
  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
    localStorage.setItem('preferredLanguage', language);
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
  };

  const getPageTitle = () => {
    if (selectedLanguage === 'hindi') {
      return isLogin ? 'लॉगिन - रोशनी क्लिनिक' : 'पंजीकरण - रोशनी क्लिनिक';
    }
    return isLogin ? 'Login - Roshni Clinic' : 'Register - Roshni Clinic';
  };

  const getPageDescription = () => {
    if (selectedLanguage === 'hindi') {
      return 'रोशनी क्लिनिक प्रबंधन प्रणाली में सुरक्षित पहुंच';
    }
    return 'Secure access to Roshni Clinic Management System for patients, families, and staff';
  };

  return (
    <>
      <Helmet>
        <title>{getPageTitle()}</title>
        <meta name="description" content={getPageDescription()} />
        <meta name="keywords" content="roshni clinic, login, registration, therapy, healthcare, speech therapy, occupational therapy, physiotherapy" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Language Toggle - Top Right */}
        <div className="absolute top-4 right-4 z-10">
          <LanguageToggle
            selectedLanguage={selectedLanguage}
            onLanguageChange={handleLanguageChange}
          />
        </div>

        <div className="flex flex-col lg:flex-row">
          {/* Left Side - Authentication Form (Mobile: Full Width, Desktop: 50%) */}
          <div className="w-full lg:w-1/2 p-3 lg:p-6 space-y-2 lg:space-y-6">
            {/* Logo Section */}
            <div className="pt-2">
              <ClinicLogo selectedLanguage={selectedLanguage} />
            </div>

            {/* Form Section - Smaller */}
            <div className="flex justify-center">
              <div className="w-full max-w-md">
                <div className="bg-card border border-border rounded-therapeutic shadow-therapeutic-lg p-4">
                  <div className="mb-3">
                    <h2 className="text-xl font-heading font-semibold text-foreground text-center">
                    {selectedLanguage === 'hindi' ? (isLogin ?'लॉगिन करें' : 'खाता बनाएं')
                      : (isLogin ? 'Welcome Back' : 'Create Account')
                    }
                  </h2>
                    <p className="text-muted-foreground text-center mt-1 text-sm">
                    {selectedLanguage === 'hindi' ? (isLogin ?'अपने खाते में साइन इन करें' : 'रोशनी क्लिनिक में शामिल हों')
                      : (isLogin ? 'Sign in to your account' : 'Join Roshni Clinic today')
                    }
                  </p>
                </div>

                <AuthForm
                  isLogin={isLogin}
                  onToggleMode={toggleAuthMode}
                  selectedLanguage={selectedLanguage}
                />
                </div>
              </div>
            </div>

              </div>

          {/* Right Side - Welcome & Stats Only (Desktop Only) */}
          <div className="hidden lg:block w-1/2 bg-muted/30 border-l border-border">
            <div className="h-full overflow-y-auto p-6 pt-16">
              {/* Welcome Header */}
              <div className="text-center space-y-4 mb-8">
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

              {/* Stats Grid - 6 Stats (3x2) */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-card rounded-therapeutic border border-border">
                  <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-full mx-auto mb-2">
                    <Icon name="Calendar" size={16} className="text-primary" />
                  </div>
                  <div className="text-lg font-heading font-semibold text-foreground">15+</div>
                  <div className="text-xs text-muted-foreground">Years Experience</div>
                </div>
                <div className="text-center p-4 bg-card rounded-therapeutic border border-border">
                  <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-full mx-auto mb-2">
                    <Icon name="Users" size={16} className="text-primary" />
                  </div>
                  <div className="text-lg font-heading font-semibold text-foreground">5000+</div>
                  <div className="text-xs text-muted-foreground">Patients Treated</div>
                </div>
                <div className="text-center p-4 bg-card rounded-therapeutic border border-border">
                  <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-full mx-auto mb-2">
                    <Icon name="TrendingUp" size={16} className="text-primary" />
                  </div>
                  <div className="text-lg font-heading font-semibold text-foreground">95%</div>
                  <div className="text-xs text-muted-foreground">Success Rate</div>
                </div>
                <div className="text-center p-4 bg-card rounded-therapeutic border border-border">
                  <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-full mx-auto mb-2">
                    <Icon name="UserCheck" size={16} className="text-primary" />
                  </div>
                  <div className="text-lg font-heading font-semibold text-foreground">25+</div>
                  <div className="text-xs text-muted-foreground">Therapists</div>
                </div>
                <div className="text-center p-4 bg-card rounded-therapeutic border border-border">
                  <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-full mx-auto mb-2">
                    <Icon name="Award" size={16} className="text-primary" />
                  </div>
                  <div className="text-lg font-heading font-semibold text-foreground">50+</div>
                  <div className="text-xs text-muted-foreground">Awards Won</div>
                </div>
                <div className="text-center p-4 bg-card rounded-therapeutic border border-border">
                  <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-full mx-auto mb-2">
                    <Icon name="MapPin" size={16} className="text-primary" />
                  </div>
                  <div className="text-lg font-heading font-semibold text-foreground">3</div>
                  <div className="text-xs text-muted-foreground">Clinic Locations</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Stats Section */}
        <div className="lg:hidden bg-muted/30 border-t border-border p-3 pt-4">
          <div className="text-center space-y-2 mb-3">
            <div className="flex items-center justify-center w-16 h-16 bg-primary rounded-therapeutic mx-auto">
              <svg viewBox="0 0 24 24" className="w-8 h-8 text-primary-foreground" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-heading font-semibold text-foreground">Welcome to Roshni Clinic</h2>
              <p className="text-muted-foreground text-sm">
                {selectedLanguage === 'hindi' 
                  ? "आपके स्वास्थ्य की देखभाल में आपका साथी" :"Your partner in comprehensive healthcare and therapy"
                }
              </p>
            </div>
          </div>

          {/* Mobile Stats Grid - 2x3 */}
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-3 bg-card rounded-therapeutic border border-border">
              <div className="flex items-center justify-center w-6 h-6 bg-primary/10 rounded-full mx-auto mb-1">
                <Icon name="Calendar" size={12} className="text-primary" />
              </div>
              <div className="text-sm font-heading font-semibold text-foreground">15+</div>
              <div className="text-xs text-muted-foreground">Years Experience</div>
            </div>
            <div className="text-center p-3 bg-card rounded-therapeutic border border-border">
              <div className="flex items-center justify-center w-6 h-6 bg-primary/10 rounded-full mx-auto mb-1">
                <Icon name="Users" size={12} className="text-primary" />
              </div>
              <div className="text-sm font-heading font-semibold text-foreground">5000+</div>
              <div className="text-xs text-muted-foreground">Patients Treated</div>
            </div>
            <div className="text-center p-3 bg-card rounded-therapeutic border border-border">
              <div className="flex items-center justify-center w-6 h-6 bg-primary/10 rounded-full mx-auto mb-1">
                <Icon name="TrendingUp" size={12} className="text-primary" />
              </div>
              <div className="text-sm font-heading font-semibold text-foreground">95%</div>
              <div className="text-xs text-muted-foreground">Success Rate</div>
            </div>
            <div className="text-center p-3 bg-card rounded-therapeutic border border-border">
              <div className="flex items-center justify-center w-6 h-6 bg-primary/10 rounded-full mx-auto mb-1">
                <Icon name="UserCheck" size={12} className="text-primary" />
              </div>
              <div className="text-sm font-heading font-semibold text-foreground">25+</div>
              <div className="text-xs text-muted-foreground">Therapists</div>
            </div>
            <div className="text-center p-3 bg-card rounded-therapeutic border border-border">
              <div className="flex items-center justify-center w-6 h-6 bg-primary/10 rounded-full mx-auto mb-1">
                <Icon name="Award" size={12} className="text-primary" />
              </div>
              <div className="text-sm font-heading font-semibold text-foreground">50+</div>
              <div className="text-xs text-muted-foreground">Awards Won</div>
            </div>
            <div className="text-center p-3 bg-card rounded-therapeutic border border-border">
              <div className="flex items-center justify-center w-6 h-6 bg-primary/10 rounded-full mx-auto mb-1">
                <Icon name="MapPin" size={12} className="text-primary" />
              </div>
              <div className="text-sm font-heading font-semibold text-foreground">3</div>
              <div className="text-xs text-muted-foreground">Clinic Locations</div>
            </div>
          </div>
        </div>

        {/* Scroll Down Section - Testimonials + Services */}
        <div className="flex flex-col lg:flex-row border-t border-border">
          {/* Left Side - Testimonials */}
          <div className="w-full lg:w-1/2 p-4 lg:p-6 bg-background pb-2">
            <div className="space-y-3">
              <h3 className="text-lg font-heading font-medium text-foreground text-center">What Our Patients Say</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  {
                    id: 1,
                    name: "Priya Sharma",
                    role: "Parent",
                    content: "The speech therapy program has transformed my daughter's communication skills. The therapists are incredibly patient and skilled.",
                    rating: 5,
                    avatar: "https://images.unsplash.com/photo-1494790108755-2616b9e2b4?w=100&h=100&fit=crop&crop=face"
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
                    content: "The occupational therapy sessions have greatly improved my son's daily living skills. Highly recommended!",
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
                  }
                ].map((testimonial) => (
                  <div key={testimonial.id} className="p-3 bg-card border border-border rounded-therapeutic">
                    <div className="flex items-start space-x-3">
                      <Image
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-body font-medium text-sm text-foreground">{testimonial.name}</h4>
                          <span className="text-xs text-muted-foreground">•</span>
                          <span className="text-xs text-muted-foreground">{testimonial.role}</span>
                        </div>
                        <div className="flex items-center space-x-1 mb-2">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Icon key={i} name="Star" size={10} className="text-warning fill-current" />
                          ))}
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">{testimonial.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            </div>
            
          {/* Right Side - Services */}
          <div className="w-full lg:w-1/2 p-4 lg:p-6 bg-muted/30 lg:border-l border-t lg:border-t-0 border-border pb-2">
            <div className="space-y-3">
              <h3 className="text-lg font-heading font-medium text-foreground">Our Services</h3>
              <div className="space-y-3">
                {[
                  {
                    id: 1,
                    name: "Speech Language Pathology",
                    description: "Comprehensive speech and language therapy for all ages",
                    icon: "MessageCircle",
                    features: ["Articulation Therapy", "Language Development"]
                  },
                  {
                    id: 2,
                    name: "Occupational Therapy",
                    description: "Helping patients develop daily living skills and independence",
                    icon: "Activity",
                    features: ["Fine Motor Skills", "Sensory Integration"]
                  },
                  {
                    id: 3,
                    name: "Physiotherapy",
                    description: "Physical rehabilitation and movement therapy",
                    icon: "Heart",
                    features: ["Movement Therapy", "Strength Training"]
                  }
                ].map((service) => (
                  <div key={service.id} className="p-4 bg-card border border-border rounded-therapeutic">
                    <div className="flex items-start space-x-3">
                      <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-therapeutic">
                        <Icon name={service.icon} size={20} className="text-primary" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-body font-medium text-sm text-foreground">{service.name}</h4>
                        <p className="text-xs text-muted-foreground mt-1">{service.description}</p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {service.features.map((feature, index) => (
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
        </div>

        {/* Contact Bar - Bottom */}
        <div className="bg-primary/5 border-t border-border py-4">
          <div className="max-w-7xl mx-auto px-4 lg:px-6">
            <div className="flex flex-col lg:flex-row items-center justify-between space-y-3 lg:space-y-0 lg:space-x-6">
              {/* Contact Info */}
              <div className="flex flex-col lg:flex-row items-center space-y-2 lg:space-y-0 lg:space-x-6">
                <div className="flex items-center space-x-2">
                  <Icon name="Phone" size={16} className="text-primary" />
                  <span className="text-sm text-foreground">+91 98765 43210</span>
            </div>
                <div className="flex items-center space-x-2">
                  <Icon name="Mail" size={16} className="text-primary" />
                  <span className="text-sm text-foreground">info@roshniclinic.com</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Icon name="Clock" size={16} className="text-primary" />
                  <span className="text-sm text-foreground">Mon-Sat: 4:30 PM - 9:45 PM</span>
              </div>
                <div className="flex items-center space-x-2">
                  <Icon name="AlertCircle" size={16} className="text-error" />
                  <span className="text-sm text-error font-medium">Emergency: +91 98765 43211</span>
              </div>
            </div>

              {/* Copyright */}
              <div className="text-center lg:text-right">
              <p className="text-xs text-muted-foreground">
                  © {new Date().getFullYear()} Roshni Clinic. 
                  {selectedLanguage === 'hindi' ? ' सभी अधिकार सुरक्षित।' : ' All rights reserved.'}
              </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginRegistration;
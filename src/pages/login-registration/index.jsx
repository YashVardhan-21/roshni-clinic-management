import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import AuthForm from './components/AuthForm';
import ClinicInfo from './components/ClinicInfo';
import LanguageToggle from './components/LanguageToggle';
import ClinicLogo from './components/ClinicLogo';

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

        <div className="flex min-h-screen">
          {/* Left Side - Authentication Form (Mobile: Full Width, Desktop: 60%) */}
          <div className="w-full lg:w-3/5 flex items-center justify-center p-4 lg:p-8">
            <div className="w-full max-w-md space-y-8">
              {/* Clinic Logo */}
              <ClinicLogo selectedLanguage={selectedLanguage} />

              {/* Authentication Form */}
              <div className="bg-card border border-border rounded-therapeutic shadow-therapeutic-lg p-6 lg:p-8">
                <div className="mb-6">
                  <h2 className="text-2xl font-heading font-semibold text-foreground text-center">
                    {selectedLanguage === 'hindi' ? (isLogin ?'लॉगिन करें' : 'खाता बनाएं')
                      : (isLogin ? 'Welcome Back' : 'Create Account')
                    }
                  </h2>
                  <p className="text-muted-foreground text-center mt-2">
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

              {/* Additional Information */}
              <div className="text-center space-y-2">
                <p className="text-xs text-muted-foreground">
                  {selectedLanguage === 'hindi' ?'साइन इन करके, आप हमारी सेवा की शर्तों और गोपनीयता नीति से सहमत हैं' :'By signing in, you agree to our Terms of Service and Privacy Policy'
                  }
                </p>
                <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground">
                  <span>
                    {selectedLanguage === 'hindi' ? 'सहायता चाहिए?' : 'Need help?'}
                  </span>
                  <span>•</span>
                  <button className="text-primary hover:text-primary/80 transition-colors">
                    {selectedLanguage === 'hindi' ? 'संपर्क करें' : 'Contact Support'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Clinic Information (Desktop Only) */}
          <div className="hidden lg:block w-2/5 bg-muted/30 border-l border-border">
            <div className="h-full overflow-y-auto p-8">
              <ClinicInfo selectedLanguage={selectedLanguage} />
            </div>
          </div>
        </div>

        {/* Mobile Clinic Info - Bottom Section */}
        <div className="lg:hidden bg-muted/30 border-t border-border">
          <div className="p-4">
            <div className="text-center mb-4">
              <h3 className="text-lg font-heading font-medium text-foreground">
                {selectedLanguage === 'hindi' ? 'रोशनी क्लिनिक के बारे में' : 'About Roshni Clinic'}
              </h3>
            </div>
            
            {/* Quick Stats for Mobile */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center p-3 bg-card rounded-therapeutic">
                <div className="text-lg font-heading font-semibold text-primary">15+</div>
                <div className="text-xs text-muted-foreground">
                  {selectedLanguage === 'hindi' ? 'वर्षों का अनुभव' : 'Years Experience'}
                </div>
              </div>
              <div className="text-center p-3 bg-card rounded-therapeutic">
                <div className="text-lg font-heading font-semibold text-primary">5000+</div>
                <div className="text-xs text-muted-foreground">
                  {selectedLanguage === 'hindi' ? 'मरीज़ों का इलाज' : 'Patients Treated'}
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="text-center space-y-2">
              <p className="text-sm text-foreground font-medium">
                {selectedLanguage === 'hindi' ? 'संपर्क करें' : 'Get in Touch'}
              </p>
              <p className="text-sm text-muted-foreground">+91 98765 43210</p>
              <p className="text-sm text-muted-foreground">info@roshniclinic.com</p>
              <p className="text-xs text-muted-foreground">
                {selectedLanguage === 'hindi' ?'सोमवार-शनिवार: 4:30 PM - 9:45 PM' :'Mon-Sat: 4:30 PM - 9:45 PM'
                }
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-card border-t border-border py-4">
          <div className="text-center text-xs text-muted-foreground">
            <p>
              © {new Date().getFullYear()} Roshni Clinic. 
              {selectedLanguage === 'hindi' ? ' सभी अधिकार सुरक्षित।' : ' All rights reserved.'}
            </p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default LoginRegistration;
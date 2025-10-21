import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';

const AuthForm = ({ isLogin, onToggleMode, selectedLanguage }) => {
  const navigate = useNavigate();
  const { signIn, signUp, authError, clearError } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    phone_number: '',
    role: 'patient',
    specialization: '',
    license_number: '',
    years_of_experience: '',
    confirmPassword: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear errors when user types
    if (formError) setFormError('');
    if (authError) clearError();
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setFormError(selectedLanguage === 'hindi' ? 'सभी आवश्यक फील्ड भरें' : 'Please fill in all required fields');
      return false;
    }

    if (!isLogin) {
      if (!formData.full_name) {
        setFormError(selectedLanguage === 'hindi' ? 'पूरा नाम आवश्यक है' : 'Full name is required');
        return false;
      }

      if (formData.password !== formData.confirmPassword) {
        setFormError(selectedLanguage === 'hindi' ? 'पासवर्ड मेल नहीं खाते' : 'Passwords do not match');
        return false;
      }

      if (formData.password.length < 6) {
        setFormError(selectedLanguage === 'hindi' ? 'पासवर्ड कम से कम 6 अक्षर का होना चाहिए' : 'Password must be at least 6 characters');
        return false;
      }

      if (formData.role === 'therapist' && !formData.specialization) {
        setFormError(selectedLanguage === 'hindi' ? 'थेरेपिस्ट के लिए विशेषज्ञता आवश्यक है' : 'Specialization is required for therapists');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setFormError('');

    try {
      if (isLogin) {
        const result = await signIn(formData.email, formData.password);
        
        if (result?.success) {
          // Redirect based on user role - for now redirect to dashboard
          navigate('/patient-dashboard');
        }
      } else {
        const userData = {
          full_name: formData.full_name,
          phone_number: formData.phone_number,
          role: formData.role,
          language_preference: selectedLanguage,
          ...(formData.role === 'therapist' && {
            specialization: formData.specialization,
            license_number: formData.license_number,
            years_of_experience: formData.years_of_experience ? parseInt(formData.years_of_experience) : null
          })
        };

        const result = await signUp(formData.email, formData.password, userData);
        
        if (result?.success) {
          // Show success message or redirect
          setFormError('');
          // For email confirmation flow, show message
          alert(selectedLanguage === 'hindi' ? 'खाता बनाया गया। कृपया अपना ईमेल चेक करें।' : 'Account created! Please check your email for confirmation.');
        }
      }
    } catch (error) {
      setFormError(selectedLanguage === 'hindi' ? 'कुछ गलत हुआ है' : 'Something went wrong');
      console.log('Auth error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getSpecializationOptions = () => [
    { value: 'slp', label: selectedLanguage === 'hindi' ? 'स्पीच लैंग्वेज पैथोलॉजी' : 'Speech Language Pathology' },
    { value: 'ot', label: selectedLanguage === 'hindi' ? 'ऑक्यूपेशनल थेरेपी' : 'Occupational Therapy' },
    { value: 'pt', label: selectedLanguage === 'hindi' ? 'फिजियोथेरेपी' : 'Physiotherapy' }
  ];

  const getRoleOptions = () => [
    { value: 'patient', label: selectedLanguage === 'hindi' ? 'मरीज़' : 'Patient' },
    { value: 'family_member', label: selectedLanguage === 'hindi' ? 'पारिवारिक सदस्य' : 'Family Member' },
    { value: 'therapist', label: selectedLanguage === 'hindi' ? 'थेरेपिस्ट' : 'Therapist' }
  ];

  const displayError = formError || authError;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Error Display */}
      {displayError && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
          <AlertCircle size={16} />
          <span>{displayError}</span>
        </div>
      )}

      {/* Registration Fields */}
      {!isLogin && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              name="full_name"
              type="text"
              placeholder={selectedLanguage === 'hindi' ? 'पूरा नाम' : 'Full Name'}
              value={formData.full_name}
              onChange={handleInputChange}
              required={!isLogin}
              className="w-full"
            />
            <Input
              name="phone_number"
              type="tel"
              placeholder={selectedLanguage === 'hindi' ? 'फोन नंबर' : 'Phone Number'}
              value={formData.phone_number}
              onChange={handleInputChange}
              className="w-full"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              options={getRoleOptions()}
              placeholder={selectedLanguage === 'hindi' ? 'भूमिका चुनें' : 'Select Role'}
              required={!isLogin}
            />
            
            {formData.role === 'therapist' && (
              <Select
                name="specialization"
                value={formData.specialization}
                onChange={handleInputChange}
                options={getSpecializationOptions()}
                placeholder={selectedLanguage === 'hindi' ? 'विशेषज्ञता चुनें' : 'Select Specialization'}
                required={formData.role === 'therapist'}
              />
            )}
          </div>

          {formData.role === 'therapist' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                name="license_number"
                type="text"
                placeholder={selectedLanguage === 'hindi' ? 'लाइसेंस नंबर' : 'License Number'}
                value={formData.license_number}
                onChange={handleInputChange}
                className="w-full"
              />
              <Input
                name="years_of_experience"
                type="number"
                placeholder={selectedLanguage === 'hindi' ? 'अनुभव (वर्षों में)' : 'Years of Experience'}
                value={formData.years_of_experience}
                onChange={handleInputChange}
                min="0"
                className="w-full"
              />
            </div>
          )}
        </>
      )}

      {/* Email Field */}
      <Input
        name="email"
        type="email"
        placeholder={selectedLanguage === 'hindi' ? 'ईमेल पता' : 'Email Address'}
        value={formData.email}
        onChange={handleInputChange}
        required
        className="w-full"
      />

      {/* Password Field */}
      <div className="relative">
        <Input
          name="password"
          type={showPassword ? 'text' : 'password'}
          placeholder={selectedLanguage === 'hindi' ? 'पासवर्ड' : 'Password'}
          value={formData.password}
          onChange={handleInputChange}
          required
          className="w-full pr-10"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>

      {/* Confirm Password Field - Registration Only */}
      {!isLogin && (
        <div className="relative">
          <Input
            name="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder={selectedLanguage === 'hindi' ? 'पासवर्ड पुष्टि करें' : 'Confirm Password'}
            value={formData.confirmPassword}
            onChange={handleInputChange}
            required={!isLogin}
            className="w-full pr-10"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isLoading}
        className="w-full h-10 text-base"
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <Loader2 size={20} className="animate-spin" />
            <span>
              {selectedLanguage === 'hindi' ? 'कृपया प्रतीक्षा करें...' : 'Please wait...'}
            </span>
          </div>
        ) : (
          selectedLanguage === 'hindi' ? (isLogin ? 'लॉगिन करें' : 'खाता बनाएं') : (isLogin ? 'Sign In' : 'Create Account')
        )}
      </Button>

      {/* Toggle Mode */}
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          {selectedLanguage === 'hindi' ? (
            isLogin ? 'नया खाता बनाना है?' : 'पहले से खाता है?'
          ) : (
            isLogin ? 'Need to create an account?' : 'Already have an account?'
          )}
          <button
            type="button"
            onClick={onToggleMode}
            className="ml-1 text-primary hover:text-primary/80 transition-colors font-medium"
          >
            {selectedLanguage === 'hindi' ? (
              isLogin ? 'यहाँ साइन अप करें' : 'यहाँ लॉगिन करें'
            ) : (
              isLogin ? 'Sign up here' : 'Sign in here'
            )}
          </button>
        </p>
      </div>

      {/* Forgot Password - Login Only */}
      {isLogin && (
        <div className="text-center">
          <button
            type="button"
            className="text-sm text-primary hover:text-primary/80 transition-colors"
            onClick={() => {
              // TODO: Implement forgot password
              alert(selectedLanguage === 'hindi' ? 'पासवर्ड रीसेट सुविधा जल्द आ रही है' : 'Password reset feature coming soon');
            }}
          >
            {selectedLanguage === 'hindi' ? 'पासवर्ड भूल गए?' : 'Forgot Password?'}
          </button>
        </div>
      )}
    </form>
  );
};

export default AuthForm;
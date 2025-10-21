import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Menu, X, LogOut, User, Settings, Bell } from 'lucide-react';

const Header = () => {
  const { user, userProfile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleSignOut = async () => {
    const result = await signOut();
    if (result?.success) {
      navigate('/login-registration');
    }
  };

  const getNavItems = () => {
    if (!userProfile) return [];

    const baseItems = [
      { label: 'Dashboard', path: '/patient-dashboard', roles: ['patient', 'family_member'] },
      { label: 'Therapist Dashboard', path: '/therapist-dashboard', roles: ['therapist', 'admin'] },
      { label: 'Book Appointment', path: '/appointment-booking', roles: ['patient', 'family_member'] },
      { label: 'Progress Tracking', path: '/patient-progress-tracking', roles: ['patient', 'family_member', 'therapist'] },
      { label: 'Therapy Exercises', path: '/therapy-exercises-hub', roles: ['patient', 'family_member'] }
    ];

    return baseItems.filter(item => item.roles.includes(userProfile.role));
  };

  const isCurrentPath = (path) => location.pathname === path;

  // Don't show header on login page
  if (location.pathname === '/login-registration') {
    return null;
  }

  return (
    <header className="bg-card border-b border-border shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">R</span>
              </div>
              <span className="text-xl font-heading font-bold text-foreground">
                Roshni Clinic
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            {getNavItems().map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isCurrentPath(item.path)
                    ? 'bg-primary text-white' :'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button className="p-2 text-muted-foreground hover:text-foreground rounded-md">
              <Bell size={20} />
            </button>

            {/* User Profile */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted"
                >
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-white font-medium text-sm">
                      {userProfile?.full_name?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <span className="hidden md:block text-sm font-medium text-foreground">
                    {userProfile?.full_name || 'User'}
                  </span>
                </button>

                {/* User Dropdown */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-md shadow-lg py-1 z-50">
                    <div className="px-4 py-2 border-b border-border">
                      <p className="text-sm font-medium text-foreground">
                        {userProfile?.full_name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {userProfile?.role?.replace('_', ' ') || 'User'}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        // TODO: Navigate to profile page
                      }}
                      className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted"
                    >
                      <User size={16} />
                      <span>Profile</span>
                    </button>
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        // TODO: Navigate to settings page
                      }}
                      className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted"
                    >
                      <Settings size={16} />
                      <span>Settings</span>
                    </button>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted border-t border-border"
                    >
                      <LogOut size={16} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login-registration"
                className="px-4 py-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
              >
                Sign In
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-muted-foreground hover:text-foreground"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border bg-card">
            <nav className="px-2 pt-2 pb-3 space-y-1">
              {getNavItems().map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    isCurrentPath(item.path)
                      ? 'bg-primary text-white' :'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>

      {/* Click outside to close user menu */}
      {isUserMenuOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsUserMenuOpen(false)}
        />
      )}
    </header>
  );
};

export default Header;
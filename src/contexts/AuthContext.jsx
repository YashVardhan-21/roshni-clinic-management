import React, { createContext, useContext, useEffect, useState } from "react";
import authService from "../utils/authService";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Development mode - bypass authentication for testing
  const isDevelopmentMode = !import.meta.env.VITE_SUPABASE_URL || 
                           import.meta.env.VITE_SUPABASE_URL === 'your_supabase_project_url_here' ||
                           import.meta.env.VITE_SUPABASE_URL.includes('your_supabase') ||
                           !import.meta.env.VITE_SUPABASE_ANON_KEY ||
                           import.meta.env.VITE_SUPABASE_ANON_KEY === 'your_supabase_anon_key_here' ||
                           import.meta.env.VITE_ENVIRONMENT === 'development' ||
                           import.meta.env.VITE_FORCE_DEV_MODE === 'true' ||
                           import.meta.env.DEV || // Vite development mode
                           window.location.hostname === 'localhost' || // Local development
                           window.location.hostname === '127.0.0.1'; // Local development

  useEffect(() => {
    let isMounted = true;

    // Initialize auth state
    const initializeAuth = async () => {
      try {
        setLoading(true);
        setAuthError(null);

        // Development mode - use mock user data
        console.log('🔍 Auth Debug - isDevelopmentMode:', isDevelopmentMode);
        console.log('🔍 Auth Debug - VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL);
        console.log('🔍 Auth Debug - VITE_FORCE_DEV_MODE:', import.meta.env.VITE_FORCE_DEV_MODE);
        console.log('🔍 Auth Debug - import.meta.env.DEV:', import.meta.env.DEV);
        console.log('🔍 Auth Debug - window.location.hostname:', window.location.hostname);
        
        if (isDevelopmentMode) {
          console.log('🔧 Development mode active - using mock user data');
          const mockUser = {
            id: 'mock-user-123',
            email: 'patient@example.com',
            created_at: new Date().toISOString()
          };
          const mockProfile = {
            id: 'mock-user-123',
            email: 'patient@example.com',
            full_name: 'John Doe',
            role: 'patient',
            phone_number: '+91 9876543210',
            language_preference: 'english',
            is_active: true
          };
          
          if (isMounted) {
            setUser(mockUser);
            setUserProfile(mockProfile);
            console.log('✅ Mock user set:', mockUser.email);
          }
          return;
        }

        const sessionResult = await authService.getSession();

        if (
          sessionResult?.success &&
          sessionResult?.data?.session?.user &&
          isMounted
        ) {
          const authUser = sessionResult.data.session.user;
          setUser(authUser);

          // Fetch user profile
          const profileResult = await authService.getUserProfile(authUser.id);

          if (profileResult?.success && isMounted) {
            setUserProfile(profileResult.data);
          } else if (isMounted) {
            // If profile doesn't exist, create a mock profile for demo
            console.log('User profile not found, using mock profile for demo');
            const mockProfile = {
              id: authUser.id,
              email: authUser.email,
              full_name: authUser.user_metadata?.full_name || 'Demo User',
              role: 'patient',
              phone_number: authUser.user_metadata?.phone || '+91 9876543210',
              language_preference: 'english',
              is_active: true
            };
            setUserProfile(mockProfile);
          }
        } else if (isMounted) {
          // No session found, user needs to login
          console.log('No active session found');
        }
      } catch (error) {
        if (isMounted) {
          setAuthError("Failed to initialize authentication");
          console.log("Auth initialization error:", error);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    // Listen for auth changes (skip in development mode)
    let subscription = null;
    if (!isDevelopmentMode) {
      const {
        data: { subscription: authSubscription },
      } = authService.onAuthStateChange(async (event, session) => {
        if (!isMounted) return;

        setAuthError(null);

        if (event === "SIGNED_IN" && session?.user) {
          setUser(session.user);

          // Fetch user profile for signed in user
          authService.getUserProfile(session.user.id).then((profileResult) => {
            if (profileResult?.success && isMounted) {
              setUserProfile(profileResult.data);
            } else if (isMounted) {
              setAuthError(profileResult?.error || "Failed to load user profile");
            }
          });
        } else if (event === "SIGNED_OUT") {
          setUser(null);
          setUserProfile(null);
        } else if (event === "TOKEN_REFRESHED" && session?.user) {
          setUser(session.user);
        }
      });
      subscription = authSubscription;
    }

    return () => {
      isMounted = false;
      subscription?.unsubscribe?.();
    };
  }, []);

  // Sign in function
  const signIn = async (email, password) => {
    try {
      setAuthError(null);
      
      // If in development mode, just set mock user
      if (isDevelopmentMode) {
        console.log('🔧 Development mode - bypassing real authentication');
        const mockUser = {
          id: 'mock-user-123',
          email: email,
          created_at: new Date().toISOString()
        };
        const mockProfile = {
          id: 'mock-user-123',
          email: email,
          full_name: 'Demo User',
          role: 'patient',
          phone_number: '+91 9876543210',
          language_preference: 'english',
          is_active: true
        };
        
        setUser(mockUser);
        setUserProfile(mockProfile);
        return { success: true, data: { user: mockUser, profile: mockProfile } };
      }
      
      const result = await authService.signIn(email, password);

      if (!result?.success) {
        setAuthError(result?.error || "Login failed");
        return { success: false, error: result?.error };
      }

      return { success: true, data: result.data };
    } catch (error) {
      const errorMsg = "Something went wrong during login. Please try again.";
      setAuthError(errorMsg);
      console.log("Sign in error:", error);
      return { success: false, error: errorMsg };
    }
  };

  // Sign up function
  const signUp = async (email, password, userData = {}) => {
    try {
      setAuthError(null);
      const result = await authService.signUp(email, password, userData);

      if (!result?.success) {
        setAuthError(result?.error || "Signup failed");
        return { success: false, error: result?.error };
      }

      return { success: true, data: result.data };
    } catch (error) {
      const errorMsg = "Something went wrong during signup. Please try again.";
      setAuthError(errorMsg);
      console.log("Sign up error:", error);
      return { success: false, error: errorMsg };
    }
  };

  // Sign out function
  const signOut = async () => {
    try {
      setAuthError(null);
      const result = await authService.signOut();

      if (!result?.success) {
        setAuthError(result?.error || "Logout failed");
        return { success: false, error: result?.error };
      }

      return { success: true };
    } catch (error) {
      const errorMsg = "Something went wrong during logout. Please try again.";
      setAuthError(errorMsg);
      console.log("Sign out error:", error);
      return { success: false, error: errorMsg };
    }
  };

  // Update profile function
  const updateProfile = async (updates) => {
    try {
      setAuthError(null);

      if (!user?.id) {
        const errorMsg = "User not authenticated";
        setAuthError(errorMsg);
        return { success: false, error: errorMsg };
      }

      const result = await authService.updateUserProfile(user.id, updates);

      if (!result?.success) {
        setAuthError(result?.error || "Profile update failed");
        return { success: false, error: result?.error };
      }

      setUserProfile(result.data);
      return { success: true, data: result.data };
    } catch (error) {
      const errorMsg =
        "Something went wrong updating profile. Please try again.";
      setAuthError(errorMsg);
      console.log("Update profile error:", error);
      return { success: false, error: errorMsg };
    }
  };

  // Reset password function
  const resetPassword = async (email) => {
    try {
      setAuthError(null);
      const result = await authService.resetPassword(email);

      if (!result?.success) {
        setAuthError(result?.error || "Password reset failed");
        return { success: false, error: result?.error };
      }

      return { success: true };
    } catch (error) {
      const errorMsg =
        "Something went wrong sending reset email. Please try again.";
      setAuthError(errorMsg);
      console.log("Reset password error:", error);
      return { success: false, error: errorMsg };
    }
  };

  const value = {
    user,
    userProfile,
    loading,
    authError,
    signIn,
    signUp,
    signOut,
    updateProfile,
    resetPassword,
    clearError: () => setAuthError(null),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
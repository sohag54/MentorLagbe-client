'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authClient } from '@/lib/auth-client';
import { apiRequest } from '@/lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Retrieve verified JWT token from backend using active Better Auth session cookie
  const fetchJwtToken = useCallback(async () => {
    try {
      const data = await apiRequest('/api/jwt', {
        method: 'POST',
        credentials: 'include',
      });
      if (data?.success && data?.token) {
        setToken(data.token);
        return data.token;
      }
      setToken(null);
      return null;
    } catch {
      setToken(null);
      return null;
    }
  }, []);

  // Synchronize session from Better Auth and fetch backend JWT
  const refreshAuth = useCallback(async () => {
    setLoading(true);
    try {
      const sessionResult = await authClient.getSession();
      const sessionUser = sessionResult?.data?.user;

      if (sessionUser) {
        const jwt = await fetchJwtToken();

        // Optionally fetch enriched profile from /api/users/profile if JWT is available
        let profileDetails = {};
        if (jwt) {
          try {
            const profileRes = await apiRequest('/api/users/profile', {
              method: 'GET',
              token: jwt,
            });
            if (profileRes?.success && profileRes?.data) {
              profileDetails = profileRes.data;
            }
          } catch {
            // Fall back to session values if profile fetch fails
          }
        }

        setUser({
          id: sessionUser.id,
          name: profileDetails.name || sessionUser.name,
          email: profileDetails.email || sessionUser.email,
          image: profileDetails.image || sessionUser.image || '',
          role: profileDetails.role || sessionUser.role || 'student',
          plan: profileDetails.plan || sessionUser.plan || 'free',
          phone: profileDetails.phone || sessionUser.phone || '',
          bio: profileDetails.bio || sessionUser.bio || '',
        });
      } else {
        setUser(null);
        setToken(null);
      }
    } catch (err) {
      console.error('Failed to restore auth session:', err);
      setUser(null);
      setToken(null);
    } finally {
      setLoading(false);
    }
  }, [fetchJwtToken]);

  // Initial session restoration on mount
  useEffect(() => {
    let isMounted = true;

    const restoreSession = async () => {
      try {
        const sessionResult = await authClient.getSession();
        if (!isMounted) return;
        const sessionUser = sessionResult?.data?.user;

        if (sessionUser) {
          const jwt = await fetchJwtToken();
          if (!isMounted) return;

          let profileDetails = {};
          if (jwt) {
            try {
              const profileRes = await apiRequest('/api/users/profile', {
                method: 'GET',
                token: jwt,
              });
              if (profileRes?.success && profileRes?.data) {
                profileDetails = profileRes.data;
              }
            } catch {
              // Fall back to session values
            }
          }
          if (!isMounted) return;

          setUser({
            id: sessionUser.id,
            name: profileDetails.name || sessionUser.name,
            email: profileDetails.email || sessionUser.email,
            image: profileDetails.image || sessionUser.image || '',
            role: profileDetails.role || sessionUser.role || 'student',
            plan: profileDetails.plan || sessionUser.plan || 'free',
            phone: profileDetails.phone || sessionUser.phone || '',
            bio: profileDetails.bio || sessionUser.bio || '',
          });
        } else {
          setUser(null);
          setToken(null);
        }
      } catch (err) {
        console.error('Failed to restore auth session:', err);
        if (isMounted) {
          setUser(null);
          setToken(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    restoreSession();

    return () => {
      isMounted = false;
    };
  }, [fetchJwtToken]);

  // User Sign-In
  const login = async ({ email, password }) => {
    setLoading(true);
    try {
      const res = await authClient.signIn.email({
        email,
        password,
      });

      if (res?.error) {
        throw new Error(res.error.message || 'Login failed. Please check your credentials.');
      }

      await refreshAuth();
      return { success: true };
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  // User Sign-Up (enforces strict Student / Tutor role; Admin cannot be created via public signup)
  const signup = async ({ name, email, password, role = 'student', phone = '', bio = '', image = '' }) => {
    const normalizedRole = role.toLowerCase() === 'tutor' ? 'tutor' : 'student';

    setLoading(true);
    try {
      const res = await authClient.signUp.email({
        name,
        email,
        password,
        role: normalizedRole,
        phone,
        bio,
        image,
      });

      if (res?.error) {
        throw new Error(res.error.message || 'Sign up failed.');
      }

      await refreshAuth();
      return { success: true };
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  // User Sign-Out
  const logout = async () => {
    try {
      await authClient.signOut();
    } catch (err) {
      console.error('Sign out error:', err);
    } finally {
      setUser(null);
      setToken(null);
      setLoading(false);
    }
  };

  // Helper to partially update user profile state in memory
  const updateUserData = (updatedFields) => {
    setUser((prev) => (prev ? { ...prev, ...updatedFields } : null));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || null,
        plan: user?.plan || 'free',
        token,
        loading,
        isAuthenticated: !!user,
        refreshAuth,
        login,
        signup,
        logout,
        updateUserData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

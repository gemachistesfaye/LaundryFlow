import React, { createContext, useState, useContext, useEffect } from 'react';
import { getMe, loginWithSupabase } from '../services/api';
import { supabase } from '../services/supabase';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Check if we already have a local backend session
    const token = localStorage.getItem('token');
    if (token) {
      getMe()
        .then(res => setUser(res.data.user))
        .catch(() => {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }

    // 2. Listen to Supabase Auth state changes (triggers after returning from Google redirect)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session && event === 'SIGNED_IN') {
        setLoading(true);
        try {
          // Send Supabase JWT to backend to verify and sync with MySQL database
          const response = await loginWithSupabase(session.access_token);
          
          if (response.data.success) {
            loginUser(response.data.user, response.data.token);
            
            // Sign out of Supabase client locally to keep authentication pure to the backend
            await supabase.auth.signOut();
          }
        } catch (error) {
          console.error("Social login sync failed:", error);
        } finally {
          setLoading(false);
        }
      }
    });

    return () => {
      if (subscription) subscription.unsubscribe();
    };
  }, []);

  const loginUser = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const loginWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/login'
        }
      });
      if (error) throw error;
    } catch (err) {
      alert(err.message || 'Google Auth Failed');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginUser, logout, loginWithGoogle }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);


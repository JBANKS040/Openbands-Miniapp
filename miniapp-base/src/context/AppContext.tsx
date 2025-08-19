"use client";
import React, { createContext, useContext, useState, useCallback, type PropsWithChildren } from 'react';

interface AppState {
  isAuthenticated: boolean;
  anonymousId: string | null;
  companyDomain: string | null;
}

interface AppContextValue extends AppState {
  signIn: () => void;
  signOut: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: PropsWithChildren) {
  const [state, setState] = useState<AppState>({
    isAuthenticated: false,
    anonymousId: null,
    companyDomain: null,
  });

  const signIn = useCallback((domain: string) => {
    // Generate a random 6-character anonymous ID
    const anonymousId = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    // For now, we'll use a placeholder company domain
    // Later this will be replaced with ZK proof verification
    const companyDomain = domain;

    setState({
      isAuthenticated: true,
      anonymousId,
      companyDomain,
    });
  }, []);

  const signOut = useCallback(() => {
    setState({
      isAuthenticated: false,
      anonymousId: null,
      companyDomain: null,
    });
  }, []);

  const value: AppContextValue = {
    ...state,
    signIn,
    signOut,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppContextValue {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

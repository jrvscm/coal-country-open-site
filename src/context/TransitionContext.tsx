'use client';
import { createContext, useState, useContext } from 'react';

type TransitionContextType = {
  showSplash: boolean;
  setShowSplash: (val: boolean) => void;
};

const TransitionContext = createContext<TransitionContextType | undefined>(undefined);

export function TransitionProvider({ children }: { children: React.ReactNode }) {
  const [showSplash, setShowSplash] = useState(false);

  return (
    <TransitionContext.Provider value={{ showSplash, setShowSplash }}>
      {children}
    </TransitionContext.Provider>
  );
}

export function useTransition(): TransitionContextType {
  const context = useContext(TransitionContext);
  if (!context) {
    throw new Error('useTransition must be used within a TransitionProvider');
  }
  return context;
}

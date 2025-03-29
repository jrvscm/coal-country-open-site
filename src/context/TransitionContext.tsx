// src/contexts/TransitionContext.tsx
'use client';
import { createContext, useContext, useState } from 'react';

type TransitionContextType = {
  isTransitioning: boolean;
  startTransition: (href: string) => void;
  endTransition: () => void;
};

const TransitionContext = createContext<TransitionContextType | null>(null);

export const TransitionProvider = ({ children }: { children: React.ReactNode }) => {
  const [isTransitioning, setIsTransitioning] = useState(false);

  const startTransition = () => setIsTransitioning(true);
  const endTransition = () => setIsTransitioning(false);

  return (
    <TransitionContext.Provider value={{ isTransitioning, startTransition, endTransition }}>
      {children}
    </TransitionContext.Provider>
  );
};

export const useTransitionContext = () => {
  const context = useContext(TransitionContext);
  if (!context) throw new Error('useTransitionContext must be used inside TransitionProvider');
  return context;
};

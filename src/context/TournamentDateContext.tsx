'use client';

import { createContext, useContext } from 'react';

const TournamentDateContext = createContext<string | null>(null);

export function TournamentDateProvider({ date, children }: { date: string, children: React.ReactNode }) {
  return (
    <TournamentDateContext.Provider value={date}>
      {children}
    </TournamentDateContext.Provider>
  );
}

// Custom hook to access the date anywhere in client components
export function useTournamentDate() {
  const context = useContext(TournamentDateContext);
  if (!context) {
    throw new Error('useTournamentDate must be used within a TournamentDateProvider');
  }
  return context;
}
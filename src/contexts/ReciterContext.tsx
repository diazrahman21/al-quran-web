'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface ReciterContextType {
  selectedReciter: string;
  setSelectedReciter: (reciter: string) => void;
}

const ReciterContext = createContext<ReciterContextType | undefined>(undefined);

export function ReciterProvider({ children }: { children: ReactNode }) {
  const [selectedReciter, setSelectedReciter] = useState('05'); // Default: Misyari Rasyid Al-Afasi

  return (
    <ReciterContext.Provider value={{ selectedReciter, setSelectedReciter }}>
      {children}
    </ReciterContext.Provider>
  );
}

export function useReciter() {
  const context = useContext(ReciterContext);
  if (context === undefined) {
    throw new Error('useReciter must be used within a ReciterProvider');
  }
  return context;
}

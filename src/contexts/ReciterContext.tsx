'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

interface ReciterContextValue {
  selectedReciter: string;
  setSelectedReciter: (reciter: string) => void;
}

const ReciterContext = createContext<ReciterContextValue | undefined>(undefined);

export function ReciterProvider({ children }: { children: ReactNode }) {
  const [selectedReciter, setSelectedReciter] = useState('05');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('bacaquran-reciter');
      if (saved) setSelectedReciter(saved);
    } catch {
      // Abaikan jika localStorage tidak tersedia.
    }
  }, []);

  const selectReciter = (reciter: string) => {
    setSelectedReciter(reciter);
    try {
      localStorage.setItem('bacaquran-reciter', reciter);
    } catch {
      // Abaikan jika localStorage tidak tersedia.
    }
  };

  return (
    <ReciterContext.Provider value={{ selectedReciter, setSelectedReciter: selectReciter }}>
      {children}
    </ReciterContext.Provider>
  );
}

export function useReciter() {
  const context = useContext(ReciterContext);
  if (context === undefined) throw new Error('useReciter must be used within ReciterProvider');
  return context;
}

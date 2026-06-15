import * as storage from '@/lib/storage';
import { PetType } from '@/lib/types';
import { createContext, ReactNode, useContext } from 'react';

const petContext = createContext<PetType | undefined>(undefined);

export function PetProvider({ children }: { children: ReactNode }) {
  return <petContext.Provider value={storage.petContextInit()}>{children}</petContext.Provider>;
}

export function usePet() {
  const context = useContext(petContext);

  if (!context) {
    throw new Error('usePet must be inside PetProvider');
  }

  return context;
}

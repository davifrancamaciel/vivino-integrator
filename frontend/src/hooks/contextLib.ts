import { useContext, createContext } from 'react';

export const AppContext = createContext(null);

export function useAppContext(): any {
  return useContext(AppContext);
}

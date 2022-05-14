import { createContext } from 'react';
import { User } from '../types';

interface AppContext {
  user?: User | null,
  setUser?: (user: User | null) => void
}

// eslint-disable-next-line object-curly-newline
export const Context = createContext<AppContext>({});

export default Context;

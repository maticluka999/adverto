import React from 'react';
import { User } from '../types';

type AuthContextType = {
  user: User | undefined;
  setUser: (user: User | undefined) => void;
};

const AuthContext = React.createContext<AuthContextType>({
  user: undefined,
  setUser: (user: User | undefined) => {},
});

export default AuthContext;

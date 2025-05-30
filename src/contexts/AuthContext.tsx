
import React, { createContext, useContext, useState } from 'react';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users para demonstração
const mockUsers: User[] = [
  {
    uid: 'admin1',
    name: 'Dr. Maria Silva',
    email: 'admin@ifpr.edu.br',
    role: 'admin',
    coins: 0,
    collection: {}
  },
  {
    uid: 'teacher1',
    name: 'Prof. João Santos',
    email: 'joao.santos@ifpr.edu.br',
    role: 'teacher',
    coins: 0,
    collection: {}
  },
  {
    uid: 'student1',
    name: 'Ana Costa',
    email: 'ana.costa@estudante.ifpr.edu.br',
    role: 'student',
    ra: '2024001',
    class: '3º INFO',
    coins: 150,
    collection: {
      'card1': 2,
      'card2': 1,
      'card3': 3
    }
  }
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    // Simular autenticação
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = mockUsers.find(u => u.email === email);
    if (foundUser) {
      setUser(foundUser);
    } else {
      throw new Error('Credenciais inválidas');
    }
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}

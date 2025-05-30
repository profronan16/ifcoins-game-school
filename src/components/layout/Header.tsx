
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { CoinBalance } from '@/components/ui/coin-balance';
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';

export function Header() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-ifpr-green text-white rounded-lg p-2">
              <h1 className="font-bold text-xl">IFCoins</h1>
            </div>
            <div className="text-sm text-gray-600">
              {user.role === 'admin' && 'Administrador'}
              {user.role === 'teacher' && 'Professor'}
              {user.role === 'student' && `Estudante - ${user.class || ''}`}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {user.role === 'student' && (
            <CoinBalance balance={user.coins} />
          )}
          
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium">{user.name}</span>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={logout}
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Sair
          </Button>
        </div>
      </div>
    </header>
  );
}

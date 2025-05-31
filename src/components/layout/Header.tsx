
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { CoinBalance } from '@/components/ui/coin-balance';
import { LogOut } from 'lucide-react';

export function Header() {
  const { profile, signOut } = useAuth();

  if (!profile) return null;

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-ifpr-green rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">IF</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900">IFCoins</h1>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {profile.role === 'student' && (
            <CoinBalance balance={profile.coins} />
          )}
          
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="font-medium text-gray-900">{profile.name}</p>
              <p className="text-sm text-gray-600 capitalize">{profile.role}</p>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={signOut}
              className="text-gray-600 hover:text-gray-900"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}

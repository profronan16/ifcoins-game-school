
import React from 'react';
import { Coins } from 'lucide-react';

interface CoinBalanceProps {
  balance: number;
  className?: string;
  showAnimation?: boolean;
}

export function CoinBalance({ balance, className = '', showAnimation = false }: CoinBalanceProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Coins 
        className={`h-6 w-6 text-ifpr-green ${showAnimation ? 'animate-coin-flip' : ''}`} 
      />
      <span className="font-bold text-lg text-ifpr-green">
        {balance.toLocaleString('pt-BR')} IFCoins
      </span>
    </div>
  );
}

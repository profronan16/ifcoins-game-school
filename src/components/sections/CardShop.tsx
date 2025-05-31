
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CollectibleCard } from '@/components/ui/collectible-card';
import { CoinBalance } from '@/components/ui/coin-balance';
import { mockCards, mockPacks } from '@/data/mockData';
import { ShoppingCart, Package, Sparkles } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export function CardShop() {
  const { profile } = useAuth();
  const [selectedTab, setSelectedTab] = useState<'cards' | 'packs'>('packs');

  if (!profile || profile.role !== 'student') return null;

  const handlePurchase = (item: any, type: 'card' | 'pack') => {
    if (type === 'pack') {
      toast({
        title: "Pacote adquirido!",
        description: `Você comprou um ${item.name} por ${item.price} IFCoins`,
      });
    } else {
      toast({
        title: "Carta adquirida!",
        description: `Você comprou ${item.name} por ${item.price} IFCoins`,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Loja de Cartas</h1>
          <p className="text-gray-600 mt-1">Compre cartas e pacotes especiais</p>
        </div>
        <CoinBalance balance={profile.coins} />
      </div>

      <div className="flex gap-2 bg-gray-100 p-1 rounded-lg w-fit">
        <Button
          variant={selectedTab === 'packs' ? 'default' : 'ghost'}
          onClick={() => setSelectedTab('packs')}
          className={selectedTab === 'packs' ? 'bg-ifpr-green hover:bg-ifpr-green-dark' : ''}
        >
          <Package className="h-4 w-4 mr-2" />
          Pacotes
        </Button>
        <Button
          variant={selectedTab === 'cards' ? 'default' : 'ghost'}
          onClick={() => setSelectedTab('cards')}
          className={selectedTab === 'cards' ? 'bg-ifpr-green hover:bg-ifpr-green-dark' : ''}
        >
          <Sparkles className="h-4 w-4 mr-2" />
          Cartas Individuais
        </Button>
      </div>

      {selectedTab === 'packs' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockPacks.map((pack) => (
            <Card key={pack.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg p-6 text-center">
                  <Package className="h-12 w-12 mx-auto text-purple-600 mb-2" />
                  <CardTitle>{pack.name}</CardTitle>
                  <CardDescription className="text-purple-600 font-bold text-lg">
                    {pack.price} IFCoins
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm">
                    <h4 className="font-medium mb-2">Probabilidades:</h4>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Comum:</span>
                        <span className="font-medium">{pack.cardProbabilities.common}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-600">Raro:</span>
                        <span className="font-medium">{pack.cardProbabilities.rare}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-yellow-600">Lendário:</span>
                        <span className="font-medium">{pack.cardProbabilities.legendary}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-purple-600">Mítico:</span>
                        <span className="font-medium">{pack.cardProbabilities.mythic}%</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">
                    Limite: {pack.limitPerStudent} por mês
                  </p>
                  <Button
                    onClick={() => handlePurchase(pack, 'pack')}
                    className="w-full bg-ifpr-green hover:bg-ifpr-green-dark"
                    disabled={profile.coins < pack.price}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Comprar Pacote
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {selectedTab === 'cards' && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {mockCards.filter(card => card.available).map((card) => (
            <div key={card.id} className="space-y-3">
              <CollectibleCard card={card} className="h-64" />
              <div className="text-center space-y-2">
                <p className="font-bold text-ifpr-green">{card.price} IFCoins</p>
                <Button
                  onClick={() => handlePurchase(card, 'card')}
                  size="sm"
                  className="w-full bg-ifpr-green hover:bg-ifpr-green-dark"
                  disabled={profile.coins < card.price}
                >
                  Comprar
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

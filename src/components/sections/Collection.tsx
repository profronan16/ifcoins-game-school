
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CollectibleCard } from '@/components/ui/collectible-card';
import { mockCards } from '@/data/mockData';
import { BookOpen, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Collection() {
  const { user } = useAuth();
  const [filterRarity, setFilterRarity] = useState<string>('all');

  if (!user || user.role !== 'student') return null;

  const userCards = Object.entries(user.collection)
    .map(([cardId, quantity]) => ({
      card: mockCards.find(c => c.id === cardId)!,
      quantity
    }))
    .filter(item => item.card);

  const filteredCards = filterRarity === 'all' 
    ? userCards 
    : userCards.filter(item => item.card.rarity === filterRarity);

  const totalCards = userCards.reduce((sum, item) => sum + item.quantity, 0);
  const uniqueCards = userCards.length;
  const totalPossible = mockCards.length;

  const rarityStats = {
    common: userCards.filter(item => item.card.rarity === 'common').length,
    rare: userCards.filter(item => item.card.rarity === 'rare').length,
    legendary: userCards.filter(item => item.card.rarity === 'legendary').length,
    mythic: userCards.filter(item => item.card.rarity === 'mythic').length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Minha Coleção</h1>
        <p className="text-gray-600 mt-1">Veja todas as suas cartas colecionáveis</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total de Cartas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-ifpr-green">{totalCards}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Cartas Únicas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-ifpr-blue">{uniqueCards}/{totalPossible}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Progresso</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-purple-600">
              {Math.round((uniqueCards / totalPossible) * 100)}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Carta Mais Rara</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-bold text-yellow-600">
              {rarityStats.mythic > 0 ? 'Mítica' : 
               rarityStats.legendary > 0 ? 'Lendária' : 
               rarityStats.rare > 0 ? 'Rara' : 'Comum'}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Estatísticas por Raridade
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="w-4 h-4 bg-rarity-common rounded mx-auto mb-2"></div>
              <p className="font-bold text-rarity-common">{rarityStats.common}</p>
              <p className="text-sm text-gray-600">Comuns</p>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="w-4 h-4 bg-rarity-rare rounded mx-auto mb-2"></div>
              <p className="font-bold text-rarity-rare">{rarityStats.rare}</p>
              <p className="text-sm text-gray-600">Raras</p>
            </div>
            <div className="text-center p-3 bg-yellow-50 rounded-lg">
              <div className="w-4 h-4 bg-rarity-legendary rounded mx-auto mb-2"></div>
              <p className="font-bold text-rarity-legendary">{rarityStats.legendary}</p>
              <p className="text-sm text-gray-600">Lendárias</p>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="w-4 h-4 bg-rarity-mythic rounded mx-auto mb-2"></div>
              <p className="font-bold text-rarity-mythic">{rarityStats.mythic}</p>
              <p className="text-sm text-gray-600">Míticas</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center gap-2">
        <Filter className="h-5 w-5 text-gray-500" />
        <span className="text-sm font-medium">Filtrar por raridade:</span>
        <div className="flex gap-2">
          {['all', 'common', 'rare', 'legendary', 'mythic'].map((rarity) => (
            <Button
              key={rarity}
              variant={filterRarity === rarity ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterRarity(rarity)}
              className={filterRarity === rarity ? 'bg-ifpr-green hover:bg-ifpr-green-dark' : ''}
            >
              {rarity === 'all' ? 'Todas' : 
               rarity === 'common' ? 'Comuns' :
               rarity === 'rare' ? 'Raras' :
               rarity === 'legendary' ? 'Lendárias' : 'Míticas'}
            </Button>
          ))}
        </div>
      </div>

      {filteredCards.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {filteredCards.map((item, index) => (
            <CollectibleCard
              key={index}
              card={item.card}
              quantity={item.quantity}
              className="h-64"
            />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {filterRarity === 'all' ? 'Nenhuma carta encontrada' : `Nenhuma carta ${filterRarity} encontrada`}
            </h3>
            <p className="text-gray-600">
              {filterRarity === 'all' 
                ? 'Visite a loja para começar sua coleção!'
                : 'Tente comprar mais pacotes para encontrar cartas desta raridade.'
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

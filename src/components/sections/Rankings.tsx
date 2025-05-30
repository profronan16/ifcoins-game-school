
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, Medal, Award, Coins, BookOpen } from 'lucide-react';
import { CoinBalance } from '@/components/ui/coin-balance';

const mockRankings = {
  coins: [
    { id: '1', name: 'Ana Costa', coins: 450, class: '3º INFO', avatar: '👩‍🎓' },
    { id: '2', name: 'Pedro Silva', coins: 380, class: '2º INFO', avatar: '👨‍🎓' },
    { id: '3', name: 'Maria Santos', coins: 320, class: '3º INFO', avatar: '👩‍🎓' },
    { id: '4', name: 'João Oliveira', coins: 280, class: '1º INFO', avatar: '👨‍🎓' },
    { id: '5', name: 'Carla Lima', coins: 250, class: '2º INFO', avatar: '👩‍🎓' },
  ],
  collection: [
    { id: '1', name: 'Ana Costa', cardsCount: 45, uniqueCards: 38, class: '3º INFO', avatar: '👩‍🎓' },
    { id: '2', name: 'Pedro Silva', cardsCount: 42, uniqueCards: 35, class: '2º INFO', avatar: '👨‍🎓' },
    { id: '3', name: 'Maria Santos', cardsCount: 38, uniqueCards: 32, class: '3º INFO', avatar: '👩‍🎓' },
    { id: '4', name: 'João Oliveira', cardsCount: 35, uniqueCards: 30, class: '1º INFO', avatar: '👨‍🎓' },
    { id: '5', name: 'Carla Lima', cardsCount: 32, uniqueCards: 28, class: '2º INFO', avatar: '👩‍🎓' },
  ],
};

export function Rankings() {
  const [activeTab, setActiveTab] = useState<'coins' | 'collection'>('coins');

  const getRankIcon = (position: number) => {
    if (position === 1) return <Trophy className="h-6 w-6 text-yellow-500" />;
    if (position === 2) return <Medal className="h-6 w-6 text-gray-400" />;
    if (position === 3) return <Award className="h-6 w-6 text-amber-600" />;
    return <span className="w-6 h-6 flex items-center justify-center font-bold text-gray-500">#{position}</span>;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Rankings</h1>
        <p className="text-gray-600 mt-1">
          Confira os estudantes que mais se destacaram
        </p>
      </div>

      <div className="flex gap-2 bg-gray-100 p-1 rounded-lg w-fit">
        <Button
          variant={activeTab === 'coins' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('coins')}
          className="flex items-center gap-2"
        >
          <Coins className="h-4 w-4" />
          Mais IFCoins
        </Button>
        <Button
          variant={activeTab === 'collection' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('collection')}
          className="flex items-center gap-2"
        >
          <BookOpen className="h-4 w-4" />
          Maior Coleção
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {activeTab === 'coins' ? <Coins className="h-5 w-5 text-ifpr-green" /> : <BookOpen className="h-5 w-5 text-ifpr-blue" />}
              {activeTab === 'coins' ? 'Top 5 - Mais IFCoins' : 'Top 5 - Maior Coleção'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(activeTab === 'coins' ? mockRankings.coins : mockRankings.collection).map((student, index) => (
                <div key={student.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    {getRankIcon(index + 1)}
                    <div className="text-2xl">{student.avatar}</div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{student.name}</h3>
                    <p className="text-sm text-gray-600">{student.class}</p>
                  </div>
                  <div className="text-right">
                    {activeTab === 'coins' ? (
                      <CoinBalance balance={student.coins} className="text-sm" />
                    ) : (
                      <div>
                        <p className="font-bold text-ifpr-blue">{student.cardsCount} cartas</p>
                        <p className="text-xs text-gray-600">{student.uniqueCards} únicas</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Estatísticas Gerais</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-ifpr-green/10 rounded-lg">
                <span className="font-medium">Total de IFCoins em circulação</span>
                <span className="font-bold text-ifpr-green">45.230</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-ifpr-blue/10 rounded-lg">
                <span className="font-medium">Cartas coletadas este mês</span>
                <span className="font-bold text-ifpr-blue">892</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-purple-100 rounded-lg">
                <span className="font-medium">Trocas realizadas</span>
                <span className="font-bold text-purple-600">156</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-orange-100 rounded-lg">
                <span className="font-medium">Estudantes ativos</span>
                <span className="font-bold text-orange-600">1.247</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

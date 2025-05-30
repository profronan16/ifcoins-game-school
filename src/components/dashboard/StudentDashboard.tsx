
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { CoinBalance } from '@/components/ui/coin-balance';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CollectibleCard } from '@/components/ui/collectible-card';
import { mockCards } from '@/data/mockData';
import { Gift, BookOpen, Users, Trophy, Calendar } from 'lucide-react';

interface StudentDashboardProps {
  onSectionChange: (section: string) => void;
}

export function StudentDashboard({ onSectionChange }: StudentDashboardProps) {
  const { user } = useAuth();

  if (!user || user.role !== 'student') return null;

  const userCards = Object.entries(user.collection)
    .map(([cardId, quantity]) => ({
      card: mockCards.find(c => c.id === cardId)!,
      quantity
    }))
    .filter(item => item.card)
    .slice(0, 3);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Bem-vindo, {user.name}!
          </h1>
          <p className="text-gray-600 mt-1">
            Turma: {user.class} • RA: {user.ra}
          </p>
        </div>
        <CoinBalance balance={user.coins} showAnimation />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => onSectionChange('shop')}>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Gift className="h-5 w-5 text-ifpr-green" />
              <CardTitle className="text-lg">Loja</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">Compre cartas e pacotes especiais</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => onSectionChange('collection')}>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-ifpr-blue" />
              <CardTitle className="text-lg">Coleção</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">{Object.keys(user.collection).length} cartas coletadas</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => onSectionChange('trades')}>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-600" />
              <CardTitle className="text-lg">Trocas</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">Troque cartas com colegas</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => onSectionChange('rankings')}>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-600" />
              <CardTitle className="text-lg">Rankings</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">Veja sua posição no ranking</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Suas Cartas Recentes
          </CardTitle>
          <CardDescription>
            Suas últimas cartas adquiridas
          </CardDescription>
        </CardHeader>
        <CardContent>
          {userCards.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {userCards.map((item, index) => (
                <CollectibleCard
                  key={index}
                  card={item.card}
                  quantity={item.quantity}
                  className="h-48"
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Você ainda não possui cartas</p>
              <Button 
                className="mt-4 bg-ifpr-green hover:bg-ifpr-green-dark"
                onClick={() => onSectionChange('shop')}
              >
                Ir para a Loja
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Eventos Ativos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gradient-to-r from-ifpr-green to-ifpr-blue text-white p-4 rounded-lg">
            <h3 className="font-bold mb-2">🚀 Semana da Tecnologia</h3>
            <p className="text-sm opacity-90 mb-2">
              Participe das atividades e ganhe moedas em dobro!
            </p>
            <p className="text-xs opacity-75">1 a 7 de Junho • Multiplicador: 2x</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

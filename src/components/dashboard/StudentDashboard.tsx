
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CoinBalance } from '@/components/ui/coin-balance';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CollectibleCard } from '@/components/ui/collectible-card';
import { Gift, BookOpen, Users, Trophy, Calendar, Loader2 } from 'lucide-react';

interface StudentDashboardProps {
  onSectionChange: (section: string) => void;
}

export function StudentDashboard({ onSectionChange }: StudentDashboardProps) {
  const { profile } = useAuth();

  const { data: userCards, isLoading } = useQuery({
    queryKey: ['user-cards', profile?.id],
    queryFn: async () => {
      if (!profile) return [];
      
      const { data, error } = await supabase
        .from('user_cards')
        .select(`
          *,
          card:cards(*)
        `)
        .eq('user_id', profile.id)
        .order('acquired_at', { ascending: false })
        .limit(6);
      
      if (error) throw error;
      return data;
    },
    enabled: !!profile && profile.role === 'student',
  });

  if (!profile || profile.role !== 'student') return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Bem-vindo, {profile.name}!
          </h1>
          <p className="text-gray-600 mt-1">
            {profile.class && `Turma: ${profile.class}`} {profile.ra && `• RA: ${profile.ra}`}
          </p>
        </div>
        <CoinBalance balance={profile.coins} showAnimation />
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
            <p className="text-sm text-gray-600">{userCards?.length || 0} cartas coletadas</p>
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
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : userCards && userCards.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {userCards.map((userCard) => (
                <CollectibleCard
                  key={userCard.id}
                  card={{
                    id: userCard.card.id,
                    name: userCard.card.name,
                    rarity: userCard.card.rarity,
                    imageUrl: userCard.card.image_url || '',
                    available: userCard.card.available,
                    price: userCard.card.price,
                    description: userCard.card.description
                  }}
                  quantity={userCard.quantity}
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

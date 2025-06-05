
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CollectibleCard } from '@/components/ui/collectible-card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Loader2 } from 'lucide-react';

export function Collection() {
  const { profile } = useAuth();

  const { data: userCards, isLoading } = useQuery({
    queryKey: ['user-collection', profile?.id],
    queryFn: async () => {
      if (!profile) return [];
      
      const { data, error } = await supabase
        .from('user_cards')
        .select(`
          *,
          card:cards(*)
        `)
        .eq('user_id', profile.id)
        .order('acquired_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!profile,
  });

  const { data: allCards } = useQuery({
    queryKey: ['all-cards'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cards')
        .select('*')
        .order('rarity', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  if (!profile) return null;

  const collectionStats = {
    total: allCards?.length || 0,
    owned: userCards?.length || 0,
    completion: allCards?.length ? Math.round((userCards?.length || 0) / allCards.length * 100) : 0,
  };

  const rarityStats = userCards?.reduce((acc, userCard) => {
    const rarity = userCard.card.rarity;
    acc[rarity] = (acc[rarity] || 0) + userCard.quantity;
    return acc;
  }, {} as Record<string, number>) || {};

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Minha Coleção</h1>
        <p className="text-gray-600 mt-1">
          Suas cartas colecionáveis do IFPR
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total de Cartas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userCards?.reduce((acc, card) => acc + card.quantity, 0) || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Cartas Únicas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{collectionStats.owned}</div>
            <p className="text-xs text-gray-500">de {collectionStats.total}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completude</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{collectionStats.completion}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Carta Mais Rara</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm font-bold">
              {userCards?.find(card => card.card.rarity === 'mythic')?.card.name ||
               userCards?.find(card => card.card.rarity === 'legendary')?.card.name ||
               userCards?.find(card => card.card.rarity === 'rare')?.card.name ||
               'Nenhuma'}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(rarityStats).map(([rarity, count]) => (
          <Card key={rarity}>
            <CardContent className="pt-4">
              <div className="text-center">
                <Badge variant={
                  rarity === 'mythic' ? 'destructive' :
                  rarity === 'legendary' ? 'default' :
                  rarity === 'rare' ? 'secondary' : 'outline'
                }>
                  {rarity}
                </Badge>
                <div className="text-2xl font-bold mt-2">{count}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Suas Cartas
          </CardTitle>
          <CardDescription>
            Todas as cartas da sua coleção
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : userCards && userCards.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {userCards.map((userCard) => (
                <div key={userCard.id} className="relative">
                  <CollectibleCard
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
                  {userCard.quantity > 1 && (
                    <Badge className="absolute -top-2 -right-2 bg-ifpr-green">
                      x{userCard.quantity}
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Você ainda não possui cartas</p>
              <p className="text-sm text-gray-500 mt-1">Visite a loja para começar sua coleção!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

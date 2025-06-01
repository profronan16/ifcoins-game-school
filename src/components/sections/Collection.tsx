import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CollectibleCard } from '@/components/ui/collectible-card';
import { CoinBalance } from '@/components/ui/coin-balance';
import { Search, Filter, Award, TrendingUp } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { UserCard } from '@/types/supabase';

export function Collection() {
  const { profile } = useAuth();
  const [userCards, setUserCards] = useState<UserCard[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRarity, setSelectedRarity] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile) {
      fetchUserCards();
    }
  }, [profile]);

  const fetchUserCards = async () => {
    if (!profile) return;
    
    try {
      const { data, error } = await supabase
        .from('user_cards')
        .select(`
          *,
          card:cards(*)
        `)
        .eq('user_id', profile.id);

      if (error) throw error;
      setUserCards(data || []);
    } catch (error) {
      console.error('Error fetching user cards:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar sua coleção",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (!profile || profile.role !== 'student') {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Acesso Negado</h2>
        <p className="text-gray-600">Apenas estudantes podem acessar a coleção.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <p>Carregando coleção...</p>
      </div>
    );
  }

  const totalCards = userCards.reduce((sum, userCard) => sum + userCard.quantity, 0);
  const uniqueCards = userCards.length;
  const rarityCount = userCards.reduce((acc, userCard) => {
    if (userCard.card) {
      acc[userCard.card.rarity] = (acc[userCard.card.rarity] || 0) + userCard.quantity;
    }
    return acc;
  }, {} as Record<string, number>);

  const filteredCards = userCards.filter(userCard => {
    if (!userCard.card) return false;
    
    const matchesSearch = userCard.card.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRarity = selectedRarity === 'all' || userCard.card.rarity === selectedRarity;
    return matchesSearch && matchesRarity;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Minha Coleção</h1>
          <p className="text-gray-600 mt-1">Veja todas as suas cartas coletadas</p>
        </div>
        <CoinBalance balance={profile.coins} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-lg">Total de Cartas</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-blue-600">{totalCards}</p>
            <p className="text-sm text-gray-600">Em sua coleção</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <CardTitle className="text-lg">Cartas Únicas</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">{uniqueCards}</p>
            <p className="text-sm text-gray-600">Diferentes tipos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-purple-600" />
              <CardTitle className="text-lg">Raras</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-purple-600">{rarityCount.rare || 0}</p>
            <p className="text-sm text-gray-600">Cartas raras</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-yellow-600" />
              <CardTitle className="text-lg">Lendárias</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-yellow-600">{rarityCount.legendary || 0}</p>
            <p className="text-sm text-gray-600">Cartas lendárias</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Filtrar Coleção
            </CardTitle>
            <div className="flex gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-none">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar cartas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full sm:w-64"
                />
              </div>
              <select
                value={selectedRarity}
                onChange={(e) => setSelectedRarity(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md bg-white text-sm"
              >
                <option value="all">Todas as raridades</option>
                <option value="common">Comum</option>
                <option value="rare">Rara</option>
                <option value="legendary">Lendária</option>
                <option value="mythic">Mítica</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredCards.length === 0 ? (
            <div className="text-center py-12">
              <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma carta encontrada</h3>
              <p className="text-gray-600">
                {userCards.length === 0 
                  ? "Você ainda não possui cartas. Visite a loja para começar sua coleção!"
                  : "Tente ajustar os filtros para encontrar suas cartas."
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredCards.map((userCard) => (
                userCard.card && (
                  <div key={userCard.id} className="relative">
                    <CollectibleCard
                      card={{
                        name: userCard.card.name,
                        rarity: userCard.card.rarity,
                        imageUrl: userCard.card.image_url || '/placeholder.svg'
                      }}
                    />
                    <div className="absolute top-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded-full">
                      x{userCard.quantity}
                    </div>
                  </div>
                )
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

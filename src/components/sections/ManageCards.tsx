
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CollectibleCard } from '@/components/ui/collectible-card';
import { Plus, Edit, Trash2, Upload, Search } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Card as CardType, CardRarity } from '@/types';

const mockCards: CardType[] = [
  {
    id: 'card1',
    name: 'Energia Solar',
    rarity: 'common',
    imageUrl: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=200',
    available: true,
    description: 'Fonte de energia limpa e renovável'
  },
  {
    id: 'card2',
    name: 'Laboratório Avançado',
    rarity: 'rare',
    imageUrl: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=200',
    available: true,
    description: 'Equipamentos de última geração para pesquisa'
  },
  {
    id: 'card3',
    name: 'Árvore Centenária',
    rarity: 'legendary',
    imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=200',
    available: true,
    description: 'Símbolo da preservação ambiental'
  }
];

export function ManageCards() {
  const { user } = useAuth();
  const [cards, setCards] = useState(mockCards);
  const [isCreating, setIsCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newCard, setNewCard] = useState({
    name: '',
    rarity: 'common' as CardRarity,
    imageUrl: '',
    description: '',
    copiesAvailable: '',
    eventId: ''
  });

  if (user?.role !== 'admin') {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Acesso Negado</h2>
        <p className="text-gray-600">Apenas administradores podem gerenciar cartas.</p>
      </div>
    );
  }

  const handleCreateCard = () => {
    if (!newCard.name || !newCard.imageUrl || !newCard.description) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    const card: CardType = {
      id: Date.now().toString(),
      name: newCard.name,
      rarity: newCard.rarity,
      imageUrl: newCard.imageUrl,
      description: newCard.description,
      available: true,
      copiesAvailable: newCard.copiesAvailable ? parseInt(newCard.copiesAvailable) : undefined,
      eventId: newCard.eventId || undefined
    };

    setCards([...cards, card]);
    setNewCard({
      name: '',
      rarity: 'common',
      imageUrl: '',
      description: '',
      copiesAvailable: '',
      eventId: ''
    });
    setIsCreating(false);
    
    toast({
      title: "Sucesso",
      description: "Carta criada com sucesso!",
    });
  };

  const handleDeleteCard = (cardId: string) => {
    setCards(cards.filter(c => c.id !== cardId));
    toast({
      title: "Sucesso",
      description: "Carta removida com sucesso!",
    });
  };

  const filteredCards = cards.filter(card =>
    card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    card.rarity.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRarityColor = (rarity: CardRarity) => {
    switch (rarity) {
      case 'common': return 'bg-gray-100 text-gray-800';
      case 'rare': return 'bg-blue-100 text-blue-800';
      case 'legendary': return 'bg-yellow-100 text-yellow-800';
      case 'mythic': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRarityText = (rarity: CardRarity) => {
    switch (rarity) {
      case 'common': return 'Comum';
      case 'rare': return 'Rara';
      case 'legendary': return 'Lendária';
      case 'mythic': return 'Mítica';
      default: return rarity;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gerenciar Cartas</h1>
          <p className="text-gray-600 mt-1">
            Crie e gerencie cartas colecionáveis
          </p>
        </div>
        <Button onClick={() => setIsCreating(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Criar Carta
        </Button>
      </div>

      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>Criar Nova Carta</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="cardName">Nome da Carta</Label>
                <Input
                  id="cardName"
                  value={newCard.name}
                  onChange={(e) => setNewCard({...newCard, name: e.target.value})}
                  placeholder="Ex: Energia Solar"
                />
              </div>
              <div>
                <Label htmlFor="rarity">Raridade</Label>
                <select
                  id="rarity"
                  value={newCard.rarity}
                  onChange={(e) => setNewCard({...newCard, rarity: e.target.value as CardRarity})}
                  className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md"
                >
                  <option value="common">Comum</option>
                  <option value="rare">Rara</option>
                  <option value="legendary">Lendária</option>
                  <option value="mythic">Mítica</option>
                </select>
              </div>
            </div>
            <div>
              <Label htmlFor="imageUrl">URL da Imagem</Label>
              <div className="flex gap-2">
                <Input
                  id="imageUrl"
                  value={newCard.imageUrl}
                  onChange={(e) => setNewCard({...newCard, imageUrl: e.target.value})}
                  placeholder="https://exemplo.com/imagem.jpg"
                />
                <Button variant="outline" className="flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  Upload
                </Button>
              </div>
            </div>
            <div>
              <Label htmlFor="description">Descrição</Label>
              <Input
                id="description"
                value={newCard.description}
                onChange={(e) => setNewCard({...newCard, description: e.target.value})}
                placeholder="Descrição da carta"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="copies">Cópias Disponíveis (opcional)</Label>
                <Input
                  id="copies"
                  type="number"
                  value={newCard.copiesAvailable}
                  onChange={(e) => setNewCard({...newCard, copiesAvailable: e.target.value})}
                  placeholder="Deixe vazio para ilimitado"
                />
              </div>
              <div>
                <Label htmlFor="eventId">ID do Evento (opcional)</Label>
                <Input
                  id="eventId"
                  value={newCard.eventId}
                  onChange={(e) => setNewCard({...newCard, eventId: e.target.value})}
                  placeholder="Vincular a um evento específico"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleCreateCard}>Criar Carta</Button>
              <Button variant="outline" onClick={() => setIsCreating(false)}>Cancelar</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Cartas Cadastradas</CardTitle>
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Buscar cartas..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-64"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Raridade</TableHead>
                    <TableHead>Disponível</TableHead>
                    <TableHead>Cópias</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCards.map((card) => (
                    <TableRow key={card.id}>
                      <TableCell className="font-medium">{card.name}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRarityColor(card.rarity)}`}>
                          {getRarityText(card.rarity)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          card.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {card.available ? 'Sim' : 'Não'}
                        </span>
                      </TableCell>
                      <TableCell>
                        {card.copiesAvailable ? card.copiesAvailable : 'Ilimitado'}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDeleteCard(card.id)}>
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Preview da Carta</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              {cards.length > 0 && (
                <CollectibleCard 
                  card={cards[0]} 
                  className="w-48"
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

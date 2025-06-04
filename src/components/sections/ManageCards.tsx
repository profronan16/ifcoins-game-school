
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BookOpen, Plus, Edit, Trash2, Upload, Search } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const mockCards = [
  {
    id: 'card1',
    name: 'Laboratório de Química',
    description: 'Local onde os experimentos científicos acontecem',
    rarity: 'common',
    price: 50,
    available: true,
    copies: 100
  },
  {
    id: 'card2',
    name: 'Professor Especialista',
    description: 'Docente com anos de experiência e conhecimento',
    rarity: 'rare',
    price: 150,
    available: true,
    copies: 25
  },
  {
    id: 'card3',
    name: 'Diploma de Excelência',
    description: 'Reconhecimento pelos melhores estudantes',
    rarity: 'legendary',
    price: 500,
    available: true,
    copies: 5
  }
];

export function ManageCards() {
  const { profile } = useAuth();
  const [cards, setCards] = useState(mockCards);
  const [isCreating, setIsCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newCard, setNewCard] = useState({
    name: '',
    description: '',
    rarity: 'common',
    price: 50,
    copies: 10
  });

  console.log('ManageCards - profile:', profile);

  if (!profile) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Carregando...</h2>
        <p className="text-gray-600">Verificando permissões...</p>
      </div>
    );
  }

  if (profile.role !== 'admin') {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Acesso Negado</h2>
        <p className="text-gray-600">Apenas administradores podem gerenciar cartas.</p>
        <p className="text-sm text-gray-500 mt-2">Seu perfil atual: {profile.role}</p>
        <p className="text-xs text-gray-400 mt-1">Email: {profile.email}</p>
      </div>
    );
  }

  const handleCreateCard = () => {
    if (!newCard.name || !newCard.description) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    const card = {
      id: Date.now().toString(),
      ...newCard,
      available: true
    };

    setCards([...cards, card]);
    setNewCard({
      name: '',
      description: '',
      rarity: 'common',
      price: 50,
      copies: 10
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
    card.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    card.rarity.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gerenciar Cartas</h1>
          <p className="text-gray-600 mt-1">
            Crie e gerencie cartas colecionáveis do sistema
          </p>
          <p className="text-sm text-green-600 mt-2">
            ✓ Acesso autorizado como administrador
          </p>
        </div>
        <Button onClick={() => setIsCreating(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Criar Nova Carta
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
                  placeholder="Ex: Laboratório de Física"
                />
              </div>
              <div>
                <Label htmlFor="rarity">Raridade</Label>
                <Select value={newCard.rarity} onValueChange={(value) => setNewCard({...newCard, rarity: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a raridade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="common">Common</SelectItem>
                    <SelectItem value="rare">Rare</SelectItem>
                    <SelectItem value="legendary">Legendary</SelectItem>
                    <SelectItem value="mythic">Mythic</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={newCard.description}
                onChange={(e) => setNewCard({...newCard, description: e.target.value})}
                placeholder="Descreva a carta..."
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Preço (IFCoins)</Label>
                <Input
                  id="price"
                  type="number"
                  min="1"
                  value={newCard.price}
                  onChange={(e) => setNewCard({...newCard, price: parseInt(e.target.value)})}
                />
              </div>
              <div>
                <Label htmlFor="copies">Cópias Disponíveis</Label>
                <Input
                  id="copies"
                  type="number"
                  min="1"
                  value={newCard.copies}
                  onChange={(e) => setNewCard({...newCard, copies: parseInt(e.target.value)})}
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
                <TableHead>Descrição</TableHead>
                <TableHead>Raridade</TableHead>
                <TableHead>Preço</TableHead>
                <TableHead>Cópias</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCards.map((card) => (
                <TableRow key={card.id}>
                  <TableCell className="font-medium">{card.name}</TableCell>
                  <TableCell className="max-w-xs truncate">{card.description}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      card.rarity === 'common' ? 'bg-gray-100 text-gray-800' :
                      card.rarity === 'rare' ? 'bg-blue-100 text-blue-800' :
                      card.rarity === 'legendary' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {card.rarity}
                    </span>
                  </TableCell>
                  <TableCell>{card.price}</TableCell>
                  <TableCell>{card.copies}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      card.available 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {card.available ? 'Disponível' : 'Indisponível'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Upload className="h-4 w-4" />
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
  );
}

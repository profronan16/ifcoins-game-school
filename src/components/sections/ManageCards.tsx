import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BookOpen, Plus, Edit, Trash2, Search } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface CardFormData {
  name: string;
  description: string;
  rarity: string;
  price: number;
  copies_available: number;
  image_url?: string;
}

export function ManageCards() {
  const { profile } = useAuth();
  const [isCreating, setIsCreating] = useState(false);
  const [editingCard, setEditingCard] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [cardForm, setCardForm] = useState<CardFormData>({
    name: '',
    description: '',
    rarity: 'common',
    price: 50,
    copies_available: 10,
    image_url: ''
  });

  const { data: cards, isLoading, refetch } = useQuery({
    queryKey: ['admin-cards'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cards')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: profile?.role === 'admin',
  });

  if (!profile || profile.role !== 'admin') {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Acesso Negado</h2>
        <p className="text-gray-600">Apenas administradores podem gerenciar cartas.</p>
      </div>
    );
  }

  const resetForm = () => {
    setCardForm({
      name: '',
      description: '',
      rarity: 'common',
      price: 50,
      copies_available: 10,
      image_url: ''
    });
    setIsCreating(false);
    setEditingCard(null);
  };

  const handleCreateCard = async () => {
    if (!cardForm.name || !cardForm.description) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('cards')
        .insert({
          name: cardForm.name,
          description: cardForm.description,
          rarity: cardForm.rarity as 'common' | 'rare' | 'legendary' | 'mythic',
          price: cardForm.price,
          available: true,
          copies_available: cardForm.copies_available,
          image_url: cardForm.image_url || null
        });

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Carta criada com sucesso!",
      });

      resetForm();
      refetch();
    } catch (error) {
      console.error('Erro ao criar carta:', error);
      toast({
        title: "Erro",
        description: "Não foi possível criar a carta",
        variant: "destructive",
      });
    }
  };

  const handleEditCard = (card: any) => {
    setEditingCard(card);
    setCardForm({
      name: card.name,
      description: card.description || '',
      rarity: card.rarity,
      price: card.price,
      copies_available: card.copies_available || 0,
      image_url: card.image_url || ''
    });
    setIsCreating(false);
  };

  const handleUpdateCard = async () => {
    if (!editingCard || !cardForm.name || !cardForm.description) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('cards')
        .update({
          name: cardForm.name,
          description: cardForm.description,
          rarity: cardForm.rarity as 'common' | 'rare' | 'legendary' | 'mythic',
          price: cardForm.price,
          copies_available: cardForm.copies_available,
          image_url: cardForm.image_url || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingCard.id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Carta atualizada com sucesso!",
      });

      resetForm();
      refetch();
    } catch (error) {
      console.error('Erro ao atualizar carta:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a carta",
        variant: "destructive",
      });
    }
  };

  const handleDeleteCard = async (cardId: string) => {
    if (!window.confirm('Tem certeza que deseja deletar esta carta?')) return;

    try {
      const { error } = await supabase
        .from('cards')
        .delete()
        .eq('id', cardId);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Carta removida com sucesso!",
      });
      refetch();
    } catch (error) {
      console.error('Erro ao remover carta:', error);
      toast({
        title: "Erro",
        description: "Não foi possível remover a carta",
        variant: "destructive",
      });
    }
  };

  const toggleCardAvailability = async (cardId: string, currentAvailability: boolean) => {
    try {
      const { error } = await supabase
        .from('cards')
        .update({ available: !currentAvailability })
        .eq('id', cardId);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: `Carta ${!currentAvailability ? 'ativada' : 'desativada'} com sucesso!`,
      });
      refetch();
    } catch (error) {
      console.error('Erro ao alterar disponibilidade:', error);
      toast({
        title: "Erro",
        description: "Não foi possível alterar a disponibilidade",
        variant: "destructive",
      });
    }
  };

  const filteredCards = cards?.filter(card =>
    card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    card.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    card.rarity.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const stats = {
    total: cards?.length || 0,
    available: cards?.filter(c => c.available).length || 0,
    common: cards?.filter(c => c.rarity === 'common').length || 0,
    rare: cards?.filter(c => c.rarity === 'rare').length || 0,
    legendary: cards?.filter(c => c.rarity === 'legendary').length || 0,
    mythic: cards?.filter(c => c.rarity === 'mythic').length || 0,
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gerenciar Cartas</h1>
          <p className="text-gray-600 mt-1">
            Crie e gerencie cartas colecionáveis do sistema
          </p>
        </div>
        <Button onClick={() => setIsCreating(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Criar Nova Carta
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-sm text-gray-600">Total</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-green-600">{stats.available}</div>
            <p className="text-sm text-gray-600">Disponíveis</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-gray-600">{stats.common}</div>
            <p className="text-sm text-gray-600">Common</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-blue-600">{stats.rare}</div>
            <p className="text-sm text-gray-600">Rare</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-yellow-600">{stats.legendary}</div>
            <p className="text-sm text-gray-600">Legendary</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-purple-600">{stats.mythic}</div>
            <p className="text-sm text-gray-600">Mythic</p>
          </CardContent>
        </Card>
      </div>

      {(isCreating || editingCard) && (
        <Card>
          <CardHeader>
            <CardTitle>{editingCard ? 'Editar Carta' : 'Criar Nova Carta'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="cardName">Nome da Carta</Label>
                <Input
                  id="cardName"
                  value={cardForm.name}
                  onChange={(e) => setCardForm({...cardForm, name: e.target.value})}
                  placeholder="Ex: Laboratório de Física"
                />
              </div>
              <div>
                <Label htmlFor="rarity">Raridade</Label>
                <Select value={cardForm.rarity} onValueChange={(value) => setCardForm({...cardForm, rarity: value})}>
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
                value={cardForm.description}
                onChange={(e) => setCardForm({...cardForm, description: e.target.value})}
                placeholder="Descreva a carta..."
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="imageUrl">URL da Imagem</Label>
              <Input
                id="imageUrl"
                value={cardForm.image_url}
                onChange={(e) => setCardForm({...cardForm, image_url: e.target.value})}
                placeholder="https://exemplo.com/imagem.jpg"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Preço (IFCoins)</Label>
                <Input
                  id="price"
                  type="number"
                  min="1"
                  value={cardForm.price}
                  onChange={(e) => setCardForm({...cardForm, price: parseInt(e.target.value) || 0})}
                />
              </div>
              <div>
                <Label htmlFor="copies">Cópias Disponíveis</Label>
                <Input
                  id="copies"
                  type="number"
                  min="0"
                  value={cardForm.copies_available}
                  onChange={(e) => setCardForm({...cardForm, copies_available: parseInt(e.target.value) || 0})}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={editingCard ? handleUpdateCard : handleCreateCard}>
                {editingCard ? 'Atualizar Carta' : 'Criar Carta'}
              </Button>
              <Button variant="outline" onClick={resetForm}>Cancelar</Button>
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
                  <TableCell>{card.copies_available || 0}</TableCell>
                  <TableCell>
                    <Button
                      variant={card.available ? "outline" : "destructive"}
                      size="sm"
                      onClick={() => toggleCardAvailability(card.id, card.available)}
                    >
                      {card.available ? 'Ativo' : 'Inativo'}
                    </Button>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" onClick={() => handleEditCard(card)}>
                        <Edit className="h-4 w-4 text-blue-500" />
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

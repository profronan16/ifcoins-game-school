
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar, Plus, Edit, Trash2, Trophy } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const mockEvents = [
  {
    id: '1',
    name: 'Semana do Meio Ambiente',
    startDate: '2024-06-01',
    endDate: '2024-06-07',
    bonusMultiplier: 2,
    cards: ['Energia Solar', 'Árvore Rara'],
    description: 'Evento especial com cartas temáticas ambientais',
    status: 'active'
  },
  {
    id: '2',
    name: 'Feira de Ciências',
    startDate: '2024-07-15',
    endDate: '2024-07-20',
    bonusMultiplier: 1.5,
    cards: ['Laboratório Avançado', 'Experimento Químico'],
    description: 'Celebrando a inovação científica',
    status: 'upcoming'
  },
  {
    id: '3',
    name: 'Semana da Programação',
    startDate: '2024-05-01',
    endDate: '2024-05-07',
    bonusMultiplier: 2,
    cards: ['Código Perfeito', 'Bug Hunter'],
    description: 'Evento para os desenvolvedores',
    status: 'finished'
  }
];

export function Events() {
  const { user } = useAuth();
  const [events, setEvents] = useState(mockEvents);
  const [isCreating, setIsCreating] = useState(false);
  const [editingEvent, setEditingEvent] = useState<string | null>(null);
  const [newEvent, setNewEvent] = useState({
    name: '',
    startDate: '',
    endDate: '',
    bonusMultiplier: 1,
    description: ''
  });

  const handleCreateEvent = () => {
    if (!newEvent.name || !newEvent.startDate || !newEvent.endDate) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    const event = {
      id: Date.now().toString(),
      ...newEvent,
      cards: [],
      status: 'upcoming'
    };

    setEvents([...events, event]);
    setNewEvent({ name: '', startDate: '', endDate: '', bonusMultiplier: 1, description: '' });
    setIsCreating(false);
    
    toast({
      title: "Sucesso",
      description: "Evento criado com sucesso!",
    });
  };

  const handleDeleteEvent = (eventId: string) => {
    setEvents(events.filter(e => e.id !== eventId));
    toast({
      title: "Sucesso",
      description: "Evento removido com sucesso!",
    });
  };

  const getEventStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'finished': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEventStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Ativo';
      case 'upcoming': return 'Próximo';
      case 'finished': return 'Finalizado';
      default: return 'Desconhecido';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Eventos</h1>
          <p className="text-gray-600 mt-1">
            Eventos especiais com multiplicadores de moedas
          </p>
        </div>
        {user?.role === 'admin' && (
          <Button onClick={() => setIsCreating(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Criar Evento
          </Button>
        )}
      </div>

      {isCreating && user?.role === 'admin' && (
        <Card>
          <CardHeader>
            <CardTitle>Criar Novo Evento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Nome do Evento</Label>
              <Input
                id="name"
                value={newEvent.name}
                onChange={(e) => setNewEvent({...newEvent, name: e.target.value})}
                placeholder="Ex: Semana da Ciência"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">Data de Início</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={newEvent.startDate}
                  onChange={(e) => setNewEvent({...newEvent, startDate: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="endDate">Data de Fim</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={newEvent.endDate}
                  onChange={(e) => setNewEvent({...newEvent, endDate: e.target.value})}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="multiplier">Multiplicador de Moedas</Label>
              <Input
                id="multiplier"
                type="number"
                min="1"
                max="10"
                step="0.1"
                value={newEvent.bonusMultiplier}
                onChange={(e) => setNewEvent({...newEvent, bonusMultiplier: parseFloat(e.target.value)})}
              />
            </div>
            <div>
              <Label htmlFor="description">Descrição</Label>
              <Input
                id="description"
                value={newEvent.description}
                onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                placeholder="Descrição do evento"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleCreateEvent}>Criar Evento</Button>
              <Button variant="outline" onClick={() => setIsCreating(false)}>Cancelar</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {events.map((event) => (
          <Card key={event.id} className="relative">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{event.name}</CardTitle>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-2 ${getEventStatusColor(event.status)}`}>
                    {getEventStatusText(event.status)}
                  </span>
                </div>
                {user?.role === 'admin' && (
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={() => setEditingEvent(event.id)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteEvent(event.id)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  {new Date(event.startDate).toLocaleDateString('pt-BR')} - {new Date(event.endDate).toLocaleDateString('pt-BR')}
                </div>
                <div className="flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-ifpr-green" />
                  <span className="font-semibold text-ifpr-green">{event.bonusMultiplier}x moedas</span>
                </div>
                <p className="text-sm text-gray-600">{event.description}</p>
                {event.cards.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Cartas Especiais:</p>
                    <div className="flex flex-wrap gap-1">
                      {event.cards.map((card, index) => (
                        <span key={index} className="px-2 py-1 bg-ifpr-blue/10 text-ifpr-blue text-xs rounded">
                          {card}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

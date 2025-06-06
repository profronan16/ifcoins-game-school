
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Plus, Loader2 } from 'lucide-react';
import { useEventManagement } from '@/hooks/useEventManagement';
import { EventForm } from '@/components/events/EventForm';
import { EventCard } from '@/components/events/EventCard';
import { Event } from '@/types/supabase';

export function Events() {
  const { profile } = useAuth();
  const {
    events,
    isLoading,
    loading,
    createEvent,
    updateEvent,
    deleteEvent
  } = useEventManagement();
  
  const [isCreating, setIsCreating] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  const isAdmin = profile?.role === 'admin';

  const handleCreateEvent = async (eventData: {
    name: string;
    description: string;
    start_date: string;
    end_date: string;
    bonus_multiplier: number;
  }) => {
    const success = await createEvent(eventData);
    if (success) {
      setIsCreating(false);
    }
    return success;
  };

  const handleUpdateEvent = async (eventData: {
    name: string;
    description: string;
    start_date: string;
    end_date: string;
    bonus_multiplier: number;
  }) => {
    if (!editingEvent) return false;
    
    const success = await updateEvent(editingEvent.id, eventData);
    if (success) {
      setEditingEvent(null);
    }
    return success;
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (window.confirm('Tem certeza que deseja deletar este evento?')) {
      await deleteEvent(eventId);
    }
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setIsCreating(false);
  };

  const handleCancelForm = () => {
    setIsCreating(false);
    setEditingEvent(null);
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
        {isAdmin && (
          <Button 
            onClick={() => setIsCreating(true)} 
            className="flex items-center gap-2"
            disabled={isCreating || editingEvent !== null}
          >
            <Plus className="h-4 w-4" />
            Criar Evento
          </Button>
        )}
      </div>

      {(isCreating || editingEvent) && isAdmin && (
        <EventForm
          event={editingEvent}
          onSubmit={editingEvent ? handleUpdateEvent : handleCreateEvent}
          onCancel={handleCancelForm}
          loading={loading}
        />
      )}

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-ifpr-green" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {events?.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              isAdmin={isAdmin}
              onEdit={handleEditEvent}
              onDelete={handleDeleteEvent}
            />
          ))}
        </div>
      )}

      {!isLoading && events?.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhum evento encontrado
          </h3>
          <p className="text-gray-600">
            {isAdmin ? 'Clique em "Criar Evento" para adicionar o primeiro evento.' : 'Não há eventos disponíveis no momento.'}
          </p>
        </div>
      )}
    </div>
  );
}

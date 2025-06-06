
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useEventManagement } from '@/hooks/useEventManagement';
import { EventForm } from '@/components/events/EventForm';
import { EventsList } from '@/components/events/EventsList';
import { EventsHeader } from '@/components/events/EventsHeader';
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
      <EventsHeader
        isAdmin={isAdmin}
        onCreateEvent={() => setIsCreating(true)}
        disabled={isCreating || editingEvent !== null}
      />

      {(isCreating || editingEvent) && isAdmin && (
        <EventForm
          event={editingEvent}
          onSubmit={editingEvent ? handleUpdateEvent : handleCreateEvent}
          onCancel={handleCancelForm}
          loading={loading}
        />
      )}

      <EventsList
        events={events}
        isLoading={isLoading}
        isAdmin={isAdmin}
        onEdit={handleEditEvent}
        onDelete={handleDeleteEvent}
      />
    </div>
  );
}

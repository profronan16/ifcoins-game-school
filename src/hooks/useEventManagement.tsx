
import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Event } from '@/types/supabase';

export function useEventManagement() {
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const { data: events, isLoading, refetch } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('start_date', { ascending: false });
      
      if (error) throw error;
      return data as Event[];
    },
  });

  const createEvent = async (eventData: {
    name: string;
    description: string;
    start_date: string;
    end_date: string;
    bonus_multiplier: number;
  }) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.rpc('create_event', {
        name: eventData.name,
        description: eventData.description,
        start_date: eventData.start_date,
        end_date: eventData.end_date,
        bonus_multiplier: eventData.bonus_multiplier
      });

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Evento criado com sucesso!",
      });

      refetch();
      return true;
    } catch (error) {
      console.error('Erro ao criar evento:', error);
      toast({
        title: "Erro",
        description: "Não foi possível criar o evento",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateEvent = async (eventId: string, eventData: {
    name: string;
    description: string;
    start_date: string;
    end_date: string;
    bonus_multiplier: number;
  }) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.rpc('update_event', {
        event_id: eventId,
        name: eventData.name,
        description: eventData.description,
        start_date: eventData.start_date,
        end_date: eventData.end_date,
        bonus_multiplier: eventData.bonus_multiplier
      });

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Evento atualizado com sucesso!",
      });

      refetch();
      return true;
    } catch (error) {
      console.error('Erro ao atualizar evento:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o evento",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteEvent = async (eventId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.rpc('delete_event', {
        event_id: eventId
      });

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Evento removido com sucesso!",
      });

      refetch();
      return true;
    } catch (error) {
      console.error('Erro ao deletar evento:', error);
      toast({
        title: "Erro",
        description: "Não foi possível remover o evento",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    events,
    isLoading,
    loading,
    createEvent,
    updateEvent,
    deleteEvent,
    refetch
  };
}


import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface EventsHeaderProps {
  isAdmin: boolean;
  onCreateEvent: () => void;
  disabled?: boolean;
}

export function EventsHeader({ isAdmin, onCreateEvent, disabled }: EventsHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Eventos</h1>
        <p className="text-gray-600 mt-1">
          Eventos especiais com multiplicadores de moedas
        </p>
      </div>
      {isAdmin && (
        <Button 
          onClick={onCreateEvent} 
          className="flex items-center gap-2"
          disabled={disabled}
        >
          <Plus className="h-4 w-4" />
          Criar Evento
        </Button>
      )}
    </div>
  );
}

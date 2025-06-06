
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Coins } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useUpdateCoins } from '@/hooks/useUpdateCoins';
import { Profile } from '@/types/supabase';

interface TeacherGiveCoinsSection {
  users: Profile[] | undefined;
  teacherId: string;
  onSuccess: () => void;
}

export function TeacherGiveCoinsSection({ users, teacherId, onSuccess }: TeacherGiveCoinsSection) {
  const [selectedUserId, setSelectedUserId] = useState('');
  const [coinsAmount, setCoinsAmount] = useState('');
  const [reason, setReason] = useState('');
  const { giveCoins, loading } = useUpdateCoins();

  const handleGiveCoins = async () => {
    if (!selectedUserId || !coinsAmount || !reason) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    const amount = parseInt(coinsAmount);
    if (amount <= 0 || amount > 50) {
      toast({
        title: "Quantidade inválida",
        description: "Você pode dar entre 1 e 50 moedas",
        variant: "destructive"
      });
      return;
    }

    const selectedUserName = users?.find(u => u.id === selectedUserId)?.name || 'Usuário';
    
    const success = await giveCoins(selectedUserId, amount, reason, teacherId, selectedUserName);
    
    if (success) {
      setSelectedUserId('');
      setCoinsAmount('');
      setReason('');
      onSuccess();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dar Moedas para Estudante</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label>Estudante</Label>
            <select 
              className="w-full p-2 border rounded"
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
            >
              <option value="">Selecione um estudante</option>
              {users?.filter(u => u.role === 'student').map(user => (
                <option key={user.id} value={user.id}>
                  {user.name} - {user.email}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label>Quantidade (1-50)</Label>
            <Input
              type="number"
              min="1"
              max="50"
              value={coinsAmount}
              onChange={(e) => setCoinsAmount(e.target.value)}
              placeholder="5"
            />
          </div>
          <div>
            <Label>Motivo</Label>
            <Input
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Boa participação"
            />
          </div>
        </div>
        <Button onClick={handleGiveCoins} disabled={loading} className="bg-ifpr-green">
          <Coins className="h-4 w-4 mr-2" />
          {loading ? 'Dando...' : 'Dar Moedas'}
        </Button>
      </CardContent>
    </Card>
  );
}


import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Coins, Users, Award } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/types/supabase';

export function AdminGiveCoins() {
  const { profile } = useAuth();
  const [users, setUsers] = useState<Profile[]>([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [coinsAmount, setCoinsAmount] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('name');
      
      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os usuários",
        variant: "destructive"
      });
    }
  };

  const handleGiveCoins = async () => {
    if (!selectedUser || !coinsAmount || !reason || !profile) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos para dar moedas",
        variant: "destructive"
      });
      return;
    }

    const amount = parseInt(coinsAmount);
    if (amount <= 0 || amount > 1000) {
      toast({
        title: "Quantidade inválida",
        description: "Você pode dar entre 1 e 1000 moedas",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      // Update user coins
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          coins: supabase.raw(`coins + ${amount}`),
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedUser);

      if (updateError) throw updateError;

      // Log the reward
      const { error: logError } = await supabase
        .from('reward_logs')
        .insert({
          teacher_id: profile.id,
          student_id: selectedUser,
          coins: amount,
          reason: reason
        });

      if (logError) throw logError;

      const selectedUserName = users.find(u => u.id === selectedUser)?.name || 'Usuário';
      
      toast({
        title: "Moedas entregues!",
        description: `${amount} IFCoins foram dados para ${selectedUserName}`,
      });

      setSelectedUser('');
      setCoinsAmount('');
      setReason('');
      
    } catch (error) {
      console.error('Error giving coins:', error);
      toast({
        title: "Erro",
        description: "Não foi possível dar as moedas",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (!profile || profile.role !== 'admin') return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Dar Moedas IFCoins
        </h1>
        <p className="text-gray-600 mt-1">
          Recompense usuários com moedas IFCoins
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-lg">Total de Usuários</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-blue-600">{users.length}</p>
            <p className="text-sm text-gray-600">Cadastrados no sistema</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Coins className="h-5 w-5 text-yellow-600" />
              <CardTitle className="text-lg">Moedas Distribuídas</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-yellow-600">2,450</p>
            <p className="text-sm text-gray-600">Hoje</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-green-600" />
              <CardTitle className="text-lg">Recompensas</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">89</p>
            <p className="text-sm text-gray-600">Esta semana</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coins className="h-5 w-5" />
            Dar Moedas IFCoins
          </CardTitle>
          <CardDescription>
            Recompense estudantes e professores por bom desempenho
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="user">Usuário</Label>
              <Select value={selectedUser} onValueChange={setSelectedUser}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um usuário" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name} - {user.role} ({user.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="coins">Quantidade de Moedas</Label>
              <Input
                id="coins"
                type="number"
                min="1"
                max="1000"
                placeholder="100"
                value={coinsAmount}
                onChange={(e) => setCoinsAmount(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="reason">Motivo da Recompensa</Label>
            <Textarea
              id="reason"
              placeholder="Ex: Excelente participação no projeto de pesquisa"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
            />
          </div>
          <Button 
            onClick={handleGiveCoins}
            className="bg-ifpr-green hover:bg-ifpr-green-dark"
            disabled={loading}
          >
            <Coins className="h-4 w-4 mr-2" />
            {loading ? 'Dando Moedas...' : 'Dar Moedas'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

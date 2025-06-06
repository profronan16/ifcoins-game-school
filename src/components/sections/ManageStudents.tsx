
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { User, Plus, Mail, Search, Coins } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/types/supabase';

export function ManageStudents() {
  const { profile } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUserId, setSelectedUserId] = useState('');
  const [coinsAmount, setCoinsAmount] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  const { data: users, refetch } = useQuery({
    queryKey: ['manage-users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Profile[];
    },
    enabled: !!profile && (profile.role === 'admin' || profile.role === 'teacher'),
  });

  if (!profile || (profile.role !== 'admin' && profile.role !== 'teacher')) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Acesso Negado</h2>
        <p className="text-gray-600">Apenas administradores e professores podem gerenciar usuários.</p>
      </div>
    );
  }

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
    if (amount <= 0 || amount > (profile.role === 'admin' ? 1000 : 50)) {
      toast({
        title: "Quantidade inválida",
        description: `Você pode dar entre 1 e ${profile.role === 'admin' ? 1000 : 50} moedas`,
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      // Atualizar moedas do usuário - fix the parameter names
      const { error: updateError } = await supabase.rpc('update_user_coins', {
        user_id_param: selectedUserId,
        amount: amount
      });

      if (updateError) throw updateError;

      // Registrar log da recompensa
      const { error: logError } = await supabase
        .from('reward_logs')
        .insert({
          teacher_id: profile.id,
          student_id: selectedUserId,
          coins: amount,
          reason: reason
        });

      if (logError) throw logError;

      const selectedUserName = users?.find(u => u.id === selectedUserId)?.name || 'Usuário';
      
      toast({
        title: "Moedas entregues!",
        description: `${amount} IFCoins foram dados para ${selectedUserName}`,
      });

      setSelectedUserId('');
      setCoinsAmount('');
      setReason('');
      refetch();
      
    } catch (error) {
      console.error('Erro ao dar moedas:', error);
      toast({
        title: "Erro",
        description: "Não foi possível dar as moedas",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users?.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.ra?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.class?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const stats = {
    total: users?.length || 0,
    students: users?.filter(u => u.role === 'student').length || 0,
    teachers: users?.filter(u => u.role === 'teacher').length || 0,
    admins: users?.filter(u => u.role === 'admin').length || 0,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Gerenciar Usuários</h1>
        <p className="text-gray-600 mt-1">
          Visualize e gerencie usuários do sistema
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Estudantes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.students}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Professores</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.teachers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Administradores</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.admins}</div>
          </CardContent>
        </Card>
      </div>

      {profile.role === 'teacher' && (
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
      )}

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Usuários Cadastrados</CardTitle>
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-gray-500" />
              <Input
                placeholder="Buscar usuários..."
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
                <TableHead>Email</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>RA/Classe</TableHead>
                <TableHead>IFCoins</TableHead>
                <TableHead>Cadastro</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                      user.role === 'teacher' ? 'bg-green-100 text-green-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {user.role === 'admin' ? 'Admin' : 
                       user.role === 'teacher' ? 'Professor' : 'Estudante'}
                    </span>
                  </TableCell>
                  <TableCell>
                    {user.ra && `RA: ${user.ra}`}
                    {user.class && ` - ${user.class}`}
                  </TableCell>
                  <TableCell className="font-bold text-ifpr-green">{user.coins}</TableCell>
                  <TableCell>
                    {new Date(user.created_at).toLocaleDateString('pt-BR')}
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

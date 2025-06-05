
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Coins, Users, Clock, Award } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export function TeacherDashboard() {
  const { profile } = useAuth();
  const [selectedStudentEmail, setSelectedStudentEmail] = useState('');
  const [coinsAmount, setCoinsAmount] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  const { data: students } = useQuery({
    queryKey: ['students-for-teacher'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'student')
        .order('name');
      
      if (error) throw error;
      return data;
    },
    enabled: profile?.role === 'teacher',
  });

  const { data: todayRewards } = useQuery({
    queryKey: ['today-rewards', profile?.id],
    queryFn: async () => {
      if (!profile) return [];
      
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('reward_logs')
        .select('*')
        .eq('teacher_id', profile.id)
        .gte('created_at', `${today}T00:00:00`)
        .lte('created_at', `${today}T23:59:59`);
      
      if (error) throw error;
      return data;
    },
    enabled: profile?.role === 'teacher',
  });

  const { data: recentRewards } = useQuery({
    queryKey: ['teacher-recent-rewards', profile?.id],
    queryFn: async () => {
      if (!profile) return [];
      
      const { data, error } = await supabase
        .from('reward_logs')
        .select(`
          *,
          student:profiles!reward_logs_student_id_fkey(name)
        `)
        .eq('teacher_id', profile.id)
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      return data;
    },
    enabled: profile?.role === 'teacher',
  });

  if (!profile || profile.role !== 'teacher') return null;

  const handleGiveCoins = async () => {
    if (!selectedStudentEmail || !coinsAmount || !reason) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos para dar moedas",
        variant: "destructive"
      });
      return;
    }

    const amount = parseInt(coinsAmount);
    if (amount <= 0 || amount > 50) {
      toast({
        title: "Quantidade inválida",
        description: "Você pode dar entre 1 e 50 moedas por vez",
        variant: "destructive"
      });
      return;
    }

    // Encontrar o estudante pelo email
    const selectedStudent = students?.find(s => s.email === selectedStudentEmail);
    if (!selectedStudent) {
      toast({
        title: "Estudante não encontrado",
        description: "Verifique se o email está correto",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      // Atualizar moedas do estudante
      const { error: updateError } = await supabase.rpc('update_user_coins', {
        user_id_param: selectedStudent.id,
        amount: amount
      });

      if (updateError) throw updateError;

      // Registrar log da recompensa
      const { error: logError } = await supabase
        .from('reward_logs')
        .insert({
          teacher_id: profile.id,
          student_id: selectedStudent.id,
          coins: amount,
          reason: reason
        });

      if (logError) throw logError;

      toast({
        title: "Moedas entregues!",
        description: `${amount} IFCoins foram dados para ${selectedStudent.name}`,
      });

      setSelectedStudentEmail('');
      setCoinsAmount('');
      setReason('');
      
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

  const todayCoinsGiven = todayRewards?.reduce((acc, reward) => acc + reward.coins, 0) || 0;
  const todayStudentsRewarded = new Set(todayRewards?.map(r => r.student_id)).size;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Painel do Professor
        </h1>
        <p className="text-gray-600 mt-1">
          Bem-vindo, {profile.name}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Coins className="h-5 w-5 text-ifpr-green" />
              <CardTitle className="text-lg">Moedas Dadas Hoje</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-ifpr-green">{todayCoinsGiven}</p>
            <p className="text-sm text-gray-600">Para {todayStudentsRewarded} estudantes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-ifpr-blue" />
              <CardTitle className="text-lg">Estudantes Ativos</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-ifpr-blue">{students?.length || 0}</p>
            <p className="text-sm text-gray-600">No sistema</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-yellow-600" />
              <CardTitle className="text-lg">Limite por Vez</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-yellow-600">50</p>
            <p className="text-sm text-gray-600">Moedas máximo</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-purple-600" />
              <CardTitle className="text-lg">Total de Recompensas</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-purple-600">{recentRewards?.length || 0}</p>
            <p className="text-sm text-gray-600">Registros recentes</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Dar Moedas IFCoins
          </CardTitle>
          <CardDescription>
            Recompense estudantes por bom comportamento e participação
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="student">Email do Estudante</Label>
              <Input
                id="student"
                placeholder="estudante@estudantes.ifpr.edu.br"
                value={selectedStudentEmail}
                onChange={(e) => setSelectedStudentEmail(e.target.value)}
                list="students-list"
              />
              <datalist id="students-list">
                {students?.map((student) => (
                  <option key={student.id} value={student.email}>
                    {student.name} - {student.email}
                  </option>
                ))}
              </datalist>
            </div>
            <div className="space-y-2">
              <Label htmlFor="coins">Quantidade de Moedas (1-50)</Label>
              <Input
                id="coins"
                type="number"
                min="1"
                max="50"
                placeholder="5"
                value={coinsAmount}
                onChange={(e) => setCoinsAmount(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="reason">Motivo da Recompensa</Label>
            <Textarea
              id="reason"
              placeholder="Ex: Participação ativa na aula de programação"
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

      <Card>
        <CardHeader>
          <CardTitle>Histórico Recente</CardTitle>
          <CardDescription>Suas últimas recompensas entregues</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentRewards?.map((reward) => (
              <div key={reward.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium">{reward.student.name}</p>
                  <p className="text-sm text-gray-600">{reward.reason}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-ifpr-green">+{reward.coins} IFCoins</p>
                  <p className="text-xs text-gray-500">
                    {new Date(reward.created_at).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

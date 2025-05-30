
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Coins, Users, Clock, Award } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export function TeacherDashboard() {
  const { user } = useAuth();
  const [selectedStudent, setSelectedStudent] = useState('');
  const [coinsAmount, setCoinsAmount] = useState('');
  const [reason, setReason] = useState('');

  if (!user || user.role !== 'teacher') return null;

  const handleGiveCoins = () => {
    if (!selectedStudent || !coinsAmount || !reason) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos para dar moedas",
        variant: "destructive"
      });
      return;
    }

    const amount = parseInt(coinsAmount);
    if (amount <= 0 || amount > 10) {
      toast({
        title: "Quantidade inválida",
        description: "Você pode dar entre 1 e 10 moedas por vez",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Moedas entregues!",
      description: `${amount} IFCoins foram dados para ${selectedStudent}`,
    });

    setSelectedStudent('');
    setCoinsAmount('');
    setReason('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Painel do Professor
        </h1>
        <p className="text-gray-600 mt-1">
          Bem-vindo, {user.name}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Coins className="h-5 w-5 text-ifpr-green" />
              <CardTitle className="text-lg">Moedas Dadas Hoje</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-ifpr-green">45</p>
            <p className="text-sm text-gray-600">Para 12 estudantes</p>
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
            <p className="text-2xl font-bold text-ifpr-blue">28</p>
            <p className="text-sm text-gray-600">Na sua turma</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-yellow-600" />
              <CardTitle className="text-lg">Limite Horário</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-yellow-600">10</p>
            <p className="text-sm text-gray-600">Moedas por estudante/hora</p>
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
              <Label htmlFor="student">Estudante</Label>
              <Input
                id="student"
                placeholder="Digite o nome do estudante"
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="coins">Quantidade de Moedas (1-10)</Label>
              <Input
                id="coins"
                type="number"
                min="1"
                max="10"
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
          >
            <Coins className="h-4 w-4 mr-2" />
            Dar Moedas
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
            {[
              { student: 'Ana Costa', coins: 5, reason: 'Ajudou colegas na atividade', time: '10:30' },
              { student: 'Carlos Silva', coins: 3, reason: 'Entregou tarefa em dia', time: '09:15' },
              { student: 'Maria Santos', coins: 8, reason: 'Excelente apresentação', time: '08:45' },
            ].map((reward, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium">{reward.student}</p>
                  <p className="text-sm text-gray-600">{reward.reason}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-ifpr-green">+{reward.coins} IFCoins</p>
                  <p className="text-xs text-gray-500">{reward.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

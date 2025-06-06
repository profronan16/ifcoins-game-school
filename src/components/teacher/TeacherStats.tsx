
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Coins, Users, Clock, Award } from 'lucide-react';

interface TeacherStatsProps {
  todayCoinsGiven: number;
  todayStudentsRewarded: number;
  totalStudents: number;
  totalRewards: number;
}

export function TeacherStats({ 
  todayCoinsGiven, 
  todayStudentsRewarded, 
  totalStudents, 
  totalRewards 
}: TeacherStatsProps) {
  return (
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
          <p className="text-2xl font-bold text-ifpr-blue">{totalStudents}</p>
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
          <p className="text-2xl font-bold text-purple-600">{totalRewards}</p>
          <p className="text-sm text-gray-600">Registros recentes</p>
        </CardContent>
      </Card>
    </div>
  );
}

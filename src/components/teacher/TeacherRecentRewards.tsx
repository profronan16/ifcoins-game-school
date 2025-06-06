
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface TeacherRecentRewardsProps {
  recentRewards: any[] | undefined;
}

export function TeacherRecentRewards({ recentRewards }: TeacherRecentRewardsProps) {
  return (
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
  );
}

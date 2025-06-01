
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, GraduationCap, Shield, Copy } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export function TestAccounts() {
  const testAccounts = [
    {
      role: 'Estudante',
      email: 'aluno.teste@estudantes.ifpr.edu.br',
      password: 'senha123',
      icon: GraduationCap,
      color: 'bg-blue-500',
      badgeColor: 'bg-blue-100 text-blue-800'
    },
    {
      role: 'Professor',
      email: 'professor.teste@ifpr.edu.br',
      password: 'senha123',
      icon: User,
      color: 'bg-green-500',
      badgeColor: 'bg-green-100 text-green-800'
    },
    {
      role: 'Admin',
      email: 'paulocauan39@gmail.com',
      password: 'senha123',
      icon: Shield,
      color: 'bg-red-500',
      badgeColor: 'bg-red-100 text-red-800'
    }
  ];

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado!",
      description: `${type} copiado para a área de transferência`,
    });
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Contas de Teste</h3>
        <p className="text-sm text-gray-600">Clique para copiar email ou senha</p>
      </div>
      
      <div className="grid gap-3">
        {testAccounts.map((account, index) => {
          const Icon = account.icon;
          return (
            <Card key={index} className="relative overflow-hidden">
              <div className={`absolute top-0 left-0 w-1 h-full ${account.color}`} />
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    <CardTitle className="text-sm">{account.role}</CardTitle>
                  </div>
                  <Badge className={`text-xs ${account.badgeColor}`}>
                    Teste
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <label className="text-xs text-gray-500">Email:</label>
                  <div 
                    className="flex items-center gap-2 p-2 bg-gray-50 rounded cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => copyToClipboard(account.email, 'Email')}
                  >
                    <span className="text-sm font-mono flex-1">{account.email}</span>
                    <Copy className="h-3 w-3 text-gray-400" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-gray-500">Senha:</label>
                  <div 
                    className="flex items-center gap-2 p-2 bg-gray-50 rounded cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => copyToClipboard(account.password, 'Senha')}
                  >
                    <span className="text-sm font-mono flex-1">{account.password}</span>
                    <Copy className="h-3 w-3 text-gray-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

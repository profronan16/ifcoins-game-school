
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Coins, Mail } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn, loading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await signIn(email, password);
      if (error) {
        toast({
          title: "Erro no login",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Login realizado com sucesso!",
          description: "Bem-vindo ao IFCoins",
        });
      }
    } catch (error) {
      toast({
        title: "Erro no login",
        description: "Credenciais inválidas. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-ifpr-green to-ifpr-blue flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-ifpr-green text-white rounded-full p-4">
              <Coins className="h-8 w-8" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-ifpr-green">IFCoins</CardTitle>
          <CardDescription>
            Sistema Educacional Gamificado do IFPR
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu.email@ifpr.edu.br"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-ifpr-green hover:bg-ifpr-green-dark"
              disabled={loading}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>

          <div className="mt-6 space-y-2 text-sm text-gray-600">
            <p className="font-medium">Usuários de demonstração:</p>
            <div className="text-xs space-y-1">
              <p><strong>Admin:</strong> admin@ifpr.edu.br</p>
              <p><strong>Professor:</strong> joao.santos@ifpr.edu.br</p>
              <p><strong>Estudante:</strong> ana.costa@estudante.ifpr.edu.br</p>
              <p className="text-gray-500">Senha: qualquer</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

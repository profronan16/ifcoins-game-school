
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { Loader2, Coins, AlertCircle } from 'lucide-react';

export function AuthPage() {
  const { signIn, signUp, loading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
  });
  
  const [signupForm, setSignupForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginForm.email || !loginForm.password) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    console.log('Tentando fazer login com:', loginForm.email);
    
    try {
      const { error } = await signIn(loginForm.email, loginForm.password);
      
      if (error) {
        console.error('Erro no login:', error);
        let errorMessage = "Credenciais inválidas";
        
        if (error.message?.includes('Invalid login credentials')) {
          errorMessage = "Email ou senha incorretos";
        } else if (error.message?.includes('Email not confirmed')) {
          errorMessage = "Email não confirmado. Verifique sua caixa de entrada";
        } else if (error.message?.includes('Too many requests')) {
          errorMessage = "Muitas tentativas. Tente novamente em alguns minutos";
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        toast({
          title: "Erro no login",
          description: errorMessage,
          variant: "destructive",
        });
      } else {
        console.log('Login realizado com sucesso');
        toast({
          title: "Sucesso",
          description: "Login realizado com sucesso!",
        });
      }
    } catch (err) {
      console.error('Erro inesperado no login:', err);
      toast({
        title: "Erro no login",
        description: "Erro inesperado. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent, isRetry = false) => {
    e.preventDefault();
    
    if (!isRetry) {
      if (!signupForm.name || !signupForm.email || !signupForm.password) {
        toast({
          title: "Erro",
          description: "Preencha todos os campos",
          variant: "destructive",
        });
        return;
      }

      if (signupForm.password !== signupForm.confirmPassword) {
        toast({
          title: "Erro",
          description: "As senhas não conferem",
          variant: "destructive",
        });
        return;
      }

      if (signupForm.password.length < 6) {
        toast({
          title: "Erro",
          description: "A senha deve ter pelo menos 6 caracteres",
          variant: "destructive",
        });
        return;
      }
    }

    setIsLoading(true);
    console.log('Tentando cadastrar:', signupForm.email, 'nome:', signupForm.name, 'tentativa:', retryCount + 1);
    
    try {
      const { error } = await signUp(signupForm.email, signupForm.password, signupForm.name);
      
      if (error) {
        console.error('Erro no cadastro:', error);
        
        // Se for erro de timeout e ainda não tentou muito, retry automaticamente
        if ((error.message?.includes('timeout') || error.status === 504) && retryCount < 2) {
          console.log('Erro de timeout, tentando novamente...');
          setRetryCount(prev => prev + 1);
          
          toast({
            title: "Tentando novamente...",
            description: `Conexão lenta. Tentativa ${retryCount + 2} de 3.`,
          });
          
          // Retry após 2 segundos
          setTimeout(() => {
            handleSignup(e, true);
          }, 2000);
          
          return;
        }
        
        let errorMessage = "Erro ao criar conta";
        
        if (error.message?.includes('User already registered')) {
          errorMessage = "Este email já está cadastrado. Tente fazer login";
        } else if (error.message?.includes('Invalid email')) {
          errorMessage = "Email inválido";
        } else if (error.message?.includes('Weak password')) {
          errorMessage = "Senha muito fraca. Use pelo menos 6 caracteres";
        } else if (error.message?.includes('timeout') || error.status === 504) {
          errorMessage = "Timeout na conexão. Tente novamente em alguns minutos";
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        toast({
          title: "Erro no cadastro",
          description: errorMessage,
          variant: "destructive",
        });
      } else {
        console.log('Cadastro realizado com sucesso');
        setRetryCount(0); // Reset retry count on success
        toast({
          title: "Cadastro realizado com sucesso!",
          description: "Bem-vindo ao IFCoins! Você já pode fazer login.",
        });
        setSignupForm({
          name: '',
          email: '',
          password: '',
          confirmPassword: '',
        });
      }
    } catch (err) {
      console.error('Erro inesperado no cadastro:', err);
      toast({
        title: "Erro no cadastro",
        description: "Erro inesperado. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-blue-100">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="bg-green-600 text-white rounded-full p-4">
              <Coins className="h-8 w-8" />
            </div>
          </div>
          <div>
            <CardTitle className="text-3xl font-bold text-green-600">IFCoins</CardTitle>
            <CardDescription className="text-lg mt-2">
              Sistema Educacional Gamificado do IFPR
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Entrar</TabsTrigger>
              <TabsTrigger value="signup">Cadastrar</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login" className="space-y-4">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                    placeholder="seu.email@ifpr.edu.br"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    id="password"
                    type="password"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                    placeholder="••••••••"
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-green-600 hover:bg-green-700"
                  disabled={isLoading}
                >
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Entrar
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup" className="space-y-4">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input
                    id="name"
                    value={signupForm.name}
                    onChange={(e) => setSignupForm({...signupForm, name: e.target.value})}
                    placeholder="João da Silva"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    value={signupForm.email}
                    onChange={(e) => setSignupForm({...signupForm, email: e.target.value})}
                    placeholder="seu.email@ifpr.edu.br"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Senha</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    value={signupForm.password}
                    onChange={(e) => setSignupForm({...signupForm, password: e.target.value})}
                    placeholder="Mínimo 6 caracteres"
                    required
                    minLength={6}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirmar Senha</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={signupForm.confirmPassword}
                    onChange={(e) => setSignupForm({...signupForm, confirmPassword: e.target.value})}
                    placeholder="Confirme sua senha"
                    required
                  />
                </div>
                
                {retryCount > 0 && (
                  <div className="flex items-center gap-2 text-amber-600 text-sm">
                    <AlertCircle className="h-4 w-4" />
                    <span>Tentativa {retryCount + 1} de 3 - Conexão lenta</span>
                  </div>
                )}
                
                <Button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={isLoading}
                >
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isLoading ? (retryCount > 0 ? `Tentando novamente...` : 'Cadastrando...') : 'Cadastrar'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
          
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600 space-y-2">
              <h4 className="font-medium text-gray-800">Contas de Teste:</h4>
              <ul className="space-y-1">
                <li><strong>Admin:</strong> paulocauan39@gmail.com</li>
                <li><strong>Professor:</strong> professor@ifpr.edu.br</li>
                <li><strong>Estudante:</strong> estudante@estudantes.ifpr.edu.br</li>
              </ul>
              <p className="text-xs text-gray-500 mt-2">
                Senha: qualquer (para testes). O tipo de conta é definido automaticamente pelo email.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

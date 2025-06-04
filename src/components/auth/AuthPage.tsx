
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { Loader2, Coins, AlertCircle, Clock, CheckCircle } from 'lucide-react';

export function AuthPage() {
  const { signIn, signUp, loading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [cooldownTime, setCooldownTime] = useState(0);
  const [lastSuccessfulAction, setLastSuccessfulAction] = useState<string | null>(null);
  
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

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Cooldown timer
  React.useEffect(() => {
    if (cooldownTime > 0) {
      const timer = setTimeout(() => {
        setCooldownTime(cooldownTime - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldownTime]);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateLoginForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!loginForm.email.trim()) {
      errors.email = 'Email é obrigatório';
    } else if (!validateEmail(loginForm.email)) {
      errors.email = 'Email inválido';
    }
    
    if (!loginForm.password) {
      errors.password = 'Senha é obrigatória';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateSignupForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!signupForm.name.trim()) {
      errors.name = 'Nome é obrigatório';
    } else if (signupForm.name.trim().length < 2) {
      errors.name = 'Nome deve ter pelo menos 2 caracteres';
    }
    
    if (!signupForm.email.trim()) {
      errors.email = 'Email é obrigatório';
    } else if (!validateEmail(signupForm.email)) {
      errors.email = 'Email inválido';
    }
    
    if (!signupForm.password) {
      errors.password = 'Senha é obrigatória';
    } else if (signupForm.password.length < 6) {
      errors.password = 'Senha deve ter pelo menos 6 caracteres';
    }
    
    if (!signupForm.confirmPassword) {
      errors.confirmPassword = 'Confirme sua senha';
    } else if (signupForm.password !== signupForm.confirmPassword) {
      errors.confirmPassword = 'Senhas não conferem';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (cooldownTime > 0) {
      toast({
        title: "Aguarde",
        description: `Aguarde ${cooldownTime} segundos antes de tentar novamente`,
        variant: "destructive",
      });
      return;
    }

    if (!validateLoginForm()) {
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
        } else if (error.message?.includes('Too many requests') || error.status === 429) {
          errorMessage = "Muitas tentativas. Aguarde alguns minutos";
          setCooldownTime(120);
        } else if (error.message?.includes('timeout') || error.status === 504) {
          errorMessage = "Conexão lenta. Tente novamente em alguns segundos";
          setCooldownTime(30);
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
        setLastSuccessfulAction('Login realizado com sucesso!');
        toast({
          title: "Sucesso",
          description: "Login realizado com sucesso!",
        });
        
        // Limpar formulário
        setLoginForm({ email: '', password: '' });
        setFormErrors({});
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

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (cooldownTime > 0) {
      toast({
        title: "Aguarde",
        description: `Aguarde ${cooldownTime} segundos antes de tentar novamente`,
        variant: "destructive",
      });
      return;
    }

    if (!validateSignupForm()) {
      return;
    }

    setIsLoading(true);
    console.log('Tentando cadastrar:', signupForm.email, 'nome:', signupForm.name);
    
    try {
      const { error } = await signUp(signupForm.email, signupForm.password, signupForm.name);
      
      if (error) {
        console.error('Erro no cadastro:', error);
        
        let errorMessage = "Erro ao criar conta";
        
        if (error.message?.includes('email rate limit') || error.status === 429 || error.code === 'over_email_send_rate_limit') {
          errorMessage = "Limite de emails excedido. Aguarde 10 minutos antes de tentar novamente";
          setCooldownTime(600);
        } else if (error.message?.includes('User already registered') || error.message?.includes('already been registered')) {
          errorMessage = "Este email já está cadastrado. Tente fazer login";
        } else if (error.message?.includes('Invalid email')) {
          errorMessage = "Email inválido";
        } else if (error.message?.includes('Weak password')) {
          errorMessage = "Senha muito fraca. Use pelo menos 6 caracteres";
        } else if (error.message?.includes('timeout') || error.status === 504) {
          errorMessage = "Conexão lenta. Tente novamente em alguns segundos";
          setCooldownTime(60);
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
        setLastSuccessfulAction('Conta criada com sucesso! Você pode fazer login agora.');
        toast({
          title: "Cadastro realizado com sucesso!",
          description: "Bem-vindo ao IFCoins! Você já pode fazer login.",
        });
        
        // Limpar formulário
        setSignupForm({
          name: '',
          email: '',
          password: '',
          confirmPassword: '',
        });
        setFormErrors({});
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
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-green-600" />
          <p className="text-green-600">Carregando...</p>
        </div>
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
          {lastSuccessfulAction && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 text-green-800">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm font-medium">{lastSuccessfulAction}</span>
              </div>
            </div>
          )}

          {cooldownTime > 0 && (
            <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-center gap-2 text-amber-800">
                <Clock className="h-4 w-4" />
                <span className="text-sm font-medium">
                  Aguarde {Math.floor(cooldownTime / 60)}:{(cooldownTime % 60).toString().padStart(2, '0')} para tentar novamente
                </span>
              </div>
            </div>
          )}
          
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
                    onChange={(e) => {
                      setLoginForm({...loginForm, email: e.target.value});
                      if (formErrors.email) {
                        setFormErrors({...formErrors, email: ''});
                      }
                    }}
                    placeholder="seu.email@ifpr.edu.br"
                    disabled={isLoading || cooldownTime > 0}
                    className={formErrors.email ? 'border-red-500' : ''}
                  />
                  {formErrors.email && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {formErrors.email}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    id="password"
                    type="password"
                    value={loginForm.password}
                    onChange={(e) => {
                      setLoginForm({...loginForm, password: e.target.value});
                      if (formErrors.password) {
                        setFormErrors({...formErrors, password: ''});
                      }
                    }}
                    placeholder="••••••••"
                    disabled={isLoading || cooldownTime > 0}
                    className={formErrors.password ? 'border-red-500' : ''}
                  />
                  {formErrors.password && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {formErrors.password}
                    </p>
                  )}
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-green-600 hover:bg-green-700"
                  disabled={isLoading || cooldownTime > 0}
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
                    onChange={(e) => {
                      setSignupForm({...signupForm, name: e.target.value});
                      if (formErrors.name) {
                        setFormErrors({...formErrors, name: ''});
                      }
                    }}
                    placeholder="João da Silva"
                    disabled={isLoading || cooldownTime > 0}
                    className={formErrors.name ? 'border-red-500' : ''}
                  />
                  {formErrors.name && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {formErrors.name}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    value={signupForm.email}
                    onChange={(e) => {
                      setSignupForm({...signupForm, email: e.target.value});
                      if (formErrors.email) {
                        setFormErrors({...formErrors, email: ''});
                      }
                    }}
                    placeholder="seu.email@ifpr.edu.br"
                    disabled={isLoading || cooldownTime > 0}
                    className={formErrors.email ? 'border-red-500' : ''}
                  />
                  {formErrors.email && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {formErrors.email}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Senha</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    value={signupForm.password}
                    onChange={(e) => {
                      setSignupForm({...signupForm, password: e.target.value});
                      if (formErrors.password) {
                        setFormErrors({...formErrors, password: ''});
                      }
                    }}
                    placeholder="Mínimo 6 caracteres"
                    disabled={isLoading || cooldownTime > 0}
                    className={formErrors.password ? 'border-red-500' : ''}
                  />
                  {formErrors.password && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {formErrors.password}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirmar Senha</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={signupForm.confirmPassword}
                    onChange={(e) => {
                      setSignupForm({...signupForm, confirmPassword: e.target.value});
                      if (formErrors.confirmPassword) {
                        setFormErrors({...formErrors, confirmPassword: ''});
                      }
                    }}
                    placeholder="Confirme sua senha"
                    disabled={isLoading || cooldownTime > 0}
                    className={formErrors.confirmPassword ? 'border-red-500' : ''}
                  />
                  {formErrors.confirmPassword && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {formErrors.confirmPassword}
                    </p>
                  )}
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={isLoading || cooldownTime > 0}
                >
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isLoading ? 'Cadastrando...' : 'Cadastrar'}
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

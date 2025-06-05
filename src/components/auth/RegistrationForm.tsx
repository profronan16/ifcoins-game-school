// src/components/auth/RegistrationForm.tsx
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext'; // Garanta que este import esteja correto
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast'; // Hook para exibir notificações
import { Loader2, Coins, AlertCircle } from 'lucide-react'; // Ícones
import { SuccessMessage } from './SuccessMessage'; // Componente de mensagem de sucesso

export function RegistrationForm() {
  const { signUp } = useAuth(); // Obtém a função signUp do contexto de autenticação
  const [isLoading, setIsLoading] = useState(false); // Estado para controlar o carregamento
  const [success, setSuccess] = useState(false); // Estado para mostrar mensagem de sucesso
  
  // Estado do formulário
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({}); // Estado para erros de validação do formulário

  /**
   * Valida os campos do formulário antes do envio.
   * @returns true se o formulário for válido, false caso contrário.
   */
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!form.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    } else if (form.name.trim().length < 2) {
      newErrors.name = 'Nome deve ter pelo menos 2 caracteres';
    }
    
    if (!form.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Email inválido';
    }
    
    if (!form.password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (form.password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    }
    
    if (!form.confirmPassword) {
      newErrors.confirmPassword = 'Confirme sua senha';
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = 'Senhas não conferem';
    }
    
    setErrors(newErrors); // Atualiza o estado de erros
    return Object.keys(newErrors).length === 0; // Retorna true se não houver erros
  };

  /**
   * Lida com o envio do formulário de cadastro.
   * @param e O evento de envio do formulário.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Previne o comportamento padrão do formulário
    
    if (!validateForm()) { // Se a validação falhar, para a execução
      return;
    }

    setIsLoading(true); // Ativa o estado de carregamento
    console.log('[RegistrationForm] Iniciando cadastro...'); // Log de início
    
    try {
      const { error } = await signUp(form.email, form.password, form.name); // Chama a função signUp do useAuthActions
      
      if (error) {
        console.error('[RegistrationForm] Erro retornado pelo useAuth:', error); // Loga o erro retornado
        
        let errorMessage = "Erro ao criar conta. Por favor, tente novamente."; // Mensagem padrão de erro
        
        // Tenta extrair uma mensagem mais específica do objeto de erro
        // Usamos 'error as any' para acessar propriedades que podem não estar tipadas
        if ((error as any).message) {
          const lowerCaseMessage = (error as any).message.toLowerCase();
          if (lowerCaseMessage.includes('user already registered')) {
            errorMessage = "Este email já está cadastrado. Tente fazer login.";
          } else if (lowerCaseMessage.includes('invalid email')) {
            errorMessage = "Email inválido. Verifique o formato do email.";
          } else if (lowerCaseMessage.includes('weak password') || lowerCaseMessage.includes('at least 6 characters')) {
            errorMessage = "Senha muito fraca. Use pelo menos 6 caracteres.";
          } else {
            errorMessage = (error as any).message; // Usa a mensagem exata se nenhuma das acima for um match
          }
        } else if (typeof error === 'object' && error !== null) {
          // Se 'error.message' não existir, tenta serializar o objeto para ver seu conteúdo
          errorMessage = `Erro desconhecido: ${JSON.stringify(error)}`;
        }
        
        toast({
          title: "Erro no cadastro",
          description: errorMessage,
          variant: "destructive",
        });
      } else {
        console.log('[RegistrationForm] Cadastro realizado com sucesso'); // Log de sucesso
        setSuccess(true); // Exibe a mensagem de sucesso
        toast({
          title: "Cadastro realizado com sucesso!",
          description: "Bem-vindo ao IFCoins! Você já pode fazer login.",
        });
        
        // Limpar formulário após sucesso
        setForm({
          name: '',
          email: '',
          password: '',
          confirmPassword: '',
        });
        setErrors({}); // Limpa os erros de validação
      }
    } catch (err) {
      // Captura erros inesperados que ocorreram durante a chamada de `signUp`
      console.error('[RegistrationForm] Erro inesperado no cadastro (catch):', err);
      toast({
        title: "Erro no cadastro",
        description: "Erro inesperado. Por favor, tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false); // Desativa o estado de carregamento
    }
  };

  /**
   * Atualiza o valor de um campo do formulário e limpa o erro associado.
   * @param field O nome do campo a ser atualizado.
   * @param value O novo valor do campo.
   */
  const updateField = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' })); // Limpa o erro ao digitar
    }
  };

  // Se o cadastro foi um sucesso, exibe o componente SuccessMessage
  if (success) {
    return <SuccessMessage onBackToForm={() => setSuccess(false)} />;
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-blue-600 text-white rounded-full p-4">
            <Coins className="h-8 w-8" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold text-blue-600">
          Cadastro - IFCoins
        </CardTitle>
        <CardDescription>
          Crie sua conta no sistema IFCoins
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Campo Nome */}
          <div className="space-y-2">
            <Label htmlFor="name">Nome Completo</Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => updateField('name', e.target.value)}
              placeholder="João da Silva"
              disabled={isLoading}
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.name}
              </p>
            )}
          </div>

          {/* Campo Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => updateField('email', e.target.value)}
              placeholder="seu.email@ifpr.edu.br"
              disabled={isLoading}
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.email}
              </p>
            )}
          </div>

          {/* Campo Senha */}
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              value={form.password}
              onChange={(e) => updateField('password', e.target.value)}
              placeholder="Mínimo 6 caracteres"
              disabled={isLoading}
              className={errors.password ? 'border-red-500' : ''}
            />
            {errors.password && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.password}
              </p>
            )}
          </div>

          {/* Campo Confirmar Senha */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar Senha</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={(e) => updateField('confirmPassword', e.target.value)}
              placeholder="Confirme sua senha"
              disabled={isLoading}
              className={errors.confirmPassword ? 'border-red-500' : ''}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.confirmPassword}
              </p>
            )}
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700"
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? 'Cadastrando...' : 'Cadastrar'}
          </Button>
        </form>
        
        {/* Informações sobre tipos de conta */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="text-sm text-gray-600 space-y-2">
            <h4 className="font-medium text-gray-800">Tipos de conta:</h4>
            <ul className="space-y-1 text-xs">
              <li><strong>Estudante:</strong> @estudantes.ifpr.edu.br</li>
              <li><strong>Professor:</strong> @ifpr.edu.br</li>
              <li><strong>Admin:</strong> paulocauan39@gmail.com</li>
            </ul>
            <p className="text-xs text-gray-500 mt-2">
              O tipo de conta é definido automaticamente pelo email.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
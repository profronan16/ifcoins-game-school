// src/hooks/useAuthActions.tsx
import { supabase } from '@/integrations/supabase/client'; // Importa a instância do Supabase

export function useAuthActions() {
  /**
   * Função para realizar o login de um usuário.
   * @param email O email do usuário.
   * @param password A senha do usuário.
   * @returns Um objeto contendo 'error' se houver, ou 'null' em caso de sucesso.
   */
  const signIn = async (email: string, password: string) => {
    try {
      console.log('[AuthActions] Tentando login para:', email); // Log para acompanhar o início
      
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(), // Normaliza o email
        password,
      });
      
      if (error) {
        console.error('[AuthActions] Erro no login:', error); // Loga o erro completo do Supabase
        // Adiciona um log mais amigável da mensagem do erro
        console.error('[AuthActions] Mensagem de erro de login do Supabase:', error.message);
        return { error }; // Retorna o objeto de erro
      }
      
      console.log('[AuthActions] Login realizado com sucesso!'); // Log de sucesso
      return { error: null }; // Retorna sucesso
    } catch (unexpectedError) {
      // Captura erros inesperados que não vêm diretamente do Supabase.auth.signInWithPassword
      console.error('[AuthActions] Erro inesperado no login (catch):', unexpectedError);
      return { error: unexpectedError as Error }; // Retorna o erro inesperado
    }
  };

  /**
   * Função para realizar o cadastro de um novo usuário.
   * Inclui tratamento robusto para logs de erro do Supabase.
   * @param email O email do novo usuário.
   * @param password A senha do novo usuário.
   * @param name O nome do novo usuário (para ser guardado em 'user_metadata').
   * @returns Um objeto contendo 'error' se houver, ou 'null' em caso de sucesso.
   */
  const signUp = async (email: string, password: string, name: string) => {
    try {
      console.log('[AuthActions] Tentando cadastro para:', email, 'nome:', name); // Log de início do cadastro
      
      const { error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(), // Normaliza o email
        password,
        options: {
          data: {
            name: name.trim(), // Guarda o nome como metadado do usuário
          },
        },
      });
      
      if (error) {
        // --- SEÇÃO DE LOG DE ERROS DETALHADOS DO SUPABASE ---
        console.error('----------------------------------------------------');
        console.error('[AuthActions] Erro DETALHADO do Supabase no cadastro:');
        console.error('[AuthActions] Objeto "error" completo:', error);
        console.error('[AuthActions] Mensagem do erro (error.message):', error.message);
        // Tenta acessar propriedades comuns de erro do Supabase, com fallback se não existirem
        console.error('[AuthActions] Código do erro (error.code):', (error as any).code || 'N/A'); 
        console.error('[AuthActions] Status do erro (error.status):', (error as any).status || 'N/A');
        // Stringify para ver todas as propriedades do objeto de erro, incluindo as não enumeráveis
        console.error('[AuthActions] Erro completo (JSON):', JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
        console.error('----------------------------------------------------');
        
        return { error }; // Retorna o erro para o componente que chamou
      }
      
      console.log('[AuthActions] Cadastro realizado com sucesso para:', email); // Log de sucesso
      return { error: null }; // Retorna sucesso
    } catch (unexpectedError) {
      // Captura erros inesperados, como problemas de rede ou código que não vem do Supabase
      console.error('----------------------------------------------------');
      console.error('[AuthActions] Erro INESPERADO no cadastro (catch):', unexpectedError);
      console.error('----------------------------------------------------');
      return { error: unexpectedError as Error }; // Retorna o erro inesperado
    }
  };

  /**
   * Função para realizar o logout do usuário.
   */
  const signOut = async () => {
    try {
      console.log('[AuthActions] Tentando logout...'); // Log de início do logout
      await supabase.auth.signOut();
      console.log('[AuthActions] Logout realizado com sucesso!'); // Log de sucesso
    } catch (error) {
      console.error('[AuthActions] Erro ao fazer logout:', error); // Loga qualquer erro no logout
    }
  };

  return {
    signIn,
    signUp,
    signOut
  };
}
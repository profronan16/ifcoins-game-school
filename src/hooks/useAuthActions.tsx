
import { supabase } from '@/integrations/supabase/client';

export function useAuthActions() {
  const signIn = async (email: string, password: string) => {
    try {
      console.log('Tentando login para:', email);
      
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });
      
      if (error) {
        console.error('Erro no login:', error);
        return { error };
      }
      
      return { error: null };
    } catch (error) {
      console.error('Erro inesperado no login:', error);
      return { error };
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      console.log('Tentando cadastro para:', email, 'nome:', name);
      
      const { error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: {
            name: name.trim(),
          },
        },
      });
      
      if (error) {
        console.error('Erro no cadastro:', error);
        return { error };
      }
      
      return { error: null };
    } catch (error) {
      console.error('Erro inesperado no cadastro:', error);
      return { error };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return {
    signIn,
    signUp,
    signOut
  };
}

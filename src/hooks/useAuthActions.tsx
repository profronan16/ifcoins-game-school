import { supabase } from "@/integrations/supabase/client";

function getUserTypeFromEmail(
  email: string
): "estudante" | "professor" | "desconhecido" {
  if (email.endsWith("@estudantes.ifpr.edu.br")) return "estudante";
  if (email.endsWith("@ifpr.edu.br")) return "professor";
  return "desconhecido";
}

export function useAuthActions() {
  const signUp = async (email: string, password: string, name: string) => {
    try {
      const role = getUserTypeFromEmail(email);

      if (role === "desconhecido") {
        return {
          error: { message: "Domínio de e-mail inválido para cadastro." },
        };
      }

      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: {
            name: name.trim(),
            role,
          },
        },
      });

      if (error) return { error };

      const userId = data.user?.id;
      if (!userId) {
        return { error: { message: "Usuário não foi criado corretamente." } };
      }

      const { error: dbError } = await supabase.from("profiles").insert({
        id: userId,
        name,
        email: email.trim().toLowerCase(),
        role,
        created_at: new Date().toISOString(),
      });

      if (dbError) return { error: dbError };

      return { error: null };
    } catch (err) {
      console.error("Erro inesperado no cadastro:", err);
      return { error: err };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log("Tentando login para:", email);

      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) {
        console.error("Erro no login:", error);
        return { error };
      }

      return { error: null };
    } catch (error) {
      console.error("Erro inesperado no login:", error);
      return { error };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  return {
    signUp,
    signIn,
    signOut,
  };
}

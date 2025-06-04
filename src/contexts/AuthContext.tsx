
import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/types/supabase';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, name: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  loading: boolean;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string, retryCount = 0) => {
    try {
      console.log('Fetching profile for user:', userId, 'retry:', retryCount);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('Error fetching profile:', error);
        
        // Se não encontrou o perfil e é a primeira tentativa, aguarda um pouco e tenta novamente
        if (error.code === 'PGRST116' && retryCount < 3) {
          console.log('Profile not found, retrying in 2 seconds...');
          setTimeout(() => {
            fetchProfile(userId, retryCount + 1);
          }, 2000);
          return;
        }
        return;
      }
      
      console.log('Profile fetched successfully:', data);
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      
      // Retry em caso de erro de rede
      if (retryCount < 2) {
        setTimeout(() => {
          fetchProfile(userId, retryCount + 1);
        }, 3000);
      }
    }
  };

  const refreshProfile = async () => {
    if (user?.id) {
      await fetchProfile(user.id);
    }
  };

  useEffect(() => {
    let mounted = true;

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        if (!mounted) return;
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Pequeno delay para garantir que o trigger do banco executou
          setTimeout(() => {
            if (mounted) {
              fetchProfile(session.user.id);
            }
          }, 1000);
        } else {
          setProfile(null);
        }
        
        setLoading(false);
      }
    );

    // Check for existing session
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          setLoading(false);
          return;
        }
        
        console.log('Initial session:', session?.user?.email);
        
        if (!mounted) return;
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await fetchProfile(session.user.id);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error initializing auth:', error);
        setLoading(false);
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Attempting sign in for:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });
      
      console.log('Sign in result:', { error, user: data?.user?.email });
      
      if (error) {
        console.error('Sign in error:', error);
        return { error };
      }
      
      return { error: null };
    } catch (error) {
      console.error('Unexpected sign in error:', error);
      return { error };
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      console.log('Attempting sign up for:', email, 'with name:', name);
      
      const redirectUrl = `${window.location.origin}/`;
      
      // Determinar o role baseado no email
      let role: 'student' | 'teacher' | 'admin' = 'student';
      
      const emailLower = email.trim().toLowerCase();
      
      if (emailLower.includes('@estudantes.ifpr.edu.br')) {
        role = 'student';
      } else if (emailLower.includes('@ifpr.edu.br')) {
        role = 'teacher';
      } else if (emailLower === 'paulocauan39@gmail.com') {
        role = 'admin';
      } else {
        role = 'student';
      }
      
      console.log('Determined role:', role, 'for email:', emailLower);
      
      const { data, error } = await supabase.auth.signUp({
        email: emailLower,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            name: name.trim(),
            role: role,
          },
        },
      });
      
      console.log('Sign up result:', { error, user: data?.user?.email });
      
      if (error) {
        console.error('Sign up error:', error);
        return { error };
      }
      
      // Para desenvolvimento, fazer login automático se não houver confirmação de email
      if (data?.user && !data?.user?.email_confirmed_at) {
        console.log('User created but email not confirmed, attempting auto sign in for testing...');
        
        // Pequeno delay para permitir que o trigger execute
        setTimeout(async () => {
          try {
            const { error: signInError } = await supabase.auth.signInWithPassword({
              email: emailLower,
              password,
            });
            
            if (signInError) {
              console.warn('Auto sign in failed:', signInError);
            } else {
              console.log('Auto sign in successful');
            }
          } catch (autoSignInError) {
            console.warn('Auto sign in error:', autoSignInError);
          }
        }, 2000);
      }
      
      return { error: null };
    } catch (error) {
      console.error('Unexpected sign up error:', error);
      return { error };
    }
  };

  const signOut = async () => {
    try {
      console.log('Signing out...');
      await supabase.auth.signOut();
      setProfile(null);
      setUser(null);
      setSession(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      session,
      signIn,
      signUp,
      signOut,
      loading,
      refreshProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

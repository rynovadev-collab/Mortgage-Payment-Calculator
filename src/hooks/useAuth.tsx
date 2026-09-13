import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface SubscriptionData {
  subscribed: boolean;
  product_id?: string;
  subscription_end?: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  subscriptionData: SubscriptionData | null;
  subscriptionLoading: boolean;
  checkSubscription: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData | null>(() => {
    // Initialize from localStorage if available
    try {
      const saved = localStorage.getItem('subscription_data');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [subscriptionLoading, setSubscriptionLoading] = useState(false);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('[AUTH] State change:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        
        // Only check subscription on SIGNED_IN or INITIAL_SESSION with valid session
        if (session && (event === 'SIGNED_IN' || event === 'INITIAL_SESSION')) {
          // Delay to ensure token is fully established
          setTimeout(() => {
            checkSubscription();
          }, 500);
        } else if (event === 'SIGNED_OUT') {
          // Clear subscription data immediately on signout
          setSubscriptionData({ subscribed: false });
          localStorage.removeItem('subscription_data');
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        console.log('[AUTH] Initial session found:', session.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        
        // Check subscription for existing session with delay
        setTimeout(() => {
          checkSubscription();
        }, 500);
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Auto-refresh subscription status every minute
  useEffect(() => {
    if (!session) return;

    const interval = setInterval(checkSubscription, 60000);
    return () => clearInterval(interval);
  }, [session]);

  const checkSubscription = async () => {
    // Prevent multiple simultaneous checks
    if (subscriptionLoading) return;

    setSubscriptionLoading(true);
    try {
      // Always get fresh session to avoid stale tokens
      const { data: { session: freshSession }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('[AUTH] Session error:', sessionError);
        setSubscriptionData({ subscribed: false });
        localStorage.removeItem('subscription_data');
        return;
      }
      
      if (!freshSession) {
        console.log('[AUTH] No active session, skipping subscription check');
        setSubscriptionData({ subscribed: false });
        localStorage.removeItem('subscription_data');
        return;
      }

      console.log('[AUTH] Checking subscription for:', freshSession.user?.email);
      const { data, error } = await supabase.functions.invoke('check-subscription', {
        headers: {
          Authorization: `Bearer ${freshSession.access_token}`,
        },
      });

      if (error) {
        console.error('[AUTH] Subscription check error:', error);
        // If it's an auth error, clear subscription data
        if (error.message?.includes('Auth') || error.message?.includes('authentication')) {
          setSubscriptionData({ subscribed: false });
          localStorage.removeItem('subscription_data');
        }
        throw error;
      }
      
      console.log('[AUTH] Subscription data:', data);
      setSubscriptionData(data);
      // Persist to localStorage
      localStorage.setItem('subscription_data', JSON.stringify(data));
    } catch (error) {
      console.error('[AUTH] Error in checkSubscription:', error);
      // Don't immediately remove premium access on temporary errors
      // Only set to false if we don't have existing subscription data or it's an auth error
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (!subscriptionData || !subscriptionData.subscribed || errorMessage.includes('Auth')) {
        setSubscriptionData({ subscribed: false });
        localStorage.removeItem('subscription_data');
      }
    } finally {
      setSubscriptionLoading(false);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setSubscriptionData(null);
    // Clear stored subscription data
    localStorage.removeItem('subscription_data');
  };

  const value = {
    user,
    session,
    loading,
    subscriptionData,
    subscriptionLoading,
    checkSubscription,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
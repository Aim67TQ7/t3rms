
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState('');
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setIsAuthenticated(true);
        setUserId(session.user.id);
        setUserEmail(session.user.email || '');
      } else {
        setIsAuthenticated(false);
        setUserId('');
        setUserEmail('');
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          setIsAuthenticated(true);
          setUserId(session.user.id);
          setUserEmail(session.user.email || '');
        } else {
          setIsAuthenticated(false);
          setUserId('');
          setUserEmail('');
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { isAuthenticated, userId, userEmail };
};


import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ensureUserProfile } from "@/integrations/supabase/client";

const AuthCallback = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const handleAuthRedirect = async () => {
      try {
        console.log("Auth callback handling redirect", { hash: location.hash, search: location.search });
        
        // Get the auth code from the URL
        const hashParams = new URLSearchParams(location.hash.substring(1));
        
        if (hashParams.get('access_token') || location.hash || location.search) {
          // Supabase auth should automatically handle the callback
          // We just need to check if session exists
          const { data: { session }, error } = await supabase.auth.getSession();
          
          if (error) {
            throw error;
          }

          if (session) {
            // Ensure user profile exists in our database
            if (session.user.email) {
              await ensureUserProfile(session.user.id, session.user.email);
            }
            
            toast({
              title: "Login Successful",
              description: "You've successfully signed in",
            });
            navigate('/analyzer');
          } else {
            navigate('/auth', { 
              state: { error: "Authentication failed. Please try again." } 
            });
          }
        } else {
          // No auth parameters found, redirect to login
          navigate('/auth');
        }
      } catch (error: any) {
        console.error('Error during authentication callback:', error);
        toast({
          title: "Authentication Error",
          description: error.message || "Failed to complete authentication",
          variant: "destructive",
        });
        navigate('/auth');
      } finally {
        setLoading(false);
      }
    };

    handleAuthRedirect();
  }, [location, navigate, toast]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Processing your sign-in...</h1>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
      </div>
    </div>
  );
};

export default AuthCallback;

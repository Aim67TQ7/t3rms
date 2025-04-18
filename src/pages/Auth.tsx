
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from "@/components/navbar/useAuth";
import { Separator } from "@/components/ui/separator";

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // Check for error state from redirect
    if (location.state && location.state.error) {
      toast({
        title: "Authentication Error",
        description: location.state.error,
        variant: "destructive",
      });
      // Clear the error state
      window.history.replaceState({}, document.title);
    }
    
    if (isAuthenticated) {
      navigate('/analyzer');
    }
  }, [isAuthenticated, navigate, location.state, toast]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        toast({
          title: "Login Successful",
          description: "Welcome back!",
        });

        navigate('/analyzer');
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) throw error;

        toast({
          title: "Account Created",
          description: "Please check your email to verify your account.",
        });

        navigate('/analyzer');
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) throw error;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{isLogin ? 'Login' : 'Sign Up'}</CardTitle>
          <CardDescription>
            {isLogin 
              ? 'Log in to your T3RMS account' 
              : 'Create a new T3RMS account'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAuth} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading 
                ? (isLogin ? 'Logging in...' : 'Signing up...') 
                : (isLogin ? 'Login' : 'Sign Up')}
            </Button>
            <div className="text-center">
              <Button 
                type="button"
                variant="link"
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin 
                  ? 'Need an account? Sign Up' 
                  : 'Already have an account? Login'}
              </Button>
            </div>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <Separator />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <Button 
            variant="outline" 
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-2 bg-white border-gray-300 hover:bg-gray-50 text-gray-600 hover:text-gray-800 transition-colors duration-200"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              className="mr-2"
            >
              <path 
                fill="#4285F4" 
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.75h3.57c2.08-1.92 3.28-4.74 3.28-8.07z"
              />
              <path 
                fill="#34A853" 
                d="M12 23c2.97 0 5.46-1 7.28-2.69l-3.57-2.75c-.99.69-2.26 1.1-3.71 1.1-2.87 0-5.3-1.93-6.18-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path 
                fill="#FBBC05" 
                d="M5.82 14.13c-.26-.78-.4-1.61-.4-2.46 0-.85.14-1.68.4-2.46V6.87H2.18c-.6 1.22-.91 2.58-.91 4c0 1.42.31 2.78.91 4l3.64-2.74z"
              />
              <path 
                fill="#EA4335" 
                d="M12 5.38c1.62 0 3.08.56 4.23 1.64l3.18-3.18C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 6.87l3.64 2.74c.88-2.6 3.3-4.53 6.18-4.53z"
              />
            </svg>
            Continue with Google
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;

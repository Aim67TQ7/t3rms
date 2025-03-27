
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { AlertCircle, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase, ensureUserProfile } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import PasswordInput from './PasswordInput';

interface LoginTabProps {
  email: string;
  setEmail: (email: string) => void;
  onForgotPassword: () => void;
  onNoAccount: () => void;
}

const LoginTab = ({ email, setEmail, onForgotPassword, onNoAccount }: LoginTabProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!email || !password) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          // Check if user exists but password is wrong
          // We can't use the admin.listUsers function from the client
          // Instead, let's just handle the error directly
          setError('The password you entered is incorrect or the account does not exist.');
          toast({
            title: "Login failed",
            description: "Incorrect email or password. Please try again or create an account.",
            variant: "destructive"
          });
        } else {
          throw error;
        }
      } else if (data.user) {
        await ensureUserProfile(data.user.id, data.user.email || '');
        
        toast({
          title: 'Signed in successfully',
          description: "Welcome back to T3RMS!",
        });
        
        navigate('/analyzer');
      }
    } catch (error: any) {
      setError(error.message || 'Error signing in');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <CardContent className="space-y-4">
        {error && (
          <div className="bg-red-50 text-t3rms-danger p-3 rounded-md flex items-start gap-2 text-sm">
            <AlertCircle className="h-4 w-4 mt-0.5" />
            <div className="flex-1">
              <span>{error}</span>
              {error.includes('not registered') && (
                <Button 
                  type="button" 
                  variant="link" 
                  className="text-t3rms-blue p-0 h-auto text-sm" 
                  onClick={onNoAccount}
                >
                  Create an account instead
                </Button>
              )}
            </div>
          </div>
        )}
        
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <button
              type="button"
              onClick={onForgotPassword}
              className="text-sm text-t3rms-blue hover:underline"
            >
              Forgot password?
            </button>
          </div>
          <PasswordInput
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          type="submit" 
          className="w-full bg-t3rms-blue hover:bg-t3rms-blue/90"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Signing in...
            </span>
          ) : (
            <span className="flex items-center">
              Sign In <ArrowRight className="ml-2 h-4 w-4" />
            </span>
          )}
        </Button>
      </CardFooter>
    </form>
  );
};

export default LoginTab;

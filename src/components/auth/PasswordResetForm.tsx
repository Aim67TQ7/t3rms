
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { AlertCircle, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import PasswordInput from './PasswordInput';

interface PasswordResetFormProps {
  email: string;
  setEmail: (email: string) => void;
  onCancel: () => void;
}

const PasswordResetForm = ({ email, setEmail, onCancel }: PasswordResetFormProps) => {
  const { toast } = useToast();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSuccessful, setIsSuccessful] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!email) {
      setError('Please enter your email address');
      setIsLoading(false);
      return;
    }

    if (!password || !confirmPassword) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setIsLoading(false);
      return;
    }

    try {
      // For prototype only: directly update the password without email verification
      // Note: In a real app, you would use supabase.auth.resetPasswordForEmail() instead
      // This is a simplified flow for the prototype
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) throw error;
      
      setIsSuccessful(true);
      toast({
        title: 'Password reset successful',
        description: 'Your password has been updated successfully',
      });
    } catch (error: any) {
      // For the prototype, since the user might not be logged in, we'll show a friendly message
      setError('For this prototype, please sign in first to reset your password');
      toast({
        title: 'Password reset',
        description: 'For this prototype, please sign in first with your current password to reset it',
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-gray-200 max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <button 
          type="button" 
          onClick={onCancel}
          className="flex items-center text-sm text-t3rms-blue hover:underline mb-2"
        >
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to login
        </button>
        <CardTitle className="text-2xl font-bold text-center">
          Reset your password
        </CardTitle>
        <CardDescription className="text-center">
          Enter your email and new password
        </CardDescription>
      </CardHeader>

      {isSuccessful ? (
        <CardContent className="space-y-4 text-center py-8">
          <div className="flex justify-center mb-4">
            <CheckCircle2 className="h-16 w-16 text-green-500" />
          </div>
          <h3 className="text-xl font-semibold">Password Reset Successful</h3>
          <p className="text-gray-600">Your password has been updated successfully.</p>
          <Button 
            onClick={onCancel} 
            className="mt-4 bg-t3rms-blue hover:bg-t3rms-blue/90"
          >
            Return to Login
          </Button>
        </CardContent>
      ) : (
        <form onSubmit={handleReset}>
          <CardContent className="space-y-4">
            {error && (
              <div className="bg-red-50 text-t3rms-danger p-3 rounded-md flex items-start gap-2 text-sm">
                <AlertCircle className="h-4 w-4 mt-0.5" />
                <span>{error}</span>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="reset-email">Email</Label>
              <Input
                id="reset-email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <PasswordInput
                id="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <PasswordInput
                id="confirm-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
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
                  Resetting...
                </span>
              ) : (
                <span>Reset Password</span>
              )}
            </Button>
          </CardFooter>
        </form>
      )}
    </Card>
  );
};

export default PasswordResetForm;

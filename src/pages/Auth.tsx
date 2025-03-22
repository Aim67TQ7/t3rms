
import { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { ChevronLeft, ArrowRight, Key, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const Auth = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check for existing session
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        navigate('/analyzer');
      }
    };
    
    checkSession();
  
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get('signup') === 'true') {
      setActiveTab('signup');
    }
  }, [location, navigate]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!email || !password) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    if (activeTab === 'signup') {
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) throw error;
        
        toast({
          title: 'Account created successfully',
          description: "Welcome to T3RMS!",
        });
        
        navigate('/analyzer');
      } catch (error) {
        setError(error.message || 'An error occurred during sign up');
      } finally {
        setIsLoading(false);
      }
    } else {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        
        toast({
          title: 'Signed in successfully',
          description: "Welcome back to T3RMS!",
        });
        
        navigate('/analyzer');
      } catch (error) {
        setError(error.message || 'Invalid email or password');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handlePasswordReset = async () => {
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth`,
      });
      
      if (error) throw error;
      
      toast({
        title: 'Password reset email sent',
        description: `Check ${email} for reset instructions`,
      });
    } catch (error) {
      setError(error.message || 'Failed to send reset email');
    }
  };

  return (
    <div className="min-h-screen flex flex-col page-transition">
      <Navbar />
      
      <main className="flex-grow pt-20">
        <div className="container mx-auto px-4 md:px-6 py-12">
          <div className="max-w-md mx-auto">
            <Link to="/" className="inline-flex items-center text-t3rms-blue mb-8 hover:underline">
              <ChevronLeft className="h-4 w-4 mr-1" /> Back to home
            </Link>
            
            <Card className="border-gray-200">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold text-center">
                  {activeTab === 'login' ? 'Sign in to your account' : 'Create a new account'}
                </CardTitle>
                <CardDescription className="text-center">
                  {activeTab === 'login'
                    ? 'Enter your email and password to access your account'
                    : 'Fill in the form below to create your T3RMS account'}
                </CardDescription>
              </CardHeader>
              
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="login">Sign In</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>
                
                <form onSubmit={handleSubmit}>
                  <TabsContent value="login" className="space-y-4">
                    <CardContent className="space-y-4">
                      {error && (
                        <div className="bg-red-50 text-t3rms-danger p-3 rounded-md flex items-start gap-2 text-sm">
                          <AlertCircle className="h-4 w-4 mt-0.5" />
                          <span>{error}</span>
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
                            onClick={handlePasswordReset}
                            className="text-sm text-t3rms-blue hover:underline"
                          >
                            Forgot password?
                          </button>
                        </div>
                        <Input
                          id="password"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
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
                  </TabsContent>
                  
                  <TabsContent value="signup" className="space-y-4">
                    <CardContent className="space-y-4">
                      {error && (
                        <div className="bg-red-50 text-t3rms-danger p-3 rounded-md flex items-start gap-2 text-sm">
                          <AlertCircle className="h-4 w-4 mt-0.5" />
                          <span>{error}</span>
                        </div>
                      )}
                      
                      <div className="space-y-2">
                        <Label htmlFor="signup-email">Email</Label>
                        <Input
                          id="signup-email"
                          type="email"
                          placeholder="your@email.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-password">Password</Label>
                        <Input
                          id="signup-password"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirm Password</Label>
                        <Input
                          id="confirm-password"
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
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
                            Creating account...
                          </span>
                        ) : (
                          <span className="flex items-center">
                            Create Account <ArrowRight className="ml-2 h-4 w-4" />
                          </span>
                        )}
                      </Button>
                    </CardFooter>
                  </TabsContent>
                </form>
              </Tabs>
            </Card>
            
            <div className="mt-8 text-center">
              <div className="flex items-center justify-center gap-2 text-gray-500 text-sm">
                <Key className="h-3.5 w-3.5" />
                <span>Secure, encrypted connection</span>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Auth;

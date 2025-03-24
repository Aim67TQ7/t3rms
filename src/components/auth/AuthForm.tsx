
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Key } from 'lucide-react';
import LoginTab from './LoginTab';
import SignupTab from './SignupTab';

const AuthForm = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('login');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get('signup') === 'true') {
      setActiveTab('signup');
    }
  }, [location]);

  return (
    <div className="max-w-md mx-auto">
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
          
          <TabsContent value="login">
            <LoginTab email={email} setEmail={setEmail} />
          </TabsContent>
          
          <TabsContent value="signup">
            <SignupTab email={email} setEmail={setEmail} />
          </TabsContent>
        </Tabs>
      </Card>
      
      <div className="mt-8 text-center">
        <div className="flex items-center justify-center gap-2 text-gray-500 text-sm">
          <Key className="h-3.5 w-3.5" />
          <span>Secure, encrypted connection</span>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;

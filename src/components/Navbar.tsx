
import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, User } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useQuery } from '@tanstack/react-query';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userId, setUserId] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: userData } = useQuery({
    queryKey: ['t3rmsUser'],
    queryFn: async () => {
      if (!isAuthenticated) return null;
      
      const { data, error } = await supabase
        .from('t3rms_users')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (error) {
        console.error('Error fetching user data:', error);
        return null;
      }
      
      return data;
    },
    enabled: isAuthenticated
  });

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account",
      });
      
      navigate('/');
    } catch (error) {
      toast({
        title: "Error logging out",
        description: "There was a problem signing you out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getUserInitials = () => {
    if (!userEmail) return '?';
    
    const emailParts = userEmail.split('@')[0].split(/[._-]/);
    if (emailParts.length === 1) {
      return emailParts[0].substring(0, 2).toUpperCase();
    }
    
    return (emailParts[0].charAt(0) + emailParts[1].charAt(0)).toUpperCase();
  };

  const getUsageDisplay = () => {
    if (!userData) return null;
    
    const { monthly_remaining, plan } = userData;
    const total = plan === 'free' ? 3 : 100;
    
    return `${monthly_remaining}/${total}`;
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'py-3 glass shadow-sm' 
          : 'py-5 bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img 
              src="/lovable-uploads/2e8ffa28-00d1-4287-9fe1-a54833cda74f.png" 
              alt="T3RMS Logo" 
              className="h-20 w-auto" 
            />
          </Link>

          <div className="hidden md:flex items-center space-x-1">
            <Link
              to="/"
              className={`px-4 py-2 rounded-md transition-colors ${
                location.pathname === '/' 
                  ? 'text-t3rms-charcoal font-medium' 
                  : 'text-gray-600 hover:text-t3rms-charcoal'
              }`}
            >
              Home
            </Link>
            {isAuthenticated && (
              <>
                <Link
                  to="/analyzer"
                  className={`px-4 py-2 rounded-md transition-colors ${
                    location.pathname === '/analyzer' 
                      ? 'text-t3rms-charcoal font-medium' 
                      : 'text-gray-600 hover:text-t3rms-charcoal'
                  }`}
                >
                  Analyzer
                </Link>
                <Link
                  to="/pricing"
                  className={`px-4 py-2 rounded-md transition-colors ${
                    location.pathname === '/pricing' 
                      ? 'text-t3rms-charcoal font-medium' 
                      : 'text-gray-600 hover:text-t3rms-charcoal'
                  }`}
                >
                  Pricing
                </Link>
              </>
            )}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                {userData && (
                  <Badge 
                    variant="outline" 
                    className="bg-t3rms-lightblue/30 text-t3rms-blue border-t3rms-blue/20 py-1 px-3"
                  >
                    {getUsageDisplay()} analyses remaining
                  </Badge>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="rounded-full p-0 w-9 h-9 overflow-hidden">
                      <Avatar>
                        <AvatarFallback className="bg-t3rms-blue text-white text-sm">
                          {getUserInitials()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <div className="px-2 py-1.5 text-sm font-medium text-gray-700 border-b border-gray-100 mb-1">
                      {userEmail}
                    </div>
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-t3rms-danger">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <>
                <Link to="/auth">
                  <Button variant="outline" size="sm" className="rounded-full px-4">
                    Sign In
                  </Button>
                </Link>
                <Link to="/auth?signup=true">
                  <Button size="sm" className="rounded-full px-4 bg-t3rms-blue hover:bg-t3rms-blue/90">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>

          <button
            className="md:hidden p-2 focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Menu"
          >
            {isOpen ? (
              <X className="h-6 w-6 text-t3rms-charcoal" />
            ) : (
              <Menu className="h-6 w-6 text-t3rms-charcoal" />
            )}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden pt-4 pb-2 animate-fade-in">
            <div className="flex flex-col space-y-2">
              <Link
                to="/"
                className={`px-4 py-3 rounded-md ${
                  location.pathname === '/' 
                    ? 'bg-t3rms-lightblue/30 text-t3rms-charcoal font-medium' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Home
              </Link>
              {isAuthenticated ? (
                <>
                  <Link
                    to="/analyzer"
                    className={`px-4 py-3 rounded-md ${
                      location.pathname === '/analyzer' 
                        ? 'bg-t3rms-lightblue/30 text-t3rms-charcoal font-medium' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    Analyzer
                  </Link>
                  <Link
                    to="/pricing"
                    className={`px-4 py-3 rounded-md ${
                      location.pathname === '/pricing' 
                        ? 'bg-t3rms-lightblue/30 text-t3rms-charcoal font-medium' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    Pricing
                  </Link>
                  {userData && (
                    <div className="px-4 py-2 mb-2">
                      <Badge 
                        variant="outline" 
                        className="bg-t3rms-lightblue/30 text-t3rms-blue border-t3rms-blue/20 py-1 px-2 w-full text-center"
                      >
                        {getUsageDisplay()} analyses remaining
                      </Badge>
                    </div>
                  )}
                  <div className="px-4 py-3 flex items-center justify-between bg-gray-50 rounded-md">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-7 w-7">
                        <AvatarFallback className="bg-t3rms-blue text-white text-xs">
                          {getUserInitials()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-gray-700 font-medium truncate max-w-[140px]">{userEmail}</span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={handleLogout}
                      className="text-t3rms-danger hover:text-t3rms-danger/90 hover:bg-red-50 p-1 h-auto"
                    >
                      <LogOut size={16} />
                    </Button>
                  </div>
                </>
              ) : (
                <div className="pt-2 flex flex-col space-y-2">
                  <Link to="/auth" className="w-full">
                    <Button variant="outline" className="w-full rounded-md">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/auth?signup=true" className="w-full">
                    <Button className="w-full rounded-md bg-t3rms-blue hover:bg-t3rms-blue/90">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

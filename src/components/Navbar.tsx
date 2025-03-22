import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, User } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userId, setUserId] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

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

  // Check auth state on component mount
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

    // Set up auth state listener
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

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Close mobile menu when changing routes
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
      
      // Redirect to home page
      navigate('/');
    } catch (error) {
      toast({
        title: "Error logging out",
        description: "There was a problem signing you out. Please try again.",
        variant: "destructive",
      });
    }
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
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="font-mono text-lg md:text-xl font-bold text-t3rms-charcoal">
              T<span className="text-red-500">3</span>RMS
            </span>
          </Link>

          {/* Desktop Navigation */}
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

          {/* Auth Buttons or User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="rounded-full gap-2">
                    <User size={14} />
                    <span className="text-xs font-mono">{userEmail || userId.substring(0, 8)}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-t3rms-danger">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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

          {/* Mobile Menu Button */}
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

        {/* Mobile Menu */}
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
                  <div className="px-4 py-3 flex items-center justify-between bg-gray-50 rounded-md">
                    <div className="flex items-center gap-2">
                      <User size={14} />
                      <span className="text-xs font-mono">{userEmail || userId.substring(0, 8)}</span>
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

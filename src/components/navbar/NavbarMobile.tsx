
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { MobileNavLinks } from './MobileNavLinks';
import { getUserInitials, getUsageDisplay } from './utils';

interface NavbarMobileProps {
  isAuthenticated: boolean;
  userData: any;
  userEmail: string;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const NavbarMobile = ({
  isAuthenticated,
  userData,
  userEmail,
  isOpen,
  setIsOpen
}: NavbarMobileProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

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

  return (
    <>
      <button
        className="md:hidden p-2 focus:outline-none absolute right-4 top-4"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Menu"
      >
        {isOpen ? (
          <X className="h-6 w-6 text-t3rms-charcoal" />
        ) : (
          <Menu className="h-6 w-6 text-t3rms-charcoal" />
        )}
      </button>

      {isOpen && (
        <div className="md:hidden pt-4 pb-2 animate-fade-in">
          <div className="flex flex-col space-y-2">
            <MobileNavLinks isAuthenticated={isAuthenticated} />
            
            {isAuthenticated ? (
              <>
                {userData && (
                  <div className="px-4 py-2 mb-2">
                    <Badge 
                      variant="outline" 
                      className="bg-t3rms-lightblue/30 text-t3rms-blue border-t3rms-blue/20 py-1 px-2 w-full text-center"
                    >
                      {getUsageDisplay(userData)} analyses remaining
                    </Badge>
                  </div>
                )}
                <div className="px-4 py-3 flex items-center justify-between bg-gray-50 rounded-md">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-7 w-7">
                      <AvatarFallback className="bg-t3rms-blue text-white text-xs">
                        {getUserInitials(userEmail)}
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
    </>
  );
};

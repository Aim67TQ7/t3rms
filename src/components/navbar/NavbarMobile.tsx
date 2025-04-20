
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { Menu, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import MobileNavLinks from './MobileNavLinks';
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
          <X className="h-6 w-6 text-purple-400" />
        ) : (
          <Menu className="h-6 w-6 text-purple-400" />
        )}
      </button>

      {isOpen && (
        <div className="md:hidden pt-4 pb-2 animate-fade-in bg-[#0a0a0a]/95 backdrop-blur-md rounded-lg mt-4 border border-purple-500/20">
          <div className="flex flex-col space-y-2">
            <MobileNavLinks onClose={() => setIsOpen(false)} />
            
            {isAuthenticated ? (
              <>
                {userData && (
                  <div className="px-4 py-2 mb-2">
                    <Badge 
                      variant="outline" 
                      className="bg-purple-900/30 text-purple-400 border-purple-500/50 py-1 px-2 w-full text-center"
                    >
                      {getUsageDisplay(userData)} credits
                    </Badge>
                  </div>
                )}
                <div className="px-4 py-3 flex items-center justify-between bg-purple-900/30 rounded-md mx-2">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-7 w-7">
                      <AvatarFallback className="bg-purple-600 text-white text-xs">
                        {getUserInitials(userEmail)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-purple-400 font-medium truncate max-w-[140px]">{userEmail}</span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleLogout}
                    className="text-red-400 hover:text-red-300 hover:bg-red-900/30 p-1 h-auto"
                  >
                    <LogOut size={16} />
                  </Button>
                </div>
              </>
            ) : (
              <div className="px-4 py-2">
                <Button 
                  variant="default" 
                  size="sm" 
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                  onClick={() => navigate('/auth')}
                >
                  Login / Sign Up
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

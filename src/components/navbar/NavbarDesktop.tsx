
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from './Logo';
import { NavLinks } from './NavLinks';
import { getUserInitials, getUsageDisplay } from './utils';

interface NavbarDesktopProps {
  isAuthenticated: boolean;
  userData: any;
  userEmail: string;
}

export const NavbarDesktop = ({ isAuthenticated, userData, userEmail }: NavbarDesktopProps) => {
  const location = useLocation();
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
    <div className="flex items-center justify-between">
      <Logo />

      <div className="hidden md:flex items-center space-x-1">
        <NavLinks isAuthenticated={isAuthenticated} />
      </div>

      <div className="hidden md:flex items-center space-x-4">
        {isAuthenticated ? (
          <div className="flex items-center gap-3">
            {userData && (
              <Badge 
                variant="outline" 
                className="bg-t3rms-lightblue/30 text-t3rms-blue border-t3rms-blue/20 py-1 px-3"
              >
                {getUsageDisplay(userData)} analyses remaining
              </Badge>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="rounded-full p-0 w-9 h-9 overflow-hidden">
                  <Avatar>
                    <AvatarFallback className="bg-t3rms-blue text-white text-sm">
                      {getUserInitials(userEmail)}
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
    </div>
  );
};

import { useAuth } from "./useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { LogOut } from "lucide-react";

const NavLinks = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="hidden md:flex items-center space-x-1">
      <Link
        to="/"
        className={cn(
          "py-2 px-3 text-sm font-medium rounded-md transition-colors",
          isActive("/")
            ? "bg-purple-900/30 text-purple-400"
            : "text-gray-300 hover:bg-purple-900/30 hover:text-purple-400"
        )}
      >
        Home
      </Link>
      <Link
        to="/term-analysis"
        className={cn(
          "py-2 px-3 text-sm font-medium rounded-md transition-colors",
          isActive("/term-analysis")
            ? "bg-purple-900/30 text-purple-400"
            : "text-gray-300 hover:bg-purple-900/30 hover:text-purple-400"
        )}
      >
        Advanced Analysis
      </Link>
      <Link
        to="/tcgenerator"
        className={cn(
          "py-2 px-3 text-sm font-medium rounded-md transition-colors",
          isActive("/tcgenerator")
            ? "bg-purple-900/30 text-purple-400"
            : "text-gray-300 hover:bg-purple-900/30 hover:text-purple-400"
        )}
      >
        Create Terms
      </Link>
      <Link
        to="/pricing"
        className={cn(
          "py-2 px-3 text-sm font-medium rounded-md transition-colors",
          isActive("/pricing")
            ? "bg-purple-900/30 text-purple-400"
            : "text-gray-300 hover:bg-purple-900/30 hover:text-purple-400"
        )}
      >
        Pricing
      </Link>
      
      {isAuthenticated && (
        <button
          onClick={handleSignOut}
          className="py-2 px-3 text-sm font-medium rounded-md text-red-400 hover:bg-red-900/30 hover:text-red-300 flex items-center transition-colors"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </button>
      )}
    </div>
  );
};

export default NavLinks;

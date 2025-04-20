
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
          "py-2 px-3 text-sm font-medium rounded-md",
          isActive("/")
            ? "bg-blue-100 text-blue-900"
            : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
        )}
      >
        Home
      </Link>
      <Link
        to="/analyzer"
        className={cn(
          "py-2 px-3 text-sm font-medium rounded-md",
          isActive("/analyzer")
            ? "bg-blue-100 text-blue-900"
            : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
        )}
      >
        Simple Analysis
      </Link>
      <Link
        to="/term-analysis"
        className={cn(
          "py-2 px-3 text-sm font-medium rounded-md",
          isActive("/term-analysis")
            ? "bg-blue-100 text-blue-900"
            : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
        )}
      >
        Advanced Analysis
      </Link>
      <Link
        to="/tcgenerator"
        className={cn(
          "py-2 px-3 text-sm font-medium rounded-md",
          isActive("/tcgenerator")
            ? "bg-blue-100 text-blue-900"
            : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
        )}
      >
        Create Terms
      </Link>
      <Link
        to="/pricing"
        className={cn(
          "py-2 px-3 text-sm font-medium rounded-md",
          isActive("/pricing")
            ? "bg-blue-100 text-blue-900"
            : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
        )}
      >
        Pricing
      </Link>
      
      {isAuthenticated && (
        <button
          onClick={handleSignOut}
          className="py-2 px-3 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100 hover:text-gray-900 flex items-center"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </button>
      )}
    </div>
  );
};

export default NavLinks;

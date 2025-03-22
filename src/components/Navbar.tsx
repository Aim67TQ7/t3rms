
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

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

  // Close mobile menu when changing routes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

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
              T3<span className="text-t3rms-blue">RMS</span>
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
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
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
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

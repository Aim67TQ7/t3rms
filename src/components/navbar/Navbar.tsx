
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from '@tanstack/react-query';
import { NavbarMobile } from './NavbarMobile';
import { NavbarDesktop } from './NavbarDesktop';
import { useAuth } from './useAuth';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, userId, userEmail } = useAuth();

  const { data: userData } = useQuery({
    queryKey: ['t3rmsUser'],
    queryFn: async () => {
      if (!isAuthenticated) return null;
      
      const { data, error } = await supabase
        .from('users')  // Changed from 't3rms_users'
        .select('*')
        .eq('id', userId)
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
        {/* Desktop Navigation */}
        <NavbarDesktop 
          isAuthenticated={isAuthenticated}
          userData={userData}
          userEmail={userEmail}
        />

        {/* Mobile Navigation */}
        <NavbarMobile
          isAuthenticated={isAuthenticated}
          userData={userData}
          userEmail={userEmail}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
        />
      </div>
    </nav>
  );
};

export default Navbar;

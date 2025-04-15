
import { Link, useLocation } from 'react-router-dom';

interface NavLinksProps {
  isAuthenticated: boolean;
}

export const NavLinks = ({ isAuthenticated }: NavLinksProps) => {
  const location = useLocation();

  return (
    <>
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
            to="/tcgenerator"
            className={`px-4 py-2 rounded-md transition-colors ${
              location.pathname === '/tcgenerator' 
                ? 'text-t3rms-charcoal font-medium' 
                : 'text-gray-600 hover:text-t3rms-charcoal'
            }`}
          >
            Create T3RMS
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
    </>
  );
};

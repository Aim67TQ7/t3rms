
import { Link, useLocation } from 'react-router-dom';

interface MobileNavLinksProps {
  isAuthenticated: boolean;
}

export const MobileNavLinks = ({ isAuthenticated }: MobileNavLinksProps) => {
  const location = useLocation();

  return (
    <>
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
      {isAuthenticated && (
        <>
          <Link
            to="/analyzer"
            className={`px-4 py-3 rounded-md ${
              location.pathname === '/analyzer' 
                ? 'bg-t3rms-lightblue/30 text-t3rms-charcoal font-medium' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Analyze T3RMS
          </Link>
          <Link
            to="/tcgenerator"
            className={`px-4 py-3 rounded-md ${
              location.pathname === '/tcgenerator' 
                ? 'bg-t3rms-lightblue/30 text-t3rms-charcoal font-medium' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Create T3RMS
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
        </>
      )}
    </>
  );
};

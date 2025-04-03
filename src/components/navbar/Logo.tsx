
import { Link } from 'react-router-dom';

export const Logo = () => {
  return (
    <Link to="/" className="flex items-center gap-2">
      <img 
        src="/lovable-uploads/2e8ffa28-00d1-4287-9fe1-a54833cda74f.png" 
        alt="T3RMS Logo" 
        className="h-20 w-auto" 
      />
    </Link>
  );
};


import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="relative overflow-hidden bg-[#f3f4f6] pt-20"> {/* Professional light bg */}
      {/* Removed background gradient/blur, now clean gray background */}

      <div className="container mx-auto px-4 md:px-6 py-12 md:py-24 relative z-10">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div 
            className={`bg-gray-100 text-gray-700 rounded-full px-4 py-1 text-sm font-medium mb-6 transition-all duration-700 border border-gray-300 shadow ${
              isVisible ? 'opacity-100' : 'opacity-0 translate-y-4'
            }`}
          >
            <span className="flex items-center">
              <ShieldCheck className="h-3.5 w-3.5 mr-1.5" /> 
              Already scanning POs for 42 manufacturers
            </span>
          </div>

          {/* Main Headline */}
          <h1 
            className={`text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 transition-all duration-700 delay-100 text-gray-900 ${
              isVisible ? 'opacity-100' : 'opacity-0 translate-y-4'
            }`}
          >
            AI-Powered Purchase-Order<br />Terms & Conditions Scanner
          </h1>

          {/* Sub-headline */}
          <h2 
            className={`text-2xl md:text-3xl text-gray-600 font-semibold mb-4 transition-all duration-700 delay-150 ${
              isVisible ? 'opacity-100' : 'opacity-0 translate-y-4'
            }`}
          >
            Analyze & Create T3RMS
          </h2>

          {/* Primary CTA */}
          <div 
            className={`flex flex-col gap-6 mb-16 transition-all duration-700 delay-300 ${
              isVisible ? 'opacity-100' : 'opacity-0 translate-y-4'
            }`}
          >
            <Link to="/term-analysis">
              <Button 
                size="lg"
                className="bg-gray-900 hover:bg-gray-800 text-white text-lg px-8 py-6 h-auto shadow transition-all duration-300 hero-button-primary"
              >
                Upload PO & Scan Free <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>

          {/* Risk Meter Preview REMOVED */}

        </div>
      </div>

      {/* Angled Bottom Edge */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gray-100 transform -skew-y-2 translate-y-8"></div>
    </div>
  );
};

export default Hero;

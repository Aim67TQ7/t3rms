
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, FileText, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="relative overflow-hidden bg-[#0a0a0a] pt-20">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-12 md:py-24 relative z-10">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div 
            className={`bg-purple-900/30 text-purple-400 rounded-full px-4 py-1 text-sm font-medium mb-6 transition-all duration-700 border border-purple-500/50 shadow-[0_0_15px_rgba(147,51,234,0.5)] ${
              isVisible ? 'opacity-100' : 'opacity-0 transform translate-y-4'
            }`}
          >
            <span className="flex items-center">
              <ShieldCheck className="h-3.5 w-3.5 mr-1.5" /> 
              Already scanning POs for 42 manufacturers
            </span>
          </div>

          {/* Main Headline (SEO Optimized) */}
          <h1 
            className={`text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 transition-all duration-700 delay-100 ${
              isVisible ? 'opacity-100' : 'opacity-0 transform translate-y-4'
            }`}
          >
            AI-Powered Purchase-Order<br />Terms & Conditions Scanner
          </h1>

          {/* Sub-headline */}
          <h2 
            className={`text-2xl md:text-3xl text-purple-400 font-semibold mb-4 transition-all duration-700 delay-150 ${
              isVisible ? 'opacity-100' : 'opacity-0 transform translate-y-4'
            }`}
          >
            Analyze & Create T3RMS
          </h2>

          {/* Primary CTA */}
          <div 
            className={`flex flex-col gap-6 mb-16 transition-all duration-700 delay-300 ${
              isVisible ? 'opacity-100' : 'opacity-0 transform translate-y-4'
            }`}
          >
            <Link to="/term-analysis">
              <Button 
                size="lg"
                className="bg-purple-600 hover:bg-purple-700 text-white text-lg px-8 py-6 h-auto shadow-[0_0_20px_rgba(147,51,234,0.5)] transition-all duration-300 hover:shadow-[0_0_30px_rgba(147,51,234,0.8)] hero-button-primary"
              >
                Upload PO & Scan Free <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>

          {/* Risk Meter Preview */}
          <div 
            className={`max-w-sm mx-auto bg-gray-900/50 p-4 rounded-xl border border-purple-500/20 transition-all duration-700 delay-400 ${
              isVisible ? 'opacity-100' : 'opacity-0 transform translate-y-4'
            }`}
          >
            <img 
              src="/risk-meter-preview.gif" 
              alt="Risk Analysis Preview" 
              className="w-full rounded-lg shadow-lg"
            />
            <p className="text-sm text-gray-400 mt-2">
              Instant risk analysis of your terms & conditions
            </p>
          </div>
        </div>
      </div>

      {/* Angled Bottom Edge */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gray-900 transform -skew-y-2 translate-y-8"></div>
    </div>
  );
};

export default Hero;

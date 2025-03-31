
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, AlertTriangle, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-white to-gray-50 pt-20">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-t3rms-blue/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-t3rms-blue/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-12 md:py-24 relative z-10">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div 
            className={`bg-t3rms-blue/10 text-t3rms-blue rounded-full px-4 py-1 text-sm font-medium mb-6 transition-all duration-700 ${
              isVisible ? 'opacity-100' : 'opacity-0 transform translate-y-4'
            }`}
          >
            <span className="flex items-center">
              <Shield className="h-3.5 w-3.5 mr-1.5" /> AI-powered contract analysis
            </span>
          </div>

          {/* Headline */}
          <h1 
            className={`text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-t3rms-charcoal mb-6 transition-all duration-700 delay-100 ${
              isVisible ? 'opacity-100' : 'opacity-0 transform translate-y-4'
            }`}
          >
            AI Reads the Fine Print,<br />{' '}
            <span className="text-t3rms-blue">So You Don't Have To</span>
          </h1>

          {/* Subheadline */}
          <p 
            className={`text-xl text-gray-600 mb-8 max-w-2xl transition-all duration-700 delay-200 ${
              isVisible ? 'opacity-100' : 'opacity-0 transform translate-y-4'
            }`}
          >
            T3RMS uses advanced AI to analyze your Terms & Conditions, highlighting potential risks and translating legal jargon into plain language.
          </p>

          {/* CTA Buttons */}
          <div 
            className={`flex flex-col sm:flex-row gap-4 mb-16 transition-all duration-700 delay-300 ${
              isVisible ? 'opacity-100' : 'opacity-0 transform translate-y-4'
            }`}
          >
            <Link to="/auth?signup=true">
              <Button className="hero-button-primary">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/pricing">
              <Button variant="outline" className="hero-button-secondary">
                View Pricing
              </Button>
            </Link>
          </div>

          {/* Features Card */}
          <div 
            className={`glass rounded-2xl border border-gray-200 p-8 max-w-4xl w-full transition-all duration-700 delay-400 ${
              isVisible ? 'opacity-100' : 'opacity-0 transform translate-y-4'
            }`}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-4">
              <div className="flex flex-col items-center text-center p-2">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <Check className="h-6 w-6 text-t3rms-success" />
                </div>
                <h3 className="text-lg font-medium text-t3rms-charcoal mb-2">Risk Detection</h3>
                <p className="text-gray-600 text-sm">Identifies potentially harmful clauses in legal documents</p>
              </div>
              
              <div className="flex flex-col items-center text-center p-2">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-t3rms-blue" />
                </div>
                <h3 className="text-lg font-medium text-t3rms-charcoal mb-2">Instant Analysis</h3>
                <p className="text-gray-600 text-sm">Analyze lengthy contracts in seconds, not hours</p>
              </div>
              
              <div className="flex flex-col items-center text-center p-2">
                <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mb-4">
                  <AlertTriangle className="h-6 w-6 text-t3rms-warning" />
                </div>
                <h3 className="text-lg font-medium text-t3rms-charcoal mb-2">Plain Language</h3>
                <p className="text-gray-600 text-sm">Translates complex legal terms into easy-to-understand language</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Angled Bottom Edge */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-white transform -skew-y-2 translate-y-8"></div>
    </div>
  );
};

export default Hero;

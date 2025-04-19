
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, FileText } from 'lucide-react';
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
              <Shield className="h-3.5 w-3.5 mr-1.5" /> AI-powered T3RMS tools
            </span>
          </div>

          {/* Headline */}
          <h1 
            className={`text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 transition-all duration-700 delay-100 ${
              isVisible ? 'opacity-100' : 'opacity-0 transform translate-y-4'
            }`}
          >
            Analyze & Create T3RMS<br />{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400 animate-pulse">With AI Precision</span>
          </h1>

          {/* Subheadline */}
          <p 
            className={`text-xl text-gray-400 mb-8 max-w-2xl transition-all duration-700 delay-200 ${
              isVisible ? 'opacity-100' : 'opacity-0 transform translate-y-4'
            }`}
          >
            Try our AI-powered analysis for free or create custom Terms & Conditions tailored to your needs.
          </p>

          {/* CTA Buttons */}
          <div 
            className={`flex flex-col sm:flex-row gap-4 mb-16 transition-all duration-700 delay-300 ${
              isVisible ? 'opacity-100' : 'opacity-0 transform translate-y-4'
            }`}
          >
            <Link to="/analyzer">
              <Button className="bg-purple-600 hover:bg-purple-700 text-white shadow-[0_0_20px_rgba(147,51,234,0.5)] transition-all duration-300 hover:shadow-[0_0_30px_rgba(147,51,234,0.8)] hero-button-primary">
                Try Analysis Free <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/tcgenerator">
              <Button variant="outline" className="border-purple-500 text-purple-400 hover:bg-purple-950/50 hero-button-secondary">
                Create T3RMS <FileText className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {/* Feature Cards */}
          <div 
            className={`grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full transition-all duration-700 delay-400 ${
              isVisible ? 'opacity-100' : 'opacity-0 transform translate-y-4'
            }`}
          >
            {/* Analysis Card */}
            <div className="bg-gray-900/50 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-8 hover:border-purple-500/40 transition-all duration-300 hover:shadow-[0_0_30px_rgba(147,51,234,0.2)]">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-purple-900/50 flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-purple-400" />
                </div>
                <h3 className="text-lg font-medium text-white mb-2">Analyze T3RMS</h3>
                <p className="text-gray-400 text-sm mb-4">Instantly analyze any Terms & Conditions document with our AI. Try 3 free analyses.</p>
                <Link to="/analyzer" className="text-purple-400 hover:text-purple-300 hover:underline text-sm">
                  Start analyzing →
                </Link>
              </div>
            </div>

            {/* Creation Card */}
            <div className="bg-gray-900/50 backdrop-blur-xl border border-blue-500/20 rounded-2xl p-8 hover:border-blue-500/40 transition-all duration-300 hover:shadow-[0_0_30px_rgba(59,130,246,0.2)]">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-blue-900/50 flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6 text-blue-400" />
                </div>
                <h3 className="text-lg font-medium text-white mb-2">Create T3RMS</h3>
                <p className="text-gray-400 text-sm mb-4">Generate custom Terms & Conditions documents tailored to your specific needs.</p>
                <Link to="/tcgenerator" className="text-blue-400 hover:text-blue-300 hover:underline text-sm">
                  Start creating →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Angled Bottom Edge */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gray-900 transform -skew-y-2 translate-y-8"></div>
    </div>
  );
};

export default Hero;


import { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, FileText, ShieldCheck, Zap } from 'lucide-react';

const Index = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col page-transition">
      <Navbar />
      
      <main className="flex-grow">
        <Hero />
        <Features />
        
        <section className="bg-gray-50 py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-t3rms-charcoal mb-4">
                How T3RMS Works
              </h2>
              <p className="text-xl text-gray-600">
                Three simple steps to analyze any Terms & Conditions document
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-t3rms-blue/10 flex items-center justify-center mb-6">
                  <FileText className="h-8 w-8 text-t3rms-blue" />
                </div>
                <span className="bg-t3rms-blue/10 text-t3rms-blue text-xs font-medium px-2.5 py-0.5 rounded-full mb-3">
                  Step 1
                </span>
                <h3 className="text-xl font-medium text-t3rms-charcoal mb-2">
                  Upload Document
                </h3>
                <p className="text-gray-600">
                  Upload any Terms & Conditions or contract document to our secure platform
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-t3rms-blue/10 flex items-center justify-center mb-6">
                  <Zap className="h-8 w-8 text-t3rms-blue" />
                </div>
                <span className="bg-t3rms-blue/10 text-t3rms-blue text-xs font-medium px-2.5 py-0.5 rounded-full mb-3">
                  Step 2
                </span>
                <h3 className="text-xl font-medium text-t3rms-charcoal mb-2">
                  AI Analysis
                </h3>
                <p className="text-gray-600">
                  Our AI engine processes the document, identifying risks and problematic clauses
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-t3rms-blue/10 flex items-center justify-center mb-6">
                  <ShieldCheck className="h-8 w-8 text-t3rms-blue" />
                </div>
                <span className="bg-t3rms-blue/10 text-t3rms-blue text-xs font-medium px-2.5 py-0.5 rounded-full mb-3">
                  Step 3
                </span>
                <h3 className="text-xl font-medium text-t3rms-charcoal mb-2">
                  Review Results
                </h3>
                <p className="text-gray-600">
                  Get a comprehensive report with highlighted risks and plain-language explanations
                </p>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-6xl mx-auto bg-gradient-to-r from-t3rms-blue/10 to-blue-100/30 rounded-2xl p-8 md:p-16">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-t3rms-charcoal mb-4">
                    Start Analyzing Your Contracts Today
                  </h2>
                  <p className="text-lg text-gray-600 mb-6">
                    Join thousands of users who save time and reduce risk with T3RMS. Try it free with three analyses per month.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
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
                </div>
                <div className="flex justify-center md:justify-end">
                  <div className="relative w-full max-w-md">
                    <div className="absolute inset-0 bg-t3rms-blue/10 rounded-xl transform rotate-3"></div>
                    <div className="glass rounded-xl p-6 relative z-10">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <span className="inline-block h-3 w-3 rounded-full bg-t3rms-danger mr-1.5"></span>
                          <span className="inline-block h-3 w-3 rounded-full bg-t3rms-warning mr-1.5"></span>
                          <span className="inline-block h-3 w-3 rounded-full bg-t3rms-success mr-1.5"></span>
                        </div>
                        <div className="text-xs text-gray-500 font-mono">T3RMS Analysis</div>
                      </div>
                      <div className="space-y-3 mb-4">
                        <div className="h-2.5 bg-gray-200 rounded-full w-3/4"></div>
                        <div className="h-2.5 bg-gray-200 rounded-full"></div>
                        <div className="h-2.5 bg-gray-200 rounded-full w-5/6"></div>
                      </div>
                      <div className="bg-red-50 border-l-4 border-t3rms-danger rounded-r-lg p-3 mb-4">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-t3rms-danger" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div className="ml-3">
                            <p className="text-sm text-t3rms-danger font-medium">Risk Detected: Data Sharing</p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-3 mb-4">
                        <div className="h-2.5 bg-gray-200 rounded-full"></div>
                        <div className="h-2.5 bg-gray-200 rounded-full w-4/5"></div>
                      </div>
                      <div className="bg-amber-50 border-l-4 border-t3rms-warning rounded-r-lg p-3">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-t3rms-warning" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div className="ml-3">
                            <p className="text-sm text-t3rms-warning font-medium">Caution: Automatic Renewal</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;

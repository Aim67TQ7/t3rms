
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Check, Building, ArrowRight, CreditCard } from 'lucide-react';

const PricingTier = ({ 
  tier, 
  price, 
  features, 
  isPopular = false, 
  buttonText, 
  buttonVariant = "default", 
  buttonLink,
  icon 
}) => {
  return (
    <Card className={`relative w-full h-full transition-all duration-300 hover:shadow-md ${
      isPopular ? 'border-t3rms-blue shadow-lg' : 'border-gray-200'
    }`}>
      {isPopular && (
        <div className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/2">
          <span className="bg-t3rms-blue text-white text-xs font-medium px-4 py-1 rounded-full shadow-sm">
            Most Popular
          </span>
        </div>
      )}
      
      <CardHeader className="pt-8 pb-4">
        <div className="mb-3 flex items-center gap-2">
          <span className="inline-block p-2 bg-t3rms-blue/10 rounded-lg text-t3rms-blue">
            {icon}
          </span>
          <h3 className="text-xl font-medium text-t3rms-charcoal">{tier}</h3>
        </div>
        <div className="mb-2">
          <span className="text-4xl font-bold text-t3rms-charcoal">{price}</span>
          {price !== 'Custom' && <span className="text-gray-500 ml-1">/month</span>}
        </div>
        <p className="text-gray-600 text-sm">
          {tier === 'Free'
            ? 'Perfect for occasional use'
            : tier === 'Pro'
              ? 'For individuals who need more analyses'
              : 'For businesses with advanced needs'
          }
        </p>
      </CardHeader>
      
      <CardContent className="py-4">
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <Check className="h-5 w-5 text-t3rms-blue mr-2 mt-0.5" />
              <span className="text-gray-600 text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      
      <CardFooter className="pt-4 pb-8">
        <Link to={buttonLink} className="w-full">
          <Button 
            variant={buttonVariant} 
            className={`w-full ${
              buttonVariant === "default" 
                ? "bg-t3rms-blue hover:bg-t3rms-blue/90" 
                : ""
            }`}
          >
            {buttonText}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

const Pricing = () => {
  const [annualBilling, setAnnualBilling] = useState(true);
  
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col page-transition">
      <Navbar />
      
      <main className="flex-grow pt-20">
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h1 className="text-4xl font-bold text-t3rms-charcoal mb-4">
                Simple, Transparent Pricing
              </h1>
              <p className="text-xl text-gray-600 mb-6">
                Choose the plan that's right for you
              </p>
              
              <div className="inline-flex items-center bg-gray-100 p-1 rounded-full">
                <button
                  onClick={() => setAnnualBilling(true)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    annualBilling 
                      ? 'bg-white text-t3rms-charcoal shadow-sm' 
                      : 'text-gray-500 hover:text-t3rms-charcoal'
                  }`}
                >
                  Annual Billing
                  {annualBilling && (
                    <span className="ml-2 text-xs font-medium text-t3rms-success">Save 20%</span>
                  )}
                </button>
                <button
                  onClick={() => setAnnualBilling(false)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    !annualBilling 
                      ? 'bg-white text-t3rms-charcoal shadow-sm' 
                      : 'text-gray-500 hover:text-t3rms-charcoal'
                  }`}
                >
                  Monthly Billing
                </button>
              </div>
            </div>
            
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
              <PricingTier
                tier="Free"
                price="$0"
                features={[
                  "3 analyses per month",
                  "Basic risk detection",
                  "Manual document upload",
                  "Standard response time",
                  "Community support"
                ]}
                buttonText="Get Started"
                buttonVariant="outline"
                buttonLink="/auth?signup=true"
                icon={<Check className="h-5 w-5" />}
              />
              
              <PricingTier
                tier="Pro"
                price={annualBilling ? "$9.60" : "$12"}
                isPopular={true}
                features={[
                  "100 analyses per month",
                  "Advanced risk detection",
                  "Document chunking",
                  "Priority response time",
                  "Email support",
                  "Export results as PDF",
                  "Analysis history"
                ]}
                buttonText="Subscribe Now"
                buttonLink="/auth?signup=true"
                icon={<CreditCard className="h-5 w-5" />}
              />
              
              <PricingTier
                tier="Enterprise"
                price="Custom"
                features={[
                  "Unlimited analyses",
                  "Local deployment option",
                  "Custom integrations",
                  "Dedicated account manager",
                  "SLA guarantees",
                  "API access",
                  "Team management",
                  "Custom reporting"
                ]}
                buttonText="Contact Sales"
                buttonVariant="outline"
                buttonLink="#contact"
                icon={<Building className="h-5 w-5" />}
              />
            </div>
          </div>
        </section>
        
        {/* FAQ Section */}
        <section className="py-16 bg-gray-50 border-t border-gray-100">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-t3rms-charcoal mb-8 text-center">
                Frequently Asked Questions
              </h2>
              
              <div className="space-y-6">
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h3 className="text-lg font-medium text-t3rms-charcoal mb-2">
                    How accurate is the AI analysis?
                  </h3>
                  <p className="text-gray-600">
                    T3RMS uses state-of-the-art AI models to provide highly accurate analyses. However, while our system can identify most potential issues, it should be used as a tool to assist your review, not replace legal counsel for critical documents.
                  </p>
                </div>
                
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h3 className="text-lg font-medium text-t3rms-charcoal mb-2">
                    How do you handle my data?
                  </h3>
                  <p className="text-gray-600">
                    We take data security seriously. Documents are processed in memory and not permanently stored. All data is encrypted in transit and we adhere to strict privacy standards. For Enterprise customers, we offer local deployment options for maximum data control.
                  </p>
                </div>
                
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h3 className="text-lg font-medium text-t3rms-charcoal mb-2">
                    Can I upgrade or downgrade my plan?
                  </h3>
                  <p className="text-gray-600">
                    Yes, you can change your plan at any time. Upgrades take effect immediately, while downgrades will apply at the end of your current billing cycle. Unused analyses do not roll over to the next month.
                  </p>
                </div>
                
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h3 className="text-lg font-medium text-t3rms-charcoal mb-2">
                    What file formats are supported?
                  </h3>
                  <p className="text-gray-600">
                    T3RMS supports PDF, DOCX, TXT, and RTF formats. We also support direct text input if you want to paste content directly. For other formats, please convert them before uploading.
                  </p>
                </div>
                
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h3 className="text-lg font-medium text-t3rms-charcoal mb-2">
                    Is there a limit to document size?
                  </h3>
                  <p className="text-gray-600">
                    Free tier users can analyze documents up to 10 pages. Pro users can analyze documents up to 50 pages, and Enterprise users have no page limits. Our document chunking technology efficiently handles large documents.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section id="contact" className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-4xl mx-auto bg-gradient-to-r from-t3rms-blue/10 to-blue-100/30 rounded-2xl p-8 md:p-12">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-t3rms-charcoal mb-4">
                  Ready to get started?
                </h2>
                <p className="text-lg text-gray-600">
                  Join thousands of users who trust T3RMS to analyze their contracts
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link to="/auth?signup=true">
                  <Button size="lg" className="hero-button-primary">
                    Create Free Account
                  </Button>
                </Link>
                <a href="mailto:sales@t3rms.com">
                  <Button size="lg" variant="outline" className="hero-button-secondary">
                    Contact Sales
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Pricing;

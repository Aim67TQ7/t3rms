import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, X, CreditCard, Building2, Lock, ArrowRight } from 'lucide-react';

const Pricing = () => {
  const [billing, setBilling] = useState<'monthly' | 'annual'>('monthly');
  
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const features = [
    { name: "Document Uploads", free: true, pro: true, enterprise: true },
    { name: "Risk Identification", free: true, pro: true, enterprise: true },
    { name: "Risk Scoring", free: true, pro: true, enterprise: true },
    { name: "Document History", free: false, pro: true, enterprise: true },
    { name: "Downloadable PDFs", free: false, pro: true, enterprise: true },
    { name: "API Access", free: false, pro: false, enterprise: true },
    { name: "Custom Training", free: false, pro: false, enterprise: true },
    { name: "Dedicated Support", free: false, pro: false, enterprise: true },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow mt-20">
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h1 className="text-3xl md:text-4xl font-bold text-t3rms-charcoal mb-4">
                Simple, Transparent Pricing
              </h1>
              <p className="text-xl text-gray-600">
                Choose the plan that fits your needs
              </p>
              
              <div className="mt-8 inline-flex items-center p-1 bg-gray-100 rounded-full">
                <button
                  onClick={() => setBilling('monthly')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    billing === 'monthly' 
                      ? 'bg-white shadow-sm text-t3rms-charcoal' 
                      : 'text-gray-500'
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBilling('annual')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    billing === 'annual' 
                      ? 'bg-white shadow-sm text-t3rms-charcoal' 
                      : 'text-gray-500'
                  }`}
                >
                  Annual <Badge variant="outline" className="ml-1 bg-t3rms-blue/10 text-t3rms-blue border-none">Save 20%</Badge>
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Free Tier */}
              <Card className="border border-gray-200 shadow-sm transition-all hover:shadow-md">
                <CardHeader className="pb-8">
                  <div className="mb-2">
                    <Badge variant="outline" className="bg-gray-100 text-gray-600 border-none">
                      Free Tier
                    </Badge>
                  </div>
                  <CardTitle className="text-2xl font-bold text-t3rms-charcoal">
                    Basic
                  </CardTitle>
                  <CardDescription className="text-gray-500">
                    For individuals just getting started
                  </CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-t3rms-charcoal">$0</span>
                    <span className="text-gray-500 ml-2">/ month</span>
                  </div>
                </CardHeader>
                <CardContent className="border-t border-gray-100 pt-6">
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <span className="flex-shrink-0 rounded-full p-1 bg-t3rms-success/10 text-t3rms-success mr-3">
                        <Check className="h-4 w-4" />
                      </span>
                      <span className="text-gray-600">3 document analyses/month</span>
                    </div>
                    <div className="flex items-center">
                      <span className="flex-shrink-0 rounded-full p-1 bg-t3rms-success/10 text-t3rms-success mr-3">
                        <Check className="h-4 w-4" />
                      </span>
                      <span className="text-gray-600">Basic risk identification</span>
                    </div>
                    <div className="flex items-center">
                      <span className="flex-shrink-0 rounded-full p-1 bg-t3rms-success/10 text-t3rms-success mr-3">
                        <Check className="h-4 w-4" />
                      </span>
                      <span className="text-gray-600">Documents up to 20 pages</span>
                    </div>
                    <div className="flex items-center text-gray-400">
                      <span className="flex-shrink-0 rounded-full p-1 bg-gray-100 mr-3">
                        <X className="h-4 w-4" />
                      </span>
                      <span>Document history</span>
                    </div>
                    <div className="flex items-center text-gray-400">
                      <span className="flex-shrink-0 rounded-full p-1 bg-gray-100 mr-3">
                        <X className="h-4 w-4" />
                      </span>
                      <span>Downloadable PDFs</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Link to="/auth?signup=true" className="w-full">
                    <Button variant="outline" className="w-full">
                      Sign Up <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
              
              {/* Pro Tier */}
              <Card className="border-2 border-t3rms-blue shadow-md relative transition-all hover:shadow-lg">
                <div className="absolute -top-4 inset-x-0 mx-auto w-max bg-t3rms-blue text-white text-xs font-semibold px-3 py-1 rounded-full">
                  MOST POPULAR
                </div>
                <CardHeader className="pb-8">
                  <div className="mb-2">
                    <Badge className="bg-t3rms-blue text-white hover:bg-t3rms-blue/90 border-none">
                      Pro Tier
                    </Badge>
                  </div>
                  <CardTitle className="text-2xl font-bold text-t3rms-charcoal">
                    Professional
                  </CardTitle>
                  <CardDescription className="text-gray-500">
                    For individuals and small teams
                  </CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-t3rms-charcoal">
                      ${billing === 'monthly' ? '12' : '10'}
                    </span>
                    <span className="text-gray-500 ml-2">/ month</span>
                    {billing === 'annual' && (
                      <span className="block text-t3rms-success text-sm mt-1">
                        $120 billed annually (save $24)
                      </span>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="border-t border-gray-100 pt-6">
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <span className="flex-shrink-0 rounded-full p-1 bg-t3rms-success/10 text-t3rms-success mr-3">
                        <Check className="h-4 w-4" />
                      </span>
                      <span className="text-gray-600">100 document analyses/month</span>
                    </div>
                    <div className="flex items-center">
                      <span className="flex-shrink-0 rounded-full p-1 bg-t3rms-success/10 text-t3rms-success mr-3">
                        <Check className="h-4 w-4" />
                      </span>
                      <span className="text-gray-600">Advanced risk identification</span>
                    </div>
                    <div className="flex items-center">
                      <span className="flex-shrink-0 rounded-full p-1 bg-t3rms-success/10 text-t3rms-success mr-3">
                        <Check className="h-4 w-4" />
                      </span>
                      <span className="text-gray-600">Documents up to 100 pages</span>
                    </div>
                    <div className="flex items-center">
                      <span className="flex-shrink-0 rounded-full p-1 bg-t3rms-success/10 text-t3rms-success mr-3">
                        <Check className="h-4 w-4" />
                      </span>
                      <span className="text-gray-600">30-day document history</span>
                    </div>
                    <div className="flex items-center">
                      <span className="flex-shrink-0 rounded-full p-1 bg-t3rms-success/10 text-t3rms-success mr-3">
                        <Check className="h-4 w-4" />
                      </span>
                      <span className="text-gray-600">Downloadable PDFs</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Link to="/auth?signup=true&plan=pro" className="w-full">
                    <Button className="w-full bg-t3rms-blue hover:bg-t3rms-blue/90">
                      Get Started <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
              
              {/* Enterprise Tier */}
              <Card className="border border-gray-200 shadow-sm transition-all hover:shadow-md">
                <CardHeader className="pb-8">
                  <div className="mb-2">
                    <Badge variant="outline" className="bg-gray-900 text-white border-none">
                      Enterprise
                    </Badge>
                  </div>
                  <CardTitle className="text-2xl font-bold text-t3rms-charcoal">
                    Enterprise
                  </CardTitle>
                  <CardDescription className="text-gray-500">
                    For organizations with advanced needs
                  </CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-t3rms-charcoal">Custom</span>
                    <span className="text-gray-500 block mt-1">Contact for pricing</span>
                  </div>
                </CardHeader>
                <CardContent className="border-t border-gray-100 pt-6">
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <span className="flex-shrink-0 rounded-full p-1 bg-t3rms-success/10 text-t3rms-success mr-3">
                        <Check className="h-4 w-4" />
                      </span>
                      <span className="text-gray-600">Unlimited document analyses</span>
                    </div>
                    <div className="flex items-center">
                      <span className="flex-shrink-0 rounded-full p-1 bg-t3rms-success/10 text-t3rms-success mr-3">
                        <Check className="h-4 w-4" />
                      </span>
                      <span className="text-gray-600">Custom AI training</span>
                    </div>
                    <div className="flex items-center">
                      <span className="flex-shrink-0 rounded-full p-1 bg-t3rms-success/10 text-t3rms-success mr-3">
                        <Check className="h-4 w-4" />
                      </span>
                      <span className="text-gray-600">API access</span>
                    </div>
                    <div className="flex items-center">
                      <span className="flex-shrink-0 rounded-full p-1 bg-t3rms-success/10 text-t3rms-success mr-3">
                        <Check className="h-4 w-4" />
                      </span>
                      <span className="text-gray-600">Unlimited document history</span>
                    </div>
                    <div className="flex items-center">
                      <span className="flex-shrink-0 rounded-full p-1 bg-t3rms-success/10 text-t3rms-success mr-3">
                        <Check className="h-4 w-4" />
                      </span>
                      <span className="text-gray-600">Unlimited team members</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Link to="/contact" className="w-full">
                    <Button variant="outline" className="w-full">
                      Contact Sales <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </div>
            
            {/* Features Table */}
            <div className="mt-20 max-w-6xl mx-auto overflow-hidden rounded-lg border border-gray-200">
              <table className="w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                      Features
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-medium text-gray-500">
                      Free
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-medium text-gray-500">
                      Pro
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-medium text-gray-500">
                      Enterprise
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {features.map((feature, i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {feature.name}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {feature.free ? (
                          <Check className="mx-auto h-5 w-5 text-t3rms-success" />
                        ) : (
                          <X className="mx-auto h-5 w-5 text-gray-300" />
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {feature.pro ? (
                          <Check className="mx-auto h-5 w-5 text-t3rms-success" />
                        ) : (
                          <X className="mx-auto h-5 w-5 text-gray-300" />
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {feature.enterprise ? (
                          <Check className="mx-auto h-5 w-5 text-t3rms-success" />
                        ) : (
                          <X className="mx-auto h-5 w-5 text-gray-300" />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* FAQ Section */}
            <div className="mt-20 max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold text-t3rms-charcoal mb-8 text-center">
                Frequently Asked Questions
              </h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-t3rms-charcoal mb-2">
                    Can I upgrade or downgrade my plan later?
                  </h3>
                  <p className="text-gray-600">
                    Yes, you can upgrade, downgrade, or cancel your subscription at any time. If you downgrade, your new plan will take effect at the end of your current billing cycle.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-t3rms-charcoal mb-2">
                    What happens if I exceed my document analysis limit?
                  </h3>
                  <p className="text-gray-600">
                    Free users who exceed their limit can provide feedback to receive additional analyses or upgrade to our Pro plan. Pro users who exceed their limit will be notified, and any additional analyses will be counted toward the next billing cycle.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-t3rms-charcoal mb-2">
                    How does team sharing work?
                  </h3>
                  <p className="text-gray-600">
                    Enterprise users can add unlimited team members to their workspace with customizable permission levels.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-t3rms-charcoal mb-2">
                    Is my data secure?
                  </h3>
                  <p className="text-gray-600">
                    Yes, we take security very seriously. Your documents are encrypted in transit and at rest. We do not store your documents permanently after analysis unless you explicitly save them to your account's document history.
                  </p>
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

export default Pricing;

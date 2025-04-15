
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, X, ArrowRight } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const Pricing = () => {
  const [billing, setBilling] = useState<'monthly' | 'annual'>('monthly');
  
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
            <Alert className="mb-8 max-w-3xl mx-auto bg-t3rms-blue/10 text-t3rms-blue border-t3rms-blue">
              <AlertDescription className="text-center text-base">
                🚀 T3RMS is currently in beta testing phase. Subscriptions will be available soon. 
                <br />
                We'd love your feedback. Please test out our free tier and 
                <a 
                  href="mailto:hello@t3rms.com" 
                  className="ml-1 underline font-semibold hover:text-t3rms-blue"
                >
                  contact us
                </a> if you're interested in more access or want to provide insights.
              </AlertDescription>
            </Alert>

            <div className="max-w-3xl mx-auto text-center mb-12">
              <h1 className="text-3xl md:text-4xl font-bold text-t3rms-charcoal mb-4">
                Simple, Transparent Pricing
              </h1>
              <p className="text-xl text-gray-600">
                Choose the plan that fits your needs
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
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
                    <span className="text-gray-500 ml-2">/ forever</span>
                  </div>
                </CardHeader>
                <CardContent className="border-t border-gray-100 pt-6">
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <span className="flex-shrink-0 rounded-full p-1 bg-t3rms-success/10 text-t3rms-success mr-3">
                        <Check className="h-4 w-4" />
                      </span>
                      <span className="text-gray-600">3 free analyses</span>
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
              
              <Card className="border-2 border-t3rms-blue shadow-md relative transition-all hover:shadow-lg">
                <div className="absolute -top-4 inset-x-0 mx-auto w-max bg-t3rms-blue text-white text-xs font-semibold px-3 py-1 rounded-full">
                  COMING SOON
                </div>
                <CardHeader className="pb-8">
                  <div className="mb-2">
                    <Badge className="bg-t3rms-blue text-white hover:bg-t3rms-blue/90 border-none">
                      Single Document
                    </Badge>
                  </div>
                  <CardTitle className="text-2xl font-bold text-t3rms-charcoal">
                    Document Finalization
                  </CardTitle>
                  <CardDescription className="text-gray-500">
                    For one-time document creation
                  </CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-t3rms-charcoal">$4.99</span>
                    <span className="text-gray-500 ml-2">/ document</span>
                  </div>
                </CardHeader>
                <CardContent className="border-t border-gray-100 pt-6">
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <span className="flex-shrink-0 rounded-full p-1 bg-t3rms-success/10 text-t3rms-success mr-3">
                        <Check className="h-4 w-4" />
                      </span>
                      <span className="text-gray-600">Single document finalization</span>
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
                      <span className="text-gray-600">Downloadable PDFs</span>
                    </div>
                    <div className="flex items-center">
                      <span className="flex-shrink-0 rounded-full p-1 bg-t3rms-success/10 text-t3rms-success mr-3">
                        <Check className="h-4 w-4" />
                      </span>
                      <span className="text-gray-600">30-day document access</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button disabled className="w-full bg-t3rms-blue/50 cursor-not-allowed">
                    Available Soon <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
              
              <Card className="border border-gray-200 shadow-sm transition-all hover:shadow-md">
                <CardHeader className="pb-8">
                  <div className="mb-2">
                    <Badge variant="outline" className="bg-gray-900 text-white border-none">
                      Credit Bundle
                    </Badge>
                  </div>
                  <CardTitle className="text-2xl font-bold text-t3rms-charcoal">
                    Credit Pack
                  </CardTitle>
                  <CardDescription className="text-gray-500">
                    For regular document analysis and creation
                  </CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-t3rms-charcoal">$9.99</span>
                    <span className="text-gray-500 block mt-1">50 credits</span>
                  </div>
                </CardHeader>
                <CardContent className="border-t border-gray-100 pt-6">
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <span className="flex-shrink-0 rounded-full p-1 bg-t3rms-success/10 text-t3rms-success mr-3">
                        <Check className="h-4 w-4" />
                      </span>
                      <span className="text-gray-600">50 analysis or document creations</span>
                    </div>
                    <div className="flex items-center">
                      <span className="flex-shrink-0 rounded-full p-1 bg-t3rms-success/10 text-t3rms-success mr-3">
                        <Check className="h-4 w-4" />
                      </span>
                      <span className="text-gray-600">Advanced document options</span>
                    </div>
                    <div className="flex items-center">
                      <span className="flex-shrink-0 rounded-full p-1 bg-t3rms-success/10 text-t3rms-success mr-3">
                        <Check className="h-4 w-4" />
                      </span>
                      <span className="text-gray-600">60-day document history</span>
                    </div>
                    <div className="flex items-center">
                      <span className="flex-shrink-0 rounded-full p-1 bg-t3rms-success/10 text-t3rms-success mr-3">
                        <Check className="h-4 w-4" />
                      </span>
                      <span className="text-gray-600">Unlimited downloads</span>
                    </div>
                    <div className="flex items-center">
                      <span className="flex-shrink-0 rounded-full p-1 bg-t3rms-success/10 text-t3rms-success mr-3">
                        <Check className="h-4 w-4" />
                      </span>
                      <span className="text-gray-600">Priority support</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button disabled className="w-full bg-gray-900/50 cursor-not-allowed">
                    Coming Soon <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </div>
            
            <div className="mt-20 max-w-6xl mx-auto overflow-hidden rounded-lg border border-gray-200">
              <table className="w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                      Features
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-medium text-gray-500">
                      Basic
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-medium text-gray-500">
                      Document Finalization
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-medium text-gray-500">
                      Credit Pack
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
            
            <div className="mt-20 max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold text-t3rms-charcoal mb-8 text-center">
                Frequently Asked Questions
              </h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-t3rms-charcoal mb-2">
                    How do the credits work?
                  </h3>
                  <p className="text-gray-600">
                    Each credit can be used for either analyzing a document or finalizing a terms and conditions document. 
                    Credits never expire, so you can use them whenever you need to.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-t3rms-charcoal mb-2">
                    What happens when I use all my free analyses?
                  </h3>
                  <p className="text-gray-600">
                    Once you've used your 3 free analyses, you can purchase a single document finalization for $4.99 or buy a credit pack of 50 uses for $9.99, depending on your needs.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-t3rms-charcoal mb-2">
                    Can I use credits for both analysis and document creation?
                  </h3>
                  <p className="text-gray-600">
                    Yes, credits are flexible and can be used for either analyzing existing documents or creating new terms and conditions.
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

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
                🚀 T3RMS is currently in beta testing phase. Credit packages will be available soon. 
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
                Simple, Token-Based Pricing
              </h1>
              <p className="text-xl text-gray-600">
                Pay only for what you analyze
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
                      <span className="text-gray-600">Documents up to 2 pages</span>
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
                      Most Popular
                    </Badge>
                  </div>
                  <CardTitle className="text-2xl font-bold text-t3rms-charcoal">
                    Value Pack
                  </CardTitle>
                  <CardDescription className="text-gray-500">
                    For regular document analysis
                  </CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-t3rms-charcoal">$9.95</span>
                    <span className="text-gray-500 block mt-1">50 credits</span>
                  </div>
                </CardHeader>
                <CardContent className="border-t border-gray-100 pt-6">
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <span className="flex-shrink-0 rounded-full p-1 bg-t3rms-success/10 text-t3rms-success mr-3">
                        <Check className="h-4 w-4" />
                      </span>
                      <span className="text-gray-600">
                        Includes <b>50 analyses per pack</b>.
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="flex-shrink-0 rounded-full p-1 bg-t3rms-success/10 text-t3rms-success mr-3">
                        <Check className="h-4 w-4" />
                      </span>
                      <span className="text-gray-600">
                        <b>1 credit ≈ 1,000 tokens</b> (about 750–1,100 words)
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="flex-shrink-0 rounded-full p-1 bg-t3rms-success/10 text-t3rms-success mr-3">
                        <Check className="h-4 w-4" />
                      </span>
                      <span className="text-gray-600">
                        <b>Most 1–2 page contracts use 1 credit.</b> Some dense or heavily formatted contracts, or those with lengthy appendices, may exceed 1,000 tokens (1.3k tokens = 2 credits).
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="flex-shrink-0 rounded-full p-1 bg-t3rms-success/10 text-t3rms-success mr-3">
                        <Check className="h-4 w-4" />
                      </span>
                      <span className="text-gray-600">
                        <b>Delivers: key‑clause extraction, risk scoring, obligation summary, governing‑law and jurisdiction checks</b>
                      </span>
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
                      Enterprise
                    </Badge>
                  </div>
                  <CardTitle className="text-2xl font-bold text-t3rms-charcoal">
                    Custom Plan
                  </CardTitle>
                  <CardDescription className="text-gray-500">
                    For high-volume analysis needs
                  </CardDescription>
                  <div className="mt-4">
                    <span className="text-2xl font-bold text-t3rms-charcoal">Contact Us</span>
                    <span className="text-gray-500 block mt-1">Custom pricing</span>
                  </div>
                </CardHeader>
                <CardContent className="border-t border-gray-100 pt-6">
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <span className="flex-shrink-0 rounded-full p-1 bg-t3rms-success/10 text-t3rms-success mr-3">
                        <Check className="h-4 w-4" />
                      </span>
                      <span className="text-gray-600">Unlimited analyses</span>
                    </div>
                    <div className="flex items-center">
                      <span className="flex-shrink-0 rounded-full p-1 bg-t3rms-success/10 text-t3rms-success mr-3">
                        <Check className="h-4 w-4" />
                      </span>
                      <span className="text-gray-600">Custom integrations</span>
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
                      <span className="text-gray-600">Priority support</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full bg-gray-900 hover:bg-gray-800">
                    <a href="mailto:enterprise@t3rms.com">
                      Contact Sales <ArrowRight className="ml-2 h-4 w-4" />
                    </a>
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
                      Value Pack
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-medium text-gray-500">
                      Custom Plan
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
                    Each credit covers roughly 1,000 tokens (about 750–1,100 words). Most 1–2 page contracts fit within 1 credit, but dense formatting or lengthy appendices can increase token count and credit usage.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-t3rms-charcoal mb-2">
                    What happens when I use all my free analyses?
                  </h3>
                  <p className="text-gray-600">
                    Once you've used your 3 free analyses, you can purchase a Value Pack (50 analyses for $9.95). <b>Remember, documents that exceed 1,000 tokens will consume multiple credits</b>.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-t3rms-charcoal mb-2">
                    What exactly do I get with each analysis?
                  </h3>
                  <p className="text-gray-600">
                    Each analysis delivers concrete outputs: key‑clause extraction, risk scoring, obligation summary, and checks for governing law and jurisdiction. This lets you quickly review the most important parts of your document.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-t3rms-charcoal mb-2">
                    What if my contract is long, dense, or has appendices?
                  </h3>
                  <p className="text-gray-600">
                    Most standard contracts (1–2 pages, normal formatting) are under 1,000 tokens (1 credit). However, dense legal formatting, lots of definitions, or lengthy appendices may increase the token count, which means more than 1 credit could be used for analysis.
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

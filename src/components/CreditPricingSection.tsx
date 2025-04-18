
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { CREDIT_PACKAGES } from "@/utils/anonymousUsage";
import { useAuth } from "@/components/navbar/useAuth";
import { FileText, BarChart, Download, Check } from "lucide-react";
import AuthPrompt from "@/components/AuthPrompt";

interface CreditPricingSectionProps {
  onPurchaseClick?: (packageType: 'SMALL' | 'LARGE') => void;
}

const CreditPricingSection = ({ onPurchaseClick }: CreditPricingSectionProps) => {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  
  const handlePurchaseClick = (packageType: 'SMALL' | 'LARGE') => {
    if (!isAuthenticated) {
      toast({
        title: "Sign in Required",
        description: "Please sign in or create an account to purchase credits.",
      });
      return;
    }
    
    if (onPurchaseClick) {
      onPurchaseClick(packageType);
    }
  };
  
  return (
    <div className="mt-12">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-t3rms-charcoal">Credit System</h2>
        <p className="text-gray-600 mt-2">
          Pay only for what you use with our flexible credit system
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-full">
              <BarChart className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="font-semibold text-lg">Document Analysis</h3>
          </div>
          
          <ul className="space-y-3 mb-6">
            <li className="flex items-start">
              <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-gray-600">1 credit per document chunk analyzed</span>
            </li>
            <li className="flex items-start">
              <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-gray-600">Detailed risk assessment</span>
            </li>
            <li className="flex items-start">
              <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-gray-600">3 free credits for new users</span>
            </li>
          </ul>
        </div>
        
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-amber-100 rounded-full">
              <FileText className="h-5 w-5 text-amber-600" />
            </div>
            <h3 className="font-semibold text-lg">Document Generation</h3>
          </div>
          
          <ul className="space-y-3 mb-6">
            <li className="flex items-start">
              <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-gray-600">1 credit per policy created</span>
            </li>
            <li className="flex items-start">
              <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-gray-600">Additional credits for multiple download formats</span>
            </li>
            <li className="flex items-start">
              <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-gray-600">Professional, legally-sound documents</span>
            </li>
          </ul>
        </div>
        
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-100 rounded-full">
              <Download className="h-5 w-5 text-green-600" />
            </div>
            <h3 className="font-semibold text-lg">Downloads</h3>
          </div>
          
          <ul className="space-y-3 mb-6">
            <li className="flex items-start">
              <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-gray-600">Multiple download formats available</span>
            </li>
            <li className="flex items-start">
              <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-gray-600">Each download format uses 1 credit per policy</span>
            </li>
            <li className="flex items-start">
              <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-gray-600">Store documents in your account for future reference</span>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 max-w-4xl mx-auto">
        <div className="bg-white rounded-lg border p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="mb-4">
            <div className="font-bold text-2xl text-t3rms-charcoal">
              ${CREDIT_PACKAGES.SMALL.price}
            </div>
            <h3 className="font-semibold text-lg mt-1">{CREDIT_PACKAGES.SMALL.name}</h3>
            <p className="text-gray-500 text-sm mt-1">{CREDIT_PACKAGES.SMALL.description}</p>
          </div>
          
          <ul className="space-y-3 mb-6">
            <li className="flex items-start">
              <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-gray-600">Analyze multiple documents</span>
            </li>
            <li className="flex items-start">
              <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-gray-600">Generate up to 10 policies</span>
            </li>
            <li className="flex items-start">
              <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-gray-600">Credits never expire</span>
            </li>
          </ul>
          
          {isAuthenticated ? (
            <Button 
              className="w-full" 
              onClick={() => handlePurchaseClick('SMALL')}
            >
              Buy {CREDIT_PACKAGES.SMALL.credits} Credits
            </Button>
          ) : (
            <AuthPrompt buttonClass="w-full" buttonText="Sign In to Purchase" />
          )}
        </div>
        
        <div className="bg-white rounded-lg border-2 border-t3rms-blue p-6 shadow-md hover:shadow-lg transition-shadow relative">
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <span className="bg-t3rms-blue text-white text-xs font-bold px-3 py-1 rounded-full">
              BEST VALUE
            </span>
          </div>
          
          <div className="mb-4">
            <div className="font-bold text-2xl text-t3rms-charcoal">
              ${CREDIT_PACKAGES.LARGE.price}
            </div>
            <h3 className="font-semibold text-lg mt-1">{CREDIT_PACKAGES.LARGE.name}</h3>
            <p className="text-gray-500 text-sm mt-1">{CREDIT_PACKAGES.LARGE.description}</p>
          </div>
          
          <ul className="space-y-3 mb-6">
            <li className="flex items-start">
              <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-gray-600">Analyze up to 50 documents</span>
            </li>
            <li className="flex items-start">
              <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-gray-600">Generate up to 50 policies</span>
            </li>
            <li className="flex items-start">
              <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-gray-600">80% savings compared to individual purchases</span>
            </li>
            <li className="flex items-start">
              <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-gray-600">Credits never expire</span>
            </li>
          </ul>
          
          {isAuthenticated ? (
            <Button 
              className="w-full bg-t3rms-blue hover:bg-t3rms-blue/90" 
              onClick={() => handlePurchaseClick('LARGE')}
            >
              Buy {CREDIT_PACKAGES.LARGE.credits} Credits
            </Button>
          ) : (
            <AuthPrompt buttonClass="w-full" buttonVariant="default" buttonText="Sign In to Purchase" />
          )}
        </div>
      </div>
      
      <div className="mt-12 max-w-3xl mx-auto">
        <div className="bg-gray-50 rounded-lg border p-6">
          <h3 className="font-semibold text-lg mb-4">Credit System FAQs</h3>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-t3rms-charcoal">How are credits used?</h4>
              <p className="text-gray-600 text-sm mt-1">
                Each document analysis chunk uses 1 credit. For document generation, each policy created uses 1 credit per download format. For example, generating 6 policies with one download format uses 6 credits total.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-t3rms-charcoal">Do credits expire?</h4>
              <p className="text-gray-600 text-sm mt-1">
                No, your purchased credits never expire. They remain in your account until used.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-t3rms-charcoal">What happens when I run out of free credits?</h4>
              <p className="text-gray-600 text-sm mt-1">
                After using your 3 free credits, you'll need to purchase additional credits to continue using our services. You can choose between our 10-credit package for $4.99 or our 50-credit value package for $9.99.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-t3rms-charcoal">Can I download documents in different formats?</h4>
              <p className="text-gray-600 text-sm mt-1">
                Yes, you can download your generated documents in multiple formats. Each additional download format will use 1 credit per policy. For example, downloading 6 policies in both HTML and PDF formats would use 12 credits total.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreditPricingSection;

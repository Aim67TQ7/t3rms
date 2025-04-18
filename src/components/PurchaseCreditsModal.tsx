
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { addCredits, CREDIT_PACKAGES } from "@/utils/anonymousUsage";
import { useAuth } from "@/components/navbar/useAuth";
import AuthPrompt from "@/components/AuthPrompt";
import { Shield, CreditCard, Zap } from "lucide-react";

interface PurchaseCreditsModalProps {
  isOpen: boolean;
  onClose: () => void;
  requiredCredits: number;
  onPurchaseComplete?: () => void;
}

const PurchaseCreditsModal = ({ 
  isOpen, 
  onClose, 
  requiredCredits,
  onPurchaseComplete 
}: PurchaseCreditsModalProps) => {
  const [selectedPackage, setSelectedPackage] = useState<'SMALL' | 'LARGE'>('SMALL');
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();

  const handlePurchase = async () => {
    setIsProcessing(true);
    
    try {
      // This would be replaced with actual payment processing
      // For now, simulate a successful purchase
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Add the credits
      const packageCredits = CREDIT_PACKAGES[selectedPackage].credits;
      addCredits(packageCredits);
      
      toast({
        title: "Purchase Successful",
        description: `${packageCredits} credits have been added to your account.`,
      });
      
      if (onPurchaseComplete) {
        onPurchaseComplete();
      }
      
      onClose();
    } catch (error) {
      toast({
        title: "Purchase Failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Sign in Required</DialogTitle>
            <DialogDescription>
              You need to create an account or sign in before purchasing credits.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex items-center justify-center py-4">
            <Shield className="h-12 w-12 text-gray-400" />
          </div>
          
          <DialogFooter className="flex flex-col gap-2 sm:flex-row">
            <Button variant="outline" onClick={onClose} className="w-full">
              Cancel
            </Button>
            <AuthPrompt buttonClass="w-full" buttonText="Sign In or Register" />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Purchase Credits</DialogTitle>
          <DialogDescription>
            You need {requiredCredits} more credits to complete this action. 
            Choose a credit package below.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <RadioGroup value={selectedPackage} onValueChange={(value: 'SMALL' | 'LARGE') => setSelectedPackage(value)}>
            <div className="flex flex-col gap-4">
              <div className="flex items-center space-x-2 rounded-lg border p-4 cursor-pointer hover:bg-gray-50" onClick={() => setSelectedPackage('SMALL')}>
                <RadioGroupItem value="SMALL" id="small-package" />
                <Label htmlFor="small-package" className="flex-1 cursor-pointer">
                  <div className="font-medium">{CREDIT_PACKAGES.SMALL.name}</div>
                  <div className="text-sm text-gray-500">{CREDIT_PACKAGES.SMALL.description}</div>
                </Label>
                <div className="font-bold text-lg">${CREDIT_PACKAGES.SMALL.price}</div>
              </div>
              
              <div className="flex items-center space-x-2 rounded-lg border-2 border-t3rms-blue p-4 cursor-pointer bg-blue-50/50" onClick={() => setSelectedPackage('LARGE')}>
                <RadioGroupItem value="LARGE" id="large-package" />
                <Label htmlFor="large-package" className="flex-1 cursor-pointer">
                  <div className="font-medium flex items-center">
                    {CREDIT_PACKAGES.LARGE.name}
                    <span className="ml-2 text-xs bg-t3rms-blue text-white px-2 py-0.5 rounded-full">Best Value</span>
                  </div>
                  <div className="text-sm text-gray-500">{CREDIT_PACKAGES.LARGE.description}</div>
                </Label>
                <div className="font-bold text-lg">${CREDIT_PACKAGES.LARGE.price}</div>
              </div>
            </div>
          </RadioGroup>
          
          <div className="mt-6 bg-amber-50 border border-amber-200 rounded-md p-3">
            <div className="flex items-start">
              <Zap className="h-5 w-5 text-amber-500 mt-0.5 mr-2" />
              <div className="text-sm text-amber-800">
                <strong>Credit Usage:</strong> 1 credit is used per document analysis chunk or policy generation. 
                Additional download formats require additional credits.
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isProcessing}>
            Cancel
          </Button>
          <Button onClick={handlePurchase} disabled={isProcessing} className="flex gap-2">
            {isProcessing ? (
              <>Processing...</>
            ) : (
              <>
                <CreditCard className="h-4 w-4" />
                Purchase ${CREDIT_PACKAGES[selectedPackage].price}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PurchaseCreditsModal;

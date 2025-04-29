
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import Seo from '@/components/Seo';

const PaymentCanceled = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    // Show toast notification
    toast({
      title: "Payment Canceled",
      description: "Your payment was not processed.",
      variant: "destructive",
    });
  }, [toast]);
  
  return (
    <>
      <Seo title="Payment Canceled - T3RMS" />
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center flex flex-col items-center">
              <XCircle className="text-red-500 h-16 w-16 mb-4" />
              Payment Canceled
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-lg mb-4">Your payment was not processed.</p>
            <p className="mb-6">You can try again or choose a different payment method.</p>
          </CardContent>
          <CardFooter className="flex justify-center gap-4">
            <Button onClick={() => navigate('/pricing')} variant="outline">
              Return to Pricing
            </Button>
            <Button onClick={() => navigate('/term-analysis')} className="bg-blue-600 hover:bg-blue-700">
              Continue with Free Version
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
};

export default PaymentCanceled;

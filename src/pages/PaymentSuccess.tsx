
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import Seo from '@/components/Seo';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    // Show toast notification
    toast({
      title: "Payment Successful",
      description: "Thank you for your purchase!",
    });
  }, [toast]);
  
  return (
    <>
      <Seo title="Payment Successful - T3RMS" />
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center flex flex-col items-center">
              <CheckCircle2 className="text-green-500 h-16 w-16 mb-4" />
              Payment Successful
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-lg mb-4">Thank you for your purchase!</p>
            <p className="mb-6">Your credits have been added to your account. You can now use all premium features.</p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button onClick={() => navigate('/term-analysis')} className="bg-blue-600 hover:bg-blue-700">
              Start Analyzing
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
};

export default PaymentSuccess;

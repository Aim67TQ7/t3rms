
import { useEffect, useState } from 'react';
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getRemainingCredits, FREE_CREDIT_LIMIT } from "@/utils/anonymousUsage";
import { Coins } from "lucide-react";

interface CreditUsageDisplayProps {
  onPurchaseClick?: () => void;
}

const CreditUsageDisplay = ({ onPurchaseClick }: CreditUsageDisplayProps) => {
  const [remainingCredits, setRemainingCredits] = useState(getRemainingCredits());
  
  useEffect(() => {
    // Update the credit display when component mounts
    setRemainingCredits(getRemainingCredits());
    
    // Set up interval to periodically check for credit updates
    const interval = setInterval(() => {
      const current = getRemainingCredits();
      if (current !== remainingCredits) {
        setRemainingCredits(current);
      }
    }, 2000);
    
    return () => clearInterval(interval);
  }, [remainingCredits]);
  
  const creditPercentage = (remainingCredits / FREE_CREDIT_LIMIT) * 100;
  
  return (
    <div className="bg-white rounded-lg border p-4 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <div className="font-medium flex items-center gap-2">
          <Coins className="h-4 w-4 text-amber-500" />
          Credits Remaining
        </div>
        <Badge variant={remainingCredits > 0 ? "outline" : "destructive"}>
          {remainingCredits} / {FREE_CREDIT_LIMIT}
        </Badge>
      </div>
      
      <Progress value={creditPercentage} className="h-2 mb-3" />
      
      <div className="flex justify-between items-center">
        <span className="text-xs text-gray-500">
          {remainingCredits === 0 ? (
            "No free credits remaining"
          ) : remainingCredits === 1 ? (
            "1 free credit remaining"
          ) : (
            `${remainingCredits} free credits remaining`
          )}
        </span>
        
        {onPurchaseClick && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onPurchaseClick}
            className="text-xs"
          >
            Buy Credits
          </Button>
        )}
      </div>
    </div>
  );
};

export default CreditUsageDisplay;

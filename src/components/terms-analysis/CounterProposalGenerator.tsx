
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Copy, Check, Lock } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface CounterProposalGeneratorProps {
  analysisData: any;
  isPremium: boolean;
  onRequestPremium: () => void;
}

const CounterProposalGenerator = ({ analysisData, isPremium, onRequestPremium }: CounterProposalGeneratorProps) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  // Generate counter-proposal text based on the analysis
  const generateCounterProposal = () => {
    const criticalPoints = analysisData.criticalPoints || [];
    const financialRisks = analysisData.financialRisks || [];
    const recommendations = analysisData.recommendations || [];

    const counterProposalParts = [];
    
    // Start with a professional greeting
    counterProposalParts.push("Thank you for sending over the contract. After careful review, we'd like to propose a few adjustments to ensure a fair and balanced agreement for both parties.");

    // Add recommendations for high-priority issues
    if (criticalPoints.length > 0) {
      counterProposalParts.push("\n\nKey contractual adjustments:");
      criticalPoints
        .filter((point: any) => point.severity === "high" || point.risk === "high")
        .slice(0, 3)
        .forEach((point: any, index: number) => {
          counterProposalParts.push(`${index + 1}. ${point.title}: We suggest revising this clause to address ${point.description.substring(0, 100)}...`);
        });
    }

    // Add financial terms adjustments
    if (financialRisks.length > 0) {
      counterProposalParts.push("\n\nFinancial terms adjustments:");
      financialRisks
        .slice(0, 3)
        .forEach((risk: any, index: number) => {
          counterProposalParts.push(`${index + 1}. ${risk.title}: We propose adjusting this to better reflect market standards and our company policies.`);
        });
    }

    // Add constructive recommendations
    if (recommendations.length > 0) {
      counterProposalParts.push("\n\nAdditional suggestions:");
      recommendations
        .slice(0, 3)
        .forEach((rec: any, index: number) => {
          counterProposalParts.push(`${index + 1}. ${rec.text}`);
        });
    }

    // Add closing statement
    counterProposalParts.push("\n\nWe value our potential relationship and believe these adjustments will create a stronger foundation for our work together. I'm available to discuss these points at your convenience.");
    
    return counterProposalParts.join("\n");
  };

  const counterProposalText = generateCounterProposal();

  const handleCopy = () => {
    if (!isPremium) {
      onRequestPremium();
      return;
    }

    navigator.clipboard.writeText(counterProposalText);
    setCopied(true);
    toast({
      title: "Copied to clipboard",
      description: "Counter-proposal text is now ready to paste",
    });
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Counter-Proposal Generator</CardTitle>
          {!isPremium && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <Lock className="h-3 w-3" /> Premium Feature
            </Badge>
          )}
        </div>
        <CardDescription>
          Generate a professional counter-proposal based on identified issues
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Textarea 
            className="min-h-[300px] font-mono text-sm"
            readOnly
            value={isPremium ? counterProposalText : counterProposalText.split('\n').slice(0, 4).join('\n') + "\n\n[Subscribe to view and use the complete counter-proposal text]"}
            style={{ filter: isPremium ? 'none' : 'blur(1px)' }}
          />
          
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">
              {isPremium ? "Click to copy this text and paste it into your email reply" : "Upgrade to unlock this feature"}
            </p>
            <Button 
              onClick={handleCopy}
              className={isPremium ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-600 hover:bg-gray-700"}
            >
              {isPremium ? (
                copied ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy to Clipboard
                  </>
                )
              ) : (
                <>
                  <Lock className="mr-2 h-4 w-4" />
                  Unlock Premium
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CounterProposalGenerator;

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

  const generateCounterProposal = () => {
    const analysisContent = analysisData?.analysis || analysisData;
    const criticalPoints = analysisContent?.criticalPoints || [];
    const financialRisks = analysisContent?.financialRisks || [];
    const recommendations = analysisContent?.recommendations || [];
    
    const counterProposalParts = [];
    
    counterProposalParts.push(`
Based on our review of the proposed contract, we require the following modifications to proceed:

Proposed Contract Modifications:`);

    if (criticalPoints.length > 0) {
      counterProposalParts.push("\n1. Critical Terms Amendments:\n");
      criticalPoints.forEach((point: any, index: number) => {
        const title = point.title || point.issue || `Section ${point.section || 'Unknown'}`;
        const description = point.description || point.issue;
        const suggestion = point.suggestion || "This clause must be revised to align with standard industry practices and reasonable risk allocation";
        
        counterProposalParts.push(`
   ${String.fromCharCode(97 + index)}. ${title}
      Current: ${description}
      Required Change: ${suggestion}
      Rationale: To ensure balanced risk allocation and alignment with industry standards`);
      });
    }

    if (financialRisks.length > 0) {
      counterProposalParts.push("\n2. Financial Terms Revisions:\n");
      financialRisks.forEach((risk: any, index: number) => {
        const title = risk.title || risk.risk || `Financial term in section ${risk.section || 'Unknown'}`;
        counterProposalParts.push(`
   ${String.fromCharCode(97 + index)}. ${title}
      Required Modification: ${risk.suggestion || "Terms must be adjusted to reflect fair market conditions"}
      Business Justification: ${risk.rationale || "Current terms present unreasonable financial exposure"}`);
      });
    }

    if (recommendations.length > 0) {
      counterProposalParts.push("\n3. Additional Required Changes:\n");
      recommendations.forEach((rec: any, index: number) => {
        const recText = rec.text || rec.recommendation || rec;
        counterProposalParts.push(`   ${String.fromCharCode(97 + index)}. ${recText}`);
      });
    }
    
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
    <Card className="border-purple-500/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white">Counter-Proposal Generator</CardTitle>
          {!isPremium && (
            <Badge variant="secondary" className="flex items-center gap-1 bg-purple-500/20">
              <Lock className="h-3 w-3" /> Premium Feature
            </Badge>
          )}
        </div>
        <CardDescription className="text-gray-300">
          Generate a professional counter-proposal based on identified issues
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Textarea 
            className="min-h-[300px] font-mono text-sm text-white bg-purple-950/40 border-purple-500/20"
            readOnly
            value={isPremium ? counterProposalText : counterProposalText.split('\n').slice(0, 4).join('\n') + "\n\n[Subscribe to view and use the complete counter-proposal text]"}
            style={{ filter: isPremium ? 'none' : 'blur(1px)' }}
          />
          
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-300">
              {isPremium ? "Click to copy the counter-proposal text" : "Upgrade to unlock this feature"}
            </p>
            <Button 
              onClick={handleCopy}
              className={isPremium ? "bg-purple-600 hover:bg-purple-700" : "bg-gray-600 hover:bg-gray-700"}
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

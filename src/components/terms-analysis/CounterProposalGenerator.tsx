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
Dear [Counterparty Name],

I hope this email finds you well. Thank you for sharing the contract for our review. After a careful analysis, we would like to propose several modifications to ensure the agreement better serves both parties' interests while maintaining appropriate risk management protocols.

Below are our specific recommendations for amendments:
    `);

    if (criticalPoints.length > 0) {
      counterProposalParts.push("\n1. Critical Contract Terms:\n");
      criticalPoints.forEach((point: any, index: number) => {
        const title = point.title || point.issue || `Section ${point.section || 'Unknown'}`;
        const description = point.description || point.issue;
        const suggestion = point.suggestion || "We propose revising this clause to better balance the interests of both parties";
        
        counterProposalParts.push(`
   ${index + 1}. Re: ${title}
      Current Language: ${description}
      Proposed Change: ${suggestion}
        `);
      });
    }

    if (financialRisks.length > 0) {
      counterProposalParts.push("\n2. Financial Terms:\n");
      financialRisks.forEach((risk: any, index: number) => {
        const title = risk.title || risk.risk || `Financial term in section ${risk.section || 'Unknown'}`;
        counterProposalParts.push(`
   ${index + 1}. ${title}
      - Proposed Modification: ${risk.suggestion || "We suggest adjusting these terms to align with standard industry practices"}
      - Rationale: ${risk.rationale || "This change would provide better clarity and fairness for both parties"}
        `);
      });
    }

    if (recommendations.length > 0) {
      counterProposalParts.push("\n3. Additional Recommendations:\n");
      recommendations.forEach((rec: any, index: number) => {
        const recText = rec.text || rec.recommendation || rec;
        counterProposalParts.push(`   ${index + 1}. ${recText}`);
      });
    }

    counterProposalParts.push(`

We believe these proposed modifications will create a more balanced agreement that better serves both organizations' interests while maintaining appropriate protections for all parties involved.

I would welcome the opportunity to discuss these points in detail at your earliest convenience. Please let me know what times work best for you to review these suggestions together.

Best regards,
[Your Name]
[Your Organization]
    `);
    
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

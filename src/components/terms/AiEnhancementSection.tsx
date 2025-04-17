
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { convertToLegalClause } from '@/utils/legalLanguageGenerator';
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AiEnhancementSectionProps {
  onAddToDocument: (enhancedText: string) => void;
}

const AiEnhancementSection = ({ onAddToDocument }: AiEnhancementSectionProps) => {
  const [userInput, setUserInput] = useState('');
  const [enhancedText, setEnhancedText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const { toast } = useToast();

  const handleEnhanceText = () => {
    if (!userInput.trim()) {
      toast({
        title: "Error",
        description: "Please enter some text to enhance.",
        variant: "destructive",
      });
      return;
    }
    
    setIsProcessing(true);
    setShowPreview(false);
    
    try {
      // Generate a title based on the content
      const words = userInput.split(' ');
      const potentialTitle = words.slice(0, 3).join(' ').toUpperCase();
      const clauseTitle = `${potentialTitle} PROVISION`;
      
      // Convert to legal language
      const enhanced = convertToLegalClause(userInput, clauseTitle);
      setEnhancedText(enhanced);
      setShowPreview(true);
      
      toast({
        title: "Text Enhanced",
        description: "Your text has been converted to legal language.",
      });
    } catch (error) {
      console.error("Error enhancing text:", error);
      toast({
        title: "Enhancement Failed",
        description: "There was an error converting your text. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAddToDocument = () => {
    if (enhancedText) {
      onAddToDocument(enhancedText);
      setUserInput('');
      setEnhancedText('');
      setShowPreview(false);
      toast({
        title: "Added to Document",
        description: "Your enhanced legal text has been added to the document.",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-lg font-semibold">AI Legal Language Enhancement</label>
        <p className="text-sm text-muted-foreground">
          Enter any custom text or requirements, and our AI will convert it into formal legal language 
          that can be added to your document.
        </p>
      </div>
      
      <Textarea
        placeholder="Enter your plain language text here. For example: 'Users must be 18 years or older to use our service.'"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        className="min-h-[100px]"
      />
      
      <div className="flex justify-end">
        <Button 
          onClick={handleEnhanceText}
          disabled={!userInput.trim() || isProcessing}
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Enhancing...
            </>
          ) : (
            "Convert to Legal Language"
          )}
        </Button>
      </div>
      
      {showPreview && enhancedText && (
        <Card className="p-4 space-y-4">
          <div>
            <h4 className="font-medium mb-2">Enhanced Legal Text:</h4>
            <div 
              className="border rounded-md p-3 bg-gray-50"
              dangerouslySetInnerHTML={{ __html: enhancedText }}
            />
          </div>
          
          <div className="flex justify-end">
            <Button onClick={handleAddToDocument} variant="default">
              Add to Document
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default AiEnhancementSection;


import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { enhanceToLegalLanguage, convertToLegalClause } from '@/utils/legalLanguageGenerator';

interface AiEnhancementSectionProps {
  onAddToDocument: (enhancedText: string) => void;
}

const AiEnhancementSection = ({ onAddToDocument }: AiEnhancementSectionProps) => {
  const [userInput, setUserInput] = useState('');
  const [enhancedText, setEnhancedText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const handleEnhanceText = () => {
    if (!userInput.trim()) return;
    
    setIsProcessing(true);
    
    try {
      // Generate a title based on the content
      const words = userInput.split(' ');
      const potentialTitle = words.slice(0, 3).join(' ').toUpperCase();
      const clauseTitle = `${potentialTitle} PROVISION`;
      
      // Convert to legal language
      const enhanced = convertToLegalClause(userInput, clauseTitle);
      setEnhancedText(enhanced);
      setShowPreview(true);
    } catch (error) {
      console.error("Error enhancing text:", error);
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
          {isProcessing ? "Enhancing..." : "Convert to Legal Language"}
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

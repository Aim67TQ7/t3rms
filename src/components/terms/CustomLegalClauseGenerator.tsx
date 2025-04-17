
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Check, X, Loader2 } from "lucide-react";

interface CustomLegalClauseGeneratorProps {
  onAddToDocument: (clause: string) => void;
}

const EXAMPLE_CLAUSES = [
  "Users must clear cache memory after each session",
  "The company will not refund after 30 days of purchase",
  "All disputes will be resolved through arbitration",
  "Customers must provide accurate information during registration",
];

const CustomLegalClauseGenerator = ({ onAddToDocument }: CustomLegalClauseGeneratorProps) => {
  const [clauseTitle, setClauseTitle] = useState('');
  const [clauseContent, setClauseContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedClause, setGeneratedClause] = useState('');

  const generateLegalClause = () => {
    if (!clauseTitle.trim() || !clauseContent.trim()) {
      return;
    }
    
    setIsGenerating(true);
    
    // Simulate AI conversion with a timeout (this would be replaced with actual API call)
    setTimeout(() => {
      // Generate legal-sounding clause with title and formal language
      const formalClause = `
        <h3>${clauseTitle.toUpperCase()}</h3>
        <p>
          It is hereby acknowledged, understood, and agreed upon by all parties that 
          ${clauseContent}. The aforementioned terms shall be construed in accordance 
          with the laws of the applicable jurisdiction and shall be binding upon all 
          relevant parties. Failure to comply with these provisions may result in 
          termination of services, legal action, or such other remedies as may be 
          available under applicable law.
        </p>
      `;
      
      setGeneratedClause(formalClause);
      setIsGenerating(false);
    }, 1500);
  };
  
  const handleAddToDocument = () => {
    if (generatedClause) {
      onAddToDocument(generatedClause);
      setClauseTitle('');
      setClauseContent('');
      setGeneratedClause('');
    }
  };
  
  const handleUseExample = (example: string) => {
    setClauseContent(example);
    setClauseTitle(example.split(' ').slice(0, 3).join(' '));
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Custom Legal Clause Generator</h3>
        <p className="text-sm text-muted-foreground">
          Create custom legal clauses in formal, professional language
        </p>
      </div>
      
      {!generatedClause ? (
        <Card>
          <CardHeader>
            <CardTitle>Create New Clause</CardTitle>
            <CardDescription>
              Enter the title and content for your custom legal clause
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="clause-title">Clause Title</Label>
              <Input 
                id="clause-title" 
                placeholder="e.g., Data Storage" 
                value={clauseTitle}
                onChange={(e) => setClauseTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clause-content">Clause Content</Label>
              <Textarea 
                id="clause-content" 
                placeholder="Describe what you want this clause to enforce..." 
                className="min-h-[120px]"
                value={clauseContent}
                onChange={(e) => setClauseContent(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-medium">Example clauses:</p>
              <div className="flex flex-wrap gap-2">
                {EXAMPLE_CLAUSES.map((example, index) => (
                  <Button 
                    key={index} 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleUseExample(example)}
                  >
                    {example}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={generateLegalClause}
              disabled={!clauseTitle.trim() || !clauseContent.trim() || isGenerating}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                'Generate Legal Clause'
              )}
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Generated Legal Clause</CardTitle>
            <CardDescription>
              Review your formatted legal clause
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div 
              className="border rounded-md p-4 bg-gray-50"
              dangerouslySetInnerHTML={{ __html: generatedClause }}
            />
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={() => setGeneratedClause('')}
            >
              <X className="mr-2 h-4 w-4" />
              Start Over
            </Button>
            <Button 
              onClick={handleAddToDocument}
              variant="default"
            >
              <Check className="mr-2 h-4 w-4" />
              Add to Document
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default CustomLegalClauseGenerator;

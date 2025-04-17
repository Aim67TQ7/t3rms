
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface LegalPreviewProps {
  content: string;
  businessName: string;
  policyTypes: string[];
  onDownload: (format: string) => void;
}

export const LegalPreview = ({ 
  content, 
  businessName, 
  policyTypes = [], 
  onDownload 
}: LegalPreviewProps) => {
  const [previewFormat, setPreviewFormat] = useState("html");
  const [wordCount, setWordCount] = useState(0);
  const [pageEstimate, setPageEstimate] = useState(0);

  useEffect(() => {
    if (content) {
      // Count words in the text (strip HTML tags first)
      const text = content.replace(/<[^>]*>/g, '');
      const words = text.split(/\s+/).filter(word => word.length > 0);
      setWordCount(words.length);
      
      // Estimate pages (average 500 words per page)
      setPageEstimate(Math.ceil(words.length / 500));
    }
  }, [content]);

  // Function to convert HTML to Markdown
  const htmlToMarkdown = (html: string) => {
    return html
      .replace(/<h1>(.*?)<\/h1>/g, '# $1')
      .replace(/<h2>(.*?)<\/h2>/g, '## $1')
      .replace(/<h3>(.*?)<\/h3>/g, '### $1')
      .replace(/<p>(.*?)<\/p>/g, '$1\n\n')
      .replace(/<br>/g, '\n')
      .replace(/<ul>(.*?)<\/ul>/gs, '$1')
      .replace(/<ol.*?>(.*?)<\/ol>/gs, '$1')
      .replace(/<li>(.*?)<\/li>/g, '- $1\n')
      .replace(/<strong>(.*?)<\/strong>/g, '**$1**')
      .replace(/<em>(.*?)<\/em>/g, '*$1*')
      .replace(/<[^>]*>/g, '');
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap justify-between items-center mb-4">
        <div className="flex flex-wrap gap-2 items-center">
          <h3 className="text-lg font-medium">Preview</h3>
          <div className="flex gap-2">
            {policyTypes.map((type, index) => (
              <Badge key={index} variant="outline" className="capitalize">
                {type.replace('-', ' ')}
              </Badge>
            ))}
          </div>
          <div className="text-sm text-muted-foreground">
            {wordCount.toLocaleString()} words • approx. {pageEstimate} pages
          </div>
        </div>
        <div className="flex space-x-2 mt-2 sm:mt-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDownload('html')}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            HTML
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDownload('pdf')}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            PDF
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDownload('docx')}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            DOCX
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="html" onValueChange={setPreviewFormat}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="html">HTML</TabsTrigger>
          <TabsTrigger value="text">Plain Text</TabsTrigger>
          <TabsTrigger value="markdown">Markdown</TabsTrigger>
        </TabsList>
        <TabsContent value="html" className="mt-4">
          {content ? (
            <div className="border rounded-md p-4 bg-white max-h-[600px] overflow-auto">
              <div dangerouslySetInnerHTML={{ __html: content }} />
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No content generated yet. Fill out the form and click "Generate" to create your document.
            </div>
          )}
        </TabsContent>
        <TabsContent value="text" className="mt-4">
          {content ? (
            <div className="border rounded-md p-4 bg-white font-mono whitespace-pre-wrap max-h-[600px] overflow-auto">
              {content.replace(/<[^>]*>/g, '')}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No content generated yet. Fill out the form and click "Generate" to create your document.
            </div>
          )}
        </TabsContent>
        <TabsContent value="markdown" className="mt-4">
          {content ? (
            <div className="border rounded-md p-4 bg-white font-mono whitespace-pre-wrap max-h-[600px] overflow-auto">
              {htmlToMarkdown(content)}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No content generated yet. Fill out the form and click "Generate" to create your document.
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LegalPreview;


import { Card, CardHeader, CardContent } from "@/components/ui/card";
import ReactMarkdown from 'react-markdown';
import { formatAnalysisResults } from '@/utils/analysisFormatter';

interface AnalysisResultProps {
  analysisResult: any | null;
}

const MarkdownComponents = {
  h1: ({ node, ...props }: any) => <h1 className="text-xl font-bold mt-0 mb-2" {...props} />,
  h2: ({ node, ...props }: any) => <h2 className="text-lg font-semibold mt-4 mb-2" {...props} />,
  h3: ({ node, ...props }: any) => <h3 className="text-md font-medium mt-3 mb-1" {...props} />,
  p: ({ node, ...props }: any) => <p className="my-1 text-sm" {...props} />,
  pre: ({ node, ...props }: any) => <pre className="bg-muted p-2 rounded-md overflow-x-auto my-2 text-xs" {...props} />,
  code: ({ node, inline, ...props }: any) => 
    inline ? 
      <code className="px-1 py-0.5 bg-muted rounded text-xs" {...props} /> : 
      <code className="block p-1 my-1 bg-muted rounded-md text-xs overflow-x-auto whitespace-pre-wrap" {...props} />
};

const AnalysisResult = ({ analysisResult }: AnalysisResultProps) => {
  // Make sure we format the content for display
  let formattedContent = '';
  
  if (analysisResult) {
    formattedContent = formatAnalysisResults(analysisResult);
  }

  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-semibold">Analysis Result</h2>
      </CardHeader>
      <CardContent>
        {analysisResult ? (
          <div className="prose max-w-none prose-sm">
            <ReactMarkdown components={MarkdownComponents}>
              {formattedContent}
            </ReactMarkdown>
          </div>
        ) : (
          <p>No analysis result yet.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default AnalysisResult;

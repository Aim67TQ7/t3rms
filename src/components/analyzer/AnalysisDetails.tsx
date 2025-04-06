
import ReactMarkdown from 'react-markdown';
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatAnalysisResults } from '@/utils/analysisFormatter';

interface AnalysisDetailsProps {
  analysisResults: any;
}

const AnalysisDetails = ({ analysisResults }: AnalysisDetailsProps) => {
  return (
    <Card className="w-full overflow-hidden">
      <CardContent className="pt-6">
        <ScrollArea className="h-[500px] pr-4">
          <div className="prose prose-sm max-w-none dark:prose-invert">
            {analysisResults ? (
              <ReactMarkdown 
                className="break-words whitespace-normal"
                components={{
                  h1: ({ node, ...props }) => <h1 className="text-2xl font-bold mt-0 mb-4 text-primary" {...props} />,
                  h2: ({ node, ...props }) => <h2 className="text-xl font-semibold mt-6 mb-3 text-accent" {...props} />,
                  h3: ({ node, ...props }) => <h3 className="text-lg font-medium mt-4 mb-2" {...props} />,
                  p: ({ node, ...props }) => <p className="my-2 leading-relaxed" {...props} />,
                  ul: ({ node, ...props }) => <ul className="my-2 pl-6 list-disc" {...props} />,
                  ol: ({ node, ...props }) => <ol className="my-2 pl-6 list-decimal" {...props} />,
                  li: ({ node, ...props }) => <li className="mb-1" {...props} />,
                  code: ({ node, inline, ...props }) => 
                    inline ? 
                      <code className="px-1 py-0.5 bg-muted rounded text-sm" {...props} /> : 
                      <code className="block p-2 my-2 bg-muted rounded-md text-sm overflow-x-auto whitespace-pre-wrap" {...props} />
                }}
              >
                {formatAnalysisResults(analysisResults)}
              </ReactMarkdown>
            ) : (
              <p className="text-muted-foreground">No detailed analysis results available for this entry.</p>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default AnalysisDetails;

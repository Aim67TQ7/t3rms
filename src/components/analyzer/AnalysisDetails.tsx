
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
              <ReactMarkdown className="break-words whitespace-normal">
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

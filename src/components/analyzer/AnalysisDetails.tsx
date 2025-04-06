
import ReactMarkdown from 'react-markdown';
import { Card, CardContent } from "@/components/ui/card";
import { formatAnalysisResults } from '@/utils/analysisFormatter';

interface AnalysisDetailsProps {
  analysisResults: any;
}

const AnalysisDetails = ({ analysisResults }: AnalysisDetailsProps) => {
  return (
    <Card className="max-h-[500px] overflow-y-auto">
      <CardContent className="pt-6">
        <div className="prose max-w-none break-words whitespace-pre-wrap">
          {analysisResults ? (
            <ReactMarkdown>
              {formatAnalysisResults(analysisResults)}
            </ReactMarkdown>
          ) : (
            <p className="text-muted-foreground">No detailed analysis results available for this entry.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalysisDetails;

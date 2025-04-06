
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import ReactMarkdown from 'react-markdown';
import { formatAnalysisResults } from '@/utils/analysisFormatter';

interface AnalysisResultProps {
  analysisResult: any | null;
}

const AnalysisResult = ({ analysisResult }: AnalysisResultProps) => {
  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-semibold">Analysis Result</h2>
      </CardHeader>
      <CardContent>
        {analysisResult ? (
          <div className="prose max-w-none">
            <ReactMarkdown>
              {formatAnalysisResults(analysisResult)}
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

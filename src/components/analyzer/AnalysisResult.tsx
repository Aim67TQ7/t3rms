
import { Card, CardHeader, CardContent } from "@/components/ui/card";

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
          <pre className="whitespace-pre-wrap break-words">
            {JSON.stringify(analysisResult, null, 2)}
          </pre>
        ) : (
          <p>No analysis result yet.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default AnalysisResult;

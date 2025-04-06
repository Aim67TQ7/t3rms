
import { Card, CardHeader, CardContent } from "@/components/ui/card";

interface EmbeddedAnalysisToolProps {
  height?: string;
}

const EmbeddedAnalysisTool = ({ height = "500px" }: EmbeddedAnalysisToolProps) => {
  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader>
        <h2 className="text-lg font-semibold">T3rms Analysis Tool</h2>
      </CardHeader>
      <CardContent className="flex-1">
        <div 
          className="iframe-container w-full h-full min-h-[500px]" 
          style={{ overflow: 'hidden', borderRadius: '0.375rem', height }}
        >
          <iframe 
            src="https://T3rms.replit.app" 
            title="T3rms Analysis Tool"
            className="w-full h-full border-none"
            allow="fullscreen"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default EmbeddedAnalysisTool;

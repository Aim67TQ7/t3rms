
import { Card, CardHeader, CardContent } from "@/components/ui/card";

const EmbeddedAnalysisTool = () => {
  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-semibold">T3rms Analysis Tool</h2>
      </CardHeader>
      <CardContent>
        <div className="iframe-container" style={{ width: '100%', height: '500px', overflow: 'hidden', borderRadius: '0.375rem' }}>
          <iframe 
            src="https://T3rms.replit.app" 
            title="T3rms Analysis Tool"
            style={{ width: '100%', height: '100%', border: 'none' }}
            allow="fullscreen"
          ></iframe>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmbeddedAnalysisTool;

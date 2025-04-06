
import { EmbeddedAnalysisTool } from "@/components/analyzer/EmbeddedAnalysisTool";
import Navbar from "@/components/navbar";

const EmbeddedTool = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 py-8 flex-1 flex flex-col">
        <h1 className="text-3xl font-bold mb-6">T3rms Analysis Tool</h1>
        <p className="text-gray-600 mb-8">
          Use this embedded tool to quickly analyze your contracts without leaving the platform.
        </p>
        <div className="flex-1 flex flex-col">
          <EmbeddedAnalysisTool />
        </div>
      </div>
    </div>
  );
};

export default EmbeddedTool;

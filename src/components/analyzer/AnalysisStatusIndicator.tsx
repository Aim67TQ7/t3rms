
import { Progress } from "@/components/ui/progress";
import { Loader2 } from "lucide-react";

interface AnalysisStatusIndicatorProps {
  loading: boolean;
  currentStep?: string;
}

const AnalysisStatusIndicator = ({ loading, currentStep }: AnalysisStatusIndicatorProps) => {
  if (!loading) return null;

  return (
    <div className="w-full space-y-2 animate-in fade-in duration-300">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>
          {currentStep || "Analyzing document..."}
        </span>
      </div>
      <Progress value={100} className="animate-pulse" />
    </div>
  );
};

export default AnalysisStatusIndicator;

import { Progress } from "@/components/ui/progress";
import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

interface AnalysisStatusIndicatorProps {
  loading: boolean;
  currentStep?: string;
}

const AnalysisStatusIndicator = ({ loading, currentStep }: AnalysisStatusIndicatorProps) => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [progressPercent, setProgressPercent] = useState(0);

  useEffect(() => {
    let interval: number | null = null;
    
    if (loading) {
      setElapsedTime(0);
      setProgressPercent(0);
      
      interval = window.setInterval(() => {
        setElapsedTime(prev => prev + 1);
        
        // For large documents, we want to simulate progress but keep it under 100%
        // until we're actually done
        setProgressPercent(prev => {
          if (prev < 90) {
            return prev + (Math.random() * 0.5);
          }
          return prev;
        });
      }, 1000);
    } else {
      setProgressPercent(100);
    }
    
    return () => {
      if (interval) {
        window.clearInterval(interval);
      }
    };
  }, [loading]);

  if (!loading && progressPercent === 0) return null;

  return (
    <div className="w-full space-y-2 animate-in fade-in duration-300">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>
            {currentStep || "Analyzing document..."}
            {elapsedTime > 30 && " (large document, this might take a few minutes)"}
          </span>
        </div>
        {elapsedTime > 0 && (
          <span className="text-xs">
            {Math.floor(elapsedTime / 60)}:{(elapsedTime % 60).toString().padStart(2, '0')}
          </span>
        )}
      </div>
      <Progress value={progressPercent} className={loading ? "animate-pulse" : ""} />
      {elapsedTime > 60 && (
        <p className="text-xs text-muted-foreground mt-1">
          Analysis of large documents can take several minutes. Thank you for your patience.
        </p>
      )}
    </div>
  );
};

export default AnalysisStatusIndicator;

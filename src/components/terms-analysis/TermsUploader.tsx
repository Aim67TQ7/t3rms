
import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from "@/components/ui/button";
import { FileUp, FileText, ArrowRight, AlertCircle } from 'lucide-react';
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface TermsUploaderProps {
  file: File | null;
  setFile: (file: File | null) => void;
  setText: (text: string) => void;
  onAnalyze: () => void;
  loading: boolean;
}

const MAX_FILE_SIZE = 2 * 1024 * 1024;
const FREE_ANALYSIS_LIMIT = 2;

const TermsUploader = ({ file, setFile, setText, onAnalyze, loading }: TermsUploaderProps) => {
  const [directInputText, setDirectInputText] = useState('');
  const [fileSizeError, setFileSizeError] = useState<string | null>(null);
  const [showLimitReached, setShowLimitReached] = useState(false);
  const { toast } = useToast();

  // Utility to get analysis count
  const getFreeAnalysesUsed = () => {
    const val = localStorage.getItem('anonymous_analysis_count');
    return val ? parseInt(val, 10) : 0;
  };

  // Hide upload file UI, only allow paste text for free users
  const handleTextInput = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;

    if (value.length > MAX_FILE_SIZE / 2) {
      toast({
        title: "Text too long",
        description: "The text is too long for analysis. Please shorten it.",
        variant: "destructive",
      });
      return;
    }

    setDirectInputText(value);
    setText(value);
    setFile(null);
    setFileSizeError(null);
  };

  // Check free-tier use before running onAnalyze
  const handleAnalyzeClick = () => {
    // Reset the limit check state first to ensure we don't show stale warnings
    setShowLimitReached(false);
    
    // Only check limits if there's actually text to analyze
    if (directInputText.trim()) {
      const usedCount = getFreeAnalysesUsed();
      if (usedCount >= FREE_ANALYSIS_LIMIT) {
        setShowLimitReached(true);
        toast({
          title: "Free Limit Exceeded",
          description:
            "You have reached the free analysis limit. Please purchase 50 credits to continue analyzing documents.",
          variant: "destructive",
        });
        return;
      }
    }
    
    onAnalyze();
  };

  return (
    <div className="space-y-6">
      {/* Only show paste text, no file upload or input method choice */}
      <div className="space-y-2">
        <div className="mb-2 text-md font-semibold text-blue-700">Paste Text Only (Free Tier)</div>
        <Textarea
          placeholder="Paste your contract text here..."
          className={`min-h-[200px] transition-all duration-300 ${
            directInputText
              ? 'border-green-500 focus:border-green-500 focus:ring-green-500'
              : 'focus:border-blue-500 focus:ring-blue-500'
          }`}
          value={directInputText}
          onChange={handleTextInput}
          disabled={showLimitReached}
        />
        <p className="text-xs text-gray-500 text-right">Max ~1MB of text</p>
      </div>

      <button
        onClick={handleAnalyzeClick}
        disabled={!directInputText || loading || !!fileSizeError || showLimitReached}
        className={`w-full py-6 text-lg rounded ${
          directInputText && !loading && !fileSizeError && !showLimitReached
            ? 'bg-blue-600 hover:bg-blue-700 text-white'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
      >
        {loading ? (
          <span className="animate-pulse">Analyzing...</span>
        ) : (
          <>
            <span className="inline-flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              Analyze Contract
            </span>
          </>
        )}
      </button>

      {showLimitReached && (
        <div className="bg-amber-100 border border-amber-300 rounded-md p-4 mt-2">
          <div className="text-amber-800 font-medium mb-1">
            Free Tier Limit Reached
          </div>
          <div className="text-amber-700 mb-2">
            You have reached your free usage limit. To continue, please purchase a 50-credit package.
          </div>
          <button
            className="bg-amber-500 hover:bg-amber-600 text-white py-2 px-4 rounded"
            // Placeholder: add actual purchase flow
            onClick={() => toast({
              title: 'Purchase Credits',
              description: 'Purchase flow coming soon.',
            })}
          >
            Buy 50 Credits
          </button>
        </div>
      )}

      {fileSizeError && (
        <div className="text-red-600 text-center">{fileSizeError}</div>
      )}
    </div>
  );
};

export default TermsUploader;

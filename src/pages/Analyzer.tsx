import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/navbar/useAuth";
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import AuthPrompt from '@/components/AuthPrompt';
import DropzoneUploader from '@/components/analyzer/DropzoneUploader';
import AnalysisHistory from '@/components/analyzer/AnalysisHistory';
import { ContractAnalysis } from '@/components/analyzer/AnalysisHistory';
import { 
  hasReachedAnonymousLimit, 
  incrementAnonymousAnalysisCount,
  storePendingAnalysis,
  getPendingAnalysis
} from '@/utils/anonymousUsage';
import { Button } from "@/components/ui/button";
import { FileText, Plus } from 'lucide-react';
import Seo from '@/components/Seo';

const Analyzer = () => {
  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const { toast } = useToast();
  const { isAuthenticated, userId } = useAuth();
  const navigate = useNavigate();

  const { data: analysisResults, isLoading: analysisLoading, refetch } = useQuery<ContractAnalysis[]>({
    queryKey: ['analysisResults', userId],
    queryFn: async () => {
      if (!isAuthenticated) return [];
      
      const { data, error } = await supabase
        .from('contract_analyses')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching analysis results:', error);
        return [];
      }
      
      return data || [];
    },
    enabled: isAuthenticated
  });

  useEffect(() => {
    if (isAuthenticated) {
      const pendingAnalysis = getPendingAnalysis();
      if (pendingAnalysis) {
        handlePendingAnalysis(pendingAnalysis);
      }
    }
  }, [isAuthenticated]);

  const handlePendingAnalysis = async (analysisData: any) => {
    try {
      const { error: saveError } = await supabase
        .from('contract_analyses')
        .insert({
          user_id: userId,
          filename: analysisData.filename,
          file_type: analysisData.fileType,
          file_size: analysisData.fileSize,
          status: 'completed',
          analysis_score: analysisData.overallScore || 0,
          analysis_results: analysisData,
          completed_at: new Date().toISOString()
        });
        
      if (saveError) {
        throw saveError;
      }

      toast({
        title: "Analysis Available",
        description: "Your analysis results are now available to view.",
      });

      refetch();
    } catch (error: any) {
      console.error("Error saving pending analysis:", error);
      toast({
        title: "Error",
        description: "Failed to save your analysis results.",
        variant: "destructive",
      });
    }
  };

  const handleAnalyze = async () => {
    if (!text && !file) {
      toast({
        title: "Error",
        description: "Please enter text or upload a file.",
        variant: "destructive",
      });
      return;
    }

    if (!isAuthenticated && hasReachedAnonymousLimit()) {
      toast({
        title: "Analysis Limit Reached",
        description: "You've reached the limit of free analyses. Please subscribe to continue.",
        variant: "destructive",
      });
      setShowAuthPrompt(true);
      return;
    }

    setLoading(true);

    try {
      let fileContent = '';
      let fileType = '';
      let fileName = '';
      let fileSize = 0;
      
      if (file) {
        fileContent = await readFileAsBase64(file);
        fileType = file.type;
        fileName = file.name;
        fileSize = file.size;
      } else if (text) {
        fileContent = `data:text/plain;base64,${btoa(unescape(encodeURIComponent(text)))}`;
        fileType = 'text/plain';
        fileName = 'document.txt';
        fileSize = new Blob([text]).size;
      }

      const { data, error } = await supabase.functions.invoke('analyze-contract', {
        body: {
          content: fileContent,
          fileType: fileType,
          fileName: fileName
        }
      });

      if (error) {
        throw new Error(error.message || "Error analyzing document");
      }

      if (!isAuthenticated) {
        incrementAnonymousAnalysisCount();
        storePendingAnalysis({
          ...data,
          filename: fileName,
          fileType: fileType,
          fileSize: fileSize
        });
        setShowAuthPrompt(true);
        toast({
          title: "Analysis Complete",
          description: "Please sign up or log in to view your results.",
        });
      } else {
        const { error: saveError } = await supabase
          .from('contract_analyses')
          .insert({
            user_id: userId,
            filename: fileName,
            file_type: fileType,
            file_size: fileSize,
            status: 'completed',
            analysis_score: data.overallScore || 0,
            analysis_results: data,
            completed_at: new Date().toISOString()
          });
          
        if (saveError) {
          throw saveError;
        }

        toast({
          title: "Success",
          description: "Contract analysis completed.",
        });

        refetch();
      }
    } catch (error: any) {
      console.error("There was an error analyzing the text:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to analyze document.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const readFileAsBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result as string);
      };
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsDataURL(file);
    });
  };

  return (
    <>
      <Seo 
        title="T3RMS - AI Document Analyzer | Instant Contract Analysis"
        description="Upload your legal documents for instant AI analysis. Get risk assessments, identify unusual clauses, and receive actionable insights with T3RMS."
      />
      <div className="container mx-auto py-6 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Analyze T3RMS</h1>
          <Button
            variant="outline"
            onClick={() => navigate("/tcgenerator")}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Create Terms & Conditions
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-2">
            <DropzoneUploader 
              file={file}
              setFile={setFile}
              setText={setText}
              onAnalyze={handleAnalyze}
              loading={loading}
            />
            
            {showAuthPrompt && !isAuthenticated && (
              <div className="mt-4">
                <AuthPrompt 
                  onDismiss={() => setShowAuthPrompt(false)} 
                  showDismiss={true}
                />
              </div>
            )}
          </div>

          {isAuthenticated && (
            <div className="lg:col-span-10">
              <h2 className="text-2xl font-bold mb-4">Analysis History</h2>
              <AnalysisHistory 
                analysisResults={analysisResults}
                isLoading={analysisLoading}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Analyzer;

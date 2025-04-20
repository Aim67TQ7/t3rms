import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { FileText, Plus, AlertCircle } from 'lucide-react';
import Seo from '@/components/Seo';
import AnalysisStatusIndicator from '@/components/analyzer/AnalysisStatusIndicator';

const MAX_CONTENT_SIZE = 2 * 1024 * 1024; // 2MB

const Analyzer = () => {
  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [currentStep, setCurrentStep] = useState('Preparing document...');
  const [apiKeyMissing, setApiKeyMissing] = useState(false);
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
      if (!analysisData) {
        console.log("No pending analysis data available");
        return;
      }

      const { error: saveError } = await supabase
        .from('contract_analyses')
        .insert({
          user_id: userId,
          filename: analysisData.filename || 'Unknown file',
          file_type: analysisData.fileType || 'text/plain',
          file_size: analysisData.fileSize || 0,
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

    console.log("Text content length:", text.length);
    
    if (text.length > MAX_CONTENT_SIZE / 2) {
      toast({
        title: "Content Too Large",
        description: "The document is too large to process. Please upload a smaller document or reduce the text length.",
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
    setCurrentStep('Preparing document...');
    setApiKeyMissing(false);

    try {
      let fileContent = '';
      let fileType = '';
      let fileName = '';
      let fileSize = 0;
      
      if (file) {
        setCurrentStep('Converting document...');
        fileContent = `data:text/plain;base64,${btoa(unescape(encodeURIComponent(text)))}`;
        fileType = file.type || 'text/plain';
        fileName = file.name || 'document.txt';
        fileSize = file.size || new Blob([text]).size;
      } else if (text) {
        setCurrentStep('Processing text...');
        fileContent = `data:text/plain;base64,${btoa(unescape(encodeURIComponent(text)))}`;
        fileType = 'text/plain';
        fileName = 'document.txt';
        fileSize = new Blob([text]).size;
      }

      console.log("Sending content to analyze-contract function, content size:", fileContent.length);
      
      setCurrentStep('Analyzing with AI...');
      const { data, error } = await supabase.functions.invoke('rapid-action', {
        body: {
          content: fileContent,
          fileType: fileType,
          fileName: fileName
        }
      });

      if (error) {
        throw new Error(error.message || "Error analyzing document");
      }

      // Check if the response contains an error message about the API key
      if (data && data.error && data.message && data.message.includes("ANTHROPIC_API_KEY is not set")) {
        setApiKeyMissing(true);
        throw new Error("The Anthropic API key is not configured. Please contact the administrator.");
      }

      if (!data) {
        throw new Error("No analysis data received from the server");
      }

      console.log("Analysis data received:", data);

      if (!isAuthenticated) {
        incrementAnonymousAnalysisCount();
        storePendingAnalysis({
          ...data,
          filename: fileName,
          fileType: fileType,
          fileSize: fileSize,
          overallScore: data.overallScore || 0
        });
        setShowAuthPrompt(true);
        toast({
          title: "Analysis Complete",
          description: "Please sign up or log in to view your results.",
        });
      } else {
        setCurrentStep('Saving results...');
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
    } catch (error) {
      console.error("There was an error analyzing the text:", error);
      
      let errorMessage = "Failed to analyze document.";
      
      if (apiKeyMissing) {
        errorMessage = "The AI service is not properly configured. Please contact the administrator to set up the Anthropic API key.";
      } else if (error.message && error.message.includes("send a request to the Edge Function")) {
        errorMessage = "The document is too large or complex to analyze. Please try with a smaller document or paste a portion of the text.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setCurrentStep('');
    }
  };

  return (
    <>
      <Seo 
        title="T3RMS - AI Document Analyzer | Instant Contract Analysis"
        description="Upload your legal documents for instant AI analysis. Get risk assessments, identify unusual clauses, and receive actionable insights with T3RMS."
      />
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto py-6 px-4">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Smart Contract Analysis
            </h1>
            <Button
              variant="outline"
              onClick={() => navigate("/tcgenerator")}
              className="flex items-center gap-2 bg-white/80 backdrop-blur-sm hover:bg-white"
            >
              <Plus className="h-4 w-4" />
              Create Terms & Conditions
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-12 xl:col-span-12">
              <div className="min-h-[70vh] flex items-center justify-center p-8">
                <div className="w-full max-w-4xl">
                  {apiKeyMissing && (
                    <div className="mb-6 p-4 border border-amber-300 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                      <div className="flex items-start">
                        <AlertCircle className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
                        <div>
                          <h3 className="font-medium text-amber-800 dark:text-amber-300">API Configuration Required</h3>
                          <p className="text-amber-700 dark:text-amber-400 text-sm mt-1">
                            The Anthropic API key is not configured. The document analysis feature requires this API key to be set in 
                            the Supabase edge functions environment. Please contact the administrator to configure this.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                
                  <DropzoneUploader 
                    file={file}
                    setFile={setFile}
                    setText={setText}
                    onAnalyze={handleAnalyze}
                    loading={loading}
                  />
                
                  {loading && (
                    <div className="mt-4">
                      <AnalysisStatusIndicator loading={loading} currentStep={currentStep} />
                    </div>
                  )}
                
                  {showAuthPrompt && !isAuthenticated && (
                    <div className="mt-4">
                      <AuthPrompt 
                        onDismiss={() => setShowAuthPrompt(false)} 
                        showDismiss={true}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {isAuthenticated && (
              <div className="lg:col-span-12">
                <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">Analysis History</h2>
                <AnalysisHistory 
                  analysisResults={analysisResults}
                  isLoading={analysisLoading}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Analyzer;


import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/navbar/useAuth";
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import AuthPrompt from '@/components/AuthPrompt';
import { ContractAnalysis } from '@/components/analyzer/AnalysisHistory';
import { 
  hasReachedAnonymousLimit, 
  incrementAnonymousAnalysisCount,
  storePendingAnalysis,
  getPendingAnalysis
} from '@/utils/anonymousUsage';
import { Button } from "@/components/ui/button";
import { FileText, Copy, AlertCircle, FileSearch, Calendar } from 'lucide-react';
import Seo from '@/components/Seo';
import TermsUploader from '@/components/terms-analysis/TermsUploader';
import AnalysisStatusIndicator from '@/components/analyzer/AnalysisStatusIndicator';
import TrafficLightHeatmap from '@/components/terms-analysis/TrafficLightHeatmap';
import CounterProposalGenerator from '@/components/terms-analysis/CounterProposalGenerator';
import AnalysisRevisionHistory from '@/components/terms-analysis/AnalysisRevisionHistory';
import SpecificHeuristics from '@/components/terms-analysis/SpecificHeuristics';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const MAX_CONTENT_SIZE = 2 * 1024 * 1024; // 2MB

const TermAnalysis = () => {
  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [currentStep, setCurrentStep] = useState('Preparing document...');
  const [apiKeyMissing, setApiKeyMissing] = useState(false);
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [compareMode, setCompareMode] = useState(false);
  const [selectedAnalysisId, setSelectedAnalysisId] = useState<string | null>(null);
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
    setAnalysisData(null);

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

      console.log("Sending content to rapid-action function, content size:", fileContent.length);
      
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
        throw new Error("The AI service is not properly configured. Please contact the administrator.");
      }

      if (!data) {
        throw new Error("No analysis data received from the server");
      }

      console.log("Analysis data received:", data);
      setAnalysisData(data);

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
          description: "Please sign up or log in to view your full results.",
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
    } catch (error: any) {
      console.error("There was an error analyzing the text:", error);
      
      let errorMessage = "Failed to analyze document.";
      
      if (apiKeyMissing) {
        errorMessage = "The AI service is not properly configured. Please contact the administrator to set up the API key.";
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
        title="T3RMS - Advanced Contract Analysis | Identify High-Risk Language"
        description="Upload contracts for advanced AI analysis. Identify high-risk language, get counter-proposals, and track revisions with our specialized contract analysis tool."
      />
      <div className="min-h-screen bg-[#0a0a0a] relative overflow-hidden">
        {/* Background gradients */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto py-6 px-4 relative z-10">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-purple-200 to-purple-300">
              Advanced Contract Analysis
            </h1>
            <Button
              variant="outline"
              onClick={() => navigate("/tcgenerator")}
              className="flex items-center gap-2 bg-purple-500/10 border-purple-500/20 text-purple-300 hover:bg-purple-500/20"
            >
              <FileText className="h-4 w-4" />
              Create Terms & Conditions
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-12 xl:col-span-12">
              {!analysisData ? (
                <div className="min-h-[70vh] flex items-center justify-center p-8">
                  <div className="w-full max-w-4xl">
                    {apiKeyMissing && (
                      <div className="mb-6 p-4 border border-amber-300/20 bg-amber-900/20 rounded-lg">
                        <div className="flex items-start">
                          <AlertCircle className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
                          <div>
                            <h3 className="font-medium text-amber-300">API Configuration Required</h3>
                            <p className="text-amber-400/80 text-sm mt-1">
                              The AI API key is not configured. The document analysis feature requires this API key to be set in 
                              the Supabase edge functions environment. Please contact the administrator to configure this.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  
                    <div className="flex justify-center items-center mb-8 space-x-4">
                      <div className="flex items-center text-purple-400">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-purple-500/10 border-2 border-purple-500/20">
                          1
                        </div>
                        <span className="ml-2 font-medium">Upload</span>
                      </div>
                      <div className="w-8 h-1 bg-purple-500/20"></div>
                      <div className="flex items-center text-purple-400/50">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-purple-500/5 border-2 border-purple-500/10">
                          2
                        </div>
                        <span className="ml-2 font-medium">Analyze</span>
                      </div>
                    </div>
                    
                    <TermsUploader 
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
              ) : (
                <div className="p-6 glass-dark rounded-lg">
                  <Tabs defaultValue="heatmap" className="w-full">
                    <TabsList className="grid w-full grid-cols-4 mb-4 bg-purple-500/10 border border-purple-500/20">
                      <TabsTrigger value="heatmap" className="flex items-center gap-2 data-[state=active]:bg-purple-500/20">
                        <FileText className="h-4 w-4" /> Risk Heatmap
                      </TabsTrigger>
                      <TabsTrigger value="counterproposal" className="flex items-center gap-2 data-[state=active]:bg-purple-500/20">
                        <Copy className="h-4 w-4" /> Counter-Proposal
                      </TabsTrigger>
                      <TabsTrigger value="heuristics" className="flex items-center gap-2 data-[state=active]:bg-purple-500/20">
                        <FileSearch className="h-4 w-4" /> Specific Issues
                      </TabsTrigger>
                      <TabsTrigger value="revisions" className="flex items-center gap-2 data-[state=active]:bg-purple-500/20">
                        <Calendar className="h-4 w-4" /> Revision History
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="heatmap">
                      <TrafficLightHeatmap analysisData={analysisData} />
                    </TabsContent>
                    
                    <TabsContent value="counterproposal">
                      <CounterProposalGenerator 
                        analysisData={analysisData} 
                        isPremium={isAuthenticated} 
                        onRequestPremium={() => setShowAuthPrompt(true)}
                      />
                    </TabsContent>
                    
                    <TabsContent value="heuristics">
                      <SpecificHeuristics analysisData={analysisData} />
                    </TabsContent>
                    
                    <TabsContent value="revisions">
                      <AnalysisRevisionHistory 
                        analysisResults={analysisResults || []} 
                        isLoading={analysisLoading}
                        setCompareMode={setCompareMode}
                        compareMode={compareMode}
                        selectedAnalysisId={selectedAnalysisId}
                        setSelectedAnalysisId={setSelectedAnalysisId}
                      />
                    </TabsContent>
                  </Tabs>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TermAnalysis;

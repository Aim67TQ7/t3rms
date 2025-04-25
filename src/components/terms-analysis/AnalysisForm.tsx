import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import AuthPrompt from '@/components/AuthPrompt';
import { hasReachedAnonymousLimit, incrementAnonymousAnalysisCount, storePendingAnalysis } from '@/utils/anonymousUsage';
import TermsUploader from '@/components/terms-analysis/TermsUploader';
import AnalysisStatusIndicator from '@/components/analyzer/AnalysisStatusIndicator';

interface AnalysisFormProps {
  isAuthenticated: boolean;
  userId?: string;
  analysisState: any;
}

const MAX_CONTENT_SIZE = 2 * 1024 * 1024; // 2MB

export const AnalysisForm = ({ isAuthenticated, userId, analysisState }: AnalysisFormProps) => {
  const {
    text,
    setText,
    file,
    setFile,
    loading,
    setLoading,
    showAuthPrompt,
    setShowAuthPrompt,
    currentStep,
    setCurrentStep,
    setApiKeyMissing,
    setAnalysisData,
    refetch
  } = analysisState;
  
  const { toast } = useToast();
  const navigate = useNavigate();

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
        fileContent = await convertFileToBase64(file);
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

      if (data && data.error && data.message && data.message.includes("ANTHROPIC_API_KEY is not set")) {
        setApiKeyMissing(true);
        throw new Error("The AI service is not properly configured. Please contact the administrator.");
      }

      if (!data) {
        throw new Error("No analysis data received from the server");
      }

      console.log("Analysis data received:", data);
      
      const processedData = ensureCorrectDataStructure(data);
      setAnalysisData(processedData);

      if (!isAuthenticated) {
        incrementAnonymousAnalysisCount();
        storePendingAnalysis({
          ...processedData,
          filename: fileName,
          fileType: fileType,
          fileSize: fileSize,
          overallScore: processedData.overallScore || 0
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
            analysis_score: processedData.overallScore || 0,
            analysis_results: processedData,
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
      
      if (error.message && error.message.includes("send a request to the Edge Function")) {
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

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const ensureCorrectDataStructure = (data: any) => {
    if (!data.criticalPoints) data.criticalPoints = [];
    if (!data.financialRisks) data.financialRisks = [];
    if (!data.unusualLanguage) data.unusualLanguage = [];
    if (!data.recommendations) data.recommendations = [];
    
    data.criticalPoints = data.criticalPoints.map((point: any) => ({
      title: point.title || "Critical Issue",
      description: point.description || point.issue || "Issue identified",
      severity: point.severity || "high",
      reference: {
        section: point.section || point.reference?.section || null,
        excerpt: point.excerpt || point.reference?.excerpt || null
      }
    }));
    
    data.financialRisks = data.financialRisks.map((risk: any) => ({
      title: risk.title || "Financial Risk",
      description: risk.description || risk.risk || "Financial risk identified",
      severity: risk.severity || "high",
      reference: {
        section: risk.section || risk.reference?.section || null,
        excerpt: risk.excerpt || risk.reference?.excerpt || null
      }
    }));
    
    data.unusualLanguage = data.unusualLanguage.map((item: any) => ({
      title: item.title || "Unusual Language",
      description: item.description || item.language || "Unusual language identified",
      severity: item.severity || "medium",
      reference: {
        section: item.section || item.reference?.section || null,
        excerpt: item.excerpt || item.reference?.excerpt || null
      }
    }));

    return data;
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-8">
      <div className="w-full max-w-4xl">
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
  );
};

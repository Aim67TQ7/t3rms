import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import AuthPrompt from '@/components/AuthPrompt';
import { hasReachedAnonymousLimit, incrementAnonymousAnalysisCount, storePendingAnalysis } from '@/utils/anonymousUsage';
import TermsUploader from '@/components/terms-analysis/TermsUploader';
import AnalysisStatusIndicator from '@/components/analyzer/AnalysisStatusIndicator';
import * as pdfjsLib from 'pdfjs-dist';

// Set worker source for PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.379/pdf.worker.min.mjs`;

interface AnalysisFormProps {
  isAuthenticated: boolean;
  userId?: string;
  analysisState: any;
}

const MAX_TEXT_LENGTH = 350000; // ~100k tokens for OpenAI

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

  // Extract text from PDF using PDF.js on client side
  const extractTextFromPDF = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const numPages = pdf.numPages;
    let extractedText = '';
    
    for (let i = 1; i <= numPages; i++) {
      setCurrentStep(`Extracting text from page ${i}/${numPages}...`);
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      extractedText += textContent.items.map((item: any) => item.str).join(' ') + '\n';
    }
    
    return extractedText;
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
    setCurrentStep('Preparing document...');
    setApiKeyMissing(false);
    setAnalysisData(null);

    try {
      let contentToAnalyze = '';
      let fileName = 'document.txt';
      let fileType = 'text/plain';
      let fileSize = 0;
      
      console.log("File state before processing:", file ? file.name : "No file");
      console.log("Text length:", text ? text.length : 0);
      
      if (file) {
        fileName = file.name || 'document.txt';
        fileType = file.type || 'text/plain';
        fileSize = file.size || 0;
        
        // Extract text based on file type
        if (file.type === 'application/pdf' || fileName.toLowerCase().endsWith('.pdf')) {
          setCurrentStep('Parsing PDF...');
          console.log("Extracting text from PDF:", fileName);
          contentToAnalyze = await extractTextFromPDF(file);
          console.log("PDF text extracted, length:", contentToAnalyze.length);
        } else {
          // For text files, read directly
          setCurrentStep('Reading file...');
          contentToAnalyze = await file.text();
        }
      } else if (text) {
        contentToAnalyze = text;
        fileSize = new Blob([text]).size;
      }

      // Truncate if too long
      if (contentToAnalyze.length > MAX_TEXT_LENGTH) {
        console.log(`Content too long (${contentToAnalyze.length}), truncating to ${MAX_TEXT_LENGTH}`);
        contentToAnalyze = contentToAnalyze.substring(0, MAX_TEXT_LENGTH) + 
          '\n\n[Document truncated due to size. Analysis based on first portion.]';
        toast({
          title: "Document Truncated",
          description: "Your document is very large. Analyzing the first portion.",
        });
      }

      console.log("Sending text to analyze-contract function, length:", contentToAnalyze.length);
      setCurrentStep('Analyzing with AI...');
      
      // Use Supabase client to invoke edge function with text content
      const { data, error } = await supabase.functions.invoke('analyze-contract', {
        body: {
          content: contentToAnalyze,
          fileType: 'text/plain',
          fileName: fileName
        }
      });

      if (error) {
        console.error("Supabase function error:", error);
        throw new Error(error.message || "Error analyzing document");
      }

      if (data && data.error) {
        if (data.message && data.message.includes("OPENAI_API_KEY is not set")) {
          setApiKeyMissing(true);
          throw new Error("The AI service is not properly configured. Please contact the administrator.");
        }
        throw new Error(data.error);
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
        errorMessage = "Unable to connect to the analysis service. Please try again.";
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

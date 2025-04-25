
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ContractAnalysis } from '@/components/analyzer/AnalysisHistory';
import { hasReachedAnonymousLimit, incrementAnonymousAnalysisCount, storePendingAnalysis, getPendingAnalysis } from '@/utils/anonymousUsage';

export const useContractAnalysis = (userId: string | undefined, isAuthenticated: boolean) => {
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

  return {
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
    apiKeyMissing,
    setApiKeyMissing,
    analysisData,
    setAnalysisData,
    compareMode,
    setCompareMode,
    selectedAnalysisId,
    setSelectedAnalysisId,
    analysisResults,
    analysisLoading,
    refetch,
    handlePendingAnalysis
  };
};

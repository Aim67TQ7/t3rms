import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/navbar/useAuth";
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import AuthPrompt from '@/components/AuthPrompt';
import DropzoneUploader from '@/components/analyzer/DropzoneUploader';
import AnalysisResult from '@/components/analyzer/AnalysisResult';
import AnalysisHistory from '@/components/analyzer/AnalysisHistory';
import { ContractAnalysis } from '@/components/analyzer/AnalysisHistory';

const Analyzer = () => {
  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const { toast } = useToast();
  const { isAuthenticated, userId } = useAuth();

  const { data: analysisResults, isLoading: analysisLoading, refetch } = useQuery<ContractAnalysis[]>({
    queryKey: ['analysisResults'],
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
      refetch();
    }
  }, [isAuthenticated, refetch]);

  const handleAnalyze = async () => {
    if (!isAuthenticated) {
      setShowAuthPrompt(true);
      return;
    }

    if (!text && !file) {
      toast({
        title: "Error",
        description: "Please enter text or upload a file.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setAnalysisResult(null);

    try {
      const formData = new FormData();
      formData.append('contract', file!);

      const response = await supabase.functions.invoke('analyze-contract', {
        body: formData
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      if (response.data.status === 'processing') {
        toast({
          title: "PDF Processing",
          description: "Your PDF is being analyzed. Check the history for results.",
        });
      } else {
        setAnalysisResult(response.data);
        
        toast({
          title: "Success",
          description: "Contract analysis completed.",
        });
      }

      refetch();
    } catch (error: any) {
      console.error("There was an error analyzing the text:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to analyze text.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Text Analyzer</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <DropzoneUploader 
            file={file}
            setFile={setFile}
            setText={setText}
            onAnalyze={handleAnalyze}
            loading={loading}
          />
        </div>

        <div>
          <AnalysisResult analysisResult={analysisResult} />
          
          {showAuthPrompt && !isAuthenticated && (
            <div className="mt-6">
              <AuthPrompt 
                onDismiss={() => setShowAuthPrompt(false)} 
                showDismiss={true}
              />
            </div>
          )}
        </div>
      </div>

      {isAuthenticated && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-6">Analysis History</h2>
          <AnalysisHistory 
            analysisResults={analysisResults}
            isLoading={analysisLoading}
          />
        </div>
      )}
    </div>
  );
};

export default Analyzer;


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
  incrementAnonymousAnalysisCount 
} from '@/utils/anonymousUsage';

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
      refetch();
    }
  }, [isAuthenticated, refetch]);

  const handleAnalyze = async () => {
    if (!isAuthenticated) {
      // Check if anonymous user has reached the limit
      if (hasReachedAnonymousLimit()) {
        toast({
          title: "Analysis Limit Reached",
          description: "You've reached the limit of free analyses. Please subscribe to continue.",
          variant: "destructive",
        });
        navigate('/pricing');
        return;
      }
      
      setShowAuthPrompt(true);
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

    try {
      const formData = new FormData();
      formData.append('contract', file!);

      const response = await supabase.functions.invoke('analyze-contract', {
        body: formData
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      if (!isAuthenticated) {
        // Increment the counter for anonymous users
        incrementAnonymousAnalysisCount();
      }

      if (response.data.status === 'processing') {
        toast({
          title: "PDF Processing",
          description: "Your PDF is being analyzed. Check the history for results.",
        });
      } else {
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
    <div className="container mx-auto py-6 px-4">
      <h1 className="text-3xl font-bold mb-6">Text Analyzer</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="w-full">
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
          <div className="col-span-2">
            <h2 className="text-2xl font-bold mb-4">Analysis History</h2>
            <AnalysisHistory 
              analysisResults={analysisResults}
              isLoading={analysisLoading}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Analyzer;

import { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/navbar/useAuth";
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from 'date-fns';
import AuthPrompt from '@/components/AuthPrompt';
import { 
  getAnonymousAnalysisCount, 
  incrementAnonymousAnalysisCount, 
  hasReachedAnonymousLimit,
  resetAnonymousAnalysisCount
} from '@/utils/anonymousUsage';

const MAX_ANONYMOUS_ANALYSES = 1;

const Analyzer = () => {
  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const { toast } = useToast();
  const { isAuthenticated, userId } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      resetAnonymousAnalysisCount();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    // Only show auth prompt when user has reached limit AND tried to analyze something
    // Don't show it immediately on page load
    if (!isAuthenticated && hasReachedAnonymousLimit()) {
      setShowAuthPrompt(true);
    }
  }, [isAuthenticated]);

  const { data: analysisResults, isLoading: analysisLoading, refetch } = useQuery({
    queryKey: ['analysisResults'],
    queryFn: async () => {
      if (!isAuthenticated) return [];
      
      const { data, error } = await supabase
        .from('analysis_results')
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

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    // Only allow one file
    const file = acceptedFiles[0];
    setFile(file);

    const reader = new FileReader();
    reader.onload = (event: any) => {
      setText(event.target.result);
    };
    reader.readAsText(file);
  };

  const { getRootProps, getInputProps } = useDropzone({ 
    onDrop, 
    accept: { 
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt']
    },
    maxFiles: 1,
    multiple: false
  });

  const handleAnalyze = async () => {
    if (!isAuthenticated && hasReachedAnonymousLimit()) {
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

      setAnalysisResult(response.data);

      if (!isAuthenticated) {
        const newCount = incrementAnonymousAnalysisCount();
        
        if (newCount >= MAX_ANONYMOUS_ANALYSES) {
          setTimeout(() => {
            setShowAuthPrompt(true);
          }, 1000);
        }
      } else {
        const { error } = await supabase
          .from('analysis_results')
          .insert({
            user_id: userId,
            content: text,
            result: response.data
          });

        if (error) {
          console.error('Error saving analysis result:', error);
          toast({
            title: "Error",
            description: "Failed to save analysis result.",
            variant: "destructive",
          });
        } else {
          refetch();
          toast({
            title: "Success",
            description: "Analysis saved.",
          });
        }
      }
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
          <Card className="mb-6">
            <CardHeader>
              <h2 className="text-lg font-semibold">Upload File (Single File Only)</h2>
            </CardHeader>
            <CardContent>
              <div {...getRootProps()} className="dropzone mb-4 border-2 border-dashed rounded-md p-4 text-center cursor-pointer">
                <input {...getInputProps()} />
                <p>Drag a file here, or click to select a file</p>
                {file && (
                  <div className="mt-2">
                    <p>Selected file: {file.name}</p>
                  </div>
                )}
              </div>

              <Button onClick={handleAnalyze} disabled={loading} className="w-full">
                {loading ? "Analyzing..." : "Analyze"}
              </Button>

              {!isAuthenticated && !hasReachedAnonymousLimit() && (
                <div className="mt-4 text-sm text-gray-500 text-center">
                  <p>You have 1 free analysis.</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">T3rms Analysis Tool</h2>
            </CardHeader>
            <CardContent>
              <div className="iframe-container" style={{ width: '100%', height: '500px', overflow: 'hidden', borderRadius: '0.375rem' }}>
                <iframe 
                  src="https://T3rms.replit.app" 
                  title="T3rms Analysis Tool"
                  style={{ width: '100%', height: '100%', border: 'none' }}
                  allow="fullscreen"
                ></iframe>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">Analysis Result</h2>
            </CardHeader>
            <CardContent>
              {analysisResult ? (
                <pre className="whitespace-pre-wrap break-words">
                  {JSON.stringify(analysisResult, null, 2)}
                </pre>
              ) : (
                <p>No analysis result yet.</p>
              )}
            </CardContent>
          </Card>
          
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
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Analysis History</h2>
          {analysisLoading ? (
            <p>Loading analysis history...</p>
          ) : analysisResults && analysisResults.length > 0 ? (
            <Table>
              <TableCaption>A list of your previous analyses.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Date</TableHead>
                  <TableHead>Content</TableHead>
                  <TableHead>Result</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {analysisResults.map((result: any) => (
                  <TableRow key={result.id}>
                    <TableCell className="font-medium">{format(new Date(result.created_at), 'yyyy-MM-dd HH:mm')}</TableCell>
                    <TableCell>{result.content.substring(0, 50)}...</TableCell>
                    <TableCell>{JSON.stringify(result.result || {}).substring(0, 50)}...</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p>No analysis history available.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Analyzer;

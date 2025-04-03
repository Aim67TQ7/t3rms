import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

// Fix the errors by making sure session and saveAnalysis are declared before use
const Analyzer = () => {
  const [text, setText] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Define session state
  const [session, setSession] = useState<any>(null);
  
  // Function to save analysis
  const saveAnalysis = async () => {
    if (!session?.user?.id) {
      toast({
        title: "Not authenticated",
        description: "You must be logged in to save analyses.",
        variant: "destructive",
      });
      return;
    }

    if (!analysis) {
      toast({
        title: "No analysis to save",
        description: "Please generate an analysis before saving.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('analyses')
        .insert([
          { 
            user_id: session.user.id, 
            text: text, 
            analysis: analysis 
          }
        ]);

      if (error) {
        console.error("Error saving analysis:", error);
        toast({
          title: "Error saving analysis",
          description: "There was a problem saving your analysis. Please try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Analysis saved!",
          description: "Your analysis has been saved successfully.",
        });
      }
    } catch (err) {
      console.error("Unexpected error saving analysis:", err);
      toast({
        title: "Unexpected error",
        description: "An unexpected error occurred while saving. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const { toast } = useToast();

  const analyzeText = async () => {
    setLoading(true);
    setError(null);
    setAnalysis('');

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to analyze text');
        return;
      }

      const data = await response.json();
      setAnalysis(data.analysis);
    } catch (err) {
      console.error("Analysis error:", err);
      setError('Failed to analyze text. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Now we can use them in the useEffect
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, []);
  
  return (
    <div className="container mx-auto py-12 px-4 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6 text-center">T3RMS Analyzer</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Enter Text</CardTitle>
          <CardDescription>Enter the text you want to analyze.</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea 
            value={text} 
            onChange={(e) => setText(e.target.value)} 
            placeholder="Paste your text here..." 
            className="mb-4"
          />
        </CardContent>
        <CardFooter>
          <Button onClick={analyzeText} disabled={loading}>
            {loading ? "Analyzing..." : "Analyze"}
          </Button>
        </CardFooter>
      </Card>

      {error && (
        <div className="text-red-500 mt-4">{error}</div>
      )}

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Analysis</CardTitle>
          <CardDescription>
            {loading ? "Analyzing..." : "Analysis of the text."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="min-h-[100px]" />
          ) : (
            <div className="whitespace-pre-line">{analysis || "No analysis available."}</div>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={saveAnalysis} disabled={loading || !analysis}>
            Save Analysis
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Analyzer;

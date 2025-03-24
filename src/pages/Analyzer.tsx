import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RefreshCw, AlertTriangle, Star, Save, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const Analyzer = () => {
  const [showFeedbackPrompt, setShowFeedbackPrompt] = useState(false);
  const [iframeKey, setIframeKey] = useState(Date.now());
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [feedbackComments, setFeedbackComments] = useState('');
  const [anonymousVisits, setAnonymousVisits] = useState(0);
  const [analysisResult, setAnalysisResult] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Iframe communication
  useEffect(() => {
    const handleMessage = (event) => {
      // Only accept messages from our iframe's domain
      if (event.origin !== "https://t3rms.replit.app") return;
      
      console.log('Received message from iframe:', event.data);
      
      // Process the message based on type
      switch (event.data.type) {
        case 'analysisResult':
          // Handle the analysis results
          setAnalysisResult(event.data.content);
          console.log('Received analysis results:', event.data.content);
          break;
          
        case 'downloadComplete':
          // Handle download completion
          setIsDownloading(false);
          toast({
            title: "Document downloaded",
            description: "The Terms document has been successfully downloaded.",
          });
          console.log('Download completed:', event.data.content);
          break;
          
        case 'analysisComplete':
          // Handle analysis completion
          setIsAnalyzing(false);
          toast({
            title: "Analysis complete",
            description: "Your document has been analyzed successfully.",
          });
          console.log('Analysis workflow complete:', event.data.content);
          break;
          
        case 'analysisStarted':
          // Handle analysis started
          setIsAnalyzing(true);
          toast({
            title: "Analysis started",
            description: "Analyzing your Terms document...",
          });
          break;
          
        case 'downloadStarted':
          // Handle download started
          setIsDownloading(true);
          toast({
            title: "Downloading document",
            description: "Downloading your Terms document...",
          });
          break;
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [toast]);

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Check if user is authenticated
  const { data: session } = useQuery({
    queryKey: ['authSession'],
    queryFn: async () => {
      const { data } = await supabase.auth.getSession();
      return data.session;
    }
  });

  // Load anonymous visits from local storage on component mount
  useEffect(() => {
    const storedVisits = localStorage.getItem('anonymousVisits');
    if (storedVisits) {
      setAnonymousVisits(parseInt(storedVisits, 10));
    }
  }, []);

  // Fetch user data if authenticated
  const { data: userData, isLoading } = useQuery({
    queryKey: ['t3rmsUser'],
    queryFn: async () => {
      if (!session) return null;
      
      // Get their T3RMS profile
      const { data, error } = await supabase
        .from('t3rms_users')
        .select('*')
        .eq('user_id', session.user.id)
        .single();
      
      if (error) {
        console.error('Error fetching user data:', error);
        
        // If user doesn't have a profile yet, create one
        if (error.code === 'PGRST116') {
          const { data: newProfile, error: createError } = await supabase
            .from('t3rms_users')
            .insert({
              user_id: session.user.id,
              email: session.user.email,
              monthly_usage: 0,
              monthly_remaining: 5
            })
            .select()
            .single();
            
          if (createError) throw createError;
          return newProfile;
        }
        
        throw error;
      }
      
      return data;
    },
    enabled: !!session
  });

  // Save analysis result mutation
  const saveAnalysis = useMutation({
    mutationFn: async () => {
      if (!session || !analysisResult) return null;
      
      // Save the analysis result to the analysis_results table
      const { data, error } = await supabase
        .from('analysis_results')
        .insert({
          user_id: session.user.id,
          content: analysisResult
        })
        .select();
        
      if (error) {
        console.error('Error saving analysis:', error);
        throw error;
      }
      
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Analysis saved",
        description: "Your analysis has been saved to your account.",
      });
    },
    onError: (error) => {
      console.error('Error saving analysis:', error);
      toast({
        title: "Error saving analysis",
        description: "There was a problem saving your analysis. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Increment usage mutation for authenticated users
  const incrementAuthUsage = useMutation({
    mutationFn: async () => {
      if (!userData) return null;
      
      console.log('Incrementing usage for user:', userData.user_id);
      
      // Increment monthly_usage and decrement monthly_remaining
      const { data, error } = await supabase
        .from('t3rms_users')
        .update({
          monthly_usage: userData.monthly_usage + 1,
          monthly_remaining: Math.max(0, userData.monthly_remaining - 1)
        })
        .eq('user_id', userData.user_id)
        .select();
        
      if (error) {
        console.error('Error incrementing usage:', error);
        throw error;
      }
      
      console.log('Usage incremented successfully:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['t3rmsUser'] });
    },
    onError: (error) => {
      console.error('Mutation error:', error);
      toast({
        title: "Error updating usage",
        description: "There was a problem tracking your usage.",
        variant: "destructive",
      });
    }
  });

  // Increment anonymous visits
  const incrementAnonymousVisits = () => {
    const newVisitCount = anonymousVisits + 1;
    setAnonymousVisits(newVisitCount);
    localStorage.setItem('anonymousVisits', newVisitCount.toString());
  };

  // Submit feedback mutation
  const submitFeedback = useMutation({
    mutationFn: async ({ rating, comments }: { rating: number; comments: string }) => {
      if (!userData) return null;
      
      // Add feedback and grant bonus uses
      const { data, error } = await supabase
        .from('t3rms_users')
        .update({
          feedback_rating: rating,
          feedback_comments: comments,
          monthly_remaining: userData.monthly_remaining + 2
        })
        .eq('user_id', userData.user_id)
        .select();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['t3rmsUser'] });
      setShowFeedbackPrompt(false);
    }
  });

  const handleNewAnalysis = () => {
    console.log('New Analysis button clicked');
    
    // For authenticated users
    if (session && userData) {
      if (userData.monthly_remaining <= 0) {
        setShowFeedbackPrompt(true);
        toast({
          title: "Usage limit reached",
          description: "You've reached your monthly limit. Provide feedback for bonus uses or upgrade.",
          variant: "default",
        });
        return;
      }
      
      // Increment usage counter for authenticated users
      incrementAuthUsage.mutate();
      
      toast({
        title: "New analysis started",
        description: `${userData.monthly_remaining - 1} analyses remaining this month`,
      });
    } 
    // For anonymous users
    else {
      if (anonymousVisits >= 5) {
        toast({
          title: "Usage limit reached",
          description: "Sign up for a free account to continue using the analyzer.",
          variant: "destructive",
        });
        return;
      }
      
      // Increment anonymous visit count
      incrementAnonymousVisits();
      
      toast({
        title: "New analysis started",
        description: `${5 - anonymousVisits - 1} free analyses remaining. Sign up for more!`,
      });
    }

    // Refresh the iframe by changing its key
    const newKey = Date.now();
    console.log('Setting new iframe key:', newKey);
    setIframeKey(newKey);
  };

  const handleSaveAnalysis = () => {
    if (!session) {
      toast({
        title: "Login required",
        description: "Please sign up or log in to save your analysis.",
        variant: "destructive",
      });
      return;
    }
    
    if (!analysisResult) {
      toast({
        title: "No analysis to save",
        description: "Please run an analysis first.",
        variant: "destructive",
      });
      return;
    }
    
    saveAnalysis.mutate();
  };

  const handleProvideFeedback = () => {
    if (feedbackRating === 0) {
      toast({
        title: "Rating required",
        description: "Please provide a rating to get bonus analyses.",
        variant: "destructive",
      });
      return;
    }
    
    submitFeedback.mutate({ 
      rating: feedbackRating, 
      comments: feedbackComments 
    });
    
    toast({
      title: "Thank you for your feedback!",
      description: "You've received 2 bonus analyses.",
    });
  };

  const getRemainingAnalyses = () => {
    if (session && userData) {
      return userData.monthly_remaining;
    } else {
      return 5 - anonymousVisits;
    }
  };

  if (isLoading && session) {
    return (
      <div className="min-h-screen flex flex-col page-transition">
        <Navbar />
        <main className="flex-grow pt-20 flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-8 w-40 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 w-64 bg-gray-100 rounded"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col page-transition">
      <Navbar />
      
      <main className="flex-grow pt-20">
        <div className="container mx-auto px-4 md:px-6 py-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold text-t3rms-charcoal mb-2">T3RMS Analyzer</h1>
                <p className="text-gray-600">
                  Upload any Terms document to get an instant AI analysis
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="bg-t3rms-blue/10 text-t3rms-blue rounded-full px-4 py-1 text-sm font-medium">
                  {getRemainingAnalyses() <= 0 
                    ? 'Limit reached' 
                    : `${getRemainingAnalyses()}/${session && userData?.plan === 'free' ? '5' : '5'} analyses remaining`}
                </div>
                <Button 
                  onClick={handleNewAnalysis}
                  disabled={(session && userData?.monthly_remaining <= 0) || (!session && anonymousVisits >= 5) || isAnalyzing}
                  className="bg-t3rms-blue hover:bg-t3rms-blue/90"
                >
                  {isAnalyzing ? (
                    <>
                      <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4" /> New Analysis
                    </>
                  )}
                </Button>
                {session && (
                  <Button
                    onClick={handleSaveAnalysis}
                    disabled={!analysisResult || saveAnalysis.isPending}
                    variant="outline"
                    className="border-t3rms-blue text-t3rms-blue hover:bg-t3rms-blue/10"
                  >
                    <Save className="mr-2 h-4 w-4" /> Save Analysis
                  </Button>
                )}
              </div>
            </div>
            
            {showFeedbackPrompt && userData && (
              <Card className="mb-8 border-t3rms-blue/20 bg-blue-50/50">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-6 items-center">
                    <div className="flex-grow">
                      <h3 className="text-lg font-medium text-t3rms-charcoal mb-2">
                        You've reached your monthly limit
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Provide feedback about your experience to get 2 bonus analyses, or upgrade to our Pro plan for more analyses per month.
                      </p>
                      
                      <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">How would you rate your experience? (1-5)</label>
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map((rating) => (
                            <button
                              key={rating}
                              onClick={() => setFeedbackRating(rating)}
                              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                feedbackRating === rating 
                                  ? 'bg-t3rms-blue text-white' 
                                  : 'bg-gray-100 hover:bg-gray-200'
                              }`}
                            >
                              {rating}
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">Any additional comments?</label>
                        <textarea 
                          value={feedbackComments}
                          onChange={(e) => setFeedbackComments(e.target.value)}
                          className="w-full p-2 border rounded-md"
                          rows={3}
                          placeholder="Tell us what you think..."
                        />
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-3">
                        <Button 
                          onClick={handleProvideFeedback} 
                          className="flex items-center gap-2"
                          disabled={submitFeedback.isPending}
                        >
                          {submitFeedback.isPending ? (
                            <>
                              <svg className="animate-spin h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Submitting...
                            </>
                          ) : (
                            <>
                              <Star className="h-4 w-4" /> Provide Feedback
                            </>
                          )}
                        </Button>
                        <Link to="/pricing">
                          <Button variant="outline">Upgrade to Pro</Button>
                        </Link>
                      </div>
                    </div>
                    <div className="flex-shrink-0 bg-t3rms-blue/10 p-4 rounded-full">
                      <AlertTriangle className="h-8 w-8 text-t3rms-blue" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {!session && anonymousVisits >= 5 && (
              <Card className="mb-8 border-t3rms-blue/20 bg-blue-50/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-t3rms-charcoal mb-2">
                        You've reached the free usage limit
                      </h3>
                      <p className="text-gray-600">
                        Sign up for a free account to continue using the T3RMS Analyzer.
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <Link to="/auth?signup=true">
                        <Button className="bg-t3rms-blue hover:bg-t3rms-blue/90">
                          Sign Up
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm h-[calc(100vh-12rem)]">
              <iframe 
                key={iframeKey}
                src="https://t3rms.replit.app" 
                className="w-full h-full"
                title="T3RMS Analyzer"
              ></iframe>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Analyzer;

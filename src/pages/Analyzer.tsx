
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RefreshCw, Upload, AlertTriangle, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const Analyzer = () => {
  const [showFeedbackPrompt, setShowFeedbackPrompt] = useState(false);
  const [iframeKey, setIframeKey] = useState(Date.now());
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [feedbackComments, setFeedbackComments] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Fetch user data
  const { data: userData, isLoading, error } = useQuery({
    queryKey: ['t3rmsUser'],
    queryFn: async () => {
      // First get the current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error("Not authenticated");
      
      // Then get their T3RMS profile
      const { data, error } = await supabase
        .from('t3rms_users')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (error) throw error;
      return data;
    }
  });

  // Increment usage mutation
  const incrementUsage = useMutation({
    mutationFn: async () => {
      if (!userData) return;
      
      // Increment monthly_usage and decrement monthly_remaining
      const { data, error } = await supabase
        .from('t3rms_users')
        .update({
          monthly_usage: userData.monthly_usage + 1,
          monthly_remaining: Math.max(0, userData.monthly_remaining - 1)
        })
        .eq('user_id', userData.user_id)
        .select();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['t3rmsUser'] });
    }
  });

  // Submit feedback mutation - Fixed the return type issue
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
    if (!userData) {
      toast({
        title: "Authentication required",
        description: "Please sign in to use the analyzer",
        variant: "destructive",
      });
      return;
    }

    if (userData.monthly_remaining <= 0) {
      setShowFeedbackPrompt(true);
      toast({
        title: "Usage limit reached",
        description: "You've reached your monthly limit. Provide feedback for bonus uses or upgrade.",
        variant: "default",
      });
      return;
    }

    // Refresh the iframe by changing its key
    setIframeKey(Date.now());
    
    // Increment usage counter
    incrementUsage.mutate();

    toast({
      title: "New analysis started",
      description: `${userData.monthly_remaining - 1} analyses remaining this month`,
    });
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

  if (isLoading) {
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
                  Upload any Terms & Conditions document to get an instant AI analysis
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                {userData && (
                  <div className="bg-t3rms-blue/10 text-t3rms-blue rounded-full px-4 py-1 text-sm font-medium">
                    {userData.monthly_remaining <= 0 
                      ? 'Limit reached' 
                      : `${userData.monthly_remaining}/${userData.plan === 'free' ? '3' : '100'} analyses remaining`}
                  </div>
                )}
                <Button 
                  onClick={handleNewAnalysis}
                  disabled={!userData || (userData.monthly_remaining <= 0 && !showFeedbackPrompt)}
                  className="bg-t3rms-blue hover:bg-t3rms-blue/90"
                >
                  <RefreshCw className="mr-2 h-4 w-4" /> New Analysis
                </Button>
              </div>
            </div>
            
            {showFeedbackPrompt && (
              <Card className="mb-8 border-t3rms-blue/20 bg-blue-50/50">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-6 items-center">
                    <div className="flex-grow">
                      <h3 className="text-lg font-medium text-t3rms-charcoal mb-2">
                        You've reached your monthly limit
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Provide feedback about your experience to get 2 bonus analyses, or upgrade to our Pro plan for 100 analyses per month.
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

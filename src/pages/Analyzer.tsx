
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RefreshCw, Upload, AlertTriangle, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Analyzer = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [usageCount, setUsageCount] = useState(1);
  const [maxUsage, setMaxUsage] = useState(3); // Free tier default
  const [showFeedbackPrompt, setShowFeedbackPrompt] = useState(false);
  const [iframeKey, setIframeKey] = useState(Date.now());
  const { toast } = useToast();

  // Simulating auth check - would be replaced with actual auth check
  useEffect(() => {
    // Mock authorization - in a real app, this would check actual auth state
    // For demo, we'll default to authorized
    setIsAuthorized(true);
  }, []);

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleNewAnalysis = () => {
    if (!isAuthorized) {
      toast({
        title: "Authentication required",
        description: "Please sign in to use the analyzer",
        variant: "destructive",
      });
      return;
    }

    if (usageCount >= maxUsage) {
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
    setUsageCount(usageCount + 1);

    toast({
      title: "New analysis started",
      description: `${maxUsage - usageCount} analyses remaining this month`,
    });
  };

  const handleProvideFeedback = () => {
    // Simulate providing feedback
    setMaxUsage(maxUsage + 2);
    setShowFeedbackPrompt(false);
    
    toast({
      title: "Thank you for your feedback!",
      description: "You've received 2 bonus analyses.",
    });
  };

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
                <div className="bg-t3rms-blue/10 text-t3rms-blue rounded-full px-4 py-1 text-sm font-medium">
                  {usageCount > maxUsage 
                    ? 'Limit reached' 
                    : `${maxUsage - usageCount + 1}/${maxUsage} analyses remaining`}
                </div>
                <Button 
                  onClick={handleNewAnalysis}
                  disabled={usageCount > maxUsage && !showFeedbackPrompt}
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
                      <div className="flex flex-col sm:flex-row gap-3">
                        <Button onClick={handleProvideFeedback} className="flex items-center gap-2">
                          <Star className="h-4 w-4" /> Provide Feedback
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

            {!isAuthorized ? (
              <Card className="border-dashed border-2 border-gray-300 bg-gray-50">
                <CardContent className="p-12 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                    <Upload className="h-8 w-8 text-gray-500" />
                  </div>
                  <h3 className="text-xl font-medium text-t3rms-charcoal mb-2">
                    Sign in to use the T3RMS Analyzer
                  </h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    Create an account or sign in to analyze your Terms & Conditions documents.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link to="/auth">
                      <Button>Sign In</Button>
                    </Link>
                    <Link to="/auth?signup=true">
                      <Button variant="outline">Create Account</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm h-[calc(100vh-12rem)]">
                <iframe 
                  key={iframeKey}
                  src="https://t3rms.replit.app" 
                  className="w-full h-full"
                  title="T3RMS Analyzer"
                ></iframe>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Analyzer;


import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import Seo from "@/components/Seo";
import Footer from "@/components/Footer";

const TermsAndConditions = () => {
  const [content, setContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const generateTerms = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const requestData = {
          policyType: "terms",
          businessInfo: {
            businessName: "T3RMS",
            website: "https://t3rms.ai",
            email: "contact@t3rms.ai",
            phone: "",
            businessDescription: "AI-powered legal document analysis and generation platform",
            jurisdiction: "United States",
            platformType: "website"
          },
          options: {
            includeDisputeResolution: true,
            includeIntellectualProperty: true,
            includeLimitations: true,
            includePrivacyPolicy: true,
            includeProhibitedActivities: true,
            includeTermination: true,
            includeUserContent: true
          }
        };
        
        const response = await supabase.functions.invoke('claude-legal-generator', {
          body: requestData
        });
        
        if (response.error) {
          throw new Error(`Error generating terms: ${response.error.message}`);
        }
        
        setContent(response.data.content);
      } catch (error) {
        console.error("Error generating terms:", error);
        setError("Failed to generate Terms & Conditions. Please try again later.");
        toast({
          title: "Error",
          description: "Failed to generate Terms & Conditions.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    generateTerms();
  }, [toast]);

  return (
    <div className="min-h-screen flex flex-col">
      <Seo 
        title="Terms & Conditions - T3RMS" 
        description="T3RMS Platform Terms & Conditions - Legal agreement governing the use of our services"
      />
      <main className="flex-grow container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Terms & Conditions</h1>
        
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Generating comprehensive Terms & Conditions document...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            {error}
          </div>
        ) : (
          <div className="prose prose-slate max-w-none">
            <div dangerouslySetInnerHTML={{ __html: content }} />
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default TermsAndConditions;

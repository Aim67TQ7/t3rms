
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import Seo from "@/components/Seo";
import Footer from "@/components/Footer";

const PrivacyPolicy = () => {
  const [content, setContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const generatePrivacyPolicy = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const requestData = {
          policyType: "privacy",
          businessInfo: {
            businessName: "T3RMS",
            website: "https://t3rms.ai",
            email: "privacy@t3rms.ai",
            phone: "",
            businessDescription: "AI-powered legal document analysis and generation platform with focus on data protection and privacy",
            jurisdiction: "European Union",
            platformType: "website"
          },
          options: {
            includePrivacyPolicy: true,
            includeGoogleAuth: true, // New flag to include Google authentication section
            googleDataHandling: {
              dataCollected: [
                "Google Account email address",
                "Google Account public profile information",
                "Google Account ID (for authentication purposes)"
              ],
              dataUsage: [
                "Authentication and account creation",
                "User identification",
                "Communication purposes"
              ],
              dataStorage: "Secure database with encryption",
              dataSharing: "We do not share Google user data with third parties except as required by law",
              dataDeletion: "Users can request deletion of their Google-linked data by contacting privacy@t3rms.ai"
            }
          }
        };
        
        const response = await supabase.functions.invoke('claude-legal-generator', {
          body: requestData
        });
        
        if (response.error) {
          throw new Error(`Error generating privacy policy: ${response.error.message}`);
        }
        
        setContent(response.data.content);
      } catch (error) {
        console.error("Error generating privacy policy:", error);
        setError("Failed to generate Privacy Policy. Please try again later.");
        toast({
          title: "Error",
          description: "Failed to generate Privacy Policy.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    generatePrivacyPolicy();
  }, [toast]);

  return (
    <div className="min-h-screen flex flex-col">
      <Seo 
        title="Privacy Policy - T3RMS | GDPR Compliant" 
        description="Our comprehensive GDPR-compliant Privacy Policy detailing how we collect, process, and protect your personal data including Google user data in accordance with EU data protection law"
      />
      <main className="flex-grow container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
        
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Generating GDPR-compliant Privacy Policy document...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            {error}
          </div>
        ) : (
          <div className="prose prose-slate max-w-none">
            <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-md mb-8">
              <p className="text-sm">Last updated: {new Date().toLocaleDateString()}</p>
              <p className="text-sm mt-2">This Privacy Policy is compliant with the General Data Protection Regulation (GDPR), Google API Services User Data Policy, and other applicable data protection laws.</p>
            </div>
            <div dangerouslySetInnerHTML={{ __html: content }} />
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;

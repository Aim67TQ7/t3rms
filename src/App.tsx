
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Seo from "@/components/Seo";
import Navbar from "@/components/Navbar";

// Import page components
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import AuthCallback from "@/pages/AuthCallback";
import Analyzer from "@/pages/Analyzer";
import Pricing from "@/pages/Pricing";
import EmbeddedTool from "@/pages/EmbeddedTool";
import TermsConditionsGenerator from "@/pages/TermsConditionsGenerator";
import TermsAndConditions from "@/pages/TermsAndConditions";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await supabase.auth.getSession();
      } catch (error) {
        console.error("Error checking authentication:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return <div className="h-screen w-full flex items-center justify-center">Loading...</div>;
  }

  return (
    <>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Navbar />
        <div className="pt-24">
          <Routes>
            <Route path="/" element={<><Seo /><Index /></>} />
            <Route path="/auth" element={<><Seo title="Login - T3RMS" /><Auth /></>} />
            <Route path="/auth/callback" element={<><Seo title="Authentication - T3RMS" /><AuthCallback /></>} />
            <Route path="/analyzer" element={<><Seo title="Document Analyzer - T3RMS" description="Analyze your terms & conditions documents with AI" /><Analyzer /></>} />
            <Route path="/pricing" element={<><Seo title="Pricing - T3RMS" /><Pricing /></>} />
            <Route path="/embedded-tool" element={<><Seo title="Embedded Analysis Tool - T3RMS" /><EmbeddedTool /></>} />
            <Route path="/tcgenerator" element={<><Seo title="Terms & Conditions Generator - T3RMS" description="Generate compliant terms & conditions documents" /><TermsConditionsGenerator /></>} />
            <Route path="/terms" element={<><Seo title="Terms & Conditions - T3RMS" /><TermsAndConditions /></>} />
            <Route path="/privacy" element={<><Seo title="Privacy Policy - T3RMS" /><PrivacyPolicy /></>} />
            <Route path="*" element={<><Seo title="404 - Page Not Found" /><NotFound /></>} />
          </Routes>
        </div>
      </TooltipProvider>
    </>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <AppContent />
        </QueryClientProvider>
      </HelmetProvider>
    </BrowserRouter>
  );
};

export default App;

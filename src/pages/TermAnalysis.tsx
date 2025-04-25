
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/navbar/useAuth";
import Seo from '@/components/Seo';
import { useContractAnalysis } from '@/hooks/useContractAnalysis';
import { AnalysisForm } from '@/components/terms-analysis/AnalysisForm';
import TrafficLightHeatmap from '@/components/terms-analysis/TrafficLightHeatmap';
import CounterProposalGenerator from '@/components/terms-analysis/CounterProposalGenerator';
import AnalysisRevisionHistory from '@/components/terms-analysis/AnalysisRevisionHistory';
import SpecificHeuristics from '@/components/terms-analysis/SpecificHeuristics';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const TermAnalysis = () => {
  const { isAuthenticated, userId } = useAuth();
  const navigate = useNavigate();
  
  const analysisState = useContractAnalysis(userId, isAuthenticated);
  const { analysisData, analysisResults, analysisLoading, compareMode, selectedAnalysisId, setCompareMode, setSelectedAnalysisId } = analysisState;

  return (
    <>
      <Seo 
        title="T3RMS - Advanced Contract Analysis | Identify High-Risk Language"
        description="Upload contracts for advanced AI analysis. Identify high-risk language, get counter-proposals, and track revisions with our specialized contract analysis tool."
      />
      <div className="min-h-screen bg-[#0a0a0a] relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto py-6 px-4 relative z-10">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-purple-200 to-purple-300">
              Advanced Contract Analysis
            </h1>
            <Button
              variant="outline"
              onClick={() => navigate("/tcgenerator")}
              className="flex items-center gap-2 bg-purple-500/10 border-purple-500/20 text-purple-300 hover:bg-purple-500/20"
            >
              <FileText className="h-4 w-4" />
              Create Terms & Conditions
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-12 xl:col-span-12">
              {!analysisData ? (
                <AnalysisForm 
                  isAuthenticated={isAuthenticated}
                  userId={userId}
                  analysisState={analysisState}
                />
              ) : (
                <div className="p-6 glass-dark rounded-lg">
                  <Tabs defaultValue="heatmap" className="w-full">
                    <TabsList className="grid w-full grid-cols-4 mb-4 bg-purple-500/10 border border-purple-500/20">
                      <TabsTrigger value="heatmap" className="flex items-center gap-2 data-[state=active]:bg-purple-500/20">
                        <FileText className="h-4 w-4" /> Risk Heatmap
                      </TabsTrigger>
                      <TabsTrigger value="counterproposal" className="flex items-center gap-2 data-[state=active]:bg-purple-500/20">
                        <FileText className="h-4 w-4" /> Counter-Proposal
                      </TabsTrigger>
                      <TabsTrigger value="heuristics" className="flex items-center gap-2 data-[state=active]:bg-purple-500/20">
                        <FileText className="h-4 w-4" /> Specific Issues
                      </TabsTrigger>
                      <TabsTrigger value="revisions" className="flex items-center gap-2 data-[state=active]:bg-purple-500/20">
                        <FileText className="h-4 w-4" /> Revision History
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="heatmap">
                      <TrafficLightHeatmap analysisData={analysisData} />
                    </TabsContent>
                    
                    <TabsContent value="counterproposal">
                      <CounterProposalGenerator 
                        analysisData={analysisData} 
                        isPremium={isAuthenticated} 
                        onRequestPremium={() => analysisState.setShowAuthPrompt(true)}
                      />
                    </TabsContent>
                    
                    <TabsContent value="heuristics">
                      <SpecificHeuristics analysisData={analysisData} />
                    </TabsContent>
                    
                    <TabsContent value="revisions">
                      <AnalysisRevisionHistory 
                        analysisResults={analysisResults || []} 
                        isLoading={analysisLoading}
                        setCompareMode={setCompareMode}
                        compareMode={compareMode}
                        selectedAnalysisId={selectedAnalysisId}
                        setSelectedAnalysisId={setSelectedAnalysisId}
                      />
                    </TabsContent>
                  </Tabs>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TermAnalysis;

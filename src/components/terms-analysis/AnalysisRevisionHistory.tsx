
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Calendar, FileText, FileDiff, FileOutput } from 'lucide-react';
import { ContractAnalysis } from '@/components/analyzer/AnalysisHistory';
import { format } from 'date-fns';
import { jsPDF } from 'jspdf';
import { useAuth } from "@/components/navbar/useAuth";
import { useToast } from "@/hooks/use-toast";
import AuthPrompt from '@/components/AuthPrompt';

interface AnalysisRevisionHistoryProps {
  analysisResults: ContractAnalysis[];
  isLoading: boolean;
  compareMode: boolean;
  setCompareMode: (value: boolean) => void;
  selectedAnalysisId: string | null;
  setSelectedAnalysisId: (value: string | null) => void;
}

const AnalysisRevisionHistory = ({ 
  analysisResults, 
  isLoading,
  compareMode,
  setCompareMode,
  selectedAnalysisId,
  setSelectedAnalysisId
}: AnalysisRevisionHistoryProps) => {
  const [selectionMap, setSelectionMap] = useState<Record<string, boolean>>({});
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const newMap: Record<string, boolean> = {};
    analysisResults.forEach(result => {
      newMap[result.id] = selectedAnalysisId === result.id;
    });
    setSelectionMap(newMap);
  }, [analysisResults, selectedAnalysisId]);

  const handleCheckboxChange = (id: string) => {
    if (compareMode) {
      const newMap = { ...selectionMap };
      newMap[id] = !newMap[id];
      setSelectionMap(newMap);
    } else {
      setSelectedAnalysisId(id === selectedAnalysisId ? null : id);
    }
  };

  const handleCompareToggle = () => {
    if (!isAuthenticated) {
      setShowAuthPrompt(true);
      return;
    }
    setCompareMode(!compareMode);
  };

  const handleExportPDF = () => {
    if (!isAuthenticated) {
      setShowAuthPrompt(true);
      return;
    }

    try {
      const doc = new jsPDF();
      
      // Add company logo
      // doc.addImage(logo, 'PNG', 10, 10, 50, 20);
      
      // Add title
      doc.setFontSize(20);
      doc.setTextColor(0, 0, 139);
      doc.text('Contract Analysis Report', 105, 30, { align: 'center' });
      
      // Add date
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`Generated on: ${format(new Date(), 'PPP')}`, 105, 40, { align: 'center' });
      
      // Add selected analysis
      const selectedAnalysis = analysisResults.find(analysis => selectionMap[analysis.id]);
      
      if (selectedAnalysis) {
        // Add analysis info
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text(`Document: ${selectedAnalysis.filename}`, 20, 60);
        doc.text(`Analysis Score: ${selectedAnalysis.analysis_score}/100`, 20, 70);
        doc.text(`Analyzed on: ${format(new Date(selectedAnalysis.created_at), 'PPP')}`, 20, 80);
        
        // Add critical points
        doc.setFontSize(14);
        doc.setTextColor(0, 0, 139);
        doc.text('Critical Points', 20, 100);
        
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        let yPos = 110;
        
        const criticalPoints = selectedAnalysis.analysis_results?.criticalPoints || [];
        criticalPoints.forEach((point: any, index: number) => {
          doc.setTextColor(180, 0, 0);
          doc.text(`${index + 1}. ${point.title}`, 20, yPos);
          yPos += 10;
          
          doc.setTextColor(0, 0, 0);
          const descLines = doc.splitTextToSize(point.description || '', 170);
          doc.text(descLines, 25, yPos);
          yPos += 10 * descLines.length;
          
          // Add some space between items
          yPos += 5;
          
          // Check if we need a new page
          if (yPos > 270) {
            doc.addPage();
            yPos = 20;
          }
        });
      } else {
        doc.setFontSize(12);
        doc.setTextColor(100, 100, 100);
        doc.text('No analysis selected for export', 105, 100, { align: 'center' });
      }
      
      doc.save('contract-analysis-report.pdf');
      
      toast({
        title: "PDF Exported",
        description: "Your analysis report has been downloaded as a PDF",
      });
      
    } catch (error) {
      console.error('Error exporting PDF:', error);
      toast({
        title: "Export Failed",
        description: "There was a problem exporting your analysis to PDF",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" /> Analysis History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-24">
            <p className="text-gray-500 animate-pulse">Loading analysis history...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (analysisResults.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" /> Analysis History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No previous analysis found</p>
            <p className="text-sm text-gray-400 mt-1">Past analyses will appear here</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">Analysis History</CardTitle>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleCompareToggle}
            className={compareMode ? "bg-blue-50 border-blue-200" : ""}
          >
            <FileDiff className="mr-2 h-4 w-4" />
            {compareMode ? "Exit Compare" : "Compare"}
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleExportPDF} 
            disabled={!isAuthenticated || !Object.values(selectionMap).some(v => v)}
          >
            <FileOutput className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {compareMode && (
            <div className="rounded-md bg-blue-50 p-3 text-sm text-blue-800 dark:bg-blue-950 dark:text-blue-300">
              {isAuthenticated ? (
                <p>Select analyses to compare revisions of the same contract</p>
              ) : (
                <p>Subscribe to enable revision comparison and PDF export</p>
              )}
            </div>
          )}
          
          {showAuthPrompt && !isAuthenticated && (
            <div className="mb-4">
              <AuthPrompt 
                onDismiss={() => setShowAuthPrompt(false)} 
                showDismiss={true}
              />
            </div>
          )}
          
          <div className="divide-y">
            {analysisResults.map((analysis) => (
              <div key={analysis.id} className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Checkbox 
                    id={`checkbox-${analysis.id}`}
                    checked={selectionMap[analysis.id] || false}
                    onCheckedChange={() => handleCheckboxChange(analysis.id)}
                    disabled={!isAuthenticated && compareMode}
                  />
                  <div>
                    <div className="font-medium">{analysis.filename}</div>
                    <div className="text-sm text-gray-500 flex items-center gap-2">
                      <span>Analyzed: {format(new Date(analysis.created_at), 'PP')}</span>
                      <Badge variant="outline" className="ml-2">
                        Score: {analysis.analysis_score}/100
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalysisRevisionHistory;

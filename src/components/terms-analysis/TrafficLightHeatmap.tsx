
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight, AlertTriangle, Check, Shield, ShieldX, Flag } from 'lucide-react';

interface TrafficLightHeatmapProps {
  analysisData: any;
}

const TrafficLightHeatmap = ({ analysisData }: TrafficLightHeatmapProps) => {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});
  const [processedData, setProcessedData] = useState<any>({ criticalPoints: [], financialRisks: [], unusualLanguage: [] });

  const toggleItem = (id: string) => {
    setOpenItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  useEffect(() => {
    if (analysisData) {
      console.log("TrafficLightHeatmap received data:", analysisData);
      setProcessedData(processIssues());
    }
  }, [analysisData]);

  // Process critical points and other issues in analysis data
  const processIssues = () => {
    // Check if we have direct access to the analysis field (from response structure)
    const analysisContent = analysisData?.analysis || analysisData;
    
    console.log("Processing analysis data:", analysisContent);

    // Normalize critical points
    const criticalPoints = Array.isArray(analysisContent?.criticalPoints) 
      ? analysisContent.criticalPoints.map((point: any) => {
          if (!point) return null;
          // Check for different data structures and normalize
          return {
            title: point.title || `Issue in ${point.section || point.reference?.section || 'Unknown section'}`,
            description: point.description || point.issue || point.concern || point.risk || 'Potential issue identified',
            severity: point.severity || 'high',
            reference: {
              section: point.section || point.reference?.section || null,
              excerpt: point.excerpt || point.reference?.excerpt || null
            }
          };
        }).filter(Boolean)
      : [];

    // Normalize financial risks
    const financialRisks = Array.isArray(analysisContent?.financialRisks)
      ? analysisContent.financialRisks.map((risk: any) => {
          if (!risk) return null;
          return {
            title: risk.title || `Financial risk in ${risk.section || risk.reference?.section || 'Unknown section'}`,
            description: risk.description || risk.risk || 'Financial risk identified',
            severity: risk.severity || 'high',
            reference: {
              section: risk.section || risk.reference?.section || null,
              excerpt: risk.excerpt || risk.reference?.excerpt || null
            }
          };
        }).filter(Boolean)
      : [];

    // Normalize unusual language items
    const unusualLanguage = Array.isArray(analysisContent?.unusualLanguage)
      ? analysisContent.unusualLanguage.map((item: any) => {
          if (!item) return null;
          return {
            title: item.title || `Unusual language in ${item.section || item.reference?.section || 'Unknown section'}`,
            description: item.description || item.language || 'Unusual language identified',
            severity: item.severity || 'medium',
            reference: {
              section: item.section || item.reference?.section || null,
              excerpt: item.excerpt || item.reference?.excerpt || null
            }
          };
        }).filter(Boolean)
      : [];

    // If we don't have structured data, try to extract from raw content if available
    if ((criticalPoints.length === 0 && financialRisks.length === 0 && unusualLanguage.length === 0) && 
        (analysisContent.content || analysisContent.generatedText || analysisContent.rawContent)) {
      
      const rawText = analysisContent.content || analysisContent.generatedText || analysisContent.rawContent;
      
      // Add a fallback critical point to indicate the raw analysis needs review
      criticalPoints.push({
        title: "Document needs review",
        description: "The AI identified potential issues but couldn't structure them. Please review the full analysis.",
        severity: "medium",
        reference: {
          section: "Full document",
          excerpt: rawText?.substring(0, 200) + "..." || "Raw analysis available"
        }
      });
    }

    // Log the processed data for debugging
    console.log("Processed data:", { criticalPoints, financialRisks, unusualLanguage });

    return {
      criticalPoints,
      financialRisks,
      unusualLanguage
    };
  };

  // Filter issues by category
  const indemnityIssues = [...processedData.criticalPoints, ...processedData.financialRisks].filter((item: any) => 
    (item.title?.toLowerCase().includes('indemnity') || 
    item.description?.toLowerCase().includes('indemnity'))
  );

  const liabilityIssues = [...processedData.criticalPoints, ...processedData.financialRisks].filter((item: any) => 
    (item.title?.toLowerCase().includes('liability') || 
    item.description?.toLowerCase().includes('liability'))
  );

  const financialRisks = processedData.financialRisks;
  const unusualLanguage = processedData.unusualLanguage;

  // Identify additional important risks (not in the above categories)
  const otherCriticalIssues = processedData.criticalPoints.filter((item: any) => 
    !item.title?.toLowerCase().includes('indemnity') && 
    !item.description?.toLowerCase().includes('indemnity') &&
    !item.title?.toLowerCase().includes('liability') && 
    !item.description?.toLowerCase().includes('liability')
  );

  const getRiskLevel = (issues: any[]) => {
    if (!issues || !issues.length) return "low";
    const highRiskCount = issues.filter(issue => issue.severity === "high").length;
    const mediumRiskCount = issues.filter(issue => issue.severity === "medium").length;
    
    if (highRiskCount > 0) return "high";
    if (mediumRiskCount > 0) return "medium";
    return "low";
  };

  const riskColorMap = {
    high: "bg-red-500",
    medium: "bg-amber-500",
    low: "bg-green-500"
  };

  const getRiskDescription = (riskLevel: string) => {
    switch (riskLevel) {
      case "high": return "High risk";
      case "medium": return "Medium risk";
      case "low": return "Low risk";
      default: return "Unknown risk";
    }
  };

  const getOverallRiskLevel = () => {
    // Check if there are any high severity issues in any category
    const hasHighSeverityIssues = [
      ...processedData.criticalPoints,
      ...processedData.financialRisks,
      ...processedData.unusualLanguage
    ].some(issue => issue.severity === 'high');
    
    if (hasHighSeverityIssues) {
      return "high";
    }
    
    // Check if there are any medium severity issues
    const hasMediumSeverityIssues = [
      ...processedData.criticalPoints,
      ...processedData.financialRisks,
      ...processedData.unusualLanguage
    ].some(issue => issue.severity === 'medium');
    
    if (hasMediumSeverityIssues) {
      return "medium";
    }
    
    // If nothing found or no issues, return low
    return "low";
  };

  const RiskCategory = ({ title, issues, icon: Icon }: { title: string; issues: any[]; icon: any }) => {
    const riskLevel = getRiskLevel(issues);
    
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon className={`h-5 w-5 ${riskLevel === 'high' ? 'text-red-500' : riskLevel === 'medium' ? 'text-amber-500' : 'text-green-500'}`} />
              <span>{title}</span>
            </div>
            <div className={`w-6 h-6 rounded-full ${riskColorMap[riskLevel]}`}></div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!issues || issues.length === 0 ? (
            <div className="flex items-center text-green-600 gap-2">
              <Check className="h-5 w-5" />
              <span>No issues detected</span>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {issues.length} potential issue{issues.length !== 1 ? 's' : ''} found
              </p>
              <div className="space-y-1">
                {issues.map((issue: any, index: number) => (
                  <Collapsible 
                    key={`${title}-${index}`} 
                    open={openItems[`${title}-${index}`]} 
                    onOpenChange={() => toggleItem(`${title}-${index}`)}
                  >
                    <CollapsibleTrigger className="flex w-full items-center justify-between p-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className={`h-4 w-4 ${issue.severity === 'high' ? 'text-red-500' : issue.severity === 'medium' ? 'text-amber-500' : 'text-gray-500'}`} />
                        <span>{issue.title || `Issue #${index + 1}`}</span>
                      </div>
                      {openItems[`${title}-${index}`] ? 
                        <ChevronDown className="h-4 w-4" /> : 
                        <ChevronRight className="h-4 w-4" />
                      }
                    </CollapsibleTrigger>
                    <CollapsibleContent className="px-2 py-2 text-sm border-l-2 border-gray-200 ml-2 pl-4">
                      <p>{issue.description}</p>
                      {issue.reference && (
                        <div className="mt-2 text-xs text-gray-500">
                          {issue.reference.section && <p>Section: {issue.reference.section}</p>}
                          {issue.reference.excerpt && (
                            <p className="mt-1 italic">"{issue.reference.excerpt}"</p>
                          )}
                        </div>
                      )}
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const overallRiskLevel = getOverallRiskLevel();
  
  // Get overall score from the analysis data
  const analysisContent = analysisData?.analysis || analysisData;
  const adjustedScore = analysisContent?.overallScore || 70;

  return (
    <div className="space-y-6">
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Badge className={`${overallRiskLevel === 'low' ? 'bg-green-500' : overallRiskLevel === 'medium' ? 'bg-amber-500' : 'bg-red-500'}`}>
                Score: {adjustedScore}/100
              </Badge>
              <span className="text-sm font-medium">
                {getRiskDescription(overallRiskLevel)} assessment
              </span>
            </div>
          </div>
          {analysisContent?.recommendations && analysisContent.recommendations.length > 0 && (
            <div className="mt-4 text-sm text-gray-600 dark:text-gray-300">
              <strong>Key Recommendations:</strong>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                {(analysisContent.recommendations || []).slice(0, 3).map((rec: any, index: number) => (
                  <li key={index}>{rec.text || rec.recommendation || String(rec)}</li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <RiskCategory 
          title="Indemnification Issues" 
          issues={indemnityIssues}
          icon={Shield}
        />
        <RiskCategory 
          title="Liability Issues" 
          issues={liabilityIssues}
          icon={ShieldX}
        />
        <RiskCategory 
          title="Financial Risks" 
          issues={financialRisks}
          icon={Flag}
        />
        <RiskCategory 
          title="Unusual Language" 
          issues={unusualLanguage}
          icon={AlertTriangle}
        />
        {otherCriticalIssues.length > 0 && (
          <RiskCategory 
            title="Other Critical Issues" 
            issues={otherCriticalIssues}
            icon={AlertTriangle}
          />
        )}
      </div>
    </div>
  );
};

export default TrafficLightHeatmap;

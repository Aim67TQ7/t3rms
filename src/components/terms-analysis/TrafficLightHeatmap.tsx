
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight, AlertTriangle, Check, Shield, ShieldX, Flag } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface TrafficLightHeatmapProps {
  analysisData: any;
}

const TrafficLightHeatmap = ({ analysisData }: TrafficLightHeatmapProps) => {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});
  const [processedData, setProcessedData] = useState<any>({ criticalPoints: [], financialRisks: [], unusualLanguage: [] });
  const [extractedJsonData, setExtractedJsonData] = useState<any>(null);
  const { toast } = useToast();

  const toggleItem = (id: string) => {
    setOpenItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  useEffect(() => {
    if (analysisData) {
      console.log("TrafficLightHeatmap received data:", analysisData);
      
      // Try to extract JSON content if it exists
      if (analysisData?.content && typeof analysisData.content === 'string') {
        try {
          const jsonMatch = analysisData.content.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            console.log("Successfully parsed nested JSON content:", parsed);
            setExtractedJsonData(parsed);
          }
        } catch (error) {
          console.error("Failed to parse content as JSON:", error);
        }
      }
      
      setProcessedData(processIssues());
    }
  }, [analysisData]);

  // Process critical points and other issues in analysis data
  const processIssues = () => {
    // Check if we have direct access to the analysis field (from response structure)
    const analysisContent = analysisData?.analysis || analysisData;
    
    console.log("Processing analysis data:", analysisContent);

    // Use extracted JSON if available
    const effectiveContent = extractedJsonData || analysisContent;

    // Normalize critical points
    const criticalPoints = Array.isArray(effectiveContent?.criticalPoints) 
      ? effectiveContent.criticalPoints.map((point: any) => {
          if (!point) return null;
          // Check if point is a string (from nested JSON parsing)
          if (typeof point === 'string') {
            return {
              title: point.split(',')[0] || "Critical Issue",
              description: point,
              severity: "high",
              reference: {
                section: "Identified in document",
                excerpt: null
              }
            };
          }
          // Check for different data structures and normalize
          return {
            title: point.title || point.issue || `Issue in ${point.section || point.reference?.section || 'Unknown section'}`,
            description: point.description || point.issue || point.concern || point.risk || 'Issue details not provided',
            severity: point.severity || 'high',
            reference: {
              section: point.section || point.reference?.section || null,
              excerpt: point.excerpt || point.reference?.excerpt || null
            }
          };
        }).filter(Boolean)
      : [];

    // Normalize financial risks
    const financialRisks = Array.isArray(effectiveContent?.financialRisks)
      ? effectiveContent.financialRisks.map((risk: any) => {
          if (!risk) return null;
          
          // Debug the structure of each financial risk
          console.log("Processing financial risk:", risk);
          
          // Check if risk is a string (from nested JSON parsing)
          if (typeof risk === 'string') {
            return {
              title: risk.split(',')[0] || "Financial Risk",
              description: risk,
              severity: "high",
              reference: {
                section: "Identified in document",
                excerpt: null
              },
              implications: "Financial implications may apply"
            };
          }
          
          // Create a specific title if one isn't provided or is generic
          let riskTitle = risk.title || risk.risk || "";
          if (!riskTitle || riskTitle === "Financial Risk") {
            if (risk.description && risk.description.length > 0) {
              // Extract a title from the first 50 chars of description
              riskTitle = risk.description.substring(0, 50) + (risk.description.length > 50 ? "..." : "");
            } else if (risk.reference?.section) {
              riskTitle = `Risk in ${risk.reference.section}`;
            } else {
              riskTitle = "Financial Risk";
            }
          }
          
          return {
            title: riskTitle,
            description: risk.description || risk.risk || (typeof risk === 'string' ? risk : 'Financial risk details not provided'),
            severity: risk.severity || 'high',
            reference: {
              section: risk.section || risk.reference?.section || null,
              excerpt: risk.excerpt || risk.reference?.excerpt || null
            },
            implications: risk.implications || risk.financialImplications || risk.impact || "Potential financial impact"
          };
        }).filter(Boolean)
      : [];

    // If financial risks array is empty but we have content, check for financial terms in the raw content
    if (financialRisks.length === 0 && analysisContent?.content) {
      const content = analysisContent.content.toLowerCase();
      const financialTerms = ['payment', 'fee', 'cost', 'price', 'money', 'dollar', '$', 'expense', 'billing', 'charge'];
      
      if (financialTerms.some(term => content.includes(term))) {
        toast({
          title: "Financial Risk Detection",
          description: "Potential financial terms detected but detailed risk analysis could not be generated.",
          variant: "destructive"
        });
        
        financialRisks.push({
          title: "Unspecified Financial Risk",
          description: "The document contains financial terms, but the AI couldn't provide specific risk details. Consider reviewing the document manually.",
          severity: "medium",
          reference: {
            section: "Various sections",
            excerpt: null
          },
          implications: "Potential financial impact requires manual review"
        });
      }
    }

    // Normalize unusual language items
    const unusualLanguage = Array.isArray(effectiveContent?.unusualLanguage)
      ? effectiveContent.unusualLanguage.map((item: any) => {
          if (!item) return null;
          // Check if item is a string (from nested JSON parsing)
          if (typeof item === 'string') {
            return {
              title: item.split(',')[0] || "Unusual Language",
              description: item,
              severity: "medium",
              reference: {
                section: "Identified in document",
                excerpt: null
              }
            };
          }
          return {
            title: item.title || item.language || `Unusual language in ${item.section || item.reference?.section || 'contract'}`,
            description: item.description || item.language || 'Unusual language details not provided',
            severity: item.severity || 'medium',
            reference: {
              section: item.section || item.reference?.section || null,
              excerpt: item.excerpt || item.reference?.excerpt || null
            }
          };
        }).filter(Boolean)
      : [];

    // If we don't have structured data but have overall score, ensure we show at least one issue
    const overallScore = effectiveContent?.overallScore || (extractedJsonData?.overallScore);
    
    if (criticalPoints.length === 0 && financialRisks.length === 0 && unusualLanguage.length === 0) {
      if (overallScore && overallScore < 85) {
        // Add a fallback critical point to indicate the raw analysis needs review
        criticalPoints.push({
          title: "Document needs review",
          description: "The AI identified potential risks but couldn't structure them in detail. Please review the full analysis results on the Analysis Result tab.",
          severity: overallScore < 70 ? "high" : "medium",
          reference: {
            section: "Full document",
            excerpt: analysisContent?.content?.substring(0, 200) + "..." || "Raw analysis available"
          }
        });
      }
    }

    // Log the processed data for debugging
    console.log("Processed data:", { criticalPoints, financialRisks, unusualLanguage });

    return {
      criticalPoints,
      financialRisks,
      unusualLanguage,
      overallScore: overallScore || (criticalPoints.length > 0 || financialRisks.length > 0 || unusualLanguage.length > 0 ? 70 : 90)
    };
  };

  // Filter issues by category
  const indemnityIssues = [...processedData.criticalPoints, ...processedData.financialRisks].filter((item: any) => 
    (item.title?.toLowerCase().includes('indemnity') || item.title?.toLowerCase().includes('indemnification') || 
    item.description?.toLowerCase().includes('indemnity') || item.description?.toLowerCase().includes('indemnification'))
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
    !item.title?.toLowerCase().includes('indemnification') && 
    !item.description?.toLowerCase().includes('indemnity') && 
    !item.description?.toLowerCase().includes('indemnification') &&
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
                        <span className="font-medium">{issue.title || `Issue #${index + 1}`}</span>
                      </div>
                      {openItems[`${title}-${index}`] ? 
                        <ChevronDown className="h-4 w-4" /> : 
                        <ChevronRight className="h-4 w-4" />
                      }
                    </CollapsibleTrigger>
                    <CollapsibleContent className="px-2 py-2 text-sm border-l-2 border-gray-200 ml-2 pl-4">
                      <p className="mb-2">{issue.description}</p>
                      
                      {issue.implications && title === "Financial Risks" && (
                        <div className="mt-2 mb-2 text-red-500 dark:text-red-400">
                          <strong>Financial Implications:</strong> {issue.implications}
                        </div>
                      )}
                      
                      {issue.reference && (
                        <div className="mt-2 text-xs text-gray-500">
                          {issue.reference.section && <p><strong>Section:</strong> {issue.reference.section}</p>}
                          {issue.reference.excerpt && (
                            <p className="mt-1 italic"><strong>Excerpt:</strong> "{issue.reference.excerpt}"</p>
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
  const adjustedScore = processedData.overallScore || analysisContent?.overallScore || 
    (extractedJsonData && extractedJsonData.overallScore ? extractedJsonData.overallScore : 70);

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

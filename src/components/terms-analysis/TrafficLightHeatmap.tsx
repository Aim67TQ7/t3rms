
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight, AlertTriangle, Check, Shield, ShieldX, Flag } from 'lucide-react';

interface TrafficLightHeatmapProps {
  analysisData: any;
}

const TrafficLightHeatmap = ({ analysisData }: TrafficLightHeatmapProps) => {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  const toggleItem = (id: string) => {
    setOpenItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Filter critical points related to key risk categories
  const indemnityIssues = analysisData?.criticalPoints?.filter((item: any) => 
    item.title?.toLowerCase().includes('indemnity') || 
    item.description?.toLowerCase().includes('indemnity')
  ) || [];

  const liabilityIssues = analysisData?.criticalPoints?.filter((item: any) => 
    item.title?.toLowerCase().includes('liability') || 
    item.description?.toLowerCase().includes('liability')
  ) || [];

  const unusualLanguage = analysisData?.unusualLanguage || [];
  const financialRisks = analysisData?.financialRisks || [];

  const getRiskLevel = (issues: any[]) => {
    if (!issues.length) return "low";
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
    const allIssues = [
      ...indemnityIssues,
      ...liabilityIssues,
      ...unusualLanguage,
      ...financialRisks
    ];
    return getRiskLevel(allIssues);
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
          {issues.length === 0 ? (
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
  const alignedScore = analysisData?.overallScore || 0;

  return (
    <div className="space-y-6">
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Badge className={`${overallRiskLevel === 'low' ? 'bg-green-500' : overallRiskLevel === 'medium' ? 'bg-amber-500' : 'bg-red-500'}`}>
                Score: {alignedScore}/100
              </Badge>
              <span className="text-sm font-medium">
                {getRiskDescription(overallRiskLevel)} assessment
              </span>
            </div>
          </div>
          {analysisData?.recommendations && (
            <div className="mt-4 text-sm text-gray-600 dark:text-gray-300">
              <strong>Key Recommendations:</strong>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                {analysisData.recommendations.slice(0, 3).map((rec: any, index: number) => (
                  <li key={index}>{rec.text || rec}</li>
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
      </div>
    </div>
  );
};

export default TrafficLightHeatmap;


import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight, AlertTriangle, X, Check } from 'lucide-react';

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

  // Filter critical points related to key high-risk categories
  const indemnityIssues = analysisData?.criticalPoints?.filter((item: any) => 
    item.title?.toLowerCase().includes('indemnity') || 
    item.description?.toLowerCase().includes('indemnity')
  ) || [];

  const liabilityIssues = analysisData?.criticalPoints?.filter((item: any) => 
    item.title?.toLowerCase().includes('liability') || 
    item.description?.toLowerCase().includes('liability cap') ||
    item.description?.toLowerCase().includes('limitation of liability')
  ) || [];

  const paymentIssues = analysisData?.criticalPoints?.filter((item: any) => 
    item.title?.toLowerCase().includes('payment') || 
    item.description?.toLowerCase().includes('payment terms') ||
    item.description?.toLowerCase().includes('net') ||
    item.description?.toLowerCase().includes('days to pay')
  ) || [];

  // Determine severity levels for traffic light display
  const getIndemnityRiskLevel = () => {
    if (indemnityIssues.length === 0) return "low";
    const highRiskCount = indemnityIssues.filter((issue: any) => 
      issue.severity === "high" || issue.risk === "high"
    ).length;
    if (highRiskCount > 0) return "high";
    return "medium";
  };

  const getLiabilityRiskLevel = () => {
    if (liabilityIssues.length === 0) return "low";
    const highRiskCount = liabilityIssues.filter((issue: any) => 
      issue.severity === "high" || issue.risk === "high"
    ).length;
    if (highRiskCount > 0) return "high";
    return "medium";
  };

  const getPaymentRiskLevel = () => {
    if (paymentIssues.length === 0) return "low";
    const highRiskCount = paymentIssues.filter((issue: any) => 
      issue.severity === "high" || issue.risk === "high"
    ).length;
    if (highRiskCount > 0) return "high";
    return "medium";
  };

  const riskColorMap = {
    high: "bg-red-500",
    medium: "bg-amber-500",
    low: "bg-green-500"
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center justify-between">
              <span>Indemnity</span>
              <div className={`w-6 h-6 rounded-full ${riskColorMap[getIndemnityRiskLevel()]}`}></div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {indemnityIssues.length === 0 ? (
              <div className="flex items-center text-green-600 gap-2">
                <Check className="h-5 w-5" />
                <span>No issues detected</span>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {indemnityIssues.length} potential issue{indemnityIssues.length !== 1 ? 's' : ''} found
                </p>
                <div className="space-y-1">
                  {indemnityIssues.map((issue: any, index: number) => (
                    <Collapsible key={`indemnity-${index}`} open={openItems[`indemnity-${index}`]} onOpenChange={() => toggleItem(`indemnity-${index}`)}>
                      <CollapsibleTrigger className="flex w-full items-center justify-between p-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className={`h-4 w-4 ${issue.severity === 'high' ? 'text-red-500' : 'text-amber-500'}`} />
                          <span>{issue.title || `Issue #${index + 1}`}</span>
                        </div>
                        {openItems[`indemnity-${index}`] ? 
                          <ChevronDown className="h-4 w-4" /> : 
                          <ChevronRight className="h-4 w-4" />
                        }
                      </CollapsibleTrigger>
                      <CollapsibleContent className="px-2 py-2 text-sm border-l-2 border-gray-200 ml-2 pl-4">
                        <p>{issue.description}</p>
                      </CollapsibleContent>
                    </Collapsible>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center justify-between">
              <span>Liability Caps</span>
              <div className={`w-6 h-6 rounded-full ${riskColorMap[getLiabilityRiskLevel()]}`}></div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {liabilityIssues.length === 0 ? (
              <div className="flex items-center text-green-600 gap-2">
                <Check className="h-5 w-5" />
                <span>No issues detected</span>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {liabilityIssues.length} potential issue{liabilityIssues.length !== 1 ? 's' : ''} found
                </p>
                <div className="space-y-1">
                  {liabilityIssues.map((issue: any, index: number) => (
                    <Collapsible key={`liability-${index}`} open={openItems[`liability-${index}`]} onOpenChange={() => toggleItem(`liability-${index}`)}>
                      <CollapsibleTrigger className="flex w-full items-center justify-between p-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className={`h-4 w-4 ${issue.severity === 'high' ? 'text-red-500' : 'text-amber-500'}`} />
                          <span>{issue.title || `Issue #${index + 1}`}</span>
                        </div>
                        {openItems[`liability-${index}`] ? 
                          <ChevronDown className="h-4 w-4" /> : 
                          <ChevronRight className="h-4 w-4" />
                        }
                      </CollapsibleTrigger>
                      <CollapsibleContent className="px-2 py-2 text-sm border-l-2 border-gray-200 ml-2 pl-4">
                        <p>{issue.description}</p>
                      </CollapsibleContent>
                    </Collapsible>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center justify-between">
              <span>Payment Terms</span>
              <div className={`w-6 h-6 rounded-full ${riskColorMap[getPaymentRiskLevel()]}`}></div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {paymentIssues.length === 0 ? (
              <div className="flex items-center text-green-600 gap-2">
                <Check className="h-5 w-5" />
                <span>No issues detected</span>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {paymentIssues.length} potential issue{paymentIssues.length !== 1 ? 's' : ''} found
                </p>
                <div className="space-y-1">
                  {paymentIssues.map((issue: any, index: number) => (
                    <Collapsible key={`payment-${index}`} open={openItems[`payment-${index}`]} onOpenChange={() => toggleItem(`payment-${index}`)}>
                      <CollapsibleTrigger className="flex w-full items-center justify-between p-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className={`h-4 w-4 ${issue.severity === 'high' ? 'text-red-500' : 'text-amber-500'}`} />
                          <span>{issue.title || `Issue #${index + 1}`}</span>
                        </div>
                        {openItems[`payment-${index}`] ? 
                          <ChevronDown className="h-4 w-4" /> : 
                          <ChevronRight className="h-4 w-4" />
                        }
                      </CollapsibleTrigger>
                      <CollapsibleContent className="px-2 py-2 text-sm border-l-2 border-gray-200 ml-2 pl-4">
                        <p>{issue.description}</p>
                      </CollapsibleContent>
                    </Collapsible>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Overall Contract Risk Assessment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge className={`${analysisData.overallScore > 70 ? 'bg-green-500' : analysisData.overallScore > 40 ? 'bg-amber-500' : 'bg-red-500'}`}>
                Score: {analysisData.overallScore}/100
              </Badge>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {analysisData.overallScore > 70 
                  ? 'Low risk contract' 
                  : analysisData.overallScore > 40 
                    ? 'Medium risk contract' 
                    : 'High risk contract'}
              </span>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-medium">Key Concerns:</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                {analysisData.criticalPoints?.slice(0, 5).map((point: any, index: number) => (
                  <li key={index} className="text-gray-700 dark:text-gray-300">
                    {point.title}: {point.description?.substring(0, 120)}{point.description?.length > 120 ? '...' : ''}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrafficLightHeatmap;


import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, TrendingDown, Info, Package, Truck, CalendarClock, Shield, DollarSign } from 'lucide-react';

interface SpecificHeuristicsProps {
  analysisData: any;
}

// Helper function to find issues related to specific PO terms
const findSpecificIssues = (analysisData: any, terms: string[]) => {
  const allIssues = [
    ...(analysisData.criticalPoints || []),
    ...(analysisData.financialRisks || []),
    ...(analysisData.unusualLanguage || [])
  ];
  
  return allIssues.filter((issue: any) => {
    const text = (issue.title || '') + ' ' + (issue.description || '');
    return terms.some(term => text.toLowerCase().includes(term.toLowerCase()));
  });
};

const SpecificHeuristics = ({ analysisData }: SpecificHeuristicsProps) => {
  // PO-specific heuristics categories
  const shippingIssues = findSpecificIssues(analysisData, ['shipping', 'delivery', 'FOB', 'freight', 'transport']);
  const deliveryPenaltyIssues = findSpecificIssues(analysisData, ['late delivery', 'delay', 'penalty', 'liquidated damages', 'timeline']);
  const insuranceIssues = findSpecificIssues(analysisData, ['insurance', 'coverage', 'liability insurance', 'policy']);
  const paymentStructureIssues = findSpecificIssues(analysisData, ['payment schedule', 'installment', 'milestone', 'payment structure']);

  const getSeverityBadge = (issue: any) => {
    const severity = issue.severity || issue.risk || 'medium';
    
    switch(severity.toLowerCase()) {
      case 'high':
        return (
          <Badge variant="destructive" className="flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" /> High Risk
          </Badge>
        );
      case 'medium':
        return (
          <Badge variant="secondary" className="flex items-center gap-1 bg-amber-500 hover:bg-amber-600">
            <TrendingDown className="h-3 w-3" /> Medium Risk
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="flex items-center gap-1">
            <Info className="h-3 w-3" /> Note
          </Badge>
        );
    }
  };

  const NoIssuesFound = () => (
    <p className="text-sm text-gray-600 dark:text-gray-400 italic">No specific issues found in this category</p>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-blue-600" /> 
            PO-Specific Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            This specialized analysis focuses on purchase order and procurement-specific terms that CFOs and procurement teams care about.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div className="space-y-3">
              <h3 className="font-medium flex items-center gap-2 text-gray-800 dark:text-gray-200">
                <Truck className="h-4 w-4 text-blue-500" /> Shipping Terms (FOB)
              </h3>
              {shippingIssues.length > 0 ? (
                <ul className="space-y-2">
                  {shippingIssues.map((issue: any, index: number) => (
                    <li key={`shipping-${index}`} className="border-l-2 border-blue-500 pl-3 py-1">
                      <div className="flex justify-between items-start">
                        <span className="font-medium text-sm">{issue.title}</span>
                        {getSeverityBadge(issue)}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{issue.description}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <NoIssuesFound />
              )}
            </div>

            <div className="space-y-3">
              <h3 className="font-medium flex items-center gap-2 text-gray-800 dark:text-gray-200">
                <CalendarClock className="h-4 w-4 text-red-500" /> Late Delivery Penalties
              </h3>
              {deliveryPenaltyIssues.length > 0 ? (
                <ul className="space-y-2">
                  {deliveryPenaltyIssues.map((issue: any, index: number) => (
                    <li key={`penalty-${index}`} className="border-l-2 border-red-500 pl-3 py-1">
                      <div className="flex justify-between items-start">
                        <span className="font-medium text-sm">{issue.title}</span>
                        {getSeverityBadge(issue)}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{issue.description}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <NoIssuesFound />
              )}
            </div>

            <div className="space-y-3">
              <h3 className="font-medium flex items-center gap-2 text-gray-800 dark:text-gray-200">
                <Shield className="h-4 w-4 text-green-500" /> Insurance Requirements
              </h3>
              {insuranceIssues.length > 0 ? (
                <ul className="space-y-2">
                  {insuranceIssues.map((issue: any, index: number) => (
                    <li key={`insurance-${index}`} className="border-l-2 border-green-500 pl-3 py-1">
                      <div className="flex justify-between items-start">
                        <span className="font-medium text-sm">{issue.title}</span>
                        {getSeverityBadge(issue)}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{issue.description}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <NoIssuesFound />
              )}
            </div>

            <div className="space-y-3">
              <h3 className="font-medium flex items-center gap-2 text-gray-800 dark:text-gray-200">
                <DollarSign className="h-4 w-4 text-purple-500" /> Payment Structure
              </h3>
              {paymentStructureIssues.length > 0 ? (
                <ul className="space-y-2">
                  {paymentStructureIssues.map((issue: any, index: number) => (
                    <li key={`payment-${index}`} className="border-l-2 border-purple-500 pl-3 py-1">
                      <div className="flex justify-between items-start">
                        <span className="font-medium text-sm">{issue.title}</span>
                        {getSeverityBadge(issue)}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{issue.description}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <NoIssuesFound />
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SpecificHeuristics;

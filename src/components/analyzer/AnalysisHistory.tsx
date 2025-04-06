import { useState } from 'react';
import { format } from 'date-fns';
import ReactMarkdown from 'react-markdown';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export type ContractAnalysis = {
  id: string;
  user_id: string;
  filename: string;
  file_type: string;
  status: string;
  analysis_score?: number;
  analysis_results?: any;
  created_at: string;
};

interface AnalysisHistoryProps {
  analysisResults: ContractAnalysis[] | undefined;
  isLoading: boolean;
}

const AnalysisHistory = ({ analysisResults, isLoading }: AnalysisHistoryProps) => {
  const [expandedAnalysis, setExpandedAnalysis] = useState<string | null>(null);

  if (isLoading) {
    return <p>Loading analysis history...</p>;
  }

  if (!analysisResults || analysisResults.length === 0) {
    return <p>No analysis history available.</p>;
  }

  const toggleExpand = (id: string) => {
    if (expandedAnalysis === id) {
      setExpandedAnalysis(null);
    } else {
      setExpandedAnalysis(id);
    }
  };

  const formatAnalysisResults = (results: any) => {
    if (!results) return "";
    
    try {
      // Check if the result is already a string
      if (typeof results === 'string') {
        return results;
      }
      
      // Convert JSON object to markdown with added blank lines
      let markdown = "# Contract Analysis Results\n\n";
      
      // Add score if available
      if (results.overallScore !== undefined) {
        markdown += `## Overall Risk Score: ${results.overallScore}/100\n\n`;
        
        // Add color-coded risk assessment
        if (results.overallScore >= 80) {
          markdown += "**Risk Assessment**: 🟢 Low Risk\n\n";
        } else if (results.overallScore >= 50) {
          markdown += "**Risk Assessment**: 🟡 Medium Risk\n\n";
        } else {
          markdown += "**Risk Assessment**: 🔴 High Risk\n\n";
        }
      }
      
      // Critical Points section
      if (results.criticalPoints && results.criticalPoints.length > 0) {
        markdown += "## Critical Points\n\n";
        
        results.criticalPoints.forEach((point: any, index: number) => {
          const severityIcon = getSeverityIcon(point.severity);
          markdown += `### ${severityIcon} ${point.title}\n\n`;
          
          if (point.description) {
            markdown += `${point.description}\n\n`;
          }
          
          if (point.reference) {
            markdown += "**Location:**\n";
            
            if (point.reference.page) {
              markdown += `- Page: ${point.reference.page}\n`;
            }
            
            if (point.reference.section) {
              markdown += `- Section: ${point.reference.section}\n\n`;
            }
            
            if (point.reference.excerpt) {
              markdown += `**Excerpt:**\n\`\`\`\n${point.reference.excerpt}\n\`\`\`\n\n\n`;
            }
          }
        });
      }
      
      // Financial Risks section
      if (results.financialRisks && results.financialRisks.length > 0) {
        markdown += "## Financial Risks\n\n";
        
        results.financialRisks.forEach((risk: any, index: number) => {
          const severityIcon = getSeverityIcon(risk.severity);
          markdown += `### ${severityIcon} ${risk.title}\n\n`;
          
          if (risk.description) {
            markdown += `${risk.description}\n\n`;
          }
          
          if (risk.reference) {
            markdown += "**Location:**\n";
            
            if (risk.reference.page) {
              markdown += `- Page: ${risk.reference.page}\n`;
            }
            
            if (risk.reference.section) {
              markdown += `- Section: ${risk.reference.section}\n\n`;
            }
            
            if (risk.reference.excerpt) {
              markdown += `**Excerpt:**\n\`\`\`\n${risk.reference.excerpt}\n\`\`\`\n\n\n`;
            }
          }
        });
      }
      
      // Unusual Language section
      if (results.unusualLanguage && results.unusualLanguage.length > 0) {
        markdown += "## Unusual Language\n\n";
        
        results.unusualLanguage.forEach((item: any, index: number) => {
          const severityIcon = getSeverityIcon(item.severity);
          markdown += `### ${severityIcon} ${item.title}\n\n`;
          
          if (item.description) {
            markdown += `${item.description}\n\n`;
          }
          
          if (item.reference) {
            markdown += "**Location:**\n";
            
            if (item.reference.page) {
              markdown += `- Page: ${item.reference.page}\n`;
            }
            
            if (item.reference.section) {
              markdown += `- Section: ${item.reference.section}\n\n`;
            }
            
            if (item.reference.excerpt) {
              markdown += `**Excerpt:**\n\`\`\`\n${item.reference.excerpt}\n\`\`\`\n\n\n`;
            }
          }
        });
      }
      
      // Recommendations section
      if (results.recommendations && results.recommendations.length > 0) {
        markdown += "## Recommendations\n\n";
        
        results.recommendations.forEach((rec: any, index: number) => {
          if (typeof rec === 'string') {
            markdown += `${index + 1}. ${rec}\n\n`;
          } else if (typeof rec === 'object') {
            if (rec.text) {
              markdown += `${index + 1}. ${rec.text}\n\n`;
            } else if (rec.description) {
              markdown += `${index + 1}. ${rec.description}\n\n`;
            }
            
            // Add reference if available
            if (rec.reference) {
              markdown += `   *(Ref: `;
              
              if (rec.reference.section) {
                markdown += `Section ${rec.reference.section}`;
              }
              
              if (rec.reference.page) {
                markdown += rec.reference.section ? `, Page ${rec.reference.page}` : `Page ${rec.reference.page}`;
              }
              
              markdown += `)*\n\n\n`;
            }
          }
        });
      }
      
      return markdown;
    } catch (error) {
      // If any error occurs during formatting, fall back to JSON
      return "```json\n" + JSON.stringify(results, null, 2) + "\n```";
    }
  };
  
  const getSeverityIcon = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case 'high':
        return '🔴';
      case 'medium':
        return '🟡';
      case 'low':
        return '🟢';
      default:
        return '⚪';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500">Completed</Badge>;
      case 'processing':
      case 'chunking':
      case 'finalizing':
        return <Badge className="bg-blue-500">Processing</Badge>;
      case 'error':
        return <Badge className="bg-red-500">Error</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-4 max-h-[70vh] overflow-y-auto">
      <Table>
        <TableCaption>A list of your previous analyses.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]"></TableHead>
            <TableHead className="w-[180px]">Date</TableHead>
            <TableHead>Filename</TableHead>
            <TableHead className="w-[150px]">Status</TableHead>
            <TableHead className="w-[100px] text-right">Score</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {analysisResults.map((result) => (
            <Collapsible
              key={result.id}
              open={expandedAnalysis === result.id}
              onOpenChange={() => toggleExpand(result.id)}
              className="w-full"
            >
              <TableRow className="cursor-pointer hover:bg-muted/60" onClick={() => toggleExpand(result.id)}>
                <TableCell>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                      {expandedAnalysis === result.id ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </Button>
                  </CollapsibleTrigger>
                </TableCell>
                <TableCell className="font-medium">
                  {format(new Date(result.created_at), 'yyyy-MM-dd HH:mm')}
                </TableCell>
                <TableCell>{result.filename}</TableCell>
                <TableCell>{getStatusBadge(result.status)}</TableCell>
                <TableCell className="text-right">
                  {result.analysis_score !== undefined ? result.analysis_score : 'N/A'}
                </TableCell>
              </TableRow>
              <CollapsibleContent>
                <tr>
                  <td colSpan={5} className="p-0">
                    <div className="py-2 px-4 bg-muted/20">
                      <Card className="max-h-[500px] overflow-y-auto">
                        <CardContent className="pt-6">
                          <div className="prose max-w-none break-words whitespace-pre-wrap">
                            {result.analysis_results ? (
                              <ReactMarkdown>
                                {formatAnalysisResults(result.analysis_results)}
                              </ReactMarkdown>
                            ) : (
                              <p className="text-muted-foreground">No detailed analysis results available for this entry.</p>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </td>
                </tr>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AnalysisHistory;


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
      
      // Convert JSON object to markdown
      let markdown = "";
      
      // Add title if available
      if (results.title) {
        markdown += `# ${results.title}\n\n`;
      }
      
      // Add summary if available
      if (results.summary) {
        markdown += `## Summary\n${results.summary}\n\n`;
      }
      
      // Handle issues or findings
      if (results.issues || results.findings) {
        const items = results.issues || results.findings || [];
        markdown += `## Issues Found\n\n`;
        
        if (Array.isArray(items)) {
          items.forEach((item, index) => {
            if (typeof item === 'string') {
              markdown += `${index + 1}. ${item}\n`;
            } else if (typeof item === 'object') {
              const title = item.title || item.name || `Issue ${index + 1}`;
              markdown += `### ${title}\n`;
              
              if (item.description) {
                markdown += `${item.description}\n`;
              }
              
              if (item.severity) {
                markdown += `**Severity**: ${item.severity}\n`;
              }
              
              if (item.recommendation) {
                markdown += `**Recommendation**: ${item.recommendation}\n`;
              }
              
              markdown += '\n';
            }
          });
        }
      }
      
      // Handle recommendations
      if (results.recommendations) {
        markdown += `## Recommendations\n\n`;
        
        if (Array.isArray(results.recommendations)) {
          results.recommendations.forEach((rec, index) => {
            if (typeof rec === 'string') {
              markdown += `${index + 1}. ${rec}\n`;
            } else if (typeof rec === 'object') {
              const title = rec.title || `Recommendation ${index + 1}`;
              markdown += `### ${title}\n`;
              if (rec.description) {
                markdown += `${rec.description}\n\n`;
              }
            }
          });
        } else if (typeof results.recommendations === 'string') {
          markdown += results.recommendations;
        }
      }
      
      // If our formatting logic doesn't apply well to this particular JSON structure,
      // fall back to displaying the JSON as a string
      if (markdown.trim() === "") {
        markdown = "```json\n" + JSON.stringify(results, null, 2) + "\n```";
      }
      
      return markdown;
    } catch (error) {
      // If any error occurs during formatting, fall back to JSON
      return "```json\n" + JSON.stringify(results, null, 2) + "\n```";
    }
  };

  return (
    <div className="space-y-4">
      <Table>
        <TableCaption>A list of your previous analyses.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]"></TableHead>
            <TableHead className="w-[100px]">Date</TableHead>
            <TableHead>Filename</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Score</TableHead>
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
                <TableCell>{result.status}</TableCell>
                <TableCell>{result.analysis_score || 'N/A'}</TableCell>
              </TableRow>
              <CollapsibleContent>
                <tr>
                  <td colSpan={5} className="p-0">
                    <div className="py-2 px-4 bg-muted/20">
                      <Card>
                        <CardContent className="pt-6 prose max-w-none">
                          {result.analysis_results ? (
                            <ReactMarkdown className="prose">
                              {formatAnalysisResults(result.analysis_results)}
                            </ReactMarkdown>
                          ) : (
                            <p className="text-muted-foreground">No detailed analysis results available for this entry.</p>
                          )}
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

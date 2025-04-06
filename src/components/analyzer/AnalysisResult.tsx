
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import ReactMarkdown from 'react-markdown';

interface AnalysisResultProps {
  analysisResult: any | null;
}

const AnalysisResult = ({ analysisResult }: AnalysisResultProps) => {
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
    <Card>
      <CardHeader>
        <h2 className="text-lg font-semibold">Analysis Result</h2>
      </CardHeader>
      <CardContent>
        {analysisResult ? (
          <div className="prose max-w-none">
            <ReactMarkdown>
              {formatAnalysisResults(analysisResult)}
            </ReactMarkdown>
          </div>
        ) : (
          <p>No analysis result yet.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default AnalysisResult;

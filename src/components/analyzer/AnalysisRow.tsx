import { format } from 'date-fns';
import { TableRow, TableCell } from "@/components/ui/table";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import AnalysisStatusBadge from './AnalysisStatusBadge';
import AnalysisDetails from './AnalysisDetails';
import { ContractAnalysis } from './AnalysisHistory';
import { formatAnalysisResults } from '@/utils/analysisFormatter';

interface AnalysisRowProps {
  result: ContractAnalysis;
  isExpanded: boolean;
  onToggle: () => void;
}

const AnalysisRow = ({ result, isExpanded, onToggle }: AnalysisRowProps) => {
  const handleExportPDF = async () => {
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Title and Document info
    doc.setFontSize(16);
    doc.text("AI Analysis of Terms and Conditions - Report", pageWidth/2, 20, { align: 'center' });
    doc.setFontSize(10);
    doc.text(`Document: ${result.filename}`, pageWidth/2, 30, { align: 'center' });
    doc.line(20, 35, pageWidth-20, 35);

    // Analysis Summary section
    doc.setFontSize(12);
    doc.text("Analysis Summary", 20, 45);
    
    // Summary box with scores
    const summaryY = 55;
    doc.rect(20, summaryY, pageWidth-40, 15);
    doc.line(pageWidth/3, summaryY, pageWidth/3, summaryY+15);
    doc.line(2*pageWidth/3, summaryY, 2*pageWidth/3, summaryY+15);
    
    doc.setFontSize(9);
    const scoreText = result.analysis_score ? `${result.analysis_score}%` : 'N/A';
    doc.text(`Complexity Score: ${scoreText}`, 25, summaryY+10);
    doc.text(`Financial Impact: ${scoreText}`, pageWidth/3 + 5, summaryY+10);
    doc.text(`Unusual Terms: ${scoreText}`, 2*pageWidth/3 + 5, summaryY+10);

    // Format and add analysis content
    if (result.analysis_results) {
      const content = formatAnalysisResults(result.analysis_results)
        .replace(/#{1,6}\s/g, '') // Remove markdown headers
        .split('\n')
        .filter(line => line.trim()); // Remove empty lines
      
      let y = 85;
      let currentSection = '';
      
      content.forEach(line => {
        if (y > 270) {
          doc.addPage();
          y = 20;
        }
        
        doc.setFontSize(9);
        
        // Check if line is a section header
        if (line.includes('Findings:') || line.includes('Terms:')) {
          if (line.includes('Findings:')) {
            doc.setFont(undefined, 'bold');
            currentSection = line.substring(0, line.indexOf('Findings:')).trim();
            doc.text(`[${currentSection}]`, 20, y);
            y += 5;
            doc.setFont(undefined, 'normal');
            line = line.substring(line.indexOf('Findings:'));
          }
          doc.setFont(undefined, 'normal');
          doc.text(line, 25, y);
          y += 5;
        } else {
          // Regular content
          const words = line.split(' ');
          let currentLine = '';
          
          words.forEach(word => {
            if ((currentLine + ' ' + word).length > 90) {
              doc.text(currentLine, 25, y);
              y += 5;
              currentLine = word;
            } else {
              currentLine += (currentLine ? ' ' : '') + word;
            }
          });
          
          if (currentLine) {
            doc.text(currentLine, 25, y);
            y += 5;
          }
        }
      });
      
      // Add legend at the bottom of the last page
      doc.setFontSize(8);
      doc.text("Legend: [!] High Risk, [?] Medium Risk, [F] Financial Term, [-] Non-Financial Term", 20, 280);
    }
    
    // Save the PDF
    doc.save(`analysis-${result.filename}.pdf`);
  };

  return (
    <Collapsible
      open={isExpanded}
      onOpenChange={onToggle}
      className="w-full"
    >
      <TableRow className="cursor-pointer hover:bg-muted/60" onClick={onToggle}>
        <TableCell>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
              {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </Button>
          </CollapsibleTrigger>
        </TableCell>
        <TableCell className="font-medium">
          {format(new Date(result.created_at), 'yyyy-MM-dd HH:mm')}
        </TableCell>
        <TableCell className="max-w-[180px] truncate">{result.filename}</TableCell>
        <TableCell><AnalysisStatusBadge status={result.status} /></TableCell>
        <TableCell className="text-right">
          {result.analysis_score !== undefined ? result.analysis_score : 'N/A'}
        </TableCell>
      </TableRow>
      <CollapsibleContent>
        <tr>
          <td colSpan={5} className="p-0">
            <div className="py-4 px-4 bg-muted/20">
              <div className="flex justify-end mb-4">
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleExportPDF();
                  }}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <FileText className="h-4 w-4" />
                  Export PDF
                </Button>
              </div>
              <AnalysisDetails analysisResults={result.analysis_results} />
            </div>
          </td>
        </tr>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default AnalysisRow;

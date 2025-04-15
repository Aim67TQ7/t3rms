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
    const doc = new jsPDF({
      format: 'letter',
      unit: 'pt'
    });
    
    const pageWidth = doc.internal.pageSize.getWidth();
    const marginX = 50;
    const contentWidth = pageWidth - (marginX * 2);
    
    // Title and Document info
    doc.setFontSize(16);
    doc.text("AI Analysis of Terms and Conditions - Report", pageWidth/2, 50, { align: 'center' });
    doc.setFontSize(10);
    doc.text(`Document: ${result.filename}`, pageWidth/2, 70, { align: 'center' });
    doc.line(marginX, 85, pageWidth - marginX, 85);

    // Analysis Summary section
    doc.setFontSize(12);
    doc.text("Analysis Summary", marginX, 105);
    
    // Summary box with scores
    const summaryY = 120;
    doc.rect(marginX, summaryY, contentWidth, 40);
    doc.line(pageWidth/3, summaryY, pageWidth/3, summaryY+40);
    doc.line(2*pageWidth/3, summaryY, 2*pageWidth/3, summaryY+40);
    
    doc.setFontSize(10);
    const scoreText = result.analysis_score ? `${result.analysis_score}%` : 'N/A';
    doc.text(`Complexity Score: ${scoreText}`, marginX + 10, summaryY + 25);
    doc.text(`Financial Impact: ${scoreText}`, pageWidth/3 + 10, summaryY + 25);
    doc.text(`Unusual Terms: ${scoreText}`, 2*pageWidth/3 + 10, summaryY + 25);

    // Format and add analysis content
    if (result.analysis_results) {
      const content = formatAnalysisResults(result.analysis_results)
        .replace(/#{1,6}\s/g, '') // Remove markdown headers
        .split('\n')
        .filter(line => line.trim()); // Remove empty lines
      
      let y = 180;
      let currentSection = '';
      
      content.forEach(line => {
        if (y > doc.internal.pageSize.getHeight() - 50) {
          doc.addPage();
          y = 50;
        }
        
        // Clean special characters
        line = line.replace(/Ø=ßá|[^\x00-\x7F]/g, '');
        
        doc.setFontSize(10);
        
        if (line.includes('Findings:') || line.includes('Terms:') || 
            /^\d+\.\s/.test(line) || 
            line.includes('Critical Points') || 
            line.includes('Financial Risks') || 
            line.includes('Unusual Language') ||
            line.includes('Recommendations')) {
          
          if (line.includes('Critical Points') || 
              line.includes('Financial Risks') || 
              line.includes('Unusual Language') ||
              line.includes('Recommendations')) {
            doc.setFont(undefined, 'bold');
            doc.text(line, marginX, y);
            y += 20;
            doc.setFont(undefined, 'normal');
            return;
          }
          
          if (/^\d+\.\s/.test(line)) {
            doc.setFont(undefined, 'bold');
            doc.text(line, marginX, y);
            y += 15;
            doc.setFont(undefined, 'normal');
            return;
          }
          
          if (line.includes('Findings:')) {
            if (line.indexOf('Findings:') > 0) {
              currentSection = line.substring(0, line.indexOf('Findings:')).trim();
              doc.setFont(undefined, 'bold');
              doc.text(`[${currentSection}]`, marginX, y);
              y += 15;
              doc.setFont(undefined, 'normal');
              line = line.substring(line.indexOf('Findings:'));
            }
            doc.text(line, marginX + 10, y);
            y += 15;
          }
        } else if (line.includes('Location:') || line.includes('Excerpt:')) {
          if (line.includes('Location:')) {
            doc.setFont(undefined, 'italic');
            doc.text(line, marginX + 10, y);
            y += 15;
            doc.setFont(undefined, 'normal');
          } else {
            doc.setFont(undefined, 'italic');
            doc.text('Excerpt:', marginX + 10, y);
            y += 15;
            doc.setFont(undefined, 'normal');
          }
        } else if (line.startsWith('```') || line.endsWith('```')) {
          return;
        } else {
          const maxWidth = contentWidth - 20;
          const words = line.split(' ');
          let currentLine = '';
          
          words.forEach(word => {
            const testLine = currentLine + word + ' ';
            const testWidth = doc.getStringUnitWidth(testLine) * doc.getFontSize();
            
            if (testWidth > maxWidth) {
              doc.text(currentLine.trim(), marginX + 10, y);
              y += 12;
              currentLine = word + ' ';
            } else {
              currentLine = testLine;
            }
          });
          
          if (currentLine.trim()) {
            doc.text(currentLine.trim(), marginX + 10, y);
            y += 15;
          }
        }
      });
    }
    
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

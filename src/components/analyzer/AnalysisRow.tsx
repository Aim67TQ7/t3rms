
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
    
    // Set title
    doc.setFontSize(16);
    doc.text("Contract Analysis Report", 20, 20);
    
    // Add basic information
    doc.setFontSize(12);
    doc.text(`File: ${result.filename}`, 20, 35);
    doc.text(`Date: ${format(new Date(result.created_at), 'yyyy-MM-dd HH:mm')}`, 20, 45);
    doc.text(`Score: ${result.analysis_score || 'N/A'}`, 20, 55);
    
    // Add analysis content
    if (result.analysis_results) {
      const content = formatAnalysisResults(result.analysis_results)
        .replace(/#{1,6}\s/g, '') // Remove markdown headers
        .split('\n')
        .filter(line => line.trim()); // Remove empty lines
      
      let y = 70;
      content.forEach(line => {
        if (y > 270) { // Check if we need a new page
          doc.addPage();
          y = 20;
        }
        
        // Split long lines
        const words = line.split(' ');
        let currentLine = '';
        
        words.forEach(word => {
          if ((currentLine + ' ' + word).length > 80) {
            doc.text(currentLine, 20, y);
            y += 10;
            currentLine = word;
          } else {
            currentLine += (currentLine ? ' ' : '') + word;
          }
        });
        
        if (currentLine) {
          doc.text(currentLine, 20, y);
          y += 10;
        }
      });
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


import { useState } from 'react';
import { format } from 'date-fns';
import { TableRow, TableCell } from "@/components/ui/table";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import AnalysisStatusBadge from './AnalysisStatusBadge';
import AnalysisDetails from './AnalysisDetails';
import { ContractAnalysis } from './AnalysisHistory';

interface AnalysisRowProps {
  result: ContractAnalysis;
  isExpanded: boolean;
  onToggle: () => void;
}

const AnalysisRow = ({ result, isExpanded, onToggle }: AnalysisRowProps) => {
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
        <TableCell>{result.filename}</TableCell>
        <TableCell><AnalysisStatusBadge status={result.status} /></TableCell>
        <TableCell className="text-right">
          {result.analysis_score !== undefined ? result.analysis_score : 'N/A'}
        </TableCell>
      </TableRow>
      <CollapsibleContent>
        <tr>
          <td colSpan={5} className="p-0">
            <div className="py-2 px-4 bg-muted/20">
              <AnalysisDetails analysisResults={result.analysis_results} />
            </div>
          </td>
        </tr>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default AnalysisRow;

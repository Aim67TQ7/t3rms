import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import AnalysisRow from './AnalysisRow';

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

  return (
    <div className="w-full border rounded-md overflow-hidden">
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
            <AnalysisRow
              key={result.id}
              result={result}
              isExpanded={expandedAnalysis === result.id}
              onToggle={() => toggleExpand(result.id)}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AnalysisHistory;

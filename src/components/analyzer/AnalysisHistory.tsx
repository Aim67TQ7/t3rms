
import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
  if (isLoading) {
    return <p>Loading analysis history...</p>;
  }

  if (!analysisResults || analysisResults.length === 0) {
    return <p>No analysis history available.</p>;
  }

  return (
    <Table>
      <TableCaption>A list of your previous analyses.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Date</TableHead>
          <TableHead>Filename</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Score</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {analysisResults.map((result) => (
          <TableRow key={result.id}>
            <TableCell className="font-medium">
              {format(new Date(result.created_at), 'yyyy-MM-dd HH:mm')}
            </TableCell>
            <TableCell>{result.filename}</TableCell>
            <TableCell>{result.status}</TableCell>
            <TableCell>{result.analysis_score || 'N/A'}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default AnalysisHistory;

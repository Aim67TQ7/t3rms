import {
  Table,
  TableBody,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import AnalysisRow from './AnalysisRow';
import type { Database } from '@/integrations/supabase/types';

// Define the ContractAnalysis type based on the database schema
export type ContractAnalysis = Database['public']['Tables']['contract_analyses']['Row'];

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
            <TableHead className="w-[48px]"></TableHead>
            <TableHead className="w-[180px] text-left">Date</TableHead>
            <TableHead className="text-left">Filename</TableHead>
            <TableHead className="w-[120px] text-left">Status</TableHead>
            <TableHead className="w-[80px] text-right">Score</TableHead>
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

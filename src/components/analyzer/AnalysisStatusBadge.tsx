
import { Badge } from "@/components/ui/badge";

interface AnalysisStatusBadgeProps {
  status: string;
}

const AnalysisStatusBadge = ({ status }: AnalysisStatusBadgeProps) => {
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

export default AnalysisStatusBadge;

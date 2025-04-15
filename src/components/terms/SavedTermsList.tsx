
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { FileText, Download } from "lucide-react";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/components/navbar/useAuth";

interface SavedTerm {
  id: string;
  business_name: string;
  policy_types: string[];
  created_at: string;
  generated_content: string;
}

export function SavedTermsList() {
  const { userId } = useAuth();

  const { data: savedTerms, isLoading } = useQuery<SavedTerm[]>({
    queryKey: ['saved-terms', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('generated_terms')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!userId
  });

  const handleDownload = (term: SavedTerm) => {
    const blob = new Blob([term.generated_content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `terms-and-conditions-${term.business_name}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return <div>Loading saved terms...</div>;
  }

  if (!savedTerms?.length) {
    return <div className="text-center text-gray-500 my-8">No saved terms found</div>;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Business Name</TableHead>
            <TableHead>Policy Types</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {savedTerms.map((term) => (
            <TableRow key={term.id}>
              <TableCell>{term.business_name}</TableCell>
              <TableCell>{term.policy_types.join(", ")}</TableCell>
              <TableCell>{format(new Date(term.created_at), "PPP")}</TableCell>
              <TableCell className="text-right">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownload(term)}
                  className="ml-2"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Table>
    </div>
  );
}


import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, UserPlus, EyeOff } from "lucide-react";
import AuthPrompt from "@/components/AuthPrompt";

interface RegisterToViewPromptProps {
  documentType: 'analysis' | 'generation';
  onCancel?: () => void;
}

const RegisterToViewPrompt = ({ documentType, onCancel }: RegisterToViewPromptProps) => {
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="mx-auto rounded-full bg-blue-100 w-12 h-12 flex items-center justify-center mb-4">
          {documentType === 'analysis' ? (
            <FileText className="h-6 w-6 text-blue-600" />
          ) : (
            <EyeOff className="h-6 w-6 text-blue-600" />
          )}
        </div>
        <CardTitle className="text-center">Create an Account to Continue</CardTitle>
        <CardDescription className="text-center">
          {documentType === 'analysis' 
            ? "Your document analysis is ready to view" 
            : "Your generated document is ready to view"
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center mb-6">
          <p className="text-gray-700">
            To access your {documentType === 'analysis' ? 'document analysis' : 'generated document'}, 
            you'll need to create a free account or sign in.
          </p>
          <p className="text-gray-600 text-sm mt-2">
            Creating an account allows you to:
          </p>
          <ul className="text-sm text-gray-600 mt-2 space-y-1">
            <li>• Access your document immediately</li>
            <li>• Save documents for future reference</li>
            <li>• Track your credit usage</li>
            <li>• Download in multiple formats</li>
          </ul>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-3">
        <AuthPrompt buttonClass="w-full" buttonText="Sign In or Create Account">
          <UserPlus className="h-4 w-4 mr-2" />
        </AuthPrompt>
        
        {onCancel && (
          <Button variant="ghost" onClick={onCancel} className="w-full">
            Cancel
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default RegisterToViewPrompt;

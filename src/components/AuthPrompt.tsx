
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from "@/components/ui/card";
import { Link } from "react-router-dom";

interface AuthPromptProps {
  onDismiss?: () => void;
  showDismiss?: boolean;
  buttonText?: string;
  buttonClass?: string;
  buttonVariant?: string;
  children?: React.ReactNode;
}

const AuthPrompt = ({ 
  onDismiss, 
  showDismiss = true, 
  buttonText = "Sign Up Now",
  buttonClass = "",
  buttonVariant = "default",
  children
}: AuthPromptProps) => {
  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle>Your Analysis is Ready!</CardTitle>
        <CardDescription>
          Sign up to view your results and get more analyses.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Create a free account to get:
          </p>
          <ul className="list-disc pl-5 text-sm text-gray-600">
            <li>3 free document analyses</li>
            <li>Basic risk identification</li>
            <li>Documents up to 20 pages</li>
            <li>Document history</li>
            <li>Downloadable PDFs</li>
          </ul>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
        {showDismiss && (
          <Button 
            variant="outline" 
            onClick={onDismiss}
            className="w-full"
          >
            Maybe Later
          </Button>
        )}
        <Button 
          className={`w-full ${buttonClass}`}
          variant={buttonVariant as any}
          asChild
        >
          <Link to="/auth">
            {children}
            {buttonText}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AuthPrompt;

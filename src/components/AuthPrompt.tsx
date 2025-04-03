
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from "@/components/ui/card";

interface AuthPromptProps {
  onDismiss?: () => void;
  showDismiss?: boolean;
}

const AuthPrompt = ({ onDismiss, showDismiss = true }: AuthPromptProps) => {
  const navigate = useNavigate();

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle>Want to continue analyzing?</CardTitle>
        <CardDescription>
          You've used your free analysis. Sign in or create an account to continue.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600">
          Create a free account to get 5 analyses per month and save your analysis history.
        </p>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
        <Button 
          onClick={() => navigate('/auth')}
          className="w-full bg-t3rms-blue hover:bg-t3rms-blue/90"
        >
          Sign In / Sign Up
        </Button>
        {showDismiss && (
          <Button 
            variant="outline" 
            onClick={onDismiss}
            className="w-full"
          >
            Maybe Later
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default AuthPrompt;

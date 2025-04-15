
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from "@/components/ui/card";

interface AuthPromptProps {
  onDismiss?: () => void;
  showDismiss?: boolean;
  buttonText?: string; // Added buttonText prop
}

const AuthPrompt = ({ onDismiss, showDismiss = true, buttonText = "Get Started" }: AuthPromptProps) => {
  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle>Want to continue analyzing?</CardTitle>
        <CardDescription>
          You've used your free analysis. Get more by registering.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600">
          Create a free account to get 5 analyses per month and save your analysis history.
        </p>
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
        <Button className="w-full">
          {buttonText}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AuthPrompt;

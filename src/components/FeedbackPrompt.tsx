
import { useState, Fragment } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { X, Send } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface FeedbackPromptProps {
  isOpen: boolean;
  onClose: () => void;
  userId?: string;
}

export default function FeedbackPrompt({ isOpen, onClose, userId }: FeedbackPromptProps) {
  const [step, setStep] = useState(1);
  const [rating, setRating] = useState<number | null>(null);
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const RATING_OPTIONS = [
    { value: 1, label: 'Very Dissatisfied' },
    { value: 2, label: 'Dissatisfied' },
    { value: 3, label: 'Neutral' },
    { value: 4, label: 'Satisfied' },
    { value: 5, label: 'Very Satisfied' },
  ];

  const handleSubmit = async () => {
    if (step === 1 && rating === null) return;
    
    if (step === 1) {
      setStep(2);
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Submit feedback to Supabase
      await supabase
        .from('feedback')
        .insert({
          user_id: userId || null,
          rating,
          feedback: feedback.trim() || null,
        });
      
      toast({
        title: "Feedback submitted",
        description: "Thank you for your feedback!",
      });
      
      // Reset and close
      setRating(null);
      setFeedback('');
      setStep(1);
      onClose();
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast({
        title: "Error",
        description: "There was an error submitting your feedback. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleClose = () => {
    // Reset state and close
    setRating(null);
    setFeedback('');
    setStep(1);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-md">
        <DialogTitle className="flex items-center justify-between">
          {step === 1 ? "How was your experience?" : "Any additional feedback?"}
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={handleClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogTitle>
        
        <DialogDescription className="text-center mb-4">
          {step === 1 
            ? "Your feedback helps us improve our service"
            : "Please share any additional thoughts (optional)"
          }
        </DialogDescription>
        
        {step === 1 ? (
          <RadioGroup value={rating?.toString()} onValueChange={(value) => setRating(parseInt(value))}>
            <div className="flex flex-col space-y-3">
              {RATING_OPTIONS.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem id={`rating-${option.value}`} value={option.value.toString()} />
                  <Label htmlFor={`rating-${option.value}`}>{option.label}</Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        ) : (
          <Textarea 
            placeholder="Your thoughts and suggestions..." 
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            className="min-h-[120px]"
          />
        )}
        
        <div className="flex justify-end mt-4">
          {step === 2 && (
            <Button variant="ghost" onClick={() => setStep(1)} className="mr-2">
              Back
            </Button>
          )}
          <Button 
            onClick={handleSubmit} 
            disabled={step === 1 && rating === null || isSubmitting}
            className="flex items-center gap-2"
          >
            {isSubmitting ? "Submitting..." : step === 1 ? "Next" : "Submit"}
            {!isSubmitting && <Send className="h-4 w-4" />}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

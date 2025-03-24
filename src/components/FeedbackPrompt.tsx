
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';

interface FeedbackPromptProps {
  isOpen: boolean;
  onClose: () => void;
  userId?: string;
}

const FeedbackPrompt = ({ isOpen, onClose, userId }: FeedbackPromptProps) => {
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (rating === 0) {
      toast({
        title: "Rating required",
        description: "Please provide a rating before submitting.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Save anonymously if no user ID
      if (userId) {
        // Update the user's feedback in the database
        const { error } = await supabase
          .from('t3rms_users')
          .update({
            feedback_rating: rating,
            feedback_comments: comment,
            // Give them 2 bonus analyses for providing feedback
            monthly_remaining: supabase.rpc('increment_remaining_analyses', { increment_amount: 2 })
          })
          .eq('user_id', userId);

        if (error) throw error;
      } else {
        // For anonymous users, just save feedback without linking to a user
        const { error } = await supabase
          .from('anonymous_feedback')
          .insert({
            rating,
            comment
          });
          
        if (error) throw error;
      }

      toast({
        title: "Thank you for your feedback!",
        description: userId ? "You've received 2 bonus analyses." : "Your feedback helps us improve.",
      });

      onClose();
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast({
        title: "Error submitting feedback",
        description: "There was a problem saving your feedback. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Help us improve T3RMS</DialogTitle>
          <DialogDescription>
            Your feedback helps us make T3RMS more valuable. Would you mind sharing your thoughts?
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">How would you rate your experience? (1-5)</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  onClick={() => setRating(value)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    rating === value 
                      ? 'bg-t3rms-blue text-white' 
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  <Star 
                    className={`h-5 w-5 ${rating >= value ? 'fill-current' : ''}`} 
                  />
                </button>
              ))}
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Any suggestions to improve our service?</label>
            <textarea 
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full p-2 border rounded-md"
              rows={3}
              placeholder="Tell us what you think..."
            />
          </div>
        </div>

        <DialogFooter className="flex justify-between sm:justify-between">
          <Button 
            variant="outline" 
            onClick={handleSkip}
          >
            Skip
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting}
            className="bg-t3rms-blue hover:bg-t3rms-blue/90"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackPrompt;

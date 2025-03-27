
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

type FeedbackPromptProps = {
  isOpen: boolean;
  onClose: () => void;
  userId?: string;
};

const FeedbackPrompt = ({ isOpen, onClose, userId }: FeedbackPromptProps) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const resetState = () => {
    setRating(0);
    setComment('');
    setIsSubmitting(false);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      toast({
        title: 'Rating Required',
        description: 'Please select a rating before submitting feedback.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      if (userId) {
        // For logged in users
        await supabase
          .from('feedback')
          .insert({
            user_id: userId,
            rating,
            comment: comment || null,
          });

        // Increment the user's monthly_remaining by 2
        await supabase
          .rpc('increment_user_remaining', {
            user_id: userId,
            increment_amount: 2
          });
      } else {
        // For anonymous users
        await supabase
          .from('anonymous_feedback')
          .insert({
            rating,
            comment: comment || null,
          });
      }

      toast({
        title: 'Thank You!',
        description: userId
          ? 'Your feedback was submitted and you received 2 extra analyses.'
          : 'Your feedback was submitted. Thank you!',
      });

      handleClose();
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast({
        title: 'Submission Failed',
        description: 'There was a problem submitting your feedback. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = async () => {
    handleClose();
    
    // Make sure we handle the promise properly
    void supabase
      .from('anonymous_feedback')
      .insert({
        rating: 0,
        comment: 'Skipped feedback prompt',
      })
      .then(() => {
        console.log('Recorded skipped feedback');
      })
      .catch(error => {
        console.error('Error recording skipped feedback:', error);
      });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>How was your experience?</DialogTitle>
          <DialogDescription>
            We'd love to hear your feedback! {userId && 'You'll get 2 bonus analyses for your input.'}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="mb-6">
            <p className="text-sm font-medium mb-2">Rate your experience:</p>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  onClick={() => setRating(value)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                    rating === value
                      ? 'bg-t3rms-blue text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                  }`}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <p className="text-sm font-medium mb-2">Additional comments (optional):</p>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full p-2 border rounded-md"
              rows={3}
              placeholder="Tell us about your experience..."
            />
          </div>

          <div className="flex justify-between">
            <Button variant="outline" onClick={handleSkip} disabled={isSubmitting}>
              Skip
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </>
              ) : (
                <>
                  <Star className="mr-2 h-4 w-4" /> Submit Feedback
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackPrompt;


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
import { Textarea } from '@/components/ui/textarea';

interface FeedbackPromptProps {
  isOpen: boolean;
  onClose: () => void;
  userId?: string;
}

const FeedbackPrompt = ({ isOpen, onClose, userId }: FeedbackPromptProps) => {
  const [rating, setRating] = useState<number>(5); // Default to 5 stars
  const [comment, setComment] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { toast } = useToast();

  const getIPAddress = async () => {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch (error) {
      console.error('Error fetching IP address:', error);
      return null;
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      if (userId) {
        // For authenticated users, update both tables
        
        // 1. First, call the RPC function to increment analyses
        const { data: incrementResult, error: rpcError } = await supabase.rpc(
          'increment_remaining_analyses', 
          { increment_amount: 2 }
        );
        
        if (rpcError) throw rpcError;
        
        // 2. Update the user's feedback in t3rms_users table (for backward compatibility)
        const { error: userUpdateError } = await supabase
          .from('t3rms_users')
          .update({
            feedback_rating: rating,
            feedback_comments: comment
          })
          .eq('user_id', userId);

        if (userUpdateError) throw userUpdateError;
        
        // 3. Insert into the new feedback table
        const { error: feedbackError } = await supabase
          .from('feedback')
          .insert({
            user_id: userId,
            rating,
            comment
          });
          
        if (feedbackError) throw feedbackError;
      } else {
        // For anonymous users, save IP address with feedback
        const ipAddress = await getIPAddress();
        
        const { error } = await supabase
          .from('anonymous_feedback')
          .insert({
            ip_address: ipAddress,
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
    // Save a default 5-star rating with empty comment if user skips
    if (userId) {
      // Insert into feedback table with default values
      void supabase
        .from('feedback')
        .insert({
          user_id: userId,
          rating: 5, // Default 5-star rating
          comment: '' // Empty comment
        })
        .then(() => {
          console.log('Default feedback saved on skip');
        })
        .catch(error => {
          console.error('Error saving default feedback:', error);
        });
    }
    
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
            <Textarea 
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

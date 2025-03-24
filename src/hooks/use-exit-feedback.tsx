
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useExitFeedback = () => {
  const [showFeedbackPrompt, setShowFeedbackPrompt] = useState(false);
  const [hasGivenFeedback, setHasGivenFeedback] = useState(false);
  
  // Check if user is authenticated
  const { data: session } = useQuery({
    queryKey: ['authSession'],
    queryFn: async () => {
      const { data } = await supabase.auth.getSession();
      return data.session;
    }
  });

  // Check if user has already given feedback
  const { data: userData } = useQuery({
    queryKey: ['userFeedback', session?.user?.id],
    queryFn: async () => {
      if (!session) return null;
      
      const { data, error } = await supabase
        .from('t3rms_users')
        .select('feedback_rating')
        .eq('user_id', session.user.id)
        .single();
        
      if (error) {
        console.error('Error fetching user feedback:', error);
        return null;
      }
      
      return data;
    },
    enabled: !!session
  });

  useEffect(() => {
    // If user has already given feedback (rating exists), don't show the prompt
    if (userData?.feedback_rating) {
      setHasGivenFeedback(true);
    }
  }, [userData]);

  useEffect(() => {
    // Only attach the listener if they haven't given feedback
    if (hasGivenFeedback) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      // Check if we're already showing the prompt
      if (showFeedbackPrompt) return;
      
      // Show our custom prompt instead of browser's default
      setShowFeedbackPrompt(true);
      
      // Standard beforeunload handling to show browser dialog
      e.preventDefault();
      e.returnValue = '';
      
      return '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [showFeedbackPrompt, hasGivenFeedback]);

  // Also provide a way to manually trigger the feedback prompt
  const triggerFeedbackPrompt = () => {
    if (!hasGivenFeedback) {
      setShowFeedbackPrompt(true);
    }
  };

  const closeFeedbackPrompt = () => {
    setShowFeedbackPrompt(false);
    setHasGivenFeedback(true);
  };

  return {
    showFeedbackPrompt,
    triggerFeedbackPrompt,
    closeFeedbackPrompt,
    userId: session?.user?.id
  };
};


import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://axtrpteapxvkijzwipts.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF4dHJwdGVhcHh2a2lqendpcHRzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUwNTUzNTIsImV4cCI6MjA2MDYzMTM1Mn0.Sl4L9JKp1rBzL-AaYya-QB6nARZtEGbQXHRYa0hYFBU";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

/**
 * Ensures that a user profile exists in the database for the given user ID
 * If a profile doesn't exist, it will create one with the provided email
 */
export const ensureUserProfile = async (userId: string, email: string): Promise<void> => {
  try {
    const { data: existingProfile, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (fetchError) {
      console.error('Error checking for existing user profile:', fetchError);
      return;
    }

    if (!existingProfile) {
      const { error: insertError } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          email,
          created_at: new Date().toISOString(),
        });

      if (insertError) {
        console.error('Error creating user profile:', insertError);
      }
    }
  } catch (error) {
    console.error('Error in ensureUserProfile:', error);
  }
};

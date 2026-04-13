import { supabase } from './supabase';

export const logActivity = async (userId: string, action: string, details: string) => {
  try {
    const { error } = await supabase
      .from('activity_logs')
      .insert([{
        user_id: userId,
        action,
        details,
        created_at: new Date().toISOString()
      }]);
    
    if (error) console.error('Error logging activity:', error);
  } catch (err) {
    console.error('Activity log failed:', err);
  }
};

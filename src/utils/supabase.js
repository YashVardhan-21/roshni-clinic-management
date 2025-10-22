import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Detailed error messages for missing environment variables
if (!supabaseUrl) {
  console.error('❌ Missing VITE_SUPABASE_URL environment variable');
  throw new Error('VITE_SUPABASE_URL is not set. Please add it to your environment variables in Vercel.');
}

if (!supabaseAnonKey) {
  console.error('❌ Missing VITE_SUPABASE_ANON_KEY environment variable');
  throw new Error('VITE_SUPABASE_ANON_KEY is not set. Please add it to your environment variables in Vercel.');
}

// Log configuration in production (without exposing sensitive data)
console.log('✅ Supabase configured:', {
  url: supabaseUrl,
  hasAnonKey: !!supabaseAnonKey,
  keyPrefix: supabaseAnonKey?.substring(0, 10) + '...',
  environment: import.meta.env.MODE
});

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
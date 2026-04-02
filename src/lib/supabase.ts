import { createClient } from '@supabase/supabase-js';
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables');
}
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export interface Transaction {
    id: string;
    user_id: string;
    date: string;
    amount: number;
    category: string;
    type: 'income' | 'expense';
    description: string;
    created_at: string;
}
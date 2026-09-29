import { createClient } from '@supabase/supabase-js';
import type { Session, User } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const FOUNDER_EMAIL = 'debasishchhatar4@gmail.com';

export interface GameHistoryRecord {
  id: string;
  prompt: string;
  game_type: '2d' | '3d';
  game_id: string;
  game_title: string;
  config: Record<string, unknown> | null;
  created_at: string;
  user_id: string | null;
}

export interface ShowcaseRecord {
  id: string;
  game_history_id: string | null;
  user_id: string | null;
  game_id: string;
  game_title: string;
  game_type: '2d' | '3d';
  prompt: string;
  theme: string | null;
  difficulty: string | null;
  color_scheme: string | null;
  is_featured: boolean;
  likes: number;
  created_at: string;
}

export type { Session, User };

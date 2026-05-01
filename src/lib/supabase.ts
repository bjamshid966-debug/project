import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Anime = {
  id: string;
  title: string;
  title_japanese: string;
  synopsis: string;
  genre: string[];
  status: string;
  episodes: number;
  rating: number;
  cover_image: string;
  banner_image: string;
  year: number;
  season: string;
  studio: string;
  type: string;
  created_at: string;
};

export type Review = {
  id: string;
  anime_id: string;
  user_name: string;
  rating: number;
  comment: string;
  created_at: string;
};

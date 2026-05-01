
/*
  # Anime Website Database Schema

  1. New Tables
    - `anime`
      - `id` (uuid, primary key)
      - `title` (text) - Anime title
      - `title_japanese` (text) - Japanese title
      - `synopsis` (text) - Story description
      - `genre` (text[]) - List of genres
      - `status` (text) - Airing, Finished, Upcoming
      - `episodes` (int) - Number of episodes
      - `rating` (numeric) - Score out of 10
      - `cover_image` (text) - Cover image URL
      - `banner_image` (text) - Banner image URL
      - `year` (int) - Release year
      - `season` (text) - Season (Spring, Summer, Fall, Winter)
      - `studio` (text) - Animation studio
      - `type` (text) - TV, Movie, OVA, etc.
      - `created_at` (timestamptz)

    - `reviews`
      - `id` (uuid, primary key)
      - `anime_id` (uuid, FK to anime)
      - `user_name` (text)
      - `rating` (int)
      - `comment` (text)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Public read access for anime
    - Public read/insert for reviews (no auth required for demo)
*/

CREATE TABLE IF NOT EXISTS anime (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  title_japanese text DEFAULT '',
  synopsis text DEFAULT '',
  genre text[] DEFAULT '{}',
  status text DEFAULT 'Finished',
  episodes int DEFAULT 0,
  rating numeric(3,1) DEFAULT 0,
  cover_image text DEFAULT '',
  banner_image text DEFAULT '',
  year int DEFAULT 2024,
  season text DEFAULT 'Spring',
  studio text DEFAULT '',
  type text DEFAULT 'TV',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  anime_id uuid REFERENCES anime(id) ON DELETE CASCADE,
  user_name text NOT NULL DEFAULT 'Anonymous',
  rating int CHECK (rating >= 1 AND rating <= 10),
  comment text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE anime ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read anime"
  ON anime FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can read reviews"
  ON reviews FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can insert reviews"
  ON reviews FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Seed data
INSERT INTO anime (title, title_japanese, synopsis, genre, status, episodes, rating, cover_image, banner_image, year, season, studio, type) VALUES
(
  'Attack on Titan',
  'Shingeki no Kyojin',
  'In a world where humanity lives behind massive walls to protect themselves from giant humanoid creatures known as Titans, young Eren Yeager vows to exterminate all Titans after they destroy his hometown and kill his mother.',
  ARRAY['Action', 'Drama', 'Fantasy', 'Mystery'],
  'Finished',
  87,
  9.1,
  'https://images.pexels.com/photos/1666021/pexels-photo-1666021.jpeg?auto=compress&cs=tinysrgb&w=400',
  'https://images.pexels.com/photos/1666021/pexels-photo-1666021.jpeg?auto=compress&cs=tinysrgb&w=1200',
  2013,
  'Spring',
  'Wit Studio / MAPPA',
  'TV'
),
(
  'Demon Slayer',
  'Kimetsu no Yaiba',
  'Tanjiro Kamado becomes a demon slayer after his family is slaughtered and his sister Nezuko is turned into a demon. He seeks a cure while fighting supernatural threats.',
  ARRAY['Action', 'Adventure', 'Supernatural'],
  'Airing',
  44,
  8.7,
  'https://images.pexels.com/photos/3052361/pexels-photo-3052361.jpeg?auto=compress&cs=tinysrgb&w=400',
  'https://images.pexels.com/photos/3052361/pexels-photo-3052361.jpeg?auto=compress&cs=tinysrgb&w=1200',
  2019,
  'Spring',
  'ufotable',
  'TV'
),
(
  'Fullmetal Alchemist: Brotherhood',
  'Hagane no Renkinjutsushi',
  'Two brothers use alchemy in their quest to find the Philosopher''s Stone after a failed attempt to bring their mother back to life costs them their bodies.',
  ARRAY['Action', 'Adventure', 'Drama', 'Fantasy'],
  'Finished',
  64,
  9.1,
  'https://images.pexels.com/photos/2832382/pexels-photo-2832382.jpeg?auto=compress&cs=tinysrgb&w=400',
  'https://images.pexels.com/photos/2832382/pexels-photo-2832382.jpeg?auto=compress&cs=tinysrgb&w=1200',
  2009,
  'Spring',
  'Bones',
  'TV'
),
(
  'One Piece',
  'Wan Pisu',
  'Monkey D. Luffy explores the ocean in search of the world''s ultimate treasure known as the "One Piece" in order to become the next King of the Pirates.',
  ARRAY['Action', 'Adventure', 'Comedy', 'Fantasy'],
  'Airing',
  1100,
  8.9,
  'https://images.pexels.com/photos/1738441/pexels-photo-1738441.jpeg?auto=compress&cs=tinysrgb&w=400',
  'https://images.pexels.com/photos/1738441/pexels-photo-1738441.jpeg?auto=compress&cs=tinysrgb&w=1200',
  1999,
  'Fall',
  'Toei Animation',
  'TV'
),
(
  'Jujutsu Kaisen',
  'Jujutsu Kaisen',
  'Yuji Itadori joins a secret organization of Jujutsu Sorcerers in order to kill a powerful Curse named Ryomen Sukuna, of whom Yuji becomes the host.',
  ARRAY['Action', 'Supernatural', 'School'],
  'Airing',
  47,
  8.7,
  'https://images.pexels.com/photos/3876394/pexels-photo-3876394.jpeg?auto=compress&cs=tinysrgb&w=400',
  'https://images.pexels.com/photos/3876394/pexels-photo-3876394.jpeg?auto=compress&cs=tinysrgb&w=1200',
  2020,
  'Fall',
  'MAPPA',
  'TV'
),
(
  'Naruto Shippuden',
  'Naruto: Shippuuden',
  'Naruto Uzumaki, now two and a half years older, makes a heroic return and faces even more dangerous enemies and thrilling adventures in the sequel to Naruto.',
  ARRAY['Action', 'Adventure', 'Fantasy'],
  'Finished',
  500,
  8.6,
  'https://images.pexels.com/photos/1547813/pexels-photo-1547813.jpeg?auto=compress&cs=tinysrgb&w=400',
  'https://images.pexels.com/photos/1547813/pexels-photo-1547813.jpeg?auto=compress&cs=tinysrgb&w=1200',
  2007,
  'Winter',
  'Pierrot',
  'TV'
),
(
  'Sword Art Online',
  'Soudo Aato Onrain',
  'In 2022, a Virtual Reality Massive Multiplayer Online Role-Playing Game (VRMMORPG) called Sword Art Online is released. Players discover they cannot log out and must clear the game to escape.',
  ARRAY['Action', 'Adventure', 'Romance', 'Sci-Fi'],
  'Finished',
  25,
  7.2,
  'https://images.pexels.com/photos/2116475/pexels-photo-2116475.jpeg?auto=compress&cs=tinysrgb&w=400',
  'https://images.pexels.com/photos/2116475/pexels-photo-2116475.jpeg?auto=compress&cs=tinysrgb&w=1200',
  2012,
  'Summer',
  'A-1 Pictures',
  'TV'
),
(
  'Death Note',
  'Desu Nooto',
  'Light Yagami is a high school student who discovers a supernatural notebook that grants its user the ability to kill anyone whose name is written in its pages.',
  ARRAY['Mystery', 'Psychological', 'Supernatural', 'Thriller'],
  'Finished',
  37,
  9.0,
  'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=400',
  'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=1200',
  2006,
  'Fall',
  'Madhouse',
  'TV'
),
(
  'My Hero Academia',
  'Boku no Hero Academia',
  'A superhero-loving boy without any powers is determined to enroll in a prestigious hero academy and learn what it means to be a hero himself.',
  ARRAY['Action', 'School', 'Superhero'],
  'Finished',
  138,
  7.9,
  'https://images.pexels.com/photos/1036808/pexels-photo-1036808.jpeg?auto=compress&cs=tinysrgb&w=400',
  'https://images.pexels.com/photos/1036808/pexels-photo-1036808.jpeg?auto=compress&cs=tinysrgb&w=1200',
  2016,
  'Spring',
  'Bones',
  'TV'
),
(
  'Hunter x Hunter',
  'Hanta x Hanta',
  'Gon Freecss aspires to become a Hunter, an exceptional being capable of greatness. With his friends and his powers, Gon attempts to find the father who abandoned him.',
  ARRAY['Action', 'Adventure', 'Fantasy'],
  'Finished',
  148,
  9.0,
  'https://images.pexels.com/photos/1631677/pexels-photo-1631677.jpeg?auto=compress&cs=tinysrgb&w=400',
  'https://images.pexels.com/photos/1631677/pexels-photo-1631677.jpeg?auto=compress&cs=tinysrgb&w=1200',
  2011,
  'Fall',
  'Madhouse',
  'TV'
),
(
  'Vinland Saga',
  'Vinrando Saga',
  'Thorfinn pursues a journey with his father''s killer in order to take revenge and end his life in a duel as an honorable warrior and pay his father a homage.',
  ARRAY['Action', 'Adventure', 'Drama', 'Historical'],
  'Airing',
  48,
  8.8,
  'https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg?auto=compress&cs=tinysrgb&w=400',
  'https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg?auto=compress&cs=tinysrgb&w=1200',
  2019,
  'Summer',
  'Wit Studio',
  'TV'
),
(
  'Cowboy Bebop',
  'Kauboi Bibappu',
  'In 2071, humanity has colonized several of the planets and moons of the solar system leaving the now uninhabitable surface of planet Earth behind. The story follows the adventures of bounty hunter crew.',
  ARRAY['Action', 'Adventure', 'Sci-Fi', 'Drama'],
  'Finished',
  26,
  8.8,
  'https://images.pexels.com/photos/1252869/pexels-photo-1252869.jpeg?auto=compress&cs=tinysrgb&w=400',
  'https://images.pexels.com/photos/1252869/pexels-photo-1252869.jpeg?auto=compress&cs=tinysrgb&w=1200',
  1998,
  'Spring',
  'Sunrise',
  'TV'
);

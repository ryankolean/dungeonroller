/*
  # DungeonRoller Database Schema

  ## Overview
  Creates the complete database schema for the DungeonRoller D&D adventure game application.
  This replaces the Base44 SDK with Supabase for data persistence.

  ## New Tables

  ### `characters`
  Stores player character data including stats, equipment, and progression
  - `id` (uuid, primary key) - Unique character identifier
  - `user_id` (uuid, foreign key to auth.users) - Owner of the character
  - `name` (text) - Character name
  - `race` (text) - Character race (e.g., Human, Elf, Dwarf)
  - `class` (text) - Character class (e.g., Fighter, Wizard, Rogue)
  - `level` (integer) - Character level (1-20)
  - `experience_points` (integer) - Current XP
  - `hit_points` (integer) - Current HP
  - `max_hit_points` (integer) - Maximum HP
  - `armor_class` (integer) - Armor Class (AC)
  - `strength` (integer) - STR ability score
  - `dexterity` (integer) - DEX ability score
  - `constitution` (integer) - CON ability score
  - `intelligence` (integer) - INT ability score
  - `wisdom` (integer) - WIS ability score
  - `charisma` (integer) - CHA ability score
  - `background` (text) - Character background story
  - `equipment` (jsonb) - Equipment and inventory as JSON
  - `proficiencies` (jsonb) - Skills and proficiencies as JSON
  - `spells` (jsonb) - Known spells as JSON (for spellcasters)
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### `adventures`
  Stores active adventure sessions and their state
  - `id` (uuid, primary key) - Unique adventure identifier
  - `character_id` (uuid, foreign key to characters) - Playing character
  - `seed` (text) - Adventure scenario seed/theme
  - `current_node_id` (text) - Current story node/location
  - `path_log` (jsonb) - History of choices and events as JSON array
  - `status` (text) - Adventure status (active, completed, failed)
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### `public_adventures`
  Stores community-shared adventure templates
  - `id` (uuid, primary key) - Unique adventure template identifier
  - `creator_id` (uuid, foreign key to auth.users) - Creator of the adventure
  - `title` (text) - Adventure title
  - `description` (text) - Adventure description
  - `difficulty` (text) - Difficulty level (easy, medium, hard, deadly)
  - `estimated_duration` (text) - Estimated play time
  - `seed` (text) - Adventure seed/theme
  - `nodes` (jsonb) - Story nodes and encounters as JSON
  - `rating` (numeric) - Average rating (0-5)
  - `plays_count` (integer) - Number of times played
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### `adventure_reviews`
  Stores player reviews and ratings for public adventures
  - `id` (uuid, primary key) - Unique review identifier
  - `adventure_id` (uuid, foreign key to public_adventures) - Reviewed adventure
  - `user_id` (uuid, foreign key to auth.users) - Reviewer
  - `rating` (integer) - Rating (1-5)
  - `comment` (text) - Review text
  - `created_at` (timestamptz) - Creation timestamp

  ### `dice_rolls`
  Logs dice roll history for transparency and stats
  - `id` (uuid, primary key) - Unique roll identifier
  - `user_id` (uuid, foreign key to auth.users) - User who rolled
  - `adventure_id` (uuid, nullable foreign key to adventures) - Associated adventure
  - `dice_type` (text) - Type of dice (d4, d6, d8, d10, d12, d20, d100)
  - `count` (integer) - Number of dice rolled
  - `result` (jsonb) - Individual results and total as JSON
  - `context` (text) - What the roll was for (attack, skill check, etc.)
  - `created_at` (timestamptz) - Roll timestamp

  ### `combat_logs`
  Stores detailed combat encounter logs
  - `id` (uuid, primary key) - Unique log identifier
  - `adventure_id` (uuid, foreign key to adventures) - Associated adventure
  - `character_id` (uuid, foreign key to characters) - Participating character
  - `enemy_name` (text) - Enemy name
  - `actions` (jsonb) - Combat actions and results as JSON array
  - `outcome` (text) - Combat outcome (victory, defeat, fled)
  - `created_at` (timestamptz) - Combat timestamp

  ## Security

  ### Row Level Security (RLS)
  - All tables have RLS enabled
  - Users can only access their own data (characters, adventures, dice rolls, combat logs)
  - Public adventures are readable by all but only editable by creator
  - Reviews are readable by all but only editable by reviewer

  ### Policies
  - Restrictive policies requiring authentication
  - Ownership verification for all user-specific data
  - Public read access for community content

  ## Indexes
  - Foreign key indexes for efficient joins
  - User lookup indexes for filtering
  - Adventure status index for active game queries
*/

-- Create characters table
CREATE TABLE IF NOT EXISTS characters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  race text NOT NULL,
  class text NOT NULL,
  level integer NOT NULL DEFAULT 1,
  experience_points integer NOT NULL DEFAULT 0,
  hit_points integer NOT NULL,
  max_hit_points integer NOT NULL,
  armor_class integer NOT NULL,
  strength integer NOT NULL,
  dexterity integer NOT NULL,
  constitution integer NOT NULL,
  intelligence integer NOT NULL,
  wisdom integer NOT NULL,
  charisma integer NOT NULL,
  background text DEFAULT '',
  equipment jsonb DEFAULT '[]'::jsonb,
  proficiencies jsonb DEFAULT '[]'::jsonb,
  spells jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create adventures table
CREATE TABLE IF NOT EXISTS adventures (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  character_id uuid NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  seed text NOT NULL,
  current_node_id text NOT NULL DEFAULT 'start',
  path_log jsonb DEFAULT '[]'::jsonb,
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create public_adventures table
CREATE TABLE IF NOT EXISTS public_adventures (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  difficulty text NOT NULL DEFAULT 'medium',
  estimated_duration text DEFAULT '30-60 minutes',
  seed text NOT NULL,
  nodes jsonb DEFAULT '[]'::jsonb,
  rating numeric(3, 2) DEFAULT 0.00,
  plays_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create adventure_reviews table
CREATE TABLE IF NOT EXISTS adventure_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  adventure_id uuid NOT NULL REFERENCES public_adventures(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  UNIQUE(adventure_id, user_id)
);

-- Create dice_rolls table
CREATE TABLE IF NOT EXISTS dice_rolls (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  adventure_id uuid REFERENCES adventures(id) ON DELETE SET NULL,
  dice_type text NOT NULL,
  count integer NOT NULL DEFAULT 1,
  result jsonb NOT NULL,
  context text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Create combat_logs table
CREATE TABLE IF NOT EXISTS combat_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  adventure_id uuid NOT NULL REFERENCES adventures(id) ON DELETE CASCADE,
  character_id uuid NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  enemy_name text NOT NULL,
  actions jsonb DEFAULT '[]'::jsonb,
  outcome text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_characters_user_id ON characters(user_id);
CREATE INDEX IF NOT EXISTS idx_adventures_character_id ON adventures(character_id);
CREATE INDEX IF NOT EXISTS idx_adventures_status ON adventures(status);
CREATE INDEX IF NOT EXISTS idx_public_adventures_creator_id ON public_adventures(creator_id);
CREATE INDEX IF NOT EXISTS idx_adventure_reviews_adventure_id ON adventure_reviews(adventure_id);
CREATE INDEX IF NOT EXISTS idx_adventure_reviews_user_id ON adventure_reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_dice_rolls_user_id ON dice_rolls(user_id);
CREATE INDEX IF NOT EXISTS idx_dice_rolls_adventure_id ON dice_rolls(adventure_id);
CREATE INDEX IF NOT EXISTS idx_combat_logs_adventure_id ON combat_logs(adventure_id);
CREATE INDEX IF NOT EXISTS idx_combat_logs_character_id ON combat_logs(character_id);

-- Enable Row Level Security
ALTER TABLE characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE adventures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public_adventures ENABLE ROW LEVEL SECURITY;
ALTER TABLE adventure_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE dice_rolls ENABLE ROW LEVEL SECURITY;
ALTER TABLE combat_logs ENABLE ROW LEVEL SECURITY;

-- Characters policies
CREATE POLICY "Users can view own characters"
  ON characters FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own characters"
  ON characters FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own characters"
  ON characters FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own characters"
  ON characters FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Adventures policies
CREATE POLICY "Users can view own adventures"
  ON adventures FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM characters
      WHERE characters.id = adventures.character_id
      AND characters.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create adventures for own characters"
  ON adventures FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM characters
      WHERE characters.id = adventures.character_id
      AND characters.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own adventures"
  ON adventures FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM characters
      WHERE characters.id = adventures.character_id
      AND characters.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM characters
      WHERE characters.id = adventures.character_id
      AND characters.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own adventures"
  ON adventures FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM characters
      WHERE characters.id = adventures.character_id
      AND characters.user_id = auth.uid()
    )
  );

-- Public adventures policies
CREATE POLICY "Anyone can view public adventures"
  ON public_adventures FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create public adventures"
  ON public_adventures FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Creators can update own public adventures"
  ON public_adventures FOR UPDATE
  TO authenticated
  USING (auth.uid() = creator_id)
  WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Creators can delete own public adventures"
  ON public_adventures FOR DELETE
  TO authenticated
  USING (auth.uid() = creator_id);

-- Adventure reviews policies
CREATE POLICY "Anyone can view reviews"
  ON adventure_reviews FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create reviews"
  ON adventure_reviews FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reviews"
  ON adventure_reviews FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own reviews"
  ON adventure_reviews FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Dice rolls policies
CREATE POLICY "Users can view own dice rolls"
  ON dice_rolls FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own dice rolls"
  ON dice_rolls FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Combat logs policies
CREATE POLICY "Users can view own combat logs"
  ON combat_logs FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM characters
      WHERE characters.id = combat_logs.character_id
      AND characters.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create combat logs for own characters"
  ON combat_logs FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM characters
      WHERE characters.id = combat_logs.character_id
      AND characters.user_id = auth.uid()
    )
  );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_characters_updated_at
  BEFORE UPDATE ON characters
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_adventures_updated_at
  BEFORE UPDATE ON adventures
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_public_adventures_updated_at
  BEFORE UPDATE ON public_adventures
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table for user data
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  display_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create mastery_ranks table for tracking player progression
CREATE TABLE IF NOT EXISTS mastery_ranks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  rank_level INT NOT NULL DEFAULT 1, -- 1-10 (Новичок to Гроссмейстер)
  sub_rank INT NOT NULL DEFAULT 1, -- 1-3 (базовый, продвинутый, профессиональный)
  fragments INT NOT NULL DEFAULT 0, -- 0-5 fragments per sub-rank
  total_wins INT DEFAULT 0,
  total_losses INT DEFAULT 0,
  current_streak INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create game_matches table for match history
CREATE TABLE IF NOT EXISTS game_matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  game_type TEXT NOT NULL,
  player1_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  player2_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  winner_id UUID REFERENCES profiles(id),
  match_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user_settings table
CREATE TABLE IF NOT EXISTS user_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  music_volume INT DEFAULT 80 CHECK (music_volume >= 0 AND music_volume <= 100),
  sound_volume INT DEFAULT 80 CHECK (sound_volume >= 0 AND sound_volume <= 100),
  music_enabled BOOLEAN DEFAULT TRUE,
  sound_enabled BOOLEAN DEFAULT TRUE,
  vibration_enabled BOOLEAN DEFAULT TRUE,
  language TEXT DEFAULT 'ru',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create matchmaking_queue table
CREATE TABLE IF NOT EXISTS matchmaking_queue (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  game_type TEXT NOT NULL,
  rank_level INT NOT NULL,
  joined_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE mastery_ranks ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE matchmaking_queue ENABLE ROW LEVEL SECURITY;

-- Profiles RLS Policies
CREATE POLICY "Users can view all profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Mastery Ranks RLS Policies
CREATE POLICY "Users can view all ranks" ON mastery_ranks FOR SELECT USING (true);
CREATE POLICY "Users can update own rank" ON mastery_ranks FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own rank" ON mastery_ranks FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Game Matches RLS Policies
CREATE POLICY "Users can view their matches" ON game_matches FOR SELECT 
  USING (auth.uid() = player1_id OR auth.uid() = player2_id);
CREATE POLICY "System can insert matches" ON game_matches FOR INSERT WITH CHECK (true);

-- User Settings RLS Policies
CREATE POLICY "Users can view own settings" ON user_settings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own settings" ON user_settings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own settings" ON user_settings FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Matchmaking Queue RLS Policies
CREATE POLICY "Users can view matchmaking queue" ON matchmaking_queue FOR SELECT USING (true);
CREATE POLICY "Users can join queue" ON matchmaking_queue FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can leave queue" ON matchmaking_queue FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_mastery_ranks_user_id ON mastery_ranks(user_id);
CREATE INDEX idx_game_matches_player1 ON game_matches(player1_id);
CREATE INDEX idx_game_matches_player2 ON game_matches(player2_id);
CREATE INDEX idx_matchmaking_queue_rank ON matchmaking_queue(rank_level);
CREATE INDEX idx_matchmaking_queue_joined ON matchmaking_queue(joined_at);

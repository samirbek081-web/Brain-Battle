-- Create game_sessions table to track active games and prevent cheating
CREATE TABLE IF NOT EXISTS game_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  game_type TEXT NOT NULL,
  session_token TEXT UNIQUE NOT NULL,
  game_state JSONB NOT NULL,
  move_history JSONB[] DEFAULT '{}',
  started_at TIMESTAMPTZ DEFAULT NOW(),
  last_activity TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE,
  opponent_id UUID REFERENCES profiles(id),
  difficulty TEXT, -- for AI games
  checksum TEXT NOT NULL -- to verify game state integrity
);

-- Create anti_cheat_logs table
CREATE TABLE IF NOT EXISTS anti_cheat_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  game_session_id UUID REFERENCES game_sessions(id) ON DELETE CASCADE,
  violation_type TEXT NOT NULL,
  details JSONB,
  severity TEXT CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user_bans table
CREATE TABLE IF NOT EXISTS user_bans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  banned_until TIMESTAMPTZ,
  is_permanent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create rate_limits table
CREATE TABLE IF NOT EXISTS rate_limits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL,
  count INT DEFAULT 1,
  window_start TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, action_type)
);

-- Create ad_impressions table for tracking
CREATE TABLE IF NOT EXISTS ad_impressions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id),
  ad_type TEXT NOT NULL,
  ad_placement TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE anti_cheat_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_bans ENABLE ROW LEVEL SECURITY;
ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE ad_impressions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own sessions" ON game_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can manage sessions" ON game_sessions FOR ALL USING (true);

CREATE POLICY "Admins can view anti-cheat logs" ON anti_cheat_logs FOR SELECT USING (true);
CREATE POLICY "System can insert anti-cheat logs" ON anti_cheat_logs FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view own bans" ON user_bans FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can manage bans" ON user_bans FOR ALL USING (true);

CREATE POLICY "System can manage rate limits" ON rate_limits FOR ALL USING (true);

CREATE POLICY "System can manage ad impressions" ON ad_impressions FOR ALL USING (true);

-- Indexes
CREATE INDEX idx_game_sessions_user ON game_sessions(user_id);
CREATE INDEX idx_game_sessions_active ON game_sessions(is_active);
CREATE INDEX idx_anti_cheat_user ON anti_cheat_logs(user_id);
CREATE INDEX idx_user_bans_user ON user_bans(user_id);
CREATE INDEX idx_rate_limits_user_action ON rate_limits(user_id, action_type);

-- Function to clean old sessions
CREATE OR REPLACE FUNCTION clean_old_sessions()
RETURNS void AS $$
BEGIN
  UPDATE game_sessions
  SET is_active = FALSE
  WHERE last_activity < NOW() - INTERVAL '1 hour';
END;
$$ LANGUAGE plpgsql;

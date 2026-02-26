-- SwitchingOff AI — Full Database Schema
-- Run against your Supabase project via SQL Editor

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ══════════════════════════════════════
-- USERS
-- ══════════════════════════════════════
CREATE TABLE users (
  id              uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  email           text UNIQUE NOT NULL,
  work_zone_lat   double precision,
  work_zone_lng   double precision,
  work_zone_radius int DEFAULT 150,
  home_zone_lat   double precision,
  home_zone_lng   double precision,
  home_zone_radius int DEFAULT 100,
  work_hours_start text DEFAULT '08:00',
  work_hours_end   text DEFAULT '18:00',
  work_days        int[] DEFAULT '{1,2,3,4,5}',
  timezone         text DEFAULT 'America/New_York',
  transition_grace_minutes int DEFAULT 2,
  chill_settle_minutes     int DEFAULT 5,
  created_at       timestamptz DEFAULT now()
);

-- ══════════════════════════════════════
-- TASKS
-- ══════════════════════════════════════
CREATE TABLE tasks (
  id               uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id          uuid REFERENCES users(id) ON DELETE CASCADE,
  title            text NOT NULL,
  raw_transcript   text,
  status           text NOT NULL DEFAULT 'not_started',
  priority         text NOT NULL DEFAULT 'P2',
  due_date         text,
  crm_contact_id   uuid,
  deal_id          uuid,
  source           text NOT NULL DEFAULT 'manual',
  completed_at     timestamptz,
  created_at       timestamptz DEFAULT now()
);
CREATE INDEX idx_tasks_user_status ON tasks(user_id, status);

-- ══════════════════════════════════════
-- CONTACTS
-- ══════════════════════════════════════
CREATE TABLE contacts (
  id              uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         uuid REFERENCES users(id) ON DELETE CASCADE,
  name            text NOT NULL,
  role            text,
  company         text,
  email           text,
  phone           text,
  stage           text NOT NULL DEFAULT 'cold',
  cadence_days    int DEFAULT 7,
  last_contact_at timestamptz,
  ai_summary      text,
  color           text DEFAULT '#6C63FF',
  created_at      timestamptz DEFAULT now()
);
CREATE INDEX idx_contacts_user ON contacts(user_id);

-- ══════════════════════════════════════
-- CONTACT TAGS
-- ══════════════════════════════════════
CREATE TABLE contact_tags (
  id         uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  contact_id uuid REFERENCES contacts(id) ON DELETE CASCADE,
  tag        text NOT NULL,
  UNIQUE(contact_id, tag)
);

-- ══════════════════════════════════════
-- CONTACT NOTES
-- ══════════════════════════════════════
CREATE TABLE contact_notes (
  id         uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  contact_id uuid REFERENCES contacts(id) ON DELETE CASCADE,
  body       text NOT NULL,
  source     text NOT NULL DEFAULT 'manual',
  created_at timestamptz DEFAULT now()
);

-- ══════════════════════════════════════
-- DEAL STAGES (user-configurable)
-- ══════════════════════════════════════
CREATE TABLE deal_stages (
  id                   uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id              uuid REFERENCES users(id) ON DELETE CASCADE,
  name                 text NOT NULL,
  order_index          int NOT NULL,
  stale_threshold_days int DEFAULT 7,
  color                text
);

-- ══════════════════════════════════════
-- DEALS
-- ══════════════════════════════════════
CREATE TABLE deals (
  id                 uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id            uuid REFERENCES users(id) ON DELETE CASCADE,
  name               text NOT NULL,
  stage_index        int NOT NULL DEFAULT 0,
  value              numeric,
  primary_contact_id uuid REFERENCES contacts(id) ON DELETE SET NULL,
  status             text NOT NULL DEFAULT 'active',
  health_score       int DEFAULT 5,
  next_action        text,
  days_in_stage      int DEFAULT 0,
  last_activity_at   timestamptz DEFAULT now(),
  created_at         timestamptz DEFAULT now()
);
CREATE INDEX idx_deals_user_status ON deals(user_id, status);

-- ══════════════════════════════════════
-- DEAL NOTES
-- ══════════════════════════════════════
CREATE TABLE deal_notes (
  id         uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  deal_id    uuid REFERENCES deals(id) ON DELETE CASCADE,
  body       text NOT NULL,
  source     text NOT NULL DEFAULT 'manual',
  created_at timestamptz DEFAULT now()
);

-- ══════════════════════════════════════
-- REMINDERS
-- ══════════════════════════════════════
CREATE TABLE reminders (
  id              uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         uuid REFERENCES users(id) ON DELETE CASCADE,
  title           text NOT NULL,
  fire_at         timestamptz NOT NULL,
  recurrence_rule text,
  contact_id      uuid REFERENCES contacts(id) ON DELETE SET NULL,
  deal_id         uuid REFERENCES deals(id) ON DELETE SET NULL,
  status          text NOT NULL DEFAULT 'pending',
  created_by      text NOT NULL DEFAULT 'manual',
  created_at      timestamptz DEFAULT now()
);
CREATE INDEX idx_reminders_pending ON reminders(user_id, fire_at) WHERE status = 'pending';

-- ══════════════════════════════════════
-- VOICE CAPTURES
-- ══════════════════════════════════════
CREATE TABLE voice_captures (
  id             uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id        uuid REFERENCES users(id) ON DELETE CASCADE,
  transcript     text NOT NULL,
  parsed_intent  jsonb,
  routing_result text,
  created_at     timestamptz DEFAULT now()
);

-- ══════════════════════════════════════
-- MODE HISTORY
-- ══════════════════════════════════════
CREATE TABLE mode_history (
  id         uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    uuid REFERENCES users(id) ON DELETE CASCADE,
  mode       text NOT NULL,
  trigger    text,
  started_at timestamptz DEFAULT now(),
  ended_at   timestamptz
);

-- ══════════════════════════════════════
-- ROW LEVEL SECURITY
-- ══════════════════════════════════════
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE deal_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE deal_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE voice_captures ENABLE ROW LEVEL SECURITY;
ALTER TABLE mode_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY users_own ON users FOR ALL USING (auth.uid() = id);
CREATE POLICY tasks_own ON tasks FOR ALL USING (auth.uid() = user_id);
CREATE POLICY contacts_own ON contacts FOR ALL USING (auth.uid() = user_id);
CREATE POLICY contact_tags_own ON contact_tags FOR ALL
  USING (contact_id IN (SELECT id FROM contacts WHERE user_id = auth.uid()));
CREATE POLICY contact_notes_own ON contact_notes FOR ALL
  USING (contact_id IN (SELECT id FROM contacts WHERE user_id = auth.uid()));
CREATE POLICY deal_stages_own ON deal_stages FOR ALL USING (auth.uid() = user_id);
CREATE POLICY deals_own ON deals FOR ALL USING (auth.uid() = user_id);
CREATE POLICY deal_notes_own ON deal_notes FOR ALL
  USING (deal_id IN (SELECT id FROM deals WHERE user_id = auth.uid()));
CREATE POLICY reminders_own ON reminders FOR ALL USING (auth.uid() = user_id);
CREATE POLICY voice_captures_own ON voice_captures FOR ALL USING (auth.uid() = user_id);
CREATE POLICY mode_history_own ON mode_history FOR ALL USING (auth.uid() = user_id);

-- ══════════════════════════════════════
-- DEFAULT DEAL STAGES ON USER INSERT
-- ══════════════════════════════════════
CREATE OR REPLACE FUNCTION create_default_deal_stages()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO deal_stages (user_id, name, order_index, color) VALUES
    (NEW.id, 'Lead',        0, '#6C63FF'),
    (NEW.id, 'Outreach',    1, '#0E7C7B'),
    (NEW.id, 'Proposal',    2, '#C9851A'),
    (NEW.id, 'Negotiation', 3, '#1A7A4A'),
    (NEW.id, 'Decision',    4, '#C0392B'),
    (NEW.id, 'Won',         5, '#27AE60'),
    (NEW.id, 'Lost',        6, '#7F8C8D');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_default_deal_stages
  AFTER INSERT ON users
  FOR EACH ROW
  EXECUTE FUNCTION create_default_deal_stages();

/*
  # Create user_profiles table
  
  1. New Tables
    - user_profiles: Profils utilisateurs avec rôles
  
  2. Security
    - RLS activé
    - Accès public en lecture/écriture
*/

CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_type text NOT NULL CHECK (profile_type IN ('Admin', 'Manager', 'Gestion', 'Signataire', 'Indicateur d''affaires', 'Marketing')),
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  photo_url text DEFAULT '/Moche.jpg',
  team_manager_id uuid REFERENCES user_profiles(id) ON DELETE SET NULL,
  is_active boolean DEFAULT false,
  advisor_brochure_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_user_profiles_profile_type ON user_profiles(profile_type);
CREATE INDEX IF NOT EXISTS idx_user_profiles_team_manager_id ON user_profiles(team_manager_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_is_active ON user_profiles(is_active);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_profiles' 
    AND policyname = 'Public read access for user_profiles'
  ) THEN
    CREATE POLICY "Public read access for user_profiles"
      ON user_profiles FOR SELECT
      TO public
      USING (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_profiles' 
    AND policyname = 'Public write access for user_profiles'
  ) THEN
    CREATE POLICY "Public write access for user_profiles"
      ON user_profiles FOR INSERT
      TO public
      WITH CHECK (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_profiles' 
    AND policyname = 'Public update access for user_profiles'
  ) THEN
    CREATE POLICY "Public update access for user_profiles"
      ON user_profiles FOR UPDATE
      TO public
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

CREATE OR REPLACE FUNCTION update_user_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER trigger_update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_user_profiles_updated_at();

INSERT INTO user_profiles (profile_type, first_name, last_name, email, is_active, photo_url)
VALUES 
  ('Admin', 'Mandjé', 'Lebel', 'mandje.lebel@bienviyance.com', false, '/Mandje.jpg'),
  ('Manager', 'Moche', 'Azran', 'moche.azran@bienviyance.com', true, '/Moche.jpg'),
  ('Signataire', 'Benjamin', 'Zaoui', 'benjamin.zaoui@bienviyance.com', false, '/Benjamin.jpg'),
  ('Indicateur d''affaires', 'Ornella', 'Attard', 'ornella.attard@bienviyance.com', false, '/Ornella.jpg'),
  ('Gestion', 'Michael', 'Hazan', 'michael.hazan@bienviyance.com', false, '/Michael.jpg'),
  ('Marketing', 'Philippine', 'Bachelier', 'philippine.bachelier@bienviyance.com', false, '/Philippine.jpg')
ON CONFLICT DO NOTHING;
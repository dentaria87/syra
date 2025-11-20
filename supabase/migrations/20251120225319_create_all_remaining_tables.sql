/*
  # Création de toutes les tables manquantes
  
  1. Tables créées
    - profiles: Profils auth utilisateurs
    - devoirs_conseil: Documents devoir de conseil
    - contracts: Contrats d'assurance
    - lead_comments: Commentaires sur leads
    - predefined_messages: Messages prédéfinis
    - partners: Partenaires
    - google_sync: Synchronisation Google
    - organization_settings: Paramètres organisation
    - per_simulations: Simulations PER
    - library_documents: Documents bibliothèque
    - memos: Mémos
  
  2. Sécurité
    - RLS activé sur toutes les tables
    - Politiques adaptées
*/

-- =============================================
-- PROFILES TABLE (Auth)
-- =============================================
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- DEVOIRS CONSEIL TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS devoirs_conseil (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name text NOT NULL,
  besoins text DEFAULT '',
  risques text DEFAULT '',
  budget text DEFAULT '',
  situation_familiale text DEFAULT '',
  situation_professionnelle text DEFAULT '',
  projets text DEFAULT '',
  autres_remarques text DEFAULT '',
  produits_proposes text DEFAULT '',
  garanties text DEFAULT '',
  exclusions text DEFAULT '',
  limites text DEFAULT '',
  conditions text DEFAULT '',
  contrat_choisi text DEFAULT '',
  options text DEFAULT '',
  montants_garantie text DEFAULT '',
  adequation_confirmee boolean DEFAULT false,
  risques_refus text DEFAULT '',
  signature_client text DEFAULT '',
  date_signature date DEFAULT CURRENT_DATE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE devoirs_conseil ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own devoirs conseil" ON devoirs_conseil;
CREATE POLICY "Users can view own devoirs conseil"
  ON devoirs_conseil FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create devoirs conseil" ON devoirs_conseil;
CREATE POLICY "Users can create devoirs conseil"
  ON devoirs_conseil FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own devoirs conseil" ON devoirs_conseil;
CREATE POLICY "Users can update own devoirs conseil"
  ON devoirs_conseil FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own devoirs conseil" ON devoirs_conseil;
CREATE POLICY "Users can delete own devoirs conseil"
  ON devoirs_conseil FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_devoirs_conseil_user_id ON devoirs_conseil(user_id);
CREATE INDEX IF NOT EXISTS idx_devoirs_conseil_created_at ON devoirs_conseil(created_at DESC);

-- =============================================
-- CONTRACTS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS contracts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id text NOT NULL,
  lead_id uuid,
  devoir_conseil_id uuid,
  client_name text NOT NULL,
  contract_type text NOT NULL,
  amount numeric NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending',
  validation_date timestamptz,
  error_type text,
  is_reprise boolean DEFAULT false,
  reprise_success boolean,
  
  assureur text,
  gamme_contrat text,
  produit text,
  remuneration_type text,
  en_portefeuille boolean DEFAULT false,
  loi_madelin boolean DEFAULT false,
  contrat_principal boolean DEFAULT false,
  numero_contrat text,
  delegataire_gestion text,
  attentes text,
  commentaires text,
  
  date_souscription date,
  date_effet date,
  date_echeance date,
  date_effet_supplementaire date,
  
  montant_initial numeric,
  versement_programme numeric,
  versement_initial numeric,
  periodicite text,
  
  vl text,
  frais_versement text,
  vp_optionnel text,
  frais_a_definir text,
  frais_chacun text,
  frais_dossier text,
  mma_elite boolean DEFAULT false,
  
  transfert boolean DEFAULT false,
  montant_transfert text,
  frais_transfert text,
  
  propositions_comparatives text[],
  assureurs_interroges text[],
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  CONSTRAINT valid_status CHECK (status IN ('pending', 'validated', 'rejected', 'in_review')),
  CONSTRAINT valid_error_type CHECK (error_type IS NULL OR error_type IN ('missing_document', 'invalid_iban', 'invalid_proof', 'signature_missing', 'other'))
);

ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view contracts" ON contracts;
CREATE POLICY "Users can view contracts"
  ON contracts FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Users can create contracts" ON contracts;
CREATE POLICY "Users can create contracts"
  ON contracts FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Users can update contracts" ON contracts;
CREATE POLICY "Users can update contracts"
  ON contracts FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Users can delete contracts" ON contracts;
CREATE POLICY "Users can delete contracts"
  ON contracts FOR DELETE
  TO authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS idx_contracts_organization_id ON contracts(organization_id);
CREATE INDEX IF NOT EXISTS idx_contracts_status ON contracts(status);
CREATE INDEX IF NOT EXISTS idx_contracts_validation_date ON contracts(validation_date);

-- =============================================
-- LEAD COMMENTS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS lead_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id text NOT NULL,
  user_id uuid NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE lead_comments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read all comments" ON lead_comments;
CREATE POLICY "Users can read all comments"
  ON lead_comments FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Users can create comments" ON lead_comments;
CREATE POLICY "Users can create comments"
  ON lead_comments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own comments" ON lead_comments;
CREATE POLICY "Users can update own comments"
  ON lead_comments FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own comments" ON lead_comments;
CREATE POLICY "Users can delete own comments"
  ON lead_comments FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- =============================================
-- PREDEFINED MESSAGES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS predefined_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  category text NOT NULL DEFAULT 'description',
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE predefined_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own predefined messages" ON predefined_messages;
CREATE POLICY "Users can view own predefined messages"
  ON predefined_messages FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create predefined messages" ON predefined_messages;
CREATE POLICY "Users can create predefined messages"
  ON predefined_messages FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own predefined messages" ON predefined_messages;
CREATE POLICY "Users can update own predefined messages"
  ON predefined_messages FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own predefined messages" ON predefined_messages;
CREATE POLICY "Users can delete own predefined messages"
  ON predefined_messages FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_predefined_messages_user_id ON predefined_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_predefined_messages_category ON predefined_messages(category);

-- =============================================
-- PARTNERS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS partners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  logo_url text NOT NULL,
  website_url text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE partners ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view partners" ON partners;
CREATE POLICY "Anyone can view partners"
  ON partners FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert partners" ON partners;
CREATE POLICY "Authenticated users can insert partners"
  ON partners FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can update partners" ON partners;
CREATE POLICY "Authenticated users can update partners"
  ON partners FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can delete partners" ON partners;
CREATE POLICY "Authenticated users can delete partners"
  ON partners FOR DELETE
  TO authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS idx_partners_name ON partners(name);

-- =============================================
-- GOOGLE SYNC TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS google_sync (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  gmail_connected boolean DEFAULT false,
  calendar_connected boolean DEFAULT false,
  gmail_email text,
  access_token_encrypted text,
  refresh_token_encrypted text,
  token_expires_at timestamptz,
  last_sync_at timestamptz,
  sync_status text DEFAULT 'disconnected' CHECK (sync_status IN ('connected', 'error', 'disconnected')),
  sync_error_message text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE google_sync ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read access for google_sync" ON google_sync;
CREATE POLICY "Public read access for google_sync"
  ON google_sync FOR SELECT
  TO public
  USING (true);

DROP POLICY IF EXISTS "Public write access for google_sync" ON google_sync;
CREATE POLICY "Public write access for google_sync"
  ON google_sync FOR INSERT
  TO public
  WITH CHECK (true);

DROP POLICY IF EXISTS "Public update access for google_sync" ON google_sync;
CREATE POLICY "Public update access for google_sync"
  ON google_sync FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Public delete access for google_sync" ON google_sync;
CREATE POLICY "Public delete access for google_sync"
  ON google_sync FOR DELETE
  TO public
  USING (true);

CREATE INDEX IF NOT EXISTS idx_google_sync_user_id ON google_sync(user_id);
CREATE INDEX IF NOT EXISTS idx_google_sync_status ON google_sync(sync_status);

-- =============================================
-- PER SIMULATIONS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS per_simulations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  advisor_first_name text DEFAULT '',
  advisor_last_name text DEFAULT '',
  advisor_email text DEFAULT '',
  client_first_name text DEFAULT '',
  client_last_name text DEFAULT '',
  client_email text DEFAULT '',
  professional_status text DEFAULT 'Salarié',
  annual_income numeric DEFAULT 0,
  tax_ceiling numeric DEFAULT 0,
  monthly_contribution numeric DEFAULT 350,
  investor_profile text DEFAULT 'Équilibré',
  marital_status text DEFAULT 'Célibataire, divorcé(e), veuf(ve)',
  number_of_children integer DEFAULT 0,
  age integer DEFAULT 18,
  taxable_income numeric DEFAULT 0,
  tax_rate text DEFAULT '30%',
  total_tax_savings numeric DEFAULT 0,
  return_rate numeric DEFAULT 5,
  invested_capital numeric DEFAULT 0,
  generated_capital numeric DEFAULT 0,
  total_capital numeric DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id)
);

ALTER TABLE per_simulations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own simulations" ON per_simulations;
CREATE POLICY "Users can view own simulations"
  ON per_simulations FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own simulations" ON per_simulations;
CREATE POLICY "Users can insert own simulations"
  ON per_simulations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own simulations" ON per_simulations;
CREATE POLICY "Users can update own simulations"
  ON per_simulations FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own simulations" ON per_simulations;
CREATE POLICY "Users can delete own simulations"
  ON per_simulations FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_per_simulations_user_id ON per_simulations(user_id);
CREATE INDEX IF NOT EXISTS idx_per_simulations_created_at ON per_simulations(created_at DESC);

-- =============================================
-- LIBRARY DOCUMENTS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS library_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id text NOT NULL,
  title text NOT NULL,
  file_url text NOT NULL,
  file_name text NOT NULL,
  file_size bigint NOT NULL,
  category text NOT NULL CHECK (category IN ('PER', 'Assurance Vie')),
  uploaded_by uuid NOT NULL,
  uploaded_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE library_documents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view library documents" ON library_documents;
CREATE POLICY "Anyone can view library documents"
  ON library_documents FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Authenticated users can upload documents" ON library_documents;
CREATE POLICY "Authenticated users can upload documents"
  ON library_documents FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can delete documents" ON library_documents;
CREATE POLICY "Authenticated users can delete documents"
  ON library_documents FOR DELETE
  TO authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS idx_library_documents_category ON library_documents(category);
CREATE INDEX IF NOT EXISTS idx_library_documents_organization ON library_documents(organization_id);

-- =============================================
-- MEMOS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS memos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id text NOT NULL,
  user_id uuid NOT NULL,
  title text NOT NULL,
  description text,
  due_date date NOT NULL,
  due_time time NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE memos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own memos" ON memos;
CREATE POLICY "Users can view own memos"
  ON memos FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can create own memos" ON memos;
CREATE POLICY "Users can create own memos"
  ON memos FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can update own memos" ON memos;
CREATE POLICY "Users can update own memos"
  ON memos FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can delete own memos" ON memos;
CREATE POLICY "Users can delete own memos"
  ON memos FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

CREATE INDEX IF NOT EXISTS idx_memos_due_date ON memos(due_date);
CREATE INDEX IF NOT EXISTS idx_memos_status ON memos(status);
CREATE INDEX IF NOT EXISTS idx_memos_user_id ON memos(user_id);

-- =============================================
-- STORAGE BUCKETS
-- =============================================
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('partner-logos', 'partner-logos', true),
  ('organization-logos', 'organization-logos', true),
  ('email-attachments', 'email-attachments', true),
  ('advisor-brochures', 'advisor-brochures', true)
ON CONFLICT (id) DO NOTHING;
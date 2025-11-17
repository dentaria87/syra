/*
  # Configuration initiale complète de la base de données
  
  1. Tables créées
    - profiles: Profils utilisateurs liés à auth.users
    - devoirs_conseil: Documents de devoir de conseil DDA
    - contracts: Contrats d'assurance
    - lead_comments: Commentaires sur les leads
    - predefined_messages: Messages prédéfinis
    - partners: Partenaires
    - user_profiles: Profils utilisateurs avec rôles
    - google_sync: Synchronisation Google
    - organization_settings: Paramètres organisation
    - per_simulations: Simulations PER
    - library_documents: Documents bibliothèque
    - memos: Mémos utilisateur
  
  2. Sécurité
    - RLS activé sur toutes les tables
    - Politiques d'accès adaptées
    - Buckets de stockage configurés
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

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

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

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created'
  ) THEN
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
  END IF;
END $$;

-- =============================================
-- USER PROFILES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_type text NOT NULL CHECK (profile_type IN ('Admin', 'Manager', 'Gestion', 'Signataire', 'Téléprospecteur', 'Marketing')),
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  photo_url text DEFAULT '/Retouched Azran Moche 2.jpeg',
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

CREATE POLICY "Public read access for user_profiles"
  ON user_profiles FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Public write access for user_profiles"
  ON user_profiles FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Public update access for user_profiles"
  ON user_profiles FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

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

-- Insert default profiles
INSERT INTO user_profiles (profile_type, first_name, last_name, email, is_active, photo_url)
VALUES 
  ('Admin', 'Mandjé', 'Lebel', 'mandje.lebel@bienviyance.com', false, '/Mandje.jpg'),
  ('Manager', 'Moche', 'Azran', 'moche.azran@bienviyance.com', true, '/Moche.jpg'),
  ('Signataire', 'Benjamin', 'Zaoui', 'benjamin.zaoui@bienviyance.com', false, '/Benjamin.jpg'),
  ('Téléprospecteur', 'Ornella', 'Attard', 'ornella.attard@bienviyance.com', false, '/Ornella.jpg'),
  ('Gestion', 'Michael', 'Hazan', 'michael.hazan@bienviyance.com', false, '/Michael.jpg'),
  ('Marketing', 'Philippine', 'Bachelier', 'philippine.bachelier@bienviyance.com', false, '/Philippine.jpg')
ON CONFLICT DO NOTHING;

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

CREATE POLICY "Users can view own devoirs conseil"
  ON devoirs_conseil
  FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can create devoirs conseil"
  ON devoirs_conseil
  FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can update own devoirs conseil"
  ON devoirs_conseil
  FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can delete own devoirs conseil"
  ON devoirs_conseil
  FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE INDEX IF NOT EXISTS idx_devoirs_conseil_user_id ON devoirs_conseil(user_id);
CREATE INDEX IF NOT EXISTS idx_devoirs_conseil_created_at ON devoirs_conseil(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_devoirs_conseil_user_id_fk ON devoirs_conseil(user_id);

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

CREATE POLICY "Users can view contracts"
  ON contracts FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create contracts"
  ON contracts FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update contracts"
  ON contracts FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete contracts"
  ON contracts FOR DELETE
  TO authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS idx_contracts_organization_id ON contracts(organization_id);
CREATE INDEX IF NOT EXISTS idx_contracts_status ON contracts(status);
CREATE INDEX IF NOT EXISTS idx_contracts_validation_date ON contracts(validation_date);
CREATE INDEX IF NOT EXISTS idx_contracts_devoir_conseil_id ON contracts(devoir_conseil_id);
CREATE INDEX IF NOT EXISTS idx_contracts_produit ON contracts(produit);
CREATE INDEX IF NOT EXISTS idx_contracts_assureur ON contracts(assureur);
CREATE INDEX IF NOT EXISTS idx_contracts_gamme_contrat ON contracts(gamme_contrat);

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

CREATE POLICY "Users can read all comments"
  ON lead_comments
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create comments"
  ON lead_comments
  FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can update own comments"
  ON lead_comments
  FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can delete own comments"
  ON lead_comments
  FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = user_id);

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

CREATE POLICY "Users can view own predefined messages"
  ON predefined_messages
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create predefined messages"
  ON predefined_messages
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own predefined messages"
  ON predefined_messages
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own predefined messages"
  ON predefined_messages
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_predefined_messages_user_id ON predefined_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_predefined_messages_category ON predefined_messages(category);
CREATE INDEX IF NOT EXISTS idx_predefined_messages_created_at ON predefined_messages(created_at DESC);

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

CREATE INDEX IF NOT EXISTS idx_partners_name ON partners(name);

ALTER TABLE partners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view partners"
  ON partners
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert partners"
  ON partners
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update partners"
  ON partners
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete partners"
  ON partners
  FOR DELETE
  TO authenticated
  USING (true);

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

CREATE INDEX IF NOT EXISTS idx_google_sync_user_id ON google_sync(user_id);
CREATE INDEX IF NOT EXISTS idx_google_sync_status ON google_sync(sync_status);

ALTER TABLE google_sync ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access for google_sync"
  ON google_sync FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Public write access for google_sync"
  ON google_sync FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Public update access for google_sync"
  ON google_sync FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public delete access for google_sync"
  ON google_sync FOR DELETE
  TO public
  USING (true);

CREATE OR REPLACE FUNCTION update_google_sync_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_google_sync_updated_at ON google_sync;
CREATE TRIGGER trigger_update_google_sync_updated_at
  BEFORE UPDATE ON google_sync
  FOR EACH ROW
  EXECUTE FUNCTION update_google_sync_updated_at();

-- =============================================
-- ORGANIZATION SETTINGS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS organization_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid UNIQUE NOT NULL,
  main_logo_url text,
  collapsed_logo_url text,
  email_template_content text,
  email_first_attachment_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE organization_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read organization settings"
  ON organization_settings FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update organization settings"
  ON organization_settings FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can insert organization settings"
  ON organization_settings FOR INSERT
  TO authenticated
  WITH CHECK (true);

INSERT INTO organization_settings (organization_id, email_template_content, email_first_attachment_url)
VALUES (
  gen_random_uuid(),
  'Bienvenue chez BIENVIYANCE, votre partenaire de confiance en matière de courtage en assurance et de family office dédié à votre protection sociale et votre épargne.
Chez Bienviyance , notre mission première est de placer votre bien-être financier et celui de votre famille au cœur de nos préoccupations.

Nous comprenons que chaque individu a des besoins uniques en matière d''assurance et d''épargne, c''est pourquoi nous mettons en œuvre notre expertise pointue pour vous offrir des solutions sur mesure, parfaitement adaptées à votre situation.

Que ce soit pour assurer l''avenir de vos proches, préparer votre retraite en toute sérénité, ou encore optimiser votre patrimoine, nous mettons à votre disposition une gamme complète de produits et de stratégies personnalisées.

Avec nous, vous bénéficierez de conseils éclairés, d''une analyse approfondie de vos besoins et de solutions innovantes pour protéger ce qui compte le plus pour vous.


Nous nous efforçons de vous offrir la meilleure couverture au meilleur prix, tout en vous donnant les clés pour faire fructifier votre épargne et sécuriser votre avenir financier.

Faites le choix de la Bienviyance envers votre patrimoine et votre famille.',
  'Moche Azran BNVCE.pdf'
)
ON CONFLICT (organization_id) DO NOTHING;

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

CREATE POLICY "Users can view own simulations"
  ON per_simulations FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own simulations"
  ON per_simulations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own simulations"
  ON per_simulations FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

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

CREATE INDEX IF NOT EXISTS idx_library_documents_category ON library_documents(category);
CREATE INDEX IF NOT EXISTS idx_library_documents_organization ON library_documents(organization_id);

ALTER TABLE library_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view library documents"
  ON library_documents FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admin, Manager, Gestion, Marketing can upload documents"
  ON library_documents FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.profile_type IN ('Admin', 'Manager', 'Gestion', 'Marketing')
    )
  );

CREATE POLICY "Admin, Manager, Gestion, Marketing can delete documents"
  ON library_documents FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.profile_type IN ('Admin', 'Manager', 'Gestion', 'Marketing')
    )
  );

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

CREATE INDEX IF NOT EXISTS idx_memos_due_date ON memos(due_date);
CREATE INDEX IF NOT EXISTS idx_memos_status ON memos(status);
CREATE INDEX IF NOT EXISTS idx_memos_user_id ON memos(user_id);

ALTER TABLE memos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own memos"
  ON memos FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create own memos"
  ON memos FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own memos"
  ON memos FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own memos"
  ON memos FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

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

-- Partner logos storage policies
CREATE POLICY "Anyone can view partner logos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'partner-logos');

CREATE POLICY "Authenticated users can upload partner logos"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'partner-logos');

CREATE POLICY "Authenticated users can update partner logos"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'partner-logos')
  WITH CHECK (bucket_id = 'partner-logos');

CREATE POLICY "Authenticated users can delete partner logos"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'partner-logos');

-- Organization logos storage policies
CREATE POLICY "Authenticated users can upload organization logos"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'organization-logos');

CREATE POLICY "Anyone can view organization logos"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'organization-logos');

CREATE POLICY "Authenticated users can update organization logos"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'organization-logos')
  WITH CHECK (bucket_id = 'organization-logos');

CREATE POLICY "Authenticated users can delete organization logos"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'organization-logos');

-- Email attachments storage policies
CREATE POLICY "Authenticated users can upload email attachments"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'email-attachments');

CREATE POLICY "Anyone can view email attachments"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'email-attachments');

CREATE POLICY "Authenticated users can update email attachments"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'email-attachments')
  WITH CHECK (bucket_id = 'email-attachments');

CREATE POLICY "Authenticated users can delete email attachments"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'email-attachments');

-- Advisor brochures storage policies
CREATE POLICY "Public read access for advisor brochures"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'advisor-brochures');

CREATE POLICY "Authenticated users can upload advisor brochures"
  ON storage.objects FOR INSERT
  TO public
  WITH CHECK (bucket_id = 'advisor-brochures');

CREATE POLICY "Authenticated users can update advisor brochures"
  ON storage.objects FOR UPDATE
  TO public
  USING (bucket_id = 'advisor-brochures')
  WITH CHECK (bucket_id = 'advisor-brochures');

CREATE POLICY "Authenticated users can delete advisor brochures"
  ON storage.objects FOR DELETE
  TO public
  USING (bucket_id = 'advisor-brochures');
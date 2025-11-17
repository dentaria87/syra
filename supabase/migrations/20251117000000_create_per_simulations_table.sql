/*
  # Create PER Simulations Table

  1. New Tables
    - `per_simulations`
      - `id` (uuid, primary key)
      - `advisor_first_name` (text) - Prénom du conseiller
      - `advisor_last_name` (text) - Nom du conseiller
      - `advisor_email` (text) - Email du conseiller
      - `client_first_name` (text) - Prénom du client
      - `client_last_name` (text) - Nom du client
      - `client_email` (text) - Email du client
      - `professional_status` (text) - Statut professionnel (Salarié/Indépendant)
      - `annual_income` (numeric) - Revenu annuel
      - `tax_ceiling` (numeric) - Plafond de déductibilité calculé
      - `monthly_contribution` (numeric) - Versement mensuel
      - `investor_profile` (text) - Profil investisseur (Prudent/Équilibré/Dynamique)
      - `marital_status` (text) - Situation maritale
      - `number_of_children` (integer) - Nombre d'enfants
      - `age` (integer) - Âge du client
      - `taxable_income` (numeric) - Revenus imposables du foyer
      - `tax_rate` (text) - Tranche d'imposition
      - `total_tax_savings` (numeric) - Économie fiscale totale
      - `return_rate` (numeric) - Taux de rendement
      - `invested_capital` (numeric) - Capital investi
      - `generated_capital` (numeric) - Capital généré
      - `total_capital` (numeric) - Capital constitué
      - `created_at` (timestamptz) - Date de création
      - `updated_at` (timestamptz) - Date de mise à jour
      - `user_id` (uuid) - ID de l'utilisateur qui a créé la simulation

  2. Security
    - Enable RLS on `per_simulations` table
    - Add policies for authenticated users to manage their simulations
*/

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

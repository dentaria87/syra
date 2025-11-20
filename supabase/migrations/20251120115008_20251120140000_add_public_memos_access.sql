/*
  # Ajouter un accès public aux mémos
  
  1. Objectif
    - Permettre l'accès aux mémos sans authentification
    - L'application utilise des user_profiles locaux, pas l'auth Supabase
    
  2. Modifications
    - Ajout d'une politique SELECT publique pour les mémos
    - Ajout d'une politique INSERT publique pour les mémos
    - Ajout d'une politique UPDATE publique pour les mémos
    - Ajout d'une politique DELETE publique pour les mémos
*/

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Users can view own memos" ON memos;
DROP POLICY IF EXISTS "Users can create own memos" ON memos;
DROP POLICY IF EXISTS "Users can update own memos" ON memos;
DROP POLICY IF EXISTS "Users can delete own memos" ON memos;

-- Create public access policies for memos
CREATE POLICY "Public can view all memos"
  ON memos
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Public can create memos"
  ON memos
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Public can update memos"
  ON memos
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public can delete memos"
  ON memos
  FOR DELETE
  TO public
  USING (true);
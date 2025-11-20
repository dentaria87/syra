/*
  # Politiques de stockage pour les buckets
  
  Ajout des politiques RLS pour les buckets de stockage
*/

-- Partner logos storage policies
DROP POLICY IF EXISTS "Anyone can view partner logos" ON storage.objects;
CREATE POLICY "Anyone can view partner logos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'partner-logos');

DROP POLICY IF EXISTS "Authenticated users can upload partner logos" ON storage.objects;
CREATE POLICY "Authenticated users can upload partner logos"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'partner-logos');

DROP POLICY IF EXISTS "Authenticated users can update partner logos" ON storage.objects;
CREATE POLICY "Authenticated users can update partner logos"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'partner-logos')
  WITH CHECK (bucket_id = 'partner-logos');

DROP POLICY IF EXISTS "Authenticated users can delete partner logos" ON storage.objects;
CREATE POLICY "Authenticated users can delete partner logos"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'partner-logos');

-- Organization logos storage policies
DROP POLICY IF EXISTS "Authenticated users can upload organization logos" ON storage.objects;
CREATE POLICY "Authenticated users can upload organization logos"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'organization-logos');

DROP POLICY IF EXISTS "Anyone can view organization logos" ON storage.objects;
CREATE POLICY "Anyone can view organization logos"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'organization-logos');

DROP POLICY IF EXISTS "Authenticated users can update organization logos" ON storage.objects;
CREATE POLICY "Authenticated users can update organization logos"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'organization-logos')
  WITH CHECK (bucket_id = 'organization-logos');

DROP POLICY IF EXISTS "Authenticated users can delete organization logos" ON storage.objects;
CREATE POLICY "Authenticated users can delete organization logos"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'organization-logos');

-- Email attachments storage policies
DROP POLICY IF EXISTS "Authenticated users can upload email attachments" ON storage.objects;
CREATE POLICY "Authenticated users can upload email attachments"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'email-attachments');

DROP POLICY IF EXISTS "Anyone can view email attachments" ON storage.objects;
CREATE POLICY "Anyone can view email attachments"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'email-attachments');

DROP POLICY IF EXISTS "Authenticated users can update email attachments" ON storage.objects;
CREATE POLICY "Authenticated users can update email attachments"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'email-attachments')
  WITH CHECK (bucket_id = 'email-attachments');

DROP POLICY IF EXISTS "Authenticated users can delete email attachments" ON storage.objects;
CREATE POLICY "Authenticated users can delete email attachments"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'email-attachments');

-- Advisor brochures storage policies
DROP POLICY IF EXISTS "Public read access for advisor brochures" ON storage.objects;
CREATE POLICY "Public read access for advisor brochures"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'advisor-brochures');

DROP POLICY IF EXISTS "Authenticated users can upload advisor brochures" ON storage.objects;
CREATE POLICY "Authenticated users can upload advisor brochures"
  ON storage.objects FOR INSERT
  TO public
  WITH CHECK (bucket_id = 'advisor-brochures');

DROP POLICY IF EXISTS "Authenticated users can update advisor brochures" ON storage.objects;
CREATE POLICY "Authenticated users can update advisor brochures"
  ON storage.objects FOR UPDATE
  TO public
  USING (bucket_id = 'advisor-brochures')
  WITH CHECK (bucket_id = 'advisor-brochures');

DROP POLICY IF EXISTS "Authenticated users can delete advisor brochures" ON storage.objects;
CREATE POLICY "Authenticated users can delete advisor brochures"
  ON storage.objects FOR DELETE
  TO public
  USING (bucket_id = 'advisor-brochures');
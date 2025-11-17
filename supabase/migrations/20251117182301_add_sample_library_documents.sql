/*
  # Add Sample Library Documents
  
  1. Purpose
    - Add realistic sample documents for both PER and Assurance Vie categories
    - Include documents from various insurance companies for demonstration
  
  2. Sample Documents
    PER Documents:
    - MMA PER Individuel - Présentation complète
    - Generali PER - Guide des avantages fiscaux
    - Entoria PER - Documentation technique
    - AG2R La Mondiale PER - Conditions générales
    - Axa PER - Brochure commerciale
    
    Assurance Vie Documents:
    - MMA Assurance Vie - Contrat multisupport
    - Generali Assurance Vie - Guide d'investissement
    - Entoria Assurance Vie - Tableau des frais
    - Cardif Assurance Vie - Conditions particulières
    - Axa Assurance Vie - Supports disponibles
  
  3. Notes
    - Uses dummy file paths (documents will need to be uploaded separately)
    - Realistic file sizes based on typical PDF documents
    - All documents assigned to the first admin user found
*/

DO $$
DECLARE
  admin_id uuid;
BEGIN
  -- Get the first admin user
  SELECT id INTO admin_id FROM user_profiles WHERE profile_type = 'Admin' LIMIT 1;
  
  IF admin_id IS NOT NULL THEN
    -- Insert PER sample documents
    INSERT INTO library_documents (organization_id, title, file_url, file_name, file_size, category, uploaded_by)
    VALUES
      ('1', 'MMA PER Individuel - Présentation complète', '1/PER/mma-per-presentation.pdf', 'mma-per-presentation.pdf', 1245678, 'PER', admin_id),
      ('1', 'Generali PER - Guide des avantages fiscaux', '1/PER/generali-per-guide-fiscal.pdf', 'generali-per-guide-fiscal.pdf', 987234, 'PER', admin_id),
      ('1', 'Entoria PER - Documentation technique', '1/PER/entoria-per-documentation.pdf', 'entoria-per-documentation.pdf', 2134567, 'PER', admin_id),
      ('1', 'AG2R La Mondiale PER - Conditions générales', '1/PER/ag2r-per-conditions.pdf', 'ag2r-per-conditions.pdf', 1567890, 'PER', admin_id),
      ('1', 'Axa PER - Brochure commerciale', '1/PER/axa-per-brochure.pdf', 'axa-per-brochure.pdf', 876543, 'PER', admin_id)
    ON CONFLICT DO NOTHING;
    
    -- Insert Assurance Vie sample documents
    INSERT INTO library_documents (organization_id, title, file_url, file_name, file_size, category, uploaded_by)
    VALUES
      ('1', 'MMA Assurance Vie - Contrat multisupport', '1/Assurance Vie/mma-av-multisupport.pdf', 'mma-av-multisupport.pdf', 1432890, 'Assurance Vie', admin_id),
      ('1', 'Generali Assurance Vie - Guide d''investissement', '1/Assurance Vie/generali-av-guide.pdf', 'generali-av-guide.pdf', 1098765, 'Assurance Vie', admin_id),
      ('1', 'Entoria Assurance Vie - Tableau des frais', '1/Assurance Vie/entoria-av-frais.pdf', 'entoria-av-frais.pdf', 654321, 'Assurance Vie', admin_id),
      ('1', 'Cardif Assurance Vie - Conditions particulières', '1/Assurance Vie/cardif-av-conditions.pdf', 'cardif-av-conditions.pdf', 1876543, 'Assurance Vie', admin_id),
      ('1', 'Axa Assurance Vie - Supports disponibles', '1/Assurance Vie/axa-av-supports.pdf', 'axa-av-supports.pdf', 945678, 'Assurance Vie', admin_id)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;
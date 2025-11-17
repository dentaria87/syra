/*
  # Ajout de documents d'exemple pour la bibliothèque
  
  1. Documents PER
    - MMA PER Individuel, Generali PER, Entoria PER, AG2R PER, Axa PER
    - SwissLife PER, BNP Paribas PER, Crédit Agricole PER, Allianz PER
  
  2. Documents Assurance Vie
    - MMA AV, Generali AV, Entoria AV, Cardif AV, Axa AV
    - SwissLife AV, BNP Paribas AV, Crédit Agricole AV, Allianz AV
*/

DO $$
DECLARE
  admin_id uuid;
BEGIN
  SELECT id INTO admin_id FROM user_profiles WHERE profile_type = 'Admin' LIMIT 1;
  
  IF admin_id IS NOT NULL THEN
    -- Documents PER
    INSERT INTO library_documents (organization_id, title, file_url, file_name, file_size, category, uploaded_by)
    VALUES
      ('1', 'MMA PER Individuel - Présentation complète', '1/PER/mma-per-presentation.pdf', 'mma-per-presentation.pdf', 1245678, 'PER', admin_id),
      ('1', 'Generali PER - Guide des avantages fiscaux', '1/PER/generali-per-guide-fiscal.pdf', 'generali-per-guide-fiscal.pdf', 987234, 'PER', admin_id),
      ('1', 'Entoria PER - Documentation technique', '1/PER/entoria-per-documentation.pdf', 'entoria-per-documentation.pdf', 2134567, 'PER', admin_id),
      ('1', 'AG2R La Mondiale PER - Conditions générales', '1/PER/ag2r-per-conditions.pdf', 'ag2r-per-conditions.pdf', 1567890, 'PER', admin_id),
      ('1', 'Axa PER - Brochure commerciale', '1/PER/axa-per-brochure.pdf', 'axa-per-brochure.pdf', 876543, 'PER', admin_id),
      ('1', 'SwissLife PER - Notice d''information', '1/PER/swisslife-per-notice.pdf', 'swisslife-per-notice.pdf', 1789012, 'PER', admin_id),
      ('1', 'BNP Paribas PER - Guide pratique', '1/PER/bnp-per-guide.pdf', 'bnp-per-guide.pdf', 1123456, 'PER', admin_id),
      ('1', 'Crédit Agricole PER - Plaquette produit', '1/PER/ca-per-plaquette.pdf', 'ca-per-plaquette.pdf', 2345678, 'PER', admin_id),
      ('1', 'Allianz PER - Conditions tarifaires', '1/PER/allianz-per-tarifs.pdf', 'allianz-per-tarifs.pdf', 1456789, 'PER', admin_id)
    ON CONFLICT DO NOTHING;
    
    -- Documents Assurance Vie
    INSERT INTO library_documents (organization_id, title, file_url, file_name, file_size, category, uploaded_by)
    VALUES
      ('1', 'MMA Assurance Vie - Contrat multisupport', '1/Assurance Vie/mma-av-multisupport.pdf', 'mma-av-multisupport.pdf', 1432890, 'Assurance Vie', admin_id),
      ('1', 'Generali Assurance Vie - Guide d''investissement', '1/Assurance Vie/generali-av-guide.pdf', 'generali-av-guide.pdf', 1098765, 'Assurance Vie', admin_id),
      ('1', 'Entoria Assurance Vie - Tableau des frais', '1/Assurance Vie/entoria-av-frais.pdf', 'entoria-av-frais.pdf', 654321, 'Assurance Vie', admin_id),
      ('1', 'Cardif Assurance Vie - Conditions particulières', '1/Assurance Vie/cardif-av-conditions.pdf', 'cardif-av-conditions.pdf', 1876543, 'Assurance Vie', admin_id),
      ('1', 'Axa Assurance Vie - Supports disponibles', '1/Assurance Vie/axa-av-supports.pdf', 'axa-av-supports.pdf', 945678, 'Assurance Vie', admin_id),
      ('1', 'SwissLife Assurance Vie - Document d''informations clés', '1/Assurance Vie/swisslife-av-dici.pdf', 'swisslife-av-dici.pdf', 892345, 'Assurance Vie', admin_id),
      ('1', 'BNP Paribas Assurance Vie - Options de gestion', '1/Assurance Vie/bnp-av-options.pdf', 'bnp-av-options.pdf', 1567234, 'Assurance Vie', admin_id),
      ('1', 'Crédit Agricole Assurance Vie - Fiscalité', '1/Assurance Vie/ca-av-fiscalite.pdf', 'ca-av-fiscalite.pdf', 1234567, 'Assurance Vie', admin_id),
      ('1', 'Allianz Assurance Vie - Frais et performances', '1/Assurance Vie/allianz-av-frais.pdf', 'allianz-av-frais.pdf', 1678901, 'Assurance Vie', admin_id)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;
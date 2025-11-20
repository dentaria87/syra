/*
  # Mettre à jour les dates des mémos exemples
  
  1. Objectif
    - Mettre à jour les mémos existants avec des dates pertinentes
    - Assurer que les mémos apparaissent dans le dashboard
    
  2. Mémos mis à jour (8 exemples)
    - Pièce manquante – Dossier MARTIN (20/11/2025 09:00)
    - Relance validation PER – GOASDOUE (21/11/2025 11:30)
    - Signature Assurance Vie – DUPONT (20/11/2025 14:00)
    - Programmer RDV bilan patrimonial (25/11/2025 10:00)
    - Mettre à jour procédure interne Bienviyance (27/11/2025 16:00)
    - Dossier en reprise – Mme LEROY (20/11/2025 18:00)
    - Vérifier documents signés (22/11/2025 15:00)
    - Dossier complexe – Note interne (24/11/2025 09:15)
*/

DO $$
DECLARE
  admin_id uuid;
BEGIN
  -- Get the first admin user
  SELECT id INTO admin_id FROM user_profiles WHERE profile_type = 'Admin' LIMIT 1;

  IF admin_id IS NOT NULL THEN
    -- Delete existing memos
    DELETE FROM memos WHERE organization_id = '1';

    -- Insert updated sample memos with current/future dates
    INSERT INTO memos (organization_id, user_id, title, description, due_date, due_time, status)
    VALUES
      ('1', admin_id, 'Pièce manquante – Dossier MARTIN', 'Attendre l''envoi du justificatif de domicile.', '2025-11-20', '09:00:00', 'pending'),
      ('1', admin_id, 'Relance validation PER – GOASDOUE', 'Relance téléphonique pour finaliser le contrat.', '2025-11-21', '11:30:00', 'pending'),
      ('1', admin_id, 'Signature Assurance Vie – DUPONT', 'Vérifier la signature électronique du dossier.', '2025-11-20', '14:00:00', 'pending'),
      ('1', admin_id, 'Programmer RDV bilan patrimonial', 'Prévoir un créneau de 30 min la semaine prochaine.', '2025-11-25', '10:00:00', 'pending'),
      ('1', admin_id, 'Mettre à jour procédure interne Bienviyance', 'Lire la version 2025 du document de conformité.', '2025-11-27', '16:00:00', 'pending'),
      ('1', admin_id, 'Dossier en reprise – Mme LEROY', 'Reprendre l''analyse (IBAN invalide).', '2025-11-20', '18:00:00', 'pending'),
      ('1', admin_id, 'Vérifier documents signés', 'Confirmer réception des documents post-signature.', '2025-11-22', '15:00:00', 'pending'),
      ('1', admin_id, 'Dossier complexe – Note interne', 'Vérifier situation familiale avant recommandation.', '2025-11-24', '09:15:00', 'pending')
    ON CONFLICT DO NOTHING;
  END IF;
END $$;
/*
  # Add Sample Memos for Testing
  
  1. Purpose
    - Add realistic sample memos to demonstrate the memos functionality
    - Include memos with various dates (today, tomorrow, future dates)
    - Provide diverse examples with and without descriptions
  
  2. Sample Memos
    - Rappeler M. Dupont (today)
    - Préparer présentation PER (tomorrow)
    - Relance assurance vie Mme Martin (in 2 days)
    - Réunion équipe marketing (in 3 days)
    - Envoi documents contrat Bernard (in 5 days)
    - Rendez-vous client Sophie Dubois (in 7 days)
  
  3. Notes
    - All memos assigned to the first admin user
    - Mix of memos with and without descriptions
    - Dates calculated relative to current date
*/

DO $$
DECLARE
  admin_id uuid;
  today_date date;
  tomorrow_date date;
BEGIN
  -- Get the first admin user
  SELECT id INTO admin_id FROM user_profiles WHERE profile_type = 'Admin' LIMIT 1;
  
  -- Calculate dates
  today_date := CURRENT_DATE;
  tomorrow_date := CURRENT_DATE + INTERVAL '1 day';
  
  IF admin_id IS NOT NULL THEN
    -- Insert sample memos
    INSERT INTO memos (organization_id, user_id, title, description, due_date, due_time, status)
    VALUES
      ('1', admin_id, 'Rappeler M. Dupont', 'Discuter de son PER et des options de versement disponibles', today_date, '14:30:00', 'pending'),
      ('1', admin_id, 'Préparer présentation PER', 'Préparer les slides pour la présentation client de demain après-midi', tomorrow_date, '10:00:00', 'pending'),
      ('1', admin_id, 'Relance assurance vie Mme Martin', 'Faire le point sur l''évolution de son contrat multisupport', today_date + INTERVAL '2 days', '15:00:00', 'pending'),
      ('1', admin_id, 'Réunion équipe marketing', 'Point mensuel sur les nouvelles campagnes et supports de communication', today_date + INTERVAL '3 days', '09:30:00', 'pending'),
      ('1', admin_id, 'Envoi documents contrat Bernard', NULL, today_date + INTERVAL '5 days', '11:00:00', 'pending'),
      ('1', admin_id, 'Rendez-vous client Sophie Dubois', 'Présentation des solutions d''épargne retraite et optimisation fiscale', today_date + INTERVAL '7 days', '16:00:00', 'pending'),
      ('1', admin_id, 'Vérifier signature contrat Axa', NULL, today_date, '16:30:00', 'pending'),
      ('1', admin_id, 'Formation produits Generali', 'Nouvelle gamme de produits PER - session en ligne', today_date + INTERVAL '4 days', '14:00:00', 'pending')
    ON CONFLICT DO NOTHING;
  END IF;
END $$;
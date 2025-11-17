/*
  # Update Moche Azran role and add Michael Hazan profile

  1. Role Updates
    - Change Moche Azran's profile_type from 'Gestion' to 'Manager'
    - This grants Manager-level permissions including access to Personnalisation du CRM

  2. New Profile
    - Add Michael Hazan with profile_type 'Gestion'
    - Email: michael.hazan@bienviyance.com
    - Photo: /Michael.jpg
    - Status: Inactive by default

  3. Notes
    - Only Admin and Manager roles have access to "Personnalisation du CRM" settings
    - Gestion role has access to most management features except organization settings
*/

-- Update Moche Azran's role from Gestion to Manager
UPDATE user_profiles
SET profile_type = 'Manager'
WHERE first_name = 'Moche' AND last_name = 'Azran';

-- Add Michael Hazan profile with Gestion role
INSERT INTO user_profiles (profile_type, first_name, last_name, email, is_active, photo_url)
VALUES ('Gestion', 'Michael', 'Hazan', 'michael.hazan@bienviyance.com', false, '/Michael.jpg')
ON CONFLICT DO NOTHING;

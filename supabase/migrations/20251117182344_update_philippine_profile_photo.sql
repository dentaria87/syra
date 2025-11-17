/*
  # Update Philippine Bachelier Profile Photo
  
  1. Purpose
    - Update Philippine Bachelier's profile to use the correct photo path
    - Ensure the photo_url points to /Philippine.jpg
  
  2. Changes
    - Update photo_url for Philippine Bachelier profile
    - Photo file is already available in public folder
*/

UPDATE user_profiles
SET photo_url = '/Philippine.jpg'
WHERE email = 'philippine.bachelier@bienviyance.com';
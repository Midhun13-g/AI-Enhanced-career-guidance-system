-- Fix users missing role assignments
-- Assign STUDENT role to any user who doesn't have any role
WITH student_role AS (
  SELECT id FROM roles WHERE name = 'STUDENT'
),
users_without_roles AS (
  SELECT u.id 
  FROM users u
  LEFT JOIN user_roles ur ON u.id = ur.user_id
  WHERE ur.user_id IS NULL
)
INSERT INTO user_roles (user_id, role_id)
SELECT uwt.id, sr.id 
FROM users_without_roles uwt, student_role sr
ON CONFLICT (user_id, role_id) DO NOTHING;

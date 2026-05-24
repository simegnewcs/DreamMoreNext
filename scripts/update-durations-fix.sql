-- Fix specific courses that show wrong duration
-- These courses may have been missed in the bulk update

-- Update digital marketing to 3 months
UPDATE courses SET duration = '3 Months' 
WHERE slug = 'digital-marketing';

-- Update C++ programming to 3 months  
UPDATE courses SET duration = '3 Months'
WHERE slug IN ('cpp-programming', 'c-programming', 'cpp', 'c-plus-plus');

-- Also update any course that still has '3 Week' or '3 Weeks' to '3 Months'
UPDATE courses SET duration = '3 Months'
WHERE duration LIKE '3 Week%' 
   OR duration LIKE '3 week%'
   OR duration = '3'
   OR duration = '3w'
   OR duration = '3W';

-- Verify all courses now have correct durations
SELECT slug, title, duration 
FROM courses 
WHERE slug IN ('digital-marketing', 'cpp-programming', 'full-stack-development', 'web-mobile-development')
   OR duration LIKE '%Week%'
   OR duration LIKE '%week%'
ORDER BY duration, title;

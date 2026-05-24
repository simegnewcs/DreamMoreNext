-- Update all courses to 3 months duration
UPDATE courses SET duration = '3 Months';

-- Update web development courses to 4 months
UPDATE courses SET duration = '4 Months' 
WHERE slug IN (
    'full-stack-development',
    'web-mobile-development',
    'web-development',
    'web-and-mobile-development'
);

-- Verify the changes
SELECT slug, title, duration FROM courses ORDER BY duration DESC, title;

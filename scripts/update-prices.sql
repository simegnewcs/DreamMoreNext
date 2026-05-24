-- Update all courses price to 6000 ETB
UPDATE courses SET price = 6000;

-- Update web development courses to 8000 ETB
UPDATE courses SET price = 8000 
WHERE slug IN (
    'full-stack-development',
    'web-mobile-development',
    'web-development',
    'web-and-mobile-development'
);

-- Verify the changes
SELECT slug, title, price, duration FROM courses ORDER BY price DESC, title;

const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

require('dotenv').config({ path: '.env.local' });

async function setupBlogsTable() {
  const dbConfig = {
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "3306"),
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "dreammore",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  };

  console.log('Connecting to database...');
  
  try {
    const connection = await mysql.createConnection(dbConfig);
    console.log('✅ Database connected successfully');

    // Read and execute the migration SQL
    const migrationPath = path.join(__dirname, '..', 'src', 'lib', 'db', 'migrations', 'create_blogs_table.sql');
    const sql = fs.readFileSync(migrationPath, 'utf8');
    
    // Split SQL into individual statements
    const statements = sql.split(';').filter(stmt => stmt.trim());
    
    for (const statement of statements) {
      if (statement.trim()) {
        console.log('Executing:', statement.trim().substring(0, 50) + '...');
        await connection.execute(statement);
      }
    }
    
    console.log('✅ Blogs table created successfully');
    
    // Check if table is empty and seed with default data
    const [rows] = await connection.execute('SELECT COUNT(*) as count FROM blogs');
    
    if (rows[0].count === 0) {
      console.log('Seeding blogs table with default data...');
      
      // Import the BLOG_POSTS data
      const { BLOG_POSTS } = require('../src/lib/data.ts');
      
      for (const post of BLOG_POSTS) {
        await connection.execute(
          `INSERT INTO blogs (slug, title, excerpt, description, category, author, author_image, date, read_time, image, video, featured, promotion) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            post.slug,
            post.title,
            post.excerpt,
            post.description || '',
            post.category,
            post.author,
            post.authorImage || '/images/team/default.jpg',
            post.date,
            post.readTime,
            post.image || '/images/blog/default.jpg',
            post.video || null,
            post.featured || false,
            post.promotion || false
          ]
        );
      }
      
      console.log(`✅ Seeded ${BLOG_POSTS.length} blog posts`);
    } else {
      console.log(`ℹ️  Blogs table already has ${rows[0].count} posts`);
    }
    
    await connection.end();
    console.log('✅ Setup complete!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

setupBlogsTable();

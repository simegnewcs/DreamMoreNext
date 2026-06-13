const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

// Parse .env.local manually to avoid external dependencies like dotenv
try {
  const envPath = path.join(__dirname, '..', '.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        const key = match[1];
        let value = match[2] || '';
        // Remove quotes if present
        if (value.startsWith('"') && value.endsWith('"')) {
          value = value.substring(1, value.length - 1);
        } else if (value.startsWith("'") && value.endsWith("'")) {
          value = value.substring(1, value.length - 1);
        }
        process.env[key] = value.trim();
      }
    });
  }
} catch (e) {
  console.log('Note: Error parsing .env.local manually:', e.message);
}

async function setupTrustedBrandsTable() {
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
    const migrationPath = path.join(__dirname, '..', 'src', 'lib', 'db', 'migrations', 'create_trusted_brands_table.sql');
    const sql = fs.readFileSync(migrationPath, 'utf8');
    
    // Split SQL into individual statements
    const statements = sql.split(';').filter(stmt => stmt.trim());
    
    for (const statement of statements) {
      if (statement.trim()) {
        console.log('Executing:', statement.trim().substring(0, 50) + '...');
        await connection.execute(statement);
      }
    }
    
    console.log('✅ Trusted Brands table created successfully');
    
    await connection.end();
    console.log('✅ Setup complete!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

setupTrustedBrandsTable();

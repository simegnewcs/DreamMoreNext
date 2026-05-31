# Blog Database Setup

## Step 1: Create the Blogs Table

Run the SQL migration to create the blogs table in your MySQL database:

### Option A: Using the setup script
```bash
node scripts/setup-blogs-table.js
```

### Option B: Manual SQL execution
Run this SQL in your MySQL database:

```sql
CREATE TABLE IF NOT EXISTS blogs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  excerpt TEXT NOT NULL,
  description LONGTEXT,
  category VARCHAR(50) NOT NULL,
  author VARCHAR(100) NOT NULL,
  author_image VARCHAR(255) DEFAULT '/images/team/default.jpg',
  date DATE NOT NULL,
  read_time VARCHAR(20) NOT NULL,
  image VARCHAR(255) DEFAULT '/images/blog/default.jpg',
  video VARCHAR(500),
  featured BOOLEAN DEFAULT FALSE,
  promotion BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_slug (slug),
  INDEX idx_category (category),
  INDEX idx_featured (featured),
  INDEX idx_date (date)
);
```

## Step 2: Seed with Default Data (Optional)

If you want to populate the database with the default blog posts from `src/lib/data.ts`:

```bash
# The setup script above will automatically seed if table is empty
# Or manually insert the data from your data.ts file
```

## Features

Now your blog system will:
- ✅ Save new blog posts to the database (not just in memory)
- ✅ Fetch all blog posts from the database on page load
- ✅ Edit and delete blog posts permanently
- ✅ Persist data across server restarts and page refreshes

## API Endpoints

- `GET /api/blogs` - Public endpoint to fetch all blogs
- `GET /api/admin/blog` - Admin endpoint to fetch all blogs
- `POST /api/admin/blog` - Create new blog post
- `PUT /api/admin/blog/[id]` - Update blog post
- `DELETE /api/admin/blog/[id]` - Delete blog post

## Database Functions

All database operations are in `src/lib/db/blogs.ts`:
- `getAllBlogs()` - Get all blog posts
- `getBlogBySlug(slug)` - Get single blog by slug
- `getBlogById(id)` - Get single blog by ID
- `createBlog(blog)` - Create new blog
- `updateBlog(id, blog)` - Update existing blog
- `deleteBlog(id)` - Delete blog

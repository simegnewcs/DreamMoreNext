import { query } from "@/lib/db";

export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  description?: string;
  category: string;
  author: string;
  authorImage?: string;
  date: string;
  readTime: string;
  image?: string;
  video?: string | null;
  featured?: boolean;
  promotion?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Get all blog posts
export async function getAllBlogs(): Promise<BlogPost[]> {
  const results = await query(
    `SELECT 
      id, 
      slug, 
      title, 
      excerpt, 
      description, 
      category, 
      author, 
      author_image as authorImage, 
      DATE_FORMAT(date, '%Y-%m-%d') as date, 
      read_time as readTime, 
      image, 
      video, 
      featured, 
      promotion,
      created_at as createdAt,
      updated_at as updatedAt
    FROM blogs 
    ORDER BY date DESC, id DESC`
  );
  return results as BlogPost[];
}

// Get blog by slug
export async function getBlogBySlug(slug: string): Promise<BlogPost | null> {
  const results = await query(
    `SELECT 
      id, 
      slug, 
      title, 
      excerpt, 
      description, 
      category, 
      author, 
      author_image as authorImage, 
      DATE_FORMAT(date, '%Y-%m-%d') as date, 
      read_time as readTime, 
      image, 
      video, 
      featured, 
      promotion,
      created_at as createdAt,
      updated_at as updatedAt
    FROM blogs 
    WHERE slug = ?`,
    [slug]
  );
  const blogs = results as BlogPost[];
  return blogs.length > 0 ? blogs[0] : null;
}

// Get blog by ID
export async function getBlogById(id: number): Promise<BlogPost | null> {
  const results = await query(
    `SELECT 
      id, 
      slug, 
      title, 
      excerpt, 
      description, 
      category, 
      author, 
      author_image as authorImage, 
      DATE_FORMAT(date, '%Y-%m-%d') as date, 
      read_time as readTime, 
      image, 
      video, 
      featured, 
      promotion,
      created_at as createdAt,
      updated_at as updatedAt
    FROM blogs 
    WHERE id = ?`,
    [id]
  );
  const blogs = results as BlogPost[];
  return blogs.length > 0 ? blogs[0] : null;
}

// Create new blog post
export async function createBlog(blog: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>): Promise<BlogPost> {
  // Generate slug if not provided
  const slug = blog.slug || blog.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  
  const result: any = await query(
    `INSERT INTO blogs (
      slug, title, excerpt, description, category, author, 
      author_image, date, read_time, image, video, featured, promotion
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      slug,
      blog.title,
      blog.excerpt,
      blog.description || '',
      blog.category,
      blog.author,
      blog.authorImage || '/images/team/default.jpg',
      blog.date,
      blog.readTime,
      blog.image || '/images/blog/default.jpg',
      blog.video || null,
      blog.featured || false,
      blog.promotion || false
    ]
  );
  
  const newBlog = await getBlogById(result.insertId);
  if (!newBlog) throw new Error('Failed to create blog');
  return newBlog;
}

// Update blog post
export async function updateBlog(id: number, blog: Partial<BlogPost>): Promise<BlogPost | null> {
  // Build dynamic update query
  const updates: string[] = [];
  const values: any[] = [];
  
  if (blog.title !== undefined) {
    updates.push('title = ?');
    values.push(blog.title);
  }
  if (blog.slug !== undefined) {
    updates.push('slug = ?');
    values.push(blog.slug);
  }
  if (blog.excerpt !== undefined) {
    updates.push('excerpt = ?');
    values.push(blog.excerpt);
  }
  if (blog.description !== undefined) {
    updates.push('description = ?');
    values.push(blog.description);
  }
  if (blog.category !== undefined) {
    updates.push('category = ?');
    values.push(blog.category);
  }
  if (blog.author !== undefined) {
    updates.push('author = ?');
    values.push(blog.author);
  }
  if (blog.authorImage !== undefined) {
    updates.push('author_image = ?');
    values.push(blog.authorImage);
  }
  if (blog.date !== undefined) {
    updates.push('date = ?');
    values.push(blog.date);
  }
  if (blog.readTime !== undefined) {
    updates.push('read_time = ?');
    values.push(blog.readTime);
  }
  if (blog.image !== undefined) {
    updates.push('image = ?');
    values.push(blog.image);
  }
  if (blog.video !== undefined) {
    updates.push('video = ?');
    values.push(blog.video);
  }
  if (blog.featured !== undefined) {
    updates.push('featured = ?');
    values.push(blog.featured);
  }
  if (blog.promotion !== undefined) {
    updates.push('promotion = ?');
    values.push(blog.promotion);
  }
  
  if (updates.length === 0) return await getBlogById(id);
  
  values.push(id);
  
  await query(
    `UPDATE blogs SET ${updates.join(', ')} WHERE id = ?`,
    values
  );
  
  return await getBlogById(id);
}

// Delete blog post
export async function deleteBlog(id: number): Promise<boolean> {
  const result: any = await query('DELETE FROM blogs WHERE id = ?', [id]);
  return result.affectedRows > 0;
}

// Get featured blog
export async function getFeaturedBlog(): Promise<BlogPost | null> {
  const results = await query(
    `SELECT 
      id, 
      slug, 
      title, 
      excerpt, 
      description, 
      category, 
      author, 
      author_image as authorImage, 
      DATE_FORMAT(date, '%Y-%m-%d') as date, 
      read_time as readTime, 
      image, 
      video, 
      featured, 
      promotion,
      created_at as createdAt,
      updated_at as updatedAt
    FROM blogs 
    WHERE featured = TRUE 
    ORDER BY date DESC 
    LIMIT 1`
  );
  const blogs = results as BlogPost[];
  return blogs.length > 0 ? blogs[0] : null;
}

// Get blogs by category
export async function getBlogsByCategory(category: string): Promise<BlogPost[]> {
  const results = await query(
    `SELECT 
      id, 
      slug, 
      title, 
      excerpt, 
      description, 
      category, 
      author, 
      author_image as authorImage, 
      DATE_FORMAT(date, '%Y-%m-%d') as date, 
      read_time as readTime, 
      image, 
      video, 
      featured, 
      promotion,
      created_at as createdAt,
      updated_at as updatedAt
    FROM blogs 
    WHERE category = ?
    ORDER BY date DESC`,
    [category]
  );
  return results as BlogPost[];
}

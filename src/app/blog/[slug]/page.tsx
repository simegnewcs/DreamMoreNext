import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBlogBySlug, getAllBlogs } from "@/lib/db/blogs";
import BlogDetailClient from "@/components/blog/BlogDetailClient";

interface BlogDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

async function fetchBlogBySlug(slug: string) {
  try {
    // Fetch directly from database
    const post = await getBlogBySlug(slug);
    return post;
  } catch (error) {
    console.error('Error fetching blog from database:', error);
    return null;
  }
}

async function fetchAllBlogs() {
  try {
    // Fetch all blogs from database for static generation
    const blogs = await getAllBlogs();
    return blogs;
  } catch (error) {
    console.error('Error fetching blogs from database:', error);
    return [];
  }
}

export async function generateMetadata({ params }: BlogDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await fetchBlogBySlug(slug);
  
  if (!post) {
    return {
      title: "Blog Post Not Found",
      description: "The requested blog post could not be found.",
    };
  }

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
    },
  };
}

// Generate static params for all blog posts
export async function generateStaticParams() {
  const blogs = await fetchAllBlogs();
  return blogs.map((blog: any) => ({
    slug: blog.slug,
  }));
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params;
  const post = await fetchBlogBySlug(slug);

  if (!post) {
    notFound();
  }

  return <BlogDetailClient post={post} />;
}

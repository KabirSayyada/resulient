
import { supabase } from "@/integrations/supabase/client";

export const generateSitemap = async () => {
  // Base URL of the website
  const baseUrl = 'https://resulient.ai';
  
  // Static routes
  const staticRoutes = [
    '', // homepage
    '/resume-scoring',
    '/pricing',
    '/blog',
    '/terms',
    '/privacy',
    '/refund-policy',
    '/legal',
  ];
  
  // Fetch all published blog posts
  const { data: blogPosts } = await supabase
    .from('published_blog_posts')
    .select('slug')
    .is('published_at', 'not.null');
  
  // Fetch all blog categories
  const { data: categories } = await supabase
    .from('blog_categories')
    .select('slug');
  
  // XML sitemap header
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;
  
  // Add static routes to sitemap
  staticRoutes.forEach(route => {
    sitemap += `
  <url>
    <loc>${baseUrl}${route}</loc>
    <changefreq>weekly</changefreq>
    <priority>${route === '' ? 1.0 : 0.8}</priority>
  </url>`;
  });
  
  // Add blog posts to sitemap
  if (blogPosts) {
    blogPosts.forEach(post => {
      sitemap += `
  <url>
    <loc>${baseUrl}/blog/${post.slug}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;
    });
  }
  
  // Add blog categories to sitemap
  if (categories) {
    categories.forEach(category => {
      sitemap += `
  <url>
    <loc>${baseUrl}/blog/category/${category.slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`;
    });
  }
  
  // Close sitemap XML
  sitemap += `
</urlset>`;
  
  return sitemap;
};

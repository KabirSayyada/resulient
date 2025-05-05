
import { supabase } from "@/integrations/supabase/client";

export const generateSitemap = async () => {
  try {
    // Base URL of the website
    const baseUrl = 'https://resulient.ai';
    
    // Current date for lastmod
    const currentDate = new Date().toISOString().split('T')[0];
    
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
    const { data: blogPosts, error: postsError } = await supabase
      .from('published_blog_posts')
      .select('slug, updated_at, category')
      .not('published_at', 'is', null);
    
    if (postsError) {
      console.error('Error fetching blog posts:', postsError);
    }
    
    // Fetch all blog categories
    const { data: categories, error: categoriesError } = await supabase
      .from('blog_categories')
      .select('slug');
    
    if (categoriesError) {
      console.error('Error fetching categories:', categoriesError);
    }
    
    // XML sitemap header
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">`;
    
    // Add static routes to sitemap
    staticRoutes.forEach(route => {
      sitemap += `
  <url>
    <loc>${baseUrl}${route}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${route === '' ? 1.0 : 0.8}</priority>
  </url>`;
    });
    
    // Add blog posts to sitemap
    if (blogPosts) {
      blogPosts.forEach(post => {
        const lastmod = post.updated_at ? post.updated_at.split('T')[0] : currentDate;
        sitemap += `
  <url>
    <loc>${baseUrl}/blog/${post.slug}</loc>
    <lastmod>${lastmod}</lastmod>
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
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`;
      });
    }
    
    // Add specific category pages we have added content for
    const specificCategories = ['interview-preparation', 'job-search-strategy'];
    specificCategories.forEach(category => {
      sitemap += `
  <url>
    <loc>${baseUrl}/blog/category/${category}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
    });
    
    // Close sitemap XML
    sitemap += `
</urlset>`;
    
    return sitemap;
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>';
  }
};

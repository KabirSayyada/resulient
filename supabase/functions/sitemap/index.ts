
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.26.0'

// Define CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/xml; charset=UTF-8',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }
  
  try {
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SUPABASE_ANON_KEY') || ''
    )
    
    // Base URL of the website
    const baseUrl = 'https://resulient.ai'
    
    // Current date for lastmod
    const currentDate = new Date().toISOString().split('T')[0];
    
    // Static routes with priority and change frequency
    const staticRoutes = [
      { path: '', priority: 1.0, changefreq: 'weekly' }, // homepage
      { path: '/resume-scoring', priority: 0.9, changefreq: 'weekly' },
      { path: '/pricing', priority: 0.9, changefreq: 'weekly' },
      { path: '/blog', priority: 0.8, changefreq: 'daily' },
      { path: '/terms', priority: 0.7, changefreq: 'monthly' },
      { path: '/privacy', priority: 0.7, changefreq: 'monthly' },
      { path: '/refund-policy', priority: 0.7, changefreq: 'monthly' },
      { path: '/legal', priority: 0.7, changefreq: 'monthly' },
    ];
    
    // Fetch all published blog posts
    const { data: blogPosts, error: postsError } = await supabaseClient
      .from('published_blog_posts')
      .select('slug, updated_at, category, published_at')
      .not('published_at', 'is', null)
    
    if (postsError) {
      console.error('Error fetching blog posts:', postsError)
    }
    
    // Fetch all blog categories
    const { data: categories, error: categoriesError } = await supabaseClient
      .from('blog_categories')
      .select('slug, name')
    
    if (categoriesError) {
      console.error('Error fetching categories:', categoriesError)
    }
    
    // XML sitemap header with schemas
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd
        http://www.google.com/schemas/sitemap-image/1.1
        http://www.google.com/schemas/sitemap-image/1.1/sitemap-image.xsd">`
    
    // Add static routes to sitemap
    staticRoutes.forEach(route => {
      sitemap += `
  <url>
    <loc>${baseUrl}${route.path}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`
    })
    
    // Add blog posts to sitemap
    if (blogPosts) {
      blogPosts.forEach(post => {
        const publishDate = post.published_at ? new Date(post.published_at) : new Date();
        const lastmod = post.updated_at ? post.updated_at.split('T')[0] : currentDate;
        
        // Calculate post age to determine change frequency
        const daysSincePublish = Math.floor((new Date().getTime() - publishDate.getTime()) / (1000 * 3600 * 24));
        
        // Newer posts change more frequently and have higher priority
        let changefreq = 'monthly';
        let priority = 0.7;
        
        if (daysSincePublish < 7) {
          changefreq = 'daily';
          priority = 0.8;
        } else if (daysSincePublish < 30) {
          changefreq = 'weekly';
          priority = 0.7;
        }
        
        sitemap += `
  <url>
    <loc>${baseUrl}/blog/${post.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
      })
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
  </url>`
      })
    }
    
    // Add specific category pages we have added content for
    const specificCategories = [
      { slug: 'interview-preparation', priority: 0.8 },
      { slug: 'job-search-strategy', priority: 0.8 },
      { slug: 'resume-tips', priority: 0.8 },
      { slug: 'career-development', priority: 0.7 }
    ];
    
    specificCategories.forEach(category => {
      sitemap += `
  <url>
    <loc>${baseUrl}/blog/category/${category.slug}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${category.priority}</priority>
  </url>`
    });
    
    // Close sitemap XML
    sitemap += `
</urlset>`
    
    return new Response(sitemap, {
      headers: corsHeaders,
      status: 200,
    })
  } catch (error) {
    console.error('Error generating sitemap:', error)
    
    return new Response(JSON.stringify({ error: 'Error generating sitemap' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})

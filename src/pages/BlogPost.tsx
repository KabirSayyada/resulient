
import { useParams, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { BlogLayout } from '@/components/blog/BlogLayout';
import { useBlogPost } from '@/hooks/useBlogPosts';
import { BlogPostContent } from '@/components/blog/BlogPostContent';
import { Skeleton } from '@/components/ui/skeleton';
import { Helmet } from 'react-helmet-async';

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const { post, isLoading, error } = useBlogPost(slug || '');
  
  if (error) {
    return <Navigate to="/blog" />;
  }

  // SEO content with improved metadata
  const title = post ? `${post.title} | Resulient Blog` : 'Blog Post | Resulient';
  const description = post?.seo_description || post?.excerpt || 'Read this informative article on the Resulient blog';
  const keywords = post?.seo_keywords || post?.tags?.join(', ') || 'resume, career, job search, interview preparation';
  const ogImage = post?.featured_image || '/lovable-uploads/2f15a536-6c8b-4812-b04f-13e247804a93.png';
  const canonicalUrl = `https://resulient.com/blog/${slug}`;
  const publishedDate = post?.published_at || '';
  const modifiedDate = post?.updated_at || '';
  
  // Get author name with fallback
  const authorName = post?.author_first_name && post?.author_last_name 
    ? `${post.author_first_name} ${post.author_last_name}` 
    : 'Resulient';
  
  // Prepare structured data for BlogPosting schema
  const structuredData = post ? {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": description,
    "image": post.featured_image || '/lovable-uploads/2f15a536-6c8b-4812-b04f-13e247804a93.png',
    "author": {
      "@type": "Person",
      "name": authorName,
      "url": "https://resulient.com/about"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Resulient",
      "logo": {
        "@type": "ImageObject",
        "url": "https://resulient.com/favicon.png"
      }
    },
    "datePublished": post.published_at || new Date().toISOString(),
    "dateModified": post.updated_at || new Date().toISOString(),
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": canonicalUrl
    },
    "keywords": post.tags?.join(', ') || keywords,
    "articleSection": post.category || "Career Development"
  } : null;
  
  // Track page view with Google Analytics
  useEffect(() => {
    if (post && typeof window !== 'undefined') {
      // Check if gtag is available
      if (window.gtag) {
        window.gtag('event', 'view_item', {
          'event_category': 'Blog',
          'event_label': post.title,
          'item_id': post.id,
          'item_name': post.title,
          'item_category': post.category || 'Uncategorized',
          'page_location': window.location.href,
          'page_title': title
        });
        
        // Track page view
        window.gtag('event', 'page_view', {
          page_title: title,
          page_location: window.location.href,
          page_path: `/blog/${slug}`
        });
      }
    }
  }, [post, slug, title]);

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <link rel="canonical" href={canonicalUrl} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="article" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:site_name" content="Resulient" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="1200" />
        <meta property="og:locale" content="en_US" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={canonicalUrl} />
        <meta property="twitter:title" content={title} />
        <meta property="twitter:description" content={description} />
        <meta property="twitter:image" content={ogImage} />
        <meta property="twitter:creator" content="@lovable_dev" />
        
        {/* Article specific metadata */}
        {publishedDate && (
          <meta property="article:published_time" content={publishedDate} />
        )}
        {modifiedDate && (
          <meta property="article:modified_time" content={modifiedDate} />
        )}
        {post && post.category && (
          <meta property="article:section" content={post.category} />
        )}
        {post && post.tags && post.tags.map((tag: string, index: number) => (
          <meta key={index} property="article:tag" content={tag} />
        ))}
        
        {/* Additional SEO tags */}
        <meta name="author" content={authorName} />
        <meta name="robots" content="index, follow" />
        
        {/* Structured data / Schema.org BlogPosting */}
        {structuredData && (
          <script type="application/ld+json">
            {JSON.stringify(structuredData)}
          </script>
        )}
      </Helmet>

      <BlogLayout>
        {isLoading ? (
          <div className="space-y-4 px-2">
            <Skeleton className="h-8 w-3/4" />
            <div className="flex items-center space-x-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-32" />
            </div>
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        ) : post ? (
          <BlogPostContent post={post} />
        ) : (
          <Navigate to="/blog" />
        )}
      </BlogLayout>
    </>
  );
}

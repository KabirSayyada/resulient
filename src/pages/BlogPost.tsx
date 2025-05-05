
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
  const ogImage = post?.featured_image || 'https://resulient.ai/og-image.jpg';
  const canonicalUrl = `https://resulient.ai/blog/${slug}`;
  const publishedDate = post?.published_at || '';
  const modifiedDate = post?.updated_at || '';
  
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
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={canonicalUrl} />
        <meta property="twitter:title" content={title} />
        <meta property="twitter:description" content={description} />
        <meta property="twitter:image" content={ogImage} />
        
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
        <meta name="author" content={`${post?.author_first_name || ''} ${post?.author_last_name || ''}`} />
        <meta name="robots" content="index, follow" />
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

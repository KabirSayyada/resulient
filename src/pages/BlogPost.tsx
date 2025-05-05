
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

  // SEO content
  const title = post ? `${post.title} | Resulient Blog` : 'Blog Post | Resulient';
  const description = post?.excerpt || 'Read this article on the Resulient blog';
  const keywords = post?.seo_keywords || 'resume, career, job search';
  const ogImage = post?.featured_image || undefined;
  
  // Track page view with Google Analytics
  useEffect(() => {
    if (post && window.gtag) {
      window.gtag('event', 'view_item', {
        'event_category': 'Blog',
        'event_label': post.title,
        'item_id': post.id,
        'item_name': post.title,
        'item_category': post.category || 'Uncategorized'
      });
    }
  }, [post]);

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://resulient.ai/blog/${slug}`} />
        {ogImage && <meta property="og:image" content={ogImage} />}
        {post && post.published_at && (
          <meta property="article:published_time" content={post.published_at} />
        )}
        {post && post.updated_at && (
          <meta property="article:modified_time" content={post.updated_at} />
        )}
        {post && post.tags && post.tags.map((tag, index) => (
          <meta key={index} property="article:tag" content={tag} />
        ))}
      </Helmet>

      <BlogLayout>
        {isLoading ? (
          <div className="space-y-4">
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

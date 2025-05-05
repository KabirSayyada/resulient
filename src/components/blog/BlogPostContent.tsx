
import { BlogPost } from '@/types/blog';
import { formatDistanceToNow } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ChevronLeft, Clock, Share } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { useBlogPosts } from '@/hooks/useBlogPosts';

interface BlogPostContentProps {
  post: BlogPost;
}

export function BlogPostContent({ post }: BlogPostContentProps) {
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const { posts } = useBlogPosts();
  
  useEffect(() => {
    // Find posts with the same category or matching tags
    if (posts.length > 0) {
      const filtered = posts
        .filter(p => p.id !== post.id) // Exclude current post
        .filter(p => 
          p.category === post.category || 
          p.tags.some(tag => post.tags.includes(tag))
        )
        .slice(0, 3); // Get up to 3 related posts
      
      setRelatedPosts(filtered);
    }
  }, [posts, post]);

  const formattedDate = post.published_at
    ? formatDistanceToNow(new Date(post.published_at), { addSuffix: true })
    : 'Not published';

  const authorInitials = post.author_first_name && post.author_last_name
    ? `${post.author_first_name.charAt(0)}${post.author_last_name.charAt(0)}`
    : 'AU';

  const authorName = post.author_first_name && post.author_last_name
    ? `${post.author_first_name} ${post.author_last_name}`
    : 'Unknown Author';

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.excerpt,
        url: window.location.href,
      })
      .catch((error) => console.log('Error sharing', error));
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href)
        .then(() => {
          alert('URL copied to clipboard!');
        })
        .catch((error) => console.log('Error copying to clipboard', error));
    }
  };

  return (
    <article className="max-w-full mx-auto">
      <Link to="/blog">
        <Button variant="ghost" className="mb-4">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Blog
        </Button>
      </Link>

      {post.featured_image && (
        <div className="relative h-64 md:h-96 w-full overflow-hidden rounded-lg mb-8">
          <img
            src={post.featured_image}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
          {post.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-muted-foreground">
          <div className="flex items-center space-x-2">
            <Avatar>
              {post.author_avatar_url ? (
                <AvatarImage src={post.author_avatar_url} alt={authorName} />
              ) : (
                <AvatarFallback>{authorInitials}</AvatarFallback>
              )}
            </Avatar>
            <span className="font-medium">{authorName}</span>
          </div>
          <Separator orientation="vertical" className="h-4" />
          <span>{formattedDate}</span>
          {post.category && (
            <>
              <Separator orientation="vertical" className="h-4" />
              <Badge variant="secondary">
                <Link to={`/blog/category/${post.category}`} className="hover:no-underline">
                  {post.category}
                </Link>
              </Badge>
            </>
          )}
          {post.reading_time && (
            <>
              <Separator orientation="vertical" className="h-4" />
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                <span>{post.reading_time} min read</span>
              </div>
            </>
          )}
          <div className="ml-auto">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleShare}
              className="flex items-center gap-1"
            >
              <Share className="h-4 w-4" />
              Share
            </Button>
          </div>
        </div>
      </div>

      <div 
        className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-semibold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-h4:text-lg prose-p:leading-relaxed prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-img:rounded-lg prose-img:my-8 prose-blockquote:border-l-4 prose-blockquote:border-primary/50 prose-blockquote:pl-4 prose-blockquote:py-1 prose-blockquote:italic space-y-6"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {post.tags && post.tags.length > 0 && (
        <div className="mt-12">
          <h3 className="text-lg font-semibold mb-2">Related Topics</h3>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag, index) => (
              <Badge key={index} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Related Posts Section */}
      {relatedPosts.length > 0 && (
        <div className="my-12">
          <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedPosts.map(relatedPost => (
              <Card key={relatedPost.id} className="overflow-hidden">
                <Link to={`/blog/${relatedPost.slug}`}>
                  {relatedPost.featured_image && (
                    <div className="h-40 w-full overflow-hidden">
                      <img 
                        src={relatedPost.featured_image} 
                        alt={relatedPost.title}
                        className="w-full h-full object-cover transition-transform hover:scale-105" 
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-semibold mb-2 line-clamp-2">{relatedPost.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-3">{relatedPost.excerpt}</p>
                  </div>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      )}
      
      {/* Newsletter Signup */}
      <div className="my-12 p-6 bg-muted rounded-lg">
        <h3 className="text-xl font-bold mb-2">Stay Updated</h3>
        <p className="mb-4">Get the latest career tips and insights delivered straight to your inbox.</p>
        <form className="flex flex-col sm:flex-row gap-2" onSubmit={(e) => e.preventDefault()}>
          <input 
            type="email" 
            placeholder="Your email address" 
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
            required
          />
          <Button type="submit">Subscribe</Button>
        </form>
      </div>
    </article>
  );
}

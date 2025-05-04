
import { BlogPost } from '@/types/blog';
import { formatDistanceToNow } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface BlogPostContentProps {
  post: BlogPost;
}

export function BlogPostContent({ post }: BlogPostContentProps) {
  const formattedDate = post.published_at
    ? formatDistanceToNow(new Date(post.published_at), { addSuffix: true })
    : 'Not published';

  const authorInitials = post.author_first_name && post.author_last_name
    ? `${post.author_first_name.charAt(0)}${post.author_last_name.charAt(0)}`
    : 'AU';

  const authorName = post.author_first_name && post.author_last_name
    ? `${post.author_first_name} ${post.author_last_name}`
    : 'Unknown Author';

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

      <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
        {post.title}
      </h1>

      <div className="flex items-center space-x-4 mb-8">
        <div className="flex items-center space-x-2">
          <Avatar>
            {post.author_avatar_url ? (
              <AvatarImage src={post.author_avatar_url} alt={authorName} />
            ) : (
              <AvatarFallback>{authorInitials}</AvatarFallback>
            )}
          </Avatar>
          <span className="text-sm font-medium">{authorName}</span>
        </div>
        <Separator orientation="vertical" className="h-4" />
        <span className="text-sm text-muted-foreground">{formattedDate}</span>
        {post.category && (
          <>
            <Separator orientation="vertical" className="h-4" />
            <Badge variant="secondary">
              {post.category}
            </Badge>
          </>
        )}
      </div>

      <div 
        className="prose prose-lg dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {post.tags && post.tags.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-2">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag, index) => (
              <Badge key={index} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}

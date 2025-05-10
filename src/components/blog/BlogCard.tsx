
import { BlogPost } from '@/types/blog';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';
import { Clock } from 'lucide-react';

interface BlogCardProps {
  post: BlogPost;
}

export function BlogCard({ post }: BlogCardProps) {
  const formattedDate = post.published_at 
    ? formatDistanceToNow(new Date(post.published_at), { addSuffix: true })
    : '';
  
  // Get author initials for avatar fallback
  const authorInitials = post.author_first_name && post.author_last_name
    ? `${post.author_first_name.charAt(0)}${post.author_last_name.charAt(0)}`
    : 'AU';
  
  // Get full author name with better fallback
  const authorName = post.author_first_name && post.author_last_name
    ? `${post.author_first_name} ${post.author_last_name}`
    : 'Resulient Team';

  return (
    <Card className="h-full flex flex-col overflow-hidden">
      <Link to={`/blog/${post.slug}`} className="h-full flex flex-col">
        {post.featured_image && (
          <div className="h-48 w-full overflow-hidden">
            <img 
              src={post.featured_image} 
              alt={post.title} 
              className="h-full w-full object-cover transition-transform hover:scale-105"
            />
          </div>
        )}
        
        <CardHeader className="flex-grow pb-2">
          <div className="flex justify-between items-start gap-2 mb-2">
            {post.category && (
              <Badge variant="secondary" className="mb-2">
                {post.category.replace(/-/g, ' ')}
              </Badge>
            )}
            {post.reading_time && (
              <div className="flex items-center text-xs text-muted-foreground">
                <Clock className="h-3 w-3 mr-1" />
                <span>{post.reading_time} min read</span>
              </div>
            )}
          </div>
          <h3 className="text-xl font-semibold line-clamp-2 mb-2">
            {post.title}
          </h3>
          <p className="text-muted-foreground line-clamp-3">
            {post.excerpt}
          </p>
        </CardHeader>
        
        <CardFooter className="border-t pt-4">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center space-x-2">
              <Avatar className="h-6 w-6">
                {post.author_avatar_url ? (
                  <AvatarImage src={post.author_avatar_url} alt={authorName} />
                ) : (
                  <AvatarFallback>{authorInitials}</AvatarFallback>
                )}
              </Avatar>
              <span className="text-sm">{authorName}</span>
            </div>
            <span className="text-xs text-muted-foreground">
              {formattedDate}
            </span>
          </div>
        </CardFooter>
      </Link>
    </Card>
  );
}

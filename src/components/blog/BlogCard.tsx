
import { BlogPost } from '@/types/blog';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface BlogCardProps {
  post: BlogPost;
}

export function BlogCard({ post }: BlogCardProps) {
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
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      {post.featured_image && (
        <div className="relative h-48 w-full overflow-hidden">
          <img
            src={post.featured_image}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <CardHeader className="p-4">
        <Link to={`/blog/${post.slug}`}>
          <h3 className="text-xl font-semibold hover:text-primary transition-colors line-clamp-2">
            {post.title}
          </h3>
        </Link>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="text-muted-foreground line-clamp-3 mb-4">
          {post.excerpt}
        </p>
        {post.category && (
          <div className="mb-2">
            <Badge variant="secondary">
              {post.category}
            </Badge>
          </div>
        )}
      </CardContent>
      <CardFooter className="p-4 border-t flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Avatar className="h-6 w-6">
            {post.author_avatar_url ? (
              <AvatarImage src={post.author_avatar_url} alt={authorName} />
            ) : (
              <AvatarFallback>{authorInitials}</AvatarFallback>
            )}
          </Avatar>
          <span className="text-sm text-muted-foreground">{authorName}</span>
        </div>
        <span className="text-xs text-muted-foreground">{formattedDate}</span>
      </CardFooter>
    </Card>
  );
}

import { BlogPost } from '@/types/blog';
import { formatDistanceToNow } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ChevronLeft, Clock, Share, Facebook, Twitter, Linkedin, Link as LinkIcon, Bookmark, ThumbsUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { useBlogPosts } from '@/hooks/useBlogPosts';
import { toast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface BlogPostContentProps {
  post: BlogPost;
}

export function BlogPostContent({ post }: BlogPostContentProps) {
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [copied, setCopied] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [liked, setLiked] = useState(false);
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

  // Check if post was previously bookmarked
  useEffect(() => {
    const bookmarks = JSON.parse(localStorage.getItem('bookmarkedPosts') || '[]');
    setBookmarked(bookmarks.includes(post.id));
    
    const likes = JSON.parse(localStorage.getItem('likedPosts') || '[]');
    setLiked(likes.includes(post.id));
  }, [post.id]);

  const formattedDate = post.published_at
    ? formatDistanceToNow(new Date(post.published_at), { addSuffix: true })
    : 'Not published';

  // Get author initials for avatar fallback
  const authorInitials = post.author_first_name && post.author_last_name
    ? `${post.author_first_name.charAt(0)}${post.author_last_name.charAt(0)}`
    : 'RT';

  // Get full author name with better fallback
  const authorName = post.author_first_name && post.author_last_name
    ? `${post.author_first_name} ${post.author_last_name}`
    : 'Resulient Team';

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
          toast({
            title: 'Link copied to clipboard',
            description: 'You can now paste the link anywhere',
          });
        })
        .catch((error) => console.log('Error copying to clipboard', error));
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
      .then(() => {
        setCopied(true);
        toast({
          title: 'Link copied to clipboard',
          description: 'You can now paste the link anywhere',
        });
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((error) => console.log('Error copying to clipboard', error));
  };

  const handleBookmark = () => {
    const bookmarks = JSON.parse(localStorage.getItem('bookmarkedPosts') || '[]');
    
    if (bookmarked) {
      // Remove bookmark
      const updatedBookmarks = bookmarks.filter((id: string) => id !== post.id);
      localStorage.setItem('bookmarkedPosts', JSON.stringify(updatedBookmarks));
      setBookmarked(false);
      toast({
        title: 'Bookmark removed',
        description: 'Article has been removed from your bookmarks',
      });
    } else {
      // Add bookmark
      bookmarks.push(post.id);
      localStorage.setItem('bookmarkedPosts', JSON.stringify(bookmarks));
      setBookmarked(true);
      toast({
        title: 'Bookmarked!',
        description: 'Article saved to your bookmarks',
      });
    }
  };

  const handleLike = () => {
    const likes = JSON.parse(localStorage.getItem('likedPosts') || '[]');
    
    if (liked) {
      // Remove like
      const updatedLikes = likes.filter((id: string) => id !== post.id);
      localStorage.setItem('likedPosts', JSON.stringify(updatedLikes));
      setLiked(false);
    } else {
      // Add like
      likes.push(post.id);
      localStorage.setItem('likedPosts', JSON.stringify(likes));
      setLiked(true);
      toast({
        title: 'Thanks for the feedback!',
        description: 'We appreciate you letting us know this content was helpful',
      });
    }
  };

  const handleNewsletterSignup = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Display success message
    toast({
      title: 'Subscription successful!',
      description: 'Thank you for subscribing to our newsletter',
    });
    const form = e.target as HTMLFormElement;
    form.reset();
  };

  // Track reading progress
  const [readingProgress, setReadingProgress] = useState(0);
  
  useEffect(() => {
    const updateReadingProgress = () => {
      const contentElement = document.getElementById('blog-post-content');
      if (contentElement) {
        const currentProgress = 
          window.scrollY / (contentElement.offsetTop + contentElement.offsetHeight - window.innerHeight);
        setReadingProgress(Math.min(Math.max(currentProgress, 0), 1) * 100);
      }
    };
    
    window.addEventListener('scroll', updateReadingProgress);
    return () => window.removeEventListener('scroll', updateReadingProgress);
  }, []);

  return (
    <article className="max-w-full mx-auto relative">
      {/* Reading progress bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 dark:bg-gray-800 z-50">
        <div 
          className="h-1 bg-primary transition-all duration-300 ease-out"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* Back button */}
      <Link to="/blog">
        <Button variant="ghost" className="mb-2 group">
          <ChevronLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Blog
        </Button>
      </Link>

      {/* Featured image with overlay title for mobile */}
      {post.featured_image && (
        <div className="relative h-64 md:h-96 w-full overflow-hidden rounded-lg mb-8">
          <img
            src={post.featured_image}
            alt={post.title}
            className="w-full h-full object-cover transition-transform hover:scale-105 duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:hidden flex items-end">
            <h1 className="text-white text-2xl font-bold p-4">{post.title}</h1>
          </div>
        </div>
      )}

      <div className="mb-8">
        {/* Title (hidden on mobile if there's a featured image) */}
        <h1 className={cn(
          "text-3xl md:text-4xl font-bold tracking-tight mb-4",
          post.featured_image ? "hidden md:block" : "block"
        )}>
          {post.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-muted-foreground">
          {/* Author info */}
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
          
          {/* Category */}
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
          
          {/* Reading time */}
          {post.reading_time && (
            <>
              <Separator orientation="vertical" className="h-4" />
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                <span>{post.reading_time} min read</span>
              </div>
            </>
          )}
          
          {/* Share button */}
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

      {/* Social sharing sidebar */}
      <div className="hidden md:flex flex-col fixed left-4 top-1/3 space-y-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full"
                onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')}
              >
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Share on Facebook</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Share on Facebook</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full"
                onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(post.title)}`, '_blank')}
              >
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Share on Twitter</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Share on Twitter</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full"
                onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank')}
              >
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">Share on LinkedIn</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Share on LinkedIn</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className={cn("rounded-full", copied && "text-green-500")}
                onClick={handleCopyLink}
              >
                <LinkIcon className="h-5 w-5" />
                <span className="sr-only">Copy link</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>{copied ? "Copied!" : "Copy link"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className={cn("rounded-full", bookmarked && "text-yellow-500")}
                onClick={handleBookmark}
              >
                <Bookmark className="h-5 w-5" fill={bookmarked ? "currentColor" : "none"} />
                <span className="sr-only">{bookmarked ? "Remove bookmark" : "Bookmark"}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>{bookmarked ? "Remove bookmark" : "Save article"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className={cn("rounded-full", liked && "text-primary")}
                onClick={handleLike}
              >
                <ThumbsUp className="h-5 w-5" fill={liked ? "currentColor" : "none"} />
                <span className="sr-only">{liked ? "Unlike" : "Like"}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>{liked ? "Remove like" : "Like this article"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Mobile sharing buttons */}
      <div className="flex md:hidden justify-center space-x-4 mb-6">
        <Button 
          variant="outline" 
          size="icon" 
          className="rounded-full"
          onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')}
        >
          <Facebook className="h-4 w-4" />
          <span className="sr-only">Share on Facebook</span>
        </Button>
        
        <Button 
          variant="outline" 
          size="icon" 
          className="rounded-full"
          onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(post.title)}`, '_blank')}
        >
          <Twitter className="h-4 w-4" />
          <span className="sr-only">Share on Twitter</span>
        </Button>
        
        <Button 
          variant="outline" 
          size="icon" 
          className="rounded-full"
          onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank')}
        >
          <Linkedin className="h-4 w-4" />
          <span className="sr-only">Share on LinkedIn</span>
        </Button>
        
        <Button 
          variant="outline" 
          size="icon" 
          className={cn("rounded-full", copied && "text-green-500")}
          onClick={handleCopyLink}
        >
          <LinkIcon className="h-4 w-4" />
          <span className="sr-only">Copy link</span>
        </Button>
        
        <Button 
          variant="outline" 
          size="icon" 
          className={cn("rounded-full", bookmarked && "text-yellow-500")}
          onClick={handleBookmark}
        >
          <Bookmark className="h-4 w-4" fill={bookmarked ? "currentColor" : "none"} />
          <span className="sr-only">{bookmarked ? "Remove bookmark" : "Bookmark"}</span>
        </Button>
      </div>

      {/* Blog content */}
      <div 
        id="blog-post-content"
        className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-semibold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-h4:text-lg prose-p:leading-relaxed prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-img:rounded-lg prose-img:my-8 prose-blockquote:border-l-4 prose-blockquote:border-primary/50 prose-blockquote:pl-4 prose-blockquote:py-1 prose-blockquote:italic space-y-6"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* Like button at end of content */}
      <div className="mt-12 flex justify-center">
        <Button
          variant={liked ? "default" : "outline"}
          size="lg"
          className={cn(
            "rounded-full transition-all",
            liked ? "bg-primary hover:bg-primary/90" : "hover:bg-primary/10"
          )}
          onClick={handleLike}
        >
          <ThumbsUp className="h-5 w-5 mr-2" fill={liked ? "currentColor" : "none"} />
          {liked ? "Liked" : "Was this helpful?"}
        </Button>
      </div>

      {/* Tags section */}
      {post.tags && post.tags.length > 0 && (
        <div className="my-12">
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

      {/* CTAs - free trial and newsletter signup */}
      <div className="my-12 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Free trial CTA */}
        <div className="bg-primary/10 dark:bg-primary/20 border border-primary/20 p-6 rounded-xl">
          <h3 className="text-xl font-bold text-primary mb-4">Optimize Your Resume</h3>
          <p className="mb-4">Get your resume past any ATS system with our AI-powered resume optimization tool.</p>
          <Link to="/resume-scoring">
            <Button className="w-full">Try Free Resume Scanner</Button>
          </Link>
        </div>
        
        {/* Newsletter Signup */}
        <div className="bg-muted p-6 rounded-xl">
          <h3 className="text-xl font-bold mb-4">Get Resume Tips in Your Inbox</h3>
          <p className="mb-4">Join thousands of job seekers getting weekly career advice.</p>
          <form className="space-y-2" onSubmit={handleNewsletterSignup}>
            <input 
              type="email" 
              name="email"
              placeholder="Your email address" 
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              required
            />
            <Button type="submit" className="w-full">Subscribe</Button>
          </form>
        </div>
      </div>

      {/* Author bio */}
      <div className="my-12 p-6 bg-muted rounded-xl">
        <div className="flex items-start">
          <Avatar className="w-16 h-16 mr-4">
            {post.author_avatar_url ? (
              <AvatarImage src={post.author_avatar_url} alt={authorName} />
            ) : (
              <AvatarFallback className="text-xl">{authorInitials}</AvatarFallback>
            )}
          </Avatar>
          <div>
            <h3 className="text-lg font-bold">{authorName}</h3>
            <p className="text-sm text-muted-foreground mb-2">Resume Optimization Expert</p>
            <p>Career advisor and resume specialist with over 40 years of experience helping job seekers land their dream positions through optimized application materials.</p>
          </div>
        </div>
      </div>

      {/* Related Posts Section */}
      {relatedPosts.length > 0 && (
        <div className="my-12">
          <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedPosts.map(relatedPost => (
              <Card key={relatedPost.id} className="overflow-hidden group">
                <Link to={`/blog/${relatedPost.slug}`} className="block h-full">
                  {relatedPost.featured_image && (
                    <div className="h-40 w-full overflow-hidden">
                      <img 
                        src={relatedPost.featured_image} 
                        alt={relatedPost.title}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300" 
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2 text-xs text-muted-foreground">
                      {relatedPost.category && (
                        <Badge variant="secondary" className="text-xs">
                          {relatedPost.category}
                        </Badge>
                      )}
                      {relatedPost.reading_time && (
                        <div className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          <span>{relatedPost.reading_time} min read</span>
                        </div>
                      )}
                    </div>
                    <h3 className="font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {relatedPost.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {relatedPost.excerpt}
                    </p>
                  </div>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      )}
      
      {/* Newsletter Signup - Full width */}
      <div className="my-12 p-8 bg-gradient-to-r from-primary/10 to-primary/20 rounded-lg">
        <div className="max-w-3xl mx-auto text-center">
          <h3 className="text-xl md:text-2xl font-bold mb-2">Stay Updated on Resume Trends</h3>
          <p className="mb-6">Get expert resume advice, interview tips and career insights delivered right to your inbox.</p>
          <form className="flex flex-col sm:flex-row gap-2" onSubmit={handleNewsletterSignup}>
            <input 
              type="email" 
              name="email"
              placeholder="Your email address" 
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:ring-2 focus:ring-primary focus:ring-offset-2"
              required
            />
            <Button type="submit" className="whitespace-nowrap">Subscribe Free</Button>
          </form>
          <p className="text-xs text-muted-foreground mt-2">
            We respect your privacy. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </article>
  );
}

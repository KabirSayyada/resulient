
import { BlogLayout } from '@/components/blog/BlogLayout';
import { BlogCard } from '@/components/blog/BlogCard';
import { useBlogPosts } from '@/hooks/useBlogPosts';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Helmet } from 'react-helmet-async';
import { Search, RefreshCw } from 'lucide-react';
import { initializeBlogContent } from '@/utils/blogInitializer';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuth';

export default function Blog() {
  const { posts, isLoading, error } = useBlogPosts();
  const [searchQuery, setSearchQuery] = useState('');
  const [initializing, setInitializing] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth(); // Get the current user

  const filteredPosts = posts.filter(post => {
    const searchLower = searchQuery.toLowerCase();
    return (
      post.title.toLowerCase().includes(searchLower) ||
      post.excerpt.toLowerCase().includes(searchLower) ||
      (post.category && post.category.toLowerCase().includes(searchLower)) ||
      (post.tags && post.tags.some(tag => tag.toLowerCase().includes(searchLower)))
    );
  });

  // Initialize blog content if no posts are found - Only available to admin
  const handleInitializeBlog = async () => {
    try {
      setInitializing(true);
      const result = await initializeBlogContent();
      
      if (result.categoriesInitialized || result.postsInitialized) {
        toast({
          title: "Blog content initialized",
          description: "Blog posts and categories have been created. Refresh the page to see them.",
          variant: "default",
        });
        
        // Refresh the page after a short delay
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        toast({
          title: "Blog content already exists",
          description: "The blog posts and categories already exist in the database.",
          variant: "default",
        });
      }
    } catch (error) {
      console.error("Error initializing blog content:", error);
      toast({
        title: "Error",
        description: "Failed to initialize blog content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setInitializing(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Blog | Resulient - Resume Optimization & Career Resources</title>
        <meta name="description" content="Read the latest articles about resume optimization, job search strategies, career advice and industry insights from Resulient's experts." />
        <meta name="keywords" content="resume tips, career advice, job search, resume optimization, ATS-friendly resumes" />
        <meta property="og:title" content="Blog | Resulient - Resume Optimization & Career Resources" />
        <meta property="og:description" content="Read the latest articles about resume optimization, job search strategies, career advice and industry insights from Resulient's experts." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://resulient.ai/blog" />
      </Helmet>

      <BlogLayout title="Latest Articles">
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="space-y-3">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-8 w-4/5" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ))}
          </div>
        ) : filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {filteredPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">No articles found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery 
                ? "No articles match your search criteria. Try different keywords."
                : "There are no articles published yet."}
            </p>
            {searchQuery ? (
              <Button 
                variant="outline" 
                onClick={() => setSearchQuery('')}
              >
                Clear Search
              </Button>
            ) : user ? (
              <Button 
                variant="default" 
                onClick={handleInitializeBlog}
                disabled={initializing}
                className="flex items-center gap-2"
              >
                {initializing && <RefreshCw className="h-4 w-4 animate-spin" />}
                Initialize Blog Content
              </Button>
            ) : null}
          </div>
        )}
      </BlogLayout>
    </>
  );
}

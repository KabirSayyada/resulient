
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { createAllResumeEnhancedPosts } from '@/utils/createResumeEnhancedPosts';
import { createAllJobSearchStrategyPosts } from '@/utils/createJobSearchStrategyPosts';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

export function CreateEnhancedBlogPosts() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{
    resumePosts: number;
    jobSearchPosts: number;
  } | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleCreatePosts = async () => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'You must be logged in to create blog posts.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);
      
      // Create resume posts
      const resumePostsCount = await createAllResumeEnhancedPosts(user.id);
      
      // Create job search strategy posts
      const jobSearchPostsCount = await createAllJobSearchStrategyPosts(user.id);
      
      setResults({
        resumePosts: resumePostsCount,
        jobSearchPosts: jobSearchPostsCount
      });
      
      toast({
        title: 'Blog posts created',
        description: `Successfully created ${resumePostsCount} resume posts and ${jobSearchPostsCount} job search strategy posts.`,
      });
    } catch (error) {
      console.error('Error creating blog posts:', error);
      toast({
        title: 'Error creating blog posts',
        description: 'An error occurred while creating the blog posts. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Create Enhanced Blog Posts</h3>
      <p className="text-sm text-muted-foreground">
        Generate 5 high-quality blog posts (3 resume tips posts and 2 job search strategy posts) with optimized content, formatting, and SEO.
      </p>
      
      <Button 
        onClick={handleCreatePosts} 
        disabled={loading}
        className="w-full"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating Blog Posts...
          </>
        ) : (
          'Create Enhanced Blog Posts'
        )}
      </Button>
      
      {results && (
        <div className="bg-muted p-4 rounded-lg mt-4">
          <h4 className="font-medium mb-2">Creation Results:</h4>
          <ul className="space-y-1 text-sm">
            <li>Resume Tips Posts: {results.resumePosts} created</li>
            <li>Job Search Strategy Posts: {results.jobSearchPosts} created</li>
            <li>Total: {results.resumePosts + results.jobSearchPosts} posts</li>
          </ul>
          <p className="text-xs text-muted-foreground mt-2">
            Note: If a post already exists, it won't be recreated.
          </p>
        </div>
      )}
    </div>
  );
}

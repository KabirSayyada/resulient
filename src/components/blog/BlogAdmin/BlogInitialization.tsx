
import { useEffect, useState } from 'react';
import { createAtsBlogPost } from '@/data/createAtsBlogPost';
import { InitializeBlogCategories } from '@/components/blog/InitializeBlogCategories';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Info, Check } from 'lucide-react';
import { useBlogPosts } from '@/hooks/useBlogPosts';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuth';

export function BlogInitialization() {
  const { posts, isLoading } = useBlogPosts();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isInitializing, setIsInitializing] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Check if the ATS blog post exists
  const atsPostExists = posts.some(post => post.slug === 'how-ats-systems-reject-resumes');
  
  useEffect(() => {
    // If posts are loaded and the ATS post exists, mark as initialized
    if (!isLoading && atsPostExists) {
      setIsInitialized(true);
    }
  }, [isLoading, atsPostExists]);

  const handleInitializeBlog = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to initialize blog content.",
        variant: "destructive"
      });
      return;
    }
    
    setIsInitializing(true);
    
    try {
      const success = await createAtsBlogPost(user.id);
      
      if (success) {
        setIsInitialized(true);
        toast({
          title: "Success",
          description: "Blog post has been created successfully!",
          variant: "default"
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to create blog post. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error initializing blog:", error);
      toast({
        title: "Error",
        description: "Failed to create blog post. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsInitializing(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Blog Management</CardTitle>
          <CardDescription>
            Manage your blog categories and create new posts
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!isLoading && posts.length > 0 && (
            <Alert className="mb-4">
              <Info className="h-4 w-4" />
              <AlertTitle>Blog Status</AlertTitle>
              <AlertDescription>
                You have {posts.length} published posts that are visible to search engines and visitors.
              </AlertDescription>
            </Alert>
          )}
          
          {!isInitialized && (
            <div className="mb-6">
              <Card className="bg-muted">
                <CardContent className="pt-6">
                  <h3 className="text-lg font-medium mb-2">Create Sample Blog Post</h3>
                  <p className="text-muted-foreground mb-4">
                    Initialize your blog with a sample post about ATS systems and resume optimization.
                  </p>
                  <Button 
                    onClick={handleInitializeBlog} 
                    disabled={isInitializing || !user}
                  >
                    {isInitializing ? 'Creating...' : 'Create Sample Post'}
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
          
          {isInitialized && (
            <Alert className="mb-6 bg-green-50 dark:bg-green-950 border-green-500">
              <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
              <AlertTitle>Sample Content Created</AlertTitle>
              <AlertDescription>
                Your blog is initialized with a sample post about ATS systems.
              </AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-6">
            <InitializeBlogCategories />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

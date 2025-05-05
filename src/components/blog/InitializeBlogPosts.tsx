
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { createInitialBlogPosts } from '@/data/blogPosts';
import { createAtsBlogPost } from '@/data/createAtsBlogPost';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';

export function InitializeBlogPosts() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const handleInitialize = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to create blog posts.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      
      const success = await createInitialBlogPosts(user.id);
      
      if (success) {
        toast({
          title: "Success!",
          description: "Blog posts have been created and published successfully.",
        });
        setIsComplete(true);
      }
    } catch (error) {
      console.error("Error creating blog posts:", error);
      toast({
        title: "Error",
        description: "Failed to create blog posts. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAtsBlogPost = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to create a blog post.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      
      const success = await createAtsBlogPost(user.id);
      
      if (success) {
        toast({
          title: "Success!",
          description: "The ATS blog post has been created and published successfully.",
        });
      }
    } catch (error) {
      console.error("Error creating ATS blog post:", error);
      toast({
        title: "Error",
        description: "Failed to create the ATS blog post. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Blog Content</CardTitle>
        <CardDescription>
          Add professionally written blog posts about resume optimization and career development.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">
          Create SEO-optimized blog posts covering resume optimization, job searching, and career development topics.
          Each post will be immediately published and visible to your visitors.
        </p>
        <ul className="list-disc pl-5 mb-4 space-y-1 text-sm text-muted-foreground">
          <li>How to Optimize Your Resume for ATS Systems in 2025</li>
          <li>10 Resume Mistakes That Are Costing You Job Interviews</li>
          <li>How to Write a Resume That Stands Out in 2025</li>
          <li>And more...</li>
        </ul>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <Button 
          onClick={handleCreateAtsBlogPost} 
          disabled={isLoading}
          className="w-full"
        >
          {isLoading 
            ? "Creating ATS Blog Post..." 
            : "Create ATS Systems Blog Post"}
        </Button>
        <Button 
          onClick={handleInitialize} 
          disabled={isLoading || isComplete}
          className="w-full"
          variant="outline"
        >
          {isLoading 
            ? "Creating Posts..." 
            : isComplete 
              ? "Posts Created" 
              : "Create All Blog Posts"}
        </Button>
      </CardFooter>
    </Card>
  );
}

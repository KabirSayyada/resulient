
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { createInitialBlogPosts } from '@/data/blogPosts';
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Sample Blog Content</CardTitle>
        <CardDescription>
          Add pre-written blog posts to populate your blog with educational content.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">
          This will create 8 SEO-optimized blog posts covering resume optimization, job searching, and career development topics.
          Each post will be immediately published and visible to your visitors.
        </p>
        <ul className="list-disc pl-5 mb-4 space-y-1 text-sm text-muted-foreground">
          <li>How to Optimize Your Resume for ATS Systems in 2025</li>
          <li>10 Resume Mistakes That Are Costing You Job Interviews</li>
          <li>How to Write a Resume That Stands Out in 2025</li>
          <li>The Ultimate Guide to Using Keywords in Your Resume</li>
          <li>7 Resume Formatting Tips to Increase Your Interview Chances</li>
          <li>How to Write a Cover Letter That Gets You Noticed</li>
          <li>Maximizing LinkedIn for Your Job Search: A Complete Guide</li>
          <li>The Future of Resumes: AI, Automation, and How to Stay Ahead</li>
        </ul>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleInitialize} 
          disabled={isLoading || isComplete}
          className="w-full"
        >
          {isLoading 
            ? "Creating Posts..." 
            : isComplete 
              ? "Posts Created" 
              : "Create Sample Blog Posts"}
        </Button>
      </CardFooter>
    </Card>
  );
}

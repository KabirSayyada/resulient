
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
import { createMultipleBlogPosts } from '@/utils/blogPostCreator';

export function InitializeBlogPosts() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingAts, setIsLoadingAts] = useState(false);
  const [isLoadingNew, setIsLoadingNew] = useState(false);
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
      setIsLoadingAts(true);
      
      const success = await createAtsBlogPost(user.id);
      
      if (success) {
        toast({
          title: "Success!",
          description: "The ATS blog post has been created and published successfully.",
        });
      } else {
        toast({
          title: "Note",
          description: "The ATS blog post already exists.",
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
      setIsLoadingAts(false);
    }
  };

  const handleCreateNewPosts = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to create blog posts.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoadingNew(true);
      
      const createdCount = await createMultipleBlogPosts(user.id);
      
      if (createdCount > 0) {
        toast({
          title: "Success!",
          description: `Created ${createdCount} high-quality blog posts.`,
        });
      } else {
        toast({
          title: "Note",
          description: "No new blog posts were created. They may already exist.",
        });
      }
    } catch (error) {
      console.error("Error creating new blog posts:", error);
      toast({
        title: "Error",
        description: "Failed to create new blog posts. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingNew(false);
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
          <li>Career Development and Professional Growth Guidance</li>
          <li>Interview Preparation and STAR Method Techniques</li>
        </ul>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <Button 
          onClick={handleCreateNewPosts} 
          disabled={isLoadingNew}
          className="w-full"
        >
          {isLoadingNew 
            ? "Creating Professional Blog Posts..." 
            : "Create High-Quality Blog Content"}
        </Button>
        <Button 
          onClick={handleCreateAtsBlogPost} 
          disabled={isLoadingAts}
          className="w-full"
          variant="outline"
        >
          {isLoadingAts 
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
              : "Create Basic Blog Posts"}
        </Button>
      </CardFooter>
    </Card>
  );
}


import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
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
import { createAllResumeTipsPosts } from '@/utils/createResumeTipsPosts';

export function CreateResumeTipsPosts() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const handleCreatePosts = async () => {
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
      
      const createdCount = await createAllResumeTipsPosts(user.id);
      
      if (createdCount > 0) {
        toast({
          title: "Success!",
          description: `Created ${createdCount} high-quality resume tips blog posts.`,
        });
        setIsComplete(true);
      } else {
        toast({
          title: "Note",
          description: "No new resume tips blog posts were created. They may already exist.",
        });
      }
    } catch (error) {
      console.error("Error creating resume tips blog posts:", error);
      toast({
        title: "Error",
        description: "Failed to create resume tips blog posts. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resume Tips Blog Posts</CardTitle>
        <CardDescription>
          Add high-quality, SEO-optimized resume tips content to your blog
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Create a complete set of professionally written blog posts about resume optimization, 
            formatting, and best practices. These SEO-optimized posts include:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
            <li>Tailoring resumes for different industries</li>
            <li>Powerful action verbs for resumes</li>
            <li>Ideal resume length analysis</li>
            <li>Essential resume sections guide</li>
            <li>Chronological vs. functional formats</li>
          </ul>
          
          <div className="p-3 bg-muted rounded-md mt-3">
            <h4 className="text-xs font-semibold mb-2">Posts included:</h4>
            <ul className="list-disc pl-4 text-xs space-y-1 text-muted-foreground">
              <li>Tailoring Your Resume for Different Industries: Expert Tips</li>
              <li>185 Powerful Action Verbs to Transform Your Resume</li>
              <li>The Ideal Resume Length: Data-Driven Analysis for 2025</li>
              <li>Essential Resume Sections: What to Include in 2025</li>
              <li>Chronological vs. Functional Resumes: Choosing the Right Format</li>
            </ul>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleCreatePosts} 
          disabled={isLoading || isComplete}
          className="w-full"
        >
          {isLoading 
            ? "Creating Resume Tips Posts..." 
            : isComplete 
              ? "Resume Tips Posts Created" 
              : "Create Resume Tips Posts"}
        </Button>
      </CardFooter>
    </Card>
  );
}

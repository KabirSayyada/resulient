
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { createInitialBlogCategories } from '@/data/blogCategories';
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

export function InitializeBlogCategories() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const handleInitialize = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to initialize blog categories.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      
      const success = await createInitialBlogCategories();
      
      if (success) {
        toast({
          title: "Success!",
          description: "Initial blog categories have been created.",
        });
        setIsComplete(true);
      }
    } catch (error) {
      console.error("Error initializing blog categories:", error);
      toast({
        title: "Error",
        description: "Failed to initialize blog categories. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Initialize Blog Categories</CardTitle>
        <CardDescription>
          Create standard categories for organizing your blog content.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">
          This will create 5 categories for organizing your blog content:
        </p>
        <ul className="list-disc pl-5 mb-4 space-y-1 text-sm text-muted-foreground">
          <li>Resume Tips</li>
          <li>Resume Formatting</li>
          <li>Job Search</li>
          <li>Career Trends</li>
          <li>Interview Preparation</li>
        </ul>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleInitialize} 
          disabled={isLoading || isComplete}
          className="w-full"
        >
          {isLoading 
            ? "Creating Categories..." 
            : isComplete 
              ? "Categories Created" 
              : "Initialize Categories"}
        </Button>
      </CardFooter>
    </Card>
  );
}

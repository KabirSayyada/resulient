
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { initializeBlogContent } from "@/utils/blogInitializer";
import { createAtsBlogPost } from "@/data/createAtsBlogPost";
import { createCareerBlogPost } from "@/utils/createCareerBlogPost";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";

export function BlogInitialization() {
  const [isLoadingDefault, setIsLoadingDefault] = useState(false);
  const [isLoadingAts, setIsLoadingAts] = useState(false);
  const [isLoadingCareer, setIsLoadingCareer] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleInitializeBlog = async () => {
    setIsLoadingDefault(true);
    try {
      await initializeBlogContent();
      toast({
        title: "Success",
        description: "Blog initialized with default data",
      });
    } catch (error) {
      console.error("Error initializing blog data:", error);
      toast({
        title: "Error",
        description: "Failed to initialize blog data",
        variant: "destructive",
      });
    } finally {
      setIsLoadingDefault(false);
    }
  };

  const handleCreateAtsBlogPost = async () => {
    setIsLoadingAts(true);
    try {
      // Pass the user ID from the auth context, or a fallback empty string if user is not available
      const result = await createAtsBlogPost(user?.id || "");
      if (result) {
        toast({
          title: "Success",
          description: "ATS blog post created successfully",
        });
      } else {
        toast({
          title: "Note",
          description: "ATS blog post already exists",
        });
      }
    } catch (error) {
      console.error("Error creating ATS blog post:", error);
      toast({
        title: "Error",
        description: "Failed to create ATS blog post",
        variant: "destructive",
      });
    } finally {
      setIsLoadingAts(false);
    }
  };

  const handleCreateCareerBlogPost = async () => {
    setIsLoadingCareer(true);
    try {
      // Since createCareerBlogPost doesn't require a user_id parameter based on its implementation
      const result = await createCareerBlogPost();
      if (result) {
        toast({
          title: "Success",
          description: "Career development blog post created successfully",
        });
      } else {
        toast({
          title: "Note",
          description: "Career development blog post already exists",
        });
      }
    } catch (error) {
      console.error("Error creating career blog post:", error);
      toast({
        title: "Error",
        description: "Failed to create career blog post",
        variant: "destructive",
      });
    } finally {
      setIsLoadingCareer(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Blog Management</CardTitle>
        <CardDescription>
          Initialize your blog with sample data or create individual sample posts
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground mb-2">
            Create initial blog categories and demo data
          </p>
          <Button 
            onClick={handleInitializeBlog} 
            disabled={isLoadingDefault}
            className="w-full"
          >
            {isLoadingDefault ? "Initializing..." : "Initialize Blog"}
          </Button>
        </div>
        
        <div>
          <p className="text-sm text-muted-foreground mb-2">
            Create sample ATS blog post
          </p>
          <Button 
            onClick={handleCreateAtsBlogPost} 
            disabled={isLoadingAts}
            variant="outline"
            className="w-full"
          >
            {isLoadingAts ? "Creating..." : "Create ATS Sample Post"}
          </Button>
        </div>
        
        <div>
          <p className="text-sm text-muted-foreground mb-2">
            Create career development blog post
          </p>
          <Button 
            onClick={handleCreateCareerBlogPost} 
            disabled={isLoadingCareer}
            variant="outline"
            className="w-full"
          >
            {isLoadingCareer ? "Creating..." : "Create Career Sample Post"}
          </Button>
        </div>
      </CardContent>
      <CardFooter>
        <p className="text-xs text-muted-foreground">
          Note: Initializing will not overwrite existing data
        </p>
      </CardFooter>
    </Card>
  );
}
